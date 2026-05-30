"use client";

import { useState } from "react";
import {
  createCheckoutSession,
  createBillingPortalSession,
} from "@/lib/actions/billing";

type Plan    = "basic" | "standard" | "featured";
type Billing = "monthly" | "annual";

interface Props {
  currentTier:     string;
  isActive:        boolean;
  foundingMember:  boolean;
  hasStripeCustomer: boolean;
}

const PLAN_PRICES: Record<Plan, { monthly: number; annual: number; totalAnnual: number }> = {
  basic:    { monthly: 29, annual: 24, totalAnnual: 289 },
  standard: { monthly: 59, annual: 49, totalAnnual: 589 },
  featured: { monthly: 99, annual: 82, totalAnnual: 989 },
};

const TIER_TO_PLAN: Record<string, Plan> = {
  Basic: "basic", Standard: "standard", Featured: "featured",
};

export function BillingActions({
  currentTier,
  isActive,
  foundingMember,
  hasStripeCustomer,
}: Props) {
  const [plan,     setPlan]     = useState<Plan>(TIER_TO_PLAN[currentTier] ?? "basic");
  const [billing,  setBilling]  = useState<Billing>("monthly");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleActivate() {
    setLoading(true);
    setError(null);
    const result = await createCheckoutSession(plan, billing);
    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      window.location.href = result.url;
    }
  }

  async function handleManage() {
    setLoading(true);
    setError(null);
    const result = await createBillingPortalSession();
    if ("error" in result) {
      setError(result.error);
      setLoading(false);
    } else {
      window.location.href = result.url;
    }
  }

  if (isActive) {
    return (
      <div className="space-y-3">
        <button
          onClick={handleManage}
          disabled={loading}
          className="w-full bg-[#1B4FD8] text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Opening portal…
            </>
          ) : (
            "Manage subscription →"
          )}
        </button>
        <p className="text-xs text-gray-400 text-center">
          Update payment method, view invoices, or cancel — all in the Stripe portal.
        </p>
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      </div>
    );
  }

  // Not yet subscribed — show plan selector
  const prices = PLAN_PRICES[plan];
  const price  = billing === "monthly" ? prices.monthly : prices.annual;

  return (
    <div className="space-y-5">
      {/* Founding member notice */}
      {foundingMember && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          <span className="font-bold">🎯 Founding Member:</span> 50% off automatically applied
          to your first 3 months after the trial.
          {!process.env.NEXT_PUBLIC_STRIPE_FOUNDING_CONFIGURED && (
            <span className="text-amber-600 block text-xs mt-0.5">
              (Requires STRIPE_FOUNDING_COUPON_ID to be configured by admin)
            </span>
          )}
        </div>
      )}

      {/* Plan selector */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Plan</p>
        <div className="grid grid-cols-3 gap-2">
          {(["basic", "standard", "featured"] as Plan[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlan(p)}
              className={`min-h-[44px] rounded-xl text-sm font-semibold border-2 transition-colors capitalize ${
                plan === p
                  ? "border-[#1B4FD8] bg-blue-50 text-[#1B4FD8]"
                  : "border-gray-100 text-gray-500 hover:border-gray-200"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-3">
        <span
          className={`text-sm cursor-pointer select-none ${billing === "monthly" ? "font-semibold text-[#111827]" : "text-gray-400"}`}
          onClick={() => setBilling("monthly")}
        >
          Monthly
        </span>
        {/* Enlarged tap area around small toggle */}
        <button
          type="button"
          onClick={() => setBilling(billing === "monthly" ? "annual" : "monthly")}
          className="flex items-center justify-center p-2.5 -m-2.5 focus:outline-none"
          aria-label="Toggle billing period"
        >
          <span className={`relative flex w-10 h-5 rounded-full transition-colors ${billing === "annual" ? "bg-[#1B4FD8]" : "bg-gray-200"}`}>
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${billing === "annual" ? "translate-x-5" : ""}`} />
          </span>
        </button>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-sm cursor-pointer ${billing === "annual" ? "font-semibold text-[#111827]" : "text-gray-400"}`}
            onClick={() => setBilling("annual")}
          >
            Annual
          </span>
          <span className="text-xs font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
            Save 17%
          </span>
        </div>
      </div>

      {/* Price display */}
      <div className="bg-[#F8F9FA] rounded-xl px-4 py-3 flex items-baseline justify-between">
        <span className="text-sm text-gray-500">
          {plan.charAt(0).toUpperCase() + plan.slice(1)} · {billing}
        </span>
        <div className="text-right">
          <span className="text-xl font-extrabold text-[#111827]">${price}</span>
          <span className="text-gray-400 text-sm">/mo</span>
          {billing === "annual" && (
            <span className="text-xs text-gray-400 block">
              billed ${prices.totalAnnual}/yr
            </span>
          )}
        </div>
      </div>

      {/* Activate button */}
      <button
        onClick={handleActivate}
        disabled={loading}
        className="w-full bg-[#1B4FD8] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Redirecting to Stripe…
          </>
        ) : (
          "Activate subscription →"
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Secured by Stripe · Cancel anytime · No contracts
      </p>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}
    </div>
  );
}
