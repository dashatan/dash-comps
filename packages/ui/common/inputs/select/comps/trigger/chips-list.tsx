import { cn } from "@/lib";
import Badge from "@/components/common/badge/badge";
import Chip from "@/components/common/chips/chip";
import { SelectItem, SelectTriggerTemplateProps } from "@/components/common/inputs/select/types";
import { useRef } from "react";
import { useVisibleChipCount } from "@/components/common/inputs/select/comps/trigger/use-visible-chip-count";

type ChipsListProps = {
  chips?: SelectTriggerTemplateProps["chips"];
  chipsCountLimit?: number;
  chipRowsCount?: number;
  onRemove?: (option: SelectItem) => void;
  className?: {
    chip?: string;
    badge?: string;
  };
};

export function ChipsList({
  chips,
  chipsCountLimit = 3,
  chipRowsCount,
  onRemove,
  className,
}: ChipsListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const items = chips ?? [];
  const { visibleCount: rowVisibleCount, maxHeight } = useVisibleChipCount(
    items,
    chipRowsCount,
    containerRef,
    measureRef,
  );

  if (!items.length) return null;

  const visibleLimit =
    chipRowsCount !== undefined
      ? rowVisibleCount
      : Math.min(chipsCountLimit, items.length);

  const visibleChips = items.slice(0, visibleLimit);
  const remainingCount = items.length - visibleLimit;

  const chipClassName = cn(className?.chip);

  const useRowLimit = chipRowsCount !== undefined;

  return (
    <div
      ref={containerRef}
      className="relative w-full border-t border-border px-4 py-2"
    >
      {useRowLimit && (
        <div
          ref={measureRef}
          aria-hidden
          className={cn(
            "pointer-events-none invisible absolute inset-x-4 top-2 flex w-[calc(100%-2rem)] items-center gap-2",
            chipRowsCount === 1 ? "flex-nowrap" : "flex-wrap",
          )}
        >
          {items.map((option) => (
            <Chip
              key={option.value}
              data-select-chip
              label={option.label}
              onRemove={() => undefined}
              className={chipClassName}
            />
          ))}
        </div>
      )}
      <div
        className={cn(
          "flex w-full min-w-0 cursor-default items-center gap-2",
          useRowLimit ? "flex-nowrap overflow-hidden" : "flex-wrap",
        )}
        style={useRowLimit && maxHeight ? { maxHeight } : undefined}
      >
        {visibleChips.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            onRemove={() => onRemove?.(option)}
            aria-label={`Remove ${option.label}`}
            className={cn(chipClassName, useRowLimit && "shrink-0")}
          />
        ))}
        {remainingCount > 0 && (
          <Badge
            size="md"
            severity="info"
            className={cn("shrink-0", className?.badge)}
          >
            <span className="text-xs font-medium text-primary-foreground">
              +{remainingCount}
            </span>
          </Badge>
        )}
      </div>
    </div>
  );
}
