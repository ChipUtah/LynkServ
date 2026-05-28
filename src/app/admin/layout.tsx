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

  // Middleware already redirects unauthenticated/non-admin users to /admin/login.
  // The layout must NOT redirect — it also runs on /admin/login itself, and
  // redirecting from there creates an infinite loop.
  // Instead: render bare children (the login form) when not authenticated,
  // and the full dashboard shell when authenticated as admin.
  if (!user || !isAdmin(user.email)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <AdminSidebar email={user.email!} />
      <div className="lg:pl-56 pt-14 lg:pt-0">{children}</div>
    </div>
  );
}
