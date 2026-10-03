import type { Appointment } from "@/lib/appointments/types";

// The fixed set of appointment lifecycle events a future messaging
// package can notify a customer about — all of them transactional/service
// communications (never marketing; see src/lib/marketing for that). Adding
// a new event means adding one entry here; dispatcher.ts is where it's
// consumed, and server/actions.ts is where each one currently fires.
export type AppointmentNotificationEventType =
  | "appointment_requested"
  | "appointment_confirmed"
  | "appointment_reminder"
  | "appointment_rescheduled"
  | "appointment_cancelled";

export interface AppointmentNotificationEvent {
  type: AppointmentNotificationEventType;
  appointment: Appointment;
  // Only set for "appointment_rescheduled" — the slot being replaced.
  previousSlot?: Appointment["slot"];
}
