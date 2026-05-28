"use server";

import { createClient } from "@/lib/supabase/server";
import { getStripe, getPriceId, trialDaysRemaining } from "@/lib/stripe";
import type { Provider } from "@/lib/supabase/types";

type Plan    = "basic" | "standard" | "featured";
type Billing = "monthly" | "annual";

async function getProvider(): Promise<Provider | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("providers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data as Provider | null;
}

// ─── Create Stripe Checkout Session ──────────────────────────

export async function createCheckoutSession(
  plan: Plan,
  billing: Billing
): Promise<{ url: string } | { error: string }> {
  const provider = await getProvider();
  if (!provider) return { error: "Not authenticated." };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const priceId  = getPriceId(plan, billing);
  const trialDays = trialDaysRemaining(provider.trial_start);

  // Apply founding member coupon if configured
  const foundingCouponId = process.env.STRIPE_FOUNDING_COUPON_ID?.trim() || null;
  const applyDiscount    = provider.founding_member && !!foundingCouponId;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_collection: "always", // collect card even during trial
      ...(provider.stripe_customer_id
        ? { customer: provider.stripe_customer_id }
        : { customer_email: provider.email }),

      line_items: [{ price: priceId, quantity: 1 }],

      subscription_data: {
        ...(trialDays > 0 && { trial_period_days: trialDays }),
        metadata: { provider_id: provider.id },
      },
      // Apply founding member 50% off for 3 months
      ...(applyDiscount && {
        discounts: [{ coupon: foundingCouponId! }],
      }),

      client_reference_id: provider.id,
      // Store plan + billing in metadata so the webhook doesn't need a subscription lookup
      metadata: { provider_id: provider.id, plan, billing },

      success_url: `${siteUrl}/provider/dashboard/billing?success=true`,
      cancel_url:  `${siteUrl}/provider/dashboard/billing?canceled=true`,
    });

    return { url: session.url! };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create checkout session.";
    return { error: msg };
  }
}

// ─── Create Stripe Billing Portal Session ────────────────────

export async function createBillingPortalSession(): Promise<
  { url: string } | { error: string }
> {
  const provider = await getProvider();
  if (!provider) return { error: "Not authenticated." };
  if (!provider.stripe_customer_id)
    return { error: "No billing account found. Activate a subscription first." };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer:   provider.stripe_customer_id,
      return_url: `${siteUrl}/provider/dashboard/billing`,
    });
    return { url: session.url };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to open billing portal.";
    return { error: msg };
  }
}
