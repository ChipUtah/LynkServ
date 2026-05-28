"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type SignupPayload = {
  plan: "basic" | "standard" | "featured";
  billing: "monthly" | "annual";
  businessName: string;
  category: string;
  city: string;
  phone: string;
  website: string;
  description: string;
  contactName: string;
  email: string;
  password: string;
};

export type SignupResult =
  | { ok: true; foundingMember: boolean }
  | { ok: false; error: string; waitlist?: boolean };

export type WaitlistResult =
  | { ok: true }
  | { ok: false; error: string };

const TIER_MAP = {
  basic: "Basic",
  standard: "Standard",
  featured: "Featured",
} as const;

function makeSlug(businessName: string, city: string): string {
  return `${businessName} ${city}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function signupProvider(payload: SignupPayload): Promise<SignupResult> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, error: "Server configuration error. Please try again." };
  }

  const supabase = createAdminClient();
  const tier = TIER_MAP[payload.plan];

  // ── Scarcity cap check (Standard + Featured only) ──────────
  if (tier === "Standard" || tier === "Featured") {
    const { count, error: capError } = await supabase
      .from("providers")
      .select("id", { count: "exact", head: true })
      .eq("city", payload.city)
      .eq("category", payload.category)
      .eq("tier", tier)
      .in("approval_status", ["Approved", "Pending"]);

    if (!capError && (count ?? 0) >= 3) {
      return {
        ok: false,
        error: `${tier} listings for ${payload.category} in ${payload.city} are currently full (max 3). You can join the waitlist.`,
        waitlist: true,
      };
    }
  }

  // ── Founding member check ──────────────────────────────────
  const { count: totalCount } = await supabase
    .from("providers")
    .select("id", { count: "exact", head: true });
  const foundingMember = (totalCount ?? 0) < 100;

  // ── Create auth user ───────────────────────────────────────
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      email_confirm: false,
      user_metadata: { contact_name: payload.contactName.trim() },
    });

  if (authError) {
    const msg = authError.message.toLowerCase();
    if (msg.includes("already registered") || msg.includes("already exists")) {
      return { ok: false, error: "An account with this email already exists. Try signing in." };
    }
    return { ok: false, error: authError.message };
  }

  // ── Link if admin already created a record with this email ──
  const { data: adminCreated } = await supabase
    .from("providers")
    .select("id")
    .eq("email", payload.email.trim().toLowerCase())
    .is("user_id", null)
    .maybeSingle();

  if (adminCreated) {
    await supabase
      .from("providers")
      .update({ user_id: authData.user.id, trial_start: new Date().toISOString() })
      .eq("id", adminCreated.id);
    return { ok: true, foundingMember: false };
  }

  // ── Generate unique slug ───────────────────────────────────
  const baseSlug = makeSlug(payload.businessName, payload.city);
  const { data: slugMatch } = await supabase
    .from("providers")
    .select("id")
    .eq("slug", baseSlug)
    .maybeSingle();
  const slug = slugMatch
    ? `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
    : baseSlug;

  // ── Normalize website URL ──────────────────────────────────
  let website = payload.website.trim() || null;
  if (website && !/^https?:\/\//i.test(website)) {
    website = `https://${website}`;
  }

  // ── Insert provider record ─────────────────────────────────
  const { error: insertError } = await supabase.from("providers").insert({
    user_id: authData.user.id,
    business_name: payload.businessName.trim(),
    contact_name: payload.contactName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim() || null,
    website,
    description: payload.description.trim() || null,
    city: payload.city,
    category: payload.category,
    tier,
    approval_status: "Pending",
    billing_active: false,
    trial_start: new Date().toISOString(),
    founding_member: foundingMember,
    slug,
  });

  if (insertError) {
    // Roll back the auth user so the email can be re-used
    await supabase.auth.admin.deleteUser(authData.user.id);
    return { ok: false, error: "Failed to create your listing. Please try again." };
  }

  return { ok: true, foundingMember };
}

export async function joinWaitlist(data: {
  businessName: string;
  email: string;
  city: string;
  category: string;
  tier: "Standard" | "Featured";
}): Promise<WaitlistResult> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, error: "Server configuration error." };
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("waitlist").insert({
    business_name: data.businessName,
    email: data.email,
    city: data.city,
    category: data.category,
    tier: data.tier,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}
