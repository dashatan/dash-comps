'use client'

import { memo, useState, useEffect } from 'react'
import { cn } from '@/lib'
import { PersianDatePickerTimeProps, PersianDatePickerTimeInputProps } from '../types'
import { PersianDate, getCurrentPersianDate } from '../utils/persian-date-utils'

const PersianDatePickerTimeInput = memo<PersianDatePickerTimeInputProps>(({ value, onChange, min, max, step, className }) => {
  return (
    <input
      type='number'
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      min={min}
      max={max}
      step={step}
      className={cn('border-input h-8 w-12 rounded-md border text-center', 'focus:ring-ring focus:ring-2 focus:outline-none', className)}
    />
  )
})

PersianDatePickerTimeInput.displayName = 'PersianDatePickerTimeInput'

const PersianDatePickerTime = memo<PersianDatePickerTimeProps>(({ selectedDate, onTimeChange, showSeconds, timeFormat, className }) => {
  const [time, setTime] = useState(() => {
    if (selectedDate && selectedDate.hour !== undefined) {
      return {
        hour: selectedDate.hour,
        minute: selectedDate.minute || 0,
        second: selectedDate.second || 0,
      }
    }
    return { hour: 0, minute: 0, second: 0 }
  })

  useEffect(() => {
    if (selectedDate && selectedDate.hour !== undefined) {
      setTime({
        hour: selectedDate.hour,
        minute: selectedDate.minute || 0,
        second: selectedDate.second || 0,
      })
    }
  }, [selectedDate])

  const handleTimeChange = (field: 'hour' | 'minute' | 'second', value: number) => {
    const newTime = { ...time, [field]: value }
    setTime(newTime)

    if (selectedDate) {
      const updatedDate: PersianDate = {
        ...selectedDate,
        hour: newTime.hour,
        minute: newTime.minute,
        second: showSeconds ? newTime.second : 0,
      }
      onTimeChange(updatedDate)
    }
  }

  const formatHour = (hour: number): number => {
    if (timeFormat === '12h') {
      return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    }
    return hour
  }

  const formatMinute = (minute: number): string => {
    return minute.toString().padStart(2, '0')
  }

  const formatSecond = (second: number): string => {
    return second.toString().padStart(2, '0')
  }

  const getAmPm = (hour: number): string => {
    if (timeFormat === '12h') {
      return hour >= 12 ? 'بعدازظهر' : 'قبل از ظهر'
    }
    return ''
  }

  return (
    <div className={cn('border-t p-4', className)}>
      <div className='flex items-center justify-center gap-4'>
        <div className='flex items-center gap-2'>
          <label className='text-sm font-medium'>ساعت:</label>
          <PersianDatePickerTimeInput
            value={formatHour(time.hour)}
            onChange={(value) => {
              const newHour = timeFormat === '12h' ? (value === 12 ? 0 : value) + (time.hour >= 12 ? 12 : 0) : value
              handleTimeChange('hour', newHour)
            }}
            min={timeFormat === '12h' ? 1 : 0}
            max={timeFormat === '12h' ? 12 : 23}
            step={1}
          />
        </div>

        <div className='text-lg font-bold'>:</div>

        <div className='flex items-center gap-2'>
          <label className='text-sm font-medium'>دقیقه:</label>
          <PersianDatePickerTimeInput value={time.minute} onChange={(value) => handleTimeChange('minute', value)} min={0} max={59} step={1} />
        </div>

        {showSeconds && (
          <>
            <div className='text-lg font-bold'>:</div>
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium'>ثانیه:</label>
              <PersianDatePickerTimeInput value={time.second} onChange={(value) => handleTimeChange('second', value)} min={0} max={59} step={1} />
            </div>
          </>
        )}

        {timeFormat === '12h' && (
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => {
                const newHour = time.hour >= 12 ? time.hour - 12 : time.hour + 12
                handleTimeChange('hour', newHour)
              }}
              className={cn(
                'rounded-md border px-3 py-1 text-sm',
                'hover:bg-muted transition-colors',
                time.hour >= 12 ? 'bg-primary text-primary-foreground' : 'bg-background'
              )}
            >
              {getAmPm(time.hour)}
            </button>
          </div>
        )}
      </div>
    </div>
  )
})

PersianDatePickerTime.displayName = 'PersianDatePickerTime'

export default PersianDatePickerTime
