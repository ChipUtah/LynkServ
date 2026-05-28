import Link from "next/link";
import { AdminProviderForm } from "@/components/admin/AdminProviderForm";

export default function NewProviderPage() {
  return (
    <main className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/providers" className="text-sm text-gray-400 hover:text-[#111827] transition-colors">
          ← Providers
        </Link>
        <span className="text-gray-200">/</span>
        <h1 className="text-xl font-bold text-[#111827]">Add Provider</h1>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 text-sm text-amber-800">
        <strong>Manual listing:</strong> This provider won&apos;t have a Stripe subscription.
        Billing Active stays off until you enable it. If they later sign up with the same
        email, their account will be linked automatically.
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <AdminProviderForm mode="create" />
      </div>
    </main>
  );
}
