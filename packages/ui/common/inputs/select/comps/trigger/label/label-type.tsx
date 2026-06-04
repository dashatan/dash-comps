import { cn, createUUID } from "@/lib";
import { ClearButton } from "@/components/common/inputs/select/comps/trigger/clear-button";
import { TriggerActions } from "@/components/common/inputs/select/comps/trigger/label/trigger-actions";
import { LabelProps } from "@/components/common/inputs/select/comps/trigger/label/types";

export function LabelType({
  label,
  count,
  onClear,
  Icon,
  className,
  open,
  loading,
}: LabelProps) {
  const id = createUUID();

  return (
    <>
      <span
        id={`${id}-trigger-label`}
        className={cn(
          "text-sm font-medium text-foreground",
          className?.trigger?.label,
        )}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        <ClearButton count={count} onClear={onClear} />
        <TriggerActions open={open} Icon={Icon} loading={loading} />
      </div>
    </>
  );
}
