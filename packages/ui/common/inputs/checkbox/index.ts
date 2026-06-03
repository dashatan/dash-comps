import BasicCheckbox, { BasicCheckboxProps } from './basic'
import LabeledCheckbox, { LabeledCheckboxProps } from './labeled'
import CardCheckbox, { CardCheckboxProps } from './card'

export namespace Checkbox {
  export const Basic = BasicCheckbox
  export const Labeled = LabeledCheckbox
  export const Card = CardCheckbox
}

export type { BasicCheckboxProps } from './basic'
export type { LabeledCheckboxProps } from './labeled'
export type { CardCheckboxProps } from './card'

export default LabeledCheckbox

export type CheckboxProps = BasicCheckboxProps | LabeledCheckboxProps | CardCheckboxProps
