import { cn } from "@/lib/cn";

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface ChoiceGroupProps {
  id: string;
  name: string;
  legend: string;
  // For groups whose purpose is already given by a visible heading.
  hideLegend?: boolean;
  helper?: string;
  error?: string;
  options: ChoiceOption[];
  value: string | null;
  onChange: (value: string) => void;
  // Grid column classes for the option cards.
  className?: string;
}

// A single-choice group rendered as selectable cards. Built on real radio
// inputs inside a fieldset/legend, so it keeps native semantics and
// keyboard behavior (Tab into the group, arrow keys between options) —
// the cards are only styling around a visually hidden radio.
export function ChoiceGroup({
  id,
  name,
  legend,
  hideLegend = false,
  helper,
  error,
  options,
  value,
  onChange,
  className,
}: ChoiceGroupProps) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset id={id} aria-describedby={describedBy} className="flex min-w-0 flex-col gap-3">
      <legend className={cn(hideLegend ? "sr-only" : "mb-3 text-[14px] font-medium text-foreground")}>{legend}</legend>
      {helper && (
        <p id={helperId} className="text-[13px] text-muted-foreground">
          {helper}
        </p>
      )}
      <div className={cn("grid gap-3", className)}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              // relative: anchors the sr-only radio so focusing it can't scroll the page.
              "relative flex min-h-11 cursor-pointer flex-col justify-center gap-1 rounded-md border bg-surface px-4 py-3 transition-colors",
              "hover:border-primary/60",
              "has-checked:border-primary has-checked:bg-soft-pink/40",
              "has-focus-visible:ring-2 has-focus-visible:ring-ring",
              "has-disabled:cursor-not-allowed has-disabled:bg-muted has-disabled:opacity-60 has-disabled:hover:border-input",
              error ? "border-destructive" : "border-input",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              disabled={option.disabled}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span className="text-[15px] font-semibold text-foreground">{option.label}</span>
            {option.description && <span className="text-[13px] text-muted-foreground">{option.description}</span>}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="text-[14px] text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}
