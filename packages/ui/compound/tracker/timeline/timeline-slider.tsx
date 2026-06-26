"use client";

import { cn } from "@/lib";

type TimelineSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  className?: string;
};

export default function TimelineSlider({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  className,
}: TimelineSliderProps) {
  const safeValue = Math.min(Math.max(value, min), max);

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={safeValue}
      onChange={(event) => {
        const next = Number(event.target.value);
        if (next !== safeValue) onValueChange(next);
      }}
      className={cn(
        "h-10 w-full cursor-pointer appearance-none bg-transparent accent-primary [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-muted [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary",
        className,
      )}
    />
  );
}
