"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { appointmentAvailability } from "@/data/appointmentAvailability";
import { business as defaultBusiness } from "@/data/business";
import { actionFailure } from "@/lib/appointments/actionResult";
import type { AppointmentActionResult } from "@/lib/appointments/actionResult";
import { bookedSlotRowToSlot, editableRowValues, newRowValues, rowToAppointment } from "@/lib/appointments/appointmentRow";
import type { AppointmentRow, BookedSlotRow } from "@/lib/appointments/appointmentRow";
import { isUuid, parseAppointmentChanges, parseAppointmentInput, parseStatus } from "@/lib/appointments/parseInput";
import {
  checkStatusChange,
  otherBookedSlots,
  prepareAppointmentUpdate,
  prepareNewAppointment,
} from "@/lib/appointments/rules";
import type { TimeSlot } from "@/lib/appointments/types";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createSecretClient } from "@/lib/supabase/secretClient";
import { dispatchAppointmentEvent } from "@/lib/notifications/dispatcher";

// Every appointment write goes through these Server Actions. Each one is a
// public POST endpoint, so each one treats its arguments as untrusted:
// shape-checks them, re-reads trusted facts (services, service areas,
// booked slots, the stored appointment) from the database, re-applies the
// same rules the UI used (rules.ts), and only then writes. The database
// adds the final guarantees (RLS, exclusion constraint, transition
// trigger, check constraints) — see supabase/migrations/
// 20260928120000_appointments.sql.
//
// Return values are the app-level Appointment shape only — never raw rows
// (request_id, version, rate-limit key stay server-side).

interface DbError {
  code?: string;
  message?: string;
}

// Server logs get stable identifiers only, never the error object itself:
// Postgres/PostgREST messages, details and hints can echo row values
// (customer and appointment data), and thrown errors can carry request data
// in their message or stack. Logged: a SQLSTATE/PostgREST code, the message
// only when it is one of our own fixed tokens (e.g. "rate_limited" raised by
// the migration's functions), and otherwise just the error's class name.
function logFailure(context: string, error: unknown): void {
  const parts: string[] = [];
  if (error && typeof error === "object") {
    const { code, message } = error as { code?: unknown; message?: unknown };
    if (typeof code === "string" && /^(?:[0-9A-Z]{5}|PGRST\d{3})$/.test(code)) parts.push(`code=${code}`);
    if (typeof message === "string" && /^[a-z_]{1,40}$/.test(message)) parts.push(`message=${message}`);
  }
  if (parts.length === 0) {
    const name = error instanceof Error && /^[A-Za-z]{1,40}$/.test(error.name) ? error.name : "unknown";
    parts.push(`error=${name}`);
  }
  console.error(`${context}: ${parts.join(" ")}`);
}

function fromDbError(error: DbError, context: string): AppointmentActionResult {
  if (error.code === "23P01") {
    return actionFailure("validation", "That time slot was just taken.", { slot: "slotTaken" });
  }
  if (error.code === "P0001" && error.message === "rate_limited") {
    return actionFailure("rate-limited", "Too many appointment requests for this phone number.");
  }
  if (error.code === "P0001" && error.message === "invalid_status_transition") {
    return actionFailure("invalid-transition", "That status change isn't allowed.");
  }
  if (error.code === "42501" || error.code === "PGRST301") {
    return actionFailure("unauthorized", "Not allowed.");
  }
  if (error.code === "23514" || error.code === "22000" || error.code === "22P02" || error.code === "22007") {
    return actionFailure("validation", "The appointment data is invalid.");
  }
  logFailure(`${context}: database error`, error);
  return actionFailure("storage", "The appointment couldn't be saved.");
}

// Service areas as the site shows them: the live business row, or the
// shipped default only when no row exists (same rule as
// getBusinessDataServer). null = lookup failed.
async function loadServiceAreas(supabase: SupabaseClient): Promise<readonly string[] | null> {
  const { data, error } = await supabase.from("business").select("service_areas").eq("id", 1).maybeSingle();
  if (error) {
    logFailure("appointments: service areas lookup failed", error);
    return null;
  }
  return data ? ((data as { service_areas: string[] | null }).service_areas ?? []) : defaultBusiness.serviceAreas;
}

async function loadBookedSlots(supabase: SupabaseClient, date: string): Promise<TimeSlot[] | null> {
  const { data, error } = await supabase.rpc("get_booked_slots", { p_from: date, p_to: date });
  if (error) {
    logFailure("appointments: booked slots lookup failed", error);
    return null;
  }
  return ((data ?? []) as BookedSlotRow[]).map(bookedSlotRowToSlot);
}

// ---------------------------------------------------------------- public

export async function createAppointmentAction(rawInput: unknown, rawRequestId: unknown): Promise<AppointmentActionResult> {
  try {
    const input = parseAppointmentInput(rawInput);
    if (!input || !isUuid(rawRequestId)) {
      return actionFailure("validation", "The appointment request is malformed.");
    }

    let secretDb: SupabaseClient;
    try {
      secretDb = createSecretClient();
    } catch (err) {
      logFailure("createAppointmentAction: secret client unavailable (check SUPABASE_SECRET_KEY and NEXT_PUBLIC_SUPABASE_URL)", err);
      return actionFailure("storage", "Appointments can't be saved right now.");
    }

    // A retry of a request that already succeeded (e.g. its response was
    // lost) returns that appointment — before validation, which would
    // otherwise see the slot as taken by the very appointment it created.
    const existing = await secretDb.from("appointments").select("*").eq("request_id", rawRequestId).maybeSingle();
    if (existing.error) return fromDbError(existing.error, "createAppointmentAction");
    if (existing.data) return { ok: true, appointment: rowToAppointment(existing.data as AppointmentRow) };

    // Trusted facts come from the database, not the request: the service
    // must be a published one (title taken from it, not from the client),
    // the area one of the live service areas, the slot free right now.
    const publicDb = createPublicClient();
    const [serviceAreas, serviceResult, bookedSlots] = await Promise.all([
      loadServiceAreas(publicDb),
      publicDb.from("services").select("title").eq("slug", input.serviceSlug).maybeSingle(),
      loadBookedSlots(publicDb, input.slot.date),
    ]);
    if (serviceAreas === null || bookedSlots === null || serviceResult.error) {
      return actionFailure("storage", "Appointment data couldn't be checked.");
    }
    const serviceTitle = (serviceResult.data as { title: string } | null)?.title ?? "";

    const prepared = prepareNewAppointment({ ...input, serviceTitle }, { serviceAreas, bookedSlots });
    if (!prepared.ok) {
      return actionFailure("validation", "The appointment request is invalid.", prepared.fieldErrors);
    }

    const { data, error } = await secretDb.rpc("create_appointment", {
      p_request_id: rawRequestId,
      p_appointment: newRowValues(prepared.input, appointmentAvailability.bufferMinutes),
    });
    if (error) return fromDbError(error, "createAppointmentAction");
    const appointment = rowToAppointment(data as AppointmentRow);
    // Only for the row actually created just now — the idempotent "already
    // exists" return above must never re-fire this for a retried request.
    // "appointment_reminder" has no trigger point here or anywhere else
    // yet — it needs a scheduled job (cron), which is deliberately out of
    // scope for this architecture pass; see src/lib/notifications/events.ts.
    await dispatchAppointmentEvent({ type: "appointment_requested", appointment });
    return { ok: true, appointment };
  } catch (err) {
    logFailure("createAppointmentAction: unexpected error", err);
    return actionFailure("storage", "The appointment couldn't be saved.");
  }
}

// ---------------------------------------------------------------- admin

// The same two-step check as src/proxy.ts and the (protected) admin layout:
// a verified user (getUser, never getSession), then public.is_admin(). The
// returned client carries that user's session, so RLS applies to every
// query made with it as a second, independent check.
async function adminClient(): Promise<SupabaseClient | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  return !error && isAdmin === true ? supabase : null;
}

async function loadRow(supabase: SupabaseClient, id: string): Promise<AppointmentRow | null | "error"> {
  const { data, error } = await supabase.from("appointments").select("*").eq("id", id).maybeSingle();
  if (error) {
    logFailure("appointments: load failed", error);
    return "error";
  }
  return data as AppointmentRow | null;
}

// Optimistic concurrency: the write only applies if the row still has the
// version this action read. Otherwise someone else saved in between and
// nothing is overwritten.
async function writeIfUnchanged(
  supabase: SupabaseClient,
  row: AppointmentRow,
  values: Record<string, unknown>,
  context: string,
): Promise<AppointmentActionResult> {
  const { data, error } = await supabase
    .from("appointments")
    .update(values)
    .eq("id", row.id)
    .eq("version", row.version)
    .select("*");
  if (error) return fromDbError(error, context);
  const updated = (data ?? []) as AppointmentRow[];
  if (updated.length === 0) {
    return actionFailure("conflict", "The appointment was changed by someone else. Nothing was saved.");
  }
  return { ok: true, appointment: rowToAppointment(updated[0]) };
}

function slotsEqual(a: TimeSlot, b: TimeSlot): boolean {
  return a.date === b.date && a.start === b.start && a.end === b.end;
}

export async function updateAppointmentAction(rawId: unknown, rawChanges: unknown): Promise<AppointmentActionResult> {
  try {
    const supabase = await adminClient();
    if (!supabase) return actionFailure("unauthorized", "Admin access required.");
    const changes = parseAppointmentChanges(rawChanges);
    if (!isUuid(rawId) || !changes) return actionFailure("validation", "The changes are malformed.");

    const row = await loadRow(supabase, rawId);
    if (row === "error") return actionFailure("storage", "The appointment couldn't be loaded.");
    if (!row) return actionFailure("not-found", "Appointment not found.");
    const existing = rowToAppointment(row);

    const date = changes.slot?.date ?? existing.slot.date;
    const [serviceAreas, bookedSlots] = await Promise.all([loadServiceAreas(supabase), loadBookedSlots(supabase, date)]);
    if (serviceAreas === null || bookedSlots === null) {
      return actionFailure("storage", "Appointment data couldn't be checked.");
    }

    const prepared = prepareAppointmentUpdate(existing, changes, {
      serviceAreas,
      bookedSlots: otherBookedSlots(bookedSlots, existing),
    });
    if (!prepared.ok) {
      return actionFailure("validation", "The appointment changes are invalid.", prepared.fieldErrors);
    }
    const result = await writeIfUnchanged(supabase, row, editableRowValues(prepared.input), "updateAppointmentAction");
    if (result.ok && changes.slot && !slotsEqual(existing.slot, result.appointment.slot)) {
      await dispatchAppointmentEvent({
        type: "appointment_rescheduled",
        appointment: result.appointment,
        previousSlot: existing.slot,
      });
    }
    return result;
  } catch (err) {
    logFailure("updateAppointmentAction: unexpected error", err);
    return actionFailure("storage", "The appointment couldn't be saved.");
  }
}

export async function updateAppointmentStatusAction(rawId: unknown, rawStatus: unknown): Promise<AppointmentActionResult> {
  try {
    const supabase = await adminClient();
    if (!supabase) return actionFailure("unauthorized", "Admin access required.");
    const status = parseStatus(rawStatus);
    if (!isUuid(rawId) || !status) return actionFailure("validation", "The status change is malformed.");

    const row = await loadRow(supabase, rawId);
    if (row === "error") return actionFailure("storage", "The appointment couldn't be loaded.");
    if (!row) return actionFailure("not-found", "Appointment not found.");
    const existing = rowToAppointment(row);
    if (existing.status === status) return { ok: true, appointment: existing };

    const bookedSlots = await loadBookedSlots(supabase, existing.slot.date);
    if (bookedSlots === null) return actionFailure("storage", "Appointment data couldn't be checked.");

    const check = checkStatusChange(existing, status, {
      serviceAreas: [],
      bookedSlots: otherBookedSlots(bookedSlots, existing),
    });
    if (!check.ok && check.code === "invalid-transition") {
      return actionFailure("invalid-transition", "That status change isn't allowed.");
    }
    if (!check.ok) {
      return actionFailure("validation", "This appointment's time slot is no longer available.", check.fieldErrors);
    }
    const result = await writeIfUnchanged(supabase, row, { status }, "updateAppointmentStatusAction");
    if (result.ok && (status === "confirmed" || status === "cancelled")) {
      await dispatchAppointmentEvent({
        type: status === "confirmed" ? "appointment_confirmed" : "appointment_cancelled",
        appointment: result.appointment,
      });
    }
    return result;
  } catch (err) {
    logFailure("updateAppointmentStatusAction: unexpected error", err);
    return actionFailure("storage", "The appointment couldn't be saved.");
  }
}
