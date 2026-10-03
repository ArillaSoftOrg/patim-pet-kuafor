"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ButtonVariant } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormError } from "@/components/admin/forms/FormError";
import { AppointmentSummary } from "@/components/appointment/AppointmentSummary";
import { StatusBadge } from "@/components/admin/appointments/StatusBadge";
import { describeAppointmentError } from "@/components/admin/appointments/adminAppointments";
import { MarketingConsentStatus } from "@/components/admin/appointments/MarketingConsentStatus";
import { appointmentCopy } from "@/data/appointment";
import { appointmentsRepository } from "@/lib/appointments/appointmentsRepository";
import { messagingFeatureFlags } from "@/lib/messaging/featureFlags";
import {
  formatAppointmentDate,
  formatAppointmentReference,
  formatSlotTime,
  formatTimestamp,
} from "@/lib/appointments/format";
import { appointmentStatusTransitions } from "@/lib/appointments/types";
import type { Appointment, AppointmentStatus } from "@/lib/appointments/types";

const copy = appointmentCopy.admin;

export const DETAIL_HEADING_ID = "admin-appointment-heading";

const actionVariants: Record<AppointmentStatus, ButtonVariant> = {
  pending: "secondary",
  confirmed: "primary",
  completed: "primary",
  cancelled: "destructive",
};

interface AppointmentDetailProps {
  appointment: Appointment;
  // Shown once on arrival, e.g. after saving an edit.
  notice?: string;
  onBack: () => void;
  onEdit: () => void;
  // Called after any write attempt (with the stored result on success) so
  // the list reloads from the repository.
  onChanged: (updated?: Appointment) => void;
}

export function AppointmentDetail({ appointment, notice, onBack, onEdit, onChanged }: AppointmentDetailProps) {
  const [pendingStatus, setPendingStatus] = useState<AppointmentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(notice ?? null);

  // Offered actions come straight from the domain's transition rules; the
  // repository enforces the same rules again on write.
  const nextStatuses = appointmentStatusTransitions[appointment.status];
  const when = `${formatAppointmentDate(appointment.slot.date, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })} · ${formatSlotTime(appointment.slot)}`;

  async function changeStatus(next: AppointmentStatus) {
    if (next === "cancelled" && !window.confirm(copy.confirmCancel)) return;
    setError(null);
    setMessage(null);
    setPendingStatus(next);
    let updated: Appointment | undefined;
    try {
      updated = await appointmentsRepository.updateStatus(appointment.id, next);
      setMessage(copy.statusChanged(appointmentCopy.statuses[next]));
    } catch (err) {
      setError(describeAppointmentError(err).message);
    } finally {
      setPendingStatus(null);
      onChanged(updated);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button type="button" variant="tertiary" onClick={onBack}>
          {copy.backToList}
        </Button>
      </div>

      <Card className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              id={DETAIL_HEADING_ID}
              tabIndex={-1}
              className="text-[22px] font-semibold leading-[1.25] text-foreground focus:outline-none"
            >
              {when}
            </h2>
            <p className="mt-1 text-[14px] text-muted-foreground">
              {appointmentCopy.summary.reference}: {formatAppointmentReference(appointment.id)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="sr-only">{copy.status}:</span>
            <StatusBadge status={appointment.status} />
          </div>
        </div>

        <FormError message={error} />
        {message && (
          <p role="status" className="text-[14px] text-success">
            {message}
          </p>
        )}

        <section aria-labelledby="admin-appointment-status-heading" className="flex flex-col gap-3">
          <h3 id="admin-appointment-status-heading" className="text-[15px] font-semibold text-foreground">
            {copy.changeStatus}
          </h3>
          {nextStatuses.length === 0 ? (
            <p className="text-[14px] text-muted-foreground">{copy.noStatusActions}</p>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {nextStatuses.map((next) => (
                <Button
                  key={next}
                  type="button"
                  variant={actionVariants[next]}
                  loading={pendingStatus === next}
                  disabled={pendingStatus !== null}
                  onClick={() => void changeStatus(next)}
                >
                  {copy.statusActions[next]}
                </Button>
              ))}
            </div>
          )}
        </section>

        <AppointmentSummary input={appointment} />

        {messagingFeatureFlags.marketingConsentEnabled && (
          <MarketingConsentStatus key={appointment.id} appointmentId={appointment.id} />
        )}

        <dl className="grid gap-1 text-[14px] text-muted-foreground sm:grid-cols-2">
          <div>
            <dt className="inline font-medium">{copy.created}: </dt>
            <dd className="inline">{formatTimestamp(appointment.createdAt)}</dd>
          </div>
          <div>
            <dt className="inline font-medium">{copy.updated}: </dt>
            <dd className="inline">{formatTimestamp(appointment.updatedAt)}</dd>
          </div>
        </dl>

        <div className="border-t border-border pt-6">
          <Button type="button" variant="secondary" onClick={onEdit} disabled={pendingStatus !== null}>
            {copy.edit}
          </Button>
        </div>
      </Card>
    </div>
  );
}
