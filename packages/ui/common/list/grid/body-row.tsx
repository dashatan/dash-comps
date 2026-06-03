import { memo, type JSX } from "react";
import type { GridColumn } from "@/components/common/list/grid/types";
import GridBodyCell from "@/components/common/list/grid/body-cell";

export interface GridBodyRowProps<T extends object> {
  columns: GridColumn<T>[];
  data: T;
  rowIndex: number;
  totalRows: number;
  loading?: boolean;
  onCellClick?: (data: T, column: GridColumn<T>, rowIndex: number) => void;
}

function GridBodyRowInner<T extends object>({
  columns,
  data,
  rowIndex,
  loading = false,
  totalRows,
  onCellClick,
}: GridBodyRowProps<T>) {
  return (
    <div className="bg-table hover:bg-table-row col-span-full grid w-full grid-cols-subgrid transition-colors">
      {columns.map((column, columnIndex) => (
        <GridBodyCell
          key={column.field != null ? String(column.field) : columnIndex}
          column={column}
          data={data}
          rowIndex={rowIndex}
          loading={loading}
          onCellClick={onCellClick}
          isLastRow={rowIndex === totalRows - 1}
        />
      ))}
    </div>
  );
}

const GridBodyRow = memo(GridBodyRowInner) as <T extends object>(
  props: GridBodyRowProps<T>,
) => JSX.Element;

export default GridBodyRow;
