import { cn } from "@/lib";
import LabelContainer from "@/components/common/inputs/label/labelContainer";
import { SelectTriggerTemplateProps } from "@/components/common/inputs/select/types";
import { Label } from "@/components/common/inputs/select/comps/trigger/label";
import { ChipsList } from "@/components/common/inputs/select/comps/trigger/chips-list";

export default function SelectTriggerTemplate(
  props: SelectTriggerTemplateProps,
) {
  const {
    value,
    labelType,
    showChips,
    className,
    message,
    status,
    label,
    chipsCountLimit = 5,
    chipRowsCount,
    chips,
    open,
    count,
    Icon,
    onClear,
    onRemove,
    withSelectAll,
    selectAllLabel,
    loading,
    ...restProps
  } = props;

  return (
    <LabelContainer
      {...restProps}
      message={message}
      showMessage={!!message}
      hasValue={!!value}
      status={status}
      fillType="stroke"
      className={{
        ...className,
        wrapper: {
          ...className?.wrapper,
          body: cn(
            "h-fit min-h-14 flex-col bg-input",
            className?.wrapper?.body,
          ),
        },
      }}
    >
      <Label
        labelType={labelType}
        value={value}
        label={label}
        open={open}
        Icon={Icon}
        count={count}
        onClear={onClear}
        withSelectAll={withSelectAll}
        selectAllLabel={selectAllLabel}
        loading={loading}
        className={{
          ...className,
          trigger: { label: "h-14 min-h-14", ...className?.trigger },
        }}
      />
      {showChips && !open && (
        <ChipsList
          chips={chips}
          chipsCountLimit={chipsCountLimit}
          chipRowsCount={chipRowsCount}
          onRemove={onRemove}
          className={className?.trigger?.chips}
        />
      )}
    </LabelContainer>
  );
}
