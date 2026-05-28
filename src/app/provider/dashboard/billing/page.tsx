import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { trialDaysRemaining } from "@/lib/stripe";
import { BillingActions } from "@/components/dashboard/BillingActions";
import type { Provider } from "@/lib/supabase/types";

interface PageProps {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}

const PLAN_FEATURES: Record<string, string[]> = {
  Basic: [
    "Listed in Utah service directory",
    "Business profile with description",
    "Phone & website contact buttons",
  ],
  Standard: [
    "Everything in Basic",
    "Profile photo + up to 3 testimonials",
    "First-Time Customer Offer badge",
    "Standard badge in search results",
  ],
  Featured: [
    "Everything in Standard",
    "Listed FIRST in all search results",
    "Gold Featured badge",
    "Analytics dashboard",
  ],
};

const PLAN_PRICES: Record<string, { monthly: number; annual: number }> = {
  Basic:    { monthly: 29, annual: 289 },
  Standard: { monthly: 59, annual: 589 },
  Featured: { monthly: 99, annual: 989 },
};

export default async function BillingPage({ searchParams }: PageProps) {
  const { success, canceled } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/provider/login");

  const { data } = await supabase
    .from("providers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) redirect("/provider/signup");

  const p         = data as Provider;
  const daysLeft  = trialDaysRemaining(p.trial_start);
  const prices    = PLAN_PRICES[p.tier];
  const features  = PLAN_FEATURES[p.tier] ?? [];

  const trialEnd = p.trial_start
    ? new Date(new Date(p.trial_start).getTime() + 30 * 24 * 60 * 60 * 1000)
    : null;

  const nextBillingDate = p.next_billing_date
    ? new Date(p.next_billing_date)
    : null;

  return (
    <main className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Billing &amp; Plan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your subscription and payment details.
        </p>
      </div>

      {/* ── Post-checkout feedback ──────────────────── */}
      {success === "true" && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold text-green-800 mb-0.5">Subscription activated!</p>
            <p className="text-sm text-green-700">
              You&apos;re all set. Your listing will remain active as long as your
              subscription is current.
            </p>
          </div>
        </div>
      )}

      {canceled === "true" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <p className="text-sm text-amber-800">
            Checkout canceled — no charge was made. You can activate your
            subscription whenever you&apos;re ready.
          </p>
        </div>
      )}

      {/* ── Current plan ───────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              Current Plan
            </p>
            <p className="text-2xl font-extrabold text-[#111827]">{p.tier}</p>
          </div>
          {prices && (
            <div className="text-right">
              <p className="text-xl font-extrabold text-[#111827]">
                ${prices.monthly}
                <span className="text-sm font-normal text-gray-400">/mo</span>
              </p>
              <p className="text-xs text-gray-400">or ${prices.annual}/yr</p>
            </div>
          )}
        </div>

        <ul className="space-y-2 mb-4">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-[#1B4FD8] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {p.founding_member && (
          <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg font-medium">
            🎯 Founding Member — 50% off your first 3 months after trial
          </p>
        )}
      </div>

      {/* ── Subscription status ─────────────────────── */}
      {p.billing_active ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <p className="font-semibold text-[#111827] text-sm">Subscription active</p>
          </div>
          {nextBillingDate && (
            <p className="text-sm text-gray-600 ml-4">
              Next billing date:{" "}
              <span className="font-medium">
                {nextBillingDate.toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </span>
            </p>
          )}
        </div>
      ) : daysLeft > 0 ? (
        <div className={`rounded-2xl border p-5 mb-5 ${daysLeft > 7 ? "bg-blue-50 border-blue-100" : "bg-amber-50 border-amber-200"}`}>
          <p className="font-semibold text-[#111827] text-sm mb-0.5">
            Free trial — {daysLeft} day{daysLeft === 1 ? "" : "s"} remaining
          </p>
          <p className="text-sm text-gray-600">
            {trialEnd && (
              <>
                Trial ends{" "}
                {trialEnd.toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
                . Activate now to keep your listing running without interruption.
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-5">
          <p className="font-semibold text-red-700 text-sm mb-0.5">
            Trial ended — listing paused
          </p>
          <p className="text-sm text-gray-600">
            Activate a subscription to make your listing visible again.
          </p>
        </div>
      )}

      {/* ── Billing actions ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <p className="font-semibold text-[#111827] mb-5">
          {p.billing_active ? "Subscription management" : "Activate your subscription"}
        </p>
        <BillingActions
          currentTier={p.tier}
          isActive={p.billing_active}
          foundingMember={p.founding_member}
          hasStripeCustomer={!!p.stripe_customer_id}
        />
      </div>

      {/* ── Upgrade nudge (non-Featured only) ──────── */}
      {p.tier !== "Featured" && !p.billing_active && (
        <div className="bg-[#111827] rounded-2xl p-5 text-white">
          <p className="font-bold mb-1 text-sm">
            {p.tier === "Basic" ? "Want more visibility?" : "Get listed first in every search"}
          </p>
          <p className="text-xs text-gray-400 mb-3">
            {p.tier === "Basic"
              ? "Upgrade to Standard for a profile photo, testimonials, and a First-Time Offer badge."
              : "Upgrade to Featured to appear first in all search results and unlock analytics."}
          </p>
          <Link
            href="/pricing"
            className="text-xs font-semibold text-[#1B4FD8] hover:underline"
          >
            Compare plans →
          </Link>
        </div>
      )}
    </main>
  );
}
