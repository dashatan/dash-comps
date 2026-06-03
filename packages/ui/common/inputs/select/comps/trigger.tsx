import { cn, createUUID, useLanguage } from "@/lib";
import LabelContainer from "@/components/common/inputs/label/labelContainer";
import Badge from "@/components/common/badge/badge";
import { ChevronDown, Plus, X, XCircle } from "lucide-react";
import Chip from "@/components/common/chips/chip";
import { SelectItem, SelectTriggerTemplateProps } from "../types";
import { Fragment } from "react/jsx-runtime";

export default function SelectTriggerTemplate(props: SelectTriggerTemplateProps) {
  const {
    value,
    labelType,
    showChips,
    className,
    message,
    status,
    label,
    chipsCountLimit = 5,
    chips,
    open,
    count,
    Icon,
    onClear,
    onRemove,
    withSelectAll,
    selectAllLabel,
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
          body: cn("bg-input h-fit min-h-14 flex-col", className?.wrapper?.body),
        },
      }}
    >
      <Label
        {...{
          labelType,
          value,
          label,
          open,
          className,
          Icon,
          count,
          onClear,
          onRemove,
          withSelectAll,
          selectAllLabel,
        }}
        className={{
          ...className,
          trigger: { label: "h-14 min-h-14", ...className?.trigger },
        }}
      />
      {showChips && !open && (
        <ChipsList
          chips={chips}
          chipsCountLimit={chipsCountLimit}
          onRemove={onRemove}
          className={className?.trigger?.chips}
        />
      )}
    </LabelContainer>
  );
}

type ClearButtonProps = {
  count?: number;
  onClear?: () => void;
};

const ClearButton = ({ count, onClear }: ClearButtonProps) => {
  if (!count) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClear?.();
      }}
      role="button"
      aria-label="Clear selection"
    >
      <Badge withRing className="px-3">
        <X className="-mt-0.5 size-3" />
        <span>{count}</span>
      </Badge>
    </div>
  );
};

type ChipsListProps = {
  chips?: SelectTriggerTemplateProps["chips"];
  chipsCountLimit?: number;
  onRemove?: (option: SelectItem) => void;
  className?: {
    chip?: string;
    badge?: string;
  };
};

const ChipsList = ({
  chips,
  chipsCountLimit = 3,
  onRemove,
  className,
}: ChipsListProps) => {
  if (!chips?.length) return null;

  const visibleChips = chips.slice(0, chipsCountLimit);
  const remainingCount = chips.length - chipsCountLimit;

  return (
    <div className="border-border flex w-full cursor-default flex-wrap items-center gap-2 border-t px-4 py-2">
      {visibleChips.map((option, index) => (
        <Chip
          key={index}
          label={option.label}
          onRemove={() => onRemove?.(option)}
          aria-label={`Remove ${option.label}`}
          className={className?.chip}
        />
      ))}
      {remainingCount > 0 && (
        <Badge size="md" severity="info" className={className?.badge}>
          <div className="dir-ltr flex">
            <Plus className="text-primary w-3 min-w-3" />
            <span className="text-primary-foreground mt-[5.5px] text-xs">
              {remainingCount}
            </span>
          </div>
        </Badge>
      )}
    </div>
  );
};

type LabelProps = {
  value?: any;
  label?: string;
  open?: boolean;
  className?: any;
  Icon?: any;
  count?: number;
  onClear?: () => void;
  labelType?: string;
  withSelectAll?: boolean;
  selectAllLabel?: string;
};

function SimpleLabel({
  value,
  label,
  open,
  className,
  withSelectAll,
  selectAllLabel,
  Icon,
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
            "text-input-foreground/70 -translate-y-0.5 transition-all":
              !!value || withSelectAll,
          })}
        >
          {label}
        </span>
        <span className="overflow-hidden text-base text-ellipsis whitespace-nowrap">
          {withSelectAll && !value ? selectAllLabel || t("common.selectAll") : value}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {Icon || (
          <ChevronDown
            className={cn("size-5 transition-all", { "rotate-180": open })}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

function FloatLabel({
  labelType,
  value,
  label,
  Icon,
  className,
  onClear,
  open,
}: LabelProps) {
  const { t } = useLanguage();
  const count = Array.isArray(value) ? value.length : 0;
  const id = createUUID();
  return (
    <Fragment>
      <span
        id={`${id}-trigger-label`}
        className={cn(
          "text-foreground flex h-full cursor-pointer items-center px-2 pt-4 text-sm",
          { "pt-0!": !label },
          className?.trigger?.label,
        )}
      >
        {labelType === "count" && Array.isArray(value)
          ? t("common.selectedCount", { count: `${value.length}` })
          : value}
      </span>
      <div className="flex items-center gap-2">
        <ClearButton count={count} onClear={onClear} />
        {Icon || (
          <ChevronDown
            className={cn("size-5 transition-all", { "rotate-180": open })}
            aria-hidden="true"
          />
        )}
      </div>
    </Fragment>
  );
}

function LabelType({ label, count, onClear, Icon, className, open }: LabelProps) {
  const id = createUUID();
  return (
    <>
      <span
        id={`${id}-trigger-label`}
        className={cn("text-foreground text-sm font-medium", className?.trigger?.label)}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        <ClearButton count={count} onClear={onClear} />
        {Icon || (
          <ChevronDown
            className={cn("size-5 transition-all", { "rotate-180": open })}
            aria-hidden="true"
          />
        )}
      </div>
    </>
  );
}

function CountType({ count, className, label, open, onClear, Icon }: LabelProps) {
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
            "text-input-foreground/70 -translate-y-0.5 transition-all": !!count,
          })}
        >
          {label}
        </span>
        <span className="overflow-hidden text-base text-ellipsis whitespace-nowrap">
          {count ? t("common.selectedCount", { count: `${count}` }) : ""}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {onClear ? <ClearButton count={count} onClear={onClear} /> : null}
        {Icon || (
          <ChevronDown
            className={cn("ms-auto size-5 transition-all", { "rotate-180": open })}
          />
        )}
      </div>
    </div>
  );
}

function Label(props: LabelProps) {
  const { labelType, ...rest } = props;
  const labels = {
    simple: <SimpleLabel {...rest} />,
    float: <FloatLabel {...props} />,
    count: <CountType {...rest} />,
    label: <LabelType {...rest} />,
  };

  return labels[labelType as keyof typeof labels] || <SimpleLabel {...rest} />;
}
