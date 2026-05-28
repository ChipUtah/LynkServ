/**
 * Sets (or creates) the admin user's password directly via the service role key.
 * Bypasses email confirmation — no redirect URL needed.
 *
 * Usage:
 *   node --env-file=.env.local scripts/set-admin-password.mjs <new-password>
 *
 * Example:
 *   node --env-file=.env.local scripts/set-admin-password.mjs MyPassword123!
 */

import { createClient } from "@supabase/supabase-js";

const EMAIL = "cmccleery@gmail.com";
const password = process.argv[2];

if (!password || password.length < 8) {
  console.error("Error: provide a password of at least 8 characters.");
  console.error("Usage: node --env-file=.env.local scripts/set-admin-password.mjs <password>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Check if user already exists
const { data: { users }, error: listErr } = await sb.auth.admin.listUsers({ perPage: 1000 });
if (listErr) { console.error("List error:", listErr.message); process.exit(1); }

const existing = users.find((u) => u.email === EMAIL);

if (existing) {
  const { error } = await sb.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (error) { console.error("Update error:", error.message); process.exit(1); }
  console.log(`✓ Password updated for ${EMAIL}`);
} else {
  const { data, error } = await sb.auth.admin.createUser({
    email: EMAIL,
    password,
    email_confirm: true,
  });
  if (error) { console.error("Create error:", error.message); process.exit(1); }
  console.log(`✓ Admin user created  — id: ${data.user.id}`);
}

console.log(`\nSign in at: http://localhost:3000/admin/login`);
console.log(`Email:      ${EMAIL}`);
