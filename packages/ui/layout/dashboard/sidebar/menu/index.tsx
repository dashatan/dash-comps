import Skeleton from '@/components/common/skeleton'
import CollapsedMenuItem from '@/components/layout/dashboard/sidebar/menu/collapsed-menu'
import ExpandedMenuItem from '@/components/layout/dashboard/sidebar/menu/expanded-menu'
import { MenuItem } from '@/components/layout/dashboard/types'
import { cn } from '@/lib'
import { useState } from 'react'

export type SidebarMenuProps = {
  items: MenuItem[]
  loading?: boolean
  type: 'expanded' | 'collapsed' | 'overlay'
}

export default function SidebarMenu({ items, type, loading }: SidebarMenuProps) {
  return (
    <div
      className={cn('flex flex-col gap-2', {
        'items-center text-center': type === 'collapsed',
      })}
    >
      {!items.length ? (
        <></>
      ) : loading ? (
        Array.from({ length: 6 }).map((_, i) => {
          return <Skeleton key={i} className='h-12' />
        })
      ) : (
        items.map((item, i) => {
          switch (type) {
            case 'expanded':
              return <ExpandedMenuItem {...item} key={i} id={i} />
            case 'collapsed':
              return <CollapsedMenuItem {...item} key={i} />
            default:
              break
          }
        })
      )}
    </div>
  )
}
