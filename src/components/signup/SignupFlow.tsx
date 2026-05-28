"use client";

import { Fragment, useState } from "react";
import { signupProvider } from "@/lib/actions/signup";
import { StepPlan }     from "./StepPlan";
import { StepBusiness } from "./StepBusiness";
import { StepAccount }  from "./StepAccount";
import { StepReview }   from "./StepReview";
import { SuccessScreen } from "./SuccessScreen";
import type { BusinessData } from "./StepBusiness";
import type { AccountData }  from "./StepAccount";

type Plan    = "basic" | "standard" | "featured";
type Billing = "monthly" | "annual";

interface Props {
  initialPlan:    Plan;
  initialBilling: Billing;
}

const STEP_LABELS = ["Plan", "Business", "Account", "Review"] as const;

export function SignupFlow({ initialPlan, initialBilling }: Props) {
  const [step, setStep] = useState(1);

  // Form data
  const [plan,    setPlan]    = useState<Plan>(initialPlan);
  const [billing, setBilling] = useState<Billing>(initialBilling);
  const [business, setBusiness] = useState<BusinessData>({
    businessName: "", category: "", city: "", phone: "", website: "", description: "",
  });
  const [account, setAccount] = useState<AccountData>({
    contactName: "", email: "", password: "",
  });

  // Submission state
  const [submitting,     setSubmitting]     = useState(false);
  const [submitError,    setSubmitError]    = useState<string | null>(null);
  const [waitlistNeeded, setWaitlistNeeded] = useState(false);
  const [success,        setSuccess]        = useState<{ foundingMember: boolean } | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    setWaitlistNeeded(false);

    const result = await signupProvider({
      plan, billing,
      ...business,
      ...account,
    });

    setSubmitting(false);

    if (result.ok) {
      setSuccess({ foundingMember: result.foundingMember });
    } else {
      setSubmitError(result.error);
      if (result.waitlist) setWaitlistNeeded(true);
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10 max-w-xl mx-auto">
        <SuccessScreen
          businessName={business.businessName}
          email={account.email}
          foundingMember={success.foundingMember}
        />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* ── Step indicator ─────────────────────────────── */}
      <div className="flex items-center justify-center mb-8">
        {STEP_LABELS.map((label, i) => {
          const n        = i + 1;
          const isDone   = step > n;
          const isCurrent = step === n;
          return (
            <Fragment key={label}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isDone || isCurrent
                      ? "bg-[#1B4FD8] text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDone ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    n
                  )}
                </div>
                <span
                  className={`text-xs mt-1 font-medium transition-colors ${
                    isCurrent ? "text-[#1B4FD8]" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>

              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`h-0.5 w-10 mx-1 mb-5 transition-colors ${
                    step > n ? "bg-[#1B4FD8]" : "bg-gray-100"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>

      {/* ── Step content ───────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-7 py-8">
        {step === 1 && (
          <StepPlan
            plan={plan}
            billing={billing}
            onPlanChange={setPlan}
            onBillingChange={setBilling}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepBusiness
            data={business}
            onChange={setBusiness}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepAccount
            data={account}
            onChange={setAccount}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <StepReview
            plan={plan}
            billing={billing}
            {...business}
            {...account}
            submitting={submitting}
            submitError={submitError}
            waitlistNeeded={waitlistNeeded}
            onSubmit={handleSubmit}
            onBack={() => setStep(3)}
            onEditStep={(s) => setStep(s)}
          />
        )}
      </div>
    </div>
  );
}
