"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES, CATEGORIES } from "@/lib/supabase/types";

interface Props {
  q?: string;
  city?: string;
  category?: string;
}

export function SearchFilters({ q, city, category }: Props) {
  const router = useRouter();
  const [localQ, setLocalQ] = useState(q ?? "");

  function buildUrl(updates: Partial<{ q: string; city: string; category: string }>) {
    const params = new URLSearchParams();
    const final = {
      q:        updates.q        !== undefined ? updates.q        : localQ,
      city:     updates.city     !== undefined ? updates.city     : (city ?? ""),
      category: updates.category !== undefined ? updates.category : (category ?? ""),
    };
    if (final.q)        params.set("q",        final.q);
    if (final.city)     params.set("city",     final.city);
    if (final.category) params.set("category", final.category);
    return `/search?${params.toString()}`;
  }

  const hasFilters = localQ || city || category;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(buildUrl({ q: localQ }));
      }}
      className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center"
    >
      {/* Keyword */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          placeholder="Search businesses…"
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-[#111827] outline-none focus:border-[#1B4FD8] transition-colors"
        />
      </div>

      {/* City */}
      <select
        value={city ?? ""}
        onChange={(e) => router.push(buildUrl({ city: e.target.value }))}
        className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-[#111827] bg-white outline-none focus:border-[#1B4FD8] cursor-pointer transition-colors"
      >
        <option value="">All cities</option>
        {CITIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Category */}
      <select
        value={category ?? ""}
        onChange={(e) => router.push(buildUrl({ category: e.target.value }))}
        className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-[#111827] bg-white outline-none focus:border-[#1B4FD8] cursor-pointer transition-colors"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Search button (submits keyword) */}
      <button
        type="submit"
        className="bg-[#1B4FD8] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
      >
        Search
      </button>

      {/* Clear */}
      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setLocalQ("");
            router.push("/search");
          }}
          className="text-sm text-gray-400 hover:text-[#111827] transition-colors whitespace-nowrap px-1"
        >
          Clear
        </button>
      )}
    </form>
  );
}
