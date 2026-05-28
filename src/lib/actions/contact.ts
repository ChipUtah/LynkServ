"use server";

export type ContactPayload = {
  name: string;
  email: string;
  reason: string;
  message: string;
};

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function submitContact(
  payload: ContactPayload
): Promise<ContactResult> {
  const { name, email, reason, message } = payload;

  if (!name.trim()) return { ok: false, error: "Name is required." };
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "A valid email address is required." };
  if (!reason) return { ok: false, error: "Please select a reason." };
  if (!message.trim() || message.trim().length < 10)
    return { ok: false, error: "Message must be at least 10 characters." };

  // TODO: send via Brevo API
  // const brevo = new Brevo(process.env.BREVO_API_KEY!)
  // await brevo.sendEmail({ to: "hello@lynkserv.com", subject: `Contact: ${reason}`, ... })

  console.log("[Contact form]", { name, email, reason, message: message.slice(0, 80) });

  return { ok: true };
}
