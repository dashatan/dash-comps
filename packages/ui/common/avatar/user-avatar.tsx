import { User } from '@/features/users-management/types'
import { cn } from '@/lib'

interface UserAvatarProps {
  user?: User
  avatar?: string | null
  size?: number | string
  className?: string
  containerClassName?: string
  showBorder?: boolean
}

/**
 * Reusable component to display user avatar or initial
 * Shows profile image if available, otherwise shows first letter of name or username
 */
export function UserAvatar({ user, avatar, size = 24, className, containerClassName, showBorder = false }: UserAvatarProps) {
  const getInitial = () => {
    if (user?.first_name) {
      return user.first_name[0].toUpperCase()
    }
    if (user?.last_name) {
      return user.last_name[0].toUpperCase()
    }
    if (user?.username) {
      return user.username[0].toUpperCase()
    }
    return 'U'
  }

  const sizeValue = typeof size === 'number' ? `${size}px` : size

  return (
    <div
      className={cn('flex items-center justify-center overflow-hidden rounded-full', showBorder && 'border-border border-2', containerClassName)}
      style={{ width: sizeValue, height: sizeValue, minWidth: sizeValue, minHeight: sizeValue }}
    >
      {avatar ? (
        <img src={avatar} alt='Avatar' className={cn('h-full w-full object-cover', className)} />
      ) : (
        <div className={cn('bg-muted text-muted-foreground flex h-full w-full items-center justify-center font-bold', className)}>{getInitial()}</div>
      )}
    </div>
  )
}
