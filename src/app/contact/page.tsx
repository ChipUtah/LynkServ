import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact LynkServ — Get in Touch",
  description:
    "Questions about listings, provider billing, or reporting a concern? Contact the LynkServ team. We respond within one business day.",
  alternates: { canonical: "https://lynkserv.com/contact" },
  openGraph: {
    title: "Contact LynkServ — Get in Touch",
    description: "Reach the LynkServ team with questions about listings, billing, or to report a concern.",
    url:  "https://lynkserv.com/contact",
  },
};

const QUICK_ANSWERS = [
  {
    q: "How do I list my business?",
    a: (
      <>
        Start at{" "}
        <Link href="/provider/signup" className="text-[#1B4FD8] hover:underline font-medium">
          our provider signup
        </Link>
        . It takes about five minutes and the first 30 days are free — no credit card required.
      </>
    ),
  },
  {
    q: "How do I update my listing?",
    a: (
      <>
        Sign in at{" "}
        <Link href="/provider/login" className="text-[#1B4FD8] hover:underline font-medium">
          your provider dashboard
        </Link>{" "}
        and go to Edit Profile. Changes go live immediately.
      </>
    ),
  },
  {
    q: "How do I report a listing?",
    a: "Use the contact form on this page and select 'I want to report a listing.' Include the business name and a description of the concern. We investigate every report.",
  },
  {
    q: "How long does vetting take?",
    a: (
      <>
        We review every application within 24 hours. Read more about{" "}
        <Link href="/how-we-vet" className="text-[#1B4FD8] hover:underline font-medium">
          how we vet providers
        </Link>
        .
      </>
    ),
  },
];

export default function ContactPage() {
  return (
    <main className="bg-[#F8F9FA]">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 px-6 py-14 md:py-20 text-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] tracking-tight mb-3">
            Get in touch
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Questions, concerns, or partnership inquiries — we respond within
            one business day.
          </p>
        </div>
      </section>

      {/* ── Form + sidebar ────────────────────────────── */}
      <section className="px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-bold text-[#111827] mb-6">
                Send us a message
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">

            {/* Contact info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                Contact
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Email</p>
                    <a
                      href="mailto:hello@lynkserv.com"
                      className="text-sm font-medium text-[#1B4FD8] hover:underline"
                    >
                      hello@lynkserv.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Response time</p>
                    <p className="text-sm text-[#111827]">Within one business day</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Based in</p>
                    <p className="text-sm text-[#111827]">Utah, USA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick answers */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                Quick answers
              </h2>
              <div className="space-y-4">
                {QUICK_ANSWERS.map(({ q, a }) => (
                  <div key={q}>
                    <p className="text-sm font-semibold text-[#111827] mb-1">{q}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
