// See app/[locale]/page.tsx for why this re-exports rather than duplicates.
// The booking flow's visible copy is locale-resolved client-side (see
// AppointmentPageIntro.tsx / AppointmentWizard.tsx, which pick between
// appointmentCopy/appointmentCopyTr/appointmentCopyRu) — this route keeps
// tr/ru visitors inside their locale (header, footer, language switcher,
// and now the booking flow itself) on the way to and through it. Only
// `metadata` (the <title> tag, JSON-LD) stays English-only, the same
// documented scope boundary every other page here has.
export { default, metadata } from "@/app/appointment/page";
