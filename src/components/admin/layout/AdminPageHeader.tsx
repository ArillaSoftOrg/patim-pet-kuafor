import type { ReactNode } from "react";
import { Heading } from "@/components/ui/Heading";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

// Every admin route renders the same title/description/actions header, so
// the section rhythm below it starts from the same baseline everywhere.
export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Heading level="h2">{title}</Heading>
        {description && (
          <p className="mt-2 max-w-[65ch] text-[15px] text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
