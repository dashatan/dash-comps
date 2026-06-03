import { cva } from 'class-variance-authority'

export const sonnerVariants = cva('toaster group', {
  variants: {
    variant: {
      default: '',
      ghost: 'bg-transparent',
      outline: 'border border-border bg-transparent',
      success: 'bg-success text-foreground',
      error: 'bg-error text-foreground',
      warning: 'bg-warning text-foreground',
      info: 'bg-info text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
