import { useCallback, useLayoutEffect, useState } from "react";
import { SelectItem } from "@/components/common/inputs/select/types";
import {
  CHIP_GAP,
  measureVisibleChipCount,
} from "@/components/common/inputs/select/comps/trigger/chip-measurement";

export function useVisibleChipCount(
  chips: SelectItem[],
  chipRowsCount: number | undefined,
  containerRef: React.RefObject<HTMLDivElement | null>,
  measureRef: React.RefObject<HTMLDivElement | null>,
) {
  const [visibleCount, setVisibleCount] = useState(
    chipRowsCount === undefined ? chips.length : 0,
  );
  const [maxHeight, setMaxHeight] = useState<number>();

  const measure = useCallback(() => {
    if (chipRowsCount === undefined) {
      setVisibleCount(chips.length);
      setMaxHeight(undefined);
      return;
    }

    const container = containerRef.current;
    const measureLayer = measureRef.current;
    if (!container || !measureLayer) return;

    const chipElements = measureLayer.querySelectorAll<HTMLElement>(
      "[data-select-chip]",
    );
    if (!chipElements.length) {
      setVisibleCount(0);
      return;
    }

    const count = measureVisibleChipCount(
      container,
      [...chipElements],
      chipRowsCount,
    );
    setVisibleCount(count);

    const chipHeight = chipElements[0]?.offsetHeight ?? 0;
    setMaxHeight(
      chipRowsCount * chipHeight + Math.max(0, chipRowsCount - 1) * CHIP_GAP,
    );
  }, [chipRowsCount, chips, containerRef, measureRef]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || chipRowsCount === undefined) return;

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [chipRowsCount, measure, containerRef]);

  return { visibleCount, maxHeight };
}
