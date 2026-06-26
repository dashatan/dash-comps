"use client";

import { cn } from "@/lib";

export default function MapControlButtonGroup(props: DIV) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full cursor-pointer flex-col items-center justify-center gap-px overflow-hidden rounded-lg border bg-accent font-main text-accent-foreground",
        props.className,
      )}
    />
  );
}
