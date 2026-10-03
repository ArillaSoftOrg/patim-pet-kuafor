import { cn } from "@/lib/cn";

interface InstagramIconProps {
  className?: string;
}

// Shared Instagram glyph — outline style consistent with the site's other
// hand-authored icons (see CheckIcon), used in the footer and on the
// Contact page's Instagram row.
export function InstagramIcon({ className }: InstagramIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
