import { memo, useCallback, useMemo } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import { tableDefaultState, TableProps } from '../../types'
import { HeaderRows, type HeaderRowsProps } from '../header/header-rows'
import EmptyTemplate from './empty'
import { cn, makeArray } from '@/lib'
import { useTableStore, useTableStoreApi } from '../../context'
import { buildVirtualRows, getItemDataKey, type TableVirtualRow } from './build-virtual-rows'
import { renderRowContent } from './render-row-content'
import {
  createVirtuosoComponents,
  type VirtualTableComponentsContext,
  type VirtualTableRowContext,
} from './table-virtuoso-components'

const DEFAULT_ROW_HEIGHT = 64
const virtuosoComponents = createVirtuosoComponents()

type VirtualizedTableProps = Pick<
  TableProps,
  | 'data'
  | 'dataKey'
  | 'rowExpansionTemplate'
  | 'rightClickMenu'
  | 'loading'
  | 'rowProps'
  | 'expandOnNewRow'
  | 'TDProps'
  | 'columnHover'
  | 'draggable'
  | 'actionHeaderProps'
  | 'THProps'
  | 'className'
> & {
  columns?: HeaderRowsProps['columns']
  hoveredColumnIndex?: number | null
  onColumnHover?: (index: number | null) => void
  onColumnResizeStart?: (e: React.PointerEvent, index: number) => void
  onColumnResizeReset?: (index: number) => void
  scrollParent: HTMLElement | null
  colRefs: React.MutableRefObject<(HTMLTableColElement | null)[]>
  getColWidth: VirtualTableComponentsContext['getColWidth']
  colKey: VirtualTableComponentsContext['colKey']
}

function StickyHeaderTable({
  headerProps,
  componentsContext,
}: {
  headerProps: HeaderRowsProps
  componentsContext: VirtualTableComponentsContext
}) {
  const { columns, colRefs, getColWidth, colKey, className } = componentsContext

  return (
    <table
      className={cn(
        'sticky top-0 z-[3] w-full table-fixed border-separate border-spacing-0',
        className?.table,
      )}
    >
      <colgroup>
        {columns?.map((col, i, all) => (
          <col
            key={colKey(col, i)}
            ref={(el) => {
              colRefs.current[i] = el
            }}
            style={{ width: getColWidth(col, i, all) }}
          />
        ))}
      </colgroup>
      <thead
        className={cn(
          '[&>th]:last:border-b [&>th:first-child]:first:rounded-tr-md [&>th:last-child]:first:rounded-tl-md',
          'border-table-border bg-table-header border-b',
        )}
      >
        <HeaderRows {...headerProps} />
      </thead>
    </table>
  )
}

function VirtualizedTable({
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
  actionHeaderProps,
  THProps,
  className,
  scrollParent,
  onColumnResizeStart,
  onColumnResizeReset,
  colRefs,
  getColWidth,
  colKey,
}: VirtualizedTableProps) {
  const expandedRows = useTableStore((s) => s.expandedRows)
  const rows = useTableStore((s) => s.rows) ?? tableDefaultState.rows
  const rowsCount = rows ?? tableDefaultState.rows ?? 15
  const api = useTableStoreApi()

  const mockRows = useMemo(
    () => makeArray(rowsCount <= 20 ? rowsCount : 20).map((_, i) => ({ id: i + 1 })),
    [rowsCount],
  )

  const sourceData = loading ? mockRows : initialData

  const virtualRows = useMemo(
    () =>
      buildVirtualRows({
        data: sourceData,
        dataKey,
        expandedRows,
        expandOnNewRow,
        hasExpansionTemplate: !!rowExpansionTemplate,
        loading,
      }),
    [sourceData, dataKey, expandedRows, expandOnNewRow, rowExpansionTemplate, loading],
  )

  const headerProps = useMemo<HeaderRowsProps>(
    () => ({
      actionHeaderProps,
      columns,
      loading,
      THProps,
      columnHover,
      hoveredColumnIndex,
      onColumnHover,
      onColumnResizeStart,
      onColumnResizeReset,
    }),
    [
      actionHeaderProps,
      columns,
      loading,
      THProps,
      columnHover,
      hoveredColumnIndex,
      onColumnHover,
      onColumnResizeStart,
      onColumnResizeReset,
    ],
  )

  const componentsContext = useMemo<VirtualTableComponentsContext>(
    () => ({
      className,
      columns,
      colRefs,
      getColWidth,
      colKey,
    }),
    [className, columns, colRefs, getColWidth, colKey],
  )

  const rowContext = useMemo<VirtualTableRowContext>(
    () => ({
      rightClickMenu,
      loading,
      rowProps,
      dataKey,
      expandOnNewRow,
      api,
    }),
    [rightClickMenu, loading, rowProps, dataKey, expandOnNewRow, api],
  )

  const itemContent = useCallback(
    (_index: number, virtualRow: TableVirtualRow) => {
      const expanded = virtualRow.kind === 'row' && virtualRow.expanded

      return renderRowContent({
        virtualRow,
        columns,
        dataKey,
        rowExpansionTemplate,
        expandOnNewRow,
        loading,
        expanded,
        TDProps,
        columnHover,
        hoveredColumnIndex,
        onColumnHover,
        draggable,
      })
    },
    [
      columns,
      dataKey,
      rowExpansionTemplate,
      expandOnNewRow,
      loading,
      TDProps,
      columnHover,
      hoveredColumnIndex,
      onColumnHover,
      draggable,
    ],
  )

  const computeItemKey = useCallback(
    (_index: number, virtualRow: TableVirtualRow) => {
      const itemKey = getItemDataKey(virtualRow.item, dataKey)

      if (virtualRow.kind === 'expansion') {
        return `expansion-${String(itemKey ?? virtualRow.dataIndex)}`
      }

      const expansionSuffix = virtualRow.expanded
        ? expandOnNewRow
          ? '-open'
          : '-expanded'
        : ''

      return `${String(itemKey ?? virtualRow.dataIndex)}${expansionSuffix}`
    },
    [dataKey, expandOnNewRow],
  )

  if (!virtualRows.length) {
    return (
      <>
        <StickyHeaderTable headerProps={headerProps} componentsContext={componentsContext} />
        <table
          id="table-non-scrollable"
          className={cn('w-full table-fixed border-separate border-spacing-0', className?.table)}
        >
          <colgroup>
            {columns?.map((col, i, all) => (
              <col
                key={colKey(col, i)}
                ref={(el) => {
                  colRefs.current[i] = el
                }}
                style={{ width: getColWidth(col, i, all) }}
              />
            ))}
          </colgroup>
          <tbody>
            <tr>
              <td colSpan={columns?.length || 1} className="relative">
                <EmptyTemplate />
              </td>
            </tr>
          </tbody>
        </table>
      </>
    )
  }

  return (
    <>
      <StickyHeaderTable headerProps={headerProps} componentsContext={componentsContext} />
      <TableVirtuoso
        customScrollParent={scrollParent ?? undefined}
        data={virtualRows}
        context={{ ...rowContext, ...componentsContext }}
        components={virtuosoComponents}
        itemContent={itemContent}
        computeItemKey={computeItemKey}
        defaultItemHeight={DEFAULT_ROW_HEIGHT}
        increaseViewportBy={{ top: 400, bottom: 400 }}
        scrollSeekConfiguration={{
          enter: (velocity) => Math.abs(velocity) > 500,
          exit: (velocity) => Math.abs(velocity) < 80,
        }}
        style={{ height: '100%', width: '100%' }}
      />
    </>
  )
}

export default memo(VirtualizedTable)
