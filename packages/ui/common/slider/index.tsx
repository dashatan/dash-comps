"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib";

function useStableSliderValue(value: number[] | undefined) {
  const valueKey = value?.join(",") ?? "";
  return React.useMemo(() => value, [valueKey]);
}

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    thumbClassName?: string;
    thumbProps?: SliderPrimitive.SliderThumbProps;
    trackClassName?: string;
    rangeClassName?: string;
  }
>(
  (
    {
      className,
      thumbClassName,
      trackClassName,
      rangeClassName,
      thumbProps,
      value,
      defaultValue,
      children,
      ...props
    },
    ref,
  ) => {
    const stableValue = useStableSliderValue(value);
    const thumbClass = cn(
      "block h-5 w-5 rounded-full border-2 bg-slate-600 cursor-pointer",
      "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      thumbClassName,
    );
    const thumbCount = Math.max(
      stableValue?.length ?? defaultValue?.length ?? 1,
      1,
    );

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer touch-none items-center select-none",
          className,
        )}
        value={stableValue}
        defaultValue={defaultValue}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300 transition-all",
            trackClassName,
          )}
        >
          <SliderPrimitive.Range
            className={cn("absolute h-full bg-slate-600", rangeClassName)}
          />
        </SliderPrimitive.Track>
        {children}
        {Array.from({ length: thumbCount }, (_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            {...thumbProps}
            className={thumbClass}
          />
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
export { RangeSlider } from "./range-slider";
export type { RangeSliderProps, RangeSliderStep } from "./range-slider";
