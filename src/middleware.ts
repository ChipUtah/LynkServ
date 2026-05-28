import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isAdmin(email?: string | null): boolean {
  return !!email && adminEmails().includes(email.toLowerCase());
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Admin routes ──────────────────────────────────────────
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    if (!isAdmin(user.email)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in admins away from admin login
  if (user && pathname === "/admin/login" && isAdmin(user.email)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/providers";
    return NextResponse.redirect(url);
  }

  // ── Provider dashboard routes ─────────────────────────────
  if (!user && pathname.startsWith("/provider/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/provider/login";
    return NextResponse.redirect(url);
  }

  // Redirect logged-in providers away from login
  // (Admins landing on /provider/login go to admin dashboard)
  if (user && pathname === "/provider/login") {
    const url = request.nextUrl.clone();
    url.pathname = isAdmin(user.email) ? "/admin/providers" : "/provider/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
