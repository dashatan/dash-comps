import { forwardRef, memo } from 'react'
import TD from './TD'
import { ColumnProps, TableProps } from '../../types'
import { cn } from '@/lib'
import { useTableStore, useTableStoreApi } from '../../context'
import type { TableStoreApi } from '../../store'

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
  /** @deprecated Use `getRowClassName` — `className` collides with Radix `asChild` triggers. */
  getRowClassName?: (data: Record<string, unknown>, api: TableStoreApi) => string
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
        className: classNameProp,
        getRowClassName,
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

      const dynamicClassName =
        getRowClassName?.(data, api) ??
        (typeof classNameProp === 'function' ? classNameProp(data, api) : undefined)

      return (
        <tr
          ref={ref}
          key={index}
          className={cn(
            'bg-table hover:bg-table-row group transition-colors duration-200',
            { '[&_td]:border-b-0': expanded, 'bg-table-row': isSelected },
            dynamicClassName,
            typeof classNameProp === 'string' ? classNameProp : undefined,
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
