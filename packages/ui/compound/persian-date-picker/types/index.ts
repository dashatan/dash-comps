'use client'

import { ReactNode } from 'react'
import { LabelContainerProps } from '@/components/common/inputs/select/types'
import { PersianDate, PersianDateRange, PersianDatePreset } from '../utils/persian-date-utils'

export interface PersianDatePickerProps {
  // Basic props
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  message?: string
  status?: LabelContainerProps['status']

  // Value props
  value?: PersianDate | PersianDateRange
  onChange?: (value: PersianDate | PersianDateRange | null) => void

  // Mode props
  mode?: 'single' | 'range' | 'multiple'
  withTime?: boolean
  timeFormat?: '12h' | '24h'

  // Preset props
  withPresets?: boolean
  presets?: PersianDatePreset[]
  customPresets?: PersianDatePreset[]

  // UI props
  showClearButton?: boolean
  showAcceptButton?: boolean
  showCancelButton?: boolean
  autoClose?: boolean
  closeOnSelect?: boolean

  // Styling props
  className?: PersianDatePickerClassName
  labelContainerProps?: Omit<LabelContainerProps, 'hasValue' | 'ref'>
  width?: number | string

  // Icon props
  icon?: ReactNode
  triggerIcon?: ReactNode
  calendarIcon?: ReactNode
  timeIcon?: ReactNode
  clearIcon?: ReactNode

  // Localization props
  locale?: 'fa' | 'en'
  rtl?: boolean

  // Validation props
  minDate?: PersianDate
  maxDate?: PersianDate
  disabledDates?: PersianDate[]
  disabledDays?: number[] // 0-6 (Sunday-Saturday)

  // Advanced props
  allowPast?: boolean
  allowFuture?: boolean
  allowToday?: boolean
  showWeekNumbers?: boolean
  showMonthYearPicker?: boolean
  showTimePicker?: boolean
  showSeconds?: boolean

  // Callback props
  onOpen?: () => void
  onClose?: () => void
  onDateChange?: (date: PersianDate) => void
  onRangeChange?: (range: PersianDateRange) => void
  onPresetSelect?: (preset: PersianDatePreset) => void
  onClear?: () => void
  onAccept?: (value: PersianDate | PersianDateRange | null) => void
  onCancel?: () => void
}

export interface PersianDatePickerClassName {
  // Container classes
  container?: string
  wrapper?: string
  trigger?: string
  dialog?: string
  content?: string

  // Header classes
  header?: string
  title?: string
  presetButtons?: string
  presetButton?: string
  activePresetButton?: string

  // Calendar classes
  calendar?: string
  calendarHeader?: string
  monthYearPicker?: string
  monthYearButton?: string
  navigation?: string
  navButton?: string
  navButtonPrev?: string
  navButtonNext?: string

  // Week classes
  weekHeader?: string
  weekDay?: string
  weekNumber?: string

  // Day classes
  days?: string
  day?: string
  dayButton?: string
  dayToday?: string
  daySelected?: string
  dayRangeStart?: string
  dayRangeEnd?: string
  dayInRange?: string
  dayDisabled?: string
  dayOtherMonth?: string

  // Time classes
  timePicker?: string
  timeSection?: string
  timeLabel?: string
  timeInput?: string
  timeSeparator?: string

  // Footer classes
  footer?: string
  actionButtons?: string
  actionButton?: string
  clearButton?: string
  acceptButton?: string
  cancelButton?: string

  // Message classes
  message?: string
  error?: string
}

export interface PersianDatePickerState {
  isOpen: boolean
  selectedDate: PersianDate | null
  selectedRange: PersianDateRange | null
  selectedDates: PersianDate[]
  currentMonth: number
  currentYear: number
  activePreset: string | null
  showTimePicker: boolean
  showMonthYearPicker: boolean
  tempValue: PersianDate | PersianDateRange | null
}

export interface PersianDatePickerContextType {
  props: PersianDatePickerProps
  state: PersianDatePickerState
  setState: (state: Partial<PersianDatePickerState>) => void
  updateState: (updates: Partial<PersianDatePickerState>) => void

  // Actions
  open: () => void
  close: () => void
  toggle: () => void

  // Date actions
  selectDate: (date: PersianDate) => void
  selectRange: (start: PersianDate, end: PersianDate) => void
  selectPreset: (preset: PersianDatePreset) => void
  clearSelection: () => void

  // Navigation actions
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  goToPreviousYear: () => void
  goToNextYear: () => void
  goToMonth: (month: number) => void
  goToYear: (year: number) => void

  // UI actions
  toggleTimePicker: () => void
  toggleMonthYearPicker: () => void

  // Validation
  isDateDisabled: (date: PersianDate) => boolean
  isDateValid: (date: PersianDate) => boolean
  isRangeValid: (range: PersianDateRange) => boolean

  // Formatting
  formatDate: (date: PersianDate) => string
  formatRange: (range: PersianDateRange) => string
  formatTime: (date: PersianDate) => string
}

export interface PersianDatePickerTriggerProps {
  value: PersianDate | PersianDateRange | null
  placeholder: string
  disabled: boolean
  onClick: () => void
  onClear: () => void
  className?: string
  icon?: ReactNode
  clearIcon?: ReactNode
}

export interface PersianDatePickerDialogProps {
  isOpen: boolean
  onClose: () => void
  className?: string
  children: ReactNode
}

export interface PersianDatePickerHeaderProps {
  currentMonth: number
  currentYear: number
  onPreviousMonth: () => void
  onNextMonth: () => void
  onPreviousYear: () => void
  onNextYear: () => void
  onToggleMonthYearPicker: () => void
  showMonthYearPicker: boolean
  className?: string
}

export interface PersianDatePickerCalendarProps {
  currentMonth: number
  currentYear: number
  selectedDate: PersianDate | null
  selectedRange: PersianDateRange | null
  selectedDates: PersianDate[]
  onDateSelect: (date: PersianDate) => void
  isDateDisabled: (date: PersianDate) => boolean
  showWeekNumbers: boolean
  className?: string
}

export interface PersianDatePickerTimeProps {
  selectedDate: PersianDate | null
  onTimeChange: (date: PersianDate) => void
  showSeconds: boolean
  timeFormat: '12h' | '24h'
  className?: string
}

export interface PersianDatePickerPresetsProps {
  presets: PersianDatePreset[]
  activePreset: string | null
  onPresetSelect: (preset: PersianDatePreset) => void
  className?: string
}

export interface PersianDatePickerFooterProps {
  onClear: () => void
  onAccept: () => void
  onCancel: () => void
  showClearButton: boolean
  showAcceptButton: boolean
  showCancelButton: boolean
  hasValue: boolean
  className?: string
}

export interface PersianDatePickerMonthYearProps {
  currentMonth: number
  currentYear: number
  onMonthSelect: (month: number) => void
  onYearSelect: (year: number) => void
  onClose: () => void
  className?: string
}

export interface PersianDatePickerDayProps {
  date: PersianDate
  isSelected: boolean
  isInRange: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  isToday: boolean
  isDisabled: boolean
  isOtherMonth: boolean
  onClick: (date: PersianDate) => void
  className?: string
}

export interface PersianDatePickerTimeInputProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  className?: string
}

export interface PersianDatePickerPresetButtonProps {
  preset: PersianDatePreset
  isActive: boolean
  onClick: (preset: PersianDatePreset) => void
  className?: string
}
