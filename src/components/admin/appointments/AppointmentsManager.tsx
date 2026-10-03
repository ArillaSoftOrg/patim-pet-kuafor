"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AdminLoadingState } from "@/components/admin/layout/AdminLoadingState";
import { FormError } from "@/components/admin/forms/FormError";
import { AppointmentDetail, DETAIL_HEADING_ID } from "@/components/admin/appointments/AppointmentDetail";
import { AppointmentEditForm, EDIT_HEADING_ID } from "@/components/admin/appointments/AppointmentEditForm";
import { StatusBadge } from "@/components/admin/appointments/StatusBadge";
import {
  clearedFilters,
  defaultFilters,
  filterAppointments,
  isInvalidRange,
} from "@/components/admin/appointments/adminAppointments";
import type { AppointmentFilters, SortOrder } from "@/components/admin/appointments/adminAppointments";
import { appointmentCopy } from "@/data/appointment";
import { business as defaultBusiness } from "@/data/business";
import { appointmentsRepository } from "@/lib/appointments/appointmentsRepository";
import { formatAppointmentDate, formatPetDescription, formatSlotTime } from "@/lib/appointments/format";
import { appointmentStatuses } from "@/lib/appointments/types";
import type { Appointment, AppointmentStatus } from "@/lib/appointments/types";
import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";

const copy = appointmentCopy.admin;
const BUSINESS_KEYS = [BUSINESS_SYNC_PING_KEY];

type View = { mode: "list" } | { mode: "detail"; id: string; notice?: string } | { mode: "edit"; id: string };

type LoadState = { status: "loading" } | { status: "error" } | { status: "ready"; appointments: Appointment[] };

function shortWhen(appointment: Appointment): string {
  const date = formatAppointmentDate(appointment.slot.date, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${date} · ${formatSlotTime(appointment.slot)}`;
}

export function AppointmentsManager() {
  const [load, setLoad] = useState<LoadState>({ status: "loading" });
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [view, setView] = useState<View>({ mode: "list" });
  const [filters, setFilters] = useState<AppointmentFilters>(() => defaultFilters());
  const business = useLiveContent(defaultBusiness, businessRepository.get, BUSINESS_KEYS);

  // (Re)load from the repository. A failed *refresh* keeps the list already
  // shown (with a notice) rather than replacing it with an error screen.
  useEffect(() => {
    let active = true;
    appointmentsRepository.list().then(
      (appointments) => {
        if (!active) return;
        setLoad({ status: "ready", appointments });
        setRefreshFailed(false);
      },
      (err) => {
        console.error("Failed to load appointments:", err);
        if (!active) return;
        setLoad((prev) => (prev.status === "ready" ? prev : { status: "error" }));
        setRefreshFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, [reloadToken]);

  // Reload when appointments change in another tab. The repository only
  // reports external changes, never this tab's own writes, so a reload
  // can't trigger another one.
  useEffect(() => appointmentsRepository.subscribe(() => setReloadToken((token) => token + 1)), []);

  const reload = () => setReloadToken((token) => token + 1);

  // Show a successful write's result immediately (it's what the repository
  // stored), then reload so everything else is current too.
  function applyUpdate(updated?: Appointment) {
    if (updated) {
      setLoad((prev) =>
        prev.status === "ready"
          ? { ...prev, appointments: prev.appointments.map((item) => (item.id === updated.id ? updated : item)) }
          : prev,
      );
    }
    reload();
  }

  // Focus: the heading of a newly opened detail/edit view, or — back on
  // the list — the "View" button of the appointment just left.
  const lastOpenedId = useRef<string | null>(null);
  const previousView = useRef(view);
  useEffect(() => {
    const previous = previousView.current;
    previousView.current = view;
    if (previous.mode === view.mode && (previous.mode === "list" || ("id" in previous && "id" in view && previous.id === view.id))) {
      return;
    }
    if (view.mode === "list") {
      const id = lastOpenedId.current;
      if (id) document.querySelector<HTMLElement>(`[data-appointment-id="${CSS.escape(id)}"]`)?.focus();
    } else {
      lastOpenedId.current = view.id;
      document.getElementById(view.mode === "detail" ? DETAIL_HEADING_ID : EDIT_HEADING_ID)?.focus();
    }
  }, [view]);

  if (load.status === "loading") return <AdminLoadingState />;

  if (load.status === "error") {
    return (
      <div className="flex flex-col gap-4">
        <FormError message={copy.loadError} />
        <div>
          <Button type="button" variant="secondary" onClick={reload}>
            {appointmentCopy.actions.retry}
          </Button>
        </div>
      </div>
    );
  }

  const { appointments } = load;
  const refreshNotice = refreshFailed && <FormError message={copy.loadError} />;

  if (view.mode !== "list") {
    const appointment = appointments.find((item) => item.id === view.id);
    if (!appointment) {
      return (
        <div className="flex flex-col gap-4">
          <EmptyState
            title={copy.errors.notFound}
            action={
              <Button type="button" variant="secondary" onClick={() => setView({ mode: "list" })}>
                {copy.backToList}
              </Button>
            }
          />
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-4">
        {refreshNotice}
        {view.mode === "detail" ? (
          <AppointmentDetail
            key={`${appointment.id}:${view.notice ?? ""}`}
            appointment={appointment}
            notice={view.notice}
            onBack={() => setView({ mode: "list" })}
            onEdit={() => setView({ mode: "edit", id: appointment.id })}
            onChanged={applyUpdate}
          />
        ) : (
          <AppointmentEditForm
            appointment={appointment}
            serviceAreas={business.serviceAreas}
            onCancel={() => setView({ mode: "detail", id: appointment.id })}
            onStale={reload}
            onSaved={(updated) => {
              applyUpdate(updated);
              setView({ mode: "detail", id: appointment.id, notice: copy.saved });
            }}
          />
        )}
      </div>
    );
  }

  const visible = filterAppointments(appointments, filters);
  const invalidRange = isInvalidRange(filters);
  const setFilter = (patch: Partial<AppointmentFilters>) => setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <div className="flex flex-col gap-6">
      {refreshNotice}

      {appointments.length === 0 ? (
        <EmptyState title={copy.empty.title} description={copy.empty.description} />
      ) : (
        <>
          <fieldset className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <legend className="sr-only">{copy.filters.legend}</legend>
            <FormField id="appointments-filter-status" label={copy.filters.status}>
              {(control) => (
                <Select
                  {...control}
                  value={filters.status}
                  onChange={(e) => setFilter({ status: e.target.value as AppointmentStatus | "all" })}
                >
                  <option value="all">{copy.filters.allStatuses}</option>
                  {appointmentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {appointmentCopy.statuses[status]}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField id="appointments-filter-from" label={copy.filters.from}>
              {(control) => (
                <Input {...control} type="date" value={filters.from} onChange={(e) => setFilter({ from: e.target.value })} />
              )}
            </FormField>
            <FormField
              id="appointments-filter-to"
              label={copy.filters.to}
              error={invalidRange ? copy.filters.invalidRange : undefined}
            >
              {(control) => (
                <Input
                  {...control}
                  type="date"
                  value={filters.to}
                  min={filters.from || undefined}
                  onChange={(e) => setFilter({ to: e.target.value })}
                />
              )}
            </FormField>
            <FormField id="appointments-filter-order" label={copy.filters.order}>
              {(control) => (
                <Select {...control} value={filters.order} onChange={(e) => setFilter({ order: e.target.value as SortOrder })}>
                  <option value="asc">{copy.filters.soonestFirst}</option>
                  <option value="desc">{copy.filters.latestFirst}</option>
                </Select>
              )}
            </FormField>
          </fieldset>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-[14px] text-muted-foreground">
              {copy.resultCount(visible.length, appointments.length)}
            </p>
            <Button type="button" variant="tertiary" onClick={() => setFilters(clearedFilters)}>
              {copy.filters.clear}
            </Button>
          </div>

          {visible.length === 0 ? (
            <EmptyState title={copy.noMatches.title} description={copy.noMatches.description} />
          ) : (
            <ul className="flex flex-col gap-3">
              {visible.map((appointment) => {
                const when = shortWhen(appointment);
                return (
                  <Card
                    as="li"
                    key={appointment.id}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{when}</h3>
                        <StatusBadge status={appointment.status} />
                      </div>
                      <p className="text-[15px] text-foreground">
                        {appointment.serviceTitle} — {appointment.pet.name}{" "}
                        <span className="text-muted-foreground">({formatPetDescription(appointment.pet)})</span>
                      </p>
                      <p className="break-words text-[14px] text-muted-foreground">
                        {appointment.customer.fullName} · {appointment.customer.phone} · {appointment.address.serviceArea}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      data-appointment-id={appointment.id}
                      aria-label={copy.viewLabel(appointment.pet.name, when)}
                      onClick={() => setView({ mode: "detail", id: appointment.id })}
                      className="flex-shrink-0"
                    >
                      {copy.view}
                    </Button>
                  </Card>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
