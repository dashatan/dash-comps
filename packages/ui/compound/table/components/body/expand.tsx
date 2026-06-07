import Button from '@/components/common/buttons'
import { BodyElementProps } from '@/components/compound/table/types'
import { cn } from '@/lib'
import { DivProps } from '@/lib/types'
import { ChevronDown } from 'lucide-react'
import { useTableStore } from '@/components/compound/table/context'

export default function ExpandButton({
  key,
  className,
}: BodyElementProps & { key: string | number; className?: string }) {
  const expandedRows = useTableStore((s) => s.expandedRows)
  const toggleExpandedRow = useTableStore((s) => s.toggleExpandedRow)
  const expanded = !!expandedRows && !!key && expandedRows[key]

  function handleClick() {
    if (!key) return
    toggleExpandedRow(key)
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Button severity="input" variant="icon-button" size="md" onClick={handleClick}>
        <ChevronDown className={cn('size-5 transition-all', { 'rotate-180': expanded }, className)} />
      </Button>
    </div>
  )
}

export function DividerHor(props: DivProps) {
  return <div {...props} className={cn('bg-border h-full w-px', props.className)} />
}

export function Section(props: DivProps & { title?: string }) {
  return (
    <div {...props} className={cn('flex h-full w-full items-start gap-2 p-4', props.className)}>
      <span className="text-hint text-xs font-semibold whitespace-nowrap">{props.title} :</span>
      {props.children}
    </div>
  )
}
