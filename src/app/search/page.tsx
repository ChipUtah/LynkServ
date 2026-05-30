import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TIER_RANK, type Provider } from "@/lib/supabase/types";
import { getSubcategoryBySlug } from "@/lib/subcategories";
import { SearchFilters } from "@/components/search/SearchFilters";
import { ProviderCard } from "@/components/search/ProviderCard";
import { EmptyResults } from "@/components/search/EmptyResults";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
    category?: string;
    subcategory?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q, city, category, subcategory } = await searchParams;

  const subcatName = subcategory ? getSubcategoryBySlug(subcategory)?.name : undefined;
  const titleParts = [q, subcatName ?? category, city ? `${city}, UT` : null].filter(Boolean);
  const title = titleParts.length > 0
    ? `${titleParts.join(" · ")} — LynkServ`
    : "Find Vetted Local Services in Utah — LynkServ";

  const desc = (() => {
    const svc = subcatName ?? (category ? category.toLowerCase() : null);
    if (svc && city) return `Find vetted ${svc.toLowerCase()} businesses in ${city}, Utah. Browse licensed and insured local businesses on LynkServ.`;
    if (svc)         return `Find vetted ${svc.toLowerCase()} businesses across Utah. Browse licensed and insured local businesses on LynkServ.`;
    if (city)        return `Find vetted local service businesses in ${city}, Utah. Plumbers, electricians, lawn care, and more on LynkServ.`;
    return "Search vetted local service businesses across 30 Utah cities. Find plumbers, electricians, lawn care, contractors, and more on LynkServ.";
  })();

  return {
    title,
    description: desc,
    robots: { index: !q, follow: true },
  };
}

async function fetchProviders(
  q?: string,
  city?: string,
  category?: string,
  subcategory?: string,
): Promise<Provider[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("providers")
      .select("*")
      .eq("approval_status", "Approved");

    if (city)        query = query.eq("city", city);
    if (category)    query = query.eq("category", category);
    if (subcategory) query = query.contains("subcategories", [subcategory]);

    if (q?.trim()) {
      const safe = q.trim().replace(/[%_\\]/g, "\\$&");
      query = query.or(
        `business_name.ilike.%${safe}%,description.ilike.%${safe}%`
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error("Search query error:", error.message);
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

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, city, category, subcategory } = await searchParams;
  const providers = await fetchProviders(q, city, category, subcategory);

  const subcatName = subcategory ? getSubcategoryBySlug(subcategory)?.name : undefined;

  const titleParts = [
    q           ? `"${q}"` : null,
    subcatName  ?? category ?? null,
    city        ? `${city}, UT` : null,
  ].filter(Boolean);
  const pageTitle = titleParts.length > 0 ? titleParts.join(" · ") : "All Services in Utah";

  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      {/* ── Filter bar ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <SearchFilters q={q} city={city} category={category} subcategory={subcategory} />
        </div>
      </div>

      {/* ── Results ────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#111827]">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {providers.length === 0
              ? "No businesses found"
              : `${providers.length} ${providers.length === 1 ? "business" : "businesses"} found`}
          </p>
        </div>

        {providers.length === 0 ? (
          <EmptyResults q={q} city={city} category={category} />
        ) : (
          <div className="flex flex-col gap-4">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
