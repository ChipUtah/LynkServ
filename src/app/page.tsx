import type { Metadata } from "next";
import Link from "next/link";
import { HeroSearch } from "@/components/home/HeroSearch";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";
import { CATEGORY_DATA, HOW_IT_WORKS, WHY_LYNKSERV } from "@/lib/constants";

export const metadata: Metadata = {
  title: "LynkServ — Find Vetted Local Service Businesses in Utah",
  description:
    "Discover vetted local service businesses across Utah. Search plumbers, electricians, lawn care, and 12 service categories in Salt Lake City, Provo, Ogden, St. George, and 27 more Utah cities. Free for homeowners — no lead fees, no middlemen.",
  alternates: { canonical: "https://lynkserv.com" },
  openGraph: {
    title:       "LynkServ — Find Vetted Local Service Businesses in Utah",
    description: "Discover vetted local service businesses across Utah. Free for homeowners — no lead fees, no middlemen.",
    url:         "https://lynkserv.com",
  },
};

// ─── AEO FAQ data ─────────────────────────────────────────────
// Written to directly answer questions AI assistants surface about
// finding trusted local contractors in Utah.

const HOME_FAQ = [
  {
    q: "What is LynkServ and how does it work?",
    a: "LynkServ is Utah's local service directory. Homeowners search by service type and city, browse vetted business profiles with real Google ratings, and contact businesses directly — no forms, no middlemen. Every listed business is manually reviewed before going live.",
  },
  {
    q: "Where can I find vetted plumbers, electricians, or contractors in Utah?",
    a: "LynkServ lists verified service businesses across 30 Utah cities including Salt Lake City, Provo, Ogden, St. George, Draper, Sandy, West Jordan, South Jordan, Lehi, Murray, and more. Search by category and city to find licensed, insured businesses near you.",
  },
  {
    q: "How is LynkServ different from Angi or HomeAdvisor?",
    a: "Unlike Angi or HomeAdvisor, LynkServ does not charge per lead and never sells your contact information to multiple contractors. Businesses pay one flat monthly fee. You browse and contact them directly — no aggressive follow-up calls, no auction-style lead system.",
  },
  {
    q: "Is LynkServ free for homeowners?",
    a: "Yes. LynkServ is completely free for homeowners to use. Browse listings, read reviews, and contact businesses at no cost. No account or sign-up required.",
  },
  {
    q: "What types of local services are listed on LynkServ?",
    a: "LynkServ covers 12 service categories: Home Services, Outdoor Services, Trades, Medical, Legal, Pet Services, Automotive, Beauty, Energy, Wellness, General Repair, and Professional Services — across 30 Utah cities.",
  },
  {
    q: "How do I know businesses listed on LynkServ are trustworthy?",
    a: "Every business is manually reviewed before their listing goes live. We verify the business is real and operating in Utah, confirm it matches its category, and check licenses and insurance where provided. Verified businesses display Licensed and Insured badges. We also suspend listings based on homeowner reports.",
  },
] as const;

// ─── Icons ───────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  );
}

const ICONS = { shield: ShieldIcon, badge: BadgeIcon, tag: TagIcon } as const;

// ─── Page ─────────────────────────────────────────────────────

export default function HomePage() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LynkServ",
    url: "https://lynkserv.com",
    description: "Utah's local service directory connecting homeowners with vetted local service businesses.",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://lynkserv.com/search?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LynkServ",
    url: "https://lynkserv.com",
    description: "Utah's local service directory connecting homeowners with vetted local service businesses.",
    areaServed: { "@type": "State", name: "Utah", containedInPlace: { "@type": "Country", name: "United States" } },
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "hello@lynkserv.com" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-[#1B4FD8] px-6 py-20 md:py-32 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-4">
            Your Link to Trusted
            <br />
            Local Services
          </h1>
          <p className="text-lg md:text-xl text-blue-200 mb-10">
            Vetted businesses. Real reviews. First-time offers.
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] text-center mb-2">
            Browse by Category
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10">
            12 categories across all of Utah
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {CATEGORY_DATA.map(({ name, emoji, slug }) => (
              <Link
                key={slug}
                href={`/search?category=${encodeURIComponent(name)}`}
                className="bg-white rounded-xl p-5 flex flex-col items-center gap-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-gray-100"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-sm font-semibold text-[#111827] leading-tight">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="bg-white px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] text-center mb-2">
            How It Works
          </h2>
          <p className="text-gray-500 text-center text-sm mb-12">
            Find the right business in three simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {HOW_IT_WORKS.map(({ step, title, description }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#1B4FD8] text-white flex items-center justify-center font-bold text-lg mb-4 shrink-0">
                  {step}
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why LynkServ ─────────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] text-center mb-2">
            Why LynkServ?
          </h2>
          <p className="text-gray-500 text-center text-sm mb-12">
            A better way to find local services in Utah
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {WHY_LYNKSERV.map(({ title, description, icon }) => {
              const Icon = ICONS[icon];
              return (
                <div
                  key={title}
                  className="bg-white rounded-xl p-6 border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1B4FD8] flex items-center justify-center mb-4">
                    <Icon />
                  </div>
                  <h3 className="font-bold text-[#111827] mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ (AEO) ────────────────────────────────────── */}
      <section className="bg-white px-6 py-16 md:py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] text-center mb-2">
            Common questions
          </h2>
          <p className="text-gray-500 text-sm text-center mb-12">
            Everything Utah homeowners want to know about LynkServ
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HOME_FAQ.map(({ q, a }) => (
              <div key={q} className="bg-[#F8F9FA] rounded-2xl p-6">
                <h3 className="font-bold text-[#111827] mb-2 text-sm leading-snug">{q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Provider CTA ─────────────────────────────────── */}
      <section className="bg-[#111827] px-6 py-16 md:py-20 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block bg-[#F59E0B] text-[#111827] text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
            Founding Member Offer
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            Are you a local service provider?
          </h2>
          <p className="text-gray-400 mb-2">
            Get found by Utah homeowners. 30 days free. No credit card required.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            First 100 businesses get 50% off for 3 months.
          </p>
          <Link
            href="/provider/signup"
            className="inline-block bg-[#1B4FD8] text-white font-bold px-10 py-4 rounded-xl hover:bg-blue-600 transition-colors text-base"
          >
            List your business free →
          </Link>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────── */}
      <section className="bg-white px-6 py-14 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-[#111827] mb-2">
            Stay in the loop
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            New businesses, special offers, and Utah service tips — straight to
            your inbox.
          </p>
          <NewsletterSignup />
        </div>
      </section>
    </main>
    </>
  );
}
