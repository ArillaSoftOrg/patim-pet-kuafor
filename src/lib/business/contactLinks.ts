// Both derive their href from the same stored display value (e.g.
// "+90 540 314 62 23") rather than needing a second, separately-maintained
// "raw digits" field — one source of truth for NAP consistency.

// "tel:" wants the number as-is (with the leading +), just without spaces.
export function buildTelHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

// wa.me wants digits only — no "+", no spaces. `message` is optional
// prefilled text for the chat composer (e.g. a hero quick-contact CTA).
export function buildWhatsAppHref(whatsapp: string, message?: string): string {
  const base = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// wa.me needs a full international number, so a value that can't be one
// (empty, or outside E.164's length range once reduced to digits) must not
// become a link at all rather than a broken one.
export function hasValidWhatsAppNumber(whatsapp: string | null | undefined): whatsapp is string {
  const digits = whatsapp?.replace(/\D/g, "") ?? "";
  return digits.length >= 8 && digits.length <= 15;
}
