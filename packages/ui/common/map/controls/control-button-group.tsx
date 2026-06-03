"use client";

import { cn } from "@/lib";

export default function MapControlButtonGroup(props: DIV) {
  return (
    <div
      {...props}
      className={cn(
        "font-main bg-accent text-accent-foreground flex w-full cursor-pointer flex-col items-center justify-center gap-px overflow-hidden rounded-lg border",
        props.className,
      )}
    />
  );
}
