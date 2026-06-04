import { cn, createUUID, useLanguage } from "@/lib";
import { TriggerActions } from "@/components/common/inputs/select/comps/trigger/label/trigger-actions";
import { LabelProps } from "@/components/common/inputs/select/comps/trigger/label/types";

export function SimpleLabel({
  value,
  label,
  open,
  className,
  withSelectAll,
  selectAllLabel,
  Icon,
  loading,
}: LabelProps) {
  const { t } = useLanguage();
  const id = createUUID();

  return (
    <div
      id={`${id}-trigger-label`}
      className={cn(
        "flex h-full w-full cursor-pointer items-center justify-between px-4 text-sm",
        className?.trigger?.label,
      )}
    >
      <div className="flex max-w-[calc(100%-2.5rem)] flex-col text-start">
        <span
          className={cn({
            "-translate-y-0.5 text-input-foreground/70 transition-all":
              !!value || withSelectAll,
          })}
        >
          {label}
        </span>
        <span className="overflow-hidden text-base text-ellipsis whitespace-nowrap">
          {withSelectAll && !value
            ? selectAllLabel || t("common.selectAll")
            : value}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <TriggerActions open={open} Icon={Icon} loading={loading} />
      </div>
    </div>
  );
}
