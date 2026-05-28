"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/provider/dashboard") ||
    pathname.startsWith("/provider/login") ||
    pathname.startsWith("/admin")
  )
    return null;
  return <Footer />;
}
