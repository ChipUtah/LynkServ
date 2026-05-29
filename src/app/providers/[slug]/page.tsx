import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Provider } from "@/lib/supabase/types";

// ─── Data fetching ────────────────────────────────────────────

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchProvider(slug: string): Promise<Provider | null> {
  try {
    const supabase = await createClient();

    const { data: bySlug } = await supabase
      .from("providers")
      .select("*")
      .eq("slug", slug)
      .eq("approval_status", "Approved")
      .maybeSingle();
    if (bySlug) return bySlug as Provider;

    // Fallback: try UUID
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (!isUUID) return null;

    const { data: byId } = await supabase
      .from("providers")
      .select("*")
      .eq("id", slug)
      .eq("approval_status", "Approved")
      .maybeSingle();
    return byId as Provider | null;
  } catch {
    return null;
  }
}

// ─── Metadata ─────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = await fetchProvider(slug);
  if (!p) return { title: "Business Not Found — LynkServ" };

  const canonicalUrl = `https://lynkserv.com/providers/${p.slug ?? p.id}`;
  const title        = `${p.business_name} — ${p.category} in ${p.city}, UT`;
  const description  = p.description
    ? `${p.description.slice(0, 120)}... ${p.business_name} serves ${p.city}, Utah. Listed on LynkServ.`
    : `${p.business_name} is a vetted ${p.category.toLowerCase()} business serving ${p.city}, Utah. View contact info, reviews, and more on LynkServ.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url:  canonicalUrl,
      type: "profile",
      ...(p.profile_photo?.startsWith("http") && {
        images: [{ url: p.profile_photo, width: 800, height: 600, alt: p.business_name }],
      }),
    },
    twitter: { card: "summary", title, description },
  };
}

// ─── Sub-components ───────────────────────────────────────────

function Avatar({ provider }: { provider: Provider }) {
  const initials = provider.business_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (provider.profile_photo?.startsWith("http")) {
    return (
      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0">
        <Image
          src={provider.profile_photo}
          alt={provider.business_name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
    );
  }

  return (
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-blue-50 text-[#1B4FD8] font-bold text-2xl flex items-center justify-center shrink-0">
      {initials}
    </div>
  );
}

function StarRating({ rating, count }: { rating: number; count?: number | null }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-sm">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= filled ? "text-[#F59E0B]" : "text-gray-200"}>
            ★
          </span>
        ))}
      </div>
      <span className="font-bold text-[#111827] text-sm">{rating.toFixed(1)}</span>
      {count != null && count > 0 && (
        <span className="text-sm text-gray-400">
          ({count.toLocaleString()} reviews)
        </span>
      )}
    </div>
  );
}

function TierBadge({ tier }: { tier: Provider["tier"] }) {
  if (tier === "Featured")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#F59E0B] text-[#111827]">
        ⭐ Featured
      </span>
    );
  if (tier === "Standard")
    return (
      <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-[#1B4FD8] text-white">
        Standard
      </span>
    );
  return null;
}

function VerifiedBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
      {children}
    </span>
  );
}

function SocialLink({
  href,
  label,
  icon,
  bg,
}: {
  href: string;
  label: string;
  icon: string;
  bg: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#111827] transition-colors"
    >
      <span
        className={`w-7 h-7 rounded-lg ${bg} text-white text-xs font-bold flex items-center justify-center shrink-0`}
      >
        {icon}
      </span>
      {label}
    </a>
  );
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="bg-[#F8F9FA] rounded-xl p-5 relative">
      <span className="absolute top-2 left-4 text-5xl text-gray-100 font-serif leading-none select-none">
        "
      </span>
      <p className="text-sm text-gray-700 leading-relaxed mt-4 mb-3 italic relative z-10">
        {quote}
      </p>
      <p className="text-xs font-semibold text-gray-500">— {author}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default async function ProviderProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const p = await fetchProvider(slug);
  if (!p) notFound();

  const canShowTestimonials =
    (p.tier === "Standard" || p.tier === "Featured") &&
    (p.testimonial_1_quote || p.testimonial_2_quote || p.testimonial_3_quote);

  const testimonials = [
    { quote: p.testimonial_1_quote, author: p.testimonial_1_author },
    { quote: p.testimonial_2_quote, author: p.testimonial_2_author },
    { quote: p.testimonial_3_quote, author: p.testimonial_3_author },
  ].filter((t): t is { quote: string; author: string } =>
    Boolean(t.quote && t.author)
  );

  const socials = [
    p.facebook_url  && { href: p.facebook_url,  label: "Facebook",  icon: "f",  bg: "bg-blue-600" },
    p.instagram_url && { href: p.instagram_url, label: "Instagram", icon: "ig", bg: "bg-pink-500"  },
    p.linkedin_url  && { href: p.linkedin_url,  label: "LinkedIn",  icon: "in", bg: "bg-blue-700"  },
  ].filter(Boolean) as { href: string; label: string; icon: string; bg: string }[];

  // JSON-LD structured data — enhanced LocalBusiness schema
  const profileUrl = `https://lynkserv.com/providers/${p.slug ?? p.id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": profileUrl,
    name: p.business_name,
    ...(p.description && { description: p.description }),
    ...(p.phone       && { telephone: p.phone }),
    ...(p.website     && { url: p.website }),
    sameAs:   profileUrl,
    image:    p.profile_photo?.startsWith("http") ? p.profile_photo : undefined,
    priceRange: p.tier === "Featured" ? "$$$" : p.tier === "Standard" ? "$$" : "$",
    address: {
      "@type": "PostalAddress",
      addressLocality: p.city,
      addressRegion: "UT",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: p.city,
      containedInPlace: { "@type": "State", name: "Utah" },
    },
    ...(p.license_verified  && { hasCredential: "Licensed" }),
    ...(p.insurance_verified && { hasCredential: "Insured" }),
    ...(p.ftco_active && p.ftco_description && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "First-Time Customer Offer",
        description: p.ftco_description,
      },
    }),
    ...(p.google_rating != null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: p.google_rating,
        reviewCount: p.google_review_count ?? 1,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#F8F9FA]">

        {/* ── Featured accent bar ─────────────────────── */}
        {p.tier === "Featured" && (
          <div className="bg-[#F59E0B] h-1.5" />
        )}

        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">

          {/* ── Breadcrumb ───────────────────────────── */}
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#111827] transition-colors">Home</Link>
            <span>›</span>
            <Link
              href={`/search?category=${encodeURIComponent(p.category)}`}
              className="hover:text-[#111827] transition-colors"
            >
              {p.category}
            </Link>
            <span>›</span>
            <Link
              href={`/search?category=${encodeURIComponent(p.category)}&city=${encodeURIComponent(p.city)}`}
              className="hover:text-[#111827] transition-colors"
            >
              {p.city}
            </Link>
            <span>›</span>
            <span className="text-[#111827] font-medium truncate max-w-[200px]">
              {p.business_name}
            </span>
          </nav>

          {/* ── Profile header card ──────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
              <Avatar provider={p} />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#111827] leading-tight">
                    {p.business_name}
                  </h1>
                  <TierBadge tier={p.tier} />
                </div>

                <p className="text-gray-500 mb-3">
                  {p.category} &nbsp;·&nbsp; {p.city}, UT
                </p>

                {/* Rating */}
                {p.google_rating != null && (
                  <div className="mb-3">
                    <StarRating rating={p.google_rating} count={p.google_review_count} />
                  </div>
                )}

                {/* Verification + FTCO badges */}
                <div className="flex flex-wrap gap-2">
                  {p.license_verified  && <VerifiedBadge>Licensed</VerifiedBadge>}
                  {p.insurance_verified && <VerifiedBadge>Insured</VerifiedBadge>}
                  {p.ftco_active && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      🎁 First-Time Offer
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile contact actions */}
            <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-3 sm:hidden">
              {p.phone && (
                <a
                  href={`tel:${p.phone}`}
                  className="flex-1 bg-[#1B4FD8] text-white font-semibold text-sm py-3 px-4 rounded-xl text-center hover:bg-blue-700 transition-colors"
                >
                  📞 {p.phone}
                </a>
              )}
              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border border-[#1B4FD8] text-[#1B4FD8] font-semibold text-sm py-3 px-4 rounded-xl text-center hover:bg-blue-50 transition-colors"
                >
                  Visit Website ↗
                </a>
              )}
            </div>
          </div>

          {/* ── Two-column body ──────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">

              {/* About */}
              {p.description && (
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <h2 className="text-lg font-bold text-[#111827] mb-4">
                    About {p.business_name}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {p.description}
                  </p>
                </section>
              )}

              {/* FTCO */}
              {p.ftco_active && (
                <section className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🎁</span>
                    <h2 className="text-lg font-bold text-[#111827]">
                      First-Time Customer Offer
                    </h2>
                  </div>

                  {(p.ftco_type || p.ftco_value) && (
                    <div className="flex items-baseline gap-2 mb-2">
                      {p.ftco_value && (
                        <span className="text-3xl font-extrabold text-[#111827]">
                          {p.ftco_value}
                        </span>
                      )}
                      {p.ftco_type && (
                        <span className="text-gray-600 font-medium">{p.ftco_type}</span>
                      )}
                    </div>
                  )}

                  {p.ftco_description && (
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      {p.ftco_description}
                    </p>
                  )}

                  {p.ftco_expiry && (
                    <p className="text-xs text-amber-700 font-medium mb-3">
                      Offer expires{" "}
                      {new Date(p.ftco_expiry).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  <p className="text-xs text-amber-800 font-semibold">
                    Ask about this offer when you contact them.
                  </p>
                </section>
              )}

              {/* Testimonials */}
              {canShowTestimonials && testimonials.length > 0 && (
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <h2 className="text-lg font-bold text-[#111827] mb-5">
                    What customers say
                  </h2>
                  <div className="space-y-4">
                    {testimonials.map((t, i) => (
                      <Testimonial key={i} quote={t.quote} author={t.author} />
                    ))}
                  </div>
                </section>
              )}

              {/* No content fallback */}
              {!p.description && !p.ftco_active && !canShowTestimonials && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                  <p className="text-gray-400 text-sm">
                    This business hasn&apos;t added a description yet.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Contact card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Contact
                </h2>

                <div className="space-y-3">
                  {p.phone ? (
                    <a
                      href={`tel:${p.phone}`}
                      className="flex items-center justify-center gap-2 w-full bg-[#1B4FD8] text-white font-semibold text-sm py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {p.phone}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-2">No phone listed</p>
                  )}

                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full border border-gray-200 text-[#111827] font-semibold text-sm py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit Website
                    </a>
                  )}
                </div>

                {/* Social */}
                {socials.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                    {socials.map((s) => (
                      <SocialLink key={s.label} {...s} />
                    ))}
                  </div>
                )}

                {/* Quick info */}
                <div className="mt-5 pt-5 border-t border-gray-100 space-y-2.5">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {p.city}, Utah
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {p.category}
                  </div>

                  {(p.license_verified || p.insurance_verified) && (
                    <div className="flex flex-col gap-1.5 pt-1">
                      {p.license_verified && (
                        <div className="flex items-center gap-2 text-xs text-green-700">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          License verified
                          {p.license_number && (
                            <span className="text-gray-400 text-xs">#{p.license_number}</span>
                          )}
                        </div>
                      )}
                      {p.insurance_verified && (
                        <div className="flex items-center gap-2 text-xs text-green-700">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Insurance verified
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="mt-5 text-xs text-gray-300 text-center">
                  <Link href="/contact" className="hover:text-gray-400 transition-colors">
                    Report this listing
                  </Link>
                </p>
              </div>

            </div>
          </div>

          {/* ── Footer CTA ───────────────────────────── */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-[#111827] mb-0.5">
                Find more {p.category} businesses
              </p>
              <p className="text-sm text-gray-500">
                Browse all vetted {p.category.toLowerCase()} businesses in {p.city}
              </p>
            </div>
            <Link
              href={`/search?category=${encodeURIComponent(p.category)}&city=${encodeURIComponent(p.city)}`}
              className="shrink-0 bg-[#1B4FD8] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Browse {p.category} →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
