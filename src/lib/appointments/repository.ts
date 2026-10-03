import type {
  Appointment,
  AppointmentAddress,
  AppointmentInput,
  AppointmentStatus,
  CustomerDetails,
  PetDetails,
  TimeSlot,
} from "@/lib/appointments/types";
import type { AppointmentFieldErrors } from "@/lib/appointments/validation";

// Admin edits replace a whole section at a time. The service itself can't
// be changed on an existing appointment — that's a different booking.
export interface AppointmentChanges {
  pet?: PetDetails;
  address?: AppointmentAddress;
  slot?: TimeSlot;
  customer?: CustomerDetails;
}

// Inclusive YYYY-MM-DD bounds; either may be omitted.
export interface DateRange {
  from?: string;
  to?: string;
}

// The persistence boundary for appointments. The booking flow and the
// admin section depend only on this interface — never on how or where
// appointments are stored — so the backing implementation (currently
// supabaseRepository.ts) can change without touching either. Every method
// is async for the same reason as ContentRepository
// (src/lib/content/types.ts).
//
// Implementations must enforce validation and slot conflicts themselves
// (create/update/updateStatus), not trust the caller to have checked.
export interface AppointmentsRepository {
  // All appointments, earliest slot first. Admin use only: contains
  // customer personal data.
  list(): Promise<Appointment[]>;
  get(id: string): Promise<Appointment | null>;
  // Slots held by slot-blocking appointments — no personal data, so it's
  // what the public booking flow uses to compute free times.
  getBookedSlots(range?: DateRange): Promise<TimeSlot[]>;
  create(input: AppointmentInput, options?: CreateAppointmentOptions): Promise<Appointment>;
  update(id: string, changes: AppointmentChanges): Promise<Appointment>;
  updateStatus(id: string, status: AppointmentStatus): Promise<Appointment>;
  // Calls `onChange` when appointments may have changed elsewhere (another
  // tab or device). A refresh hint only — it can also fire for this
  // caller's own writes, so handlers must be idempotent (re-read, never
  // write). Returns an unsubscribe function.
  subscribe(onChange: () => void): () => void;
}

export interface CreateAppointmentOptions {
  // Idempotency key for one booking attempt: resubmitting with the same key
  // (retry after a lost response, double submit) returns the appointment
  // already created instead of creating another.
  requestId?: string;
}

export type AppointmentErrorCode =
  | "validation"
  | "not-found"
  | "invalid-transition"
  // The appointment changed between being read and written (concurrent
  // admin edit); nothing was saved.
  | "conflict"
  | "rate-limited"
  | "unauthorized"
  | "storage";

// One error type for every repository failure, so callers can branch on
// `code` (and show `fieldErrors` next to fields) regardless of backend.
export class AppointmentError extends Error {
  readonly code: AppointmentErrorCode;
  readonly fieldErrors: AppointmentFieldErrors;

  constructor(code: AppointmentErrorCode, message: string, fieldErrors: AppointmentFieldErrors = {}) {
    super(message);
    this.name = "AppointmentError";
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export function isAppointmentError(error: unknown): error is AppointmentError {
  return error instanceof AppointmentError;
}
