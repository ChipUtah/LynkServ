-- Migration 001: Add subcategories support
-- Run this in the Supabase SQL editor before deploying the frontend changes.

-- 1. Add subcategories column to providers (text array of subcategory slugs, max 3)
ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS subcategories text[] NOT NULL DEFAULT '{}';

-- 2. Add subcategory_slug to waitlist for subcategory-level cap tracking
ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS subcategory_slug text;

-- 3. Index for efficient subcategory-level cap queries
CREATE INDEX IF NOT EXISTS idx_providers_subcategories
  ON providers USING GIN (subcategories);

-- 4. Index for subcategory+city+tier cap checks
CREATE INDEX IF NOT EXISTS idx_providers_city_tier_subcategories
  ON providers (city, tier, approval_status);
