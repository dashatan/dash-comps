'use client'

import * as React from 'react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { cn } from '@/lib'
import { VariantProps } from 'class-variance-authority'
import { collapsibleVariants } from './variants'

export interface CollapsibleProps extends React.ComponentProps<typeof CollapsiblePrimitive.Root>, VariantProps<typeof collapsibleVariants> {
  asChild?: boolean
}

const Collapsible = React.forwardRef<React.ComponentRef<typeof CollapsiblePrimitive.Root>, CollapsibleProps>(({ className, variant, ...props }, ref) => {
  return <CollapsiblePrimitive.Root ref={ref} data-slot='collapsible' className={cn(collapsibleVariants({ variant, className }))} {...props} />
})
Collapsible.displayName = 'Collapsible'

export interface CollapsibleTriggerProps extends React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger> {
  asChild?: boolean
}

const CollapsibleTrigger = React.forwardRef<React.ComponentRef<typeof CollapsiblePrimitive.CollapsibleTrigger>, CollapsibleTriggerProps>(
  ({ className, ...props }, ref) => {
    return <CollapsiblePrimitive.CollapsibleTrigger ref={ref} data-slot='collapsible-trigger' className={cn('w-full', className)} {...props} />
  }
)
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

export interface CollapsibleContentProps extends React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> {
  asChild?: boolean
}

const CollapsibleContent = React.forwardRef<React.ComponentRef<typeof CollapsiblePrimitive.CollapsibleContent>, CollapsibleContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <CollapsiblePrimitive.CollapsibleContent
        ref={ref}
        data-slot='collapsible-content'
        className={cn('data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden', className)}
        {...props}
      />
    )
  }
)
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
