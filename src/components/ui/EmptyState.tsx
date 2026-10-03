import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border bg-muted/40 px-6 py-12 text-center",
        className,
      )}
    >
      <p className="text-[18px] font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-[50ch] text-[15px] text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
