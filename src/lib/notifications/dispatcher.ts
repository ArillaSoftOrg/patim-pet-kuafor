import "server-only";
import { messagingFeatureFlags } from "@/lib/messaging/featureFlags";
import type { AppointmentNotificationEvent } from "@/lib/notifications/events";

// The integration point a future messaging package implements. Nothing in
// this file ever calls Twilio, the WhatsApp Cloud API, Resend, or any
// other external service — connecting one later means writing a class
// that implements this interface and swapping the export at the bottom of
// this file; no caller (src/lib/appointments/server/actions.ts) needs to
// change.
export interface NotificationDispatcher {
  dispatch(event: AppointmentNotificationEvent): Promise<void>;
}

// Default, no-op implementation. While serviceNotificationsEnabled is
// false (the default — see featureFlags.ts), this does nothing at all,
// not even log, so a deployment with no messaging package behaves exactly
// as it did before this architecture existed. Once the flag is switched
// on for a deployment, it logs the event server-side only, to prove the
// integration point actually fires end-to-end — it still never contacts
// a real phone number, email address, or WhatsApp account.
class NoopNotificationDispatcher implements NotificationDispatcher {
  async dispatch(event: AppointmentNotificationEvent): Promise<void> {
    if (!messagingFeatureFlags.serviceNotificationsEnabled) return;
    console.info(
      `[notifications] ${event.type} would be sent for appointment ${event.appointment.id} (no provider connected yet)`,
    );
  }
}

export const notificationDispatcher: NotificationDispatcher = new NoopNotificationDispatcher();

// Notifications are best-effort: a delivery failure (or, today, the no-op
// above) must never fail the booking/status write that triggered it.
// Every call site in server/actions.ts fires its event through this
// wrapper instead of calling the dispatcher directly.
export async function dispatchAppointmentEvent(event: AppointmentNotificationEvent): Promise<void> {
  try {
    await notificationDispatcher.dispatch(event);
  } catch (err) {
    console.error("dispatchAppointmentEvent: dispatch failed", err instanceof Error ? err.name : "unknown");
  }
}
