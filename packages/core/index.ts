// Client-safe barrel for Vite showcase and `import from "@/lib"`.
// Next.js server entry: use `./server-entry` instead.
export { cn, getNestedValue, nestedSearch, createUUID } from "./utils/cn";
export * from "./language/client";
export * from "./language/utils";
export * from "./language/locales/index";
export * from "./constants";
export {
  addDays,
  clearTime,
  combineDateAndTime,
  createDate,
  formatPersianDate,
  formatPersianDateTime,
  formatPersianTime,
  getValueFromPreset,
  isInAllowedLimitedRange,
  isValidTimestamp,
  limitedRangeToTimestamps,
  matchActivePreset,
  resolveCalendarLocale,
  subtractDays,
} from "./utils/date-time-helpers";
export { DEFAULT_THEME } from "./themes/constants";
export * from "./themes/theme-provider";
export * from "./themes/theme-toggle";
export * from "./store";
export { usePreferences } from "./hooks/use-preferences";
export type * from "./types";
