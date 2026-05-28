export const CATEGORY_DATA = [
  { name: "Home Services",        emoji: "🏠", slug: "home-services" },
  { name: "Outdoor Services",     emoji: "🌿", slug: "outdoor-services" },
  { name: "Trades",               emoji: "🔧", slug: "trades" },
  { name: "Medical",              emoji: "⚕️",  slug: "medical" },
  { name: "Legal",                emoji: "⚖️",  slug: "legal" },
  { name: "Pet Services",         emoji: "🐾", slug: "pet-services" },
  { name: "Automotive",           emoji: "🚗", slug: "automotive" },
  { name: "Beauty",               emoji: "✂️",  slug: "beauty" },
  { name: "Energy",               emoji: "⚡", slug: "energy" },
  { name: "Wellness",             emoji: "🧘", slug: "wellness" },
  { name: "General Repair",       emoji: "🛠️",  slug: "general-repair" },
  { name: "Professional Services",emoji: "💼", slug: "professional-services" },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Search",
    description: "Type what you need and where you are.",
  },
  {
    step: "2",
    title: "Browse",
    description: "Compare vetted businesses with real ratings.",
  },
  {
    step: "3",
    title: "Connect",
    description: "Call or visit directly — no middleman.",
  },
] as const;

export const WHY_LYNKSERV = [
  {
    title: "No fake leads",
    description:
      "Unlike Angi, we never charge per lead or sell your information to third parties.",
    icon: "shield",
  },
  {
    title: "Real vetting",
    description: "Every business is reviewed before listing.",
    icon: "badge",
  },
  {
    title: "Transparent pricing",
    description:
      "Providers pay a flat monthly fee. No contracts. No cancellation fees.",
    icon: "tag",
  },
] as const;
