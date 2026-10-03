import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// For use in Server Components, Server Actions, and Route Handlers only.
// Must be created fresh per request (never module-level) since it reads
// the request's cookies via next/headers.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component during rendering, where cookies
            // can't be set — safe to ignore here since src/proxy.ts already
            // refreshes the session cookie on every /admin request before
            // any Server Component using this client runs.
          }
        },
      },
    },
  );
}
