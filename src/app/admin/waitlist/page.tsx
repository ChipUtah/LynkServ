import { createAdminClient } from "@/lib/supabase/admin";
import { markWaitlistContacted, deleteWaitlistEntry } from "@/lib/actions/admin";
import type { WaitlistEntry } from "@/lib/supabase/types";

const TIER_BADGE: Record<string, string> = {
  Featured: "bg-amber-100 text-amber-700",
  Standard: "bg-blue-100 text-blue-700",
};

export default async function WaitlistPage() {
  const sb = createAdminClient();
  const { data: entries = [] } = await sb
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  const total      = (entries ?? []).length;
  const contacted  = (entries ?? []).filter((e) => e.contacted).length;
  const pending    = total - contacted;

  return (
    <main className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827]">Waitlist</h1>
        <p className="text-sm text-gray-500 mt-1">
          Businesses waiting for a Standard or Featured slot to open.
        </p>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: "Total entries", value: total, cls: "bg-white border-gray-100" },
          { label: "Pending contact", value: pending, cls: "bg-amber-50 border-amber-100 text-amber-700" },
          { label: "Contacted", value: contacted, cls: "bg-green-50 border-green-100 text-green-700" },
        ].map(({ label, value, cls }) => (
          <div key={label} className={`border rounded-xl px-4 py-3 text-center ${cls}`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs opacity-70">{label}</p>
          </div>
        ))}
      </div>

      {(entries ?? []).length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400 text-sm">No waitlist entries yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8F9FA] border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">City · Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tier</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacted</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(entries as WaitlistEntry[]).map((e) => (
                  <tr key={e.id} className={`hover:bg-[#F8F9FA] transition-colors ${e.contacted ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3 font-medium text-[#111827] whitespace-nowrap">
                      {e.business_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs hidden sm:table-cell">{e.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs text-gray-700 whitespace-nowrap">{e.city}</p>
                      <p className="text-xs text-gray-400">{e.category}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TIER_BADGE[e.tier] ?? ""}`}>
                        {e.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 hidden lg:table-cell">
                      {new Date(e.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <form action={markWaitlistContacted.bind(null, e.id, !e.contacted)}>
                        <button
                          type="submit"
                          className={`text-xs font-semibold px-3 min-h-[44px] flex items-center rounded-lg transition-colors whitespace-nowrap ${
                            e.contacted
                              ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {e.contacted ? "✓ Done" : "Mark contacted"}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3">
                      <form action={deleteWaitlistEntry.bind(null, e.id)}>
                        <button
                          type="submit"
                          className="text-xs text-red-400 hover:text-red-600 transition-colors px-3 min-h-[44px] flex items-center"
                          onClick={(ev) => { if (!confirm("Delete this entry?")) ev.preventDefault(); }}
                        >
                          Delete
                        </button>
                      </form>
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
