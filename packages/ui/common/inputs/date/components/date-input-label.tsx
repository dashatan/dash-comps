import { cn, formatPersianDateTime, PERSIAN_LOCALE, Translation } from "@/lib";
import { Calendar as LucideCalendar, X } from "lucide-react";
import { ItemProps } from "../types";
import { useDateInputContext } from "../context";
import { formatPersianDate, formatPersianTime } from "@/lib";
import Button from "@/components/common/buttons";
import Chip from "@/components/common/chips/chip";

export function DateInputLabel({
  label,
  icon,
}: {
  label: string;
  icon?: React.ReactNode;
}) {
  const { props } = useDateInputContext();

  if (props.oneLineLabel) {
    return <OneLineLabel label={label} />;
  }

  return <MultiLineLabel label={label} icon={icon} />;
}

function OneLineLabel({ label }: { label: string }) {
  const {
    handleClear,
    props,
    t,
    withTime,
    dateObjects,
    withPreset,
    activePreset,
    presets,
  } = useDateInputContext();
  const labelId = props.id || "date-input";
  const hasValue = dateObjects[0] || dateObjects[1];
  const dates = dateObjects.map((x) => formatPersianDate(x.toDate().getTime()));
  const times = dateObjects.map((x) => formatPersianTime(x.toDate().getTime(), true));
  const preset = !!withPreset && presets.find((p) => p.key === activePreset)?.label;

  if (props.forceLabel) {
    return (
      <div
        id={`${labelId}-one-line`}
        onClick={() => {}}
        className={cn(
          "flex h-14 w-full cursor-pointer items-center justify-start px-4 text-sm font-medium",
          props.className?.input,
        )}
      >
        <span
          className={cn("text-hint absolute text-xs transition-all", {
            "-translate-y-3.5": hasValue,
          })}
        >
          {label}
        </span>
        <span className="mt-3 overflow-hidden text-ellipsis whitespace-nowrap">
          {props.forceLabel}
        </span>
        {hasValue && !props.withoutClear ? (
          <div
            id={`${labelId}-clear-button`}
            className="hover:bg-input-accent absolute left-1 rounded-full p-1 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleClear(true);
            }}
          >
            <X className="scale-75" />
          </div>
        ) : (
          props.icon || <LucideCalendar className="ms-auto" />
        )}
      </div>
    );
  }

  return (
    <div
      id={`${labelId}-one-line`}
      onClick={() => {}}
      className={cn(
        "flex h-14 w-full cursor-pointer items-center justify-start px-4 text-sm font-medium",
        props.className?.input,
      )}
    >
      <span
        className={cn("absolute flex items-center gap-3 transition-all", {
          "text-input-foreground/50 -translate-y-3.5 text-sm": hasValue,
        })}
      >
        {label}
        {withTime && preset && (
          <Chip className="bg-primary/20 text-primary h-5 min-h-5 rounded-full px-3">
            {preset}
          </Chip>
        )}
      </span>
      <span className="mt-4 flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {!withTime && preset && (
          <Chip className="bg-primary/20 text-primary me-2 h-5 min-h-5 rounded-full px-3">
            {preset}
          </Chip>
        )}
        {props.range ? (
          <>
            <span>{t("common.from")}:</span>
            {withTime && <span dir="ltr">{times[0]}</span>}
            <span dir="ltr">{dates[0]}</span>
            <span>-</span>
            <span>{t("common.to")}:</span>
            {withTime && <span dir="ltr">{times[1]}</span>}
            <span dir="ltr">{dates[1]}</span>
          </>
        ) : (
          <>
            {withTime && <span dir="ltr">{times[0]}</span>}
            <span dir="ltr">{dates[0]}</span>
          </>
        )}
      </span>
      {hasValue && !props.withoutClear ? (
        <div
          id={`${labelId}-clear-button`}
          className="hover:bg-input-accent absolute left-1 rounded-full p-1 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            handleClear(true);
          }}
        >
          <X className="scale-75" />
        </div>
      ) : (
        props.icon || <LucideCalendar className="ms-auto" />
      )}
    </div>
  );
}

function MultiLineLabel({ label, icon }: { label: string; icon?: React.ReactNode }) {
  const { props, t } = useDateInputContext();
  const dates = props.value?.map((x: number) => formatPersianDate(x)) || [];
  const times = props.value?.map((x: number) => formatPersianTime(x, true)) || [];
  if (!dates.length) return <EmptyLabel label={label} icon={icon} />;
  return <LabelContent dates={dates} times={times} props={props} t={t} />;
}

function EmptyLabel({ label, icon }: { label: string; icon?: React.ReactNode }) {
  const { props } = useDateInputContext();
  const labelId = props.id || "date-input";

  return (
    <div
      id={`${labelId}-empty-label`}
      className="flex w-full items-center justify-start px-4 text-sm"
    >
      <span>{label}</span>
      {icon || <LucideCalendar size={16} className="ms-auto" />}
    </div>
  );
}

function LabelContent({
  dates,
  times,
  props,
  t,
}: {
  dates: string[];
  times: string[];
  props: any;
  t: Translation;
}) {
  if (!props.range && dates[0]) {
    return <SingleDateContent dates={dates} times={times} props={props} t={t} />;
  }

  if (props.range && !props.withTime && dates[0]) {
    return <RangeDateContent dates={dates} t={t} />;
  }

  if (props.range && props.withTime) {
    return <RangeDateTimeContent dates={dates} times={times} t={t} />;
  }

  return null;
}

function SingleDateContent({
  dates,
  times,
  props,
  t,
}: {
  dates: string[];
  times: string[];
  props: any;
  t: Translation;
}) {
  return (
    <div
      className={cn("flex w-full items-stretch justify-between", {
        "[&>div:first-child]:border-e": props.withTime,
      })}
    >
      <Item label={t("common.date")} value={dates[0]} />
      {props.withTime && <Item label={t("common.time")} value={times[0]} />}
    </div>
  );
}

function RangeDateContent({ dates, t }: { dates: string[]; t: Translation }) {
  return (
    <div className="flex w-full items-stretch justify-between [&>div:first-child]:border-l">
      <Item label={t("common.fromDate")} value={dates[0]} />
      <Item label={t("common.toDate")} value={dates[1]} />
    </div>
  );
}

function RangeDateTimeContent({
  dates,
  times,
  t,
}: {
  dates: string[];
  times: string[];
  t: Translation;
}) {
  return (
    <div className="flex w-full items-stretch justify-between [&>div:first-child]:border-l">
      <Item
        label={t("common.fromDate")}
        value={<DateValue date={dates[0]} time={times[0]} />}
      />
      <Item
        label={t("common.toDate")}
        value={<DateValue date={dates[1]} time={times[1]} />}
      />
    </div>
  );
}

function DateValue({ date, time }: { date: string; time: string }) {
  if (!date || !time) return null;
  return (
    <div className="dir-ltr flex w-fit gap-1">
      <span>{date}</span>
      <span>{time}</span>
    </div>
  );
}

function Item({ label, value }: ItemProps) {
  return (
    <div className="flex h-14 w-full flex-col justify-center gap-1 px-4">
      <span className="text-xs">{label}</span>
      <span className="text-base font-medium">{value}</span>
    </div>
  );
}
