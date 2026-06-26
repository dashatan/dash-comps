import { memo, useMemo, type JSX } from "react";
import type { GridColumn } from "@/components/common/list/grid/types";
import { getGridTemplateColumns } from "@/components/common/list/grid/utils";
import GridHeaderCell from "@/components/common/list/grid/header-cell";

export interface GridHeaderProps<T extends object> {
  columns: GridColumn<T>[];
  loading?: boolean;
  sortField?: string | null;
  sortOrder?: 1 | 0 | -1;
  onSort?: (column: GridColumn<T>) => void;
}

function GridHeaderInner<T extends object>({
  columns,
  loading = false,
  sortField,
  sortOrder = 0,
  onSort,
}: GridHeaderProps<T>) {
  const gridTemplateColumns = useMemo(
    () => getGridTemplateColumns(columns),
    [columns],
  );

  return (
    <div
      className="grid w-full min-w-full overflow-hidden"
      style={{
        gridTemplateColumns,
        gridAutoRows: "var(--grid-header-height)",
      }}
    >
      {columns.map((column, index) => (
        <GridHeaderCell
          key={column.field != null ? String(column.field) : index}
          column={column}
          loading={loading}
          isSorted={sortField === String(column.field)}
          sortOrder={sortField === String(column.field) ? sortOrder : 0}
          onSort={onSort}
        />
      ))}
    </div>
  );
}

const GridHeader = memo(GridHeaderInner) as <T extends object>(
  props: GridHeaderProps<T>,
) => JSX.Element;

export default GridHeader;
