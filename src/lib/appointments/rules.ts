import type { PricingConfig } from "@/data/appointmentPricing";
import type { AvailabilityOptions } from "@/lib/appointments/availability";
import { quotePrice } from "@/lib/appointments/pricing";
import type { AppointmentChanges } from "@/lib/appointments/repository";
import { slotBlockingStatuses } from "@/lib/appointments/types";
import type { Appointment, AppointmentInput, AppointmentStatus, TimeSlot } from "@/lib/appointments/types";
import {
  canTransitionStatus,
  checkSlot,
  hasErrors,
  isBookablePrice,
  normalizeAppointmentInput,
  validateAppointmentInput,
} from "@/lib/appointments/validation";
import type { AppointmentFieldErrors } from "@/lib/appointments/validation";

// The appointment write rules, shared by every repository implementation
// (the Supabase-backed Server Actions and the local/in-memory one), so the
// same request is judged identically wherever it's handled.

export interface RulesContext {
  // Live business.serviceAreas.
  serviceAreas: readonly string[];
  // Slots held by OTHER slot-blocking appointments (see otherBookedSlots).
  bookedSlots: readonly TimeSlot[];
  pricing?: PricingConfig;
  availability?: AvailabilityOptions;
}

export type PrepareResult = { ok: true; input: AppointmentInput } | { ok: false; fieldErrors: AppointmentFieldErrors };

export type StatusCheckResult =
  | { ok: true }
  | { ok: false; code: "invalid-transition" }
  | { ok: false; code: "validation"; fieldErrors: AppointmentFieldErrors };

export function isSameSlot(a: TimeSlot, b: TimeSlot): boolean {
  return a.date === b.date && a.start === b.start && a.end === b.end;
}

// Booked slots minus this appointment's own — only if it currently holds
// one, so a cancelled appointment never "frees" someone else's identical
// slot.
export function otherBookedSlots(bookedSlots: readonly TimeSlot[], appointment: Appointment): TimeSlot[] {
  if (!slotBlockingStatuses.includes(appointment.status)) return [...bookedSlots];
  const index = bookedSlots.findIndex((slot) => isSameSlot(slot, appointment.slot));
  return index === -1 ? [...bookedSlots] : [...bookedSlots.slice(0, index), ...bookedSlots.slice(index + 1)];
}

export function appointmentToInput(appointment: Appointment): AppointmentInput {
  return {
    serviceSlug: appointment.serviceSlug,
    serviceTitle: appointment.serviceTitle,
    pet: appointment.pet,
    address: appointment.address,
    slot: appointment.slot,
    customer: appointment.customer,
    price: appointment.price,
  };
}

export function prepareNewAppointment(rawInput: AppointmentInput, context: RulesContext): PrepareResult {
  const input = normalizeAppointmentInput(rawInput);
  const fieldErrors = validateAppointmentInput(input, context);
  return hasErrors(fieldErrors) ? { ok: false, fieldErrors } : { ok: true, input };
}

// Applies an admin edit to an existing appointment: sections replace whole,
// a changed pet is re-quoted, availability is re-checked only for a changed
// slot on a slot-blocking appointment, and the price snapshot stands for an
// unchanged pet even if pricing config has changed since.
export function prepareAppointmentUpdate(
  existing: Appointment,
  changes: AppointmentChanges,
  context: RulesContext,
): PrepareResult {
  const merged = normalizeAppointmentInput({ ...appointmentToInput(existing), ...changes });
  const petChanged = changes.pet !== undefined && JSON.stringify(merged.pet) !== JSON.stringify(existing.pet);
  const slotChanged = !isSameSlot(merged.slot, existing.slot);

  if (petChanged) {
    const quote = quotePrice(
      { serviceSlug: merged.serviceSlug, petType: merged.pet.type, breedId: merged.pet.breedId, size: merged.pet.size },
      context.pricing,
    );
    if (isBookablePrice(quote)) merged.price = quote;
  }

  const fieldErrors = validateAppointmentInput(merged, {
    ...context,
    checkSlotAvailability: slotChanged && slotBlockingStatuses.includes(existing.status),
    checkPrice: petChanged,
  });
  return hasErrors(fieldErrors) ? { ok: false, fieldErrors } : { ok: true, input: merged };
}

export function checkStatusChange(
  existing: Appointment,
  status: AppointmentStatus,
  context: RulesContext,
): StatusCheckResult {
  if (!canTransitionStatus(existing.status, status)) return { ok: false, code: "invalid-transition" };
  // Moving back into a slot-blocking status (e.g. reopening a
  // cancellation) must not double-book a slot taken in the meantime.
  if (!slotBlockingStatuses.includes(existing.status) && slotBlockingStatuses.includes(status)) {
    const slotError = checkSlot(existing.slot, existing.serviceSlug, context.bookedSlots, context.availability);
    if (slotError) return { ok: false, code: "validation", fieldErrors: { slot: slotError } };
  }
  return { ok: true };
}
