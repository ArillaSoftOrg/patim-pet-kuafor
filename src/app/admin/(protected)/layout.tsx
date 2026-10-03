import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/layout/AdminShell";

// Primary route protection lives in src/proxy.ts, which runs on every
// request to /admin/*, including client-side navigations between sibling
// admin pages that this layout does NOT re-render for. This check is
// deliberate defense in depth on top of that — Next's own proxy docs
// recommend never relying on Proxy alone. Signing a rejected non-admin out
// still happens in the proxy (a Server Component render like this one can't
// send the Set-Cookie header signOut() needs); this layout only needs to
// make sure they never see protected content.
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    redirect("/admin/login?error=not_authorized");
  }

  return <AdminShell>{children}</AdminShell>;
}
