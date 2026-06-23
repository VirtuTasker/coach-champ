// =============================================================
// PLAN CONFIG
// =============================================================
// Single source of truth for plan pricing. Both the checkout
// route and the webhook handler import from here, so prices
// never drift out of sync between the two.
// =============================================================

export const PLANS = {
  monthly: { label: "Monthly", priceInPaise: 49900, tier: "monthly" as const },
  premium: { label: "Premium", priceInPaise: 69900, tier: "premium" as const },
  family: { label: "Family", priceInPaise: 99900, tier: "family" as const },
  annual: { label: "Annual", priceInPaise: 499900, tier: "annual" as const },
} as const;

export type PlanKey = keyof typeof PLANS;

export function isValidPlanKey(key: string): key is PlanKey {
  return key in PLANS;
}
