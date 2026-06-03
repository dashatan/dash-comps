import BasicTextInput from '@/components/common/inputs/text/basic'
import { FilterElementProps } from '.'
import { cn } from '@/lib'

export default function FilterTextElement(props: FilterElementProps) {
  const { inputProps, ...rest } = props
  return (
    <BasicTextInput
      {...rest}
      className={cn(
        'ring-offset-table-background h-10 rounded-lg border px-4 transition-all',
        'focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none'
      )}
      onChange={(e) => {
        props.onChange && props.onChange(e.target.value)
      }}
      value={props.defaultValue as string}
      defaultValue={props.defaultValue as string}
    />
  )
}
