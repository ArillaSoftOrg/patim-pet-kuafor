// Central on/off switches for optional messaging features, meant to be
// flipped per customer/package via environment variables at deploy time —
// never by hardcoding a package name into business logic (see
// src/lib/notifications and src/lib/marketing for what each flag gates).
// Every flag defaults to false: until a package is actually purchased and
// configured for a given deployment, KulaPAWS sends no notifications of
// any kind and collects no marketing consent.
//
// NEXT_PUBLIC_-prefixed on purpose — these are plain feature switches, not
// secrets (no provider credential lives here), and both server code (the
// booking/notification Server Actions) and client code (the booking
// wizard, the admin appointment view) need to agree on the same value
// without prop-drilling it through every intermediate component.
function isEnabled(value: string | undefined): boolean {
  return value === "true";
}

export interface MessagingFeatureFlags {
  // Transactional/service messages about a customer's own appointment
  // (requested, confirmed, reminder, rescheduled, cancelled). These are
  // never marketing and never require the consent below.
  serviceNotificationsEnabled: boolean;
  // Whether the booking flow offers a separate, optional marketing
  // communications checkbox and records consent when it's checked.
  marketingConsentEnabled: boolean;
  // Whether consented marketing messages are actually sent out (campaigns,
  // re-engagement). Kept independent of marketingConsentEnabled so consent
  // can be collected ahead of a campaign tool ever being connected.
  marketingAutomationEnabled: boolean;
}

export const messagingFeatureFlags: MessagingFeatureFlags = {
  serviceNotificationsEnabled: isEnabled(process.env.NEXT_PUBLIC_SERVICE_NOTIFICATIONS_ENABLED),
  marketingConsentEnabled: isEnabled(process.env.NEXT_PUBLIC_MARKETING_CONSENT_ENABLED),
  marketingAutomationEnabled: isEnabled(process.env.NEXT_PUBLIC_MARKETING_AUTOMATION_ENABLED),
};
