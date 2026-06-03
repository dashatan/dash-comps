import { cn } from '@/lib'

export default function Skeleton(props: React.HTMLProps<HTMLDivElement>) {
  return <div {...props} className={cn('skeleton-shimmer bg-muted/60 h-10 w-full rounded-lg', props.className)}></div>
}
