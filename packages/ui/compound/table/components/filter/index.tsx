import FilterTextElement from './text'
import FilterSelectElement from './select'
import FilterMultiSelectElement from './multi-select'
import FilterDateElement from './date'
import FilterPlateElement from './plate'
import FilterTreeMultiSelectElement from './tree-multi-select'
import FilterNumberRangeElement from './number-range'
import { FilterValue } from '../../types'
import { SelectItem } from '@/components/common/inputs/select/types'

const filterElements = {
  '': undefined,
  text: FilterTextElement,
  'number-range': FilterNumberRangeElement,
  date: FilterDateElement,
  select: FilterSelectElement,
  'multi-select': FilterMultiSelectElement,
  tree: FilterTreeMultiSelectElement,
  plate: FilterPlateElement,
}

export type FilterElementsKeys = keyof typeof filterElements
export type FilterElementProps = {
  onChange?: (value: FilterValue) => void
  options?: SelectItem[]
  defaultValue?: FilterValue
  className?: unknown
  inputProps?: Record<string, unknown>
}

/** Shared control height for every filter row input. */
export const FILTER_ROW_CONTROL_HEIGHT = 'h-10 min-h-10'

export default filterElements
