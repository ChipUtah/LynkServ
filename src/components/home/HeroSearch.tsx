"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES } from "@/lib/supabase/types";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (city) params.set("city", city);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden shadow-2xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you need? (e.g. plumber, lawn care)"
          className="flex-1 px-5 py-4 text-[#111827] text-sm outline-none placeholder:text-gray-400"
        />
        <div className="border-t sm:border-t-0 sm:border-l border-gray-100">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full sm:w-44 px-4 py-4 text-[#111827] text-sm outline-none bg-white cursor-pointer"
          >
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-[#F59E0B] text-[#111827] font-bold px-8 py-4 text-sm hover:bg-amber-400 active:bg-amber-500 transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </div>
      <p className="mt-3 text-blue-200 text-xs text-center">
        Free to search &nbsp;·&nbsp; No account required &nbsp;·&nbsp; 30 Utah cities
      </p>
    </form>
  );
}
