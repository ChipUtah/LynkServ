import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

function isAdmin(email?: string | null) {
  const emails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return !!email && emails.includes(email.toLowerCase());
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <AdminSidebar email={user.email!} />
      <div className="lg:pl-56 pt-14 lg:pt-0">{children}</div>
    </div>
  );
}
