'use client'

import { PERSIAN_LOCALE, TEHRAN_TZ } from '@/lib'

export interface PersianDate {
  year: number
  month: number
  day: number
  hour?: number
  minute?: number
  second?: number
}

export interface PersianDateRange {
  start: PersianDate
  end: PersianDate
}

export interface PersianDatePreset {
  key: string
  label: string
  getValue: () => PersianDateRange
}

// Persian month names
export const PERSIAN_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'] as const

// Persian day names
export const PERSIAN_DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'] as const

// Persian day names short
export const PERSIAN_DAYS_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] as const

// Convert Gregorian date to Persian date
export function gregorianToPersian(date: Date): PersianDate {
  const persianDate = new Intl.DateTimeFormat(PERSIAN_LOCALE, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: TEHRAN_TZ,
  }).formatToParts(date)

  const year = parseInt(persianDate.find((part) => part.type === 'year')?.value || '0')
  const month = parseInt(persianDate.find((part) => part.type === 'month')?.value || '0')
  const day = parseInt(persianDate.find((part) => part.type === 'day')?.value || '0')
  const hour = parseInt(persianDate.find((part) => part.type === 'hour')?.value || '0')
  const minute = parseInt(persianDate.find((part) => part.type === 'minute')?.value || '0')
  const second = parseInt(persianDate.find((part) => part.type === 'second')?.value || '0')

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
  }
}

// Convert Persian date to Gregorian date
export function persianToGregorian(persianDate: PersianDate): Date {
  // Create a date in Persian calendar and convert to Gregorian
  const dateString = `${persianDate.year}/${persianDate.month}/${persianDate.day}`
  const timeString = persianDate.hour !== undefined ? ` ${persianDate.hour}:${persianDate.minute || 0}:${persianDate.second || 0}` : ''

  // Use Intl.DateTimeFormat to parse Persian date
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: TEHRAN_TZ,
  })

  // This is a simplified conversion - in a real implementation, you'd use a proper Persian calendar library
  const tempDate = new Date(dateString + timeString)
  return tempDate
}

// Get current Persian date
export function getCurrentPersianDate(): PersianDate {
  return gregorianToPersian(new Date())
}

// Format Persian date to string
export function formatPersianDate(date: PersianDate, includeTime = false): string {
  const monthName = PERSIAN_MONTHS[date.month - 1]
  const dayName = PERSIAN_DAYS[getDayOfWeek(date)]

  let formatted = `${date.day} ${monthName} ${date.year}`

  if (includeTime && date.hour !== undefined) {
    const hour = date.hour.toString().padStart(2, '0')
    const minute = (date.minute || 0).toString().padStart(2, '0')
    formatted += ` - ${hour}:${minute}`
  }

  return formatted
}

// Get day of week for Persian date
export function getDayOfWeek(persianDate: PersianDate): number {
  const gregorianDate = persianToGregorian(persianDate)
  return gregorianDate.getDay()
}

// Get first day of month for Persian date
export function getFirstDayOfPersianMonth(year: number, month: number): PersianDate {
  return { year, month, day: 1 }
}

// Get last day of month for Persian date
export function getLastDayOfPersianMonth(year: number, month: number): PersianDate {
  const daysInMonth = getDaysInPersianMonth(year, month)
  return { year, month, day: daysInMonth }
}

// Add days to Persian date
export function addDaysToPersian(date: PersianDate, days: number): PersianDate {
  const gregorianDate = persianToGregorian(date)
  gregorianDate.setDate(gregorianDate.getDate() + days)
  return gregorianToPersian(gregorianDate)
}

// Add months to Persian date
export function addMonthsToPersian(date: PersianDate, months: number): PersianDate {
  const gregorianDate = persianToGregorian(date)
  gregorianDate.setMonth(gregorianDate.getMonth() + months)
  return gregorianToPersian(gregorianDate)
}

// Add years to Persian date
export function addYearsToPersian(date: PersianDate, years: number): PersianDate {
  const gregorianDate = persianToGregorian(date)
  gregorianDate.setFullYear(gregorianDate.getFullYear() + years)
  return gregorianToPersian(gregorianDate)
}

// Check if Persian date is valid
export function isValidPersianDate(date: PersianDate): boolean {
  if (date.year < 1 || date.month < 1 || date.month > 12 || date.day < 1) {
    return false
  }

  // Check if day is valid for the month
  const daysInMonth = getDaysInPersianMonth(date.year, date.month)
  return date.day <= daysInMonth
}

// Get days in Persian month
export function getDaysInPersianMonth(year: number, month: number): number {
  // Persian months have different lengths
  const daysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]

  // Check if it's a leap year (Esfand has 30 days instead of 29)
  if (month === 12 && isPersianLeapYear(year)) {
    return 30
  }

  return daysInMonth[month - 1]
}

// Check if Persian year is leap year
export function isPersianLeapYear(year: number): boolean {
  // Persian leap year calculation
  return (year + 2346) % 128 === 0 || (year + 2346) % 128 === 29 || (year + 2346) % 128 === 58 || (year + 2346) % 128 === 87
}

// Compare Persian dates
export function comparePersianDates(date1: PersianDate, date2: PersianDate): number {
  if (date1.year !== date2.year) return date1.year - date2.year
  if (date1.month !== date2.month) return date1.month - date2.month
  if (date1.day !== date2.day) return date1.day - date2.day
  if (date1.hour !== date2.hour) return (date1.hour || 0) - (date2.hour || 0)
  if (date1.minute !== date2.minute) return (date1.minute || 0) - (date2.minute || 0)
  return (date1.second || 0) - (date2.second || 0)
}

// Check if date is in range
export function isPersianDateInRange(date: PersianDate, range: PersianDateRange): boolean {
  const start = comparePersianDates(date, range.start)
  const end = comparePersianDates(date, range.end)
  return start >= 0 && end <= 0
}

// Get Persian date presets
export function getPersianDatePresets(): PersianDatePreset[] {
  const today = getCurrentPersianDate()

  return [
    {
      key: 'today',
      label: 'امروز',
      getValue: () => ({
        start: { ...today, hour: 0, minute: 0, second: 0 },
        end: { ...today, hour: 23, minute: 59, second: 59 },
      }),
    },
    {
      key: 'yesterday',
      label: 'دیروز',
      getValue: () => {
        const yesterday = addDaysToPersian(today, -1)
        return {
          start: { ...yesterday, hour: 0, minute: 0, second: 0 },
          end: { ...yesterday, hour: 23, minute: 59, second: 59 },
        }
      },
    },
    {
      key: 'thisWeek',
      label: 'این هفته',
      getValue: () => {
        const startOfWeek = addDaysToPersian(today, -getDayOfWeek(today))
        const endOfWeek = addDaysToPersian(startOfWeek, 6)
        return {
          start: { ...startOfWeek, hour: 0, minute: 0, second: 0 },
          end: { ...endOfWeek, hour: 23, minute: 59, second: 59 },
        }
      },
    },
    {
      key: 'lastWeek',
      label: 'هفته گذشته',
      getValue: () => {
        const startOfWeek = addDaysToPersian(today, -getDayOfWeek(today) - 7)
        const endOfWeek = addDaysToPersian(startOfWeek, 6)
        return {
          start: { ...startOfWeek, hour: 0, minute: 0, second: 0 },
          end: { ...endOfWeek, hour: 23, minute: 59, second: 59 },
        }
      },
    },
    {
      key: 'thisMonth',
      label: 'این ماه',
      getValue: () => {
        const startOfMonth = { ...today, day: 1, hour: 0, minute: 0, second: 0 }
        const endOfMonth = { ...today, day: getDaysInPersianMonth(today.year, today.month), hour: 23, minute: 59, second: 59 }
        return { start: startOfMonth, end: endOfMonth }
      },
    },
    {
      key: 'lastMonth',
      label: 'ماه گذشته',
      getValue: () => {
        const lastMonth = addMonthsToPersian(today, -1)
        const startOfMonth = { ...lastMonth, day: 1, hour: 0, minute: 0, second: 0 }
        const endOfMonth = { ...lastMonth, day: getDaysInPersianMonth(lastMonth.year, lastMonth.month), hour: 23, minute: 59, second: 59 }
        return { start: startOfMonth, end: endOfMonth }
      },
    },
    {
      key: 'thisYear',
      label: 'امسال',
      getValue: () => {
        const startOfYear = { ...today, month: 1, day: 1, hour: 0, minute: 0, second: 0 }
        const endOfYear = { ...today, month: 12, day: 29, hour: 23, minute: 59, second: 59 }
        return { start: startOfYear, end: endOfYear }
      },
    },
    {
      key: 'lastYear',
      label: 'سال گذشته',
      getValue: () => {
        const lastYear = addYearsToPersian(today, -1)
        const startOfYear = { ...lastYear, month: 1, day: 1, hour: 0, minute: 0, second: 0 }
        const endOfYear = { ...lastYear, month: 12, day: 29, hour: 23, minute: 59, second: 59 }
        return { start: startOfYear, end: endOfYear }
      },
    },
  ]
}

// Generate calendar days for a month
export function generatePersianCalendarDays(year: number, month: number): PersianDate[] {
  const days: PersianDate[] = []
  const daysInMonth = getDaysInPersianMonth(year, month)

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ year, month, day })
  }

  return days
}

// Get week days for calendar
export function getPersianWeekDays(): string[] {
  return PERSIAN_DAYS_SHORT.slice()
}

// Format time for display
export function formatPersianTime(hour: number, minute: number, second?: number): string {
  const h = hour.toString().padStart(2, '0')
  const m = minute.toString().padStart(2, '0')
  const s = second !== undefined ? second.toString().padStart(2, '0') : '00'
  return `${h}:${m}:${s}`
}

// Parse time string
export function parsePersianTime(timeString: string): { hour: number; minute: number; second: number } {
  const [hour, minute, second] = timeString.split(':').map(Number)
  return {
    hour: hour || 0,
    minute: minute || 0,
    second: second || 0,
  }
}

export function formatDateGregorian(date: Date): string {
  // Format date in Tehran timezone to avoid timezone offset issues
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: TEHRAN_TZ,
  })
  return formatter.format(date).replaceAll('-', '/')
}
