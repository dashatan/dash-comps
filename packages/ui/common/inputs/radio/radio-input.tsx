'use client'

import { cn } from '@/lib'
import { ReactNode, useEffect, useState } from 'react'
import { radioVariants, radioCircleVariants, radioContainerVariants, radioCircleContainerVariants } from './variants'
import { Circle, CircleCheck } from 'lucide-react'

interface RadioItemProps {
  name: string | number
  label?: string
  active?: boolean
  icon?: ReactNode
  size?: RadioInputProps['size']
  className?: string
  showCircle?: boolean
  onClick?: () => void
}

export interface RadioInputProps {
  options?: RadioItemProps[]
  active?: RadioItemProps['name']
  value?: RadioItemProps['name']
  onChange?: (value?: RadioItemProps['name']) => void
  direction?: 'horizontal' | 'vertical'
  size?: 'lg' | 'md' | 'sm'
  className?: string
  id?: string
  showCircle?: boolean
  width?: number | string
}

export default function RadioInput({ value, onChange, id, showCircle, size, direction, className, options, width }: RadioInputProps) {
  const [selectedItem, setSelectedItem] = useState(value)

  useEffect(() => {
    setSelectedItem(value)
  }, [selectedItem])

  function handleClick(name: RadioItemProps['name']) {
    setSelectedItem(name)
    onChange && onChange(name)
  }

  return (
    <div id={id} className={cn(radioContainerVariants({ size, direction }), className)} style={{ width }}>
      {options?.map((option, index) => {
        return (
          <Radio
            key={option.name || index}
            active={option.name === value}
            size={size}
            showCircle={showCircle}
            onClick={() => handleClick(option.name)}
            {...option}
          />
        )
      })}
    </div>
  )
}

function Radio({ active, size, className, showCircle = true, label, icon, name, onClick }: RadioItemProps) {
  return (
    <div id={`radio-option-${name}`} className={cn(radioVariants({ active, size }), className)} onClick={onClick}>
      {showCircle && (
        <div className={radioCircleContainerVariants({ size })}>
          <Circle className={radioCircleVariants({ size, active })} />
          <CircleCheck className={radioCircleVariants({ size, active, checked: true })} />
        </div>
      )}
      {label && <span className='flex-1'>{label}</span>}
      {icon && <span>{icon}</span>}
    </div>
  )
}
