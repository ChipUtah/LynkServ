"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendApprovalEmail } from "@/lib/brevo";
import type { Tier, ApprovalStatus, Provider } from "@/lib/supabase/types";

// ─── Auth guard ───────────────────────────────────────────────

async function getAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const emails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!user || !emails.includes(user.email?.toLowerCase() ?? "")) return null;
  return user;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

// ─── Slug util ────────────────────────────────────────────────

function makeSlug(businessName: string, city: string): string {
  return `${businessName} ${city}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeUrl(raw: string | null | undefined): string | null {
  const s = (raw ?? "").trim();
  if (!s) return null;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

// ─── Provider actions ─────────────────────────────────────────

// Return void so these can be used directly as <form action={...}>
export async function approveProvider(id: string): Promise<void> {
  if (!(await getAdmin())) return;
  const sb = createAdminClient();
  await sb.from("providers").update({ approval_status: "Approved" }).eq("id", id);
  revalidatePath("/admin/providers");
  revalidatePath(`/admin/providers/${id}`);

  // Send approval notification — non-blocking
  sb.from("providers").select("*").eq("id", id).maybeSingle().then(({ data }) => {
    if (!data) return;
    const p = data as Provider;
    sendApprovalEmail({
      email:         p.email,
      contactName:   p.contact_name,
      businessName:  p.business_name,
      category:      p.category,
      city:          p.city,
      slug:          p.slug,
      id:            p.id,
      foundingMember: p.founding_member,
      trial_start:   p.trial_start,
    }).catch((err) =>
      console.error("[approveProvider] Approval email error:", err)
    );
  });
}

export async function suspendProvider(id: string): Promise<void> {
  if (!(await getAdmin())) return;
  const sb = createAdminClient();
  await sb.from("providers").update({ approval_status: "Suspended" }).eq("id", id);
  revalidatePath("/admin/providers");
  revalidatePath(`/admin/providers/${id}`);
}

// ─── Full provider update (admin can change any field) ────────

export interface AdminUpdateData {
  business_name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  description: string | null;
  slug: string | null;
  city: string;
  category: string;
  subcategories: string[];
  tier: Tier;
  approval_status: ApprovalStatus;
  billing_active: boolean;
  founding_member: boolean;
  sort_order: number;
  license_number: string | null;
  license_verified: boolean;
  insurance_verified: boolean;
  google_rating: number | null;
  google_review_count: number | null;
  ftco_active: boolean;
  ftco_type: string | null;
  ftco_value: string | null;
  ftco_description: string | null;
  ftco_expiry: string | null;
  testimonial_1_quote: string | null;
  testimonial_1_author: string | null;
  testimonial_2_quote: string | null;
  testimonial_2_author: string | null;
  testimonial_3_quote: string | null;
  testimonial_3_author: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  notes: string | null;
}

export async function updateProviderAdmin(
  id: string,
  data: AdminUpdateData
): Promise<ActionResult> {
  if (!(await getAdmin())) return { ok: false, error: "Unauthorized" };
  const sb = createAdminClient();
  const { error } = await sb
    .from("providers")
    .update({
      ...data,
      website:       normalizeUrl(data.website),
      facebook_url:  normalizeUrl(data.facebook_url),
      instagram_url: normalizeUrl(data.instagram_url),
      linkedin_url:  normalizeUrl(data.linkedin_url),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/providers");
  revalidatePath(`/admin/providers/${id}`);
  return { ok: true };
}

// ─── Create provider manually (no Stripe, no auth user required) ──

export interface AdminCreateData {
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  city: string;
  category: string;
  subcategories: string[];
  tier: Tier;
  approval_status: ApprovalStatus;
  notes: string;
}

export async function createProviderAdmin(
  data: AdminCreateData
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!(await getAdmin())) return { ok: false, error: "Unauthorized" };
  const sb = createAdminClient();

  // Generate unique slug
  const baseSlug = makeSlug(data.business_name, data.city);
  const { data: existing } = await sb
    .from("providers")
    .select("id")
    .eq("slug", baseSlug)
    .maybeSingle();
  const slug = existing
    ? `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
    : baseSlug;

  const { data: row, error } = await sb
    .from("providers")
    .insert({
      user_id:         null,
      business_name:   data.business_name.trim(),
      contact_name:    data.contact_name.trim() || null,
      email:           data.email.trim().toLowerCase(),
      phone:           data.phone.trim() || null,
      website:         normalizeUrl(data.website),
      description:     data.description.trim() || null,
      city:            data.city,
      category:        data.category,
      subcategories:   data.subcategories.slice(0, 3),
      tier:            data.tier,
      approval_status: data.approval_status,
      billing_active:  false,
      founding_member: false,
      slug,
      notes:           data.notes.trim() || null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/providers");
  return { ok: true, id: row.id };
}

export async function createProviderAdminAndRedirect(
  data: AdminCreateData
): Promise<void> {
  const result = await createProviderAdmin(data);
  if (result.ok) redirect(`/admin/providers/${result.id}`);
}

// ─── Change password ──────────────────────────────────────────

export async function changeAdminPassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, error: "Not authenticated." };

  // Verify current password by re-authenticating
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: data.currentPassword,
  });
  if (signInError) return { ok: false, error: "Current password is incorrect." };

  // Update password via admin client (avoids session side-effects)
  const sb = createAdminClient();
  const { error: updateError } = await sb.auth.admin.updateUserById(user.id, {
    password: data.newPassword,
  });
  if (updateError) return { ok: false, error: updateError.message };

  return { ok: true };
}

// ─── Waitlist actions ─────────────────────────────────────────

export async function markWaitlistContacted(
  id: string,
  contacted: boolean
): Promise<void> {
  if (!(await getAdmin())) return;
  const sb = createAdminClient();
  await sb.from("waitlist").update({ contacted }).eq("id", id);
  revalidatePath("/admin/waitlist");
}

export async function deleteWaitlistEntry(id: string): Promise<void> {
  if (!(await getAdmin())) return;
  const sb = createAdminClient();
  await sb.from("waitlist").delete().eq("id", id);
  revalidatePath("/admin/waitlist");
}
