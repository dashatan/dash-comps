import filterElements from '@/components/compound/table/components/filter'
import { ChangeTag, ColumnProps, FilterValue, TableData } from '@/components/compound/table/types'
import { cn } from '@/lib'
import React, { memo, useCallback, useMemo } from 'react'

export interface FilterProps {
  col: ColumnProps
  values?: TableData
  onchange: (values: TableData, tag: ChangeTag) => void
  loading?: boolean
}

const Filter: React.FC<FilterProps> = memo(({ col, values = {}, onchange, loading = false }) => {
  // Memoize derived values for performance
  const filters = values.filters
  const key = useMemo(() => col.filterKey || col.field, [col.filterKey, col.field])
  const value = useMemo(() => (filters && key && filters[key] ? filters[key] : undefined), [filters, key])
  const type = useMemo(() => col.filterElementType || '', [col.filterElementType])
  const options = col.filterOptions
  const FilterEl = useMemo(() => filterElements[type], [type])

  // Memoized change handler
  const handleChange = useCallback(
    (value: FilterValue) => {
      if (loading || !key) return
      const newFilters = { ...filters, [key]: value || undefined }
      onchange({ ...values, filters: newFilters }, 'filter')
      if (col.onFilterChange) col.onFilterChange(value)
    },
    [filters, loading, key, onchange, values, col]
  )

  return (
    <th
      style={{
        ...col.style,
        ...(col.frozen && { position: 'sticky', [col.frozen.pos]: col.frozen.distance, zIndex: 2 }),
      }}
      className={cn('border-b p-2')}
    >
      {/* Prefer custom filter element if provided */}
      {col.filterElement ? (
        col.filterElement
      ) : FilterEl ? (
        <FilterEl
          onChange={handleChange}
          defaultValue={value}
          options={options}
          className={col.filterClassName}
          inputProps={{ disabled: loading, ...col.filterProps }}
        />
      ) : null}
    </th>
  )
})

Filter.displayName = 'Filter'

export { Filter }
