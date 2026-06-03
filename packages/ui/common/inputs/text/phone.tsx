'use client'

import { forwardRef, useCallback, useRef, useState, RefObject, useEffect } from 'react'
import { cn } from '@/lib'
import TextInput, { TextInputProps } from '@/components/common/inputs/text'
import { Phone } from 'lucide-react'
import { LabelContainerProps, LabelContainerClassName } from '@/components/common/inputs/select/types'

// Types
export type PhoneInputProps = TextInputProps & {
  /** Unique identifier for the input */
  id?: string
  /** Label text for the input */
  label?: string
  /** Custom class name for the label container */
  labelClassName?: LabelContainerClassName
  /** Status of the input (error, success, etc.) */
  status?: LabelContainerProps['status']
  /** Message to display below the input */
  message?: string
  /** Callback when input value changes */
  onChange?: (val: string) => void
  /** Whether the input is required */
  required?: boolean
  /** Current value of the input */
  value?: string
  /** Custom class name for the input */
  className?: string
}

// Constants
const PHONE_REGEX = /^0?9\d{9}$/
const MAX_LENGTH = 11

// Utility functions
const cleanPhoneNumber = (value: string): string => value.replace(/\D/g, '')
const isValidIranianPhoneNumber = (phone: string): boolean => PHONE_REGEX.test(phone)

// Custom hooks
const usePhoneInputState = (initialValue: string) => {
  const [internalValue, setInternalValue] = useState(cleanPhoneNumber(initialValue))
  const [isValid, setIsValid] = useState(true)
  const [isFocused, setIsFocused] = useState(false)

  const updateValue = useCallback((newValue: string) => {
    const cleanValue = cleanPhoneNumber(newValue)
    setInternalValue(cleanValue)
    return cleanValue
  }, [])

  const validateValue = useCallback((value: string) => {
    const isValid = isValidIranianPhoneNumber(value)
    setIsValid(isValid)
    return isValid
  }, [])

  return {
    internalValue,
    isValid,
    isFocused,
    setInternalValue,
    setIsFocused,
    updateValue,
    validateValue,
  }
}

// Component
const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({ onChange, value = '', ...props }, forwardedRef) => {
  const localRef = useRef<HTMLInputElement>(null)
  const ref = (forwardedRef as RefObject<HTMLInputElement>) || localRef
  const { internalValue, isValid, isFocused, setInternalValue, setIsFocused, updateValue, validateValue } = usePhoneInputState(value)

  // Sync with external value
  useEffect(() => {
    const cleanValue = updateValue(value)
    validateValue(cleanValue)
  }, [value, updateValue, validateValue])

  const handleChange = useCallback(
    (val: string) => {
      const cleanValue = cleanPhoneNumber(val)
      setInternalValue(cleanValue)
      validateValue(cleanValue)
      onChange?.(cleanValue)
    },
    [onChange, setInternalValue, validateValue]
  )

  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])
  return (
    <TextInput
      {...props}
      value={internalValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn('dir-ltr h-full w-full px-2 pt-0.5 text-base', 'focus-visible:outline-none', props.className)}
      type='tel'
      inputMode='numeric'
      pattern='[0-9]*'
      maxLength={MAX_LENGTH}
      suffix={
        <div className='flex h-full w-10 items-center justify-center'>
          <Phone size={20} />
        </div>
      }
    />
  )
})

PhoneInput.displayName = 'PhoneInput'

export default PhoneInput
