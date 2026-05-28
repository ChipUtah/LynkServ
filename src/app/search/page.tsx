import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TIER_RANK, type Provider } from "@/lib/supabase/types";
import { SearchFilters } from "@/components/search/SearchFilters";
import { ProviderCard } from "@/components/search/ProviderCard";
import { EmptyResults } from "@/components/search/EmptyResults";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
    category?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q, city, category } = await searchParams;
  const parts = [q, category, city ? `${city}, UT` : null].filter(Boolean);
  const title = parts.length > 0
    ? `${parts.join(" · ")} — LynkServ`
    : "Find Local Services in Utah — LynkServ";
  return { title };
}

async function fetchProviders(q?: string, city?: string, category?: string): Promise<Provider[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("providers")
      .select("*")
      .eq("approval_status", "Approved");

    if (city)     query = query.eq("city", city);
    if (category) query = query.eq("category", category);

    if (q?.trim()) {
      // Escape % and _ so they're treated as literals in ILIKE
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

    // Sort Featured → Standard → Basic, then by sort_order within tier
    return [...(data as Provider[])].sort((a, b) => {
      const tierDiff = (TIER_RANK[a.tier] ?? 4) - (TIER_RANK[b.tier] ?? 4);
      return tierDiff !== 0 ? tierDiff : a.sort_order - b.sort_order;
    });
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, city, category } = await searchParams;
  const providers = await fetchProviders(q, city, category);

  const titleParts = [
    q        ? `"${q}"`  : null,
    category ?? null,
    city     ? `${city}, UT` : null,
  ].filter(Boolean);
  const pageTitle = titleParts.length > 0 ? titleParts.join(" · ") : "All Services in Utah";

  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      {/* ── Filter bar ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <SearchFilters q={q} city={city} category={category} />
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

        {/* Cards or empty state */}
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
