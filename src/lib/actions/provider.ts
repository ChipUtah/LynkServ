"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ─── Auth ─────────────────────────────────────────────────────

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/provider/login");
}

// ─── Profile ──────────────────────────────────────────────────

export type ActionResult = { ok: true } | { ok: false; error: string };

function normalizeUrl(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const { error } = await supabase
    .from("providers")
    .update({
      business_name:  (formData.get("business_name") as string).trim(),
      contact_name:   (formData.get("contact_name")  as string).trim() || null,
      phone:          (formData.get("phone")          as string).trim() || null,
      website:        normalizeUrl(formData.get("website")       as string),
      description:    (formData.get("description")    as string).trim() || null,
      facebook_url:   normalizeUrl(formData.get("facebook_url")  as string),
      instagram_url:  normalizeUrl(formData.get("instagram_url") as string),
      linkedin_url:   normalizeUrl(formData.get("linkedin_url")  as string),
    })
    .eq("user_id", user.id);

  return error ? { ok: false, error: error.message } : { ok: true };
}

// ─── FTCO ─────────────────────────────────────────────────────

export async function updateFTCO(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const active = formData.get("ftco_active") === "true";

  const { error } = await supabase
    .from("providers")
    .update({
      ftco_active:      active,
      ftco_type:        active ? (formData.get("ftco_type")        as string).trim() || null : null,
      ftco_value:       active ? (formData.get("ftco_value")       as string).trim() || null : null,
      ftco_description: active ? (formData.get("ftco_description") as string).trim() || null : null,
      ftco_expiry:      active ? (formData.get("ftco_expiry")      as string) || null : null,
    })
    .eq("user_id", user.id);

  return error ? { ok: false, error: error.message } : { ok: true };
}
