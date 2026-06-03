import { cn } from '@/lib'
import { Check } from 'lucide-react'

export type ChipSelectProps = {
  text?: string | number
  val?: string | number | any
  active: boolean
  disabled?: boolean
  onSelect: (val?: any) => void
  className?: string
  iconClassName?: string
  id?: string
}

export default function ChipSelect({ id, text, val, active, disabled, onSelect, className, iconClassName }: ChipSelectProps) {
  return (
    <button
      type='button'
      id={id}
      className={cn(
        'bg-input flex h-8 cursor-pointer items-center justify-center gap-1 px-4',
        'relative rounded-full border text-sm font-medium select-none',
        'hover:ring-primary hover:ring-offset-background transition-all hover:ring-2 hover:ring-offset-2',
        {
          'bg-primary/25 border-primary': active && !disabled,
          'cursor-not-allowed opacity-50': disabled,
        },
        className
      )}
      onClick={() => !disabled && onSelect(val)}
      disabled={disabled}
    >
      <span className='px-1'>{text}</span>
    </button>
  )
}
