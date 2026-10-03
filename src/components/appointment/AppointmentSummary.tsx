import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { fieldId } from "@/components/appointment/wizardState";
import type { WizardStepId } from "@/components/appointment/wizardState";
import { appointmentCopy } from "@/data/appointment";
import type { AppointmentCopy } from "@/data/appointment";
import {
  formatAppointmentDateLong,
  formatPetDescription,
  formatPriceQuote,
  formatSlotTime,
} from "@/lib/appointments/format";
import type { AppointmentInput } from "@/lib/appointments/types";

interface AppointmentSummaryProps {
  input: AppointmentInput;
  // When given, each section gets an Edit button returning to its step.
  onEdit?: (step: WizardStepId) => void;
  reference?: string;
  priceError?: string;
  // Defaults to English — the admin appointment detail view (not locale-
  // translated) relies on that default; the customer-facing wizard/success
  // screen passes its own locale-resolved copy.
  copy?: AppointmentCopy;
}

interface Row {
  step: WizardStepId;
  title: string;
  lines: ReactNode[];
}

function Line({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <span className={muted ? "block break-words text-[14px] text-muted-foreground" : "block break-words"}>
      {children}
    </span>
  );
}

// Read-only appointment summary shared by the review step (with Edit
// buttons) and the success screen (with the reference number).
export function AppointmentSummary({ input, onEdit, reference, priceError, copy = appointmentCopy }: AppointmentSummaryProps) {
  const { pet, address, customer, slot } = input;

  const rows: Row[] = [
    { step: "service", title: copy.summary.service, lines: [<Line key="s">{input.serviceTitle}</Line>] },
    {
      step: "pet",
      title: copy.summary.pet,
      lines: [
        <Line key="name">{pet.name}</Line>,
        <Line key="desc" muted>
          {formatPetDescription(pet, copy)}
        </Line>,
        pet.notes && (
          <Line key="notes" muted>
            {pet.notes}
          </Line>
        ),
      ],
    },
    {
      step: "address",
      title: copy.summary.address,
      lines: [
        <Line key="area">{address.serviceArea}</Line>,
        <Line key="line" muted>
          {[address.addressLine, address.addressDetails].filter(Boolean).join(", ")}
        </Line>,
      ],
    },
    {
      step: "date",
      title: copy.summary.date,
      lines: [<Line key="d">{formatAppointmentDateLong(slot.date, copy)}</Line>],
    },
    { step: "time", title: copy.summary.time, lines: [<Line key="t">{formatSlotTime(slot)}</Line>] },
    {
      step: "customer",
      title: copy.summary.customer,
      lines: [
        <Line key="name">{customer.fullName}</Line>,
        <Line key="phone" muted>
          {customer.phone}
        </Line>,
        customer.email && (
          <Line key="email" muted>
            {customer.email}
          </Line>
        ),
        customer.notes && (
          <Line key="notes" muted>
            {customer.notes}
          </Line>
        ),
      ],
    },
  ];

  const rowClassName = "flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:gap-4";
  const termClassName = "text-[14px] font-medium text-muted-foreground sm:w-36 sm:flex-shrink-0 sm:pt-0.5";

  return (
    <dl className="border-t border-border text-[15px] text-foreground">
      {reference && (
        <div className={rowClassName}>
          <dt className={termClassName}>{copy.summary.reference}</dt>
          <dd className="font-semibold tracking-wide">{reference}</dd>
        </div>
      )}

      {rows.map((row) => (
        <div key={row.step} className={rowClassName}>
          <dt className={termClassName}>{row.title}</dt>
          <dd className="flex min-w-0 flex-1 items-start justify-between gap-4">
            <div className="min-w-0">{row.lines}</div>
            {onEdit && (
              <Button
                type="button"
                variant="tertiary"
                onClick={() => onEdit(row.step)}
                aria-label={copy.summary.editSection(row.title)}
                className="-my-2.5 flex-shrink-0"
              >
                {copy.actions.edit}
              </Button>
            )}
          </dd>
        </div>
      ))}

      {/* Last row: no bottom border — the container below draws its own. */}
      <div id={fieldId("price")} tabIndex={-1} className={`${rowClassName} border-b-0 focus:outline-none`}>
        <dt className={termClassName}>{copy.summary.price}</dt>
        <dd className="min-w-0 flex-1">
          <span className="block font-semibold">{formatPriceQuote(input.price, copy)}</span>
          {priceError && <span className="mt-1 block text-[14px] text-destructive">{priceError}</span>}
        </dd>
      </div>
    </dl>
  );
}
