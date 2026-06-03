'use client'

import BasicTextInput from '@/components/common/inputs/text/basic'
import { ReactNode } from 'react'

export type PrefixedTextInputProps = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'min' | 'max'> & {
  label?: string
  prefix?: string | ReactNode
  value?: string | number
  onChange?: (value: string | number) => void
}

export default function PrefixedTextInput(props: PrefixedTextInputProps) {
  return (
    <div>
      <span className='text-xs'>{props.label}</span>
      <div className='border-border flex h-10 min-w-32 overflow-hidden rounded-md border'>
        <div>
          <BasicTextInput
            value={props.value}
            onChange={(e) => props.onChange && props.onChange(e.target.value)}
            className='px-2'
            type={props.type}
            min={props.min}
            max={props.max}
          />
        </div>
        <div className='border-border bg-muted flex h-full min-w-10 items-center justify-center border-s text-xs'>{props.prefix}</div>
      </div>
    </div>
  )
}
