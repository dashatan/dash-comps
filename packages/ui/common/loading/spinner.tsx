import { cn } from '@/lib'
import { Loader2 } from 'lucide-react'
interface SpinnerLoadingProps {
  className?: string
}
export default function SpinnerLoading({ className }: SpinnerLoadingProps) {
  return (
    <div className={cn('bg-accent/30', 'absolute top-0 left-0 flex h-full w-full items-center justify-center', className)}>
      <Loader2 className='animate-spin' size={24} />
    </div>
  )
}
