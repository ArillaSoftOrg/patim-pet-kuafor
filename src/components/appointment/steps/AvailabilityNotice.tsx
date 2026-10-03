import { Button } from "@/components/ui/Button";
import { appointmentCopy } from "@/data/appointment";
import type { AppointmentCopy } from "@/data/appointment";

interface AvailabilityNoticeProps {
  status: "loading" | "error";
  onRetry: () => void;
  copy?: AppointmentCopy;
}

// Loading/failure state shared by the date and time steps while booked
// slots are fetched.
export function AvailabilityNotice({ status, onRetry, copy = appointmentCopy }: AvailabilityNoticeProps) {
  if (status === "loading") {
    return (
      <p role="status" className="flex items-center gap-3 py-6 text-[15px] text-muted-foreground">
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
        </svg>
        {copy.availability.loading}
      </p>
    );
  }

  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4"
    >
      <p className="text-[14px] text-destructive">{copy.availability.loadError}</p>
      <Button type="button" variant="secondary" onClick={onRetry}>
        {copy.actions.retry}
      </Button>
    </div>
  );
}
