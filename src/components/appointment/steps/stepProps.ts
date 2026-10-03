import type { Dispatch } from "react";
import type { AppointmentCopy } from "@/data/appointment";
import type { WizardAction, WizardField, WizardState } from "@/components/appointment/wizardState";

export interface StepProps {
  state: WizardState;
  dispatch: Dispatch<WizardAction>;
  // The copy message for a field's current error, if any.
  errorFor: (field: WizardField) => string | undefined;
  // Locale-resolved copy (English/Turkish/Russian) for the current visitor.
  copy: AppointmentCopy;
}
