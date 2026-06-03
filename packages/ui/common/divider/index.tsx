"use client";

import { cn } from "@/lib";
import { DivProps } from "@/lib/types";

export function Divider({
  className,
  orientation = "horizontal",
  margin = 16,
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
  noMargin?: boolean;
  margin?: number;
}) {
  return (
    <div
      className={cn("bg-border", className)}
      style={{
        margin: orientation === "vertical" ? `0 ${margin}px` : `${margin}px 0`,
        height: orientation === "horizontal" ? 1 : "100%",
        width: orientation === "vertical" ? 1 : "100%",
      }}
    />
  );
}
