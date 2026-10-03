import { forwardRef } from "react";
import { Button } from "@/components/ui/Button";
import { AppointmentContactLinks } from "@/components/appointment/AppointmentContactLinks";
import { appointmentCopy } from "@/data/appointment";
import type { AppointmentCopy } from "@/data/appointment";
import type { Business } from "@/data/business";
import type { SubmissionFailureReason } from "@/components/appointment/wizardState";

interface SubmissionErrorProps {
  business: Business;
  reason: SubmissionFailureReason;
  onRetry: () => void;
  copy?: AppointmentCopy;
}

// Shown on the review step when saving failed for a reason unrelated to
// the answers (storage, rate limit, unexpected error). The answers are
// kept, so retrying is one click; direct contact is offered as a fallback.
export const SubmissionError = forwardRef<HTMLDivElement, SubmissionErrorProps>(
  ({ business, reason, onRetry, copy = appointmentCopy }, ref) => (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="flex flex-col gap-4 rounded-md border border-destructive/30 bg-destructive/5 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div>
        <p className="text-[15px] font-semibold text-destructive">{copy.result.errorTitle}</p>
        <p className="mt-1 text-[14px] text-foreground">
          {reason === "rate-limited" ? copy.result.rateLimited : copy.result.errorDescription}
        </p>
      </div>
      <div>
        <Button type="button" variant="secondary" onClick={onRetry}>
          {copy.actions.retry}
        </Button>
      </div>
      <AppointmentContactLinks business={business} copy={copy} />
    </div>
  ),
);

SubmissionError.displayName = "SubmissionError";
