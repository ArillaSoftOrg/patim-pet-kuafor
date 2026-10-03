import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { business as defaultBusiness } from "@/data/business";
import { rowToBusiness } from "@/lib/content/businessRow";
import type { Business } from "@/data/business";
import type { BusinessRow } from "@/lib/content/businessRow";

// Server-side counterpart to businessRepository.get() (which uses the
// cookie-carrying browser client, for the public page's own live-refresh
// after hydration). Same anon-key, RLS-gated read (business_public_select,
// USING (true)) — no service-role key. Used so the site-wide Organization
// JSON-LD (rendered from the root layout) reads from the same source of
// truth as the visible page, instead of a separately-maintained static
// copy that can silently drift out of sync with what Supabase actually
// has.
//
// Supabase is authoritative once a row exists: a successful query
// returning a row — even one whose optional fields are still null/empty —
// is returned AS-IS, exactly matching businessRepository.get()'s own
// semantics. This must never merge in the static default for fields an
// admin may have intentionally cleared. The static default is used ONLY
// when the Supabase request itself fails (network/config error) or no row
// exists at all — resilience for an outage, not a second source of truth.
export const getBusinessDataServer = cache(async (): Promise<Business> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("business").select("*").eq("id", 1).maybeSingle();

    if (error) {
      console.error("getBusinessDataServer: Supabase lookup failed, falling back to static defaults:", error.message);
      return defaultBusiness;
    }

    return data ? rowToBusiness(data as BusinessRow) : defaultBusiness;
  } catch (err) {
    console.error("getBusinessDataServer: Supabase client failed, falling back to static defaults:", err);
    return defaultBusiness;
  }
});
