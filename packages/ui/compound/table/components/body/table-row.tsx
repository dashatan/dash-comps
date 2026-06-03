import { forwardRef, memo } from 'react'
import TD from './TD'
import { FieldValues, UseFormReturn, useFormContext } from 'react-hook-form'
import { ColumnProps, TableData, TableProps } from '@/components/compound/table/types'
import { cn } from '@/lib'

export type TableRowProps = Pick<TableProps, 'rightClickMenu' | 'TDProps' | 'dataKey' | 'columnHover' | 'draggable'> & {
  loading?: boolean
  data: any
  index: number
  columns?: ColumnProps[]
  expanded?: boolean
  className?: (data: any, table: UseFormReturn<TableData, any, FieldValues>) => string
  onClick?: (data: any, table: UseFormReturn<TableData, any, FieldValues>) => void
  extraElements?: (data: any, table: UseFormReturn<TableData, any, FieldValues>) => React.ReactNode
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
      ref
    ) => {
      const table = useFormContext<TableData>()
      const selected = table.watch('selected')
      const isSelected = selected?.includes(dataKey)

      return (
        <tr
          ref={ref}
          key={index}
          className={cn(
            'bg-table hover:bg-table-row group transition-all',
            {
              '[&_td]:border-b-0': expanded,
              'bg-table-row': isSelected,
            },
            className && className(data, table)
          )}
          onClick={() => onClick && onClick(data, table)}
          {...props}
        >
          {columns?.map((col, colIndex) => {
            return (
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
            )
          })}
          {extraElements && extraElements(data, table)}
        </tr>
      )
    }
  )
)

export default TableRow
