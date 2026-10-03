"use client";

import { useEffect, useState } from "react";
import { appointmentCopy } from "@/data/appointment";
import { formatTimestamp } from "@/lib/appointments/format";
import { getMarketingConsentsForAppointment } from "@/lib/marketing/consentRepository";
import type { MarketingConsent } from "@/lib/marketing/types";

const copy = appointmentCopy.admin.marketingConsent;

// Read-only — there is no admin edit/write path for consent (see
// src/lib/marketing/consentRepository.ts's header comment). This is
// deliberately a small, self-contained status line for future CRM use,
// not a CRM: it shows the latest consent decision on record for this
// appointment and nothing else. The caller (AppointmentDetail.tsx) only
// renders this at all when messagingFeatureFlags.marketingConsentEnabled
// is true for the deployment, and must pass `key={appointmentId}` so a
// different appointment gets a fresh "loading" state instead of this one
// resetting it mid-effect.
export function MarketingConsentStatus({ appointmentId }: { appointmentId: string }) {
  const [consents, setConsents] = useState<MarketingConsent[] | "loading" | "error">("loading");

  useEffect(() => {
    let active = true;
    getMarketingConsentsForAppointment(appointmentId)
      .then((result) => {
        if (active) setConsents(result);
      })
      .catch(() => {
        if (active) setConsents("error");
      });
    return () => {
      active = false;
    };
  }, [appointmentId]);

  if (consents === "error") return null;

  return (
    <section aria-labelledby="admin-appointment-marketing-consent-heading" className="flex flex-col gap-2">
      <h3 id="admin-appointment-marketing-consent-heading" className="text-[15px] font-semibold text-foreground">
        {copy.heading}
      </h3>
      {consents === "loading" ? (
        <p className="text-[14px] text-muted-foreground">{copy.loading}</p>
      ) : consents.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">{copy.none}</p>
      ) : (
        <p className="text-[14px] text-muted-foreground">
          {(() => {
            const latest = consents[0];
            const channels = latest.channels.map((channel) => copy.channelLabels[channel]).join(", ");
            return latest.revokedAt
              ? copy.revokedTemplate(formatTimestamp(latest.revokedAt))
              : copy.grantedTemplate(channels, formatTimestamp(latest.grantedAt));
          })()}
        </p>
      )}
    </section>
  );
}
