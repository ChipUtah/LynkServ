import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = { title: "Admin Login — LynkServ" };

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#111827] flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="text-[#1B4FD8] font-bold text-2xl mb-2">
        LynkServ
      </Link>
      <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-8">
        Admin
      </span>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm px-8 py-8">
        <h1 className="text-xl font-bold text-[#111827] mb-1">Admin sign in</h1>
        <p className="text-sm text-gray-500 mb-7">Restricted access.</p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
