import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

const CAP = 3;

function FillBar({ count, cap = CAP }: { count: number; cap?: number }) {
  const pct = Math.round((count / cap) * 100);
  const color =
    count >= cap ? "bg-red-500" : count >= cap - 1 ? "bg-amber-400" : "bg-green-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold tabular-nums ${count >= cap ? "text-red-600" : count >= cap - 1 ? "text-amber-600" : "text-gray-500"}`}>
        {count}/{cap}
      </span>
    </div>
  );
}

export default async function CapacityPage() {
  const sb = createAdminClient();
  const { data = [] } = await sb
    .from("providers")
    .select("city, category, tier")
    .in("tier", ["Standard", "Featured"])
    .in("approval_status", ["Approved", "Pending"]);

  // Aggregate
  const map: Record<string, { featured: number; standard: number }> = {};
  (data ?? []).forEach((p) => {
    const key = `${p.city}||${p.category}`;
    if (!map[key]) map[key] = { featured: 0, standard: 0 };
    if (p.tier === "Featured") map[key].featured++;
    else map[key].standard++;
  });

  const entries = Object.entries(map)
    .map(([key, counts]) => {
      const [city, category] = key.split("||");
      return { city, category, ...counts };
    })
    .sort((a, b) => {
      // Sort by most-filled first
      const aScore = a.featured / CAP + a.standard / CAP;
      const bScore = b.featured / CAP + b.standard / CAP;
      return bScore - aScore || a.city.localeCompare(b.city);
    });

  const fullSlots = entries.filter((e) => e.featured >= CAP || e.standard >= CAP).length;

  return (
    <main className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Scarcity Capacity</h1>
        <p className="text-sm text-gray-500 mt-1">
          Max {CAP} Featured + {CAP} Standard per city &amp; category. Showing combinations with at least one listing.
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-center">
          <p className="text-2xl font-bold text-[#111827]">{entries.length}</p>
          <p className="text-xs text-gray-400">Active combos</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center">
          <p className="text-2xl font-bold text-red-600">{fullSlots}</p>
          <p className="text-xs text-red-400">Full (3/3)</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {entries.filter((e) => (e.featured === CAP - 1 || e.standard === CAP - 1) && e.featured < CAP && e.standard < CAP).length}
          </p>
          <p className="text-xs text-amber-500">Near full (2/3)</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400 text-sm">
            No Standard or Featured listings yet. They&apos;ll appear here once approved.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FA] border-b border-gray-100">
                <tr>
                  {["City", "Category", `Featured (/${CAP})`, `Standard (/${CAP})`, ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {entries.map(({ city, category, featured, standard }) => (
                  <tr key={`${city}||${category}`} className="hover:bg-[#F8F9FA] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#111827] whitespace-nowrap">{city}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{category}</td>
                    <td className="px-4 py-3 min-w-[140px]"><FillBar count={featured} /></td>
                    <td className="px-4 py-3 min-w-[140px]"><FillBar count={standard} /></td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/providers?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}`}
                        className="text-xs text-[#1B4FD8] hover:underline whitespace-nowrap"
                      >
                        View providers →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
