import { memo, useCallback, type JSX, type ReactNode } from "react";
import { cn } from "@/lib";
import type { GridColumn } from "@/components/common/list/grid/types";
import SkeletonField from "@/components/compound/table/components/body/skeleton";

export interface GridBodyCellProps<T extends object> {
  column: GridColumn<T>;
  data: T;
  rowIndex: number;
  loading?: boolean;
  onCellClick?: (data: T, column: GridColumn<T>, rowIndex: number) => void;
  isLastRow?: boolean;
}

function GridBodyCellInner<T extends object>({
  column,
  data,
  rowIndex,
  loading = false,
  isLastRow,
  onCellClick,
}: GridBodyCellProps<T>) {
  const handleClick = useCallback(() => {
    if (!loading) {
      onCellClick?.(data, column, rowIndex);
    }
  }, [data, column, rowIndex, loading, onCellClick]);

  const showSkeleton = loading && column.body;
  const bodyClassName = column.bodyClassName;

  let Body: ReactNode = null;

  if (showSkeleton) {
    Body = <SkeletonField />;
  } else if (column.body) {
    Body = column.body(data);
  }

  return (
    <div
      className={cn(
        "h-full min-h-0 w-full min-w-0 cursor-default overflow-hidden border-b bg-transparent px-3 whitespace-nowrap",
        "text-foreground",
        {
          "pointer-events-none": loading,
          "cursor-pointer": !loading && onCellClick,
          "border-b-0": isLastRow,
        },
        column.className?.body,
        bodyClassName?.td,
      )}
      style={column.style}
      onClick={handleClick}
    >
      <div
        className={cn(
          "text-foreground flex h-full w-full min-w-0 items-center text-right text-xs font-semibold",
          column.className?.content,
          bodyClassName?.content,
        )}
      >
        {Body}
      </div>
    </div>
  );
}

const GridBodyCell = memo(GridBodyCellInner) as <T extends object>(
  props: GridBodyCellProps<T>,
) => JSX.Element;

export default GridBodyCell;
