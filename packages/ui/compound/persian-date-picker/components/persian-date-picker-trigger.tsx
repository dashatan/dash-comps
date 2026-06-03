'use client'

import { memo, useMemo } from 'react'
import { cn } from '@/lib'
import LabelContainer from '@/components/common/inputs/label/labelContainer'
import { PersianDatePickerTriggerProps } from '../types'
import { formatPersianDate } from '../utils/persian-date-utils'

const PersianDatePickerTrigger = memo<PersianDatePickerTriggerProps>(({ value, placeholder, disabled, onClick, onClear, className, icon, clearIcon }) => {
  const displayValue = useMemo(() => {
    if (!value) return ''

    if ('start' in value && 'end' in value) {
      // Range value
      const startFormatted = formatPersianDate(value.start, true)
      const endFormatted = formatPersianDate(value.end, true)
      return `${startFormatted} - ${endFormatted}`
    } else {
      // Single date value
      return formatPersianDate(value, true)
    }
  }, [value])

  const hasValue = !!value

  return (
    <div className={cn('relative w-full', 'persian-date-picker-trigger', className)} dir='rtl'>
      <LabelContainer
        hasValue={hasValue}
        focused={false}
        onClick={onClick}
        className={{
          wrapper: {
            container: 'cursor-pointer',
            body: cn('flex items-center justify-between px-4 py-3', disabled && 'cursor-not-allowed opacity-50'),
          },
        }}
      >
        <div className='flex min-w-0 flex-1 items-center gap-2'>
          {icon && <div className='text-muted-foreground flex-shrink-0'>{icon}</div>}

          <span className={cn('truncate', hasValue ? 'text-foreground' : 'text-muted-foreground')}>{hasValue ? displayValue : placeholder}</span>
        </div>

        <div className='flex flex-shrink-0 items-center gap-1'>
          {hasValue && clearIcon && (
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                onClear()
              }}
              className='hover:bg-muted rounded-sm p-1 transition-colors'
              disabled={disabled}
            >
              {clearIcon}
            </button>
          )}

          <div className='text-muted-foreground'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
              <line x1='16' y1='2' x2='16' y2='6' />
              <line x1='8' y1='2' x2='8' y2='6' />
              <line x1='3' y1='10' x2='21' y2='10' />
            </svg>
          </div>
        </div>
      </LabelContainer>
    </div>
  )
})

PersianDatePickerTrigger.displayName = 'PersianDatePickerTrigger'

export default PersianDatePickerTrigger
