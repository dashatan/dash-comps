import type { NumberRangeFilterValue, TableData } from '@/components/compound/table/types'
import type { ColorType } from '@/components/common/badge/color'

export type FleetVehicleRow = {
  id: number
  plate: string
  driver: string
  status: 'active' | 'pending' | 'inactive' | 'maintenance'
  region: string
  department: string
  mileage: number
  fuelLevel: number
  lastServiceAt: number
  registeredAt: number
  notes: string
  color: ColorType
  category: string
  contractEnd: number
  gpsEnabled: boolean
  assignedRoute: string
}

export const TABLE_ROW_COUNT = 1247

export const TABLE_REGIONS = [
  'Tehran',
  'Isfahan',
  'Shiraz',
  'Tabriz',
  'Mashhad',
  'Ahvaz',
  'Kerman',
  'Yazd',
] as const

export const TABLE_DEPARTMENTS = [
  'Logistics',
  'Operations',
  'Sales',
  'Support',
  'Finance',
] as const

export const TABLE_STATUSES = ['active', 'pending', 'inactive', 'maintenance'] as const

export const TABLE_CATEGORIES = ['sedan', 'van', 'truck', 'motorcycle', 'bus'] as const

const STATUS_CYCLE = TABLE_STATUSES
const REGION_CYCLE = TABLE_REGIONS
const DEPT_CYCLE = TABLE_DEPARTMENTS
const CATEGORY_CYCLE = TABLE_CATEGORIES
const COLOR_CYCLE: ColorType[] = ['green', 'yellow', 'red', 'blue', 'teal', 'orange', 'indigo', 'gray']

const ROUTE_PREFIXES = [
  'North ring express',
  'Industrial zone loop',
  'City center shuttle',
  'Port warehouse link',
  'Airport transfer corridor',
  'Suburban delivery arc',
] as const

function daysAgo(days: number): number {
  return Date.now() - days * 86_400_000
}

function buildRow(id: number): FleetVehicleRow {
  const status = STATUS_CYCLE[id % STATUS_CYCLE.length]
  const region = REGION_CYCLE[id % REGION_CYCLE.length]
  const department = DEPT_CYCLE[id % DEPT_CYCLE.length]
  const category = CATEGORY_CYCLE[id % CATEGORY_CYCLE.length]
  const route = ROUTE_PREFIXES[id % ROUTE_PREFIXES.length]

  return {
    id,
    plate: `${String.fromCharCode(65 + (id % 26))}${String.fromCharCode(65 + ((id * 3) % 26))}-${1000 + (id % 9000)}`,
    driver: `Driver ${id}`,
    status,
    region,
    department,
    mileage: 12_000 + (id % 480) * 250,
    fuelLevel: 15 + (id % 85),
    lastServiceAt: daysAgo(10 + (id % 120)),
    registeredAt: daysAgo(400 + (id % 900)),
    notes: `Fleet unit #${id} — ${category} assigned to ${department.toLowerCase()} ops in ${region}.`,
    color: COLOR_CYCLE[id % COLOR_CYCLE.length],
    category,
    contractEnd: daysAgo(-(30 + (id % 720))),
    gpsEnabled: id % 4 !== 0,
    assignedRoute: `${route} via ${region} sector ${(id % 12) + 1} — daily manifest ${id}`,
  }
}

export const TABLE_ALL_ROWS: FleetVehicleRow[] = Array.from({ length: TABLE_ROW_COUNT }, (_, i) =>
  buildRow(i + 1),
)

function asNumberRange(value: unknown): NumberRangeFilterValue | undefined {
  if (!Array.isArray(value)) return undefined
  return [value[0] as number | undefined, value[1] as number | undefined]
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') return [value]
  return []
}

export function filterAndSortTableRows(rows: FleetVehicleRow[], state: TableData): FleetVehicleRow[] {
  let result = [...rows]

  const driver = state.filters?.driver as string | undefined
  if (driver?.trim()) {
    const q = driver.trim().toLowerCase()
    result = result.filter((r) => r.driver.toLowerCase().includes(q))
  }

  const status = state.filters?.status as string | undefined
  if (status) {
    result = result.filter((r) => r.status === status)
  }

  const regions = asStringArray(state.filters?.region)
  if (regions.length) {
    result = result.filter((r) => regions.includes(r.region))
  }

  const department = state.filters?.department as string | undefined
  if (department) {
    result = result.filter((r) => r.department === department)
  }

  const mileageRange = asNumberRange(state.filters?.mileage)
  if (mileageRange) {
    const [min, max] = mileageRange
    if (min !== undefined) result = result.filter((r) => r.mileage >= min)
    if (max !== undefined) result = result.filter((r) => r.mileage <= max)
  }

  const serviceAfter = state.filters?.lastServiceAt as number | number[] | undefined
  if (serviceAfter !== undefined) {
    const ts = Array.isArray(serviceAfter) ? serviceAfter[0] : serviceAfter
    if (typeof ts === 'number') {
      result = result.filter((r) => r.lastServiceAt >= ts)
    }
  }

  const sortField = state.sortField
  const sortOrder = state.sortOrder
  if (sortField && sortOrder) {
    const dir = sortOrder === 1 ? 1 : -1
    result.sort((a, b) => {
      switch (sortField) {
        case 'id':
          return (a.id - b.id) * dir
        case 'driver':
          return a.driver.localeCompare(b.driver) * dir
        case 'mileage':
          return (a.mileage - b.mileage) * dir
        case 'registeredAt':
          return (a.registeredAt - b.registeredAt) * dir
        case 'fuelLevel':
          return (a.fuelLevel - b.fuelLevel) * dir
        default:
          return 0
      }
    })
  }

  return result
}

export function paginateTableRows(rows: FleetVehicleRow[], state: TableData): FleetVehicleRow[] {
  const page = state.page ?? 0
  const rowsPerPage = state.rows ?? 15
  const start = page * rowsPerPage
  return rows.slice(start, start + rowsPerPage)
}
