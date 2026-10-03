import { Button } from "@/components/ui/Button";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { AvailabilityNotice } from "@/components/appointment/steps/AvailabilityNotice";
import { fieldId } from "@/components/appointment/wizardState";
import type { StepProps } from "@/components/appointment/steps/stepProps";
import { appointmentAvailability } from "@/data/appointmentAvailability";
import { formatAppointmentDate, formatSlotTime } from "@/lib/appointments/format";
import type { TimeSlot } from "@/lib/appointments/types";

interface TimeStepProps extends StepProps {
  slots: TimeSlot[];
  availabilityStatus: "idle" | "loading" | "error" | "ready";
  onRetry: () => void;
  onChangeDate: () => void;
}

export function TimeStep({
  state,
  dispatch,
  errorFor,
  copy,
  slots,
  availabilityStatus,
  onRetry,
  onChangeDate,
}: TimeStepProps) {
  const dateLabel = state.date
    ? formatAppointmentDate(state.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }, copy)
    : null;

  let content;
  if (availabilityStatus === "error") {
    content = <AvailabilityNotice status="error" onRetry={onRetry} copy={copy} />;
  } else if (availabilityStatus !== "ready") {
    content = <AvailabilityNotice status="loading" onRetry={onRetry} copy={copy} />;
  } else if (slots.length === 0) {
    content = (
      <div className="flex flex-col items-start gap-3">
        <p className="text-[15px] text-muted-foreground">
          {copy.time.noSlots}
        </p>
        <Button type="button" variant="secondary" onClick={onChangeDate}>
          {copy.actions.changeDate}
        </Button>
      </div>
    );
  } else {
    content = (
      <ChoiceGroup
        id={fieldId("slot")}
        name="appointment-slot"
        legend={dateLabel ? `${copy.fields.time.label}, ${dateLabel}` : copy.fields.time.label}
        hideLegend
        options={slots.map((slot) => ({ value: slot.start, label: formatSlotTime(slot) }))}
        value={state.slot?.date === state.date ? state.slot.start : null}
        onChange={(start) => {
          const slot = slots.find((candidate) => candidate.start === start);
          if (slot) dispatch({ type: "selectSlot", slot });
        }}
        error={errorFor("slot")}
        className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {dateLabel && <p className="text-[15px] font-medium text-foreground">{dateLabel}</p>}
      {content}
      {appointmentAvailability.provisional && (
        <p className="text-[13px] text-muted-foreground">{copy.time.provisionalNotice}</p>
      )}
    </div>
  );
}
