-- ============================================================
-- LynkServ — Billing fields
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS next_billing_date timestamptz;
