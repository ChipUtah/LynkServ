import Link from "next/link";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";

interface Props {
  q?: string;
  city?: string;
  category?: string;
}

export function EmptyResults({ q, city, category }: Props) {
  const contextParts = [category, city ? `${city}, UT` : null].filter(Boolean);
  const context = contextParts.length > 0 ? contextParts.join(" in ") : "this area";

  return (
    <div className="py-16 text-center">
      <div className="text-5xl mb-5">🔍</div>

      <h2 className="text-xl font-bold text-[#111827] mb-2">
        No businesses found
        {q ? ` for "${q}"` : ""}
        {contextParts.length > 0 ? ` in ${context}` : ""}
      </h2>
      <p className="text-gray-500 text-sm mb-10 max-w-sm mx-auto">
        Try a broader search or different filters. We&apos;re actively adding vetted
        businesses across Utah.
      </p>

      {/* Notify card */}
      <div className="bg-white rounded-xl border border-gray-100 p-7 max-w-md mx-auto mb-8 text-left">
        <p className="font-semibold text-[#111827] mb-1">
          Be the first to know
        </p>
        <p className="text-sm text-gray-500 mb-5">
          We&apos;ll email you when businesses in {context} join LynkServ.
        </p>
        <NewsletterSignup />
      </div>

      {/* Provider CTA */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>Own a business in this area?</p>
        <Link
          href="/provider/signup"
          className="font-semibold text-[#1B4FD8] hover:underline"
        >
          List your business free — 30 days, no credit card →
        </Link>
      </div>
    </div>
  );
}
