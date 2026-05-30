import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TIER_RANK, type Provider } from "@/lib/supabase/types";
import {
  getSubcategoryBySlug,
  slugToCity,
  cityToSlug,
} from "@/lib/subcategories";
import { CITIES } from "@/lib/supabase/types";
import { ProviderCard } from "@/components/search/ProviderCard";

interface PageProps {
  params: Promise<{ subcategory: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subcategory: subcatSlug, city: citySlug } = await params;
  const subcat   = getSubcategoryBySlug(subcatSlug);
  const cityName = slugToCity(citySlug);
  if (!subcat || !cityName) return { title: "Not Found — LynkServ" };

  const title       = `${subcat.name} in ${cityName}, UT — LynkServ`;
  const description = `Find vetted ${subcat.name.toLowerCase()} businesses in ${cityName}, Utah. Browse licensed and insured local providers on LynkServ. Free for homeowners.`;
  const canonical   = `https://lynkserv.com/services/${subcatSlug}/${citySlug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

async function fetchProviders(subcatSlug: string, cityName: string): Promise<Provider[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .eq("approval_status", "Approved")
      .eq("city", cityName)
      .contains("subcategories", [subcatSlug]);

    if (error) {
      console.error("SEO page query error:", error.message);
      return [];
    }

    return [...(data as Provider[])].sort((a, b) => {
      const tierDiff = (TIER_RANK[a.tier] ?? 4) - (TIER_RANK[b.tier] ?? 4);
      return tierDiff !== 0 ? tierDiff : a.sort_order - b.sort_order;
    });
  } catch {
    return [];
  }
}

export default async function SubcategoryCityPage({ params }: PageProps) {
  const { subcategory: subcatSlug, city: citySlug } = await params;
  const subcat   = getSubcategoryBySlug(subcatSlug);
  const cityName = slugToCity(citySlug);

  if (!subcat || !cityName) notFound();

  const providers = await fetchProviders(subcatSlug, cityName);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${subcat.name} in ${cityName}, UT`,
    description: `Vetted ${subcat.name.toLowerCase()} businesses in ${cityName}, Utah on LynkServ`,
    url: `https://lynkserv.com/services/${subcatSlug}/${citySlug}`,
    numberOfItems: providers.length,
    itemListElement: providers.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://lynkserv.com/providers/${p.slug ?? p.id}`,
      name: p.business_name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#111827] transition-colors">Home</Link>
            <span>›</span>
            <Link
              href={`/search?category=${encodeURIComponent(subcat.category)}`}
              className="hover:text-[#111827] transition-colors"
            >
              {subcat.category}
            </Link>
            <span>›</span>
            <Link
              href={`/search?category=${encodeURIComponent(subcat.category)}&subcategory=${subcatSlug}`}
              className="hover:text-[#111827] transition-colors"
            >
              {subcat.name}
            </Link>
            <span>›</span>
            <span className="text-[#111827] font-medium">{cityName}</span>
          </nav>

          {/* Hero */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-2">
              {subcat.name} in {cityName}, UT
            </h1>
            <p className="text-gray-500">
              {providers.length > 0
                ? `${providers.length} vetted ${subcat.name.toLowerCase()} ${providers.length === 1 ? "business" : "businesses"} in ${cityName}, Utah`
                : `No ${subcat.name.toLowerCase()} businesses listed in ${cityName} yet`}
              {" · "}
              <Link
                href={`/search?category=${encodeURIComponent(subcat.category)}&subcategory=${subcatSlug}&city=${encodeURIComponent(cityName)}`}
                className="text-[#1B4FD8] hover:underline"
              >
                Filter results
              </Link>
            </p>
          </div>

          {providers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <p className="text-gray-400 text-sm mb-4">
                No {subcat.name.toLowerCase()} businesses are listed in {cityName} yet.
              </p>
              <Link
                href={`/search?category=${encodeURIComponent(subcat.category)}`}
                className="text-sm font-semibold text-[#1B4FD8] hover:underline"
              >
                Browse all {subcat.category} businesses →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}

          {/* Nearby cities CTA */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="font-bold text-[#111827] mb-3 text-base">
              Find {subcat.name} in other Utah cities
            </h2>
            <div className="flex flex-wrap gap-2">
              {CITIES.filter((c) => c !== cityName).slice(0, 12).map((c) => (
                <Link
                  key={c}
                  href={`/services/${subcatSlug}/${cityToSlug(c)}`}
                  className="text-xs font-medium text-[#1B4FD8] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          {/* Provider CTA */}
          <div className="mt-6 bg-[#1B4FD8] rounded-2xl p-6 md:p-8 text-center text-white">
            <p className="font-bold text-lg mb-1">
              Are you a {subcat.name.toLowerCase()} business in {cityName}?
            </p>
            <p className="text-blue-200 text-sm mb-5">
              Get found by local homeowners. 30-day free trial.
            </p>
            <Link
              href={`/provider/signup?plan=basic`}
              className="inline-block bg-white text-[#1B4FD8] font-bold text-sm px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              List your business free →
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
