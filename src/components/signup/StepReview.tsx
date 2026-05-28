"use client";

import { useState } from "react";
import { joinWaitlist } from "@/lib/actions/signup";

type Plan    = "basic" | "standard" | "featured";
type Billing = "monthly" | "annual";

interface Props {
  plan: Plan;
  billing: Billing;
  businessName: string;
  category: string;
  city: string;
  phone: string;
  website: string;
  description: string;
  contactName: string;
  email: string;
  submitting: boolean;
  submitError: string | null;
  waitlistNeeded: boolean;
  onSubmit: () => void;
  onBack: () => void;
  onEditStep: (step: number) => void;
}

const PLAN_LABELS = { basic: "Basic", standard: "Standard", featured: "Featured" } as const;
const PRICES: Record<Plan, { monthly: number; annual: number; total: number }> = {
  basic:    { monthly: 29, annual: 24, total: 289 },
  standard: { monthly: 59, annual: 49, total: 589 },
  featured: { monthly: 99, annual: 82, total: 989 },
};

function SectionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-sm text-gray-400 w-24 shrink-0">{label}</span>
      <span className="text-sm text-[#111827] font-medium">{value || "—"}</span>
    </div>
  );
}

function EditLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-[#1B4FD8] hover:underline font-medium"
    >
      Edit
    </button>
  );
}

export function StepReview({
  plan, billing, businessName, category, city, phone, website, description,
  contactName, email, submitting, submitError, waitlistNeeded,
  onSubmit, onBack, onEditStep,
}: Props) {
  const prices = PRICES[plan];
  const price  = billing === "monthly" ? prices.monthly : prices.annual;

  const [joining,     setJoining]     = useState(false);
  const [joinedWL,    setJoinedWL]    = useState(false);
  const [joinError,   setJoinError]   = useState<string | null>(null);

  async function handleJoinWaitlist() {
    setJoining(true);
    setJoinError(null);
    const res = await joinWaitlist({
      businessName,
      email,
      city,
      category,
      tier: plan === "standard" ? "Standard" : "Featured",
    });
    setJoining(false);
    if (res.ok) setJoinedWL(true);
    else setJoinError(res.error);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#111827] mb-1">Review your listing</h2>
      <p className="text-sm text-gray-500 mb-7">
        Everything look right? You can edit any section before submitting.
      </p>

      {/* Plan */}
      <div className="bg-[#F8F9FA] rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Plan</p>
          <EditLink onClick={() => onEditStep(1)} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-[#111827] text-lg">{PLAN_LABELS[plan]}</span>
          <span className="text-gray-400 text-sm ml-2">
            ${price}/mo{billing === "annual" ? ` (billed $${prices.total}/yr)` : ""}
          </span>
        </div>
        <p className="text-xs text-green-600 mt-1 font-medium">
          30-day free trial · no credit card required
        </p>
      </div>

      {/* Business */}
      <div className="bg-[#F8F9FA] rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Business</p>
          <EditLink onClick={() => onEditStep(2)} />
        </div>
        <div className="space-y-2">
          <SectionRow label="Name"     value={businessName} />
          <SectionRow label="Category" value={category} />
          <SectionRow label="City"     value={city ? `${city}, UT` : ""} />
          {phone   && <SectionRow label="Phone"   value={phone} />}
          {website && <SectionRow label="Website" value={website} />}
          {description && (
            <div className="flex gap-3 pt-1">
              <span className="text-sm text-gray-400 w-24 shrink-0">About</span>
              <span className="text-sm text-[#111827] line-clamp-3">{description}</span>
            </div>
          )}
        </div>
      </div>

      {/* Account */}
      <div className="bg-[#F8F9FA] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Account</p>
          <EditLink onClick={() => onEditStep(3)} />
        </div>
        <div className="space-y-2">
          <SectionRow label="Name"  value={contactName} />
          <SectionRow label="Email" value={email} />
          <SectionRow label="Password" value="••••••••" />
        </div>
      </div>

      {/* Waitlist scenario */}
      {waitlistNeeded && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-5">
          <p className="font-semibold text-[#111827] mb-1 text-sm">
            {PLAN_LABELS[plan]} spots in {city} · {category} are full
          </p>
          <p className="text-sm text-gray-600 mb-4">
            We limit {PLAN_LABELS[plan]} to 3 listings per city &amp; category to
            protect quality. Join the waitlist and we&apos;ll email you when a spot opens.
          </p>
          {joinedWL ? (
            <p className="text-sm font-semibold text-green-700">
              ✓ You&apos;re on the waitlist. We&apos;ll be in touch.
            </p>
          ) : (
            <>
              <button
                type="button"
                onClick={handleJoinWaitlist}
                disabled={joining}
                className="text-sm font-semibold bg-[#111827] text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60 mr-3"
              >
                {joining ? "Joining…" : "Join Waitlist"}
              </button>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="text-sm font-semibold text-[#1B4FD8] hover:underline"
              >
                Choose a different plan
              </button>
              {joinError && <p className="text-xs text-red-500 mt-2">{joinError}</p>}
            </>
          )}
        </div>
      )}

      {/* Generic error */}
      {submitError && !waitlistNeeded && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      {/* Submit */}
      {!waitlistNeeded && (
        <>
          <p className="text-xs text-gray-400 mb-4 text-center">
            By submitting you agree to our{" "}
            <a href="/terms" className="hover:underline text-gray-500">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" className="hover:underline text-gray-500">Privacy Policy</a>.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={submitting}
              className="flex-1 bg-[#1B4FD8] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                "Submit Listing →"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
