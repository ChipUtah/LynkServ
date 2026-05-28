import Link from "next/link";
import type { Provider } from "@/lib/supabase/types";

const TIER_STYLES = {
  Featured: {
    badge: "bg-[#F59E0B] text-[#111827]",
    border: "border-l-4 border-l-[#F59E0B]",
    label: "⭐ Featured",
  },
  Standard: {
    badge: "bg-[#1B4FD8] text-white",
    border: "border-l-4 border-l-[#1B4FD8]",
    label: "Standard",
  },
  Basic: {
    badge: "bg-gray-100 text-gray-500",
    border: "",
    label: "Basic",
  },
};

function StarRating({ rating }: { rating: number }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span className="text-[#F59E0B] text-sm tracking-tight">
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
    </span>
  );
}

export function ProviderCard({ provider }: { provider: Provider }) {
  const tier   = TIER_STYLES[provider.tier];
  const href   = `/providers/${provider.slug ?? provider.id}`;
  const initials = provider.business_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article
      className={`bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${tier.border}`}
    >
      <div className="p-5 md:p-6 flex gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-blue-50 text-[#1B4FD8] font-bold text-lg flex items-center justify-center shrink-0">
          {initials}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Name + badges */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link
              href={href}
              className="font-bold text-[#111827] text-lg hover:text-[#1B4FD8] transition-colors leading-tight"
            >
              {provider.business_name}
            </Link>

            {provider.tier !== "Basic" && (
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tier.badge}`}
              >
                {tier.label}
              </span>
            )}

            {provider.ftco_active && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                First-Time Offer
              </span>
            )}
          </div>

          {/* Category · City */}
          <p className="text-sm text-gray-500 mb-2">
            {provider.category} &nbsp;·&nbsp; {provider.city}, UT
          </p>

          {/* Rating */}
          {provider.google_rating != null && (
            <div className="flex items-center gap-1.5 mb-2">
              <StarRating rating={provider.google_rating} />
              <span className="text-sm font-semibold text-[#111827]">
                {provider.google_rating.toFixed(1)}
              </span>
              {provider.google_review_count != null && (
                <span className="text-sm text-gray-400">
                  ({provider.google_review_count.toLocaleString()} reviews)
                </span>
              )}
            </div>
          )}

          {/* Verification */}
          {(provider.license_verified || provider.insurance_verified) && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {provider.license_verified && (
                <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  ✓ Licensed
                </span>
              )}
              {provider.insurance_verified && (
                <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  ✓ Insured
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {provider.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
              {provider.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {provider.phone && (
              <a
                href={`tel:${provider.phone}`}
                className="text-sm font-semibold text-[#1B4FD8] hover:underline"
              >
                {provider.phone}
              </a>
            )}
            <Link
              href={href}
              className="text-sm font-semibold bg-[#1B4FD8] text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Profile
            </Link>
            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-[#111827] transition-colors"
              >
                Website ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* FTCO detail strip */}
      {provider.ftco_active && provider.ftco_description && (
        <div className="border-t border-amber-100 bg-amber-50 px-5 md:px-6 py-3">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">First-Time Offer: </span>
            {provider.ftco_description}
            {provider.ftco_expiry && (
              <span className="text-amber-600 ml-2 text-xs">
                (expires {new Date(provider.ftco_expiry).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})
              </span>
            )}
          </p>
        </div>
      )}
    </article>
  );
}
