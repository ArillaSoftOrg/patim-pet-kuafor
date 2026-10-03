// Bump this whenever the marketing-consent checkbox wording (AppointmentCopy
// .marketing in src/data/appointment.ts and its tr/ru translations) changes,
// so every recorded consent stays traceable to the exact wording a customer
// saw when they opted in. Independent of the legal pages' own "last updated"
// dates in src/data/legal.ts — this versions the consent checkbox text only.
export const MARKETING_CONSENT_VERSION = "2026-10-02";
