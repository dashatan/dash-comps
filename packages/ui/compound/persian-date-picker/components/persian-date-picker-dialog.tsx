'use client'

import { memo } from 'react'
import { cn } from '@/lib'
import { Dialog, DialogContent } from '@/components/common/overlay/dialog'
import { PersianDatePickerDialogProps } from '../types'

const PersianDatePickerDialog = memo<PersianDatePickerDialogProps>(({ isOpen, onClose, className, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn('h-auto max-h-[90vh] w-auto max-w-4xl gap-0 overflow-auto p-0', 'persian-date-picker-dialog', className)}>
        <div dir='rtl' className='persian-date-picker'>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
})

PersianDatePickerDialog.displayName = 'PersianDatePickerDialog'

export default PersianDatePickerDialog
