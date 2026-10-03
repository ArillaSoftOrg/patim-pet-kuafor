import { cn } from "@/lib/cn";
import { appointmentCopy } from "@/data/appointment";
import type { AppointmentStatus } from "@/lib/appointments/types";

const toneClasses: Record<AppointmentStatus, string> = {
  pending: "border-warning/40 bg-accent/30 text-accent-foreground",
  confirmed: "border-success/40 bg-secondary text-secondary-foreground",
  completed: "border-border bg-muted text-muted-foreground",
  cancelled: "border-destructive/30 bg-destructive/5 text-destructive",
};

// Status is always spelled out — color only reinforces it.
export function StatusBadge({ status, className }: { status: AppointmentStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border px-2.5 py-0.5 text-[13px] font-semibold",
        toneClasses[status],
        className,
      )}
    >
      {appointmentCopy.statuses[status]}
    </span>
  );
}
