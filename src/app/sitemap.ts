import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { CITIES } from "@/lib/supabase/types";
import { UNIQUE_SUBCATEGORY_SLUGS, cityToSlug } from "@/lib/subcategories";

const BASE = "https://lynkserv.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                      lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/search`,          lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/pricing`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`,           lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/how-we-vet`,      lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`,         lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/provider/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // /services/[subcategory]/[city] pages
  const servicePages: MetadataRoute.Sitemap = UNIQUE_SUBCATEGORY_SLUGS.flatMap((slug) =>
    CITIES.map((city) => ({
      url:             `${BASE}/services/${slug}/${cityToSlug(city)}`,
      lastModified:    now,
      changeFrequency: "weekly" as const,
      priority:        0.75,
    }))
  );

  // Dynamic provider profile pages
  try {
    const sb = createAdminClient();
    const { data: providers } = await sb
      .from("providers")
      .select("slug, id, updated_at")
      .eq("approval_status", "Approved");

    const providerPages: MetadataRoute.Sitemap = (providers ?? []).map((p) => ({
      url:             `${BASE}/providers/${p.slug ?? p.id}`,
      lastModified:    new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority:        0.7,
    }));

    return [...staticPages, ...servicePages, ...providerPages];
  } catch {
    return [...staticPages, ...servicePages];
  }
}
