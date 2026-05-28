"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES, CATEGORIES } from "@/lib/supabase/types";

interface Props {
  q?: string;
  status?: string;
  tier?: string;
  city?: string;
  category?: string;
}

export function ProvidersFilters({ q, status, tier, city, category }: Props) {
  const router = useRouter();
  const [localQ, setLocalQ] = useState(q ?? "");

  function buildUrl(patch: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = {
      q:        patch.q        !== undefined ? patch.q        : localQ,
      status:   patch.status   !== undefined ? patch.status   : (status   ?? ""),
      tier:     patch.tier     !== undefined ? patch.tier     : (tier     ?? ""),
      city:     patch.city     !== undefined ? patch.city     : (city     ?? ""),
      category: patch.category !== undefined ? patch.category : (category ?? ""),
    };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `/admin/providers?${params.toString()}`;
  }

  const hasFilters = localQ || status || tier || city || category;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); router.push(buildUrl({ q: localQ })); }}
      className="flex flex-wrap gap-2 items-center"
    >
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          placeholder="Search name, email…"
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#1B4FD8] transition-colors bg-white"
        />
      </div>

      {/* Status */}
      <select
        value={status ?? ""}
        onChange={(e) => router.push(buildUrl({ status: e.target.value }))}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:border-[#1B4FD8] cursor-pointer"
      >
        <option value="">All statuses</option>
        {["Pending", "Approved", "Suspended"].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Tier */}
      <select
        value={tier ?? ""}
        onChange={(e) => router.push(buildUrl({ tier: e.target.value }))}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:border-[#1B4FD8] cursor-pointer"
      >
        <option value="">All tiers</option>
        {["Basic", "Standard", "Featured"].map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* City */}
      <select
        value={city ?? ""}
        onChange={(e) => router.push(buildUrl({ city: e.target.value }))}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:border-[#1B4FD8] cursor-pointer"
      >
        <option value="">All cities</option>
        {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Category */}
      <select
        value={category ?? ""}
        onChange={(e) => router.push(buildUrl({ category: e.target.value }))}
        className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:border-[#1B4FD8] cursor-pointer"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <button
        type="submit"
        className="bg-[#1B4FD8] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
      >
        Search
      </button>

      {hasFilters && (
        <button
          type="button"
          onClick={() => { setLocalQ(""); router.push("/admin/providers"); }}
          className="text-sm text-gray-400 hover:text-[#111827] transition-colors"
        >
          Clear
        </button>
      )}
    </form>
  );
}
