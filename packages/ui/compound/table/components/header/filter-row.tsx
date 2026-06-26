import filterElements, { FILTER_ROW_CONTROL_HEIGHT } from "../filter";
import { ColumnProps, FilterValue } from "../../types";
import { cn } from "@/lib";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { useTableStore } from "../../context";
import { getFrozenStickySide } from "../../utils/frozen-columns";

function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay],
  );
}

export interface FilterProps {
  col: ColumnProps;
  loading?: boolean;
}

const Filter: React.FC<FilterProps> = memo(({ col, loading = false }) => {
  const filters = useTableStore((s) => s.filters);
  const setFilter = useTableStore((s) => s.setFilter);

  const key = useMemo(
    () => col.filterKey || col.field,
    [col.filterKey, col.field],
  );
  const value = useMemo(
    () => (filters && key && filters[key] ? filters[key] : undefined),
    [filters, key],
  );
  const type = useMemo(
    () => col.filterElementType || "",
    [col.filterElementType],
  );
  const options = col.filterOptions;
  const FilterEl = useMemo(() => filterElements[type], [type]);

  const debouncedSetFilter = useDebouncedCallback(
    (filterKey: string, val: FilterValue | undefined) => {
      setFilter(filterKey, val);
    },
    600,
  );

  const handleChange = useCallback(
    (val: FilterValue) => {
      if (loading || !key) return;
      col.onFilterChange?.(val);
      if (col.noDebounce) {
        setFilter(key, val);
      } else {
        debouncedSetFilter(key, val);
      }
    },
    [loading, key, col, setFilter, debouncedSetFilter],
  );

  const stickySide = col.frozen ? getFrozenStickySide(col.frozen) : undefined;

  return (
    <th
      style={{
        ...col.style,
        ...(col.frozen &&
          stickySide && {
            position: "sticky",
            [stickySide]: col.frozen.distance ?? 0,
            zIndex: 2,
          }),
      }}
      className={cn("overflow-hidden border-b bg-table p-2", {
        "shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.2)]":
          col.frozen?.edge && stickySide === "right",
        "shadow-[6px_0_8px_-6px_rgba(0,0,0,0.2)]":
          col.frozen?.edge && stickySide === "left",
      })}
    >
      <div
        className={cn("flex w-full items-center", FILTER_ROW_CONTROL_HEIGHT)}
      >
        {col.filterElement ? (
          col.filterElement
        ) : FilterEl ? (
          <FilterEl
            onChange={handleChange}
            defaultValue={value}
            options={options}
            className={col.filterClassName}
            inputProps={{ disabled: loading, ...col.filterProps }}
          />
        ) : null}
      </div>
    </th>
  );
});

Filter.displayName = "Filter";

export { Filter };
