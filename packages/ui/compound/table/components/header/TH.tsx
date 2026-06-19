import { memo, useCallback } from "react";
import { ColumnProps } from "../../types";
import { cn } from "@/lib";
import SortIcon from "./sort-icon";
import { useTableStore } from "../../context";
import { getFrozenStickySide } from "../../utils/frozen-columns";

export interface THProps {
  col: ColumnProps;
  loading?: boolean;
  style?: React.CSSProperties;
  className?: { th?: string; l1?: string; l2?: string };
  index?: number;
  showColumnDivider?: boolean;
  columnHover?: boolean;
  hoveredColumnIndex?: number | null;
  onColumnHover?: (index: number | null) => void;
  onResizeStart?: (e: React.PointerEvent, index: number) => void;
  onResizeReset?: (index: number) => void;
}

export const TH = memo(
  ({
    col,
    loading,
    index,
    columnHover,
    hoveredColumnIndex,
    onColumnHover,
    onResizeStart,
    onResizeReset,
    style,
    className,
  }: THProps) => {
    const sortField = useTableStore((s) => s.sortField);
    const sortOrder = useTableStore((s) => s.sortOrder);
    const setSort = useTableStore((s) => s.setSort);

    const resizable = !col.frozen && !!onResizeStart && index !== undefined;
    const isSortTarget = sortField === col.field;
    const sorted = isSortTarget && !!sortOrder;

    const handleChange = useCallback(() => {
      if (loading) return;
      if (col.field && col.sortable) {
        let order = isSortTarget ? sortOrder : 0;
        if (order === 0) order = 1;
        else if (order === 1) order = -1;
        else if (order === -1) order = 0;
        setSort(col.field, order);
      }
    }, [
      sortField,
      sortOrder,
      loading,
      col.field,
      col.sortable,
      isSortTarget,
      setSort,
    ]);

    const isHovered = columnHover && hoveredColumnIndex === index;

    const headerNode =
      typeof col.header === "function"
        ? col.header(undefined, {
            column: col,
            field: col.field ?? "",
            rowIndex: -1,
          })
        : col.header;

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
          ...style,
        }}
        className={cn(
          "group relative overflow-hidden select-none",
          {
            "pointer-events-none cursor-not-allowed": loading,
            "shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.2)]":
              col.frozen?.edge && stickySide === "right",
            "shadow-[6px_0_8px_-6px_rgba(0,0,0,0.2)]":
              col.frozen?.edge && stickySide === "left",
          },
          className?.th,
          col.className,
          col.headerClassName?.th,
        )}
      >
        <div
          className={cn(
            "h-16 w-full overflow-hidden p-2 text-right whitespace-nowrap",
            "bg-table-header text-base font-medium text-foreground transition-colors duration-200",
            "min-w-full border-e border-b border-table-border group-last:border-e-0",
            "flex items-center justify-center",
            { "bg-table-row": isHovered },
            className?.l1,
            col.headerClassName?.l1,
          )}
          onMouseEnter={
            columnHover && onColumnHover && index !== undefined
              ? () => onColumnHover(index)
              : undefined
          }
          onMouseLeave={
            columnHover && onColumnHover ? () => onColumnHover(null) : undefined
          }
        >
          <div
            className={cn(
              "flex w-full items-center gap-2",
              { "cursor-pointer": col.sortable },
              className?.l2,
              col.headerClassName?.l2,
            )}
            onClick={handleChange}
          >
            <div
              data-slot="header-label"
              className="min-w-0 flex-1 overflow-hidden"
            >
              {headerNode}
            </div>
            {col.sortable && (
              <SortIcon sortOrder={sortOrder ?? undefined} sorted={sorted} />
            )}
          </div>
        </div>
        {resizable && (
          <div
            onPointerDown={(e) => onResizeStart!(e, index!)}
            onDoubleClick={() => onResizeReset?.(index!)}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="group/resize absolute -inset-e-1 top-0 z-1 flex h-full w-2.5 cursor-col-resize touch-none items-center justify-center select-none"
          >
            <div
              className={cn(
                "h-full w-px rounded-full bg-table-border transition-colors",
                "group-hover/resize:bg-primary-hover group-active/resize:bg-primary-hover",
                "group-hover/resize:w-1 group-active/resize:w-1",
              )}
            />
          </div>
        )}
      </th>
    );
  },
);

TH.displayName = "TH";
