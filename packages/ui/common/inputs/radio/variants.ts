import { cva } from 'class-variance-authority'

export const radioContainerVariants = cva('relative flex ', {
  variants: {
    size: {
      sm: 'gap-1 text-xs',
      md: 'gap-2 text-sm',
      lg: 'gap-4 text-base',
      undefined: 'gap-4 text-base',
    },
    direction: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    size: 'md',
    direction: 'horizontal',
  },
})

export const radioVariants = cva(
  'w-full flex-1 items-center justify-center whitespace-nowrap cursor-pointer rounded-md border bg-input flex  transition-all duration-300 ',
  {
    variants: {
      active: {
        true: 'bg-primary/20 border-primary ',
        false: 'hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-background',
      },
      size: {
        sm: 'gap-1 p-1 text-xs',
        md: 'gap-2 p-2 text-sm',
        lg: 'gap-4 p-4 text-base',
        undefined: 'gap-4 p-4 text-base',
      },
    },
    defaultVariants: {
      active: false,
      size: 'md',
    },
  }
)

export const radioCircleContainerVariants = cva('relative -mt-0.5 h-full min-w-4', {
  variants: {
    size: {
      sm: 'gap-1 p-1 text-xs',
      md: 'gap-2 p-2 text-sm',
      lg: 'gap-4 p-4 text-base',
      undefined: 'gap-4 p-4 text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const radioCircleVariants = cva('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 opacity-0', {
  variants: {
    size: {
      sm: 'w-3',
      md: 'w-4',
      lg: 'w-5',
      undefined: 'w-4',
    },
    active: {
      true: '',
      false: '',
    },
    checked: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      active: true,
      checked: true,
      className: 'opacity-100 text-primary',
    },
    {
      active: false,
      checked: false,
      className: 'opacity-100',
    },
  ],
  defaultVariants: {
    size: 'md',
    active: false,
    checked: false,
  },
})
