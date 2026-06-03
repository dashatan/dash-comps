import { cva } from 'class-variance-authority'

export const cardVariants = cva('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', {
  variants: {
    variant: {
      default: 'border-border',
      ghost: 'border-transparent shadow-none',
      outline: 'border-border bg-transparent',
    },
    size: {
      default: 'p-6',
      sm: 'p-4',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})
