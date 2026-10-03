import { appointmentCopy } from "@/data/appointment";
import { appointmentAvailability } from "@/data/appointmentAvailability";
import { getBreed } from "@/data/petBreeds";
import { getAvailableSlots, getBookableDates } from "@/lib/appointments/availability";
import type { AvailabilityOptions } from "@/lib/appointments/availability";
import { isAppointmentError } from "@/lib/appointments/repository";
import type { AppointmentChanges } from "@/lib/appointments/repository";
import type { AppointmentFieldErrors } from "@/lib/appointments/validation";
import { getZonedNow } from "@/lib/appointments/time";
import type {
  Appointment,
  AppointmentAddress,
  AppointmentStatus,
  PetDetails,
  PetSize,
  PetType,
  TimeSlot,
} from "@/lib/appointments/types";

// Pure list/edit logic for the admin appointments screen — no React, no
// storage — so filtering, ordering and edit rules are testable on their own.

// ---------------------------------------------------------------- list

export type SortOrder = "asc" | "desc";

export interface AppointmentFilters {
  status: AppointmentStatus | "all";
  from: string; // YYYY-MM-DD or ""
  to: string; // YYYY-MM-DD or ""
  order: SortOrder;
}

// Operational default: everything from today on, soonest first.
export function defaultFilters(now?: Date): AppointmentFilters {
  return { status: "all", from: getZonedNow(appointmentAvailability.timeZone, now).date, to: "", order: "asc" };
}

export const clearedFilters: AppointmentFilters = { status: "all", from: "", to: "", order: "asc" };

export function isInvalidRange(filters: AppointmentFilters): boolean {
  return filters.from !== "" && filters.to !== "" && filters.to < filters.from;
}

function compareChronologically(a: Appointment, b: Appointment): number {
  return (
    a.slot.date.localeCompare(b.slot.date) ||
    a.slot.start.localeCompare(b.slot.start) ||
    a.createdAt.localeCompare(b.createdAt)
  );
}

// Status + inclusive date range, ordered by appointment date/time. Dates
// are YYYY-MM-DD strings, so plain string comparison is chronological.
export function filterAppointments(appointments: readonly Appointment[], filters: AppointmentFilters): Appointment[] {
  if (isInvalidRange(filters)) return [];
  const result = appointments.filter(
    (appointment) =>
      (filters.status === "all" || appointment.status === filters.status) &&
      (filters.from === "" || appointment.slot.date >= filters.from) &&
      (filters.to === "" || appointment.slot.date <= filters.to),
  );
  result.sort(compareChronologically);
  return filters.order === "desc" ? result.reverse() : result;
}

// ---------------------------------------------------------------- errors

export interface AdminErrorDescription {
  message: string;
  fieldErrors: AppointmentFieldErrors;
}

// Repository failure → what the admin sees. A lone slot problem (e.g.
// reopening into a slot that's since been taken) is specific enough to
// state directly; other validation failures point at the fields.
export function describeAppointmentError(error: unknown): AdminErrorDescription {
  const { errors } = appointmentCopy.admin;
  if (!isAppointmentError(error)) return { message: errors.unexpected, fieldErrors: {} };
  switch (error.code) {
    case "validation": {
      const fields = Object.keys(error.fieldErrors);
      const slotCode = error.fieldErrors.slot;
      const message =
        fields.length === 1 && slotCode ? appointmentCopy.validation[slotCode] : errors.validation;
      return { message, fieldErrors: error.fieldErrors };
    }
    case "not-found":
      return { message: errors.notFound, fieldErrors: {} };
    case "invalid-transition":
      return { message: errors.invalidTransition, fieldErrors: {} };
    case "conflict":
      return { message: errors.conflict, fieldErrors: {} };
    case "unauthorized":
      return { message: errors.unauthorized, fieldErrors: {} };
    case "rate-limited":
    case "storage":
      return { message: errors.storage, fieldErrors: {} };
  }
}

// ---------------------------------------------------------------- edit

export interface CustomerDraft {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

export interface EditDraft {
  pet: PetDetails;
  address: AppointmentAddress;
  date: string;
  // null after the date changes, until a new time is chosen.
  slot: TimeSlot | null;
  customer: CustomerDraft;
}

export function draftFromAppointment(appointment: Appointment): EditDraft {
  return {
    pet: { ...appointment.pet },
    address: { ...appointment.address },
    date: appointment.slot.date,
    slot: { ...appointment.slot },
    customer: { ...appointment.customer, email: appointment.customer.email ?? "" },
  };
}

function isSameSlot(a: TimeSlot, b: TimeSlot): boolean {
  return a.date === b.date && a.start === b.start && a.end === b.end;
}

// The same pet rules as the booking flow: a new type clears breed/size; a
// breed with a fixed size band sets it; switching between breeds that
// leave size open keeps the chosen size.
export function changePetType(pet: PetDetails, type: PetType): PetDetails {
  return type === pet.type ? pet : { ...pet, type, breedId: "", size: null };
}

export function changePetBreed(pet: PetDetails, breedId: string): PetDetails {
  const breed = getBreed(pet.type, breedId);
  const previous = getBreed(pet.type, pet.breedId);
  const size: PetSize | null =
    breed?.size ?? (pet.type === "dog" && previous?.size === null ? pet.size : null);
  return { ...pet, breedId, size };
}

// Only sections that actually differ are sent — the repository re-quotes
// the price only for a changed pet and re-checks availability only for a
// changed slot, so an untouched slot is never tested against itself.
export function changesFromDraft(appointment: Appointment, draft: EditDraft): AppointmentChanges {
  const changes: AppointmentChanges = {};
  if (JSON.stringify(draft.pet) !== JSON.stringify(appointment.pet)) changes.pet = draft.pet;
  if (JSON.stringify(draft.address) !== JSON.stringify(appointment.address)) changes.address = draft.address;
  if (draft.slot && !isSameSlot(draft.slot, appointment.slot)) changes.slot = draft.slot;
  const customer = { ...draft.customer, email: draft.customer.email.trim() === "" ? null : draft.customer.email };
  if (JSON.stringify(customer) !== JSON.stringify(appointment.customer)) changes.customer = customer;
  return changes;
}

// Other appointments' slots: the appointment's own slot is removed once so
// it never conflicts with itself.
export function withoutOwnSlot(bookedSlots: readonly TimeSlot[], own: TimeSlot): TimeSlot[] {
  const index = bookedSlots.findIndex((slot) => isSameSlot(slot, own));
  return index === -1 ? [...bookedSlots] : [...bookedSlots.slice(0, index), ...bookedSlots.slice(index + 1)];
}

export interface EditOption<T> {
  value: T;
  isCurrent: boolean;
}

// Same bookable window as the customer flow, plus the appointment's own
// date so an unchanged (possibly past or within-lead-time) date stays
// selectable.
export function getEditDateOptions(appointment: Appointment, options: AvailabilityOptions = {}): EditOption<string>[] {
  const dates = new Set(getBookableDates(options));
  dates.add(appointment.slot.date);
  return [...dates].sort().map((value) => ({ value, isCurrent: value === appointment.slot.date }));
}

// Free times for `date` under the customer-flow rules (hours, lead time,
// buffers) given the other appointments' slots — plus the appointment's
// own current slot on its own date, which it is always allowed to keep.
export function getEditSlotOptions(
  appointment: Appointment,
  date: string,
  otherBookedSlots: readonly TimeSlot[],
  options: AvailabilityOptions = {},
): EditOption<TimeSlot>[] {
  const available = getAvailableSlots(
    { date, serviceSlug: appointment.serviceSlug, bookedSlots: [...otherBookedSlots] },
    options,
  );
  const slots = date === appointment.slot.date ? [appointment.slot, ...available] : available;
  const unique = slots.filter(
    (slot, index) => slots.findIndex((other) => isSameSlot(other, slot)) === index,
  );
  unique.sort((a, b) => a.start.localeCompare(b.start));
  return unique.map((value) => ({ value, isCurrent: isSameSlot(value, appointment.slot) }));
}
