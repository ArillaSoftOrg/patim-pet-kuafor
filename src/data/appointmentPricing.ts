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
// deliberately null: no real prices have been confirmed, and README.md
// forbids inventing them — the booking flow shows "price on request" for
// these until real amounts are entered here. The rule structure itself
// (which pet types each service covers, size bands for dogs) mirrors the
// existing service descriptions in src/data/services.ts.
export const appointmentPricing: PricingConfig = {
  currency: "TRY",
  services: [
    {
      serviceSlug: "dog-grooming",
      rules: [
        { petType: "dog", size: "small", amount: null },
        { petType: "dog", size: "medium", amount: null },
        { petType: "dog", size: "large", amount: null },
      ],
    },
    {
      serviceSlug: "cat-grooming",
      rules: [{ petType: "cat", amount: null }],
    },
    {
      serviceSlug: "mobile-pet-grooming",
      rules: [
        { petType: "dog", size: "small", amount: null },
        { petType: "dog", size: "medium", amount: null },
        { petType: "dog", size: "large", amount: null },
        { petType: "cat", amount: null },
      ],
    },
  ],
};
