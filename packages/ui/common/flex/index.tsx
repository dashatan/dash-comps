import { cn } from '@/lib'
import { ReactNode, forwardRef } from 'react'

export interface FlexContainerProps {
  /** Main content of the flex container */
  children?: ReactNode
  /** Custom class names for different levels of the flex container */
  className?: {
    /** Class name for the outer container */
    container?: string
    /** Class name for the inner flex container */
    flex?: string
  }
  /** Optional aria-label for accessibility */
  'aria-label'?: string
  /** Flex direction for the container */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  /** Justify content alignment */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  /** Align items alignment */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  /** Flex wrap behavior */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  /** Gap between flex items */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * FlexContainer component that provides a flexible layout structure
 * @param props - FlexContainer component props
 * @returns A responsive flex layout
 */
export const FlexContainer = forwardRef<HTMLDivElement, FlexContainerProps>(
  ({ className, children, 'aria-label': ariaLabel, direction = 'row', justify = 'start', align = 'start', wrap = 'wrap', gap = 'md' }, ref) => {
    const directionClasses = {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    }

    const justifyClasses = {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    }

    const alignClasses = {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    }

    const wrapClasses = {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse',
    }

    const gapClasses = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full flex-1',
          directionClasses[direction],
          justifyClasses[justify],
          alignClasses[align],
          wrapClasses[wrap],
          gapClasses[gap],
          className?.container
        )}
        role='group'
        aria-label={ariaLabel}
      >
        <div
          className={cn(
            'flex w-full flex-1',
            directionClasses[direction],
            justifyClasses[justify],
            alignClasses[align],
            wrapClasses[wrap],
            gapClasses[gap],
            'max-w-[1920px] p-4',
            className?.flex
          )}
          role='group'
        >
          {children}
        </div>
      </div>
    )
  }
)

FlexContainer.displayName = 'FlexContainer'

export interface FlexCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional variant for different card styles */
  variant?: 'default' | 'elevated' | 'outlined'
  /** Flex basis for the card (how much space it should take) */
  basis?: 'auto' | 'full' | '1/2' | '1/3' | '1/4' | '1/5' | '1/6' | 'none'
  /** Flex grow behavior */
  grow?: boolean
  /** Flex shrink behavior */
  shrink?: boolean
}

/**
 * FlexCard component for displaying content in a card format within flex layout
 * @param props - FlexCard component props
 * @returns A card component within the flex container
 */
export const FlexCard = forwardRef<HTMLDivElement, FlexCardProps>(
  ({ variant = 'default', basis = 'auto', grow = false, shrink = true, className, ...props }, ref) => {
    const basisClasses = {
      none: 'flex-none',
      auto: 'flex-auto',
      full: 'flex-1',
      '1/2': 'flex-[0_0_50%]',
      '1/3': 'flex-[0_0_33.333333%]',
      '1/4': 'flex-[0_0_25%]',
      '1/5': 'flex-[0_0_20%]',
      '1/6': 'flex-[0_0_16.666667%]',
    }

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          'dir-rtl flex w-full flex-col gap-6 overflow-hidden rounded-xl border p-4',
          basisClasses[basis],
          grow && 'grow',
          !shrink && 'shrink-0',
          variant === 'default' && 'border-border bg-card text-card-foreground',
          variant === 'elevated' && 'border-border bg-popover text-popover-foreground shadow-sm',
          variant === 'outlined' && 'border-primary text-foreground border-2 bg-transparent',
          className
        )}
      />
    )
  }
)

FlexCard.displayName = 'FlexCard'

export interface FlexHeaderProps {
  /** Predefined icon */
  Icon?: ReactNode
  /** Main header text */
  title: string
  /** Optional subtitle text */
  subtitle?: string
  /** Optional additional text to display next to title */
  additionalText?: string
  /** Header alignment */
  align?: 'left' | 'center' | 'right'
  /** Custom class name for the header */
  className?: string
  /** Extra elements to display in the header */
  extraElements?: ReactNode
}

/**
 * FlexHeader component for displaying section headers with icons
 * @param props - FlexHeader component props
 * @returns A header component with icon and text
 */
export const FlexHeader = forwardRef<HTMLDivElement, FlexHeaderProps>(
  ({ Icon, title, subtitle, additionalText, align = 'left', className, extraElements }, ref) => {
    const alignClasses = {
      left: 'items-start',
      center: 'items-center',
      right: 'items-end',
    }

    return (
      <div ref={ref} className={cn('flex items-center gap-4', alignClasses[align], className)}>
        <div className='border-border bg-card text-sidebar-icon flex h-10 w-10 items-center justify-center rounded-lg border'>{Icon}</div>
        <div className='flex flex-col'>
          <div className='flex items-center gap-1'>
            <span className='text-foreground font-semibold'>{title}</span>
            {additionalText && (
              <span className='text-muted-foreground text-sm font-semibold'>
                {'( '}
                {additionalText}
                {' )'}
              </span>
            )}
          </div>
          {subtitle && <div className='text-muted-foreground text-xs'>{subtitle}</div>}
        </div>
        <div className='ms-auto flex items-center gap-2'>{extraElements}</div>
      </div>
    )
  }
)

FlexHeader.displayName = 'FlexHeader'

export interface FlexItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flex basis for the item */
  basis?: 'auto' | 'full' | '1/2' | '1/3' | '1/4' | '1/5' | '1/6' | 'none'
  /** Flex grow behavior */
  grow?: boolean
  /** Flex shrink behavior */
  shrink?: boolean
  /** Order of the item */
  order?: number
}

/**
 * FlexItem component for individual flex items
 * @param props - FlexItem component props
 * @returns A flex item component
 */
export const FlexItem = forwardRef<HTMLDivElement, FlexItemProps>(({ basis = 'auto', grow = false, shrink = true, order, className, ...props }, ref) => {
  const basisClasses = {
    none: 'flex-none',
    auto: 'flex-auto',
    full: 'flex-1',
    '1/2': 'flex-[0_0_50%]',
    '1/3': 'flex-[0_0_33.333333%]',
    '1/4': 'flex-[0_0_25%]',
    '1/5': 'flex-[0_0_20%]',
    '1/6': 'flex-[0_0_16.666667%]',
  }

  return (
    <div
      ref={ref}
      {...props}
      className={cn('flex', basisClasses[basis], grow && 'flex-grow', !shrink && 'flex-shrink-0', order !== undefined && `order-${order}`, className)}
    />
  )
})

FlexItem.displayName = 'FlexItem'
