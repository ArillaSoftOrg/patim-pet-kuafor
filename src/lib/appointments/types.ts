// Core appointment domain types. Pure types/constants only — no storage,
// no UI. Shared by the customer booking flow, the admin appointments
// section, and the repository implementation that backs them (Supabase),
// so none of those depend on each other's shapes.

export type PetType = "dog" | "cat";
export const petTypes: PetType[] = ["dog", "cat"];

// Size bands drive pricing (and potentially duration) for pets whose breed
// doesn't pin one down. Cats currently have no size band — see
// src/data/appointmentPricing.ts.
export type PetSize = "small" | "medium" | "large";
export const petSizes: PetSize[] = ["small", "medium", "large"];

// Breed id meaning "mixed breed / not listed" — the customer picks a size
// band themselves instead of it being derived from the breed.
export const OTHER_BREED_ID = "other";

export interface PetDetails {
  name: string;
  type: PetType;
  breedId: string;
  // Resolved size band: the breed's own size when it has one, otherwise
  // the customer's choice. null when the pet type has no size bands.
  size: PetSize | null;
  notes: string;
}

export interface AppointmentAddress {
  // One of business.serviceAreas — Kulapaws only travels within these.
  serviceArea: string;
  addressLine: string;
  addressDetails: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string | null;
  notes: string;
}

// Dates and times are always wall-clock values in the business time zone
// (src/data/appointmentAvailability.ts), never UTC — a slot means the same
// thing to the customer, the admin and the groomer regardless of where
// the code runs.
export interface TimeSlot {
  date: string; // YYYY-MM-DD
  start: string; // HH:MM, 24-hour
  end: string; // HH:MM, 24-hour
}

export type Currency = "TRY";

export type PriceUnavailableReason = "unknown-service" | "pet-not-offered" | "size-required";

export type PriceQuote =
  | { kind: "priced"; amount: number; currency: Currency }
  // Service is offered for this pet, but no confirmed price is configured.
  | { kind: "on-request"; currency: Currency }
  | { kind: "unavailable"; reason: PriceUnavailableReason };

export type BookablePriceQuote = Exclude<PriceQuote, { kind: "unavailable" }>;

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";
export const appointmentStatuses: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];

// Appointments in these states still occupy their time slot.
export const slotBlockingStatuses: AppointmentStatus[] = ["pending", "confirmed"];

// Status changes an admin may make. Undo paths are allowed (a mistaken
// completion, reopening a cancellation), but reopening into a slot-blocking
// status re-checks that the slot is still free.
export const appointmentStatusTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["pending", "completed", "cancelled"],
  completed: ["confirmed"],
  cancelled: ["pending"],
};

export interface Appointment {
  id: string;
  status: AppointmentStatus;
  serviceSlug: string;
  // Snapshotted at booking time: admins can rename or delete services
  // afterwards, and an existing appointment must still read correctly.
  serviceTitle: string;
  pet: PetDetails;
  address: AppointmentAddress;
  slot: TimeSlot;
  customer: CustomerDetails;
  // Snapshotted for the same reason — later pricing edits must not
  // silently change what the customer was quoted.
  price: BookablePriceQuote;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// What the booking flow submits; the repository assigns the rest.
export type AppointmentInput = Omit<Appointment, "id" | "status" | "createdAt" | "updatedAt">;
