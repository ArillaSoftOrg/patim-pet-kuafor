import type { Currency, PetSize, PetType } from "@/lib/appointments/types";

// One price rule. Omitted `size`/`breedId` mean "any". When several rules
// match a pet, the most specific wins (breed beats size beats pet type
// alone) — see quotePrice in src/lib/appointments/pricing.ts.
export interface PriceRule {
  petType: PetType;
  size?: PetSize;
  // Breed id from src/data/petBreeds.ts.
  breedId?: string;
  // null = offered, but priced on request (no confirmed price yet).
  amount: number | null;
}

export interface ServicePricing {
  // Matches Service.slug. A service with no entry here (e.g. one created
  // later in /admin/services) isn't bookable until pricing is added.
  serviceSlug: string;
  // A pet type with no rule at all means the service isn't offered for
  // that pet type.
  rules: PriceRule[];
}

export interface PricingConfig {
  currency: Currency;
  services: ServicePricing[];
}

// The single place appointment pricing is configured. Every amount is
// deliberately null: no real prices have been confirmed, and this project
// forbids inventing them — the booking flow shows "price on request" for
// these until real amounts are entered here. The rule structure itself
// (which pet types each service covers, size bands for dogs) mirrors the
// existing service descriptions in src/data/services.ts. Patim Pet Kuaför
// offers dog grooming only (confirmed via its Google Business Profile
// "Hizmetler" list) — no cat-pricing rules exist, matching that services
// only cover petType: "dog" everywhere else in this app.
export const appointmentPricing: PricingConfig = {
  currency: "TRY",
  services: [
    {
      serviceSlug: "dog-bath-blow-dry",
      rules: [
        { petType: "dog", size: "small", amount: null },
        { petType: "dog", size: "medium", amount: null },
        { petType: "dog", size: "large", amount: null },
      ],
    },
    {
      serviceSlug: "dog-grooming",
      rules: [
        { petType: "dog", size: "small", amount: null },
        { petType: "dog", size: "medium", amount: null },
        { petType: "dog", size: "large", amount: null },
      ],
    },
    {
      serviceSlug: "nail-trimming",
      rules: [
        { petType: "dog", size: "small", amount: null },
        { petType: "dog", size: "medium", amount: null },
        { petType: "dog", size: "large", amount: null },
      ],
    },
    {
      serviceSlug: "ear-cleaning",
      rules: [
        { petType: "dog", size: "small", amount: null },
        { petType: "dog", size: "medium", amount: null },
        { petType: "dog", size: "large", amount: null },
      ],
    },
    {
      serviceSlug: "full-grooming-package",
      rules: [
        { petType: "dog", size: "small", amount: null },
        { petType: "dog", size: "medium", amount: null },
        { petType: "dog", size: "large", amount: null },
      ],
    },
  ],
};
