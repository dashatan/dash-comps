"use client";

import { useEffect, useMemo } from "react";
import { cn, formatPersianDateTime, usePreferences } from "@/lib";
import LabelContainer, { messageVariants } from "../label/labelContainer";
import "./styles.css";
import { Dialog, DialogContent, DialogTrigger } from "@/components/common/overlay/dialog";
import { DateInputProps } from "./types";
import { DateInputContext, useDateInput } from "./context";
import { DateInputLabel } from "./components/date-input-label";
import { DateInputDialog } from "./components/date-input-dialog";
import { DateInputFooter } from "./components/date-input-footer";
import { useLanguage } from "@/lib";
import { getValueFromPreset } from "@/lib";

export function DateInput({ width, id, ...props }: DateInputProps) {
  const { t } = useLanguage();
  const { preferences } = usePreferences();
  const dateInputId = id || "date-input";

  const {
    dateObjects,
    times,
    open,
    activePreset,
    setOpen,
    setTimes,
    handleDateChange,
    handlePreset,
    handleClear,
    handleSubmit,
    presets,
    currentDate,
    calendarKey,
    calendar,
    locale,
    minDate,
    maxDate,
    withTime,
    withPreset,
  } = useDateInput(props);

  useEffect(() => {
    if (
      preferences.formDefaults?.datePreset &&
      !props.value?.length &&
      !props.limitedRange
    ) {
      const preset = presets.find((p) => p.key === preferences.formDefaults?.datePreset);
      if (preset) {
        const dates = getValueFromPreset(preset.months, calendar, locale);
        props.onChange?.(dates);
      }
    }
  }, [preferences, props.value, presets]);

  const dates = useMemo(
    () => dateObjects.map((x) => formatPersianDateTime(x.toDate().getTime())),
    [dateObjects],
  );

  const dialogHeading = useMemo(
    () => (props.range ? t("common.dateRange") : t("common.date")),
    [props.range, t],
  );

  const contextValue = {
    props,
    dateObjects,
    times,
    open,
    activePreset,
    setOpen,
    setTimes,
    handleDateChange,
    handlePreset,
    handleClear,
    handleSubmit,
    presets,
    dates,
    dialogHeading,
    t,
    currentDate,
    calendarKey,
    minDate,
    maxDate,
    withTime,
    withPreset,
  };

  return (
    <DateInputContext.Provider value={contextValue}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          id={dateInputId}
          style={{ width: width || "100%", textAlign: "start" }}
          className={cn(props.className?.trigger)}
        >
          <LabelContainer
            hasValue={false}
            message={props.message}
            status={props.status}
            className={{
              wrapper: { body: "cursor-pointer items-center" },
            }}
            showMessage={false}
            id={dateInputId}
          >
            <DateInputLabel label={props.label || ""} icon={props.icon} />
          </LabelContainer>
          {props.withPreset && props.message && (
            <span
              id={`${dateInputId}-message`}
              className={cn(
                "mt-2",
                messageVariants({ status: props.status }),
                props.labelContainerProps?.className?.wrapper?.message,
              )}
              role="status"
              aria-live="polite"
            >
              {props.message}
            </span>
          )}
        </DialogTrigger>

        <DialogContent
          id={`${dateInputId}-dialog`}
          className={cn("h-auto w-fit", props.className?.dialog)}
          heading={dialogHeading}
          aria-describedby={`${dateInputId}-dialog`}
        >
          <DateInputDialog />
          <DateInputFooter />
        </DialogContent>
      </Dialog>
    </DateInputContext.Provider>
  );
}
