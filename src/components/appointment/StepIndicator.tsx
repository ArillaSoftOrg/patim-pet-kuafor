import { cn } from "@/lib/cn";
import { appointmentCopy } from "@/data/appointment";
import type { AppointmentCopy } from "@/data/appointment";

interface StepIndicatorProps {
  titles: string[];
  currentIndex: number;
  furthestIndex: number;
  onSelect: (index: number) => void;
  copy?: AppointmentCopy;
}

// Compact "Step n of N" + progress bar on phones; the full numbered list
// from sm up, where already-reached steps are buttons to jump back to.
export function StepIndicator({ titles, currentIndex, furthestIndex, onSelect, copy = appointmentCopy }: StepIndicatorProps) {
  const progress = `${((currentIndex + 1) / titles.length) * 100}%`;

  return (
    <nav aria-label={copy.progressLabel}>
      <div className="sm:hidden">
        <p className="text-[14px] font-medium text-muted-foreground">
          {copy.stepProgress(currentIndex + 1, titles.length)}
          <span aria-hidden="true"> · </span>
          <span className="text-foreground">{titles[currentIndex]}</span>
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-muted" aria-hidden="true">
          <div className="h-full rounded-pill bg-primary transition-[width]" style={{ width: progress }} />
        </div>
      </div>

      <ol className="hidden sm:grid sm:gap-2" style={{ gridTemplateColumns: `repeat(${titles.length}, minmax(0, 1fr))` }}>
        {titles.map((title, index) => {
          const current = index === currentIndex;
          const reachable = index <= furthestIndex && !current;
          const content = (
            <>
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-pill text-[14px] font-semibold",
                  current && "bg-primary text-primary-foreground",
                  !current && reachable && "bg-secondary text-secondary-foreground",
                  !current && !reachable && "border border-border text-muted-foreground",
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-[13px] leading-tight",
                  current ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {title}
              </span>
            </>
          );
          const itemClassName = "flex w-full flex-col items-center gap-2 rounded-md px-1 py-2 text-center";

          return (
            <li key={title}>
              {reachable ? (
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className={cn(
                    itemClassName,
                    "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  {content}
                </button>
              ) : (
                <span aria-current={current ? "step" : undefined} className={itemClassName}>
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
