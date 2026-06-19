import type { FilterValue, NumberRangeFilterValue, TableData } from '../types'

function isNumberRange(value: FilterValue): value is NumberRangeFilterValue {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    (value[0] === undefined || typeof value[0] === 'number') &&
    (value[1] === undefined || typeof value[1] === 'number')
  )
}

export function normalizeFilterValue(
  value: FilterValue | undefined,
): FilterValue | undefined {
  if (value == null || value === '') return undefined

  if (isNumberRange(value)) {
    const [from, to] = value
    const hasFrom = from !== undefined && !Number.isNaN(from)
    const hasTo = to !== undefined && !Number.isNaN(to)
    if (!hasFrom && !hasTo) return undefined
    return [hasFrom ? from : undefined, hasTo ? to : undefined]
  }

  if (Array.isArray(value)) {
    return value.length === 0 ? undefined : value
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value).filter(
      ([, entry]) => entry != null && entry !== '',
    )
    return entries.length === 0 ? undefined : value
  }

  return value
}

export function isSameFilterValue(
  a: FilterValue | undefined,
  b: FilterValue | undefined,
): boolean {
  const left = normalizeFilterValue(a)
  const right = normalizeFilterValue(b)

  if (left === right) return true
  if (left === undefined || right === undefined) return false

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) return false
    return left.every((item, index) => item === right[index])
  }

  if (typeof left === 'object' && typeof right === 'object') {
    return JSON.stringify(left) === JSON.stringify(right)
  }

  return left === right
}

export function normalizeFilters(
  filters: TableData['filters'],
): NonNullable<TableData['filters']> {
  if (!filters) return {}

  return Object.entries(filters).reduce<NonNullable<TableData['filters']>>(
    (acc, [key, value]) => {
      const normalized = normalizeFilterValue(value)
      if (normalized !== undefined) {
        acc[key] = normalized
      }
      return acc
    },
    {},
  )
}

export function areFiltersEqual(
  a: TableData['filters'],
  b: TableData['filters'],
): boolean {
  const left = normalizeFilters(a)
  const right = normalizeFilters(b)
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)

  if (leftKeys.length !== rightKeys.length) return false

  return leftKeys.every((key) => isSameFilterValue(left[key], right[key]))
}
