"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { appointmentCopy } from "@/data/appointment";
import { appointmentCopyTr } from "@/lib/i18n/content/appointment.tr";
import { appointmentCopyRu } from "@/lib/i18n/content/appointment.ru";
import { useLocalizedValue } from "@/lib/i18n/useLocalizedValue";

// src/app/appointment/page.tsx (re-exported unchanged for /tr, /ru — see
// that file) is a Server Component with no locale param, same reason
// FaqPageIntro exists: the page header needs useLocale(), so it's split
// into this small Client Component. Metadata (the <title> tag, JSON-LD)
// stays English-only, same documented scope boundary as every other page
// here — only the visible body is translated.
export function AppointmentPageIntro() {
  const copy = useLocalizedValue(appointmentCopy, appointmentCopyTr, appointmentCopyRu);
  return <PageHeader title={copy.page.title} description={copy.page.description} />;
}

// The Suspense fallback shown very briefly while AppointmentWizard (which
// reads useSearchParams(), forcing a client-only boundary here) mounts.
// Needs the same locale resolution as the header above, for the same
// reason — it's rendered by the same Server Component.
export function AppointmentLoadingFallback() {
  const copy = useLocalizedValue(appointmentCopy, appointmentCopyTr, appointmentCopyRu);
  return (
    <p role="status" className="py-10 text-[15px] text-muted-foreground">
      {copy.loading}
    </p>
  );
}
