import { FilterElementsKeys } from './components/filter'
import { ActionHeaderProps } from './components/header/action-header'
import { ActionFiltersProps } from './components/header/action-filters'
import { TableRowProps } from './components/body/table-row'
import { THProps } from './components/header/TH'
import { TDProps } from './components/body/TD'
import { SelectItem } from '@/components/common/inputs/select/types'
import { ReactElement } from 'react'
import type { CarPlateInputValue, PlateValue } from '@/components/compound/license-plate/types'
import type { TableStoreApi } from './store'

export const tableDefaultState: TableData = {
  rows: 15,
  page: 0,
  offset: 0,
  limit: 15,
  first: 1,
  expandedRows: {},
  totalRecords: 0,
  selected: [],
  selectAll: false,
  showFilter: false,
  showFilterChips: false,
}

export type TableProps = {
  columns?: ColumnProps[]
  data?: Record<string, unknown>[]
  defaultValues?: TableData
  loading?: boolean
  showActionHeader?: boolean
  showActionFilters?: boolean
  expandOnNewRow?: boolean
  totalSelected?: number
  totalRecords?: number
  dataKey?: string | number
  draggable?: boolean
  columnHover?: boolean
  fullScreen?: boolean
  actionHeaderProps?: Partial<ActionHeaderProps>
  actionFilterProps?: Partial<ActionFiltersProps>
  THProps?: Partial<THProps>
  TDProps?: Partial<TDProps>
  rowProps?: Partial<TableRowProps>
  className?: { table?: string; l1?: string; l2?: string; l3?: string }
  onTableChange?: (data: TableData | { [key: string]: string }, tag: ChangeTag) => void
  rowExpansionTemplate?: (data: Record<string, unknown>) => React.ReactNode
  sidePanelTemplate?: (data: Record<string, unknown>) => React.ReactNode
  rightClickMenu?: (data: Record<string, unknown>) => React.ReactNode
}

export type ColumnBodyOptions = {
  column: ColumnProps
  field: string
  rowIndex: number
  props?: Record<string, unknown>
  frozenRow?: boolean
}

export type ColumnOption<T> = {
  column: Column<T>
  field: keyof T
  rowIndex: number
  props?: T
  frozenRow?: boolean
}

export type BodyElementProps = {
  data?: Record<string, unknown>
  options?: ColumnBodyOptions
}

export type ColumnProps = {
  id?: string | number
  field?: string
  style?: React.CSSProperties
  width?: number | string
  maxWidth?: number | string
  className?: string
  headerClassName?: THProps['className']
  bodyClassName?: TDProps['className']
  sortable?: boolean
  defaultInactive?: boolean
  noDebounce?: boolean
  filter?: boolean
  filterProps?: Record<string, unknown>
  filterOptions?: SelectItem[]
  filterClassName?: string | object
  filterElement?: React.ReactNode
  filterChips?: (value?: FilterValue) => React.ReactNode
  filterChipsLabel?: string
  filterElementType?: FilterElementsKeys
  filterKey?: string
  header?: string | React.ReactNode | ((data: unknown, options: ColumnBodyOptions) => React.ReactNode)
  body?: React.ReactNode | ((data: Record<string, unknown>, options: ColumnBodyOptions) => React.ReactNode)
  bodyElement?: (props: BodyElementProps) => ReactElement
  onFilterChange?: (value: FilterValue) => void
  frozen?: {
    distance: number
    pos: 'left' | 'right'
  }
  excludeExpand?: {
    pos: 'left' | 'right'
  }
}

export type Column<T> = Omit<ColumnProps, 'field' | 'body' | 'header'> & {
  field?: keyof T
  body?: (props: T) => React.ReactNode
  header?: string | React.ReactNode | ((data: unknown, options: ColumnBodyOptions) => React.ReactNode)
}

/* --------------------------------- Filter --------------------------------- */
export type NumberRangeFilterValue = [number | undefined, number | undefined]

export type FilterValue =
  | string
  | number
  | boolean
  | (string | number)[]
  | NumberRangeFilterValue
  | CarPlateInputValue
  | PlateValue
  | undefined

export type TableData = {
  first?: number
  rows?: number
  offset?: number
  page?: number
  totalRecords?: number
  selected?: (string | number)[]
  selectAll?: boolean
  sortField?: string
  sortOrder?: 1 | 0 | -1 | null
  searchField?: string
  searchText?: string
  showFilter?: boolean
  showFilterChips?: boolean
  activeColumns?: string[]
  filters?: { [key: string]: FilterValue | undefined }
  expandedRows?: Record<string | number, boolean>
  sidePanelData?: Record<string, unknown>
  limit?: number
}

export type ChangeTag = 'order' | 'sort' | 'filter' | 'pagination' | 'rows' | 'selection' | 'loading'

export type { TableStoreApi }
