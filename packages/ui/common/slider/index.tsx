'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib'

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    thumbClassName?: string
    thumbProps?: SliderPrimitive.SliderThumbProps
    trackClassName?: string
    rangeClassName?: string
  }
>(({ className, thumbClassName, trackClassName, rangeClassName, thumbProps, ...props }, ref) => {
  const thumbClass = cn(
    'block h-5 w-5 rounded-full border-2 bg-slate-600 cursor-pointer',
    'focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
    thumbClassName
  )
  return (
    <SliderPrimitive.Root ref={ref} className={cn('relative flex w-full cursor-pointer touch-none items-center select-none', className)} {...props}>
      <SliderPrimitive.Track className={cn('relative h-2 w-full grow overflow-hidden rounded-full bg-slate-300 transition-all', trackClassName)}>
        <SliderPrimitive.Range className={cn('absolute h-full bg-slate-600', rangeClassName)} />
      </SliderPrimitive.Track>
      {props.children}
      <SliderPrimitive.Thumb {...thumbProps} className={thumbClass} />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
export { RangeSlider } from './range-slider'
export type { RangeSliderProps, RangeSliderStep } from './range-slider'
