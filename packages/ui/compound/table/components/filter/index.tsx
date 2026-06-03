import FilterTextElement from './text'
import FilterSelectElement from './select'
import FilterMultiSelectElement from './multi-select'
import FilterDateElement from './date'
import FilterPlateElement from './plate'
import FilterTreeMultiSelectElement from './tree-multi-select'
import FilterNumberRangeElement from '@/components/compound/table/components/filter/number-range'
import { FilterValue } from '@/components/compound/table/types'
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
export interface FilterElementProps {
  onChange?: (value: FilterValue) => void
  options?: SelectItem[]
  defaultValue?: FilterValue
  className?: any
  inputProps?: any
}

export default filterElements
