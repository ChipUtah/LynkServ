import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Provider } from "@/lib/supabase/types";

function trialDaysLeft(trialStart: string | null): number | null {
  if (!trialStart) return null;
  const end = new Date(trialStart).getTime() + 30 * 24 * 60 * 60 * 1000;
  const left = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
  return left > 0 ? left : 0;
}

function StatusCard({ p }: { p: Provider }) {
  const configs = {
    Approved: {
      bg: "bg-green-50 border-green-200",
      dot: "bg-green-500",
      title: "Your listing is live",
      body: "Homeowners in your area can find and contact you.",
    },
    Pending: {
      bg: "bg-amber-50 border-amber-200",
      dot: "bg-amber-400",
      title: "Under review",
      body: "We'll review your listing within 24 hours and notify you by email.",
    },
    Suspended: {
      bg: "bg-red-50 border-red-200",
      dot: "bg-red-500",
      title: "Listing suspended",
      body: "Your listing is not visible. Contact support for assistance.",
    },
  };
  const c = configs[p.approval_status as keyof typeof configs] ?? configs.Pending;

  return (
    <div className={`rounded-2xl border p-5 ${c.bg}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
        <span className="font-bold text-[#111827]">{c.title}</span>
      </div>
      <p className="text-sm text-gray-600 ml-4.5">{c.body}</p>
      {p.approval_status === "Approved" && (
        <Link
          href={`/providers/${p.slug ?? p.id}`}
          target="_blank"
          className="inline-block mt-3 ml-4.5 text-xs font-semibold text-[#1B4FD8] hover:underline"
        >
          View your listing ↗
        </Link>
      )}
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
  cta,
}: {
  href: string;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
    >
      <div>
        <p className="font-bold text-[#111827] mb-1">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="text-sm font-semibold text-[#1B4FD8]">{cta} →</span>
    </Link>
  );
}

export default async function DashboardOverview() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/provider/login");

  const { data } = await supabase
    .from("providers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) redirect("/provider/signup");

  const p = data as Provider;
  const daysLeft = trialDaysLeft(p.trial_start);
  const firstName = p.contact_name?.split(" ")[0];

  return (
    <main className="p-6 md:p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">
          Welcome back{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="text-sm text-gray-500 mt-1">{p.business_name}</p>
      </div>

      {/* Status */}
      <StatusCard p={p} />

      {/* Trial */}
      {daysLeft !== null && (
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#111827] text-sm">
              {daysLeft > 0 ? `${daysLeft} days left in your free trial` : "Free trial ended"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              No credit card required until your trial ends.
            </p>
          </div>
          <Link
            href="/provider/dashboard/billing"
            className="shrink-0 text-xs font-semibold text-[#1B4FD8] hover:underline"
          >
            Manage plan →
          </Link>
        </div>
      )}

      {/* Founding member */}
      {p.founding_member && (
        <div className="mt-4 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-xl">🎯</span>
          <div>
            <p className="text-sm font-bold text-[#111827]">You&apos;re a Founding Member</p>
            <p className="text-xs text-gray-600 mt-0.5">
              50% off for your first 3 months — applied automatically when your trial ends.
            </p>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mt-8 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickAction
          href="/provider/dashboard/profile"
          title="Edit Profile"
          description="Update your description, contact info, and social links."
          cta="Edit profile"
        />
        <QuickAction
          href="/provider/dashboard/ftco"
          title="First-Time Offer"
          description={p.ftco_active ? "Your offer is active and showing on your profile." : "Add a special offer for new customers."}
          cta={p.ftco_active ? "Manage offer" : "Set up offer"}
        />
        <QuickAction
          href="/provider/dashboard/billing"
          title="Billing & Plan"
          description={`You're on the ${p.tier} plan. ${daysLeft && daysLeft > 0 ? `Trial ends in ${daysLeft} days.` : ""}`}
          cta="View billing"
        />
      </div>

      {/* Analytics teaser (Featured only) */}
      {p.tier === "Featured" ? (
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
          <p className="font-bold text-[#111827] mb-1">Analytics</p>
          <p className="text-sm text-gray-400">
            Profile views and contact stats are coming soon.
          </p>
        </div>
      ) : (
        <div className="mt-8 bg-[#F8F9FA] border border-gray-100 rounded-2xl p-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-[#111827] text-sm mb-1">
              Unlock Analytics
            </p>
            <p className="text-xs text-gray-500">
              Upgrade to Featured to see profile views and contact stats.
            </p>
          </div>
          <Link
            href="/provider/dashboard/billing"
            className="shrink-0 text-xs font-semibold text-[#1B4FD8] hover:underline"
          >
            Upgrade →
          </Link>
        </div>
      )}
    </main>
  );
}
