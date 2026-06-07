import { forwardRef, memo } from 'react'
import TD from './TD'
import { ColumnProps, TableProps } from '@/components/compound/table/types'
import { cn } from '@/lib'
import { useTableStore, useTableStoreApi } from '@/components/compound/table/context'
import type { TableStoreApi } from '@/components/compound/table/store'

export type TableRowProps = Pick<
  TableProps,
  'rightClickMenu' | 'TDProps' | 'dataKey' | 'columnHover' | 'draggable'
> & {
  loading?: boolean
  data: Record<string, unknown>
  index: number
  columns?: ColumnProps[]
  expanded?: boolean
  className?: (data: Record<string, unknown>, api: TableStoreApi) => string
  onClick?: (data: Record<string, unknown>, api: TableStoreApi) => void
  extraElements?: (data: Record<string, unknown>, api: TableStoreApi) => React.ReactNode
  hoveredColumnIndex?: number | null
  onColumnHover?: (index: number | null) => void
}

const TableRow = memo(
  forwardRef<HTMLTableRowElement, TableRowProps>(
    (
      {
        data,
        index,
        columns,
        loading,
        expanded,
        TDProps,
        dataKey,
        className,
        onClick,
        extraElements,
        columnHover,
        hoveredColumnIndex,
        onColumnHover,
        draggable,
        ...props
      },
      ref,
    ) => {
      const selected = useTableStore((s) => s.selected)
      const api = useTableStoreApi()

      const rowKey = dataKey ? (data[dataKey as string] as string | number) : undefined
      const isSelected = rowKey !== undefined && selected?.includes(rowKey)

      return (
        <tr
          ref={ref}
          key={index}
          className={cn(
            'bg-table hover:bg-table-row group transition-all',
            { '[&_td]:border-b-0': expanded, 'bg-table-row': isSelected },
            className?.(data, api),
          )}
          onClick={() => onClick?.(data, api)}
          {...props}
        >
          {columns?.map((col, colIndex) => (
            <TD
              {...TDProps}
              key={`${colIndex}${index}`}
              index={colIndex}
              col={col}
              data={data}
              rowIndex={index}
              loading={loading}
              className={TDProps?.className}
              columnHover={columnHover}
              hoveredColumnIndex={hoveredColumnIndex}
              onColumnHover={onColumnHover}
              draggable={draggable}
            />
          ))}
          {extraElements?.(data, api)}
        </tr>
      )
    },
  ),
)

export default TableRow
