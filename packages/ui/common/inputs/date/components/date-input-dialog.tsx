import { useCallback, useMemo } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import persian_fa from "react-date-object/locales/persian_fa";
import arabic_fa from "react-date-object/locales/arabic_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";
import arabic from "react-date-object/calendars/arabic";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";

import { clearTime, cn, isInAllowedLimitedRange, useLanguage } from "@/lib";
import ChipSelect from "@/components/common/chips/chip-select";
import TimePicker, { TimeObject } from "./time-picker";
import { Divider } from "@/components/common/divider";
import type { DateInputViewProps } from "../types";

export function DateInputDialog({
  inputProps,
  dateObjects,
  times,
  activePreset,
  calendarKey,
  presets,
  minDate,
  maxDate,
  setTimes,
  handleDateChange,
  handlePreset,
  t,
}: DateInputViewProps) {
  const dialogId = inputProps.id || "date-input";
  const { language } = useLanguage();

  const calendar = useMemo(() => {
    if (language === "fa") return persian;
    if (language === "ar") return arabic;
    return gregorian;
  }, [language]);

  const locale = useMemo(() => {
    if (language === "fa") return persian_fa;
    if (language === "ar") return arabic_fa;
    return gregorian_en;
  }, [language]);

  const mapDays = useCallback(
    ({
      date,
      currentMonth,
      isSameDate,
    }: {
      date: DateObject;
      currentMonth: DateObject["month"];
      isSameDate: (left: DateObject, right: DateObject) => boolean;
    }) => {
      const allowed =
        !inputProps.limitedRange ||
        isInAllowedLimitedRange(date, inputProps.limitedRange);
      const serverToday = new DateObject({
        date: clearTime(),
        locale,
        calendar,
      });
      const isServerToday =
        serverToday != null && isSameDate(date, serverToday);
      const isServerMonth =
        serverToday != null &&
        date.year === serverToday.year &&
        date.month.number === serverToday.month.number &&
        date.month.index !== currentMonth.index;

      if (!allowed) {
        return {
          disabled: true,
          style: {
            cursor: "not-allowed",
          },
        };
      }

      if (isServerToday || isServerMonth) {
        return { className: "rmdp-today" };
      }

      return { disabled: false };
    },
    [inputProps.limitedRange, calendar, locale],
  );

  return (
    <div className="flex h-fit w-fit flex-col items-center overflow-auto">
      <div
        className={cn(
          "flex flex-full flex-col items-center justify-center",
          inputProps.className?.content,
        )}
      >
        <div id={`${dialogId}-calendar-container`} style={{ minHeight: 420 }}>
          <Calendar
            key={`${calendarKey}`}
            range={inputProps.range}
            multiple={inputProps.multiple}
            disabled={inputProps.disabled}
            value={
              dateObjects.length
                ? inputProps.range || inputProps.multiple
                  ? (dateObjects as DateObject[])
                  : (dateObjects[0] as DateObject)
                : null
            }
            onChange={handleDateChange}
            calendar={calendar}
            locale={locale}
            highlightToday={false}
            currentDate={
              dateObjects[0] ||
              new DateObject({ date: clearTime(), locale, calendar })
            }
            className={cn("shadow-none!", inputProps.className?.calendar)}
            monthYearSeparator=","
            weekDays={[
              t("date.saturday"),
              t("date.sunday"),
              t("date.monday"),
              t("date.tuesday"),
              t("date.wednesday"),
              t("date.thursday"),
              t("date.friday"),
            ]}
            mapDays={mapDays}
            minDate={minDate ? new DateObject(minDate) : undefined}
            maxDate={maxDate ? new DateObject(maxDate) : undefined}
          />
        </div>

        {inputProps.withTime && !inputProps.range && (
          <TimeSection
            dialogId={dialogId}
            t={t}
            times={times}
            setTimes={setTimes}
          />
        )}
        {inputProps.withTime && inputProps.range && (
          <RangeTimeSection
            dialogId={dialogId}
            t={t}
            times={times}
            setTimes={setTimes}
          />
        )}
        {inputProps.withPreset && !inputProps.limitedRange && (
          <div
            id={`${dialogId}-presets`}
            className="flex w-95 flex-wrap justify-center gap-2 border-t p-4"
          >
            {presets.map((p) => (
              <ChipSelect
                key={p.key}
                id={`${dialogId}-preset-${p.key}`}
                active={p.key === activePreset}
                text={p.label}
                onSelect={() => handlePreset(p.key, p.months)}
                aria-label={p.label}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TimeSection({
  dialogId,
  t,
  times,
  setTimes,
}: Pick<DateInputViewProps, "t" | "times" | "setTimes"> & {
  dialogId: string;
}) {
  return (
    <div
      id={`${dialogId}-time-section`}
      className="flex w-full flex-col items-start justify-center border-t p-2 px-8"
    >
      <span className="mb-4 text-sm font-medium">{t("common.time")}</span>
      <div id={`${dialogId}-time-picker`}>
        <TimePicker
          inputClassName={cn("!w-10 !h-10 !p-0")}
          withSecond
          value={times[0]}
          onChange={({ string }: { string: string }) => setTimes([string])}
        />
      </div>
    </div>
  );
}

function RangeTimeSection({
  dialogId,
  t,
  times,
  setTimes,
}: Pick<DateInputViewProps, "t" | "times" | "setTimes"> & {
  dialogId: string;
}) {
  function handleChange(
    val: {
      string: string;
      obj: TimeObject;
    },
    index: number,
  ) {
    setTimes((prev: string[]) => {
      const newTimes = [...prev];
      newTimes[index] = val.string;
      return newTimes;
    });
  }

  return (
    <div
      id={`${dialogId}-range-time-section`}
      className="flex w-fit flex-full items-end justify-between gap-1 border-t px-4"
    >
      <div className="flex flex-col gap-1 py-2">
        <span className="text-sm font-medium">{t("common.fromTime")}</span>
        <div id={`${dialogId}-from-time`}>
          <TimePicker
            withSecond
            value={times[0]}
            onChange={(val) => handleChange(val, 0)}
          />
        </div>
      </div>
      <Divider orientation="vertical" />
      <div className="flex flex-col gap-1 py-2">
        <span className="text-sm font-medium">{t("common.toTime")}</span>
        <div id={`${dialogId}-to-time`}>
          <TimePicker
            withSecond
            value={times[1]}
            onChange={(val) => handleChange(val, 1)}
          />
        </div>
      </div>
    </div>
  );
}
