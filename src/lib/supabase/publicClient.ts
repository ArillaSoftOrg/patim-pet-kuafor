import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// For public, RLS-gated reads (e.g. generateMetadata) that must stay
// eligible for static rendering. Distinct from server.ts: that client
// reads next/headers cookies(), which forces Next.js to treat the calling
// route as dynamic even when no session/auth is actually needed. This
// client carries no cookies and no session — it's the same anon
// (publishable) key used everywhere else in the app, relying entirely on
// RLS for what it can read, same as the browser client.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
