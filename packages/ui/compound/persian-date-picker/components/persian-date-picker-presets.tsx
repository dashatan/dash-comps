'use client'

import { memo } from 'react'
import { cn } from '@/lib'
import { PersianDatePickerPresetsProps, PersianDatePickerPresetButtonProps } from '../types'
import { PersianDatePreset } from '../utils/persian-date-utils'

const PersianDatePickerPresetButton = memo<PersianDatePickerPresetButtonProps>(({ preset, isActive, onClick, className }) => {
  return (
    <button
      type='button'
      onClick={() => onClick(preset)}
      className={cn(
        'rounded-md border px-3 py-2 text-sm transition-colors',
        'hover:bg-muted focus:ring-ring focus:ring-2 focus:outline-none',
        isActive ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:border-input-hover'
      )}
    >
      {preset.label}
    </button>
  )
})

PersianDatePickerPresetButton.displayName = 'PersianDatePickerPresetButton'

const PersianDatePickerPresets = memo<PersianDatePickerPresetsProps>(({ presets, activePreset, onPresetSelect, className }) => {
  if (presets.length === 0) return null

  return (
    <div className={cn('border-b p-4', className)}>
      <div className='flex flex-wrap gap-2'>
        {presets.map((preset) => (
          <PersianDatePickerPresetButton key={preset.key} preset={preset} isActive={activePreset === preset.key} onClick={onPresetSelect} />
        ))}
      </div>
    </div>
  )
})

PersianDatePickerPresets.displayName = 'PersianDatePickerPresets'

export default PersianDatePickerPresets
