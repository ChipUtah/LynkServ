"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/provider";
import type { Provider } from "@/lib/supabase/types";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#111827] outline-none focus:border-[#1B4FD8] transition-colors";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#111827] mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export function ProfileForm({ provider: p }: { provider: Provider }) {
  const router = useRouter();
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState<"idle" | "ok" | "error">("idle");
  const [errMsg,  setErrMsg]  = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    const result = await updateProfile(new FormData(e.currentTarget));
    setSaving(false);

    if (result.ok) {
      setStatus("ok");
      router.refresh();
    } else {
      setStatus("error");
      setErrMsg(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Core */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Business Name *">
          <input
            name="business_name"
            defaultValue={p.business_name}
            required
            className={inputCls}
            placeholder="Jim's Plumbing"
          />
        </Field>
        <Field label="Your Name">
          <input
            name="contact_name"
            defaultValue={p.contact_name ?? ""}
            className={inputCls}
            placeholder="First and last name"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Phone">
          <input
            name="phone"
            type="tel"
            defaultValue={p.phone ?? ""}
            className={inputCls}
            placeholder="(801) 555-0100"
          />
        </Field>
        <Field label="Website" hint="Include https:// or we'll add it automatically.">
          <input
            name="website"
            defaultValue={p.website ?? ""}
            className={inputCls}
            placeholder="yourwebsite.com"
          />
        </Field>
      </div>

      {/* Category + City (read-only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Category" hint="Contact support to change category.">
          <input
            value={p.category}
            readOnly
            className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`}
          />
        </Field>
        <Field label="City" hint="Contact support to change city.">
          <input
            value={`${p.city}, UT`}
            readOnly
            className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`}
          />
        </Field>
      </div>

      {/* Description */}
      <Field label="Description">
        <textarea
          name="description"
          defaultValue={p.description ?? ""}
          rows={5}
          maxLength={500}
          className={`${inputCls} resize-none`}
          placeholder="Describe your business, services offered, and what makes you stand out…"
        />
      </Field>

      {/* Social */}
      <div>
        <p className="text-sm font-semibold text-[#111827] mb-3">Social Links</p>
        <div className="space-y-3">
          {(
            [
              { name: "facebook_url",  label: "Facebook",  placeholder: "facebook.com/yourbusiness" },
              { name: "instagram_url", label: "Instagram", placeholder: "instagram.com/yourbusiness" },
              { name: "linkedin_url",  label: "LinkedIn",  placeholder: "linkedin.com/company/yourbusiness" },
            ] as const
          ).map(({ name, label, placeholder }) => (
            <div key={name} className="flex items-center gap-3">
              <span className="text-sm text-gray-400 w-20 shrink-0">{label}</span>
              <input
                name={name}
                defaultValue={(p[name] as string | null) ?? ""}
                className={inputCls}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {status === "ok" && (
        <p className="text-sm text-green-700 bg-green-50 px-4 py-2.5 rounded-xl">
          ✓ Changes saved successfully.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">
          {errMsg}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-[#1B4FD8] text-white font-bold px-8 py-3 min-h-[44px] rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
