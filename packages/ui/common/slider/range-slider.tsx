'use client'

import * as React from 'react'
import { cn } from '@/lib'

export type RangeSliderStep = {
  value: number
  label: string | number
}

export type RangeSliderProps = {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  steps?: number | RangeSliderStep[]
  gradientColors?: string[]
  showLabels?: boolean
  className?: string
  trackClassName?: string
  thumbClassName?: string
  labelClassName?: string
  disabled?: boolean
  color?: string
}

const RangeSlider = React.memo(
  ({
    min,
    max,
    value,
    onChange,
    steps,
    gradientColors = [],
    showLabels = true,
    className,
    trackClassName,
    thumbClassName,
    labelClassName,
    disabled = false,
    color,
  }: RangeSliderProps) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = React.useState<'min' | 'max' | null>(null)
    const [localValue, setLocalValue] = React.useState<[number, number]>(value)
    const lastOnChangeValueRef = React.useRef<[number, number]>(value)
    const minThumbRef = React.useRef<HTMLDivElement>(null)
    const maxThumbRef = React.useRef<HTMLDivElement>(null)
    // Sync local value with prop value
    React.useEffect(() => {
      setLocalValue(value)
      lastOnChangeValueRef.current = value
    }, [value])

    // Calculate step values
    const stepValues = React.useMemo(() => {
      if (!steps) return []
      if (typeof steps === 'number') {
        return Array.from({ length: steps }, (_, i) => {
          const stepValue = min + (i * (max - min)) / (steps - 1)
          return { value: stepValue, label: Math.round(stepValue) }
        })
      }
      return steps
    }, [min, max, steps])

    // Normalize value to 0-100 percentage
    const getPercentage = React.useCallback(
      (val: number) => {
        return ((val - min) / (max - min)) * 100
      },
      [min, max]
    )

    // Get value from percentage
    const getValueFromPercentage = React.useCallback(
      (percentage: number) => {
        const rawValue = min + (percentage / 100) * (max - min)
        if (stepValues.length > 0) {
          // Snap to nearest step
          const nearestStep = stepValues.reduce((prev, curr) => {
            return Math.abs(curr.value - rawValue) < Math.abs(prev.value - rawValue) ? curr : prev
          })
          return nearestStep.value
        }
        return Math.round(rawValue)
      },
      [min, max, stepValues]
    )

    // Calculate positions
    const minPercentage = React.useMemo(() => getPercentage(localValue[0]), [localValue[0], getPercentage])
    const maxPercentage = React.useMemo(() => getPercentage(localValue[1]), [localValue[1], getPercentage])

    // Generate gradient stops
    const gradientStops = React.useMemo(() => {
      if (gradientColors.length === 0) return ''
      if (gradientColors.length === 1) return gradientColors[0]

      const stops = gradientColors.map((color, index) => {
        const percentage = (index / (gradientColors.length - 1)) * 100
        return `${color} ${percentage}%`
      })
      return `linear-gradient(to right, ${stops.join(', ')})`
    }, [gradientColors])

    // Calculate active range gradient (subset of full gradient)
    const activeRangeGradient = React.useMemo(() => {
      if (gradientColors.length === 0) return 'hsl(var(--primary))'
      if (gradientColors.length === 1) return gradientColors[0]

      // Map the active range to the gradient colors
      const rangeSize = max - min
      const activeRangeSize = localValue[1] - localValue[0]
      const activeStartRatio = (localValue[0] - min) / rangeSize
      const activeEndRatio = (localValue[1] - min) / rangeSize

      // Find which gradient color indices correspond to the active range
      const minColorIndex = Math.floor(activeStartRatio * (gradientColors.length - 1))
      const maxColorIndex = Math.ceil(activeEndRatio * (gradientColors.length - 1))

      const activeColors = gradientColors.slice(Math.max(0, minColorIndex), Math.min(gradientColors.length, maxColorIndex + 1))

      if (activeColors.length === 0) return gradientColors[0]
      if (activeColors.length === 1) return activeColors[0]

      const stops = activeColors.map((color, index) => {
        const percentage = (index / (activeColors.length - 1)) * 100
        return `${color} ${percentage}%`
      })
      return `linear-gradient(to right, ${stops.join(', ')})`
    }, [gradientColors, localValue, min, max])

    // Handle mouse/touch events
    const handlePointerDown = React.useCallback(
      (e: React.PointerEvent, thumb: 'min' | 'max') => {
        if (disabled) return
        e.preventDefault()
        setIsDragging(thumb)
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      },
      [disabled]
    )

    const handlePointerMove = React.useCallback(
      (e: PointerEvent) => {
        if (!isDragging || !containerRef.current || disabled) return

        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        const newValue = getValueFromPercentage(percentage)

        let updated: [number, number]
        if (isDragging === 'min') {
          const newMin = Math.min(newValue, localValue[1] - 1)
          updated = [newMin, localValue[1]]
        } else {
          const newMax = Math.max(newValue, localValue[0] + 1)
          updated = [localValue[0], newMax]
        }

        // Only update local value for visual feedback while dragging.
        // We commit to `onChange` only on pointer up (drop).
        setLocalValue(updated)
      },
      [isDragging, localValue, getValueFromPercentage, disabled]
    )

    const handlePointerUp = React.useCallback(() => {
      // Commit final value only when the user drops the pointer.
      if (lastOnChangeValueRef.current[0] !== localValue[0] || lastOnChangeValueRef.current[1] !== localValue[1]) onChange(localValue)
      lastOnChangeValueRef.current = localValue
      setIsDragging(null)
    }, [localValue, onChange])

    // Attach global event listeners
    React.useEffect(() => {
      if (isDragging) {
        window.addEventListener('pointermove', handlePointerMove)
        window.addEventListener('pointerup', handlePointerUp)
        window.addEventListener('pointercancel', handlePointerUp)
        return () => {
          window.removeEventListener('pointermove', handlePointerMove)
          window.removeEventListener('pointerup', handlePointerUp)
          window.removeEventListener('pointercancel', handlePointerUp)
        }
      }
    }, [isDragging, handlePointerMove, handlePointerUp])

    // Shared keyboard handler
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent, thumb: 'min' | 'max') => {
        if (disabled || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return
        e.preventDefault()
        const step = e.key === 'ArrowLeft' ? -1 : 1
        const updated: [number, number] =
          thumb === 'min'
            ? [Math.max(min, Math.min(localValue[1] - 1, localValue[0] + step)), localValue[1]]
            : [localValue[0], Math.min(max, Math.max(localValue[0] + 1, localValue[1] + step))]
        setLocalValue(updated)
        onChange(updated)
      },
      [disabled, min, max, localValue, onChange]
    )

    // Handle track click
    const handleTrackClick = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || isDragging || !containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const newValue = getValueFromPercentage(((e.clientX - rect.left) / rect.width) * 100)
        const isCloserToMin = Math.abs(newValue - localValue[0]) < Math.abs(newValue - localValue[1])
        const updated: [number, number] = isCloserToMin
          ? [Math.min(newValue, localValue[1] - 1), localValue[1]]
          : [localValue[0], Math.max(newValue, localValue[0] + 1)]
        setLocalValue(updated)
        lastOnChangeValueRef.current = updated
        onChange(updated)
      },
      [disabled, isDragging, localValue, onChange, getValueFromPercentage]
    )

    return (
      <div
        className={cn('relative w-full select-none', className)}
        onClick={() => {
          maxThumbRef.current?.focus()
        }}
      >
        {/* Track */}
        <div
          ref={containerRef}
          className={cn(
            'bg-muted relative h-2 w-full cursor-pointer rounded-full transition-colors',
            disabled && 'cursor-not-allowed opacity-50',
            trackClassName
          )}
          onClick={handleTrackClick}
        >
          {/* Gradient background (full track) */}
          {gradientStops && (
            <div
              className='absolute inset-0 rounded-full opacity-20'
              style={{
                background: gradientStops,
              }}
            />
          )}

          {/* Active range with gradient */}
          <div
            className='absolute h-full rounded-full transition-all'
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
              background: activeRangeGradient || 'hsl(var(--primary))',
            }}
          />

          {/* Step markers */}
          {stepValues.length > 0 && stepValues.length <= 31 && (
            <div className='absolute inset-0 flex items-center overflow-hidden'>
              {stepValues.map((step, index) => {
                if (index === 0 || index === stepValues.length - 1) return null
                const stepPercentage = getPercentage(step.value)
                const isActive = step.value >= localValue[0] && step.value <= localValue[1]
                return (
                  <div
                    key={index}
                    className={cn('absolute h-2 w-0.5 -translate-x-1/2 rounded-full transition-colors', isActive ? 'bg-primary/60' : 'bg-foreground/10')}
                    style={{ left: `${stepPercentage}%`, backgroundColor: color }}
                  />
                )
              })}
            </div>
          )}

          {/* Min thumb */}
          <Thumb
            ref={minThumbRef}
            className={thumbClassName}
            style={{ left: `${minPercentage}%`, borderColor: color }}
            onPointerDown={(e) => handlePointerDown(e, 'min')}
            onKeyDown={(e) => handleKeyDown(e, 'min')}
            role='slider'
            disabled={disabled}
            min={min}
            max={max}
            ariaLabel='Minimum value'
            valueNow={localValue[0]}
          />

          {/* Max thumb */}
          <Thumb
            ref={maxThumbRef}
            className={thumbClassName}
            style={{ left: `${maxPercentage}%`, borderColor: color }}
            onPointerDown={(e) => handlePointerDown(e, 'max')}
            onKeyDown={(e) => handleKeyDown(e, 'max')}
            role='slider'
            disabled={disabled}
            min={min}
            max={max}
            ariaLabel='Maximum value'
            valueNow={localValue[1]}
          />
        </div>

        {/* Labels */}
        {showLabels && stepValues.length > 0 && (
          <div className='relative mt-3 h-6'>
            {stepValues.map((step, index) => {
              const stepPercentage = getPercentage(step.value)
              const isActive = step.value >= localValue[0] && step.value <= localValue[1]
              // Show labels for first, last, and every nth step to avoid crowding
              const shouldShowLabel =
                stepValues.length <= 10 || index === 0 || index === stepValues.length - 1 || index % Math.ceil(stepValues.length / 10) === 0

              if (!shouldShowLabel) return null

              return (
                <div
                  key={index}
                  className={cn(
                    'absolute -translate-x-1/2 text-xs font-medium whitespace-nowrap transition-colors',
                    isActive ? 'text-primary font-semibold' : 'text-muted-foreground',
                    labelClassName
                  )}
                  style={{ left: `${stepPercentage}%`, color: color }}
                >
                  {step.label}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)

RangeSlider.displayName = 'RangeSlider'

export { RangeSlider }

const Thumb = React.forwardRef<
  HTMLDivElement,
  {
    className: string
    style: React.CSSProperties
    onPointerDown: (e: React.PointerEvent) => void
    onKeyDown: (e: React.KeyboardEvent) => void
    role: string
    disabled: boolean
    min: number
    max: number
    ariaLabel: string
    valueNow: number
  }
>(({ className, style, onPointerDown, onKeyDown, role, disabled, min, max, ariaLabel, valueNow }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'border-primary bg-background absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 shadow-md transition-all hover:scale-110 active:scale-125 active:cursor-grabbing',
        disabled && 'cursor-not-allowed',
        className
      )}
      style={{ ...style }}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={disabled ? -1 : 0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={valueNow}
      aria-label={ariaLabel}
    />
  )
})
