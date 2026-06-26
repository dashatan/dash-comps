import { memo, useCallback, useMemo, useState, type JSX } from "react";
import { cn } from "@/lib";
import type {
  GridColumn,
  GridDefaultSort,
  GridProps,
} from "@/components/common/list/grid/types";
import { getGridStyle } from "@/components/common/list/grid/utils";
import GridHeader from "@/components/common/list/grid/header";
import GridBody from "@/components/common/list/grid/body";

export type {
  GridColumn,
  GridDefaultSort,
  GridProps,
} from "@/components/common/list/grid/types";

function compareRowValues(aVal: unknown, bVal: unknown, order: 1 | -1): number {
  const mult = order;
  if (aVal == null && bVal == null) return 0;
  if (aVal == null) return 1;
  if (bVal == null) return -1;
  if (typeof aVal === "string" && typeof bVal === "string") {
    return mult * aVal.localeCompare(bVal);
  }
  return mult * (Number(aVal) - Number(bVal));
}

function GridInner<T extends object>({
  columns,
  data = [],
  rowHeight,
  headerHeight,
  loading = false,
  defaultSort,
  className,
  onCellClick,
  onSortChange,
}: GridProps<T>) {
  const gridStyle = useMemo(
    () => getGridStyle({ rowHeight, headerHeight }),
    [rowHeight, headerHeight],
  );
  const [sortField, setSortField] = useState<string | null>(
    defaultSort?.field ?? null,
  );
  const [sortOrder, setSortOrder] = useState<1 | 0 | -1>(
    defaultSort?.order ?? 0,
  );

  const handleSort = useCallback(
    (column: GridColumn<T>) => {
      if (!column.sortable || loading) return;

      const field = String(column.field);
      let newOrder: 1 | 0 | -1 = 1;

      if (sortField === field) {
        if (sortOrder === 1) newOrder = -1;
        else if (sortOrder === -1) newOrder = 0;
        else newOrder = 1;
      }

      const nextField = newOrder === 0 ? null : field;
      setSortField(nextField);
      setSortOrder(newOrder);
      onSortChange?.(nextField, newOrder);
    },
    [sortField, sortOrder, loading, onSortChange],
  );

  const sortedData = useMemo(() => {
    if (!sortField || sortOrder === 0) return data;

    const field = sortField as keyof T;
    return [...data].sort((a, b) =>
      compareRowValues(a[field], b[field], sortOrder),
    );
  }, [data, sortField, sortOrder]);

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-full flex-col overflow-hidden rounded-md border",
        className?.container,
      )}
      style={gridStyle}
    >
      <div
        className={cn(
          "flex min-h-0 flex-full flex-col overflow-auto",
          className?.body,
        )}
      >
        <div className="flex min-w-full flex-col">
          <div className={cn("sticky top-0 z-10 shrink-0", className?.header)}>
            <GridHeader
              columns={columns}
              loading={loading}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </div>
          <GridBody
            columns={columns}
            data={sortedData}
            loading={loading}
            onCellClick={onCellClick}
          />
        </div>
      </div>
    </div>
  );
}

export const Grid = memo(GridInner) as <T extends object>(
  props: GridProps<T>,
) => JSX.Element;

export default Grid;
