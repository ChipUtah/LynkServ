"use client";

import { useState } from "react";
import Link from "next/link";

type Billing = "monthly" | "annual";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    description: "Get found in the LynkServ directory.",
    monthly: { price: 29,  priceId: "price_1S4XxGGq5o2oFHPFnjgprCMo" },
    annual:  { price: 24,  total: 289, priceId: "price_1TZ1oaGq5o2oFHPFaELrN1S6" },
    features: [
      "Listed in Utah service directory",
      "Business profile with description",
      "Phone & website contact buttons",
      "City & category search listing",
      "30-day free trial",
    ],
    notIncluded: [
      "Profile photo",
      "Customer testimonials",
      "First-Time Customer Offer badge",
    ],
    highlighted: false,
    badge: null as string | null,
    badgeStyle: "",
  },
  {
    id: "standard",
    name: "Standard",
    description: "Build trust with a complete, verified profile.",
    monthly: { price: 59,  priceId: "price_1S4XwkGq5o2oFHPFdrHTDOXZ" },
    annual:  { price: 49,  total: 589, priceId: "price_1TZ1p4Gq5o2oFHPFngerNZC8" },
    features: [
      "Everything in Basic",
      "Profile photo",
      "Up to 3 customer testimonials",
      "First-Time Customer Offer badge",
      "Social media links (Facebook, Instagram, LinkedIn)",
      "Standard badge in search results",
      "Max 3 listings per city & category",
    ],
    notIncluded: [
      "Priority placement in search",
      "Analytics dashboard",
    ],
    highlighted: true,
    badge: "Most Popular",
    badgeStyle: "bg-[#1B4FD8] text-white",
  },
  {
    id: "featured",
    name: "Featured",
    description: "Maximum visibility. Always listed first.",
    monthly: { price: 99,  priceId: "price_1S4XwDGq5o2oFHPFX6paRfyA" },
    annual:  { price: 82,  total: 989, priceId: "price_1TZ1rDGq5o2oFHPF5wmcc9Eu" },
    features: [
      "Everything in Standard",
      "Listed FIRST in all search results",
      "Gold Featured badge",
      "Analytics dashboard",
      "Max 3 listings per city & category",
    ],
    notIncluded: [] as string[],
    highlighted: false,
    badge: "Best Visibility",
    badgeStyle: "bg-[#F59E0B] text-[#111827]",
  },
] as const;

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-[#1B4FD8] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function PricingCards() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div>
      {/* ── Toggle ───────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span
          className={`text-sm font-semibold cursor-pointer transition-colors ${
            billing === "monthly" ? "text-[#111827]" : "text-gray-400"
          }`}
          onClick={() => setBilling("monthly")}
        >
          Monthly
        </span>

        <button
          onClick={() => setBilling(billing === "monthly" ? "annual" : "monthly")}
          className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${
            billing === "annual" ? "bg-[#1B4FD8]" : "bg-gray-200"
          }`}
          aria-label="Toggle billing period"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              billing === "annual" ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-semibold cursor-pointer transition-colors ${
              billing === "annual" ? "text-[#111827]" : "text-gray-400"
            }`}
            onClick={() => setBilling("annual")}
          >
            Annual
          </span>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
            Save 17%
          </span>
        </div>
      </div>

      {/* ── Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        {PLANS.map((plan) => {
          const current = billing === "monthly" ? plan.monthly : plan.annual;
          const signupHref = `/provider/signup?plan=${plan.id}&billing=${billing}`;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl flex flex-col overflow-hidden transition-shadow hover:shadow-lg ${
                plan.highlighted
                  ? "ring-2 ring-[#1B4FD8] shadow-md"
                  : "border border-gray-100 shadow-sm"
              }`}
            >
              {/* Badge row */}
              <div className={`h-8 flex items-center justify-center text-xs font-bold uppercase tracking-wider ${
                plan.badge ? plan.badgeStyle : "bg-transparent"
              }`}>
                {plan.badge ?? ""}
              </div>

              {/* Card body */}
              <div className="px-7 pt-6 pb-8 flex flex-col flex-1">
                {/* Plan name + description */}
                <h3 className="text-xl font-bold text-[#111827] mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{plan.description}</p>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-5xl font-extrabold text-[#111827] tracking-tight">
                    ${current.price}
                  </span>
                  <span className="text-gray-400 text-base font-medium">/mo</span>
                </div>

                {billing === "annual" && "total" in current && (
                  <p className="text-sm text-gray-400 mb-6">
                    Billed ${(current as { total: number }).total}/yr
                  </p>
                )}
                {billing === "monthly" && <div className="mb-6" />}

                {/* CTA */}
                <Link
                  href={signupHref}
                  className={`block text-center font-semibold py-3 rounded-xl transition-colors mb-8 text-sm ${
                    plan.highlighted
                      ? "bg-[#1B4FD8] text-white hover:bg-blue-700"
                      : "bg-[#F8F9FA] text-[#1B4FD8] border border-[#1B4FD8] hover:bg-blue-50"
                  }`}
                >
                  Start free trial →
                </Link>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#111827]">
                      <CheckIcon />
                      <span>{f}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <XIcon />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-gray-400 mt-8">
        30-day free trial · No credit card required · Cancel anytime
      </p>
    </div>
  );
}
