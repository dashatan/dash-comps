import Badge from '@/components/common/badge/badge'
import { cn } from '@/lib'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NotificationBell() {
  const notifications = []
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (notifications?.length) {
      setShake(true)
      setTimeout(() => {
        setShake(false)
      }, 3000)
    }
  }, [notifications])

  return (
    <div>
      <div className={cn('relative flex cursor-pointer flex-row-reverse items-center', {})}>
        {!!notifications?.length && (
          <Badge className='text-2xs dir-ltr absolute -top-2.5 -right-2.5 z-20 h-6 w-6 min-w-6' size='sm'>
            {notifications.length > 99 ? '+99' : notifications.length}
          </Badge>
        )}
        <div
          className='flex size-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-gray-100 transition-all hover:bg-gray-200'
          onClick={() => {}}
        >
          <Bell size='32' className='text-sidebar-foreground fill-current' />
        </div>
      </div>
    </div>
  )
}
