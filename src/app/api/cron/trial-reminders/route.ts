// Daily cron job — sends trial-ending reminders to providers whose
// 30-day trial expires in exactly 3 days (trial_start between 27–28 days ago).
//
// Scheduled via vercel.json: runs at 14:00 UTC (8am MT) every day.
// Protected with CRON_SECRET — Vercel passes it automatically as Bearer token.

import { createAdminClient } from "@/lib/supabase/admin";
import { sendTrialEndingEmail } from "@/lib/brevo";
import type { Provider } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BREVO_API_KEY) {
    return Response.json({ skipped: true, reason: "BREVO_API_KEY not configured" });
  }

  const sb = createAdminClient();

  // Providers whose trial started between 27 and 28 days ago
  // → trial ends in 2–3 days → send the "3 days left" reminder
  const upperBound = new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString();
  const lowerBound = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString();

  const { data: providers, error } = await sb
    .from("providers")
    .select("email, contact_name, business_name, founding_member, trial_start")
    .gte("trial_start", lowerBound)
    .lt("trial_start", upperBound)
    .eq("billing_active", false)
    .eq("approval_status", "Approved");

  if (error) {
    console.error("[cron/trial-reminders] DB error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }

  const rows = (providers ?? []) as Pick<
    Provider,
    "email" | "contact_name" | "business_name" | "founding_member" | "trial_start"
  >[];

  let sent = 0;
  let failed = 0;

  for (const p of rows) {
    if (!p.trial_start) continue;
    try {
      await sendTrialEndingEmail({
        email:         p.email,
        contactName:   p.contact_name,
        businessName:  p.business_name,
        foundingMember: p.founding_member,
        trialStart:    p.trial_start,
      });
      sent++;
    } catch (err) {
      console.error("[cron/trial-reminders] Email error for", p.email, err);
      failed++;
    }
  }

  console.log(`[cron/trial-reminders] Done — sent: ${sent}, failed: ${failed}`);
  return Response.json({ sent, failed, total: rows.length });
}
