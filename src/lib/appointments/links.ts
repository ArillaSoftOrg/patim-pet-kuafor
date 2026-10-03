import { primaryCta } from "@/data/navigation";

// The booking flow's URL, optionally with a service preselected (the flow
// reads ?service=<slug> and opens on the pet step). Built from primaryCta so
// every entry point follows the one site-wide "Request Appointment" target;
// pass `baseHref` to use its localized form (navHref(locale, primaryCta)).
export function appointmentHref(serviceSlug?: string, baseHref: string = primaryCta.href): string {
  return serviceSlug ? `${baseHref}?service=${encodeURIComponent(serviceSlug)}` : baseHref;
}
