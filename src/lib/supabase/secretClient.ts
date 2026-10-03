import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only client using the project's secret key (service_role: bypasses
// RLS). Used for exactly one thing: creating appointments through
// public.create_appointment(), which anon cannot execute — so the booking
// Server Action, with its server-side validation, is the only way to create
// one. Everything else in the app keeps using the publishable key and RLS.
//
// SUPABASE_SECRET_KEY must never be exposed to the browser: no NEXT_PUBLIC_
// prefix (so Next.js never inlines it into client bundles), and the
// "server-only" import makes any client-side import of this module a build
// error.
export function createSecretClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_SECRET_KEY (and NEXT_PUBLIC_SUPABASE_URL) must be set on the server to create appointments.");
  }
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
