'use client'

import { useState } from 'react'
import SelectContainer from '../select/container'
import { SelectContainerProps, SelectItem } from '../select/types'
import ChipSelect from '@/components/common/chips/chip-select'
import PrefixedTextInput from '@/components/common/inputs/text/prefixed'
import { ArrowLeft } from 'lucide-react'

type Option = Omit<SelectItem, 'value'> & { value: { from?: number; to?: number } }

export type WeightInputProps = Omit<SelectContainerProps, 'value'> & {
  options?: Option[]
  value?: { from?: number; to?: number }
  onChange?: (value?: { from?: number; to?: number }) => void
  className?: {
    panelBody?: string
    panelFooter?: string
    item?: string
  }
}

export default function WeightInput({ options, onChange, value, ...props }: WeightInputProps) {
  const [open, setOpen] = useState(false)
  const label =
    (value?.from ? 'از ' + value.from : '') + (value?.to ? 'تا ' + value?.to : '') + 'کیلوگرم'

  function handleChange(option: Option) {
    onChange && onChange({ from: option.value.from, to: option.value.to })
  }

  function handleClear() {
    onChange && onChange()
  }
  return (
    <SelectContainer
      onClear={handleClear}
      {...props}
      value={label}
      open={open}
      onOpenChange={(e) => setOpen(e)}
    >
      <div>
        <div className='flex flex-wrap items-start justify-start gap-2 p-2'>
          {options?.map((option) => {
            return (
              <ChipSelect
                key={option.label}
                active={value?.from === option.value.from && value?.to === option.value.to}
                onSelect={() => handleChange(option)}
                text={option.label}
                val={option.value}
                className='text-xs'
              />
            )
          })}
        </div>

        <div className='flex items-end justify-between border-t border-gray-200 p-4'>
          <PrefixedTextInput
            label='از وزن'
            prefix='کیلوگرم'
            type='number'
            min={0}
            value={value?.from}
            onChange={(v) => {
              const num = parseFloat(v as string)
              onChange && onChange({ from: num, to: value?.to })
            }}
          />
          <div className='flex h-10 w-14 items-center justify-center'>
            <ArrowLeft className='w-4 text-gray-400' />
          </div>
          <PrefixedTextInput
            label='تا وزن'
            prefix='کیلوگرم'
            type='number'
            min={value?.from || 0}
            value={value?.to}
            onChange={(v) => {
              const num = parseFloat(v as string)
              onChange && onChange({ from: value?.from, to: num })
            }}
          />
        </div>
      </div>
    </SelectContainer>
  )
}
