"use server";

import { messagingFeatureFlags } from "@/lib/messaging/featureFlags";
import { marketingConsentChannels } from "@/lib/marketing/types";
import type { MarketingConsent, MarketingConsentInput } from "@/lib/marketing/types";
import { rowToMarketingConsent } from "@/lib/marketing/consentRow";
import type { MarketingConsentRow } from "@/lib/marketing/consentRow";
import { createSecretClient } from "@/lib/supabase/secretClient";

// Mirrors src/lib/appointments/server/actions.ts: a public Server Action
// that treats its argument as untrusted, re-validates it server-side, and
// writes through the service-role key only — the browser never has a
// direct insert grant on public.marketing_consents (see that migration).

export type RecordMarketingConsentResult =
  | { ok: true; consent: MarketingConsent }
  | { ok: false; error: "feature_disabled" | "invalid_input" | "storage" };

function isValidInput(input: MarketingConsentInput): boolean {
  if (!input.customerPhone && !input.customerEmail) return false;
  if (input.channels.length === 0) return false;
  if (!input.channels.every((channel) => marketingConsentChannels.includes(channel))) return false;
  if (!input.source.trim() || !input.consentText.trim() || !input.consentVersion.trim() || !input.locale.trim()) {
    return false;
  }
  return true;
}

function logFailure(context: string, error: unknown): void {
  const code = error && typeof error === "object" && "code" in error ? String((error as { code: unknown }).code) : null;
  console.error(`${context}: ${code ?? (error instanceof Error ? error.name : "unknown")}`);
}

// Only ever called when a customer has actually opted in, on a step gated
// by messagingFeatureFlags.marketingConsentEnabled in the UI — never to
// "backfill" or assume consent (see the type's own doc comment). If the
// flag is off for this deployment, this refuses the write outright, so a
// stale client (or a direct call) can't record consent for a feature the
// deployment hasn't activated.
export async function recordMarketingConsentAction(input: MarketingConsentInput): Promise<RecordMarketingConsentResult> {
  if (!messagingFeatureFlags.marketingConsentEnabled) {
    return { ok: false, error: "feature_disabled" };
  }
  if (!isValidInput(input)) {
    return { ok: false, error: "invalid_input" };
  }

  try {
    const secretDb = createSecretClient();
    const { data, error } = await secretDb.rpc("record_marketing_consent", {
      p_consent: {
        appointment_id: input.appointmentId ?? null,
        customer_phone: input.customerPhone ?? null,
        customer_email: input.customerEmail ?? null,
        channels: input.channels,
        source: input.source,
        consent_text: input.consentText,
        consent_version: input.consentVersion,
        locale: input.locale,
      },
    });
    if (error) {
      logFailure("recordMarketingConsentAction: database error", error);
      return { ok: false, error: "storage" };
    }
    return { ok: true, consent: rowToMarketingConsent(data as MarketingConsentRow) };
  } catch (err) {
    logFailure("recordMarketingConsentAction: unexpected error", err);
    return { ok: false, error: "storage" };
  }
}
