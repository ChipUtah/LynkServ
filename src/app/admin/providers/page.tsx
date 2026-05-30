import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { approveProvider, suspendProvider } from "@/lib/actions/admin";
import { ProvidersFilters } from "@/components/admin/ProvidersFilters";
import type { Provider } from "@/lib/supabase/types";

interface PageProps {
  searchParams: Promise<{
    q?: string; status?: string; tier?: string;
    city?: string; category?: string;
  }>;
}

const STATUS_BADGE: Record<string, string> = {
  Approved:  "bg-green-100 text-green-700",
  Pending:   "bg-amber-100 text-amber-700",
  Suspended: "bg-red-100 text-red-700",
};
const TIER_BADGE: Record<string, string> = {
  Featured: "bg-amber-100 text-amber-700",
  Standard: "bg-blue-100 text-blue-700",
  Basic:    "bg-gray-100 text-gray-600",
};

export default async function AdminProvidersPage({ searchParams }: PageProps) {
  const { q, status, tier, city, category } = await searchParams;

  const sb = createAdminClient();
  let query = sb
    .from("providers")
    .select("id,business_name,email,tier,city,category,approval_status,billing_active,founding_member,created_at,slug")
    .order("created_at", { ascending: false });

  if (status)   query = query.eq("approval_status", status);
  if (tier)     query = query.eq("tier", tier);
  if (city)     query = query.eq("city", city);
  if (category) query = query.eq("category", category);
  if (q?.trim()) {
    const safe = q.trim().replace(/[%_\\]/g, "\\$&");
    query = query.or(
      `business_name.ilike.%${safe}%,email.ilike.%${safe}%,contact_name.ilike.%${safe}%`
    );
  }

  const { data: rawProviders } = await query;
  const providers = rawProviders ?? [];

  // Summary counts (always unfiltered)
  const { data: allStatuses } = await sb
    .from("providers")
    .select("approval_status");
  const counts = (allStatuses ?? []).reduce(
    (acc, p) => { acc[p.approval_status] = (acc[p.approval_status] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );

  return (
    <main className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Providers</h1>
          <div className="flex gap-4 mt-1 text-xs text-gray-500">
            <span><span className="font-semibold text-amber-600">{counts.Pending ?? 0}</span> pending</span>
            <span><span className="font-semibold text-green-600">{counts.Approved ?? 0}</span> approved</span>
            <span><span className="font-semibold text-red-500">{counts.Suspended ?? 0}</span> suspended</span>
          </div>
        </div>
        <Link
          href="/admin/providers/new"
          className="bg-[#1B4FD8] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          + Add Provider
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
        <ProvidersFilters q={q} status={status} tier={tier} city={city} category={category} />
      </div>

      {/* Result count */}
      <p className="text-sm text-gray-500 mb-3">
        {providers.length} {providers.length === 1 ? "provider" : "providers"} found
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FA] border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Tier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">City · Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Billing</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">FM</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {providers.length === 0 ? (
                <tr>
                  <td colSpan={99} className="px-4 py-10 text-center text-gray-400 text-sm">
                    No providers found.
                  </td>
                </tr>
              ) : (
                (providers as Provider[]).map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8F9FA] transition-colors">
                    {/* Business */}
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/providers/${p.id}`}
                        className="font-semibold text-[#111827] hover:text-[#1B4FD8] transition-colors block truncate max-w-[180px]"
                      >
                        {p.business_name}
                      </Link>
                      <span className="text-xs text-gray-400 truncate block max-w-[180px]">
                        {p.email}
                      </span>
                    </td>

                    {/* Tier — hidden on mobile */}
                    <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TIER_BADGE[p.tier]}`}>
                        {p.tier}
                      </span>
                    </td>

                    {/* City · Category — hidden on mobile */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="whitespace-nowrap text-xs text-gray-700">{p.city}</p>
                      <p className="text-xs text-gray-400">{p.category}</p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[p.approval_status]}`}>
                        {p.approval_status}
                      </span>
                    </td>

                    {/* Billing — hidden on mobile/tablet */}
                    <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                      <span className={`text-xs font-medium ${p.billing_active ? "text-green-600" : "text-gray-400"}`}>
                        {p.billing_active ? "Active" : "—"}
                      </span>
                    </td>

                    {/* Founding member — hidden on mobile/tablet */}
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      {p.founding_member && <span title="Founding Member">🎯</span>}
                    </td>

                    {/* Joined — hidden on mobile */}
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 hidden md:table-cell">
                      {new Date(p.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {p.approval_status !== "Approved" && (
                          <form action={approveProvider.bind(null, p.id)}>
                            <button
                              type="submit"
                              className="text-xs font-semibold text-green-700 hover:text-green-900 transition-colors px-3 min-h-[44px] flex items-center"
                            >
                              Approve
                            </button>
                          </form>
                        )}
                        {p.approval_status === "Approved" && (
                          <form action={suspendProvider.bind(null, p.id)}>
                            <button
                              type="submit"
                              className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors px-3 min-h-[44px] flex items-center"
                            >
                              Suspend
                            </button>
                          </form>
                        )}
                        <Link
                          href={`/admin/providers/${p.id}`}
                          className="text-xs font-semibold text-[#1B4FD8] hover:underline px-3 min-h-[44px] flex items-center"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
