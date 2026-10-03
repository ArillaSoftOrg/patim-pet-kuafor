import { createClient } from "@/lib/supabase/client";
import { rowToMarketingConsent } from "@/lib/marketing/consentRow";
import type { MarketingConsentRow } from "@/lib/marketing/consentRow";
import type { MarketingConsent } from "@/lib/marketing/types";

// Admin-only read (RLS grants SELECT on public.marketing_consents to
// authenticated + public.is_admin() only — see that migration). There is
// deliberately no write path here: a consent record is only ever created
// by recordMarketingConsentAction after a customer's own opt-in, never
// edited or backfilled by an admin.
export async function getMarketingConsentsForAppointment(appointmentId: string): Promise<MarketingConsent[]> {
  const { data, error } = await createClient()
    .from("marketing_consents")
    .select("*")
    .eq("appointment_id", appointmentId)
    .order("granted_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as MarketingConsentRow[]).map(rowToMarketingConsent);
}
