"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FormError } from "@/components/admin/forms/FormError";
import { useUnsavedChangesWarning } from "@/components/admin/useUnsavedChangesWarning";
import {
  changePetBreed,
  changePetType,
  changesFromDraft,
  describeAppointmentError,
  draftFromAppointment,
  getEditDateOptions,
  getEditSlotOptions,
  withoutOwnSlot,
} from "@/components/admin/appointments/adminAppointments";
import type { CustomerDraft, EditDraft } from "@/components/admin/appointments/adminAppointments";
import { appointmentCopy } from "@/data/appointment";
import { getBreed, getBreedsForPetType } from "@/data/petBreeds";
import { appointmentsRepository } from "@/lib/appointments/appointmentsRepository";
import { isAppointmentError } from "@/lib/appointments/repository";
import { formatAppointmentDate, formatPriceQuote, formatSlotTime } from "@/lib/appointments/format";
import { getOfferedPetTypes, quotePrice } from "@/lib/appointments/pricing";
import { petSizes } from "@/lib/appointments/types";
import type { Appointment, AppointmentAddress, PetSize, PetType, TimeSlot } from "@/lib/appointments/types";
import type { AppointmentField, AppointmentFieldErrors } from "@/lib/appointments/validation";

const copy = appointmentCopy;
const adminCopy = appointmentCopy.admin;

export const EDIT_HEADING_ID = "admin-appointment-edit-heading";

function inputId(field: AppointmentField): string {
  return `admin-appointment-${field.replace(".", "-")}`;
}

// Order in which fields appear, for moving focus to the first invalid one.
const FIELD_ORDER: AppointmentField[] = [
  "pet.name",
  "pet.type",
  "pet.breedId",
  "pet.size",
  "pet.notes",
  "address.serviceArea",
  "address.addressLine",
  "address.addressDetails",
  "slot",
  "customer.fullName",
  "customer.phone",
  "customer.email",
  "customer.notes",
];

type BookedState = { status: "loading" } | { status: "error" } | { status: "ready"; slots: TimeSlot[] };

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-4 border-t border-border pt-6">
      <legend className="float-left mb-4 w-full text-[17px] font-semibold text-foreground">{title}</legend>
      {children}
    </fieldset>
  );
}

interface AppointmentEditFormProps {
  // The live appointment (refreshes if another tab changes it).
  appointment: Appointment;
  // Live business.serviceAreas.
  serviceAreas: readonly string[];
  onCancel: () => void;
  onSaved: (updated: Appointment) => void;
  // Asks for a fresh copy of the appointment (after a concurrent-edit
  // conflict), which then shows the "changed elsewhere" notice.
  onStale: () => void;
}

export function AppointmentEditForm({ appointment, serviceAreas, onCancel, onSaved, onStale }: AppointmentEditFormProps) {
  // Edits are diffed against the version the form was opened with, so only
  // sections changed *here* are sent — a concurrent change made elsewhere
  // to an untouched section is never overwritten.
  const [original] = useState(appointment);
  const [draft, setDraft] = useState<EditDraft>(() => draftFromAppointment(appointment));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<AppointmentFieldErrors>({});
  const [errorAttempt, setErrorAttempt] = useState(0);
  const [bookedReload, setBookedReload] = useState(0);
  const [booked, setBooked] = useState<BookedState>({ status: "loading" });

  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    let active = true;
    appointmentsRepository.getBookedSlots().then(
      (slots) => {
        if (active) setBooked({ status: "ready", slots });
      },
      (err) => {
        console.error("Failed to load booked appointment slots:", err);
        if (active) setBooked({ status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [bookedReload]);

  // Focus the first invalid field after each failed save.
  const handledAttempt = useRef(errorAttempt);
  useEffect(() => {
    if (handledAttempt.current === errorAttempt) return;
    handledAttempt.current = errorAttempt;
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);
    if (first) document.getElementById(inputId(first))?.focus();
  }, [errorAttempt, fieldErrors]);

  function errorFor(field: AppointmentField): string | undefined {
    const code = fieldErrors[field];
    return code ? copy.validation[code] : undefined;
  }

  function update(patch: Partial<EditDraft>, cleared: AppointmentField[]) {
    setDirty(true);
    setFormError(null);
    setFieldErrors((prev) => {
      const next = { ...prev };
      for (const field of cleared) delete next[field];
      return next;
    });
    setDraft((prev) => ({ ...prev, ...patch }));
  }
  const setPet = (pet: EditDraft["pet"], cleared: AppointmentField[]) => update({ pet }, cleared);
  const setAddress = (field: keyof AppointmentAddress, value: string) =>
    update({ address: { ...draft.address, [field]: value } }, [`address.${field}`]);
  const setCustomer = (field: keyof CustomerDraft, value: string) =>
    update({ customer: { ...draft.customer, [field]: value } }, [`customer.${field}`]);

  const { pet } = draft;
  const offeredTypes = getOfferedPetTypes(appointment.serviceSlug);
  const petTypeOptions = offeredTypes.includes(pet.type) ? offeredTypes : [pet.type, ...offeredTypes];
  const breed = getBreed(pet.type, pet.breedId);
  const needsSize = pet.type === "dog" && (breed === undefined || breed.size === null);
  const quote = quotePrice({
    serviceSlug: appointment.serviceSlug,
    petType: pet.type,
    breedId: pet.breedId,
    size: pet.size,
  });
  const areaOptions = serviceAreas.includes(original.address.serviceArea)
    ? serviceAreas
    : [original.address.serviceArea, ...serviceAreas];

  // Same availability rules as the booking flow, with this appointment's
  // own slot excluded from "taken" so it never conflicts with itself.
  const otherBooked = booked.status === "ready" ? withoutOwnSlot(booked.slots, original.slot) : [];
  const dateOptions = getEditDateOptions(original);
  const slotOptions = booked.status === "ready" ? getEditSlotOptions(original, draft.date, otherBooked) : [];
  const changedElsewhere = appointment.updatedAt !== original.updatedAt;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setFormError(null);

    if (draft.slot === null) {
      setFieldErrors({ slot: "required" });
      setFormError(adminCopy.errors.validation);
      setErrorAttempt((n) => n + 1);
      return;
    }

    const changes = changesFromDraft(original, draft);
    if (Object.keys(changes).length === 0) {
      setFormError(adminCopy.noChanges);
      return;
    }

    setSaving(true);
    try {
      const updated = await appointmentsRepository.update(original.id, changes);
      setDirty(false);
      onSaved(updated);
    } catch (err) {
      // The repository writes nothing on failure: the stored appointment is
      // unchanged and the form keeps the admin's edits to correct.
      const { message, fieldErrors: errors } = describeAppointmentError(err);
      setFieldErrors(errors);
      setFormError(message);
      setErrorAttempt((n) => n + 1);
      if (errors.slot) setBookedReload((n) => n + 1);
      if (isAppointmentError(err) && err.code === "conflict") onStale();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6" aria-labelledby={EDIT_HEADING_ID}>
        <div>
          <h2
            id={EDIT_HEADING_ID}
            tabIndex={-1}
            className="text-[22px] font-semibold leading-[1.25] text-foreground focus:outline-none"
          >
            {adminCopy.editTitle}
          </h2>
          <p className="mt-1 text-[14px] text-muted-foreground">{original.serviceTitle}</p>
        </div>

        {changedElsewhere && (
          <p role="note" className="rounded-md border border-warning/40 bg-accent/20 px-3 py-2 text-[14px] text-foreground">
            {adminCopy.changedElsewhere}
          </p>
        )}

        <Section title={adminCopy.editSections.pet}>
          <FormField id={inputId("pet.name")} label={copy.fields.petName.label} error={errorFor("pet.name")}>
            {(control) => (
              <Input {...control} value={pet.name} onChange={(e) => setPet({ ...pet, name: e.target.value }, ["pet.name"])} />
            )}
          </FormField>
          <div className="grid gap-4 lg:grid-cols-3">
            <FormField id={inputId("pet.type")} label={copy.fields.petType.label} error={errorFor("pet.type")}>
              {(control) => (
                <Select
                  {...control}
                  value={pet.type}
                  onChange={(e) =>
                    setPet(changePetType(pet, e.target.value as PetType), ["pet.type", "pet.breedId", "pet.size"])
                  }
                >
                  {petTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {copy.petTypes[type]}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField id={inputId("pet.breedId")} label={copy.fields.breed.label} error={errorFor("pet.breedId")}>
              {(control) => (
                <Select
                  {...control}
                  value={pet.breedId}
                  onChange={(e) => setPet(changePetBreed(pet, e.target.value), ["pet.breedId", "pet.size"])}
                >
                  <option value="">{copy.fields.breed.placeholder}</option>
                  {getBreedsForPetType(pet.type).map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            {needsSize && (
              <FormField id={inputId("pet.size")} label={copy.fields.size.label} error={errorFor("pet.size")}>
                {(control) => (
                  <Select
                    {...control}
                    value={pet.size ?? ""}
                    onChange={(e) =>
                      setPet({ ...pet, size: e.target.value === "" ? null : (e.target.value as PetSize) }, ["pet.size"])
                    }
                  >
                    <option value="">—</option>
                    {petSizes.map((size) => (
                      <option key={size} value={size}>
                        {copy.sizes[size].label} ({copy.sizes[size].description})
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
            )}
          </div>
          <FormField
            id={inputId("pet.notes")}
            label={copy.fields.petNotes.label}
            labelSuffix={copy.optional}
            error={errorFor("pet.notes")}
          >
            {(control) => (
              <Textarea {...control} value={pet.notes} onChange={(e) => setPet({ ...pet, notes: e.target.value }, ["pet.notes"])} />
            )}
          </FormField>
          <p aria-live="polite" className="text-[14px] text-muted-foreground">
            <span className="font-medium text-foreground">{copy.price.label}:</span> {formatPriceQuote(quote)}
          </p>
        </Section>

        <Section title={adminCopy.editSections.address}>
          <FormField
            id={inputId("address.serviceArea")}
            label={copy.fields.serviceArea.label}
            error={errorFor("address.serviceArea")}
          >
            {(control) => (
              <Select {...control} value={draft.address.serviceArea} onChange={(e) => setAddress("serviceArea", e.target.value)}>
                {areaOptions.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField id={inputId("address.addressLine")} label={copy.fields.addressLine.label} error={errorFor("address.addressLine")}>
            {(control) => (
              <Input {...control} value={draft.address.addressLine} onChange={(e) => setAddress("addressLine", e.target.value)} />
            )}
          </FormField>
          <FormField
            id={inputId("address.addressDetails")}
            label={copy.fields.addressDetails.label}
            labelSuffix={copy.optional}
            error={errorFor("address.addressDetails")}
          >
            {(control) => (
              <Input {...control} value={draft.address.addressDetails} onChange={(e) => setAddress("addressDetails", e.target.value)} />
            )}
          </FormField>
        </Section>

        <Section title={adminCopy.editSections.schedule}>
          <div className="grid gap-4 lg:grid-cols-2">
            <FormField id="admin-appointment-date" label={copy.fields.date.label}>
              {(control) => (
                <Select
                  {...control}
                  value={draft.date}
                  onChange={(e) => {
                    const date = e.target.value;
                    // A new date needs a new time; returning to the original
                    // date restores the original time.
                    update({ date, slot: date === original.slot.date ? original.slot : null }, ["slot"]);
                  }}
                >
                  {dateOptions.map(({ value, isCurrent }) => {
                    const label = formatAppointmentDate(value, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
                    return (
                      <option key={value} value={value}>
                        {isCurrent ? adminCopy.currentOption(label) : label}
                      </option>
                    );
                  })}
                </Select>
              )}
            </FormField>
            <FormField
              id={inputId("slot")}
              label={copy.fields.time.label}
              error={
                errorFor("slot") ??
                (booked.status === "error" ? copy.availability.loadError : undefined) ??
                (booked.status === "ready" && slotOptions.length === 0 ? adminCopy.noTimesForDate : undefined)
              }
            >
              {(control) => (
                <Select
                  {...control}
                  value={draft.slot?.start ?? ""}
                  disabled={booked.status !== "ready"}
                  onChange={(e) => {
                    const option = slotOptions.find(({ value }) => value.start === e.target.value);
                    update({ slot: option ? option.value : null }, ["slot"]);
                  }}
                >
                  <option value="">
                    {booked.status === "loading" ? copy.availability.loading : adminCopy.slotSelectPlaceholder}
                  </option>
                  {slotOptions.map(({ value, isCurrent }) => (
                    <option key={value.start} value={value.start}>
                      {isCurrent ? adminCopy.currentOption(formatSlotTime(value)) : formatSlotTime(value)}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
          </div>
        </Section>

        <Section title={adminCopy.editSections.customer}>
          <FormField id={inputId("customer.fullName")} label={copy.fields.fullName.label} error={errorFor("customer.fullName")}>
            {(control) => (
              <Input {...control} value={draft.customer.fullName} onChange={(e) => setCustomer("fullName", e.target.value)} />
            )}
          </FormField>
          <div className="grid gap-4 lg:grid-cols-2">
            <FormField id={inputId("customer.phone")} label={copy.fields.phone.label} error={errorFor("customer.phone")}>
              {(control) => (
                <Input {...control} type="tel" value={draft.customer.phone} onChange={(e) => setCustomer("phone", e.target.value)} />
              )}
            </FormField>
            <FormField
              id={inputId("customer.email")}
              label={copy.fields.email.label}
              labelSuffix={copy.optional}
              error={errorFor("customer.email")}
            >
              {(control) => (
                <Input {...control} type="email" value={draft.customer.email} onChange={(e) => setCustomer("email", e.target.value)} />
              )}
            </FormField>
          </div>
          <FormField
            id={inputId("customer.notes")}
            label={copy.fields.customerNotes.label}
            labelSuffix={copy.optional}
            error={errorFor("customer.notes")}
          >
            {(control) => (
              <Textarea {...control} value={draft.customer.notes} onChange={(e) => setCustomer("notes", e.target.value)} />
            )}
          </FormField>
        </Section>

        <FormError message={formError} />

        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
          <Button type="submit" loading={saving} disabled={booked.status === "loading"}>
            {saving ? adminCopy.saving : adminCopy.save}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
            {adminCopy.cancelEdit}
          </Button>
        </div>
      </form>
    </Card>
  );
}
