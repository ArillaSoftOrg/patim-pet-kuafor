import { appointmentCopy } from "@/data/appointment";
import type { AppointmentCopy } from "@/data/appointment";
import {
  formatAppointmentDateLong,
  formatAppointmentReference,
  formatPetDescription,
  formatSlotTime,
} from "@/lib/appointments/format";
import type { Appointment } from "@/lib/appointments/types";

// The message a customer can send from the success screen — everything the
// business needs to find and confirm the request, one fact per line. `copy`
// defaults to English so any other call site keeps working unchanged; the
// success screen passes its own locale-resolved copy explicitly.
export function buildAppointmentWhatsAppMessage(
  appointment: Appointment,
  businessName: string,
  copy: AppointmentCopy = appointmentCopy,
): string {
  const { labels, greeting } = copy.whatsappMessage;
  const { address } = appointment;
  const streetAddress = [address.addressLine, address.addressDetails].filter(Boolean).join(", ");

  return [
    greeting(businessName),
    "",
    `${labels.reference}: ${formatAppointmentReference(appointment.id)}`,
    `${labels.service}: ${appointment.serviceTitle}`,
    `${labels.pet}: ${appointment.pet.name} (${formatPetDescription(appointment.pet, copy)})`,
    `${labels.date}: ${formatAppointmentDateLong(appointment.slot.date, copy)}`,
    `${labels.time}: ${formatSlotTime(appointment.slot)}`,
    `${labels.area}: ${address.serviceArea}`,
    `${labels.address}: ${streetAddress}`,
    `${labels.name}: ${appointment.customer.fullName}`,
    `${labels.phone}: ${appointment.customer.phone}`,
  ].join("\n");
}
