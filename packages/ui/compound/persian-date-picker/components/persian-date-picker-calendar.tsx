'use client'

import { memo, useMemo } from 'react'
import { cn } from '@/lib'
import { PersianDatePickerCalendarProps, PersianDatePickerDayProps } from '../types'
import {
  PersianDate,
  generatePersianCalendarDays,
  getPersianWeekDays,
  getCurrentPersianDate,
  comparePersianDates,
  getDaysInPersianMonth,
  getDayOfWeek,
} from '../utils/persian-date-utils'

const PersianDatePickerDay = memo<PersianDatePickerDayProps>(
  ({ date, isSelected, isInRange, isRangeStart, isRangeEnd, isToday, isDisabled, isOtherMonth, onClick, className }) => {
    return (
      <button
        type='button'
        onClick={() => onClick(date)}
        disabled={isDisabled}
        className={cn(
          'h-10 w-10 rounded-md text-sm transition-colors',
          'hover:bg-muted focus:ring-ring focus:ring-2 focus:outline-none',
          isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
          isInRange && !isSelected && 'bg-primary/20',
          isRangeStart && 'bg-primary text-primary-foreground rounded-l-md rounded-r-none',
          isRangeEnd && 'bg-primary text-primary-foreground rounded-l-none rounded-r-md',
          isToday && !isSelected && 'bg-muted font-semibold',
          isDisabled && 'cursor-not-allowed opacity-50',
          isOtherMonth && 'text-muted-foreground',
          className
        )}
      >
        {date.day}
      </button>
    )
  }
)

PersianDatePickerDay.displayName = 'PersianDatePickerDay'

const PersianDatePickerCalendar = memo<PersianDatePickerCalendarProps>(
  ({ currentMonth, currentYear, selectedDate, selectedRange, selectedDates, onDateSelect, isDateDisabled, showWeekNumbers, className }) => {
    const weekDays = getPersianWeekDays()
    const currentDate = getCurrentPersianDate()

    const calendarDays = useMemo(() => {
      const days = generatePersianCalendarDays(currentYear, currentMonth)

      // Add days from previous month to fill the first week
      const firstDay = days[0]
      const firstDayOfWeek = getDayOfWeek(firstDay)
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear
      const daysInPrevMonth = getDaysInPersianMonth(prevYear, prevMonth)

      const prevMonthDays: PersianDate[] = []
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        prevMonthDays.push({
          year: prevYear,
          month: prevMonth,
          day: daysInPrevMonth - i,
        })
      }

      // Add days from next month to fill the last week
      const lastDay = days[days.length - 1]
      const lastDayOfWeek = getDayOfWeek(lastDay)
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1
      const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear

      const nextMonthDays: PersianDate[] = []
      for (let i = 1; i <= 7 - lastDayOfWeek; i++) {
        nextMonthDays.push({
          year: nextYear,
          month: nextMonth,
          day: i,
        })
      }

      return [...prevMonthDays, ...days, ...nextMonthDays]
    }, [currentMonth, currentYear])

    const isDateInRange = (date: PersianDate): boolean => {
      if (!selectedRange || !selectedRange.start) return false
      // If we only have a start date (range not completed), don't show range
      if (!selectedRange.end) return false
      return isDateInRangeHelper(date, selectedRange.start, selectedRange.end)
    }

    const isDateRangeStart = (date: PersianDate): boolean => {
      if (!selectedRange || !selectedRange.start) return false
      return comparePersianDates(date, selectedRange.start) === 0
    }

    const isDateRangeEnd = (date: PersianDate): boolean => {
      if (!selectedRange || !selectedRange.end) return false
      return comparePersianDates(date, selectedRange.end) === 0
    }

    // Check if date is the start of an incomplete range
    const isDateRangeStartIncomplete = (date: PersianDate): boolean => {
      if (!selectedRange || !selectedRange.start || selectedRange.end) return false
      return comparePersianDates(date, selectedRange.start) === 0
    }

    const isDateSelected = (date: PersianDate): boolean => {
      if (selectedDate) {
        return comparePersianDates(date, selectedDate) === 0
      }
      if (selectedDates.length > 0) {
        return selectedDates.some((d) => comparePersianDates(date, d) === 0)
      }
      return false
    }

    const isDateToday = (date: PersianDate): boolean => {
      return comparePersianDates(date, currentDate) === 0
    }

    const isDateOtherMonth = (date: PersianDate): boolean => {
      return date.month !== currentMonth || date.year !== currentYear
    }

    return (
      <div className={cn('p-4', className)}>
        {/* Week header */}
        <div className='mb-2 grid grid-cols-7 gap-1'>
          {weekDays.map((day, index) => (
            <div key={index} className='text-muted-foreground flex h-10 w-10 items-center justify-center text-sm font-medium'>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className='grid grid-cols-7 gap-1'>
          {calendarDays.map((date, index) => (
            <PersianDatePickerDay
              key={`${date.year}-${date.month}-${date.day}-${index}`}
              date={date}
              isSelected={isDateSelected(date) || isDateRangeStartIncomplete(date)}
              isInRange={isDateInRange(date)}
              isRangeStart={isDateRangeStart(date)}
              isRangeEnd={isDateRangeEnd(date)}
              isToday={isDateToday(date)}
              isDisabled={isDateDisabled(date)}
              isOtherMonth={isDateOtherMonth(date)}
              onClick={onDateSelect}
            />
          ))}
        </div>
      </div>
    )
  }
)

PersianDatePickerCalendar.displayName = 'PersianDatePickerCalendar'

// Helper functions - now using the imported utility function

function isDateInRangeHelper(date: PersianDate, start: PersianDate, end: PersianDate): boolean {
  const startCompare = comparePersianDates(date, start)
  const endCompare = comparePersianDates(date, end)
  return startCompare >= 0 && endCompare <= 0
}

export default PersianDatePickerCalendar
