"use client";

import { useState } from "react";
import { submitContact } from "@/lib/actions/contact";

const REASONS = [
  "I'm a homeowner with a question",
  "I'm a provider with a listing or billing question",
  "I want to report a listing",
  "I have a partnership inquiry",
  "Other",
];

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#111827] outline-none focus:border-[#1B4FD8] transition-colors bg-white";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await submitContact(form);
    setSubmitting(false);

    if (result.ok) {
      setDone(true);
    } else {
      setError(result.error);
    }
  }

  if (done) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-2xl px-6 py-10 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-bold text-[#111827] mb-1">Message received</p>
        <p className="text-sm text-gray-500">
          We&apos;ll get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Your name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            autoComplete="name"
            className={inputCls}
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Email address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
            autoComplete="email"
            className={inputCls}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#111827] mb-1.5">
          What&apos;s this about? <span className="text-red-400">*</span>
        </label>
        <select
          value={form.reason}
          onChange={(e) => set("reason", e.target.value)}
          required
          className={inputCls}
        >
          <option value="">Select a reason…</option>
          {REASONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#111827] mb-1.5">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          required
          rows={5}
          className={`${inputCls} resize-none`}
          placeholder="Tell us what's on your mind…"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#1B4FD8] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending…
          </>
        ) : (
          "Send message →"
        )}
      </button>
    </form>
  );
}
