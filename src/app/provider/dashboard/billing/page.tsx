import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Provider } from "@/lib/supabase/types";

function trialDaysLeft(trialStart: string | null): number | null {
  if (!trialStart) return null;
  const end = new Date(trialStart).getTime() + 30 * 24 * 60 * 60 * 1000;
  const left = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
  return left > 0 ? left : 0;
}

const PLAN_PRICES = {
  Basic:    { monthly: 29, annual: 289 },
  Standard: { monthly: 59, annual: 589 },
  Featured: { monthly: 99, annual: 989 },
} as const;

const PLAN_FEATURES: Record<string, string[]> = {
  Basic: [
    "Listed in Utah service directory",
    "Business profile with description",
    "Phone & website contact buttons",
  ],
  Standard: [
    "Everything in Basic",
    "Profile photo",
    "Up to 3 customer testimonials",
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

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/provider/login");

  const { data } = await supabase
    .from("providers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) redirect("/provider/signup");

  const p = data as Provider;
  const daysLeft = trialDaysLeft(p.trial_start);
  const prices = PLAN_PRICES[p.tier as keyof typeof PLAN_PRICES];
  const features = PLAN_FEATURES[p.tier] ?? [];

  const trialEnd = p.trial_start
    ? new Date(new Date(p.trial_start).getTime() + 30 * 24 * 60 * 60 * 1000)
    : null;

  return (
    <main className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Billing &amp; Plan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your subscription and plan.
        </p>
      </div>

      {/* Current plan */}
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
              <p className="text-2xl font-extrabold text-[#111827]">
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
            🎯 Founding Member: 50% off applied for first 3 months after trial
          </p>
        )}
      </div>

      {/* Trial status */}
      {daysLeft !== null && (
        <div className={`rounded-2xl border p-5 mb-5 ${
          daysLeft > 5 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
        }`}>
          <p className="font-semibold text-[#111827] mb-0.5">
            {daysLeft > 0
              ? `Free trial — ${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`
              : "Free trial ended"}
          </p>
          <p className="text-sm text-gray-600">
            {trialEnd && daysLeft > 0
              ? `Trial ends on ${trialEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. No credit card required until then.`
              : "Add a payment method to keep your listing active."}
          </p>
        </div>
      )}

      {/* Stripe portal placeholder */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <p className="font-semibold text-[#111827] mb-1">Payment &amp; Subscription</p>
        <p className="text-sm text-gray-500 mb-4">
          Billing management launches when your trial ends. You&apos;ll receive an email
          with a secure link to add your payment method.
        </p>
        <span className="inline-block text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
          Coming soon
        </span>
      </div>

      {/* Upgrade CTA */}
      {p.tier !== "Featured" && (
        <div className="bg-[#111827] rounded-2xl p-6 text-white">
          <p className="font-bold mb-1">
            {p.tier === "Basic" ? "Upgrade for more visibility" : "Upgrade to Featured"}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            {p.tier === "Basic"
              ? "Add a profile photo, testimonials, and a First-Time Offer badge with Standard."
              : "Get listed first in all search results and unlock analytics with Featured."}
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-[#1B4FD8] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-colors"
          >
            View pricing →
          </Link>
        </div>
      )}
    </main>
  );
}
