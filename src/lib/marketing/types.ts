// Marketing-consent domain types. Pure types only — no storage, no UI —
// same split as src/lib/appointments/types.ts. Deliberately not merged
// into the Appointment type: a consent record is a separate legal fact
// from the appointment it may have been collected alongside (see
// supabase/migrations' marketing_consents migration), and appointment
// data must never be treated as marketing consent on its own.

export type MarketingConsentChannel = "sms" | "whatsapp" | "email";
export const marketingConsentChannels: MarketingConsentChannel[] = ["sms", "whatsapp", "email"];

export function isMarketingConsentChannel(value: string): value is MarketingConsentChannel {
  return (marketingConsentChannels as readonly string[]).includes(value);
}

// What's needed to record one consent decision. Only ever constructed from
// an actual, affirmative customer action (a checked, optional checkbox) —
// never synthesized or assumed.
export interface MarketingConsentInput {
  // The appointment this consent was collected alongside, if any — purely
  // for traceability; consent is never inferred from booking an appointment.
  appointmentId?: string;
  customerPhone?: string;
  customerEmail?: string;
  channels: MarketingConsentChannel[];
  // Where consent was collected, e.g. "appointment_booking".
  source: string;
  // The exact, localized checkbox/disclosure text the customer saw.
  consentText: string;
  // Which edition of that wording — see consentVersion.ts.
  consentVersion: string;
  locale: string;
}

export interface MarketingConsent {
  id: string;
  appointmentId: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  channels: MarketingConsentChannel[];
  source: string;
  consentText: string;
  consentVersion: string;
  locale: string;
  grantedAt: string; // ISO 8601
  revokedAt: string | null; // ISO 8601, set once a future unsubscribe flow withdraws consent
  createdAt: string;
  updatedAt: string;
}
