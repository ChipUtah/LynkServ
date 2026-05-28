"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire to Brevo API in a later phase
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-[#1B4FD8] font-semibold text-center text-sm">
        ✓ You&apos;re in! We&apos;ll keep you posted.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#111827] outline-none focus:border-[#1B4FD8] transition-colors"
      />
      <button
        type="submit"
        className="bg-[#1B4FD8] text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
