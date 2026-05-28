"use client";

import { useState } from "react";

export interface AccountData {
  contactName: string;
  email: string;
  password: string;
}

interface Props {
  data: AccountData;
  onChange: (data: AccountData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepAccount({ data, onChange, onNext, onBack }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AccountData, string>>>({});

  function set(field: keyof AccountData, value: string) {
    onChange({ ...data, [field]: value });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e: typeof errors = {};
    if (!data.contactName.trim())   e.contactName = "Your name is required.";
    if (!data.email.trim())         e.email       = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                                    e.email       = "Enter a valid email address.";
    if (!data.password)             e.password    = "Password is required.";
    else if (data.password.length < 8)
                                    e.password    = "Password must be at least 8 characters.";
    return e;
  }

  function handleNext() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onNext();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#111827] mb-1">Create your account</h2>
      <p className="text-sm text-gray-500 mb-7">
        You&apos;ll use this to manage your listing and update your profile.
      </p>

      <div className="space-y-5">
        {/* Contact Name */}
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Your Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={data.contactName}
            onChange={(e) => set("contactName", e.target.value)}
            placeholder="First and last name"
            autoComplete="name"
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#111827] outline-none transition-colors ${
              errors.contactName ? "border-red-300" : "border-gray-200 focus:border-[#1B4FD8]"
            }`}
          />
          {errors.contactName && (
            <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#111827] outline-none transition-colors ${
              errors.email ? "border-red-300" : "border-gray-200 focus:border-[#1B4FD8]"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              className={`w-full pl-4 pr-12 py-3 rounded-xl border text-sm text-[#111827] outline-none transition-colors ${
                errors.password ? "border-red-300" : "border-gray-200 focus:border-[#1B4FD8]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        We&apos;ll send a confirmation email to verify your address.
      </p>

      <div className="flex gap-3 mt-6">
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
          Review →
        </button>
      </div>
    </div>
  );
}
