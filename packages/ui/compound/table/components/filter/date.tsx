import { DateInput } from '@/components/common/inputs/date'
import { FilterElementProps } from '.'

export default function FilterDateElement(props: FilterElementProps) {
  const { inputProps, ...rest } = props
  return (
    <DateInput
      oneLineLabel
      className={{ input: 'h-10' }}
      onChange={(value) => {
        value && props.onChange && props.onChange(value)
      }}
      value={props.defaultValue as number[]}
      labelContainerProps={{
        showMessage: false,
        className: {
          wrapper: {
            body: 'h-10 flex items-center min-w-36',
          },
          trigger: {
            container: 'h-10',
          },
        },
      }}
      {...rest}
    />
  )
}
