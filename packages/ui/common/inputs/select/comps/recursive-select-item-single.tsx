import { cn } from '@/lib'
import { TreeSelectItem } from '../types'
import { ChevronDown } from 'lucide-react'

export type RecursiveSelectItemSingleProps = {
  selected: number | string | undefined
  opened: (number | string)[]
  onCollapse: (option: TreeSelectItem) => void
  option: TreeSelectItem
  onChange: (option: TreeSelectItem) => void
  depth: number
  last?: boolean
  first?: boolean
}

export function RecursiveSelectItemSingle({ opened, selected, option, onCollapse, onChange, depth, last }: RecursiveSelectItemSingleProps) {
  const hasChildren = !!option.children?.length
  const active = selected === option.value
  const open = opened.includes(option.value)

  return (
    <li>
      <div className={cn('relative flex cursor-pointer items-center py-2')}>
        {depth > 1 && <div className='bg-border h-px w-5' />}
        {depth > 1 && <div className={cn('bg-border absolute top-0 right-0 h-full w-px', { '!h-1/2': last })} />}
        {hasChildren && (
          <span
            className='flex w-8 max-w-8 min-w-8 items-center justify-center'
            onClick={(e) => {
              e.stopPropagation()
              onCollapse(option)
            }}
          >
            <ChevronDown className={cn('scale-75 transition-all', { 'rotate-90': !open })} />
          </span>
        )}
        <div
          className={cn('flex flex-1 items-center gap-3', { 'ps-3': depth > 1 })}
          onClick={(e) => {
            e.stopPropagation()
            onChange(option)
          }}
        >
          <div
            className={cn(
              'border-table-border bg-table-checkbox relative flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-2 transition-all',
              {
                'border-primary': active,
              }
            )}
          >
            {active && <div className='bg-primary absolute h-2 w-2 rounded-full' />}
          </div>
          <div className={cn('flex w-full items-center justify-between text-base select-none')}>
            <span>{option.label}</span>
          </div>
        </div>
      </div>
      {hasChildren && open && (
        <ul className={cn('relative flex flex-col ps-3.5')}>
          {depth > 1 && !last && <div className={cn('bg-border absolute top-0 right-0 h-full w-px')} />}
          {option.children?.map((child, index, array) => {
            return (
              <RecursiveSelectItemSingle
                key={index}
                opened={opened}
                depth={depth + 1}
                selected={selected}
                last={index === array.length - 1}
                option={child}
                onChange={onChange}
                onCollapse={onCollapse}
              />
            )
          })}
        </ul>
      )}
    </li>
  )
}
