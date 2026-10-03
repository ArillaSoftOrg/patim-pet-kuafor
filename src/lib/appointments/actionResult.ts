import { AppointmentError } from "@/lib/appointments/repository";
import type { AppointmentErrorCode } from "@/lib/appointments/repository";
import type { Appointment } from "@/lib/appointments/types";
import type { AppointmentFieldErrors } from "@/lib/appointments/validation";

// What appointment Server Actions return. Errors are plain data because
// class instances don't survive the server→client boundary; the browser
// repository turns them back into AppointmentError.
export interface SerializedAppointmentError {
  code: AppointmentErrorCode;
  message: string;
  fieldErrors: AppointmentFieldErrors;
}

export type AppointmentActionResult =
  | { ok: true; appointment: Appointment }
  | { ok: false; error: SerializedAppointmentError };

export function actionFailure(
  code: AppointmentErrorCode,
  message: string,
  fieldErrors: AppointmentFieldErrors = {},
): AppointmentActionResult {
  return { ok: false, error: { code, message, fieldErrors } };
}

export function unwrapActionResult(result: AppointmentActionResult): Appointment {
  if (result.ok) return result.appointment;
  throw new AppointmentError(result.error.code, result.error.message, result.error.fieldErrors);
}
