'use client'

import { memo, useMemo } from 'react'
import { cn } from '@/lib'
import { PersianDatePickerProps } from './types'
import { usePersianDatePicker } from './hooks/use-persian-date-picker'
import { comparePersianDates } from './utils/persian-date-utils'
import PersianDatePickerTrigger from './components/persian-date-picker-trigger'
import PersianDatePickerDialog from './components/persian-date-picker-dialog'
import PersianDatePickerHeader from './components/persian-date-picker-header'
import PersianDatePickerCalendar from './components/persian-date-picker-calendar'
import PersianDatePickerTime from './components/persian-date-picker-time'
import PersianDatePickerPresets from './components/persian-date-picker-presets'
import PersianDatePickerFooter from './components/persian-date-picker-footer'
import PersianDatePickerMonthYear from './components/persian-date-picker-month-year'

const PersianDatePicker = memo<PersianDatePickerProps>((props) => {
  const {
    label,
    placeholder = 'تاریخ را انتخاب کنید',
    disabled = false,
    required = false,
    error,
    message,
    status = 'default',
    mode = 'single',
    withTime = false,
    withPresets = true,
    showClearButton = true,
    showAcceptButton = true,
    showCancelButton = true,
    autoClose = false,
    closeOnSelect = false,
    showTimePicker = false,
    showMonthYearPicker = false,
    showSeconds = false,
    timeFormat = '24h',
    className,
    labelContainerProps,
    width,
    icon,
    clearIcon,
    onChange,
    onOpen,
    onClose,
    onDateChange,
    onRangeChange,
    onPresetSelect,
    onClear,
    onAccept,
    onCancel,
  } = props

  const {
    state,
    open,
    close,
    toggle,
    selectDate,
    selectRange,
    startNewRange,
    selectPreset,
    clearSelection,
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousYear,
    goToNextYear,
    goToMonth,
    goToYear,
    toggleTimePicker,
    toggleMonthYearPicker,
    isDateDisabled,
    isDateValid,
    isRangeValid,
    formatDate,
    formatRange,
    formatTime,
    accept,
    cancel,
    presets,
  } = usePersianDatePicker(props)

  const displayValue = useMemo(() => {
    if (!state.tempValue) return null

    if ('start' in state.tempValue && 'end' in state.tempValue) {
      return state.tempValue
    } else {
      return state.tempValue
    }
  }, [state.tempValue])

  const hasValue = !!displayValue

  const handleDateSelect = (date: any) => {
    if (mode === 'single') {
      selectDate(date)
    } else if (mode === 'range') {
      if (!state.selectedRange || (state.selectedRange.start && state.selectedRange.end)) {
        // Start new range
        startNewRange(date)
      } else if (state.selectedRange.start && !state.selectedRange.end) {
        // Complete range
        const start = state.selectedRange.start
        if (comparePersianDates(date, start) < 0) {
          // Selected date is before start, swap them
          selectRange(date, start)
        } else {
          // Selected date is after start, complete range
          selectRange(start, date)
        }
      }
    }
  }

  const handlePresetSelect = (preset: any) => {
    selectPreset(preset)
  }

  const handleClear = () => {
    clearSelection()
    onClear?.()
  }

  const handleAccept = () => {
    accept()
    onAccept?.(displayValue)
  }

  const handleCancel = () => {
    cancel()
    onCancel?.()
  }

  const handleOpen = () => {
    if (!disabled) {
      open()
      onOpen?.()
    }
  }

  const handleClose = () => {
    close()
    onClose?.()
  }

  return (
    <div className={cn('w-full', className?.container)} style={{ width }}>
      <PersianDatePickerTrigger
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        onClick={handleOpen}
        onClear={handleClear}
        className={className?.trigger}
        icon={icon}
        clearIcon={clearIcon}
      />

      <PersianDatePickerDialog isOpen={state.isOpen} onClose={handleClose} className={className?.dialog}>
        <div className={cn('flex flex-col', className?.content)}>
          {/* Presets */}
          {withPresets && presets.length > 0 && (
            <PersianDatePickerPresets
              presets={presets}
              activePreset={state.activePreset}
              onPresetSelect={handlePresetSelect}
              className={className?.presetButtons}
            />
          )}

          {/* Header */}
          <PersianDatePickerHeader
            currentMonth={state.currentMonth}
            currentYear={state.currentYear}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            onPreviousYear={goToPreviousYear}
            onNextYear={goToNextYear}
            onToggleMonthYearPicker={toggleMonthYearPicker}
            showMonthYearPicker={state.showMonthYearPicker}
            className={className?.header}
          />

          {/* Month/Year Picker */}
          {state.showMonthYearPicker && (
            <PersianDatePickerMonthYear
              currentMonth={state.currentMonth}
              currentYear={state.currentYear}
              onMonthSelect={goToMonth}
              onYearSelect={goToYear}
              onClose={() => toggleMonthYearPicker()}
              className={className?.monthYearPicker}
            />
          )}

          {/* Calendar */}
          {!state.showMonthYearPicker && (
            <PersianDatePickerCalendar
              currentMonth={state.currentMonth}
              currentYear={state.currentYear}
              selectedDate={state.selectedDate}
              selectedRange={state.selectedRange}
              selectedDates={state.selectedDates}
              onDateSelect={handleDateSelect}
              isDateDisabled={isDateDisabled}
              showWeekNumbers={false}
              className={className?.calendar}
            />
          )}

          {/* Time Picker */}
          {withTime && state.showTimePicker && (
            <PersianDatePickerTime
              selectedDate={state.selectedDate}
              onTimeChange={selectDate}
              showSeconds={showSeconds}
              timeFormat={timeFormat}
              className={className?.timePicker}
            />
          )}

          {/* Footer */}
          <PersianDatePickerFooter
            onClear={handleClear}
            onAccept={handleAccept}
            onCancel={handleCancel}
            showClearButton={showClearButton}
            showAcceptButton={showAcceptButton}
            showCancelButton={showCancelButton}
            hasValue={hasValue}
            className={className?.footer}
          />
        </div>
      </PersianDatePickerDialog>

      {/* Error/Message Display */}
      {(error || message) && <div className={cn('mt-2 text-sm', error ? 'text-error' : 'text-muted-foreground')}>{error || message}</div>}
    </div>
  )
})

PersianDatePicker.displayName = 'PersianDatePicker'

export default PersianDatePicker
