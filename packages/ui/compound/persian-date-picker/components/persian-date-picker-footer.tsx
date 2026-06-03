'use client'

import { memo } from 'react'
import { cn } from '@/lib'
import { PersianDatePickerFooterProps } from '../types'

const PersianDatePickerFooter = memo<PersianDatePickerFooterProps>(
  ({ onClear, onAccept, onCancel, showClearButton, showAcceptButton, showCancelButton, hasValue, className }) => {
    return (
      <div className={cn('flex items-center justify-between border-t p-4', className)}>
        <div className='flex items-center gap-2'>
          {showClearButton && (
            <button
              type='button'
              onClick={onClear}
              disabled={!hasValue}
              className={cn(
                'rounded-md border px-4 py-2 text-sm transition-colors',
                'hover:bg-muted focus:ring-ring focus:ring-2 focus:outline-none',
                hasValue ? 'bg-background border-input hover:border-input-hover' : 'cursor-not-allowed opacity-50'
              )}
            >
              پاک کردن
            </button>
          )}
        </div>

        <div className='flex items-center gap-2'>
          {showCancelButton && (
            <button
              type='button'
              onClick={onCancel}
              className='border-input bg-background hover:bg-muted focus:ring-ring rounded-md border px-4 py-2 text-sm transition-colors focus:ring-2 focus:outline-none'
            >
              لغو
            </button>
          )}

          {showAcceptButton && (
            <button
              type='button'
              onClick={onAccept}
              className='bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring rounded-md px-4 py-2 text-sm transition-colors focus:ring-2 focus:outline-none'
            >
              تایید
            </button>
          )}
        </div>
      </div>
    )
  }
)

PersianDatePickerFooter.displayName = 'PersianDatePickerFooter'

export default PersianDatePickerFooter
