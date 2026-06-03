'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib'
import { OTPInputProps } from './types'
import { otpInputVariants } from './variants'

export default function OTPInput({
  id,
  length = 6,
  value = '',
  onChange,
  disabled = false,
  required = false,
  label,
  status,
  message,
  className,
  autoFocus = true,
  allowPaste = true,
  numericOnly = true,
  isLoading = false,
  size = "md",
  width,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(value.split('').slice(0, length))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [isFocused, setIsFocused] = useState<boolean>(false)

  useEffect(() => {
    if (value) {
      setOtp(value.split('').slice(0, length))
    }
  }, [value, length])

  const handleChange = (index: number, value: string) => {
    if (numericOnly && !/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    const otpValue = newOtp.join('')
    onChange?.(otpValue)

    // Move to next input if current input is filled, regardless of whether the value changed
    if (value && index < length - 1) {
      const nextInput = inputRefs.current[index + 1]
      if (nextInput) {
        nextInput.focus()
        nextInput.select()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty and backspace is pressed, move to previous input
        const prevInput = inputRefs.current[index - 1]
        if (prevInput) {
          prevInput.focus()
          prevInput.select()
        }
      } else {
        // Clear current input and stay on it
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
        onChange?.(newOtp.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move to previous input on left arrow
      const prevInput = inputRefs.current[index - 1]
      if (prevInput) {
        prevInput.focus()
        prevInput.select()
      }
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      // Move to next input on right arrow
      const nextInput = inputRefs.current[index + 1]
      if (nextInput) {
        nextInput.focus()
        nextInput.select()
      }
    }
  }

  const handleFocus = (index: number) => {
    setIsFocused(true)
    const input = inputRefs.current[index]
    if (input) {
      input.select()
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleClick = (index: number) => {
    const input = inputRefs.current[index]
    if (input) {
      input.focus()
      input.select()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!allowPaste) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, length)
    if (numericOnly && !/^\d*$/.test(pastedData)) return

    const newOtp = pastedData.split('').slice(0, length)
    setOtp(newOtp)
    onChange?.(newOtp.join(''))

    // Focus the next empty input after paste
    const nextEmptyIndex = newOtp.findIndex((val) => !val)
    if (nextEmptyIndex !== -1) {
      const nextInput = inputRefs.current[nextEmptyIndex]
      if (nextInput) {
        nextInput.focus()
        nextInput.select()
      }
    }
  }

  const rowWidth =
    width === undefined ? undefined : typeof width === "number" ? `${width}px` : width;

  return (
    <div
      className={cn("flex w-fit max-w-full flex-col gap-2", className?.container)}
      style={rowWidth ? { width: rowWidth } : undefined}
    >
      {label ? (
        <label htmlFor={id ?? label} className={cn("text-sm font-medium", className?.label)}>
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          "dir-ltr flex w-fit max-w-full flex-wrap items-center gap-2",
          disabled && "cursor-not-allowed opacity-50",
          isLoading && "animate-pulse",
          className?.cells,
        )}
      >
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            id={`${id}-${index}`}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type='text'
            inputMode={numericOnly ? 'numeric' : 'text'}
            pattern={numericOnly ? '[0-9]*' : undefined}
            maxLength={1}
            value={otp[index] || ''}
            onInput={(e) => handleChange(index, (e.target as HTMLInputElement).value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            onClick={() => handleClick(index)}
            onPaste={handlePaste}
            disabled={disabled || isLoading}
            required={required}
            autoFocus={autoFocus && index === 0}
            className={cn(
              otpInputVariants({
                size,
                status: status ?? "default",
              }),
              className?.input,
            )}
          />
        ))}
      </div>
      {message && (
        <p
          className={cn('text-sm', {
            'text-error': status === 'error',
            'text-warning': status === 'warning',
            'text-success': status === 'success',
            'text-primary': status === 'primary',
            'text-secondary': status === 'secondary',
          })}
        >
          {message}
        </p>
      )}
    </div>
  )
}
