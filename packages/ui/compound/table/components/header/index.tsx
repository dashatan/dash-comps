import { cn } from '@/lib'
import { ColumnProps, TableProps } from '../../types'
import { HeaderRows, type HeaderRowsProps } from './header-rows'

export type TableHeaderProps = HeaderRowsProps

export default function Header(props: TableHeaderProps) {
  return (
    <thead
      className={cn(
        '[&>th]:last:border-b [&>th:first-child]:first:rounded-tr-md [&>th:last-child]:first:rounded-tl-md',
        'border-table-border sticky top-0 z-[2] border-b',
      )}
    >
      <HeaderRows {...props} />
    </thead>
  )
}
