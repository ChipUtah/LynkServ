import { CITIES } from "@/lib/supabase/types";

export interface Subcategory {
  name: string;
  slug: string;
  category: string;
  displayOrder: number;
}

export const SUBCATEGORIES: Subcategory[] = [
  // ── Home Services (15) ──────────────────────────────────────
  { name: "House Cleaning",           slug: "house-cleaning",           category: "Home Services",         displayOrder:  1 },
  { name: "Maid Service",             slug: "maid-service",             category: "Home Services",         displayOrder:  2 },
  { name: "Deep Cleaning",            slug: "deep-cleaning",            category: "Home Services",         displayOrder:  3 },
  { name: "Move-In/Out Cleaning",     slug: "move-inout-cleaning",      category: "Home Services",         displayOrder:  4 },
  { name: "Carpet Cleaning",          slug: "carpet-cleaning",          category: "Home Services",         displayOrder:  5 },
  { name: "Window Cleaning",          slug: "window-cleaning",          category: "Home Services",         displayOrder:  6 },
  { name: "Pressure Washing",         slug: "pressure-washing",         category: "Home Services",         displayOrder:  7 },
  { name: "Gutter Cleaning",          slug: "gutter-cleaning",          category: "Home Services",         displayOrder:  8 },
  { name: "Appliance Repair",         slug: "appliance-repair",         category: "Home Services",         displayOrder:  9 },
  { name: "Appliance Installation",   slug: "appliance-installation",   category: "Home Services",         displayOrder: 10 },
  { name: "Home Security",            slug: "home-security",            category: "Home Services",         displayOrder: 11 },
  { name: "Smart Home Installation",  slug: "smart-home-installation",  category: "Home Services",         displayOrder: 12 },
  { name: "Handyman",                 slug: "handyman",                 category: "Home Services",         displayOrder: 13 },
  { name: "Furniture Assembly",       slug: "furniture-assembly",       category: "Home Services",         displayOrder: 14 },
  { name: "Drywall Repair",           slug: "drywall-repair",           category: "Home Services",         displayOrder: 15 },

  // ── Outdoor Services (12) ────────────────────────────────────
  { name: "Lawn Care",                slug: "lawn-care",                category: "Outdoor Services",      displayOrder:  1 },
  { name: "Landscaping",              slug: "landscaping",              category: "Outdoor Services",      displayOrder:  2 },
  { name: "Tree Service",             slug: "tree-service",             category: "Outdoor Services",      displayOrder:  3 },
  { name: "Tree Removal",             slug: "tree-removal",             category: "Outdoor Services",      displayOrder:  4 },
  { name: "Irrigation & Sprinklers",  slug: "irrigation-sprinklers",    category: "Outdoor Services",      displayOrder:  5 },
  { name: "Hardscaping",              slug: "hardscaping",              category: "Outdoor Services",      displayOrder:  6 },
  { name: "Fencing",                  slug: "fencing",                  category: "Outdoor Services",      displayOrder:  7 },
  { name: "Deck & Patio",             slug: "deck-patio",               category: "Outdoor Services",      displayOrder:  8 },
  { name: "Snow Removal",             slug: "snow-removal",             category: "Outdoor Services",      displayOrder:  9 },
  { name: "Leaf Removal",             slug: "leaf-removal",             category: "Outdoor Services",      displayOrder: 10 },
  { name: "Garden Design",            slug: "garden-design",            category: "Outdoor Services",      displayOrder: 11 },
  { name: "Outdoor Lighting",         slug: "outdoor-lighting",         category: "Outdoor Services",      displayOrder: 12 },

  // ── Trades (31) ──────────────────────────────────────────────
  { name: "Plumbing",                 slug: "plumbing",                 category: "Trades",                displayOrder:  1 },
  { name: "Drain Cleaning",           slug: "drain-cleaning",           category: "Trades",                displayOrder:  2 },
  { name: "Water Heater",             slug: "water-heater",             category: "Trades",                displayOrder:  3 },
  { name: "Electrical",               slug: "electrical",               category: "Trades",                displayOrder:  4 },
  { name: "Lighting Installation",    slug: "lighting-installation",    category: "Trades",                displayOrder:  5 },
  { name: "Panel Upgrades",           slug: "panel-upgrades",           category: "Trades",                displayOrder:  6 },
  { name: "EV Charger Installation",  slug: "ev-charger-installation",  category: "Trades",                displayOrder:  7 },
  { name: "HVAC",                     slug: "hvac",                     category: "Trades",                displayOrder:  8 },
  { name: "Heating Repair",           slug: "heating-repair",           category: "Trades",                displayOrder:  9 },
  { name: "AC Repair",                slug: "ac-repair",                category: "Trades",                displayOrder: 10 },
  { name: "Duct Cleaning",            slug: "duct-cleaning",            category: "Trades",                displayOrder: 11 },
  { name: "Roofing",                  slug: "roofing",                  category: "Trades",                displayOrder: 12 },
  { name: "Roof Repair",              slug: "roof-repair",              category: "Trades",                displayOrder: 13 },
  { name: "Siding",                   slug: "siding",                   category: "Trades",                displayOrder: 14 },
  { name: "Gutters",                  slug: "gutters",                  category: "Trades",                displayOrder: 15 },
  { name: "Painting",                 slug: "painting",                 category: "Trades",                displayOrder: 16 },
  { name: "Interior Painting",        slug: "interior-painting",        category: "Trades",                displayOrder: 17 },
  { name: "Exterior Painting",        slug: "exterior-painting",        category: "Trades",                displayOrder: 18 },
  { name: "Flooring",                 slug: "flooring",                 category: "Trades",                displayOrder: 19 },
  { name: "Hardwood Floors",          slug: "hardwood-floors",          category: "Trades",                displayOrder: 20 },
  { name: "Tile & Grout",             slug: "tile-grout",               category: "Trades",                displayOrder: 21 },
  { name: "Windows & Doors",          slug: "windows-doors",            category: "Trades",                displayOrder: 22 },
  { name: "Kitchen Remodeling",       slug: "kitchen-remodeling",       category: "Trades",                displayOrder: 23 },
  { name: "Bathroom Remodeling",      slug: "bathroom-remodeling",      category: "Trades",                displayOrder: 24 },
  { name: "Basement Finishing",       slug: "basement-finishing",       category: "Trades",                displayOrder: 25 },
  { name: "Foundation Repair",        slug: "foundation-repair",        category: "Trades",                displayOrder: 26 },
  { name: "Concrete & Masonry",       slug: "concrete-masonry",         category: "Trades",                displayOrder: 27 },
  { name: "Insulation",               slug: "insulation",               category: "Trades",                displayOrder: 28 },
  { name: "Solar Installation",       slug: "solar-installation",       category: "Trades",                displayOrder: 29 },
  { name: "Pest Control",             slug: "pest-control",             category: "Trades",                displayOrder: 30 },
  { name: "Chimney",                  slug: "chimney",                  category: "Trades",                displayOrder: 31 },

  // ── Medical (16) ─────────────────────────────────────────────
  { name: "Primary Care",             slug: "primary-care",             category: "Medical",               displayOrder:  1 },
  { name: "Urgent Care",              slug: "urgent-care",              category: "Medical",               displayOrder:  2 },
  { name: "Dentist",                  slug: "dentist",                  category: "Medical",               displayOrder:  3 },
  { name: "Orthodontist",             slug: "orthodontist",             category: "Medical",               displayOrder:  4 },
  { name: "Chiropractor",             slug: "chiropractor",             category: "Medical",               displayOrder:  5 },
  { name: "Physical Therapy",         slug: "physical-therapy",         category: "Medical",               displayOrder:  6 },
  { name: "Optometrist",              slug: "optometrist",              category: "Medical",               displayOrder:  7 },
  { name: "Dermatologist",            slug: "dermatologist",            category: "Medical",               displayOrder:  8 },
  { name: "Pediatrician",             slug: "pediatrician",             category: "Medical",               displayOrder:  9 },
  { name: "OB/GYN",                   slug: "ob-gyn",                   category: "Medical",               displayOrder: 10 },
  { name: "Specialist",               slug: "specialist",               category: "Medical",               displayOrder: 11 },
  { name: "Acupuncture",              slug: "acupuncture",              category: "Medical",               displayOrder: 12 },
  { name: "Massage Therapy",          slug: "massage-therapy",          category: "Medical",               displayOrder: 13 },
  { name: "Nutritionist",             slug: "nutritionist",             category: "Medical",               displayOrder: 14 },
  { name: "Senior Care",              slug: "senior-care",              category: "Medical",               displayOrder: 15 },
  { name: "In-Home Care",             slug: "in-home-care",             category: "Medical",               displayOrder: 16 },

  // ── Legal (12) ───────────────────────────────────────────────
  { name: "Family Law",               slug: "family-law",               category: "Legal",                 displayOrder:  1 },
  { name: "Divorce Attorney",         slug: "divorce-attorney",         category: "Legal",                 displayOrder:  2 },
  { name: "Personal Injury",          slug: "personal-injury",          category: "Legal",                 displayOrder:  3 },
  { name: "Criminal Defense",         slug: "criminal-defense",         category: "Legal",                 displayOrder:  4 },
  { name: "Real Estate Attorney",     slug: "real-estate-attorney",     category: "Legal",                 displayOrder:  5 },
  { name: "Business Law",             slug: "business-law",             category: "Legal",                 displayOrder:  6 },
  { name: "Estate Planning",          slug: "estate-planning",          category: "Legal",                 displayOrder:  7 },
  { name: "Wills & Trusts",           slug: "wills-trusts",             category: "Legal",                 displayOrder:  8 },
  { name: "Immigration",              slug: "immigration",              category: "Legal",                 displayOrder:  9 },
  { name: "Bankruptcy",               slug: "bankruptcy",               category: "Legal",                 displayOrder: 10 },
  { name: "Employment Law",           slug: "employment-law",           category: "Legal",                 displayOrder: 11 },
  { name: "Notary",                   slug: "notary",                   category: "Legal",                 displayOrder: 12 },

  // ── Pet Services (10) ────────────────────────────────────────
  { name: "Dog Grooming",             slug: "dog-grooming",             category: "Pet Services",          displayOrder:  1 },
  { name: "Cat Grooming",             slug: "cat-grooming",             category: "Pet Services",          displayOrder:  2 },
  { name: "Dog Walking",              slug: "dog-walking",              category: "Pet Services",          displayOrder:  3 },
  { name: "Pet Sitting",              slug: "pet-sitting",              category: "Pet Services",          displayOrder:  4 },
  { name: "Dog Training",             slug: "dog-training",             category: "Pet Services",          displayOrder:  5 },
  { name: "Dog Boarding",             slug: "dog-boarding",             category: "Pet Services",          displayOrder:  6 },
  { name: "Doggy Daycare",            slug: "doggy-daycare",            category: "Pet Services",          displayOrder:  7 },
  { name: "Veterinarian",             slug: "veterinarian",             category: "Pet Services",          displayOrder:  8 },
  { name: "Emergency Vet",            slug: "emergency-vet",            category: "Pet Services",          displayOrder:  9 },
  { name: "Pet Photography",          slug: "pet-photography",          category: "Pet Services",          displayOrder: 10 },

  // ── Automotive (14) ──────────────────────────────────────────
  { name: "Oil Change",               slug: "oil-change",               category: "Automotive",            displayOrder:  1 },
  { name: "Brake Repair",             slug: "brake-repair",             category: "Automotive",            displayOrder:  2 },
  { name: "Tire Service",             slug: "tire-service",             category: "Automotive",            displayOrder:  3 },
  { name: "Engine Repair",            slug: "engine-repair",            category: "Automotive",            displayOrder:  4 },
  { name: "Transmission",             slug: "transmission",             category: "Automotive",            displayOrder:  5 },
  { name: "Auto Body & Collision",    slug: "auto-body-collision",      category: "Automotive",            displayOrder:  6 },
  { name: "Dent Removal",             slug: "dent-removal",             category: "Automotive",            displayOrder:  7 },
  { name: "Auto Detailing",           slug: "auto-detailing",           category: "Automotive",            displayOrder:  8 },
  { name: "Car Wash",                 slug: "car-wash",                 category: "Automotive",            displayOrder:  9 },
  { name: "Towing",                   slug: "towing",                   category: "Automotive",            displayOrder: 10 },
  { name: "Roadside Assistance",      slug: "roadside-assistance",      category: "Automotive",            displayOrder: 11 },
  { name: "Window Tinting",           slug: "window-tinting",           category: "Automotive",            displayOrder: 12 },
  { name: "RV Repair",                slug: "rv-repair",                category: "Automotive",            displayOrder: 13 },
  { name: "Motorcycle Repair",        slug: "motorcycle-repair",        category: "Automotive",            displayOrder: 14 },

  // ── Beauty (16) ──────────────────────────────────────────────
  { name: "Hair Salon",               slug: "hair-salon",               category: "Beauty",                displayOrder:  1 },
  { name: "Barber",                   slug: "barber",                   category: "Beauty",                displayOrder:  2 },
  { name: "Hair Coloring",            slug: "hair-coloring",            category: "Beauty",                displayOrder:  3 },
  { name: "Hair Extensions",          slug: "hair-extensions",          category: "Beauty",                displayOrder:  4 },
  { name: "Nail Salon",               slug: "nail-salon",               category: "Beauty",                displayOrder:  5 },
  { name: "Manicure & Pedicure",      slug: "manicure-pedicure",        category: "Beauty",                displayOrder:  6 },
  { name: "Waxing",                   slug: "waxing",                   category: "Beauty",                displayOrder:  7 },
  { name: "Eyebrows & Lashes",        slug: "eyebrows-lashes",          category: "Beauty",                displayOrder:  8 },
  { name: "Facial",                   slug: "facial",                   category: "Beauty",                displayOrder:  9 },
  { name: "Skincare",                 slug: "skincare",                 category: "Beauty",                displayOrder: 10 },
  { name: "Massage",                  slug: "massage",                  category: "Beauty",                displayOrder: 11 },
  { name: "Spa Services",             slug: "spa-services",             category: "Beauty",                displayOrder: 12 },
  { name: "Makeup Artist",            slug: "makeup-artist",            category: "Beauty",                displayOrder: 13 },
  { name: "Botox & Fillers",          slug: "botox-fillers",            category: "Beauty",                displayOrder: 14 },
  { name: "Laser Hair Removal",       slug: "laser-hair-removal",       category: "Beauty",                displayOrder: 15 },
  { name: "Tanning",                  slug: "tanning",                  category: "Beauty",                displayOrder: 16 },

  // ── Energy (9) ───────────────────────────────────────────────
  { name: "Solar Installation",       slug: "solar-installation",       category: "Energy",                displayOrder:  1 },
  { name: "Solar Repair",             slug: "solar-repair",             category: "Energy",                displayOrder:  2 },
  { name: "Battery Storage",          slug: "battery-storage",          category: "Energy",                displayOrder:  3 },
  { name: "EV Charging Station",      slug: "ev-charging-station",      category: "Energy",                displayOrder:  4 },
  { name: "Energy Audit",             slug: "energy-audit",             category: "Energy",                displayOrder:  5 },
  { name: "Weatherproofing",          slug: "weatherproofing",          category: "Energy",                displayOrder:  6 },
  { name: "Insulation",               slug: "insulation",               category: "Energy",                displayOrder:  7 },
  { name: "Generator Installation",   slug: "generator-installation",   category: "Energy",                displayOrder:  8 },
  { name: "Wind Energy",              slug: "wind-energy",              category: "Energy",                displayOrder:  9 },

  // ── Wellness (12) ────────────────────────────────────────────
  { name: "Personal Training",        slug: "personal-training",        category: "Wellness",              displayOrder:  1 },
  { name: "Yoga Instruction",         slug: "yoga-instruction",         category: "Wellness",              displayOrder:  2 },
  { name: "Pilates",                  slug: "pilates",                  category: "Wellness",              displayOrder:  3 },
  { name: "Life Coaching",            slug: "life-coaching",            category: "Wellness",              displayOrder:  4 },
  { name: "Health Coaching",          slug: "health-coaching",          category: "Wellness",              displayOrder:  5 },
  { name: "Nutrition Counseling",     slug: "nutrition-counseling",     category: "Wellness",              displayOrder:  6 },
  { name: "Mental Health Counseling", slug: "mental-health-counseling", category: "Wellness",              displayOrder:  7 },
  { name: "Therapy",                  slug: "therapy",                  category: "Wellness",              displayOrder:  8 },
  { name: "Psychiatry",               slug: "psychiatry",               category: "Wellness",              displayOrder:  9 },
  { name: "Meditation",               slug: "meditation",               category: "Wellness",              displayOrder: 10 },
  { name: "Reiki",                    slug: "reiki",                    category: "Wellness",              displayOrder: 11 },
  { name: "Hypnotherapy",             slug: "hypnotherapy",             category: "Wellness",              displayOrder: 12 },

  // ── General Repair (11) ──────────────────────────────────────
  { name: "Appliance Repair",         slug: "appliance-repair",         category: "General Repair",        displayOrder:  1 },
  { name: "Phone Repair",             slug: "phone-repair",             category: "General Repair",        displayOrder:  2 },
  { name: "Computer Repair",          slug: "computer-repair",          category: "General Repair",        displayOrder:  3 },
  { name: "TV & Electronics Repair",  slug: "tv-electronics-repair",    category: "General Repair",        displayOrder:  4 },
  { name: "Furniture Repair",         slug: "furniture-repair",         category: "General Repair",        displayOrder:  5 },
  { name: "Shoe Repair",              slug: "shoe-repair",              category: "General Repair",        displayOrder:  6 },
  { name: "Watch Repair",             slug: "watch-repair",             category: "General Repair",        displayOrder:  7 },
  { name: "Jewelry Repair",           slug: "jewelry-repair",           category: "General Repair",        displayOrder:  8 },
  { name: "Bicycle Repair",           slug: "bicycle-repair",           category: "General Repair",        displayOrder:  9 },
  { name: "Lock & Key",               slug: "lock-key",                 category: "General Repair",        displayOrder: 10 },
  { name: "Glass Repair",             slug: "glass-repair",             category: "General Repair",        displayOrder: 11 },

  // ── Professional Services (21) ───────────────────────────────
  { name: "Accounting",               slug: "accounting",               category: "Professional Services", displayOrder:  1 },
  { name: "Tax Preparation",          slug: "tax-preparation",          category: "Professional Services", displayOrder:  2 },
  { name: "Bookkeeping",              slug: "bookkeeping",              category: "Professional Services", displayOrder:  3 },
  { name: "Financial Advisor",        slug: "financial-advisor",        category: "Professional Services", displayOrder:  4 },
  { name: "Insurance Agent",          slug: "insurance-agent",          category: "Professional Services", displayOrder:  5 },
  { name: "Business Consulting",      slug: "business-consulting",      category: "Professional Services", displayOrder:  6 },
  { name: "Marketing",                slug: "marketing",                category: "Professional Services", displayOrder:  7 },
  { name: "SEO & Digital Marketing",  slug: "seo-digital-marketing",    category: "Professional Services", displayOrder:  8 },
  { name: "Graphic Design",           slug: "graphic-design",           category: "Professional Services", displayOrder:  9 },
  { name: "Web Design",               slug: "web-design",               category: "Professional Services", displayOrder: 10 },
  { name: "IT Support",               slug: "it-support",               category: "Professional Services", displayOrder: 11 },
  { name: "Cybersecurity",            slug: "cybersecurity",            category: "Professional Services", displayOrder: 12 },
  { name: "Photography",              slug: "photography",              category: "Professional Services", displayOrder: 13 },
  { name: "Videography",              slug: "videography",              category: "Professional Services", displayOrder: 14 },
  { name: "Real Estate Agent",        slug: "real-estate-agent",        category: "Professional Services", displayOrder: 15 },
  { name: "Property Management",      slug: "property-management",      category: "Professional Services", displayOrder: 16 },
  { name: "Moving & Storage",         slug: "moving-storage",           category: "Professional Services", displayOrder: 17 },
  { name: "Home Inspection",          slug: "home-inspection",          category: "Professional Services", displayOrder: 18 },
  { name: "Event Planning",           slug: "event-planning",           category: "Professional Services", displayOrder: 19 },
  { name: "Tutoring",                 slug: "tutoring",                 category: "Professional Services", displayOrder: 20 },
  { name: "Music Lessons",            slug: "music-lessons",            category: "Professional Services", displayOrder: 21 },
];

// ── Lookup helpers ────────────────────────────────────────────

export function getSubcategoriesByCategory(category: string): Subcategory[] {
  return SUBCATEGORIES
    .filter((s) => s.category === category)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getSubcategoryBySlug(slug: string): Subcategory | undefined {
  return SUBCATEGORIES.find((s) => s.slug === slug);
}

export function getSubcategoryNames(slugs: string[]): string[] {
  return slugs
    .map((slug) => getSubcategoryBySlug(slug)?.name)
    .filter((n): n is string => !!n);
}

// ── City slug helpers ─────────────────────────────────────────

export function cityToSlug(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const CITY_BY_SLUG: Record<string, string> = Object.fromEntries(
  CITIES.map((c) => [cityToSlug(c), c])
);

export function slugToCity(slug: string): string | undefined {
  return CITY_BY_SLUG[slug];
}

// Unique slugs across all categories (for SEO page generation)
export const UNIQUE_SUBCATEGORY_SLUGS = [
  ...new Set(SUBCATEGORIES.map((s) => s.slug)),
];
