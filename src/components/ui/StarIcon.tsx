import { cn } from "@/lib/cn";

interface StarIconProps {
  filled?: boolean;
  className?: string;
}

// Shared rating glyph (see TestimonialsSection.tsx) — filled uses a solid
// fill, unfilled falls back to a faint outline so a partial rating (e.g.
// 4/5) still reads clearly rather than just omitting the missing stars.
export function StarIcon({ filled = true, className }: StarIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={cn("h-3.5 w-3.5", filled ? "fill-accent" : "fill-none stroke-border stroke-[1.5]", className)}
    >
      <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.77l-5.18 2.67.99-5.77-4.19-4.08 5.79-.84L10 1.5z" />
    </svg>
  );
}
