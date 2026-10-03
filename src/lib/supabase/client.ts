import { createBrowserClient } from "@supabase/ssr";

// For use in Client Components only. Safe to call per-render — createBrowserClient
// reuses a single underlying instance internally.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
