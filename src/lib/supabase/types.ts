export type Tier = "Basic" | "Standard" | "Featured";
export type ApprovalStatus = "Pending" | "Approved" | "Suspended";

export interface Provider {
  id: string;
  created_at: string;
  updated_at: string;

  user_id: string | null;

  // Identity
  business_name: string;
  contact_name: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  description: string | null;
  slug: string | null;

  // Location & Category
  city: string;
  category: string;
  subcategories: string[];

  // Membership
  tier: Tier;
  approval_status: ApprovalStatus;
  billing_active: boolean;
  trial_start: string | null;
  founding_member: boolean;
  sort_order: number;

  // Stripe
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  next_billing_date: string | null; // ISO timestamptz

  // FTCO
  ftco_active: boolean;
  ftco_type: string | null;
  ftco_value: string | null;
  ftco_description: string | null;
  ftco_expiry: string | null; // date string YYYY-MM-DD

  // Verification & Ratings
  google_rating: number | null;
  google_review_count: number | null;
  license_number: string | null;
  license_verified: boolean;
  insurance_verified: boolean;

  // Profile
  profile_photo: string | null;

  // Testimonials
  testimonial_1_quote: string | null;
  testimonial_1_author: string | null;
  testimonial_2_quote: string | null;
  testimonial_2_author: string | null;
  testimonial_3_quote: string | null;
  testimonial_3_author: string | null;

  // Social
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;

  // Internal
  referral_source: string | null;
  notes: string | null;
}

export interface WaitlistEntry {
  id: string;
  created_at: string;
  business_name: string | null;
  email: string;
  city: string;
  category: string;
  tier: Extract<Tier, "Standard" | "Featured">;
  contacted: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  created_at: string;
  email: string;
  active: boolean;
}

// ─── Constants ───────────────────────────────────────────────

export const CATEGORIES = [
  "Home Services",
  "Outdoor Services",
  "Trades",
  "Medical",
  "Legal",
  "Pet Services",
  "Automotive",
  "Beauty",
  "Energy",
  "Wellness",
  "General Repair",
  "Professional Services",
] as const;

export const CITIES = [
  "Salt Lake City",
  "Riverton",
  "South Jordan",
  "Sandy",
  "Murray",
  "Draper",
  "Herriman",
  "West Jordan",
  "Provo",
  "Orem",
  "St. George",
  "Ogden",
  "Lehi",
  "American Fork",
  "Springville",
  "Spanish Fork",
  "Pleasant Grove",
  "Layton",
  "Kaysville",
  "Bountiful",
  "West Valley City",
  "Taylorsville",
  "Midvale",
  "Cottonwood Heights",
  "Holladay",
  "Cedar City",
  "Logan",
  "Tooele",
  "Park City",
  "Saratoga Springs",
] as const;

export const TIERS = ["Basic", "Standard", "Featured"] as const;

// Scarcity cap: max Featured + Standard slots per city+category combo
export const TIER_CAP = 3;

export type Category = (typeof CATEGORIES)[number];
export type City = (typeof CITIES)[number];

// Tier sort order for queries: Featured first
export const TIER_RANK: Record<Tier, number> = {
  Featured: 1,
  Standard: 2,
  Basic: 3,
};
