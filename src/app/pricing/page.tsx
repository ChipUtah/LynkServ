import type { Metadata } from "next";
import Link from "next/link";
import { PricingCards } from "@/components/pricing/PricingCards";

export const metadata: Metadata = {
  title: "Pricing — LynkServ",
  description:
    "Simple, transparent pricing for Utah service businesses. 30-day free trial, no credit card required.",
};

const FAQ = [
  {
    q: "Is there really no credit card required for the trial?",
    a: "Correct. Sign up and list your business for 30 days completely free. We only ask for a card when your trial ends and you choose a plan to continue.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no cancellation fees. Cancel from your dashboard at any time and your listing stays active through the end of the billing period.",
  },
  {
    q: "What happens after the 30-day trial?",
    a: "We'll remind you before it ends. You pick a plan and enter payment info to keep your listing. If you don't upgrade, your listing pauses — it won't be deleted.",
  },
  {
    q: "What's the scarcity cap on Featured and Standard?",
    a: "To protect listing quality and value, Featured and Standard listings are limited to 3 per city and category combination. If a slot is full when you apply, you'll be added to the waitlist and notified when one opens.",
  },
  {
    q: "What's the Founding Member discount?",
    a: "The first 100 businesses to join LynkServ receive 50% off their chosen plan for the first 3 months. No code needed — the discount is applied automatically at signup.",
  },
  {
    q: "How does vetting work?",
    a: "Every business is manually reviewed before their listing goes live. We confirm the business is real, operating in Utah, and listed in the correct category.",
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, you can change plans anytime from your provider dashboard. Upgrades take effect immediately; downgrades apply at your next billing cycle.",
  },
];

export default function PricingPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-white px-6 pt-16 pb-10 text-center border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Flat monthly fee. No lead charges. No hidden costs.
            <br className="hidden sm:block" />
            Get found by Utah homeowners starting at $24/mo.
          </p>
        </div>
      </section>

      {/* ── Founding Member Banner ────────────────────────── */}
      <div className="bg-[#F59E0B] px-6 py-4 text-center">
        <p className="text-sm font-semibold text-[#111827]">
          🎯 <span className="font-bold">Founding Member Offer:</span> First 100 businesses get{" "}
          <span className="font-bold">50% off for 3 months.</span> No code needed — automatically applied at signup.
        </p>
      </div>

      {/* ── Pricing Cards ────────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <PricingCards />
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 px-6 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-bold text-[#111827] mb-1">No fake leads</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Unlike Angi, we never charge per lead or sell your info to third parties.
            </p>
          </div>
          <div>
            <p className="font-bold text-[#111827] mb-1">No contracts</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Month-to-month or annual. Cancel anytime from your dashboard.
            </p>
          </div>
          <div>
            <p className="font-bold text-[#111827] mb-1">Real vetting</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Every business is reviewed before listing. Homeowners trust that.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] text-center mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-6">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl px-6 py-5 border border-gray-100">
                <p className="font-semibold text-[#111827] mb-2">{q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Still have questions?{" "}
            <Link href="/contact" className="text-[#1B4FD8] hover:underline font-medium">
              Contact us
            </Link>
          </p>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="bg-[#111827] px-6 py-16 md:py-20 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to grow your business?
          </h2>
          <p className="text-gray-400 mb-8">
            Join LynkServ free for 30 days. No credit card, no commitment.
          </p>
          <Link
            href="/provider/signup"
            className="inline-block bg-[#1B4FD8] text-white font-bold px-10 py-4 rounded-xl hover:bg-blue-600 transition-colors text-base"
          >
            List your business free →
          </Link>
        </div>
      </section>
    </main>
  );
}
