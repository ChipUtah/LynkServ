import type { Metadata } from "next";
import { SignupFlow } from "@/components/signup/SignupFlow";

export const metadata: Metadata = {
  title: "List Your Business — LynkServ",
  description:
    "Join LynkServ and get found by Utah homeowners. 30-day free trial, no credit card required.",
};

interface PageProps {
  searchParams: Promise<{ plan?: string; billing?: string }>;
}

export default async function ProviderSignupPage({ searchParams }: PageProps) {
  const { plan: rawPlan, billing: rawBilling } = await searchParams;

  const plan =
    rawPlan === "standard" || rawPlan === "featured" ? rawPlan : "basic";
  const billing = rawBilling === "annual" ? "annual" : "monthly";

  return (
    <main className="min-h-screen bg-[#F8F9FA] px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">
          List your business on LynkServ
        </h1>
        <p className="text-gray-500 text-sm">
          30 days free · No credit card required · Live within 24 hours
        </p>
      </div>

      <SignupFlow initialPlan={plan} initialBilling={billing} />
    </main>
  );
}
