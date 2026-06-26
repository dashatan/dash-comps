"use client";

import { cn } from "@/lib";
import type {
  WeightPreset,
  WeightRange,
} from "@/components/common/inputs/weight/types";
import { isSameRange } from "@/components/common/inputs/weight/utils";

export type WeightPresetsProps = {
  presets: WeightPreset[];
  selected?: WeightRange;
  onSelect: (preset: WeightPreset) => void;
  className?: string;
};

export function WeightPresets({
  presets,
  selected,
  onSelect,
  className,
}: WeightPresetsProps) {
  return (
    <div
      role="group"
      aria-label="Weight presets"
      className={cn("flex flex-wrap gap-2 p-2", className)}
      onPointerDown={(e) => e.preventDefault()}
    >
      {presets.map((preset, index) => {
        const active = isSameRange(selected, preset.value);

        return (
          <button
            key={`${preset.label}-${index}`}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(preset)}
            className={cn(
              "flex h-8 cursor-pointer items-center justify-center rounded-full border bg-input px-4 text-xs font-medium transition-colors select-none",
              "hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background",
              active
                ? "border-primary bg-primary/25"
                : "border-border text-foreground",
            )}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}
