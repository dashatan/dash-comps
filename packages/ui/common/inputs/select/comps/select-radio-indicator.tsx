"use client";

import { cn } from "@/lib";
import { Circle, CircleCheck } from "lucide-react";
import { radioCircleVariants } from "@/components/common/inputs/radio/variants";

export type SelectRadioIndicatorProps = {
  active?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** Single-select tree/list radio marker — same icon swap as RadioInput, no layout shift. */
export function SelectRadioIndicator({
  active = false,
  size = "lg",
  className,
}: SelectRadioIndicatorProps) {
  return (
    <div
      className={cn(
        "relative flex size-5 shrink-0 items-center justify-center",
        className,
      )}
      aria-hidden
    >
      <Circle className={radioCircleVariants({ size, active })} />
      <CircleCheck
        className={radioCircleVariants({ size, active, checked: true })}
      />
    </div>
  );
}
