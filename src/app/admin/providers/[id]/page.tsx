import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { approveProvider, suspendProvider } from "@/lib/actions/admin";
import { AdminProviderForm } from "@/components/admin/AdminProviderForm";
import type { Provider } from "@/lib/supabase/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_BADGE: Record<string, string> = {
  Approved:  "bg-green-100 text-green-700",
  Pending:   "bg-amber-100 text-amber-700",
  Suspended: "bg-red-100 text-red-700",
};

export default async function AdminProviderEditPage({ params }: PageProps) {
  const { id } = await params;
  const sb = createAdminClient();
  const { data } = await sb.from("providers").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  const p = data as Provider;

  return (
    <main className="p-6 md:p-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Link href="/admin/providers" className="text-sm text-gray-400 hover:text-[#111827] transition-colors">
          ← Providers
        </Link>
        <span className="text-gray-200">/</span>
        <h1 className="text-xl font-bold text-[#111827] truncate">{p.business_name}</h1>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[p.approval_status]}`}>
          {p.approval_status}
        </span>
      </div>

      {/* Quick actions bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        {p.approval_status !== "Approved" && (
          <form action={approveProvider.bind(null, p.id)}>
            <button type="submit" className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              ✓ Approve Listing
            </button>
          </form>
        )}
        {p.approval_status === "Approved" && (
          <form action={suspendProvider.bind(null, p.id)}>
            <button type="submit" className="bg-red-50 text-red-600 border border-red-200 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
              Suspend
            </button>
          </form>
        )}
        {p.approval_status === "Approved" && (
          <Link
            href={`/providers/${p.slug ?? p.id}`}
            target="_blank"
            className="bg-[#F8F9FA] border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            View Listing ↗
          </Link>
        )}
      </div>

      {/* Provider metadata */}
      <div className="bg-[#F8F9FA] rounded-xl px-5 py-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {[
          ["ID",      p.id.slice(0, 8) + "…"],
          ["Tier",    p.tier],
          ["City",    p.city],
          ["Joined",  new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-gray-400 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-[#111827] font-medium">{value}</p>
          </div>
        ))}
      </div>

      {/* Full edit form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <AdminProviderForm mode="edit" provider={p} />
      </div>
    </main>
  );
}
