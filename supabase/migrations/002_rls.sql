-- ============================================================
-- LynkServ — Row Level Security
-- Run AFTER 001_schema.sql
-- ============================================================

-- ─── providers ───────────────────────────────────────────────

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Public: read approved providers only
CREATE POLICY "providers_public_read"
  ON providers FOR SELECT
  USING (approval_status = 'Approved');

-- Provider: read their own record regardless of status
CREATE POLICY "providers_own_read"
  ON providers FOR SELECT
  USING (auth.uid() = user_id);

-- Provider: update their own record (cannot change tier, approval_status, billing fields)
CREATE POLICY "providers_own_update"
  ON providers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Provider: insert their own record on signup
CREATE POLICY "providers_own_insert"
  ON providers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin: full access via service_role key (bypasses RLS automatically)
-- No additional policy needed — service_role always bypasses RLS.

-- ─── waitlist ─────────────────────────────────────────────────

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Public: anyone can join the waitlist
CREATE POLICY "waitlist_public_insert"
  ON waitlist FOR INSERT
  WITH CHECK (true);

-- ─── newsletter_subscribers ───────────────────────────────────

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public: anyone can subscribe
CREATE POLICY "newsletter_public_insert"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);
