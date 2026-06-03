'use client'

import { memo } from 'react'
import { cn } from '@/lib'
import { PersianDatePickerMonthYearProps } from '../types'
import { PERSIAN_MONTHS } from '../utils/persian-date-utils'

const PersianDatePickerMonthYear = memo<PersianDatePickerMonthYearProps>(({ currentMonth, currentYear, onMonthSelect, onYearSelect, onClose, className }) => {
  const currentYearRange = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)

  return (
    <div className={cn('p-4', className)}>
      {/* Month selection */}
      <div className='mb-6'>
        <h3 className='mb-3 text-sm font-medium'>انتخاب ماه</h3>
        <div className='grid grid-cols-3 gap-2'>
          {PERSIAN_MONTHS.map((month, index) => (
            <button
              key={index}
              type='button'
              onClick={() => onMonthSelect(index + 1)}
              className={cn(
                'rounded-md border px-3 py-2 text-sm transition-colors',
                'hover:bg-muted focus:ring-ring focus:ring-2 focus:outline-none',
                currentMonth === index + 1 ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:border-input-hover'
              )}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Year selection */}
      <div>
        <h3 className='mb-3 text-sm font-medium'>انتخاب سال</h3>
        <div className='grid grid-cols-5 gap-2'>
          {currentYearRange.map((year) => (
            <button
              key={year}
              type='button'
              onClick={() => onYearSelect(year)}
              className={cn(
                'rounded-md border px-3 py-2 text-sm transition-colors',
                'hover:bg-muted focus:ring-ring focus:ring-2 focus:outline-none',
                currentYear === year ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:border-input-hover'
              )}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Close button */}
      <div className='mt-6 flex justify-end'>
        <button
          type='button'
          onClick={onClose}
          className='bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring rounded-md px-4 py-2 text-sm transition-colors focus:ring-2 focus:outline-none'
        >
          بستن
        </button>
      </div>
    </div>
  )
})

PersianDatePickerMonthYear.displayName = 'PersianDatePickerMonthYear'

export default PersianDatePickerMonthYear
