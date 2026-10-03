import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ContainerSize = "narrow" | "content" | "wide";

const sizeClasses: Record<ContainerSize, string> = {
  narrow: "max-w-[760px]",
  content: "max-w-[1200px]",
  wide: "max-w-[1360px]",
};

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  as?: "div" | "section" | "article";
}

export function Container({
  size = "content",
  as: Tag = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-10",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
