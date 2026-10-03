import { getBreed } from "@/data/petBreeds";
import type { PricingConfig } from "@/data/appointmentPricing";
import { quotePrice } from "@/lib/appointments/pricing";
import { isSlotAvailable } from "@/lib/appointments/availability";
import type { AvailabilityOptions } from "@/lib/appointments/availability";
import { isValidDate, isValidTime } from "@/lib/appointments/time";
import { appointmentStatusTransitions, petSizes, petTypes } from "@/lib/appointments/types";
import type {
  AppointmentInput,
  AppointmentStatus,
  BookablePriceQuote,
  PriceQuote,
  TimeSlot,
} from "@/lib/appointments/types";

// Every code maps 1:1 to a message in appointmentCopy.validation
// (src/data/appointment.ts) — validation stays copy-free so it can run
// anywhere (browser now, a server action later) and the UI owns wording.
export type AppointmentValidationCode =
  | "required"
  | "tooLong"
  | "invalidOption"
  | "invalidPhone"
  | "invalidEmail"
  | "invalidServiceArea"
  // Emitted by the booking flow's date step, which picks a day before a slot.
  | "dateUnavailable"
  | "serviceUnavailable"
  | "priceChanged"
  | "slotUnavailable"
  | "slotTaken";

export type AppointmentField =
  | "serviceSlug"
  | "serviceTitle"
  | "pet.name"
  | "pet.type"
  | "pet.breedId"
  | "pet.size"
  | "pet.notes"
  | "address.serviceArea"
  | "address.addressLine"
  | "address.addressDetails"
  | "slot"
  | "customer.fullName"
  | "customer.phone"
  | "customer.email"
  | "customer.notes"
  | "price";

// Empty object = valid. Field paths let the booking flow show each error
// next to its field and check one step at a time by prefix.
export type AppointmentFieldErrors = Partial<Record<AppointmentField, AppointmentValidationCode>>;

const MAX_SHORT_TEXT = 100;
const MAX_LONG_TEXT = 1000;

// Separators people commonly type; what's left must be 10–15 digits with an
// optional leading "+" (E.164 length range), which covers Turkish mobile
// numbers in either 05xx… or +90 5xx… form.
const PHONE_SEPARATORS = /[\s\-().]/g;
const PHONE_PATTERN = /^\+?\d{10,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function hasErrors(errors: AppointmentFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value.replace(PHONE_SEPARATORS, ""));
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

function collapse(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

// Trims user-entered text and turns an empty optional email into null, so
// what gets validated is exactly what gets stored.
export function normalizeAppointmentInput(input: AppointmentInput): AppointmentInput {
  const email = input.customer.email?.trim() ?? "";
  return {
    ...input,
    serviceSlug: input.serviceSlug.trim(),
    serviceTitle: collapse(input.serviceTitle),
    pet: { ...input.pet, name: collapse(input.pet.name), breedId: input.pet.breedId.trim(), notes: input.pet.notes.trim() },
    address: {
      serviceArea: input.address.serviceArea.trim(),
      addressLine: collapse(input.address.addressLine),
      addressDetails: input.address.addressDetails.trim(),
    },
    slot: { date: input.slot.date.trim(), start: input.slot.start.trim(), end: input.slot.end.trim() },
    customer: {
      fullName: collapse(input.customer.fullName),
      phone: collapse(input.customer.phone),
      email: email === "" ? null : email,
      notes: input.customer.notes.trim(),
    },
  };
}

export function isSamePrice(a: PriceQuote, b: PriceQuote): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "priced" && b.kind === "priced") return a.amount === b.amount && a.currency === b.currency;
  if (a.kind === "on-request" && b.kind === "on-request") return a.currency === b.currency;
  return false;
}

export function isBookablePrice(quote: PriceQuote): quote is BookablePriceQuote {
  return quote.kind !== "unavailable";
}

// Distinguishes a slot that was never offerable (outside hours, too soon,
// malformed) from one that's valid but already booked.
export function checkSlot(
  slot: TimeSlot,
  serviceSlug: string,
  bookedSlots: readonly TimeSlot[],
  availability: AvailabilityOptions = {},
): AppointmentValidationCode | null {
  if (!isValidDate(slot.date) || !isValidTime(slot.start) || !isValidTime(slot.end)) return "slotUnavailable";
  if (!isSlotAvailable(slot, serviceSlug, [], availability)) return "slotUnavailable";
  if (!isSlotAvailable(slot, serviceSlug, [...bookedSlots], availability)) return "slotTaken";
  return null;
}

export function canTransitionStatus(from: AppointmentStatus, to: AppointmentStatus): boolean {
  return appointmentStatusTransitions[from].includes(to);
}

export interface AppointmentValidationContext {
  // Current business.serviceAreas — the only areas Kulapaws travels to.
  serviceAreas: readonly string[];
  // Slots held by other appointments (slot-blocking statuses only).
  bookedSlots: readonly TimeSlot[];
  pricing?: PricingConfig;
  availability?: AvailabilityOptions;
  // Off when an edit leaves the slot unchanged: an existing appointment's
  // slot may legitimately be in the past or inside the lead time by now.
  checkSlotAvailability?: boolean;
  // Off when an edit leaves the pet unchanged: the price snapshot taken at
  // booking stands even if pricing config has changed since.
  checkPrice?: boolean;
}

function checkText(
  errors: AppointmentFieldErrors,
  field: AppointmentField,
  value: string,
  { required, max }: { required: boolean; max: number },
) {
  if (required && value === "") errors[field] = "required";
  else if (value.length > max) errors[field] = "tooLong";
}

// Shared by every write path (create, admin edits) and usable by the
// booking flow per step. Expects normalized input (normalizeAppointmentInput).
export function validateAppointmentInput(
  input: AppointmentInput,
  context: AppointmentValidationContext,
): AppointmentFieldErrors {
  const { checkSlotAvailability = true, checkPrice = true } = context;
  const errors: AppointmentFieldErrors = {};

  if (input.serviceSlug === "") errors.serviceSlug = "required";
  checkText(errors, "serviceTitle", input.serviceTitle, { required: true, max: MAX_SHORT_TEXT });

  // Pet
  const { pet } = input;
  checkText(errors, "pet.name", pet.name, { required: true, max: MAX_SHORT_TEXT });
  checkText(errors, "pet.notes", pet.notes, { required: false, max: MAX_LONG_TEXT });
  const validType = petTypes.includes(pet.type);
  if (!validType) errors["pet.type"] = "invalidOption";

  const breed = validType ? getBreed(pet.type, pet.breedId) : undefined;
  if (validType) {
    if (pet.breedId === "") errors["pet.breedId"] = "required";
    else if (!breed) errors["pet.breedId"] = "invalidOption";
  }

  if (breed) {
    if (pet.type === "cat") {
      if (pet.size !== null) errors["pet.size"] = "invalidOption";
    } else if (breed.size !== null) {
      if (pet.size !== breed.size) errors["pet.size"] = "invalidOption";
    } else if (pet.size === null) {
      errors["pet.size"] = "required";
    } else if (!petSizes.includes(pet.size)) {
      errors["pet.size"] = "invalidOption";
    }
  }

  // Price — only meaningful once service and pet are individually valid.
  const petValid = !errors["pet.type"] && !errors["pet.breedId"] && !errors["pet.size"];
  if (checkPrice && !errors.serviceSlug && petValid) {
    const quote = quotePrice(
      { serviceSlug: input.serviceSlug, petType: pet.type, breedId: pet.breedId, size: pet.size },
      context.pricing,
    );
    if (quote.kind === "unavailable") {
      if (quote.reason === "unknown-service") errors.serviceSlug = "serviceUnavailable";
      else if (quote.reason === "pet-not-offered") errors["pet.type"] = "serviceUnavailable";
      else errors["pet.size"] = "required";
    } else if (!isSamePrice(quote, input.price)) {
      errors.price = "priceChanged";
    }
  }

  // Address
  const { address } = input;
  if (address.serviceArea === "") errors["address.serviceArea"] = "required";
  else if (!context.serviceAreas.includes(address.serviceArea)) errors["address.serviceArea"] = "invalidServiceArea";
  checkText(errors, "address.addressLine", address.addressLine, { required: true, max: MAX_SHORT_TEXT * 2 });
  checkText(errors, "address.addressDetails", address.addressDetails, { required: false, max: MAX_SHORT_TEXT * 2 });

  // Slot
  if (!errors.serviceSlug) {
    const slotError = checkSlotAvailability
      ? checkSlot(input.slot, input.serviceSlug, context.bookedSlots, context.availability)
      : !isValidDate(input.slot.date) || !isValidTime(input.slot.start) || !isValidTime(input.slot.end)
        ? "slotUnavailable"
        : null;
    if (slotError) errors.slot = slotError;
  }

  // Customer
  const { customer } = input;
  checkText(errors, "customer.fullName", customer.fullName, { required: true, max: MAX_SHORT_TEXT });
  if (customer.phone === "") errors["customer.phone"] = "required";
  else if (!isValidPhone(customer.phone)) errors["customer.phone"] = "invalidPhone";
  if (customer.email !== null) {
    if (customer.email.length > MAX_SHORT_TEXT * 2) errors["customer.email"] = "tooLong";
    else if (!isValidEmail(customer.email)) errors["customer.email"] = "invalidEmail";
  }
  checkText(errors, "customer.notes", customer.notes, { required: false, max: MAX_LONG_TEXT });

  return errors;
}
