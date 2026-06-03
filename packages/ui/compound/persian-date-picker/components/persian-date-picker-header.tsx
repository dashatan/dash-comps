'use client'

import { memo } from 'react'
import { cn } from '@/lib'
import { PersianDatePickerHeaderProps } from '../types'
import { PERSIAN_MONTHS } from '../utils/persian-date-utils'

const PersianDatePickerHeader = memo<PersianDatePickerHeaderProps>(
  ({ currentMonth, currentYear, onPreviousMonth, onNextMonth, onPreviousYear, onNextYear, onToggleMonthYearPicker, showMonthYearPicker, className }) => {
    const monthName = PERSIAN_MONTHS[currentMonth - 1]

    return (
      <div className={cn('flex items-center justify-between border-b p-4', className)}>
        <div className='flex items-center gap-2'>
          <button type='button' onClick={onPreviousYear} className='hover:bg-muted rounded-md p-2 transition-colors' aria-label='سال قبل'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <polyline points='9,18 15,12 9,6' />
            </svg>
          </button>

          <button type='button' onClick={onPreviousMonth} className='hover:bg-muted rounded-md p-2 transition-colors' aria-label='ماه قبل'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <polyline points='9,18 15,12 9,6' />
            </svg>
          </button>
        </div>

        <button
          type='button'
          onClick={onToggleMonthYearPicker}
          className={cn('hover:bg-muted rounded-md px-4 py-2 text-lg font-semibold transition-colors', showMonthYearPicker && 'bg-muted')}
        >
          {monthName} {currentYear}
        </button>

        <div className='flex items-center gap-2'>
          <button type='button' onClick={onNextMonth} className='hover:bg-muted rounded-md p-2 transition-colors' aria-label='ماه بعد'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <polyline points='15,18 9,12 15,6' />
            </svg>
          </button>

          <button type='button' onClick={onNextYear} className='hover:bg-muted rounded-md p-2 transition-colors' aria-label='سال بعد'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <polyline points='15,18 9,12 15,6' />
            </svg>
          </button>
        </div>
      </div>
    )
  }
)

PersianDatePickerHeader.displayName = 'PersianDatePickerHeader'

export default PersianDatePickerHeader
