'use client'

import { useState, useCallback, useMemo } from 'react'
import { PersianDatePickerProps, PersianDatePickerState } from '../types'
import {
  PersianDate,
  PersianDateRange,
  PersianDatePreset,
  getCurrentPersianDate,
  getPersianDatePresets,
  comparePersianDates,
  isPersianDateInRange,
} from '../utils/persian-date-utils'

export function usePersianDatePicker(props: PersianDatePickerProps) {
  const {
    value,
    onChange,
    mode = 'single',
    withTime = false,
    withPresets = true,
    presets = [],
    customPresets = [],
    minDate,
    maxDate,
    disabledDates = [],
    disabledDays = [],
    allowPast = true,
    allowFuture = true,
    allowToday = true,
    showTimePicker = false,
    showMonthYearPicker = false,
    autoClose = false,
    closeOnSelect = false,
    onOpen,
    onClose,
    onDateChange,
    onRangeChange,
    onPresetSelect,
    onClear,
    onAccept,
    onCancel,
  } = props

  const currentDate = getCurrentPersianDate()
  const allPresets = [...getPersianDatePresets(), ...presets, ...customPresets]

  const [state, setState] = useState<PersianDatePickerState>({
    isOpen: false,
    selectedDate: null,
    selectedRange: null,
    selectedDates: [],
    currentMonth: currentDate.month,
    currentYear: currentDate.year,
    activePreset: null,
    showTimePicker: showTimePicker,
    showMonthYearPicker: showMonthYearPicker,
    tempValue: value || null,
  })

  // Update state helper
  const updateState = useCallback((updates: Partial<PersianDatePickerState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  // Open/Close handlers
  const open = useCallback(() => {
    updateState({ isOpen: true })
    onOpen?.()
  }, [updateState, onOpen])

  const close = useCallback(() => {
    updateState({ isOpen: false })
    onClose?.()
  }, [updateState, onClose])

  const toggle = useCallback(() => {
    if (state.isOpen) {
      close()
    } else {
      open()
    }
  }, [state.isOpen, open, close])

  // Date validation
  const isDateDisabled = useCallback(
    (date: PersianDate): boolean => {
      // Check if date is in disabled dates
      if (disabledDates.some((d) => comparePersianDates(d, date) === 0)) {
        return true
      }

      // Check if day of week is disabled
      if (disabledDays.includes(getDayOfWeek(date))) {
        return true
      }

      // Check min/max date constraints
      if (minDate && comparePersianDates(date, minDate) < 0) {
        return true
      }
      if (maxDate && comparePersianDates(date, maxDate) > 0) {
        return true
      }

      // Check past/future constraints
      if (!allowPast && comparePersianDates(date, currentDate) < 0) {
        return true
      }
      if (!allowFuture && comparePersianDates(date, currentDate) > 0) {
        return true
      }

      // Check today constraint
      if (!allowToday && comparePersianDates(date, currentDate) === 0) {
        return true
      }

      return false
    },
    [disabledDates, disabledDays, minDate, maxDate, allowPast, allowFuture, allowToday, currentDate]
  )

  const isDateValid = useCallback(
    (date: PersianDate): boolean => {
      return !isDateDisabled(date)
    },
    [isDateDisabled]
  )

  const isRangeValid = useCallback(
    (range: PersianDateRange): boolean => {
      return isDateValid(range.start) && isDateValid(range.end) && comparePersianDates(range.start, range.end) <= 0
    },
    [isDateValid]
  )

  // Date selection handlers
  const selectDate = useCallback(
    (date: PersianDate) => {
      if (isDateDisabled(date)) return

      updateState({ selectedDate: date, tempValue: date })
      onDateChange?.(date)

      if (closeOnSelect && mode === 'single') {
        setTimeout(() => close(), 100)
      }
    },
    [isDateDisabled, updateState, onDateChange, closeOnSelect, mode, close]
  )

  const selectRange = useCallback(
    (start: PersianDate, end: PersianDate) => {
      if (isDateDisabled(start) || isDateDisabled(end)) return

      const range: PersianDateRange = { start, end }
      if (comparePersianDates(start, end) > 0) {
        range.start = end
        range.end = start
      }

      updateState({
        selectedRange: range,
        tempValue: range,
        selectedDate: null, // Clear single date selection when range is selected
        selectedDates: [], // Clear multiple date selection
      })
      onRangeChange?.(range)

      if (closeOnSelect) {
        setTimeout(() => close(), 100)
      }
    },
    [isDateDisabled, updateState, onRangeChange, closeOnSelect, close]
  )

  // Helper function to start a new range
  const startNewRange = useCallback(
    (date: PersianDate) => {
      if (isDateDisabled(date)) return

      const range: PersianDateRange = { start: date, end: date }
      updateState({
        selectedRange: range,
        tempValue: range,
        selectedDate: null,
        selectedDates: [],
      })
      onRangeChange?.(range)
    },
    [isDateDisabled, updateState, onRangeChange]
  )

  const selectPreset = useCallback(
    (preset: PersianDatePreset) => {
      const presetValue = preset.getValue()

      if (mode === 'single') {
        updateState({
          selectedDate: presetValue.start,
          tempValue: presetValue.start,
          activePreset: preset.key,
        })
        onDateChange?.(presetValue.start)
      } else {
        updateState({
          selectedRange: presetValue,
          tempValue: presetValue,
          activePreset: preset.key,
        })
        onRangeChange?.(presetValue)
      }

      onPresetSelect?.(preset)

      if (autoClose) {
        setTimeout(() => close(), 100)
      }
    },
    [mode, updateState, onDateChange, onRangeChange, onPresetSelect, autoClose, close]
  )

  const clearSelection = useCallback(() => {
    updateState({
      selectedDate: null,
      selectedRange: null,
      selectedDates: [],
      tempValue: null,
      activePreset: null,
    })
    onClear?.()
  }, [updateState, onClear])

  // Navigation handlers
  const goToPreviousMonth = useCallback(() => {
    setState((prev) => {
      let newMonth = prev.currentMonth - 1
      let newYear = prev.currentYear

      if (newMonth < 1) {
        newMonth = 12
        newYear -= 1
      }

      return { ...prev, currentMonth: newMonth, currentYear: newYear }
    })
  }, [])

  const goToNextMonth = useCallback(() => {
    setState((prev) => {
      let newMonth = prev.currentMonth + 1
      let newYear = prev.currentYear

      if (newMonth > 12) {
        newMonth = 1
        newYear += 1
      }

      return { ...prev, currentMonth: newMonth, currentYear: newYear }
    })
  }, [])

  const goToPreviousYear = useCallback(() => {
    setState((prev) => ({ ...prev, currentYear: prev.currentYear - 1 }))
  }, [])

  const goToNextYear = useCallback(() => {
    setState((prev) => ({ ...prev, currentYear: prev.currentYear + 1 }))
  }, [])

  const goToMonth = useCallback(
    (month: number) => {
      updateState({ currentMonth: month, showMonthYearPicker: false })
    },
    [updateState]
  )

  const goToYear = useCallback(
    (year: number) => {
      updateState({ currentYear: year, showMonthYearPicker: false })
    },
    [updateState]
  )

  // UI handlers
  const toggleTimePicker = useCallback(() => {
    setState((prev) => ({ ...prev, showTimePicker: !prev.showTimePicker }))
  }, [])

  const toggleMonthYearPicker = useCallback(() => {
    setState((prev) => ({ ...prev, showMonthYearPicker: !prev.showMonthYearPicker }))
  }, [])

  // Formatting helpers
  const formatDate = useCallback((date: PersianDate): string => {
    // This would use the formatting utility
    return `${date.year}/${date.month.toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}`
  }, [])

  const formatRange = useCallback(
    (range: PersianDateRange): string => {
      return `${formatDate(range.start)} - ${formatDate(range.end)}`
    },
    [formatDate]
  )

  const formatTime = useCallback((date: PersianDate): string => {
    if (date.hour === undefined) return ''
    const hour = date.hour.toString().padStart(2, '0')
    const minute = (date.minute || 0).toString().padStart(2, '0')
    return `${hour}:${minute}`
  }, [])

  // Accept/Cancel handlers
  const accept = useCallback(() => {
    const finalValue = state.tempValue
    onChange?.(finalValue)
    onAccept?.(finalValue)
    close()
  }, [state.tempValue, onChange, onAccept, close])

  const cancel = useCallback(() => {
    updateState({ tempValue: value || null })
    onCancel?.()
    close()
  }, [updateState, value, onCancel, close])

  // Helper function for day of week
  function getDayOfWeek(date: PersianDate): number {
    // This would use the utility function
    return 0 // Placeholder
  }

  return {
    state,
    updateState,
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
    presets: allPresets,
  }
}
