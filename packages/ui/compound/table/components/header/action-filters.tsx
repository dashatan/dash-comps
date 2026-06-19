import React, { useMemo, useCallback } from 'react'
import Chip from '@/components/common/chips/chip'
import { ColumnProps, FilterValue, TableProps } from '../../types'
import { useTableStore } from '../../context'

export type ActionFiltersProps = {
  columns?: ColumnProps[]
  onChange?: TableProps['onTableChange']
  excludes?: string[]
  sort?: string[]
  templates?: { name: string; template: (value?: FilterValue) => React.ReactNode }[]
}

export default function ActionFilters(props: ActionFiltersProps) {
  const { sort, excludes, templates, columns } = props
  const filters = useTableStore((s) => s.filters)
  const setFilters = useTableStore((s) => s.setFilters)

  const items = useMemo(() => {
    let keys = filters ? Object.keys(filters) : []
    if (sort) {
      keys = keys.sort((a, b) => (sort.includes(a) ? -1 : sort.includes(b) ? 1 : 0))
    }
    return keys
  }, [filters, sort])

  const handleRemove = useCallback(
    (x: string) => {
      if (!filters) return
      const newFilters = { ...filters, [x]: undefined }
      setFilters(newFilters)
    },
    [filters, setFilters],
  )

  const renderFilter = (x: string) => {
    if (!filters) return null
    const val = filters[x]
    if (!val || (excludes && excludes.includes(x))) return <React.Fragment key={x} />
    const col = columns?.find((y) => y.filterKey === x || y.field === x)
    const template = templates?.find((t) => t.name === x)
    if (col?.filterChips) {
      return <React.Fragment key={x}>{col.filterChips(val)}</React.Fragment>
    }
    if (template?.template) {
      return <React.Fragment key={x}>{template.template(val)}</React.Fragment>
    }
    const label = col?.filterChipsLabel || (col?.header as string)
    return (
      <Chip key={x} label={`${label ? label + ': ' : ''}${val}`} onRemove={() => handleRemove(x)} />
    )
  }

  return (
    <div className="flex min-h-[68px] w-full gap-2 overflow-x-auto border-b p-4">
      {filters && items.map(renderFilter)}
    </div>
  )
}
