import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Provider Login — LynkServ",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="text-[#1B4FD8] font-bold text-2xl mb-8">
        LynkServ
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-sm px-8 py-8">
        <h1 className="text-xl font-bold text-[#111827] mb-1">Provider sign in</h1>
        <p className="text-sm text-gray-500 mb-7">
          Manage your listing and profile.
        </p>

        <LoginForm />

        <p className="mt-6 text-center text-xs text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/provider/signup"
            className="text-[#1B4FD8] font-medium hover:underline"
          >
            List your business free →
          </Link>
        </p>
      </div>
    </div>
  );
}
