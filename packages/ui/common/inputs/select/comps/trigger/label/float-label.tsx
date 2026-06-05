import { cn, createUUID, useLanguage } from "@/lib";
import { Fragment } from "react";
import { ClearButton } from "@/components/common/inputs/select/comps/trigger/clear-button";
import { TriggerActions } from "@/components/common/inputs/select/comps/trigger/label/trigger-actions";
import { LabelProps } from "@/components/common/inputs/select/comps/trigger/label/types";

export function FloatLabel({
  labelType,
  value,
  label,
  Icon,
  className,
  onClear,
  open,
  loading,
}: LabelProps) {
  const { t } = useLanguage();
  const count = Array.isArray(value) ? value.length : 0;
  const id = createUUID();

  return (
    <Fragment>
      <span
        id={`${id}-trigger-label`}
        className={cn(
          "flex h-full cursor-pointer items-center px-2 pt-4 text-sm text-foreground",
          { "pt-0!": !label },
          className?.trigger?.label,
        )}
      >
        {labelType === "count" && Array.isArray(value)
          ? t("common.selectedCount", { count: value.length })
          : value}
      </span>
      <div className="flex items-center gap-2">
        <ClearButton count={count} onClear={onClear} />
        <TriggerActions open={open} Icon={Icon} loading={loading} />
      </div>
    </Fragment>
  );
}
