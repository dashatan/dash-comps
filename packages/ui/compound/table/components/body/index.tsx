import {
  ColumnProps,
  TableData,
  tableDefaultState,
  TableProps,
} from "@/components/compound/table/types";
import EmptyTemplate from "./empty";
import TableRow from "./table-row";
import TD from "./TD";
import { useFormContext } from "react-hook-form";
import { cn, makeArray } from "@/lib";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/common/context-menu";
import React from "react";

export type TableBodyProps = Pick<
  TableProps,
  | "data"
  | "dataKey"
  | "rowExpansionTemplate"
  | "rightClickMenu"
  | "loading"
  | "rowProps"
  | "expandOnNewRow"
  | "TDProps"
  | "columnHover"
  | "draggable"
> & {
  columns?: ColumnProps[];
  hoveredColumnIndex?: number | null;
  onColumnHover?: (index: number | null) => void;
};

export default function Body({
  data: initialData,
  dataKey,
  rowExpansionTemplate,
  rightClickMenu,
  loading,
  rowProps,
  expandOnNewRow,
  TDProps,
  columnHover,
  hoveredColumnIndex,
  onColumnHover,
  columns,
  draggable,
}: TableBodyProps) {
  const table = useFormContext<TableData>();
  const expandedRows = table.watch("expandedRows");
  const rows = table.watch("rows") || tableDefaultState.rows;
  const mockRows = makeArray(rows <= 20 ? rows : 20).map((x, i) => ({ id: i + 1 }));
  const data = loading ? mockRows : initialData;
  const noResult = !loading && !data?.length;

  return (
    <tbody>
      {noResult ? (
        <EmptyTemplate />
      ) : (
        data?.map((item: any, index: number) => {
          const itemDataKey = item && dataKey ? item[dataKey] : undefined;
          const expanded =
            !!itemDataKey && !!expandedRows && !!expandedRows[itemDataKey] && !loading;
          if (expanded && rowExpansionTemplate && !expandOnNewRow) {
            const rightExcludeCols = columns?.filter(
              (x) => x.excludeExpand?.pos === "right",
            );
            const leftExcludeCols = columns?.filter(
              (x) => x.excludeExpand?.pos === "left",
            );
            const normalCols = columns?.filter((x) => !x.frozen && !x.excludeExpand);
            return (
              <tr key={itemDataKey ?? index} className="bg-table group">
                {(rightExcludeCols || []).map((col, i) => {
                  const colIndex = columns?.findIndex((c) => c === col) ?? i;
                  return (
                    <TD
                      {...TDProps}
                      key={`${i}${index}`}
                      index={colIndex}
                      col={col}
                      data={item}
                      rowIndex={index}
                      loading={loading}
                      className={{
                        td: cn("align-top", TDProps?.className?.td),
                        content: TDProps?.className?.content,
                      }}
                      columnHover={columnHover}
                      hoveredColumnIndex={hoveredColumnIndex}
                      onColumnHover={onColumnHover}
                      draggable={draggable}
                    />
                  );
                })}
                <td className="border-table-border border-b" colSpan={normalCols?.length}>
                  {rowExpansionTemplate(item)}
                </td>
                {(leftExcludeCols || []).map((col, i) => {
                  const colIndex = columns?.findIndex((c) => c === col) ?? i;
                  return (
                    <TD
                      {...TDProps}
                      key={`${i}${index}`}
                      index={colIndex}
                      col={col}
                      data={item}
                      rowIndex={index}
                      loading={loading}
                      className={{
                        td: cn("align-top", TDProps?.className?.td),
                        content: TDProps?.className?.content,
                      }}
                      columnHover={columnHover}
                      hoveredColumnIndex={hoveredColumnIndex}
                      onColumnHover={onColumnHover}
                      draggable={draggable}
                    />
                  );
                })}
              </tr>
            );
          }
          return (
            <React.Fragment key={itemDataKey ?? index}>
              {rightClickMenu && !loading ? (
                <>
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <TableRow
                        data={item}
                        dataKey={dataKey}
                        index={index}
                        columns={columns}
                        loading={loading}
                        expanded={expanded}
                        TDProps={TDProps}
                        columnHover={columnHover}
                        hoveredColumnIndex={hoveredColumnIndex}
                        onColumnHover={onColumnHover}
                        draggable={draggable}
                        {...rowProps}
                      />
                    </ContextMenuTrigger>
                    <ContextMenuContent className="border-0 p-0">
                      {rightClickMenu(item)}
                    </ContextMenuContent>
                  </ContextMenu>
                  {expanded && rowExpansionTemplate && expandOnNewRow && (
                    <tr className="bg-table">
                      <td
                        className="border-table-border border-b"
                        colSpan={columns?.length}
                      >
                        {rowExpansionTemplate(item)}
                      </td>
                    </tr>
                  )}
                </>
              ) : (
                <>
                  <TableRow
                    data={item}
                    dataKey={dataKey}
                    index={index}
                    columns={columns}
                    loading={loading}
                    expanded={expanded}
                    TDProps={TDProps}
                    columnHover={columnHover}
                    hoveredColumnIndex={hoveredColumnIndex}
                    onColumnHover={onColumnHover}
                    draggable={draggable}
                    {...rowProps}
                  />
                  {expanded && rowExpansionTemplate && expandOnNewRow && (
                    <tr className="bg-table">
                      <td
                        className="border-table-border border-b"
                        colSpan={columns?.length}
                      >
                        {rowExpansionTemplate(item)}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </React.Fragment>
          );
        })
      )}
    </tbody>
  );
}
