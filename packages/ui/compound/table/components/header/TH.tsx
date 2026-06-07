import { memo, useCallback } from 'react'
import { ColumnProps } from '@/components/compound/table/types'
import { cn } from '@/lib'
import SortIcon from './sort-icon'
import { useTableStore } from '@/components/compound/table/context'

export interface THProps {
  col: ColumnProps
  loading?: boolean
  style?: React.CSSProperties
  className?: { th?: string; l1?: string; l2?: string }
  index?: number
  columnHover?: boolean
  hoveredColumnIndex?: number | null
  onColumnHover?: (index: number | null) => void
}

export const TH = memo(
  ({
    col,
    loading,
    index,
    columnHover,
    hoveredColumnIndex,
    onColumnHover,
    style,
    className,
  }: THProps) => {
    const sortField = useTableStore((s) => s.sortField)
    const sortOrder = useTableStore((s) => s.sortOrder)
    const setSort = useTableStore((s) => s.setSort)

    const resizable = !col.frozen && !col.style?.maxWidth
    const isSortTarget = sortField === col.field
    const sorted = isSortTarget && !!sortOrder

    const handleChange = useCallback(() => {
      if (loading) return
      if (col.field && col.sortable) {
        let order = isSortTarget ? sortOrder : 0
        if (order === 0) order = 1
        else if (order === 1) order = -1
        else if (order === -1) order = 0
        setSort(col.field, order)
      }
    }, [sortField, sortOrder, loading, col.field, col.sortable, isSortTarget, setSort])

    const isHovered = columnHover && hoveredColumnIndex === index

    const headerNode =
      typeof col.header === 'function'
        ? col.header(undefined, {
            column: col,
            field: col.field ?? '',
            rowIndex: -1,
          })
        : col.header

    return (
      <th
        style={{
          ...col.style,
          ...(col.frozen && { position: 'sticky', [col.frozen.pos]: col.frozen.distance, zIndex: 2 }),
          ...(col.width && { minWidth: col.width, width: col.width, maxWidth: col.width }),
          ...style,
        }}
        className={cn(
          'group overflow-hidden select-none',
          { 'pointer-events-none cursor-not-allowed': loading },
          className?.th,
          col.className,
          col.headerClassName?.th,
        )}
      >
        <div
          className={cn(
            'h-16 w-full overflow-hidden p-2 text-right whitespace-nowrap',
            'bg-table-header text-foreground text-base font-medium transition duration-200',
            'border-table-border min-w-full border-e border-b group-last:border-e-0',
            'flex items-center justify-center',
            { 'resize-x': resizable, 'bg-table-row': isHovered },
            className?.l1,
            col.headerClassName?.l1,
          )}
          onMouseEnter={
            columnHover && onColumnHover && index !== undefined ? () => onColumnHover(index) : undefined
          }
          onMouseLeave={columnHover && onColumnHover ? () => onColumnHover(null) : undefined}
        >
          <div
            className={cn(
              'flex w-full items-center gap-2',
              { 'cursor-pointer': col.sortable },
              className?.l2,
              col.headerClassName?.l2,
            )}
            onClick={handleChange}
          >
            {headerNode}
            {col.sortable && <SortIcon sortOrder={sortOrder ?? undefined} sorted={sorted} />}
          </div>
        </div>
      </th>
    )
  },
)

TH.displayName = 'TH'
