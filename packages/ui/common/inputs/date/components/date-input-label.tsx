import type { ReactNode } from "react";
import type { DateObject } from "react-multi-date-picker";
import { cn, formatPersianDate, formatPersianTime, type Translation } from "@/lib";
import { Calendar as LucideCalendar, X } from "lucide-react";
import Chip from "@/components/common/chips/chip";
import type { DateInputProps, DatePreset, ItemProps } from "../types";

export type DateInputLabelProps = {
  label: string;
  icon?: ReactNode;
  inputProps: DateInputProps;
  t: Translation;
  dateObjects: DateObject[];
  withTime?: boolean;
  withPreset?: boolean;
  activePreset: string | null;
  presets: DatePreset[];
  handleClear: (withSubmit?: boolean) => void;
};

export function DateInputLabel({
  label,
  icon,
  inputProps,
  t,
  dateObjects,
  withTime,
  withPreset,
  activePreset,
  presets,
  handleClear,
}: DateInputLabelProps) {
  if (inputProps.oneLineLabel) {
    return (
      <OneLineLabel
        label={label}
        inputProps={inputProps}
        t={t}
        dateObjects={dateObjects}
        withTime={withTime}
        withPreset={withPreset}
        activePreset={activePreset}
        presets={presets}
        handleClear={handleClear}
      />
    );
  }

  return (
    <MultiLineLabel label={label} icon={icon} inputProps={inputProps} t={t} />
  );
}

type OneLineLabelProps = Omit<DateInputLabelProps, "icon">;

function OneLineLabel({
  label,
  inputProps,
  t,
  dateObjects,
  withTime,
  withPreset,
  activePreset,
  presets,
  handleClear,
}: OneLineLabelProps) {
  const labelId = inputProps.id || "date-input";
  const hasValue = dateObjects[0] || dateObjects[1];
  const dates = dateObjects.map((x) => formatPersianDate(x.toDate().getTime()));
  const times = dateObjects.map((x) => formatPersianTime(x.toDate().getTime(), true));
  const preset =
    !!withPreset && presets.find((p) => p.key === activePreset)?.label;

  if (inputProps.forceLabel) {
    return (
      <div
        id={`${labelId}-one-line`}
        onClick={() => {}}
        className={cn(
          "flex h-14 w-full cursor-pointer items-center justify-start px-4 text-sm font-medium",
          inputProps.className?.input,
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
          {inputProps.forceLabel}
        </span>
        {hasValue && !inputProps.withoutClear ? (
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
          inputProps.icon || <LucideCalendar className="ms-auto" />
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
        inputProps.className?.input,
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
        {inputProps.range ? (
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
      {hasValue && !inputProps.withoutClear ? (
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
        inputProps.icon || <LucideCalendar className="ms-auto" />
      )}
    </div>
  );
}

function MultiLineLabel({
  label,
  icon,
  inputProps,
  t,
}: Pick<DateInputLabelProps, "label" | "icon" | "inputProps" | "t">) {
  const dates = inputProps.value?.map((x) => formatPersianDate(x)) || [];
  const times = inputProps.value?.map((x) => formatPersianTime(x, true)) || [];
  if (!dates.length) {
    return <EmptyLabel label={label} icon={icon} inputProps={inputProps} />;
  }
  return (
    <LabelContent dates={dates} times={times} inputProps={inputProps} t={t} />
  );
}

function EmptyLabel({
  label,
  icon,
  inputProps,
}: Pick<DateInputLabelProps, "label" | "icon" | "inputProps">) {
  const labelId = inputProps.id || "date-input";

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
  inputProps,
  t,
}: {
  dates: string[];
  times: string[];
  inputProps: DateInputProps;
  t: Translation;
}) {
  if (!inputProps.range && dates[0]) {
    return (
      <SingleDateContent dates={dates} times={times} inputProps={inputProps} t={t} />
    );
  }

  if (inputProps.range && !inputProps.withTime && dates[0]) {
    return <RangeDateContent dates={dates} t={t} />;
  }

  if (inputProps.range && inputProps.withTime) {
    return <RangeDateTimeContent dates={dates} times={times} t={t} />;
  }

  return null;
}

function SingleDateContent({
  dates,
  times,
  inputProps,
  t,
}: {
  dates: string[];
  times: string[];
  inputProps: DateInputProps;
  t: Translation;
}) {
  return (
    <div
      className={cn("flex w-full items-stretch justify-between", {
        "[&>div:first-child]:border-e": inputProps.withTime,
      })}
    >
      <Item label={t("common.date")} value={dates[0]} />
      {inputProps.withTime && <Item label={t("common.time")} value={times[0]} />}
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
