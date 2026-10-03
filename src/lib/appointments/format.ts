import { appointmentCopy } from "@/data/appointment";
import type { AppointmentCopy } from "@/data/appointment";
import { appointmentAvailability } from "@/data/appointmentAvailability";
import { getBreed } from "@/data/petBreeds";
import type { PetDetails, PriceQuote, TimeSlot } from "@/lib/appointments/types";

// Every function below defaults `copy` to the English appointmentCopy, so
// every existing call site (admin, which is never locale-translated —
// see appointment.tr.ts/appointment.ru.ts) keeps working unchanged. The
// customer-facing booking flow passes its own locale-resolved copy
// explicitly (see AppointmentWizard.tsx).

// Short, human-friendly handle for an appointment id (a UUID) — enough to
// tell appointments apart in a WhatsApp chat or on the phone.
export function formatAppointmentReference(id: string): string {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}

// "Dog · Maltese · Small" — type, breed and (if any) size band.
export function formatPetDescription(pet: PetDetails, copy: AppointmentCopy = appointmentCopy): string {
  const parts = [copy.petTypes[pet.type], getBreed(pet.type, pet.breedId)?.label ?? pet.breedId];
  if (pet.size) parts.push(copy.sizes[pet.size].label);
  return parts.join(" · ");
}

// An ISO instant (createdAt/updatedAt) shown in the business time zone.
export function formatTimestamp(iso: string, copy: AppointmentCopy = appointmentCopy): string {
  return new Intl.DateTimeFormat(copy.locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: appointmentAvailability.timeZone,
  }).format(new Date(iso));
}

export function formatAppointmentDateLong(date: string, copy: AppointmentCopy = appointmentCopy): string {
  return formatAppointmentDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }, copy);
}

// Appointment dates are wall-clock calendar dates (see time.ts), so they're
// formatted as UTC midnight with timeZone "UTC" — formatting in the
// viewer's own zone could shift the displayed day.
export function formatAppointmentDate(
  date: string,
  options: Intl.DateTimeFormatOptions,
  copy: AppointmentCopy = appointmentCopy,
): string {
  return new Intl.DateTimeFormat(copy.locale, { ...options, timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

export function formatSlotTime(slot: TimeSlot): string {
  return `${slot.start} – ${slot.end}`;
}

export function formatPriceQuote(quote: PriceQuote, copy: AppointmentCopy = appointmentCopy): string {
  if (quote.kind === "priced") {
    return new Intl.NumberFormat(copy.locale, { style: "currency", currency: quote.currency }).format(quote.amount);
  }
  if (quote.kind === "on-request") return copy.price.onRequest;
  return copy.price.unavailable[quote.reason];
}
