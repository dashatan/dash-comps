import store from "@/store";
import DateObject, { Calendar, DateType, Locale } from "react-date-object";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";
import arabic_ar from "react-date-object/locales/arabic_ar";
import { PERSIAN_LOCALE, TEHRAN_TZ } from "@dash/core";

export { PERSIAN_LOCALE, TEHRAN_TZ } from "../constants";

// Types
export type DateInput = number | Date | string;
export type TimestampFlow = "ptj" | "jtp"; // Python to JS or JS to Python

interface TimeConfig {
  timeZone?: string;
  noTimezone?: boolean;
}

export function toTehranTimestamp(date: DateInput): number {
  const tehranDate = changeTimezone(new Date(date), TEHRAN_TZ);
  return Math.floor(tehranDate.getTime() / 1000);
}

export function changeTimezone(date: Date, timeZone?: string): Date {
  const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return new Date(utcDate.toLocaleString("en-US", { timeZone }));
}

// export function createDate(defaultDate?: DateInput): Date {
// return defaultDate ? new Date(defaultDate) : new Date();
// }

export function createDate(defaultDate?: DateInput | null | undefined): Date {
  const serverTimeDiff = store.getState().root.app.serverTimeDiff;

  const newTime = defaultDate
    ? new Date(defaultDate)
    : new Date(Date.now() - serverTimeDiff);
  return changeTimezone(newTime, TEHRAN_TZ);
}

export function calculateDaysDifference(
  dates?: [DateInput, DateInput],
): number | undefined {
  if (!dates || dates.length < 2) return undefined;

  const [from, to] = dates.map((date) => createDate(date));
  const differenceInTime = to.getTime() - from.getTime();
  return Math.round(differenceInTime / (1000 * 3600 * 24));
}

function format(
  date?: DateInput,
  type?: "date" | "time" | "dateTime" | "year",
  configOrNoTimezone?: TimeConfig | boolean,
): string {
  if (!date) return "";
  const config: TimeConfig =
    typeof configOrNoTimezone === "boolean"
      ? { noTimezone: configOrNoTimezone }
      : configOrNoTimezone || {};
  const parsedDate = createDate(date);
  if (isNaN(parsedDate.getTime())) {
    console.warn("Invalid date provided to formatPersianDate:", date);
    return "";
  }
  const state = store.getState();
  const {
    monthFormat,
    separator = "/",
    yearFormat,
  } = state?.root?.app?.preferences?.dateFormat || {};

  const formatOptions = {
    timeZone: config.noTimezone ? undefined : config.timeZone || TEHRAN_TZ,
    calendar: "persian" as const,
  };

  switch (type) {
    case "date": {
      // Format date parts separately to apply custom separator
      const yearFormatter = Intl.DateTimeFormat(PERSIAN_LOCALE, {
        ...formatOptions,
        year: yearFormat === "full" ? "numeric" : "2-digit",
      });
      const monthFormatter = Intl.DateTimeFormat(PERSIAN_LOCALE, {
        ...formatOptions,
        month:
          monthFormat === "name"
            ? "long"
            : monthFormat === "digit"
              ? "2-digit"
              : "narrow",
      });
      const dayFormatter = Intl.DateTimeFormat(PERSIAN_LOCALE, {
        ...formatOptions,
        day: "2-digit",
      });

      const year =
        yearFormatter
          .formatToParts(parsedDate)
          .find((part) => part.type === "year")?.value || "";
      const month =
        monthFormatter
          .formatToParts(parsedDate)
          .find((part) => part.type === "month")?.value || "";
      const day =
        dayFormatter
          .formatToParts(parsedDate)
          .find((part) => part.type === "day")?.value || "";

      // Persian date format: year/month/day
      return [year, month, day].join(separator);
    }
    case "time":
      return Intl.DateTimeFormat(PERSIAN_LOCALE, {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        calendar: "persian",
        timeZone: config.noTimezone ? undefined : config.timeZone || TEHRAN_TZ,
      }).format(parsedDate);
    case "dateTime": {
      // Format date parts separately to apply custom separator
      const yearFormatter = Intl.DateTimeFormat(PERSIAN_LOCALE, {
        ...formatOptions,
        year: yearFormat === "full" ? "numeric" : "2-digit",
      });
      const monthFormatter = Intl.DateTimeFormat(PERSIAN_LOCALE, {
        ...formatOptions,
        month:
          monthFormat === "name"
            ? "long"
            : monthFormat === "digit"
              ? "2-digit"
              : "narrow",
      });
      const dayFormatter = Intl.DateTimeFormat(PERSIAN_LOCALE, {
        ...formatOptions,
        day: "2-digit",
      });
      const timeFormatter = Intl.DateTimeFormat(PERSIAN_LOCALE, {
        ...formatOptions,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });

      const year =
        yearFormatter
          .formatToParts(parsedDate)
          .find((part) => part.type === "year")?.value || "";
      const month =
        monthFormatter
          .formatToParts(parsedDate)
          .find((part) => part.type === "month")?.value || "";
      const day =
        dayFormatter
          .formatToParts(parsedDate)
          .find((part) => part.type === "day")?.value || "";
      const time = timeFormatter.format(parsedDate);

      // Persian date format: year/month/day time
      return [year, month, day].join(separator) + " " + time;
    }
    case "year":
      return Intl.DateTimeFormat(PERSIAN_LOCALE, {
        year: yearFormat === "full" ? "numeric" : "2-digit",
        timeZone: config.noTimezone ? undefined : config.timeZone || TEHRAN_TZ,
      }).format(parsedDate);
    default:
      return "";
  }
}

export function parseDate(
  date?: DateInput,
  configOrNoTimezone?: TimeConfig | boolean,
) {
  const config: TimeConfig =
    typeof configOrNoTimezone === "boolean"
      ? { noTimezone: configOrNoTimezone }
      : configOrNoTimezone || {};
  const parsedDate = createDate(date);
  const formatOptions = {
    timeZone: config.noTimezone ? undefined : config.timeZone || TEHRAN_TZ,
    calendar: "persian" as const,
  };

  // Format date parts separately to apply custom separator
  const yearFormatter = Intl.DateTimeFormat(PERSIAN_LOCALE, {
    ...formatOptions,
    year: "numeric",
  });
  const monthFormatter = Intl.DateTimeFormat(PERSIAN_LOCALE, {
    ...formatOptions,
    month: "numeric",
  });
  const dayFormatter = Intl.DateTimeFormat(PERSIAN_LOCALE, {
    ...formatOptions,
    day: "numeric",
  });

  const year =
    yearFormatter.formatToParts(parsedDate).find((part) => part.type === "year")
      ?.value || "";
  const month =
    monthFormatter
      .formatToParts(parsedDate)
      .find((part) => part.type === "month")?.value || "";
  const day =
    dayFormatter.formatToParts(parsedDate).find((part) => part.type === "day")
      ?.value || "";

  return {
    year,
    month,
    day,
  };
}

export function formatPersianDate(
  date?: DateInput | null,
  options?: {
    yearFormat?: "numeric" | "2-digit" | "hidden";
    monthFormat?: "numeric" | "2-digit" | "hidden";
    dayFormat?: "numeric" | "2-digit" | "hidden";
  },
): string {
  if (!date) return "";

  return new Intl.DateTimeFormat(PERSIAN_LOCALE, {
    year:
      options?.yearFormat === "hidden"
        ? undefined
        : options?.yearFormat || "numeric",
    month:
      options?.monthFormat === "hidden"
        ? undefined
        : options?.monthFormat || "2-digit",
    day:
      options?.dayFormat === "hidden"
        ? undefined
        : options?.dayFormat || "2-digit",
  }).format(new Date(date));
}

export function formatPersianTime(
  date?: DateInput,
  configOrNoTimezone?: TimeConfig | boolean,
): string {
  return new Intl.DateTimeFormat(PERSIAN_LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date || 0));
  return format(date, "time", configOrNoTimezone);
}

export function formatPersianDateTime(
  date?: DateInput,
  configOrNoTimezone?: TimeConfig | boolean,
): string {
  return new Intl.DateTimeFormat(PERSIAN_LOCALE, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date || 0));
  return format(date, "dateTime", configOrNoTimezone);
}

export function formatPersianYear(
  date?: DateInput,
  configOrNoTimezone?: TimeConfig | boolean,
): string {
  return format(date, "year", configOrNoTimezone);
}

export function addDays(date: DateInput, days: number): Date {
  const result = createDate(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function subtractDays(date: DateInput, days: number): Date {
  const result = createDate(date);
  result.setDate(result.getDate() - days);
  return result;
}

/** Inclusive calendar-day timestamps from `from` through `to`, each at local midnight (newest first by default). */
export function getDatesInRange(
  from: DateInput,
  to: DateInput,
  order: "asc" | "desc" = "desc",
): number[] {
  const dates: number[] = [];
  let current = clearTime(from).getTime();
  const end = clearTime(to).getTime();

  while (current <= end) {
    dates.push(current);
    current = clearTime(addDays(current, 1)).getTime();
  }

  return order === "desc" ? dates.reverse() : dates;
}

export function subtractHours(date: DateInput, hours: number): Date {
  const result = createDate(date);
  result.setTime(result.getTime() - hours * 3600000);
  return result;
}

export function getDaysAgo(date?: Date): number | undefined {
  if (!date) return undefined;

  const now = createDate();
  const targetDate = createDate(date);
  const differenceInTime = now.getTime() - targetDate.getTime();
  return Math.round(differenceInTime / (1000 * 3600 * 24));
}

export function clearSeconds(date?: DateInput): Date {
  const d = createDate(date);
  d.setSeconds(0, 0);
  return d;
}

export function clearTime(date?: DateInput): Date {
  const d = createDate(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function jsToPythonTimestamp(timestamp?: number): number | undefined {
  if (!timestamp) return undefined;
  return Math.floor(timestamp / 1000);
}

export function pythonToJsTimestamp(
  timestamp?: number | null | undefined,
): number | undefined | null {
  return timestamp ? timestamp * 1000 : undefined;
}

export function normalizeTimestampsPythonToJs<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map((item) => normalizeTimestamp(item, "ptj")) as T;
  }
  if (typeof data === "object" && data !== null) {
    return normalizeTimestamp(data as Record<string, any>, "ptj") as T;
  }
  return data;
}

export function normalizeTimestampsJsToPython<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map((item) => normalizeTimestamp(item, "jtp")) as T;
  }
  if (typeof data === "object" && data !== null) {
    return normalizeTimestamp(data as Record<string, any>, "jtp") as T;
  }
  return data;
}

function normalizeTimestamp<T extends Record<string, any>>(
  data: T,
  flow: TimestampFlow,
): T {
  const normalize = flow === "jtp" ? jsToPythonTimestamp : pythonToJsTimestamp;
  const normalizedData = { ...data } as T;

  Object.entries(data).forEach(([key, value]) => {
    if (
      (key.includes("date") || key.includes("time")) &&
      typeof value === "number"
    ) {
      (normalizedData as Record<string, any>)[key] = normalize(value);
    }
  });

  return normalizedData;
}

export function commonTimes() {
  const state = store.getState();
  const datePreset = state.root.app.preferences.formDefaults?.datePreset;
  let months = 1;
  if (typeof datePreset === "string") {
    if (datePreset.includes("m")) {
      months = parseInt(datePreset.split("m")[0], 10) * 30;
    } else if (datePreset.includes("y")) {
      months = parseInt(datePreset.split("y")[0], 10) * 365;
    } else if (datePreset.includes("d")) {
      months = parseInt(datePreset.split("d")[0], 10);
    }
  }
  const now = clearTime().getTime();

  return {
    now,
    yesterday: subtractDays(now, 1).getTime(),
    startOfCurrentWeek: getFirstOfWeek().toDate().getTime(),
    oneWeekAgo: subtractDays(now, 7).getTime(),
    oneMonthAgo: subtractDays(now, 30).getTime(),
    threeMonthsAgo: subtractDays(now, 90).getTime(),
    sixMonthsAgo: subtractDays(now, 180).getTime(),
    oneYearAgo: subtractDays(now, 365).getTime(),
    preferredDate: subtractDays(now, months).getTime(),
  };
}

export function isValidTimestamp(value: any): value is number {
  return (
    typeof value === "number" && !isNaN(value) && value > 0 && isFinite(value)
  );
}
export function combineDateAndTime(
  dateTimestamp: number,
  timeString: string,
): Date {
  const date = clearTime(dateTimestamp);

  if (!timeString) return date;

  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  date.setHours(hours || 0, minutes || 0, seconds || 0, 0);
  return date;
}

export function getValueFromPreset(
  months: number,
  calendar: any,
  locale: any,
): number[] {
  const now = new DateObject({ date: clearTime(), calendar, locale });
  const fromDate = new DateObject({ date: clearTime(), calendar, locale });

  fromDate.subtract(months, "months");

  return [fromDate.toDate().getTime(), now.toDate().getTime()];
}

const PRESET_TOLERANCE_MS = 60 * 1000;

export function matchActivePreset(
  value: number[],
  presets: Array<{ key: string; months: number }>,
  calendar: Calendar,
  locale: Locale,
): string | null {
  if (value.length !== 2) return null;

  for (const preset of presets) {
    const [start, end] = getValueFromPreset(preset.months, calendar, locale);
    if (
      Math.abs(value[0] - start) < PRESET_TOLERANCE_MS &&
      Math.abs(value[1] - end) < PRESET_TOLERANCE_MS
    ) {
      return preset.key;
    }
  }

  return null;
}

export const isInAllowedLimitedRange = (date: DateObject, ranges: string) => {
  if (ranges === "current-day") {
    const today = new DateObject({
      date: createDate(),
      calendar: date.calendar,
      locale: date.locale,
    });
    return (
      date.year === today.year &&
      date.month.number === today.month.number &&
      date.day === today.day
    );
  }

  if (ranges === "current-week") {
    const now = new DateObject({
      calendar: date.calendar,
      locale: date.locale,
    }); //.toLastOfWeek()
    const currentWeekStartDate = getFirstOfWeek(date.calendar, date.locale);

    const currentWeekStartDateTs = currentWeekStartDate.toDate().getTime();
    const nowTs = now.toDate().getTime();
    const dateTs = date.toDate().getTime();
    return dateTs >= currentWeekStartDateTs && dateTs <= nowTs;
  }

  const AllowRange = limitedRageMapper[ranges];
  const month = date.month.number;
  const day = date.day;

  for (let i = 0; i < AllowRange.length; i += 2) {
    const start = AllowRange[i];
    const end = AllowRange[i + 1];
    if (!start || !end) continue;
    if (
      start.m === end.m &&
      month === start.m &&
      day >= start.d &&
      day <= end.d
    )
      return true;
    if (
      (month === start.m && day >= start.d) ||
      (month === end.m && day <= end.d) ||
      (month > start.m && month < end.m)
    )
      return true;
  }

  return false;
};

export function limitedRangeToTimestamps(
  rangeKey: keyof typeof limitedRageMapper,
  calendar: Calendar,
  locale: Locale,
): number[] {
  if (rangeKey === "current-day") {
    const now = new DateObject({ calendar, locale });

    const startOfToday = new DateObject({
      calendar,
      locale,
      year: now.year,
      month: now.month.number,
      day: now.day,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const startTs = startOfToday.toDate().getTime();
    const nowTs = now.toDate().getTime();
    return [startTs, nowTs];
  }

  if (rangeKey === "current-week") {
    const now = new DateObject({ calendar, locale });
    const currentWeekStartDate = getFirstOfWeek(calendar, locale);

    const currentWeekStartDateTs = currentWeekStartDate.toDate().getTime();
    const nowTs = now.toDate().getTime();
    return [currentWeekStartDateTs, nowTs];
  }

  const AllowRange = limitedRageMapper[rangeKey];
  if (!AllowRange) return [];

  let currentYear = new DateObject({ calendar }).year;

  return AllowRange.map(({ m, d }: any) => {
    const year = m === 1 ? currentYear + 1 : currentYear;
    return new DateObject({
      calendar,
      locale,
      year,
      month: m,
      day: d,
    })
      .toDate()
      .getTime();
  });
}

export const limitedRageMapper = {
  "norose-travel": [
    { m: 12, d: 25 },
    { m: 1, d: 15 },
  ],
  "current-day": [] as { m: number; d: number }[],
  "current-week": [] as { m: number; d: number }[],
} as any;

export function getFirstOfWeek(
  calendar?: Calendar,
  locale?: Locale,
  date?: DateType,
) {
  const dateObject = new DateObject({ calendar, locale, date })
    .toFirstOfWeek()
    .setHour(0)
    .setMinute(0)
    .setSecond(0)
    .setMillisecond(0);
  return dateObject;
}

export function resolveCalendarByLanguage(language: string): Calendar {
  if (language === "fa") return persian;
  if (language === "ar") return arabic;
  return gregorian;
}

export function resolveLocaleByLanguage(language: string): Locale {
  if (language === "fa") return persian_fa;
  if (language === "ar") return arabic_ar;
  return gregorian_en;
}

export function resolveCalendarLocale(language: string): {
  calendar: Calendar;
  locale: Locale;
} {
  return {
    calendar: resolveCalendarByLanguage(language),
    locale: resolveLocaleByLanguage(language),
  };
}

export function getMonthTimestamps(
  year: number,
  monthIndex: number,
  calendar: Calendar,
  locale?: Locale,
) {
  const startDate = new DateObject({
    calendar,
    locale,
    year,
    month: monthIndex + 1,
    day: 1,
  });

  startDate.setHour(0).setMinute(0).setSecond(0).setMillisecond(0);

  const endDate = new DateObject(startDate).toLastOfMonth();
  endDate.setHour(23).setMinute(59).setSecond(59).setMillisecond(999);

  return {
    start_datetime: startDate.toUnix(),
    end_datetime: endDate.toUnix(),
  };
}
