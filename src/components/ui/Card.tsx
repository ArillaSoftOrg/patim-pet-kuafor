import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "li";
  interactive?: boolean;
}

export function Card({
  as: Tag = "div",
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-border bg-surface p-5 sm:p-6 lg:p-8",
        interactive &&
          "transition-shadow hover:shadow-md focus-within:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
