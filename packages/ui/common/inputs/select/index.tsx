import MultiSelectOrderable from './multiple-orderable'
import MultiSelectTree from './multiple-tree'
import MultiSelect from './multiple'
import SingleSelect from './single'
import SingleSelectTree from './single-tree'

export namespace Select {
  export const Single = SingleSelect
  export const Multi = MultiSelect
  export const MultiTree = MultiSelectTree
  export const MultiOrderable = MultiSelectOrderable
  export const SingleTree = SingleSelectTree
}
