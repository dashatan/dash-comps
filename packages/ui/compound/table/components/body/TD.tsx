import { ColumnProps } from '../../types'
import SkeletonField from './skeleton'
import { forwardRef, memo, useRef, type ReactNode } from 'react'
import { cn } from '@/lib'
import { getFrozenStickySide } from '../../utils/frozen-columns'

export interface TDProps {
  loading?: boolean
  data: Record<string, unknown>
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
  ({ data, rowIndex, col, loading, children, className, columnHover, hoveredColumnIndex, onColumnHover, index, skeletonClassName }, ref) => {
    const localRef = useRef<HTMLTableCellElement>(null)

    const showSkeleton = loading && (col.body || col.bodyElement)
    const { body, bodyClassName } = col
    let Body: ReactNode = null
    if (showSkeleton) {
      Body = (
        <div className={skeletonClassName}>
          <SkeletonField />
        </div>
      )
    } else if (typeof body === 'string') {
      Body = <span>{body}</span>
    } else if (typeof body === 'function') {
      Body = body(data, { column: col, field: col.field ?? '', rowIndex })
    } else if (col.bodyElement) {
      const El = col.bodyElement
      Body = <El data={data} options={{ column: col, field: col.field || '', rowIndex }} />
    }

    const isHovered = columnHover && hoveredColumnIndex === index
    const stickySide = col.frozen ? getFrozenStickySide(col.frozen) : undefined

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
          'border-table-border h-16 overflow-hidden border-b px-2 whitespace-nowrap transition-colors duration-200',
          'group-last:border-b-0',
          {
            'pointer-events-none': loading,
            'bg-table-row': isHovered,
            '**:overflow-hidden **:text-ellipsis **:whitespace-nowrap': col.width,
            'bg-table group-hover:bg-table-row': !!col.frozen,
            'shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.2)]': col.frozen?.edge && stickySide === 'right',
            'shadow-[6px_0_8px_-6px_rgba(0,0,0,0.2)]': col.frozen?.edge && stickySide === 'left',
          },
          className?.td,
          bodyClassName?.td,
        )}
        style={{
          ...(col.frozen &&
            stickySide && {
              position: 'sticky',
              [stickySide]: col.frozen.distance ?? 0,
              zIndex: 1,
            }),
        }}
        onMouseEnter={columnHover && onColumnHover && index !== undefined ? () => onColumnHover(index) : undefined}
        onMouseLeave={columnHover && onColumnHover ? () => onColumnHover(null) : undefined}
      >
        {children || (
          <div
            data-slot="body-cell-content"
            className={cn('text-foreground text-right text-base font-medium', className?.content, bodyClassName?.content, col.className)}
          >
            {Body}
          </div>
        )}
      </td>
    )
  },
)

export default memo(TD)
