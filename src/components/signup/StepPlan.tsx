type Plan = "basic" | "standard" | "featured";
type Billing = "monthly" | "annual";

interface Props {
  plan: Plan;
  billing: Billing;
  onPlanChange: (p: Plan) => void;
  onBillingChange: (b: Billing) => void;
  onNext: () => void;
}

const PLANS: {
  id: Plan;
  name: string;
  badge: string | null;
  badgeStyle: string;
  description: string;
  monthly: number;
  annual: { perMonth: number; total: number };
  highlights: string[];
}[] = [
  {
    id: "basic",
    name: "Basic",
    badge: null,
    badgeStyle: "",
    description: "Get found in the LynkServ directory.",
    monthly: 29,
    annual: { perMonth: 24, total: 289 },
    highlights: [
      "Listed in Utah service directory",
      "Phone & website contact buttons",
      "30-day free trial",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    badge: "Most Popular",
    badgeStyle: "bg-[#1B4FD8] text-white",
    description: "Build trust with a complete, verified profile.",
    monthly: 59,
    annual: { perMonth: 49, total: 589 },
    highlights: [
      "Profile photo + up to 3 testimonials",
      "First-Time Customer Offer badge",
      "Standard badge in search results",
    ],
  },
  {
    id: "featured",
    name: "Featured",
    badge: "Best Visibility",
    badgeStyle: "bg-[#F59E0B] text-[#111827]",
    description: "Maximum visibility. Always listed first.",
    monthly: 99,
    annual: { perMonth: 82, total: 989 },
    highlights: [
      "Listed FIRST in all search results",
      "Gold Featured badge",
      "Analytics dashboard",
    ],
  },
];

export function StepPlan({ plan, billing, onPlanChange, onBillingChange, onNext }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#111827] mb-1">Choose your plan</h2>
      <p className="text-sm text-gray-500 mb-7">
        30 days free to start — no credit card required. Change anytime.
      </p>

      {/* Billing toggle */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className={`text-sm font-medium cursor-pointer transition-colors ${billing === "monthly" ? "text-[#111827]" : "text-gray-400"}`}
          onClick={() => onBillingChange("monthly")}
        >
          Monthly
        </span>
        <button
          type="button"
          onClick={() => onBillingChange(billing === "monthly" ? "annual" : "monthly")}
          className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none ${billing === "annual" ? "bg-[#1B4FD8]" : "bg-gray-200"}`}
          aria-label="Toggle billing period"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${billing === "annual" ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-sm font-medium cursor-pointer transition-colors ${billing === "annual" ? "text-[#111827]" : "text-gray-400"}`}
            onClick={() => onBillingChange("annual")}
          >
            Annual
          </span>
          <span className="text-xs font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
            Save 17%
          </span>
        </div>
      </div>

      {/* Plan cards */}
      <div className="space-y-3 mb-8">
        {PLANS.map((p) => {
          const selected = plan === p.id;
          const price = billing === "monthly" ? p.monthly : p.annual.perMonth;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPlanChange(p.id)}
              className={`w-full text-left rounded-xl p-4 border-2 transition-all ${
                selected
                  ? "border-[#1B4FD8] bg-blue-50"
                  : "border-gray-100 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {/* Radio */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      selected ? "border-[#1B4FD8]" : "border-gray-300"
                    }`}
                  >
                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#1B4FD8]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-bold text-[#111827]">{p.name}</span>
                      {p.badge && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.badgeStyle}`}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{p.description}</p>
                    <ul className="space-y-0.5">
                      {p.highlights.map((h) => (
                        <li key={h} className="text-xs text-gray-500">· {h}</li>
                      ))}
                    </ul>
                    {billing === "annual" && (
                      <p className="text-xs text-gray-400 mt-1.5">
                        Billed ${p.annual.total}/yr
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-extrabold text-[#111827]">${price}</span>
                  <span className="text-gray-400 text-sm">/mo</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full bg-[#1B4FD8] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors"
      >
        Continue →
      </button>
    </div>
  );
}
