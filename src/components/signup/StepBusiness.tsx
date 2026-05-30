"use client";

import { useState } from "react";
import { CITIES, CATEGORIES } from "@/lib/supabase/types";
import { getSubcategoriesByCategory } from "@/lib/subcategories";

export interface BusinessData {
  businessName: string;
  category: string;
  subcategories: string[]; // slugs, up to 3
  city: string;
  phone: string;
  website: string;
  description: string;
}

interface Props {
  data: BusinessData;
  onChange: (data: BusinessData) => void;
  onNext: () => void;
  onBack: () => void;
}

const DESC_MAX = 500;
const MAX_SUBCATEGORIES = 3;

export function StepBusiness({ data, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessData, string>>>({});
  const [subcatSearch, setSubcatSearch] = useState("");

  const availableSubcats = data.category
    ? getSubcategoriesByCategory(data.category)
    : [];

  const filteredSubcats = subcatSearch.trim()
    ? availableSubcats.filter((s) =>
        s.name.toLowerCase().includes(subcatSearch.toLowerCase())
      )
    : availableSubcats;

  function set(field: keyof BusinessData, value: BusinessData[keyof BusinessData]) {
    onChange({ ...data, [field]: value });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleCategoryChange(newCategory: string) {
    // Clear subcategories when category changes
    onChange({ ...data, category: newCategory, subcategories: [] });
    setSubcatSearch("");
    setErrors((e) => ({ ...e, category: undefined }));
  }

  function toggleSubcategory(slug: string) {
    const current = data.subcategories;
    if (current.includes(slug)) {
      set("subcategories", current.filter((s) => s !== slug));
    } else if (current.length < MAX_SUBCATEGORIES) {
      set("subcategories", [...current, slug]);
    }
  }

  function validate() {
    const e: Partial<Record<keyof BusinessData, string>> = {};
    if (!data.businessName.trim()) e.businessName = "Business name is required.";
    if (!data.category)           e.category      = "Select a category.";
    if (!data.city)               e.city          = "Select a city.";
    return e;
  }

  function handleNext() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onNext();
  }

  const atMax = data.subcategories.length >= MAX_SUBCATEGORIES;

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#111827] mb-1">Your business</h2>
      <p className="text-sm text-gray-500 mb-7">
        This is how you&apos;ll appear in search results.
      </p>

      <div className="space-y-5">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Business Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={data.businessName}
            onChange={(e) => set("businessName", e.target.value)}
            placeholder="e.g. Jim's Plumbing"
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#111827] outline-none transition-colors ${
              errors.businessName ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-[#1B4FD8]"
            }`}
          />
          {errors.businessName && (
            <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>
          )}
        </div>

        {/* Category + City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={data.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-[#111827] bg-white outline-none transition-colors cursor-pointer ${
                errors.category ? "border-red-300" : "border-gray-200 focus:border-[#1B4FD8]"
              }`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              City <span className="text-red-400">*</span>
            </label>
            <select
              value={data.city}
              onChange={(e) => set("city", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-[#111827] bg-white outline-none transition-colors cursor-pointer ${
                errors.city ? "border-red-300" : "border-gray-200 focus:border-[#1B4FD8]"
              }`}
            >
              <option value="">Select a city</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.city && (
              <p className="text-xs text-red-500 mt-1">{errors.city}</p>
            )}
          </div>
        </div>

        {/* Subcategory picker — shown after category selected */}
        {data.category && availableSubcats.length > 0 && (
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="text-sm font-semibold text-[#111827]">
                Specialties{" "}
                <span className="text-gray-400 font-normal">(optional — up to 3)</span>
              </label>
              <span className={`text-xs font-medium ${atMax ? "text-[#1B4FD8]" : "text-gray-400"}`}>
                {data.subcategories.length}/{MAX_SUBCATEGORIES} selected
              </span>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Search within subcategories (shown when > 8 options) */}
              {availableSubcats.length > 8 && (
                <div className="border-b border-gray-100 px-3 py-2">
                  <input
                    type="text"
                    value={subcatSearch}
                    onChange={(e) => setSubcatSearch(e.target.value)}
                    placeholder="Filter specialties…"
                    className="w-full text-sm text-[#111827] outline-none placeholder:text-gray-400"
                  />
                </div>
              )}

              {/* Checkbox list */}
              <div className="max-h-52 overflow-y-auto py-2">
                {filteredSubcats.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">No matches</p>
                ) : (
                  filteredSubcats.map((sub) => {
                    const checked  = data.subcategories.includes(sub.slug);
                    const disabled = !checked && atMax;
                    return (
                      <label
                        key={sub.slug}
                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                          checked   ? "bg-blue-50"
                          : disabled ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => toggleSubcategory(sub.slug)}
                          className="w-4 h-4 rounded border-gray-300 text-[#1B4FD8] cursor-pointer"
                        />
                        <span className="text-sm text-[#111827]">{sub.name}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Selected chips */}
            {data.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.subcategories.map((slug) => {
                  const name = availableSubcats.find((s) => s.slug === slug)?.name ?? slug;
                  return (
                    <span
                      key={slug}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-[#1B4FD8] text-white"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => toggleSubcategory(slug)}
                        className="ml-0.5 hover:opacity-70 transition-opacity"
                        aria-label={`Remove ${name}`}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {atMax && (
              <p className="text-xs text-[#1B4FD8] font-medium mt-1.5">
                Maximum 3 specialties selected.
              </p>
            )}
          </div>
        )}

        {/* Phone + Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Phone <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="(801) 555-0100"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#111827] outline-none focus:border-[#1B4FD8] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Website <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={data.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="yourwebsite.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#111827] outline-none focus:border-[#1B4FD8] transition-colors"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <label className="text-sm font-semibold text-[#111827]">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <span className={`text-xs ${data.description.length > DESC_MAX ? "text-red-400" : "text-gray-400"}`}>
              {data.description.length}/{DESC_MAX}
            </span>
          </div>
          <textarea
            value={data.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe your business, services offered, and what makes you stand out…"
            rows={4}
            maxLength={DESC_MAX}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#111827] outline-none focus:border-[#1B4FD8] transition-colors resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 bg-[#1B4FD8] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
