import { cn } from '@/lib'
import { TH } from './TH'
import { Filter } from './filter-row'
import { useFormContext } from 'react-hook-form'
import { ChangeTag, ColumnProps, TableData, TableProps } from '@components/compound/table/types'
import { debounce } from 'lodash'
import { useRef } from 'react'

export type TableHeaderProps = Pick<TableProps, 'actionHeaderProps' | 'loading' | 'THProps' | 'columnHover'> & {
  columns?: ColumnProps[]
  onChange: (data: Partial<TableData>, tag: ChangeTag) => void
  hoveredColumnIndex?: number | null
  onColumnHover?: (index: number | null) => void
}

// TODO: unlimited rerender occurs, i saw this on provinces profile table
export default function Header({ actionHeaderProps, loading, THProps, columnHover, hoveredColumnIndex, onColumnHover, columns, onChange }: TableHeaderProps) {
  const debounced = useRef(debounce((cb) => cb && cb(), 600)).current
  const table = useFormContext<TableData>()
  const state = table.getValues()
  const showFilter = table.getValues('showFilter') && !actionHeaderProps?.hideFilter

  return (
    <thead
      className={cn(
        '[&>th]:last:border-b [&>th:first-child]:first:rounded-tr-md [&>th:last-child]:first:rounded-tl-md',
        'border-table-border sticky top-0 z-[2] border-b'
      )}
    >
      <tr>
        {columns?.map((col, i, a) => {
          return (
            <TH
              key={i}
              index={i}
              style={{ ...(i === a.length - 2 && { width: 'auto' }) }}
              {...THProps}
              col={col}
              loading={loading}
              onchange={onChange}
              columnHover={columnHover}
              hoveredColumnIndex={hoveredColumnIndex}
              onColumnHover={onColumnHover}
            />
          )
        })}
      </tr>
      {showFilter && (
        <tr>
          {columns?.map((col, index) => (
            <Filter
              key={index}
              col={col}
              loading={loading}
              values={state}
              onchange={(values, tag) => {
                if (!col.noDebounce) {
                  debounced(() => {
                    table.reset(values)
                    onChange(values, tag)
                  })
                } else {
                  table.reset(values)
                  onChange(values, tag)
                }
              }}
            />
          ))}
        </tr>
      )}
    </thead>
  )
}
