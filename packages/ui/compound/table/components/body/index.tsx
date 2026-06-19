import { ColumnProps, tableDefaultState, TableProps } from "../../types";
import EmptyTemplate from "./empty";
import TableRow from "./table-row";
import TD from "./TD";
import { cn, makeArray } from "@/lib";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/common/context-menu";
import React from "react";
import { useTableStore } from "../../context";

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
  const expandedRows = useTableStore((s) => s.expandedRows);
  const rows = useTableStore((s) => s.rows) ?? tableDefaultState.rows;
  const rowsCount = rows ?? tableDefaultState.rows ?? 15;
  const mockRows = makeArray(rowsCount <= 20 ? rowsCount : 20).map((_, i) => ({
    id: i + 1,
  }));
  const data = loading ? mockRows : initialData;
  const noResult = !loading && !data?.length;

  return (
    <tbody>
      {noResult ? (
        <tr>
          <td colSpan={columns?.length || 1} className="relative">
            <EmptyTemplate />
          </td>
        </tr>
      ) : (
        data?.map((item, index) => {
          const itemDataKey =
            item && dataKey
              ? ((item as Record<string, unknown>)[dataKey as string] as
                  | string
                  | number)
              : undefined;
          const expanded =
            !!itemDataKey &&
            !!expandedRows &&
            !!expandedRows[itemDataKey] &&
            !loading;
          if (expanded && rowExpansionTemplate && !expandOnNewRow) {
            const rightExcludeCols = columns?.filter(
              (x) => x.excludeExpand?.pos === "right",
            );
            const leftExcludeCols = columns?.filter(
              (x) => x.excludeExpand?.pos === "left",
            );
            const normalCols = columns?.filter(
              (x) => !x.frozen && !x.excludeExpand,
            );
            return (
              <tr key={itemDataKey ?? index} className="group bg-table">
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
                <td
                  className="border-b border-table-border"
                  colSpan={normalCols?.length}
                >
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
                        className="border-b border-table-border"
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
                        className="border-b border-table-border"
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
