import { appointmentPricing } from "@/data/appointmentPricing";
import type { PriceRule, PricingConfig } from "@/data/appointmentPricing";
import type { PetSize, PetType, PriceQuote } from "@/lib/appointments/types";

export interface PriceQuoteInput {
  serviceSlug: string;
  petType: PetType;
  breedId: string;
  size: PetSize | null;
}

function specificity(rule: PriceRule): number {
  return (rule.breedId !== undefined ? 2 : 0) + (rule.size !== undefined ? 1 : 0);
}

function matches(rule: PriceRule, input: PriceQuoteInput): boolean {
  return (
    rule.petType === input.petType &&
    (rule.breedId === undefined || rule.breedId === input.breedId) &&
    (rule.size === undefined || rule.size === input.size)
  );
}

// Pure: the same input always yields the same quote, so the booking flow,
// the review step and a future server-side re-check all agree. `config` is
// injectable for tests and for a future admin-editable pricing source.
export function quotePrice(input: PriceQuoteInput, config: PricingConfig = appointmentPricing): PriceQuote {
  const servicePricing = config.services.find((entry) => entry.serviceSlug === input.serviceSlug);
  if (!servicePricing) return { kind: "unavailable", reason: "unknown-service" };

  const petRules = servicePricing.rules.filter((rule) => rule.petType === input.petType);
  if (petRules.length === 0) return { kind: "unavailable", reason: "pet-not-offered" };

  let best: PriceRule | null = null;
  for (const rule of petRules) {
    if (matches(rule, input) && (best === null || specificity(rule) > specificity(best))) {
      best = rule;
    }
  }

  if (!best) {
    // Rules exist for this pet type but every one is size-specific.
    const needsSize = input.size === null && petRules.some((rule) => rule.size !== undefined);
    return { kind: "unavailable", reason: needsSize ? "size-required" : "pet-not-offered" };
  }

  return best.amount === null
    ? { kind: "on-request", currency: config.currency }
    : { kind: "priced", amount: best.amount, currency: config.currency };
}

// Which pet types a service can be booked for, in config order — lets the
// pet step offer only valid choices for the selected service.
export function getOfferedPetTypes(serviceSlug: string, config: PricingConfig = appointmentPricing): PetType[] {
  const servicePricing = config.services.find((entry) => entry.serviceSlug === serviceSlug);
  if (!servicePricing) return [];
  return [...new Set(servicePricing.rules.map((rule) => rule.petType))];
}

export function isServiceBookable(serviceSlug: string, config: PricingConfig = appointmentPricing): boolean {
  return getOfferedPetTypes(serviceSlug, config).length > 0;
}
