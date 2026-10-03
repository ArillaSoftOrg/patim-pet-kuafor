import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface FormFieldControlProps {
  id: string;
  "aria-describedby"?: string;
  // Matches Input/Select/Textarea's own `error` prop (sets aria-invalid).
  error: boolean;
}

interface FormFieldProps {
  id: string;
  label: string;
  // Shown after the label, e.g. "(optional)".
  labelSuffix?: string;
  helper?: string;
  error?: string;
  className?: string;
  children: (control: FormFieldControlProps) => ReactNode;
}

// Label → control → helper/error (README.md §15), with the ids wired up so
// the helper and error are announced with the control. The control is a
// render prop so any of Input/Select/Textarea can be used unchanged.
export function FormField({ id, label, labelSuffix, helper, error, className, children }: FormFieldProps) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[14px] font-medium text-foreground">
        {label}
        {labelSuffix && <span className="font-normal text-muted-foreground"> {labelSuffix}</span>}
      </label>
      {children({ id, "aria-describedby": describedBy, error: Boolean(error) })}
      {helper && (
        <p id={helperId} className="text-[13px] text-muted-foreground">
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[14px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
