"use client";

import { useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-[#1B4FD8] font-bold text-xl tracking-tight"
        >
          LynkServ
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#111827]">
          <Link href="/search" className="hover:text-[#1B4FD8] transition-colors">
            Find Services
          </Link>
          <Link href="/pricing" className="hover:text-[#1B4FD8] transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-[#1B4FD8] transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/provider/signup"
            className="hidden md:inline-flex items-center bg-[#1B4FD8] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            List your business
          </Link>

          <button
            className="md:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5 text-[#111827]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-3 flex flex-col">
          <Link
            href="/search"
            className="py-3 text-sm font-medium border-b border-gray-50 hover:text-[#1B4FD8] transition-colors"
            onClick={() => setOpen(false)}
          >
            Find Services
          </Link>
          <Link
            href="/pricing"
            className="py-3 text-sm font-medium border-b border-gray-50 hover:text-[#1B4FD8] transition-colors"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="py-3 text-sm font-medium border-b border-gray-50 hover:text-[#1B4FD8] transition-colors"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <div className="pt-3">
            <Link
              href="/provider/signup"
              className="block text-center bg-[#1B4FD8] text-white text-sm font-semibold px-4 py-3 rounded-lg"
              onClick={() => setOpen(false)}
            >
              List your business
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
