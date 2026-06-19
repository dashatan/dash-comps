import { ColumnProps } from '../types'

/**
 * Partitions columns into fixed (no field, e.g. checkbox/actions) and data (with field).
 * Preserves original order within each group.
 */
function partitionColumns(columns: ColumnProps[]) {
  const fixed: ColumnProps[] = []
  const dataByField = new Map<string, ColumnProps>()
  const dataOrder: string[] = []

  for (const col of columns) {
    if (!col.field) {
      fixed.push(col)
    } else {
      dataByField.set(col.field, col)
      dataOrder.push(col.field)
    }
  }

  return { fixed, dataByField, dataOrder }
}

/**
 * Returns columns reordered to match `ordered` (active column field names).
 * - Fixed columns (no field) keep their positions.
 * - Data columns are shown only if in `ordered`, in that order.
 * - Slots that had data but are missing from `ordered` are omitted.
 */
export default function orderColumns(columns: ColumnProps[], ordered: string[]): ColumnProps[] {
  if (!columns.length) return []

  const { fixed, dataByField } = partitionColumns(columns)
  const orderedDataColumns = ordered
    .map((field) => dataByField.get(field))
    .filter(Boolean) as ColumnProps[]

  let fixedIndex = 0
  let dataIndex = 0
  const result: ColumnProps[] = []

  for (const col of columns) {
    if (!col.field) {
      result.push(fixed[fixedIndex++])
    } else {
      const dataCol = orderedDataColumns[dataIndex++]
      if (dataCol) result.push(dataCol)
    }
  }

  return result
}

/**
 * Same as orderColumns but never hides columns: data columns not in `ordered`
 * are appended after the ordered ones (within their slot group).
 */
export function orderColumnsWithoutHide(columns: ColumnProps[], ordered: string[]): ColumnProps[] {
  if (!columns.length) return []

  const { fixed, dataByField, dataOrder } = partitionColumns(columns)
  const orderedSet = new Set(ordered)
  const orderedDataColumns = ordered
    .map((field) => dataByField.get(field))
    .filter(Boolean) as ColumnProps[]
  const restDataColumns = dataOrder
    .filter((field) => !orderedSet.has(field))
    .map((field) => dataByField.get(field)!) as ColumnProps[]
  const allDataColumns = [...orderedDataColumns, ...restDataColumns]

  let fixedIndex = 0
  let dataIndex = 0
  const result: ColumnProps[] = []

  for (const col of columns) {
    if (!col.field) {
      result.push(fixed[fixedIndex++])
    } else {
      const dataCol = allDataColumns[dataIndex++]
      if (dataCol) result.push(dataCol)
    }
  }

  return result
}
