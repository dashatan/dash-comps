import { cn } from '@/lib'

export type FadeAbleProps = Pick<React.HTMLAttributes<HTMLDivElement>, 'children' | 'className'> & {
  isVisible: boolean
}

export default function FadeAble({ isVisible, children, className }: FadeAbleProps) {
  return isVisible ? <div className={cn('animate-fade transition-all duration-500', className)}>{children}</div> : <></>
}
