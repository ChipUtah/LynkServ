import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How We Vet Providers — LynkServ",
  description:
    "Every business on LynkServ is manually reviewed before listing. Here's exactly what we check, what we verify, and what vetting means.",
};

const PROCESS_STEPS = [
  {
    n: "1",
    title: "Application submitted",
    body: "A business applies through our provider signup form. We collect their business name, city, category, contact information, and a description of their services.",
  },
  {
    n: "2",
    title: "Manual review within 24 hours",
    body: "A member of our team reads every application. We are not an automated system — a real person reviews each submission to check for obvious red flags before moving forward.",
  },
  {
    n: "3",
    title: "Business legitimacy check",
    body: "We confirm the business is real and currently operating. We look for a basic online presence — a website, social profile, or Google Business listing — and verify the contact information provided is consistent.",
  },
  {
    n: "4",
    title: "Utah presence and category match",
    body: "We confirm the business serves the Utah city they've listed and that their services match their selected category. A landscaping company should not appear under Trades.",
  },
  {
    n: "5",
    title: "License and insurance review",
    body: "For categories where licensing is common — trades, medical, legal — we encourage providers to submit their license numbers and insurance documentation. We verify what is provided. Providers without documentation are not automatically rejected, but verified providers receive verification badges on their profiles.",
  },
  {
    n: "6",
    title: "Listing approved and published",
    body: "Once approved, the listing goes live in our directory and appears in relevant search results. Approved status can be reviewed at any time — especially if we receive reports from homeowners.",
  },
] as const;

const VERIFIED: string[] = [
  "Business is real and currently operating",
  "Business serves the listed Utah city",
  "Services match the listed category",
  "Contact information is consistent and reachable",
  "License number (when provided by the business)",
  "Insurance documentation (when provided by the business)",
];

const NOT_GUARANTEED: string[] = [
  "The quality of any individual job or project",
  "That a business will respond promptly to every inquiry",
  "The accuracy of Google ratings shown on profiles",
  "That a business's prices are competitive or fair",
  "That every customer interaction will be positive",
];

export default function HowWeVetPage() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 px-6 py-16 md:py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-4">
            How we vet providers
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Every business is manually reviewed before their listing goes live.
            Here&apos;s exactly what that means.
          </p>
        </div>
      </section>

      {/* ── Process steps ─────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-10">
            The review process
          </h2>

          <div className="space-y-6">
            {PROCESS_STEPS.map(({ n, title, body }) => (
              <div key={n} className="flex gap-5">
                <div className="w-9 h-9 rounded-full bg-[#1B4FD8] text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  {n}
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we verify vs. don't guarantee ───────── */}
      <section className="bg-white px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-10 text-center">
            What vetting means — and what it doesn&apos;t
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What we verify */}
            <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
              <h3 className="font-bold text-[#111827] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                What we check
              </h3>
              <ul className="space-y-2.5">
                {VERIFIED.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What we don't guarantee */}
            <div className="bg-[#F8F9FA] rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-[#111827] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What we don&apos;t guarantee
              </h3>
              <ul className="space-y-2.5">
                {NOT_GUARANTEED.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-500">
                    <span className="text-gray-300 shrink-0 mt-0.5 font-bold">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <p className="text-sm text-[#111827] leading-relaxed">
              <span className="font-semibold">Our honest take:</span> Vetting
              confirms a business is legitimate and operating in Utah. It
              does not replace your own due diligence. We always recommend
              reading Google reviews, asking for references, and getting more
              than one quote for large projects.
            </p>
          </div>
        </div>
      </section>

      {/* ── Ongoing monitoring ────────────────────────── */}
      <section className="bg-[#F8F9FA] px-6 py-16 md:py-20 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-6">
            After a listing is approved
          </h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
              Approval is not permanent by default. We reserve the right to
              re-review any listing at any time, and we do so when we receive
              credible reports from homeowners. Listings that generate
              consistent negative feedback, appear to have misrepresented
              their services, or violate our terms can be suspended.
            </p>
            <p>
              We also cap Featured and Standard listings at three per city
              and category. This scarcity is intentional — it keeps the
              directory focused on quality, and it means that if a business
              earns a spot at a higher tier, they&apos;re competing with fewer
              others for visibility in that market.
            </p>
          </div>
        </div>
      </section>

      {/* ── Report a concern ──────────────────────────── */}
      <section className="bg-white px-6 py-16 md:py-20 border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-[#111827] mb-3">
            Seen something that doesn&apos;t seem right?
          </h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            If a listed business misrepresented their services, behaved
            unprofessionally, or you believe the listing is fraudulent —
            please let us know. We investigate every report.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#1B4FD8] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Report a listing →
          </Link>
        </div>
      </section>

      {/* ── Provider CTA ──────────────────────────────── */}
      <section className="bg-[#111827] px-6 py-16 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">
            Are you a local service provider?
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Submit your application. We&apos;ll review it within 24 hours.
          </p>
          <Link
            href="/provider/signup"
            className="inline-block bg-[#1B4FD8] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors"
          >
            List your business free →
          </Link>
        </div>
      </section>
    </main>
  );
}
