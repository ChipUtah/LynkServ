import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: "2026-05-27.dahlia" as any,
});

// ─── Price ID → Tier ──────────────────────────────────────────

const PRICE_TIER_MAP: Record<string, "Basic" | "Standard" | "Featured"> = {
  price_1S4XxGGq5o2oFHPFnjgprCMo: "Basic",     // Basic Monthly
  price_1TZ1oaGq5o2oFHPFaELrN1S6: "Basic",     // Basic Annual
  price_1S4XwkGq5o2oFHPFdrHTDOXZ: "Standard",  // Standard Monthly
  price_1TZ1p4Gq5o2oFHPFngerNZC8: "Standard",  // Standard Annual
  price_1S4XwDGq5o2oFHPFX6paRfyA: "Featured",  // Featured Monthly
  price_1TZ1rDGq5o2oFHPF5wmcc9Eu: "Featured",  // Featured Annual
};

export function getTierFromPriceId(
  priceId: string
): "Basic" | "Standard" | "Featured" | null {
  return PRICE_TIER_MAP[priceId] ?? null;
}

// ─── Plan → Price ID ──────────────────────────────────────────

type Plan    = "basic" | "standard" | "featured";
type Billing = "monthly" | "annual";

export function getPriceId(plan: Plan, billing: Billing): string {
  const map: Record<Plan, Record<Billing, string>> = {
    basic:    { monthly: "price_1S4XxGGq5o2oFHPFnjgprCMo", annual: "price_1TZ1oaGq5o2oFHPFaELrN1S6" },
    standard: { monthly: "price_1S4XwkGq5o2oFHPFdrHTDOXZ", annual: "price_1TZ1p4Gq5o2oFHPFngerNZC8" },
    featured: { monthly: "price_1S4XwDGq5o2oFHPFX6paRfyA", annual: "price_1TZ1rDGq5o2oFHPF5wmcc9Eu" },
  };
  return map[plan][billing];
}

// ─── Trial days remaining ─────────────────────────────────────

export function trialDaysRemaining(trialStart: string | null): number {
  if (!trialStart) return 0;
  const end  = new Date(trialStart).getTime() + 30 * 24 * 60 * 60 * 1000;
  const left = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(0, left);
}
