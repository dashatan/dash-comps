import { Select } from '@/components/common/inputs/select'
import { FilterElementProps } from '.'

export default function FilterMultiSelectElement(props: FilterElementProps) {
  const { inputProps, ...rest } = props
  return (
    <Select.Multi
      {...rest}
      className={{
        popoverTrigger: "w-full",
        container: "h-10",
        labelContent: "h-10 py-0 text-sm",
        wrapper: {
          body: "h-11 min-h-11 whitespace-nowrap",
        },
        trigger: {
          label: "gap-4 p-2 px-4",
        },
        ...props.className,
      }}
      onChange={(val) => {
        props.onChange && props.onChange(val);
      }}
      // label={t("common.choose")}
      options={props.options}
      selected={props.defaultValue as (string | number)[] | undefined}
      labelType="simple"
      fitContent
      filter
    />
  );
}
