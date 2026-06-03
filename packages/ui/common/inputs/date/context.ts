import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DateObject } from "react-multi-date-picker";

import { DateInputProps, DatePreset } from "./types";
import {
  clearTime,
  getValueFromPreset,
  limitedRangeToTimestamps,
  matchActivePreset,
  resolveCalendarLocale,
  Translation,
  useLanguage,
} from "@/lib";
import { createDate, isValidTimestamp, combineDateAndTime } from "@/lib";
import { useAppStore } from "@/store";
import { Calendar, Locale } from "react-date-object";

export type DateInputContextType = {
  // Props
  props: DateInputProps;

  // State
  dateObjects: DateObject[];
  times: string[];
  open: boolean;
  activePreset: string | null;
  currentDate?: DateObject;

  // Actions
  setOpen: (open: boolean) => void;
  setTimes: (times: string[] | ((prev: string[]) => string[])) => void;
  handleDateChange: (d: DateObject | DateObject[] | null) => void;
  handlePreset: (key: string, months: number) => void;
  handleClear: (withSubmit?: boolean) => void;
  handleSubmit: () => void;

  // Computed values
  presets: DatePreset[];
  dates: string[] | Date[];
  dialogHeading: string;
  withTime?: boolean;
  withPreset?: boolean;

  // Translation function
  t: Translation;
  calendarKey: number;
} & Pick<DateInputProps, "minDate" | "maxDate">;

export const DateInputContext = createContext<DateInputContextType | null>(null);

export const useDateInputContext = () => {
  const context = useContext(DateInputContext);
  if (!context) {
    throw new Error("useDateInputContext must be used within a DateInputProvider");
  }
  return context;
};

export type UseDateInputReturn = {
  dateObjects: DateObject[];
  times: string[];
  open: boolean;
  activePreset: string | null;
  currentDate: DateObject | undefined;
  setOpen: (open: boolean) => void;
  setTimes: (times: string[] | ((prev: string[]) => string[])) => void;
  handleDateChange: (d: DateObject | DateObject[] | null) => void;
  handlePreset: (key: string, months: number) => void;
  handleClear: (withSubmit?: boolean) => void;
  handleSubmit: () => void;
  presets: DatePreset[];
  calendarKey: number;
  calendar: Calendar;
  locale: Locale;
  withTime?: boolean;
  withPreset?: boolean;
} & Pick<DateInputProps, "minDate" | "maxDate">;

export function useDateInput(props: DateInputProps): UseDateInputReturn {
  const [dateObjects, setDateObjects] = useState<DateObject[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const { t, language } = useLanguage();

  const { calendar, locale } = useMemo(() => {
    return resolveCalendarLocale(language);
  }, [language]);
  const serverTimeDiff = useAppStore((state) => state.serverTimeDiff);
  const currentDate = useMemo(
    () => new DateObject({ date: props.value?.[0] || clearTime(), calendar, locale }),
    [calendar, locale, serverTimeDiff],
  );

  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [calendarKey, setCalendarKey] = useState<number>(0);
  const isProcessingRef = useRef(false);
  const ignoreCalendarChangeRef = useRef(false);
  const wasOpenRef = useRef(false);
  const serializedValue = props.value?.join(",") ?? "";

  // Memoize presets to prevent infinite re-renders
  const presets = useMemo(() => {
    const defaultPresets: DatePreset[] = [
      { key: "1m", label: t("common.lastOneMonth"), months: 1 },
      { key: "2m", label: t("common.lastTwoMonths"), months: 2 },
      { key: "3m", label: t("common.lastThreeMonths"), months: 3 },
      { key: "6m", label: t("common.lastSixMonths"), months: 6 },
      { key: "1y", label: t("common.lastOneYear"), months: 12 }, // 12 month is not 1 year 12 month is 12 * 30 and others  . should change to last month not 1 month : 30 day
    ];
    return props.presets || defaultPresets;
  }, [props.presets]);

  useEffect(() => {
    if (!props.limitedRange) return;

    const timestamps = limitedRangeToTimestamps(props.limitedRange, calendar, locale);
    const prev = props.value || [];
    const isSame =
      Array.isArray(prev) &&
      prev.length === timestamps.length &&
      prev.every((v, i) => v === timestamps[i]);

    if (!isSame) {
      props.onChange?.(timestamps);
    }
  }, [props.limitedRange, calendar, locale]);

  // Hydrate from form when closed, and once when the dialog opens.
  useEffect(() => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      const isOpening = open && !wasOpenRef.current;

      if (!open || isOpening) {
        if (props.value && props.value.length) {
          const validTimestamps = props.value.filter(isValidTimestamp);
          const newDateObjects = validTimestamps.map(
            (x) =>
              new DateObject({
                date: new Date(x),
                calendar,
                locale,
              }),
          );

          const newTimes = newDateObjects.map((x) =>
            x.toDate().toTimeString().substring(0, 8),
          );

          setDateObjects(newDateObjects);
          setTimes(newTimes);
          setActivePreset(matchActivePreset(props.value, presets, calendar, locale));
        } else {
          setDateObjects([]);
          setTimes([]);
          setActivePreset(null);
        }
      }
    } finally {
      isProcessingRef.current = false;
      wasOpenRef.current = open;
    }
  }, [open, serializedValue, calendar, locale, presets, props.value]);

  const handlePreset = useCallback(
    (key: string, months: number) => {
      const [start, end] = getValueFromPreset(months, calendar, locale);
      const startObj = new DateObject({ date: start, calendar, locale });
      const endObj = new DateObject({ date: end, calendar, locale });

      ignoreCalendarChangeRef.current = true;
      setDateObjects([startObj, endObj]);
      setTimes([
        new Date(start).toTimeString().split(" ")[0],
        new Date(end).toTimeString().split(" ")[0],
      ]);
      setActivePreset(key);
      setCalendarKey((x) => x + 1);
      props.onChange?.([start, end]);

      queueMicrotask(() => {
        ignoreCalendarChangeRef.current = false;
      });
    },
    [calendar, locale, props.onChange],
  );

  const handleClear = useCallback(
    (withSubmit?: boolean) => {
      setDateObjects([]);
      setTimes([]);
      setActivePreset(null);
      if (withSubmit) {
        props.onChange?.([]);
        setOpen(false);
      }
    },
    [props.onChange],
  );

  const handleDateChange = useCallback(
    (d: DateObject | DateObject[] | null) => {
      if (ignoreCalendarChangeRef.current) return;

      let res: DateObject[] = [];
      if (d && !Array.isArray(d)) res.push(d);
      if (d && Array.isArray(d)) res = d;

      if (props.limitedRange === "current-day") {
        const today = new DateObject({ date: createDate(), calendar, locale });

        const isToday = (x: DateObject) =>
          x.year === today.year &&
          x.month.number === today.month.number &&
          x.day === today.day;

        if (!res.some(isToday)) {
          return;
        }
        const [startTs, endTs] = limitedRangeToTimestamps(
          "current-day",
          calendar,
          locale,
        );

        const startObj = new DateObject({
          date: createDate(startTs),
          calendar,
          locale,
        });
        const endObj = new DateObject({
          date: createDate(endTs),
          calendar,
          locale,
        });

        setDateObjects([startObj, endObj]);

        const endDate = createDate(endTs);
        const nowTime = endDate.toTimeString().substring(0, 8);
        setTimes(["00:00:00", nowTime]);

        setActivePreset(null);
        props.onChange?.([startTs, endTs]);

        return;
      }

      setDateObjects(res);
      setActivePreset(null);
    },
    [props.limitedRange, calendar, locale, props.onChange],
  );

  const handleSubmit = useCallback(() => {
    const combinedDates = dateObjects.map((dateObj, index) => {
      const jsDate = dateObj.toDate();
      const timeString = times[index] || "00:00:00";

      const finalDate = combineDateAndTime(jsDate.getTime(), timeString);

      return finalDate.getTime();
    });

    props.onChange?.(combinedDates);
    setOpen(false);
  }, [dateObjects, times, props.onChange]);

  return {
    dateObjects,
    times,
    open,
    activePreset,
    currentDate,
    setOpen,
    setTimes,
    handleDateChange,
    handlePreset,
    handleClear,
    handleSubmit,
    presets,
    calendarKey,
    calendar,
    locale,
    minDate: props.minDate,
    maxDate: props.maxDate,
    withTime: props.withTime,
    withPreset: props.withPreset,
  };
}
