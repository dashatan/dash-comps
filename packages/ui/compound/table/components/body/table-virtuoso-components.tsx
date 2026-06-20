import { forwardRef, memo } from 'react'
import { type TableComponents } from 'react-virtuoso'
import { ColumnProps } from '../../types'
import { cn } from '@/lib'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/components/common/context-menu'
import { useTableStore } from '../../context'
import { getItemDataKey, type TableVirtualRow } from './build-virtual-rows'
import { isRowExpanded } from './render-row-content'
import type { TableStoreApi } from '../../store'

export type VirtualTableRowContext = {
  rightClickMenu?: (data: Record<string, unknown>) => React.ReactNode
  loading?: boolean
  rowProps?: {
    getRowClassName?: (data: Record<string, unknown>, api: TableStoreApi) => string
    className?: string | ((data: Record<string, unknown>, api: TableStoreApi) => string)
    onClick?: (data: Record<string, unknown>, api: TableStoreApi) => void
    extraElements?: (data: Record<string, unknown>, api: TableStoreApi) => React.ReactNode
  }
  dataKey?: string | number
  expandOnNewRow?: boolean
  api: TableStoreApi
}

export type VirtualTableComponentsContext = {
  className?: { table?: string }
  columns?: ColumnProps[]
  colRefs: React.MutableRefObject<(HTMLTableColElement | null)[]>
  getColWidth: (col: ColumnProps, index: number, all: ColumnProps[]) => number | string | undefined
  colKey: (col: ColumnProps, index: number) => string
}

export type VirtualTableContext = VirtualTableRowContext & VirtualTableComponentsContext

export const VirtualizedTableRow = memo(
  forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement> & {
      item?: TableVirtualRow
      context?: VirtualTableContext
    }
  >(({ item, context, children, className, ...props }, ref) => {
    const selected = useTableStore((s) => s.selected)
    const expandedRows = useTableStore((s) => s.expandedRows)
    useTableStore((s) => s.sidePanelData)

    if (!item || !context) {
      return (
        <tr ref={ref} className={className} {...props}>
          {children}
        </tr>
      )
    }

    const { rightClickMenu, loading, rowProps, dataKey, expandOnNewRow, api } = context
    const { getRowClassName, className: classNameProp, onClick, extraElements } = rowProps ?? {}

    const itemDataKey = getItemDataKey(item.item, dataKey)
    const isSelected = itemDataKey !== undefined && selected?.includes(itemDataKey)
    const expanded =
      item.kind === 'row' && isRowExpanded(item.item, dataKey, expandedRows, loading)

    const dynamicClassName =
      getRowClassName?.(item.item, api) ??
      (typeof classNameProp === 'function' ? classNameProp(item.item, api) : undefined)

    const rowClassName = cn(
      'bg-table hover:bg-table-row group transition-colors duration-200',
      item.kind === 'expansion' && 'bg-table',
      {
        '[&_td]:border-b-0': expanded && expandOnNewRow,
        'bg-table-row': isSelected,
      },
      className,
      dynamicClassName,
      typeof classNameProp === 'string' ? classNameProp : undefined,
    )

    const rowContent = (
      <>
        {children}
        {item.kind === 'row' ? extraElements?.(item.item, api) : null}
      </>
    )

    const row = (
      <tr ref={ref} className={rowClassName} onClick={() => onClick?.(item.item, api)} {...props}>
        {rowContent}
      </tr>
    )

    if (item.kind === 'expansion' || !rightClickMenu || loading) {
      return row
    }

    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <tr ref={ref} className={rowClassName} onClick={() => onClick?.(item.item, api)} {...props}>
            {rowContent}
          </tr>
        </ContextMenuTrigger>
        <ContextMenuContent className="border-0 p-0">{rightClickMenu(item.item)}</ContextMenuContent>
      </ContextMenu>
    )
  }),
)

VirtualizedTableRow.displayName = 'VirtualizedTableRow'

function ColGroup({
  ctx,
}: {
  ctx?: VirtualTableComponentsContext
}) {
  if (!ctx?.columns?.length) return null

  const { columns, colRefs, getColWidth, colKey } = ctx

  return (
    <colgroup>
      {columns.map((col, i, all) => (
        <col
          key={colKey(col, i)}
          ref={(el) => {
            colRefs.current[i] = el
          }}
          style={{ width: getColWidth(col, i, all) }}
        />
      ))}
    </colgroup>
  )
}

export const VirtualTableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { context?: VirtualTableContext }
>(({ context, ...props }, ref) => <tbody ref={ref} {...props} />)

VirtualTableBody.displayName = 'VirtualTableBody'

export const VirtualTableHead = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(() => null)

VirtualTableHead.displayName = 'VirtualTableHead'

export const VirtualTableElement = forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { context?: VirtualTableContext }
>(({ style, children, context, ...tableProps }, ref) => (
  <table
    ref={ref}
    id="table-non-scrollable"
    {...tableProps}
    style={style}
    className={cn('w-full table-fixed border-separate border-spacing-0', context?.className?.table)}
  >
    <ColGroup ctx={context} />
    {children}
  </table>
))

VirtualTableElement.displayName = 'VirtualTableElement'

export const ScrollSeekRow = forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { context?: VirtualTableContext }
>(({ context, ...props }, ref) => (
  <tr ref={ref} {...props}>
    <td
      colSpan={Math.max(context?.columns?.length ?? 1, 1)}
      className="border-table-border h-16 border-b bg-table"
    />
  </tr>
))

ScrollSeekRow.displayName = 'ScrollSeekRow'

export function createVirtuosoComponents(): TableComponents<TableVirtualRow, VirtualTableContext> {
  return {
    Table: VirtualTableElement,
    TableHead: VirtualTableHead,
    TableRow: VirtualizedTableRow,
    ScrollSeekPlaceholder: ScrollSeekRow,
  }
}
