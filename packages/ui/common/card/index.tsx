import * as React from 'react'
import { cn } from '@/lib'
import { VariantProps } from 'class-variance-authority'
import { cardVariants } from './variants'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, size, ...props }, ref) => {
  return <div ref={ref} data-slot='card' className={cn(cardVariants({ variant, size, className }))} {...props} />
})
Card.displayName = 'Card'

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot='card-header'
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  )
})
CardHeader.displayName = 'CardHeader'

export interface CardTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(({ className, ...props }, ref) => {
  return <div ref={ref} data-slot='card-title' className={cn('leading-none font-semibold', className)} {...props} />
})
CardTitle.displayName = 'CardTitle'

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(({ className, ...props }, ref) => {
  return <div ref={ref} data-slot='card-description' className={cn('text-muted-foreground text-sm', className)} {...props} />
})
CardDescription.displayName = 'CardDescription'

export interface CardActionProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const CardAction = React.forwardRef<HTMLDivElement, CardActionProps>(({ className, ...props }, ref) => {
  return <div ref={ref} data-slot='card-action' className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props} />
})
CardAction.displayName = 'CardAction'

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => {
  return <div ref={ref} data-slot='card-content' className={cn('px-6', className)} {...props} />
})
CardContent.displayName = 'CardContent'

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => {
  return <div ref={ref} data-slot='card-footer' className={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...props} />
})
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
