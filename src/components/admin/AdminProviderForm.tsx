"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateProviderAdmin,
  createProviderAdminAndRedirect,
  type AdminUpdateData,
} from "@/lib/actions/admin";
import { CITIES, CATEGORIES } from "@/lib/supabase/types";
import type { Provider } from "@/lib/supabase/types";

interface Props {
  mode: "edit" | "create";
  provider?: Provider;
}

type F = AdminUpdateData & { password?: string };

function blank(): F {
  return {
    business_name: "", contact_name: null, email: "", phone: null, website: null,
    description: null, slug: null, city: "", category: "",
    tier: "Basic", approval_status: "Approved",
    billing_active: false, founding_member: false, sort_order: 0,
    license_number: null, license_verified: false, insurance_verified: false,
    google_rating: null, google_review_count: null,
    ftco_active: false, ftco_type: null, ftco_value: null,
    ftco_description: null, ftco_expiry: null,
    testimonial_1_quote: null, testimonial_1_author: null,
    testimonial_2_quote: null, testimonial_2_author: null,
    testimonial_3_quote: null, testimonial_3_author: null,
    facebook_url: null, instagram_url: null, linkedin_url: null,
    notes: null,
  };
}

function fromProvider(p: Provider): F {
  return {
    business_name: p.business_name,
    contact_name: p.contact_name,
    email: p.email,
    phone: p.phone,
    website: p.website,
    description: p.description,
    slug: p.slug,
    city: p.city,
    category: p.category,
    tier: p.tier,
    approval_status: p.approval_status,
    billing_active: p.billing_active,
    founding_member: p.founding_member,
    sort_order: p.sort_order,
    license_number: p.license_number,
    license_verified: p.license_verified,
    insurance_verified: p.insurance_verified,
    google_rating: p.google_rating,
    google_review_count: p.google_review_count,
    ftco_active: p.ftco_active,
    ftco_type: p.ftco_type,
    ftco_value: p.ftco_value,
    ftco_description: p.ftco_description,
    ftco_expiry: p.ftco_expiry,
    testimonial_1_quote: p.testimonial_1_quote,
    testimonial_1_author: p.testimonial_1_author,
    testimonial_2_quote: p.testimonial_2_quote,
    testimonial_2_author: p.testimonial_2_author,
    testimonial_3_quote: p.testimonial_3_quote,
    testimonial_3_author: p.testimonial_3_author,
    facebook_url: p.facebook_url,
    instagram_url: p.instagram_url,
    linkedin_url: p.linkedin_url,
    notes: p.notes,
  };
}

const inputCls = "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-[#111827] outline-none focus:border-[#1B4FD8] transition-colors bg-white";
const checkCls = "w-4 h-4 rounded border-gray-300 text-[#1B4FD8] cursor-pointer";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 pt-2">
      {children}
    </p>
  );
}

function Field({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return (
    <div className={half ? "col-span-1" : ""}>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

export function AdminProviderForm({ mode, provider }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<F>(provider ? fromProvider(provider) : blank());
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  function set<K extends keyof F>(key: K, value: F[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function str(v: string | null): string { return v ?? ""; }
  function nullable(v: string): string | null { return v.trim() || null; }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    if (mode === "edit" && provider) {
      const result = await updateProviderAdmin(provider.id, form);
      setSaving(false);
      if (result.ok) { setStatus("ok"); router.refresh(); }
      else { setStatus("error"); setErrMsg(result.error); }
    } else {
      // create mode — action redirects on success
      await createProviderAdminAndRedirect({
        business_name:  form.business_name,
        contact_name:   str(form.contact_name),
        email:          form.email,
        phone:          str(form.phone),
        website:        str(form.website),
        description:    str(form.description),
        city:           form.city,
        category:       form.category,
        tier:           form.tier,
        approval_status: form.approval_status,
        notes:          str(form.notes),
      });
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ── Admin Controls ──────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <SectionTitle>Listing Controls</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label="Status">
            <select value={form.approval_status} onChange={(e) => set("approval_status", e.target.value as never)} className={inputCls}>
              {["Pending", "Approved", "Suspended"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Tier">
            <select value={form.tier} onChange={(e) => set("tier", e.target.value as never)} className={inputCls}>
              {["Basic", "Standard", "Featured"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Sort Order">
            <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} className={inputCls} />
          </Field>
          <Field label="Slug">
            <input type="text" value={str(form.slug)} onChange={(e) => set("slug", nullable(e.target.value))} className={inputCls} placeholder="auto-generated" />
          </Field>
        </div>
        <div className="flex flex-wrap gap-5 mt-4">
          {([ ["billing_active", "Billing Active"], ["founding_member", "Founding Member"], ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#111827]">
              <input type="checkbox" checked={form[key] as boolean} onChange={(e) => set(key, e.target.checked as never)} className={checkCls} />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* ── Business Info ───────────────────────────── */}
      <div>
        <SectionTitle>Business Info</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Business Name *">
            <input required value={form.business_name} onChange={(e) => set("business_name", e.target.value)} className={inputCls} placeholder="Jim's Plumbing" />
          </Field>
          <Field label="Contact Name">
            <input value={str(form.contact_name)} onChange={(e) => set("contact_name", nullable(e.target.value))} className={inputCls} />
          </Field>
          <Field label="Email *">
            <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Phone">
            <input type="tel" value={str(form.phone)} onChange={(e) => set("phone", nullable(e.target.value))} className={inputCls} />
          </Field>
          <Field label="Website">
            <input value={str(form.website)} onChange={(e) => set("website", nullable(e.target.value))} className={inputCls} placeholder="https://…" />
          </Field>
          <Field label="Category *">
            <select required value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
              <option value="">Select…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="City *">
            <select required value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls}>
              <option value="">Select…</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Description">
            <textarea rows={4} value={str(form.description)} onChange={(e) => set("description", nullable(e.target.value))} className={`${inputCls} resize-none`} maxLength={500} />
          </Field>
        </div>
      </div>

      {/* ── Verification & Ratings ──────────────────── */}
      <div>
        <SectionTitle>Verification &amp; Ratings</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Field label="License Number">
            <input value={str(form.license_number)} onChange={(e) => set("license_number", nullable(e.target.value))} className={inputCls} />
          </Field>
          <Field label="Google Rating">
            <input type="number" step="0.1" min="0" max="5" value={form.google_rating ?? ""} onChange={(e) => set("google_rating", e.target.value ? parseFloat(e.target.value) : null)} className={inputCls} placeholder="4.8" />
          </Field>
          <Field label="Review Count">
            <input type="number" min="0" value={form.google_review_count ?? ""} onChange={(e) => set("google_review_count", e.target.value ? parseInt(e.target.value) : null)} className={inputCls} placeholder="124" />
          </Field>
        </div>
        <div className="flex gap-5">
          {([ ["license_verified", "License Verified"], ["insurance_verified", "Insurance Verified"], ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#111827]">
              <input type="checkbox" checked={form[key] as boolean} onChange={(e) => set(key, e.target.checked as never)} className={checkCls} />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* ── FTCO ────────────────────────────────────── */}
      <div>
        <SectionTitle>First-Time Customer Offer</SectionTitle>
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#111827] mb-4">
          <input type="checkbox" checked={form.ftco_active} onChange={(e) => set("ftco_active", e.target.checked)} className={checkCls} />
          FTCO Active
        </label>
        {form.ftco_active && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Type"><input value={str(form.ftco_type)} onChange={(e) => set("ftco_type", nullable(e.target.value))} className={inputCls} placeholder="Free Estimate" /></Field>
            <Field label="Value"><input value={str(form.ftco_value)} onChange={(e) => set("ftco_value", nullable(e.target.value))} className={inputCls} placeholder="$25 off" /></Field>
            <Field label="Description">
              <textarea rows={2} value={str(form.ftco_description)} onChange={(e) => set("ftco_description", nullable(e.target.value))} className={`${inputCls} resize-none`} />
            </Field>
            <Field label="Expiry Date">
              <input type="date" value={str(form.ftco_expiry)} onChange={(e) => set("ftco_expiry", nullable(e.target.value))} className={inputCls} />
            </Field>
          </div>
        )}
      </div>

      {/* ── Testimonials ────────────────────────────── */}
      {(form.tier === "Standard" || form.tier === "Featured") && (
        <div>
          <SectionTitle>Testimonials</SectionTitle>
          <div className="space-y-4">
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={`Quote ${n}`}>
                  <textarea rows={2} value={str(form[`testimonial_${n}_quote`])} onChange={(e) => set(`testimonial_${n}_quote`, nullable(e.target.value) as never)} className={`${inputCls} resize-none`} placeholder="Great service, highly recommend!" />
                </Field>
                <Field label={`Author ${n}`}>
                  <input value={str(form[`testimonial_${n}_author`])} onChange={(e) => set(`testimonial_${n}_author`, nullable(e.target.value) as never)} className={inputCls} placeholder="Jane D." />
                </Field>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Social Links ────────────────────────────── */}
      <div>
        <SectionTitle>Social Links</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {([ ["facebook_url", "Facebook"], ["instagram_url", "Instagram"], ["linkedin_url", "LinkedIn"], ] as const).map(([key, label]) => (
            <Field key={key} label={label}>
              <input value={str(form[key])} onChange={(e) => set(key, nullable(e.target.value) as never)} className={inputCls} placeholder="https://…" />
            </Field>
          ))}
        </div>
      </div>

      {/* ── Admin Notes ─────────────────────────────── */}
      <div>
        <SectionTitle>Admin Notes</SectionTitle>
        <textarea rows={3} value={str(form.notes)} onChange={(e) => set("notes", nullable(e.target.value))} className={`${inputCls} resize-none`} placeholder="Internal notes visible only to admins…" />
      </div>

      {/* ── Feedback + Submit ───────────────────────── */}
      {status === "ok" && (
        <p className="text-sm text-green-700 bg-green-50 px-4 py-2.5 rounded-xl">
          ✓ Saved successfully.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{errMsg}</p>
      )}

      <div className="flex gap-3 pb-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1B4FD8] text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : mode === "create" ? "Create Provider" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
