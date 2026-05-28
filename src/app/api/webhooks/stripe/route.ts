import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { stripe, getTierFromPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Tier from plan string stored in session metadata
function tierFromPlan(plan?: string): "Basic" | "Standard" | "Featured" {
  if (plan === "standard") return "Standard";
  if (plan === "featured") return "Featured";
  return "Basic";
}

// Safe accessor for subscription fields — the Stripe SDK types for newer API
// versions wrap some fields differently, but the actual API response always
// includes current_period_end and items.data[0].price.id at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function subFields(sub: any) {
  return {
    priceId:    sub?.items?.data?.[0]?.price?.id  as string | undefined,
    periodEnd:  sub?.current_period_end            as number | undefined,
    status:     sub?.status                        as string | undefined,
  };
}

export async function POST(request: NextRequest) {
  const body      = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Signature verification failed";
    console.error("[Stripe webhook] Signature error:", msg);
    return new Response(`Webhook error: ${msg}`, { status: 400 });
  }

  const sb = createAdminClient();

  try {
    switch (event.type) {

      // ── checkout.session.completed ───────────────────────────
      // Tier comes from session metadata (set when creating the session),
      // so we never need to call stripe.subscriptions.retrieve().
      // next_billing_date is set by the subscription.updated event that
      // Stripe fires immediately after.
      case "checkout.session.completed": {
        const session    = event.data.object as Stripe.Checkout.Session;
        const providerId = session.client_reference_id ?? session.metadata?.provider_id;
        if (!providerId || !session.subscription) break;

        const tier = tierFromPlan(session.metadata?.plan);

        await sb.from("providers").update({
          stripe_customer_id:     session.customer    as string,
          stripe_subscription_id: session.subscription as string,
          billing_active: true,
          tier,
        }).eq("id", providerId);

        console.log(`[Stripe webhook] checkout.completed — provider ${providerId} → ${tier}`);
        break;
      }

      // ── customer.subscription.updated ────────────────────────
      case "customer.subscription.updated": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw      = event.data.object as any;
        const { priceId, periodEnd, status } = subFields(raw);
        const tier     = getTierFromPriceId(priceId ?? "");
        const isActive = status === "active" || status === "trialing";

        const update: Record<string, unknown> = { billing_active: isActive };
        if (tier)      update.tier              = tier;
        if (periodEnd) update.next_billing_date = new Date(periodEnd * 1000).toISOString();

        await sb.from("providers").update(update)
          .eq("stripe_subscription_id", raw.id as string);

        console.log(`[Stripe webhook] subscription.updated — ${raw.id} → ${status}`);
        break;
      }

      // ── customer.subscription.deleted ────────────────────────
      case "customer.subscription.deleted": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = event.data.object as any;

        await sb.from("providers").update({
          billing_active:         false,
          stripe_subscription_id: null,
          next_billing_date:      null,
        }).eq("stripe_subscription_id", raw.id as string);

        console.log(`[Stripe webhook] subscription.deleted — ${raw.id}`);
        break;
      }

      // ── invoice.payment_failed ───────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        await sb.from("providers").update({ billing_active: false })
          .eq("stripe_customer_id", invoice.customer as string);

        console.log(`[Stripe webhook] invoice.payment_failed — customer ${invoice.customer}`);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Stripe webhook] Handler error on ${event.type}:`, msg);
    return new Response(`Handler error: ${msg}`, { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
