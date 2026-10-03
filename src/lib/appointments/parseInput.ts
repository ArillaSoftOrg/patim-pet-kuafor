import type { AppointmentChanges } from "@/lib/appointments/repository";
import { appointmentStatuses, petSizes, petTypes } from "@/lib/appointments/types";
import type {
  AppointmentAddress,
  AppointmentInput,
  AppointmentStatus,
  BookablePriceQuote,
  CustomerDetails,
  PetDetails,
  TimeSlot,
} from "@/lib/appointments/types";

// Shape checks for data arriving at a Server Action — which anyone can call
// with anything. These only establish that the value *is* an
// AppointmentInput (right types, bounded sizes); the business rules are
// then applied by rules.ts/validation.ts exactly as for trusted input.

// Generous hard cap so a hostile payload can't make validation or the
// database do real work; the real limits live in validation.ts.
const MAX_RAW_STRING = 2000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Obj = Record<string, unknown>;
const isObject = (value: unknown): value is Obj => typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string => typeof value === "string" && value.length <= MAX_RAW_STRING;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function parseStatus(value: unknown): AppointmentStatus | null {
  return appointmentStatuses.includes(value as AppointmentStatus) ? (value as AppointmentStatus) : null;
}

function parsePet(value: unknown): PetDetails | null {
  if (!isObject(value)) return null;
  const { name, type, breedId, size, notes } = value;
  if (!isString(name) || !isString(breedId) || !isString(notes)) return null;
  if (!petTypes.includes(type as PetDetails["type"])) return null;
  if (size !== null && !petSizes.includes(size as NonNullable<PetDetails["size"]>)) return null;
  return { name, type: type as PetDetails["type"], breedId, size: size as PetDetails["size"], notes };
}

function parseAddress(value: unknown): AppointmentAddress | null {
  if (!isObject(value)) return null;
  const { serviceArea, addressLine, addressDetails } = value;
  if (!isString(serviceArea) || !isString(addressLine) || !isString(addressDetails)) return null;
  return { serviceArea, addressLine, addressDetails };
}

function parseSlot(value: unknown): TimeSlot | null {
  if (!isObject(value)) return null;
  const { date, start, end } = value;
  if (!isString(date) || !isString(start) || !isString(end)) return null;
  return { date, start, end };
}

function parseCustomer(value: unknown): CustomerDetails | null {
  if (!isObject(value)) return null;
  const { fullName, phone, email, notes } = value;
  if (!isString(fullName) || !isString(phone) || !isString(notes)) return null;
  if (email !== null && !isString(email)) return null;
  return { fullName, phone, email, notes };
}

function parsePrice(value: unknown): BookablePriceQuote | null {
  if (!isObject(value) || value.currency !== "TRY") return null;
  if (value.kind === "on-request") return { kind: "on-request", currency: "TRY" };
  if (value.kind === "priced" && typeof value.amount === "number" && Number.isFinite(value.amount)) {
    return { kind: "priced", amount: value.amount, currency: "TRY" };
  }
  return null;
}

export function parseAppointmentInput(value: unknown): AppointmentInput | null {
  if (!isObject(value)) return null;
  const pet = parsePet(value.pet);
  const address = parseAddress(value.address);
  const slot = parseSlot(value.slot);
  const customer = parseCustomer(value.customer);
  const price = parsePrice(value.price);
  if (!isString(value.serviceSlug) || !isString(value.serviceTitle)) return null;
  if (!pet || !address || !slot || !customer || !price) return null;
  return { serviceSlug: value.serviceSlug, serviceTitle: value.serviceTitle, pet, address, slot, customer, price };
}

// Each section is optional, but any section present must be complete.
export function parseAppointmentChanges(value: unknown): AppointmentChanges | null {
  if (!isObject(value)) return null;
  const changes: AppointmentChanges = {};
  if (value.pet !== undefined) {
    const pet = parsePet(value.pet);
    if (!pet) return null;
    changes.pet = pet;
  }
  if (value.address !== undefined) {
    const address = parseAddress(value.address);
    if (!address) return null;
    changes.address = address;
  }
  if (value.slot !== undefined) {
    const slot = parseSlot(value.slot);
    if (!slot) return null;
    changes.slot = slot;
  }
  if (value.customer !== undefined) {
    const customer = parseCustomer(value.customer);
    if (!customer) return null;
    changes.customer = customer;
  }
  return changes;
}
