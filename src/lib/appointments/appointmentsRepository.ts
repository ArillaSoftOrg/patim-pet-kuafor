import { createSupabaseAppointmentsRepository } from "@/lib/appointments/supabaseRepository";
import type { AppointmentsRepository } from "@/lib/appointments/repository";

// The one place the app chooses how appointments are persisted. Everything
// else imports `appointmentsRepository` from here and depends only on the
// AppointmentsRepository interface.
//
// Supabase-backed (supabaseRepository.ts): reads through RLS, writes through
// validated Server Actions. Used from Client Components. Deliberately not
// part of resetAll.ts — the content reset in /admin/settings must never
// touch appointments.
export const appointmentsRepository: AppointmentsRepository = createSupabaseAppointmentsRepository();
