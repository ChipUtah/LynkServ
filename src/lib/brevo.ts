// ─── Brevo transactional email ───────────────────────────────────────────────
// Uses Brevo REST API directly — no SDK needed.
// All four email types: welcome, trial ending, payment failed, approval.

const SITE_URL   = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lynkserv.com";
const SENDER     = { name: "LynkServ", email: "hello@lynkserv.com" };
const BREVO_URL  = "https://api.brevo.com/v3/smtp/email";

// ─── HTML helpers ────────────────────────────────────────────────────────────

function esc(s: string | null | undefined): string {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function btn(href: string, label: string): string {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px">
      <tr>
        <td bgcolor="#1B4FD8" style="border-radius:10px;mso-padding-alt:0">
          <a href="${href}"
             style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;mso-text-raise:3pt">
            ${label}
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 24px;font-size:12px;color:#9CA3AF">
      If the button doesn't work, paste this link into your browser:<br>
      <a href="${href}" style="color:#1B4FD8">${href}</a>
    </p>`;
}

function foundingBadge(): string {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;width:100%">
      <tr>
        <td bgcolor="#FFFBEB" style="border-radius:10px;border:1px solid #FDE68A;padding:14px 18px">
          <p style="margin:0;font-size:13px;color:#92400E;line-height:1.5">
            <strong>🎯 Founding Member benefit:</strong>
            50% off your first 3 months — applied automatically when your trial ends. No code needed.
          </p>
        </td>
      </tr>
    </table>`;
}

function wrap(headline: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(headline)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F9FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111827">
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#F8F9FA;padding:40px 16px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" border="0"
             style="max-width:580px;width:100%">

        <!-- Header -->
        <tr>
          <td bgcolor="#1B4FD8"
              style="padding:22px 36px;border-radius:12px 12px 0 0">
            <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px">
              LynkServ
            </span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td bgcolor="#ffffff"
              style="padding:36px;border-radius:0 0 12px 12px">
            <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#111827;line-height:1.3">
              ${esc(headline)}
            </h1>
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 36px;text-align:center">
            <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6">
              LynkServ &middot; Utah&rsquo;s local service directory<br>
              Questions? Reply to this email — we read every one.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Core send function ───────────────────────────────────────────────────────

async function sendEmail(params: {
  to: string;
  toName?: string | null;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[Brevo] BREVO_API_KEY not configured — skipping email to", params.to);
    return;
  }

  const res = await fetch(BREVO_URL, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email: params.to, ...(params.toName && { name: params.toName }) }],
      subject: params.subject,
      htmlContent: params.html,
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error(`[Brevo] Send failed (${res.status}):`, txt.slice(0, 300));
  }
}

// ─── 1. Welcome email (sent on provider signup) ───────────────────────────────

export async function sendWelcomeEmail(p: {
  email: string;
  contactName: string | null;
  businessName: string;
  foundingMember: boolean;
  trialStart: string;
}): Promise<void> {
  const firstName     = p.contactName?.split(" ")[0] ?? "there";
  const dashboardUrl  = `${SITE_URL}/provider/dashboard`;

  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6">
      Hi ${esc(firstName)},
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6">
      <strong>${esc(p.businessName)}</strong> has been submitted and is under review.
      We'll have it live within 24 hours.
    </p>
    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#111827">What happens next</p>
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;width:100%">
      ${[
        ["1", "We review your listing — usually within 24 hours."],
        ["2", "You get an email the moment it's approved."],
        ["3", "Utah homeowners can find and contact you directly."],
      ].map(([n, txt]) => `
      <tr>
        <td width="32" valign="top" style="padding:4px 12px 4px 0">
          <span style="display:inline-block;width:24px;height:24px;background:#EFF6FF;border-radius:12px;text-align:center;line-height:24px;font-size:12px;font-weight:700;color:#1B4FD8">${n}</span>
        </td>
        <td style="font-size:14px;color:#374151;padding:4px 0;line-height:1.5">${txt}</td>
      </tr>`).join("")}
    </table>
    <p style="margin:0 0 24px;font-size:14px;color:#6B7280;line-height:1.6">
      Your 30-day free trial has started. No credit card needed until day 30.
    </p>
    ${p.foundingMember ? foundingBadge() : ""}
    ${btn(dashboardUrl, "Go to your dashboard →")}
    <p style="margin:24px 0 0;font-size:14px;color:#6B7280">
      — The LynkServ Team
    </p>`;

  await sendEmail({
    to:      p.email,
    toName:  p.contactName,
    subject: `Welcome to LynkServ — ${esc(p.businessName)} is under review`,
    html:    wrap("You're in — listing under review", body),
  });
}

// ─── 2. Trial ending reminder (sent 3 days before trial ends) ────────────────

export async function sendTrialEndingEmail(p: {
  email: string;
  contactName: string | null;
  businessName: string;
  foundingMember: boolean;
  trialStart: string;
}): Promise<void> {
  const firstName    = p.contactName?.split(" ")[0] ?? "there";
  const trialEnd     = new Date(new Date(p.trialStart).getTime() + 30 * 24 * 60 * 60 * 1000);
  const endFormatted = trialEnd.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const billingUrl   = `${SITE_URL}/provider/dashboard/billing`;

  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6">
      Hi ${esc(firstName)},
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6">
      Your free trial for <strong>${esc(p.businessName)}</strong> ends on
      <strong>${endFormatted}</strong> — that's 3 days from now.
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6">
      Add a payment method before then to keep your listing active without interruption.
    </p>
    ${p.foundingMember ? foundingBadge() : ""}
    ${btn(billingUrl, "Activate your subscription →")}
    <p style="margin:0 0 20px;font-size:14px;color:#6B7280;line-height:1.6">
      If you have questions or would like to cancel before your trial ends, just reply
      to this email.
    </p>
    <p style="margin:0;font-size:14px;color:#6B7280">
      — The LynkServ Team
    </p>`;

  await sendEmail({
    to:      p.email,
    toName:  p.contactName,
    subject: `Your LynkServ trial ends in 3 days — ${esc(p.businessName)}`,
    html:    wrap("Your free trial ends in 3 days", body),
  });
}

// ─── 3. Payment failed (sent when Stripe invoice.payment_failed fires) ────────

export async function sendPaymentFailedEmail(p: {
  email: string;
  contactName: string | null;
  businessName: string;
}): Promise<void> {
  const firstName  = p.contactName?.split(" ")[0] ?? "there";
  const billingUrl = `${SITE_URL}/provider/dashboard/billing`;

  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6">
      Hi ${esc(firstName)},
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6">
      We weren't able to process your most recent payment for
      <strong>${esc(p.businessName)}</strong>'s LynkServ subscription.
    </p>
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;width:100%">
      <tr>
        <td bgcolor="#FEF2F2" style="border-radius:10px;border:1px solid #FECACA;padding:14px 18px">
          <p style="margin:0;font-size:13px;color:#991B1B;line-height:1.5">
            Your listing has been paused and is no longer visible in search results.
            It will reactivate automatically once the payment issue is resolved.
          </p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6">
      Update your payment method to get back online:
    </p>
    ${btn(billingUrl, "Update payment method →")}
    <p style="margin:0 0 20px;font-size:14px;color:#6B7280;line-height:1.6">
      If you believe this is an error or have questions, just reply to this email.
    </p>
    <p style="margin:0;font-size:14px;color:#6B7280">
      — The LynkServ Team
    </p>`;

  await sendEmail({
    to:      p.email,
    toName:  p.contactName,
    subject: `Action required — payment issue on your LynkServ account`,
    html:    wrap("Payment could not be processed", body),
  });
}

// ─── 4. Approval notification (sent when admin approves a listing) ────────────

export async function sendApprovalEmail(p: {
  email: string;
  contactName: string | null;
  businessName: string;
  category: string;
  city: string;
  slug: string | null;
  id: string;
  foundingMember: boolean;
  trial_start: string | null;
}): Promise<void> {
  const firstName    = p.contactName?.split(" ")[0] ?? "there";
  const listingUrl   = `${SITE_URL}/providers/${p.slug ?? p.id}`;
  const dashboardUrl = `${SITE_URL}/provider/dashboard`;

  const trialDaysLeft = p.trial_start
    ? Math.max(0, Math.ceil(
        (new Date(p.trial_start).getTime() + 30 * 24 * 60 * 60 * 1000 - Date.now())
        / (1000 * 60 * 60 * 24)
      ))
    : 0;

  const body = `
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6">
      Hi ${esc(firstName)},
    </p>
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;width:100%">
      <tr>
        <td bgcolor="#F0FDF4" style="border-radius:10px;border:1px solid #BBF7D0;padding:14px 18px">
          <p style="margin:0;font-size:14px;color:#14532D;font-weight:600">
            ✓ &nbsp;${esc(p.businessName)} is now live on LynkServ.
          </p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6">
      Utah homeowners searching for <strong>${esc(p.category)}</strong> in
      <strong>${esc(p.city)}</strong> can now find and contact you directly.
    </p>
    ${btn(listingUrl, "View your listing →")}
    ${trialDaysLeft > 0 ? `
    <p style="margin:0 0 24px;font-size:14px;color:#6B7280;line-height:1.6">
      You have <strong>${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"}</strong>
      remaining on your free trial. No credit card needed until it ends.
    </p>` : ""}
    ${p.foundingMember ? foundingBadge() : ""}
    <p style="margin:0 0 12px;font-size:14px;color:#374151;line-height:1.6">
      You can update your listing description, hours, and contact info anytime from
      your dashboard.
    </p>
    <p style="margin:0 0 24px">
      <a href="${dashboardUrl}" style="color:#1B4FD8;font-size:14px;font-weight:600">
        Go to your dashboard →
      </a>
    </p>
    <p style="margin:0;font-size:14px;color:#6B7280">
      — The LynkServ Team
    </p>`;

  await sendEmail({
    to:      p.email,
    toName:  p.contactName,
    subject: `Your LynkServ listing is live — ${esc(p.businessName)}`,
    html:    wrap(`${esc(p.businessName)} is live`, body),
  });
}
