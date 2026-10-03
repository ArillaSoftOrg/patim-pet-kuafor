import { cn } from "@/lib/cn";

interface CheckIconProps {
  className?: string;
}

// Shared checkmark glyph for benefit/inclusion lists (service cards, the
// "Who It's For" grid) — kept as one component so that visual treatment
// stays consistent everywhere it's used.
export function CheckIcon({ className }: CheckIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
    >
      <circle cx="10" cy="10" r="10" className="fill-current opacity-15" />
      <path
        d="M6 10.2l2.4 2.4L14.2 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
