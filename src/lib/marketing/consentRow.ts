import type { MarketingConsent, MarketingConsentChannel } from "@/lib/marketing/types";

// The one place a public.marketing_consents row (see supabase/migrations'
// marketing_consents migration) meets the app's MarketingConsent shape —
// same split as src/lib/appointments/appointmentRow.ts.
export interface MarketingConsentRow {
  id: string;
  appointment_id: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  channels: string[];
  source: string;
  consent_text: string;
  consent_version: string;
  locale: string;
  granted_at: string;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
}

export function rowToMarketingConsent(row: MarketingConsentRow): MarketingConsent {
  return {
    id: row.id,
    appointmentId: row.appointment_id,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    channels: row.channels as MarketingConsentChannel[],
    source: row.source,
    consentText: row.consent_text,
    consentVersion: row.consent_version,
    locale: row.locale,
    grantedAt: row.granted_at,
    revokedAt: row.revoked_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
