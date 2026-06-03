import { memo, useCallback, type JSX } from "react";
import { cn } from "@/lib";
import SortIcon from "@/components/compound/table/components/header/sort-icon";
import type { GridColumn } from "@/components/common/list/grid/types";

export interface GridHeaderCellProps<T extends object> {
  column: GridColumn<T>;
  loading?: boolean;
  isSorted?: boolean;
  sortOrder?: 1 | 0 | -1;
  onSort?: (column: GridColumn<T>) => void;
}

function GridHeaderCellInner<T extends object>({
  column,
  loading = false,
  isSorted = false,
  sortOrder = 0,
  onSort,
}: GridHeaderCellProps<T>) {
  const handleClick = useCallback(() => {
    if (column.sortable && !loading) {
      onSort?.(column);
    }
  }, [column, loading, onSort]);

  const sorted = isSorted && sortOrder !== 0;
  const headerClassName = column.headerClassName ?? column.className;

  return (
    <div
      className={cn(
        "group h-full min-h-0 w-full min-w-0 overflow-hidden select-none",
        {
          "pointer-events-none cursor-not-allowed": loading,
        },
        column.className?.header,
        headerClassName?.header,
      )}
      style={column.style}
    >
      <div
        className={cn(
          "h-full w-full overflow-hidden px-3 text-right whitespace-nowrap",
          "bg-table-header text-foreground text-xs font-medium transition duration-200",
          "flex items-center justify-center",
          headerClassName?.l1,
        )}
      >
        <div
          className={cn(
            "flex w-full items-center gap-2",
            { "cursor-pointer": column.sortable },
            headerClassName?.header,
            headerClassName?.l2,
          )}
          onClick={handleClick}
        >
          {column.header}
          {column.sortable && <SortIcon sortOrder={sortOrder} sorted={sorted} />}
        </div>
      </div>
    </div>
  );
}

const GridHeaderCell = memo(GridHeaderCellInner) as <T extends object>(
  props: GridHeaderCellProps<T>,
) => JSX.Element;

export default GridHeaderCell;
