import { ColumnProps } from '@/components/compound/table/types'

export default function orderColumns(columns: ColumnProps[], ordered: string[]) {
  let index = 0
  const newColumns = columns.flatMap((col) => {
    if (!col.field) {
      index--
      return col
    }
    index++
    const field = ordered[index]
    if (!field) return []
    const column = columns.find((x) => x.field === field)
    if (!column) return []
    return column
  })
  return newColumns
}

export function orderColumnsWithoutHide(columns: ColumnProps[], ordered: string[]) {
  let index = 0
  const newColumns = columns.flatMap((col) => {
    if (!col.field) {
      index--
      return col
    }
    if (!ordered.includes(col.field)) return col
    index++
    const field = ordered[index]
    const column = columns.find((x) => x.field === field)
    if (!column) return col
    return column
  })
  return newColumns
}
