"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function ConditionalNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/provider/dashboard") || pathname.startsWith("/admin")) return null;
  return <Navbar />;
}
