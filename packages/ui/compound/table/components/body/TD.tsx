import { ColumnProps } from '@/components/compound/table/types'
import SkeletonField from './skeleton'
import { forwardRef, memo, useCallback, useRef } from 'react'
import { cn, useLanguage } from '@/lib'
import { toast } from '@/components/common/sonner'

export interface TDProps {
  loading?: boolean
  data: any
  rowIndex: number
  index?: number
  col: ColumnProps
  children?: React.ReactNode
  className?: { td?: string; content?: string }
  columnHover?: boolean
  hoveredColumnIndex?: number | null
  draggable?: boolean
  onColumnHover?: (index: number | null) => void
  skeletonClassName?: string
}

const TD = forwardRef<HTMLTableCellElement, TDProps>(
  ({ data, rowIndex, col, loading, children, className, columnHover, hoveredColumnIndex, onColumnHover, index, skeletonClassName, ...props }, ref) => {
    const localRef = useRef<HTMLTableCellElement>(null)

    const showSkeleton = loading && (col.body || col.bodyElement)
    let { body, bodyClassName } = col
    let Body = <></>
    if (showSkeleton) {
      Body = (
        <div className={skeletonClassName}>
          <SkeletonField />
        </div>
      )
    } else if (typeof body === 'string') {
      Body = <span>{body}</span>
    } else if (body) {
      Body = (body as any)(data)
    } else if (col.bodyElement) {
      const El = col.bodyElement
      Body = <El data={data} options={{ column: El.prototype, field: col.field || '', rowIndex: rowIndex }} />
    }

    const isHovered = columnHover && hoveredColumnIndex === index

    return (
      <td
        ref={(node) => {
          localRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        className={cn(
          'border-table-border h-16 overflow-hidden border-b px-2 whitespace-nowrap',
          'group-last:border-b-0',
          {
            'pointer-events-none': loading,
            'bg-table-row': isHovered,
            '**:overflow-hidden **:text-ellipsis **:whitespace-nowrap': col.width,
          },
          className?.td,
          bodyClassName?.td
        )}
        style={{
          ...(col.frozen && { position: 'sticky', [col.frozen.pos]: col.frozen.distance, zIndex: 1 }),
          ...(col.width && { minWidth: col.width, maxWidth: col.width }),
        }}
        onMouseEnter={columnHover && onColumnHover && index !== undefined ? () => onColumnHover(index) : undefined}
        onMouseLeave={columnHover && onColumnHover ? () => onColumnHover(null) : undefined}
      >
        {children || (
          <div className={cn('text-foreground text-right text-base font-medium', className?.content, bodyClassName?.content, col.className)}>{Body}</div>
        )}
      </td>
    )
  }
)

export default memo(TD)
