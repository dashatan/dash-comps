import { memo, useMemo, type JSX } from "react";
import { cn, makeArray } from "@/lib";
import type { GridColumn } from "@/components/common/list/grid/types";
import { getGridTemplateColumns } from "@/components/common/list/grid/utils";
import GridBodyRow from "@/components/common/list/grid/body-row";
import EmptyTemplate from "@/components/compound/table/components/body/empty";
import Skeleton from "@/components/common/skeleton";

export interface GridBodyProps<T extends object> {
  columns: GridColumn<T>[];
  data: T[];
  loading?: boolean;
  onCellClick?: (data: T, column: GridColumn<T>, rowIndex: number) => void;
}

function GridBodyInner<T extends object>({
  columns,
  data = [],
  loading = false,
  onCellClick,
}: GridBodyProps<T>) {
  const gridTemplateColumns = useMemo(
    () => getGridTemplateColumns(columns),
    [columns],
  );
  const noResult = !loading && !data?.length;

  if (noResult) {
    return (
      <div className="flex h-full min-h-20 flex-full flex-col items-center justify-center">
        <EmptyTemplate size="sm" />
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex h-full w-full flex-col gap-4 overflow-hidden rounded-b-md px-4 pt-4">
        {makeArray(4).map((x) => (
          <Skeleton key={x} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid w-full min-w-full rounded-b-md"
      style={{
        gridTemplateColumns,
        gridAutoRows: "var(--grid-row-height)",
      }}
    >
      {data.map((item, rowIndex) => (
        <GridBodyRow
          key={String(("id" in item ? item.id : null) ?? rowIndex)}
          columns={columns}
          data={item}
          rowIndex={rowIndex}
          loading={loading}
          onCellClick={onCellClick}
          totalRows={data.length}
        />
      ))}
    </div>
  );
}

const GridBody = memo(GridBodyInner) as <T extends object>(
  props: GridBodyProps<T>,
) => JSX.Element;

export default GridBody;
