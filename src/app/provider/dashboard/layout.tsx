import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/provider/login");

  const { data: provider } = await supabase
    .from("providers")
    .select("id, business_name, approval_status, tier, slug")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!provider) redirect("/provider/signup");

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <DashboardSidebar provider={provider} />

      {/* Content — offset by sidebar width on desktop, by mobile tab bar at bottom */}
      <div className="lg:pl-60 pb-20 lg:pb-0">
        {children}
      </div>
    </div>
  );
}
