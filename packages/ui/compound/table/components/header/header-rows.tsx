import { cn } from "@/lib";
import { TH } from "./TH";
import { Filter } from "./filter-row";
import { ColumnProps, TableProps } from "../../types";
import { useEffect, useState } from "react";
import { useTableStore } from "../../context";

export type HeaderRowsProps = Pick<
  TableProps,
  "actionHeaderProps" | "loading" | "THProps" | "columnHover"
> & {
  columns?: ColumnProps[];
  hoveredColumnIndex?: number | null;
  onColumnHover?: (index: number | null) => void;
  onColumnResizeStart?: (e: React.PointerEvent, index: number) => void;
  onColumnResizeReset?: (index: number) => void;
};

const FILTER_ROW_EXIT_MS = 100;

export function HeaderRows({
  actionHeaderProps,
  loading,
  THProps,
  columnHover,
  hoveredColumnIndex,
  onColumnHover,
  onColumnResizeStart,
  onColumnResizeReset,
  columns,
}: HeaderRowsProps) {
  const showFilter =
    useTableStore((s) => s.showFilter) && !actionHeaderProps?.hideFilter;

  const [filterRowVisible, setFilterRowVisible] = useState(showFilter);
  const [filterRowExiting, setFilterRowExiting] = useState(false);

  useEffect(() => {
    if (showFilter) {
      setFilterRowExiting(false);
      setFilterRowVisible(true);
    } else if (filterRowVisible) {
      setFilterRowExiting(true);
      const t = setTimeout(() => {
        setFilterRowVisible(false);
        setFilterRowExiting(false);
      }, FILTER_ROW_EXIT_MS);
      return () => clearTimeout(t);
    }
  }, [showFilter, filterRowVisible]);

  return (
    <>
      <tr>
        {columns?.map((col, i, all) => (
          <TH
            key={i}
            index={i}
            showColumnDivider={i < all.length - 1}
            {...THProps}
            col={col}
            loading={loading}
            columnHover={columnHover}
            hoveredColumnIndex={hoveredColumnIndex}
            onColumnHover={onColumnHover}
            onResizeStart={onColumnResizeStart}
            onResizeReset={onColumnResizeReset}
          />
        ))}
      </tr>
      {filterRowVisible && (
        <tr
          className={cn(
            filterRowExiting ? "filter-row-exit" : "filter-row-enter",
          )}
        >
          {columns?.map((col, index) => (
            <Filter key={index} col={col} loading={loading} />
          ))}
        </tr>
      )}
    </>
  );
}
