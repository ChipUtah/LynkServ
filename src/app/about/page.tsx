import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — LynkServ",
  description:
    "LynkServ is Utah's local service directory built for homeowners, not advertisers. No lead fees, no middlemen, real vetting.",
};

function DiffCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-[#111827] mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="bg-[#1B4FD8] text-white px-6 py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            About LynkServ
          </h1>
          <p className="text-lg text-blue-200 leading-relaxed">
            Utah&apos;s local service directory — built for homeowners, not
            advertisers.
          </p>
        </div>
      </section>

      {/* ── Why we built this ─────────────────────────── */}
      <section className="bg-white px-6 py-16 md:py-20 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-6">
            Why we built LynkServ
          </h2>
          <div className="space-y-5 text-gray-600 text-base leading-relaxed">
            <p>
              Utah homeowners kept running into the same problems. Post a job
              online and your phone fills up with calls from contractors you
              never asked to hear from. Pay a platform to connect you with a
              plumber, and suddenly three plumbers are competing for your
              attention — because the platform sold your information to all of
              them.
            </p>
            <p>
              The platforms driving this aren&apos;t broken by accident. They&apos;re
              built around selling leads. Every time a homeowner submits a
              request, the platform charges each interested contractor a fee.
              That creates a system where businesses pay to compete rather than
              compete on quality — and homeowners get treated as inventory.
            </p>
            <p>
              We built LynkServ to work differently. Businesses pay a flat
              monthly listing fee. Homeowners contact them directly. No
              middleman. No data selling. No aggressive follow-up calls you
              didn&apos;t ask for.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it's different ────────────────────────── */}
      <section className="bg-[#F8F9FA] px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-2 text-center">
            How it&apos;s different
          </h2>
          <p className="text-gray-500 text-sm text-center mb-10">
            The model is simpler — and that&apos;s the point.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <DiffCard
              title="No lead fees"
              body="Providers pay one flat monthly fee to be listed. They never pay per contact or per lead. That means no pressure on them to recoup costs, and no incentive to rush your job or upsell you unnecessarily."
            />
            <DiffCard
              title="Direct contact"
              body="Phone numbers and websites are public on every profile. You contact businesses directly — no forms that route through us, no waiting for a callback from a platform rep. Just a direct connection."
            />
            <DiffCard
              title="Utah only"
              body="We focus exclusively on Utah. We know the cities, the service needs, and the local market. We're not a generic national directory — we're a real local resource that gets better as more Utah businesses join."
            />
          </div>
        </div>
      </section>

      {/* ── Vetting ───────────────────────────────────── */}
      <section className="bg-white px-6 py-16 md:py-20 border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-6">
            Real vetting, honestly explained
          </h2>
          <div className="space-y-4 text-gray-600 text-base leading-relaxed">
            <p>
              Every business is manually reviewed before their listing goes
              live. We confirm they&apos;re real, they&apos;re operating in Utah, and
              they&apos;re listed in the right category. For licensed trades, we
              verify license numbers where providers supply them.
            </p>
            <p>
              We&apos;re a small team and we read every application. That matters.
              It&apos;s why we cap Featured and Standard listings at three per
              city and category — we&apos;d rather have fewer, better-vetted
              listings than a long list of unreviewed ones.
            </p>
            <p>
              Vetting confirms a business is legitimate and operating in Utah.
              It doesn&apos;t guarantee the quality of their work or that every
              job will go perfectly. We always recommend reading Google
              reviews, asking for references, and getting multiple quotes for
              large projects.
            </p>
          </div>
          <Link
            href="/how-we-vet"
            className="inline-block mt-6 text-sm font-semibold text-[#1B4FD8] hover:underline"
          >
            Read the full vetting process →
          </Link>
        </div>
      </section>

      {/* ── For providers ─────────────────────────────── */}
      <section className="bg-[#F8F9FA] px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-6">
            For local businesses
          </h2>
          <div className="space-y-4 text-gray-600 text-base leading-relaxed">
            <p>
              LynkServ is designed to be a fair deal for small, local
              businesses. One price. No contracts. No per-lead fees. No
              penalty for slow months. Your listing is your listing — you
              control your profile, your contact info, and your
              first-time offers.
            </p>
            <p>
              Featured listings appear first in every search. Standard
              listings include profile photos, testimonials, and a
              first-time customer offer badge. Basic listings get you
              found in the directory with your contact info visible.
            </p>
            <p>
              The first 100 businesses to join LynkServ receive 50% off
              their chosen plan for the first three months — no code
              needed. Every listing starts with a 30-day free trial. No
              credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* ── Provider CTA ──────────────────────────────── */}
      <section className="bg-[#111827] px-6 py-16 md:py-20 text-center text-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Are you a local service provider?
          </h2>
          <p className="text-gray-400 mb-8">
            Get found by Utah homeowners. 30 days free. No credit card
            required.
          </p>
          <Link
            href="/provider/signup"
            className="inline-block bg-[#1B4FD8] text-white font-bold px-10 py-4 rounded-xl hover:bg-blue-600 transition-colors"
          >
            List your business free →
          </Link>
        </div>
      </section>
    </main>
  );
}
