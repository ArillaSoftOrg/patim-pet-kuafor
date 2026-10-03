import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { EmptyState } from "@/components/ui/EmptyState";
import { AvailabilityNotice } from "@/components/appointment/steps/AvailabilityNotice";
import { fieldId } from "@/components/appointment/wizardState";
import type { StepProps } from "@/components/appointment/steps/stepProps";
import { formatAppointmentDate } from "@/lib/appointments/format";

export interface DateOption {
  date: string;
  // false when every slot that day is already taken.
  available: boolean;
}

interface DateStepProps extends StepProps {
  dates: DateOption[];
  availabilityStatus: "idle" | "loading" | "error" | "ready";
  onRetry: () => void;
}

export function DateStep({ state, dispatch, errorFor, copy, dates, availabilityStatus, onRetry }: DateStepProps) {
  if (availabilityStatus === "error") return <AvailabilityNotice status="error" onRetry={onRetry} copy={copy} />;
  if (availabilityStatus !== "ready") return <AvailabilityNotice status="loading" onRetry={onRetry} copy={copy} />;
  if (dates.length === 0) return <EmptyState title={copy.date.none} />;

  return (
    <ChoiceGroup
      id={fieldId("date")}
      name="appointment-date"
      legend={copy.fields.date.label}
      hideLegend
      options={dates.map(({ date, available }) => ({
        value: date,
        label: formatAppointmentDate(date, { weekday: "short", day: "numeric", month: "short" }, copy),
        description: available ? undefined : copy.date.fullyBooked,
        disabled: !available,
      }))}
      value={state.date || null}
      onChange={(date) => dispatch({ type: "selectDate", date })}
      error={errorFor("date")}
      className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
    />
  );
}
