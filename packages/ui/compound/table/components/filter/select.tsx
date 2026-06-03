import { Select } from "@/components/common/inputs/select";
import { FilterElementProps } from ".";
import { useLanguage } from "@/lib";

export default function FilterSelectElement(props: FilterElementProps) {
  const { t } = useLanguage();
  const { inputProps, ...rest } = props;
  return (
    <Select.Single
      {...rest}
      onChange={(e) => props.onChange && props.onChange(e as string)}
      value={props.defaultValue}
      label={t("common.choose")}
      labelType="simple"
      height={40}
      className={{
        wrapper: {
          body: "h-11 min-h-11 whitespace-nowrap",
        },
        trigger: {
          label: "p-2",
        },
      }}
    />
  );
}
