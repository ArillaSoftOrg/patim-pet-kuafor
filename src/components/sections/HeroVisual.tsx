interface PawIconProps {
  className?: string;
  filled?: boolean;
}

function PawIcon({ className, filled = false }: PawIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={filled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7" cy="8.5" r="2.1" />
      <circle cx="12" cy="6.3" r="2.1" />
      <circle cx="17" cy="8.5" r="2.1" />
      <path d="M12 12.3c-2.6 0-5.4 1.9-5.4 4.6 0 1.6 1.3 2.6 2.9 2.3.9-.2 1.6-.6 2.5-.6s1.6.4 2.5.6c1.6.3 2.9-.7 2.9-2.3 0-2.7-2.8-4.6-5.4-4.6Z" />
    </svg>
  );
}

// Stand-in for the hero photo until a real one is set (PhotoPlaceholder
// covers that path once `image` exists — see Hero.tsx). Built from solid
// brand-color surfaces and a paw motif instead of a gradient/blob filler,
// per DESIGN.md's Forbidden Patterns and Imagery rules. At rest nothing
// moves — DESIGN.md's Motion section disallows continuous/looping and
// entrance animation; the only motion is a subtle hover lift on the center
// card, which is feedback, not decoration, and is a no-op under
// prefers-reduced-motion via the global rule in globals.css.
export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="group relative mx-auto aspect-video w-full max-w-[480px] overflow-hidden rounded-xl border border-border bg-secondary lg:max-w-none"
    >
      <PawIcon className="absolute left-6 top-6 h-8 w-8 text-secondary-foreground/25 sm:left-8 sm:top-8" />
      <PawIcon className="absolute bottom-8 right-10 h-6 w-6 text-secondary-foreground/20 sm:bottom-10 sm:right-14" />
      <PawIcon className="absolute bottom-16 right-24 h-4 w-4 text-secondary-foreground/15 sm:bottom-20 sm:right-28" />

      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface px-10 py-9 shadow-sm transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-md sm:px-14 sm:py-11">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary sm:h-20 sm:w-20">
            <PawIcon className="h-8 w-8 text-primary-foreground sm:h-10 sm:w-10" filled />
          </span>
          <span className="h-1.5 w-10 rounded-pill bg-accent" />
        </div>
      </div>
    </div>
  );
}
