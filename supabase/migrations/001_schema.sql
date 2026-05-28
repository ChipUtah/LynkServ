-- ============================================================
-- LynkServ — Core Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── Providers ───────────────────────────────────────────────

CREATE TABLE providers (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),

  -- Auth link (set when provider creates account)
  user_id               uuid        REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Identity
  business_name         text        NOT NULL,
  contact_name          text,
  email                 text        NOT NULL,
  phone                 text,
  website               text,
  description           text,
  slug                  text        UNIQUE, -- URL-friendly: "jims-plumbing-salt-lake-city"

  -- Location & Category
  city                  text        NOT NULL,
  category              text        NOT NULL,

  -- Membership
  tier                  text        NOT NULL DEFAULT 'Basic'
                          CHECK (tier IN ('Basic', 'Standard', 'Featured')),
  approval_status       text        NOT NULL DEFAULT 'Pending'
                          CHECK (approval_status IN ('Pending', 'Approved', 'Suspended')),
  billing_active        boolean     NOT NULL DEFAULT false,
  trial_start           timestamptz,
  founding_member       boolean     NOT NULL DEFAULT false,
  sort_order            integer     NOT NULL DEFAULT 0, -- manual override within tier

  -- Stripe
  stripe_customer_id    text,
  stripe_subscription_id text,

  -- FTCO (First-Time Customer Offer)
  ftco_active           boolean     NOT NULL DEFAULT false,
  ftco_type             text,        -- e.g. "Discount", "Free Estimate", "Free Consultation"
  ftco_value            text,        -- e.g. "10%", "$25"
  ftco_description      text,
  ftco_expiry           date,

  -- Verification & Ratings
  google_rating         numeric(2,1) CHECK (google_rating >= 0 AND google_rating <= 5),
  google_review_count   integer      CHECK (google_review_count >= 0),
  license_number        text,
  license_verified      boolean     NOT NULL DEFAULT false,
  insurance_verified    boolean     NOT NULL DEFAULT false,

  -- Profile
  profile_photo         text,        -- Supabase Storage path

  -- Testimonials (Standard + Featured only)
  testimonial_1_quote   text,
  testimonial_1_author  text,
  testimonial_2_quote   text,
  testimonial_2_author  text,
  testimonial_3_quote   text,
  testimonial_3_author  text,

  -- Social
  facebook_url          text,
  instagram_url         text,
  linkedin_url          text,

  -- Internal / Admin
  referral_source       text,
  notes                 text
);

-- ─── Waitlist ─────────────────────────────────────────────────
-- Captures providers when Featured/Standard cap (3 per city+category) is full

CREATE TABLE waitlist (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  business_name text,
  email         text        NOT NULL,
  city          text        NOT NULL,
  category      text        NOT NULL,
  tier          text        NOT NULL CHECK (tier IN ('Standard', 'Featured')),
  contacted     boolean     NOT NULL DEFAULT false
);

-- ─── Newsletter Subscribers ───────────────────────────────────

CREATE TABLE newsletter_subscribers (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  email      text        NOT NULL UNIQUE,
  active     boolean     NOT NULL DEFAULT true
);

-- ─── updated_at trigger ───────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Indexes (search performance) ─────────────────────────────

-- Primary search: city + category + approval + tier ordering
CREATE INDEX idx_providers_search
  ON providers (city, category, approval_status, tier);

-- Tier ordering lookup (Featured → Standard → Basic)
CREATE INDEX idx_providers_tier
  ON providers (
    CASE tier WHEN 'Featured' THEN 1 WHEN 'Standard' THEN 2 ELSE 3 END,
    sort_order
  );

-- Admin: find by email
CREATE INDEX idx_providers_email ON providers (email);

-- Provider dashboard: find by user_id
CREATE INDEX idx_providers_user_id ON providers (user_id);

-- Provider profile: find by slug
CREATE INDEX idx_providers_slug ON providers (slug);

-- Stripe: reverse-lookup by customer
CREATE INDEX idx_providers_stripe_customer ON providers (stripe_customer_id);
