import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// For use in proxy.ts only. Distinct from the plain server client
// (src/lib/supabase/server.ts, which reads next/headers cookies() and can't
// reliably write them back from a Server Component render): proxy runs in a
// real request/response cycle, so it can both read the incoming request's
// cookies and write any refreshed session cookies onto the outgoing
// response — which is what keeps a signed-in session alive across
// requests. Returns the response object so the caller can return it
// (or a redirect built from it) to actually carry those cookies to the
// browser.
export function createProxyClient(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  return { supabase, response };
}
