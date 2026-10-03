import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface AccordionItemProps {
  question: string;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({ question, children, className }: AccordionItemProps) {
  return (
    <details
      className={cn(
        "group rounded-lg border border-border bg-surface open:shadow-sm",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16px] font-medium text-foreground marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
        {question}
        <svg
          className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className="px-5 pb-4 text-[15px] text-muted-foreground">{children}</div>
    </details>
  );
}

export function Accordion({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-3", className)}>{children}</div>;
}
