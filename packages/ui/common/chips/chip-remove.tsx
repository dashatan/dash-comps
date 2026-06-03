import { cn } from '@/lib'
import { X } from 'lucide-react'

export type ChipRemoveProps = {
  val: string | number
  valName?: string | number
  active: boolean
  onRemove?: (val: string | number, key?: string | number) => void
}

export default function ChipRemove({ active, val, valName, onRemove }: ChipRemoveProps) {
  return (
    <div
      className={cn(
        'flex h-8 items-center justify-center gap-2 px-1',
        'cursor-pointer rounded-full border',
        'text-sm font-medium select-none',
        active ? 'border-primary bg-secondary text-primary' : 'border-border bg-muted text-muted-foreground'
      )}
    >
      <span className='px-2'>{val}</span>
      {active && (
        <button
          type='button'
          className='hover:bg-secondary flex h-6 w-6 items-center justify-center rounded-full'
          onClick={() => onRemove?.(val, valName)}
          aria-label='Remove'
        >
          <X className='text-primary h-4 w-4' />
        </button>
      )}
    </div>
  )
}
