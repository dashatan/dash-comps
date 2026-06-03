import * as React from 'react'
import { cn } from '@/lib'
import { cva, type VariantProps } from 'class-variance-authority'

const paginatorVariants = cva('mx-auto flex w-full justify-center', {
  variants: {
    variant: {
      default: '',
      ghost: 'bg-transparent',
      outline: 'border border-border bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface PaginatorProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof paginatorVariants> {
  currentPage: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  showEdges?: number
  showAround?: number
}

export const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  showEdges = 2,
  showAround = 2,
  className,
  variant,
  ...rest
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const start = Math.max(1, currentPage - showAround)
    const end = Math.min(totalPages, currentPage + showAround)

    // Add first few pages
    for (let i = 1; i <= showEdges; i++) {
      pages.push(i)
    }

    // Add ellipsis if needed
    if (start > showEdges + 1) {
      pages.push('...')
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      if (i > showEdges && i < totalPages - showEdges + 1) {
        pages.push(i)
      }
    }

    // Add ellipsis if needed
    if (end < totalPages - showEdges) {
      pages.push('...')
    }

    // Add last few pages
    for (let i = totalPages - showEdges + 1; i <= totalPages; i++) {
      pages.push(i)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className={cn(paginatorVariants({ variant }), className)} {...rest}>
      <ul className='flex items-center gap-2'>
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className='px-2'>...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={cn('rounded border px-3 py-1 transition-colors', currentPage === page ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
