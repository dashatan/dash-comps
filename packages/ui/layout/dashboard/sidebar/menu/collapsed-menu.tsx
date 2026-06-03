import { usePathname } from 'next/navigation'
import { cn } from '@/lib'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/common/overlay/popover'
import { ChevronLeft } from 'lucide-react'
import { MenuItem } from '@/components/layout/dashboard/types'
import SubMenus from '@/components/layout/dashboard/sidebar/menu/submenus'
import Badge from '@/components/common/badge/badge'

interface CollapsedMenuItemProps extends MenuItem {
  onClick?: (item: MenuItem) => void
}

const useHoverState = (hasChildren: boolean) => {
  const [hover, setHover] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!hasChildren) return

    const timer = setInterval(() => {
      setOpen(hover)
    }, 100)

    return () => clearInterval(timer)
  }, [hover, hasChildren])

  return { hover, setHover, open }
}

const isPathActive = (pathname: string | null, path?: string, pathTags?: string[], children?: MenuItem[]) => {
  if (!pathname) return false

  const basePath = pathname.split('/')[1]

  if (path) {
    const itemBasePath = path.split('/')[1]
    if (basePath === itemBasePath) return true
  }

  if (children?.some((child) => child.path === pathname)) return true

  if (pathTags?.includes(basePath)) return true

  return false
}

export default function CollapsedMenuItem(props: CollapsedMenuItemProps) {
  const { title, path, Icon, children, pathTags, badge, onClick } = props
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const hasChildren = Boolean(children?.length)
  const { hover, setHover, open } = useHoverState(hasChildren)

  const isActive = isPathActive(pathname, path, pathTags, children)

  const handleClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick(props)
      return
    }
    if (item.children?.length) {
      setHover((prev) => !prev)
    }
  }

  return (
    <div onMouseEnter={() => hasChildren && setHover(true)} onMouseLeave={() => hasChildren && setHover(false)}>
      <Popover open={open}>
        <PopoverAnchor className='relative'>
          {open && hasChildren && (
            <ChevronLeft
              className={cn('text-sidebar-icon absolute top-1/2 -translate-y-1/2 fill-current transition-all ltr:-right-4 rtl:-left-4', {
                'ltr:rotate-180': open,
                'rtl:rotate-180': !open,
              })}
              size={18}
            />
          )}
          <Link
            href={(!onClick && (path as any)) || ''}
            id={`collapsed-menu-${path?.replace(/\//g, '-') || title.replace(/\s+/g, '-').toLowerCase()}`}
            className={cn(
              'flex h-12 cursor-pointer items-center rounded-lg px-2 select-none',
              'text-sidebar-foreground w-12 justify-center gap-4 transition-all',
              {
                'bg-sidebar-accent text-sidebar-foreground': isActive,
                'hover:bg-sidebar-accent/70': !isActive,
              }
            )}
            onClick={() => !hasChildren && handleClick(props)}
          >
            {badge && (
              <Badge className='text-2xs dir-ltr absolute -top-1 -right-1 z-20 h-4 w-4 min-w-4' size='sm'>
                {badge}
              </Badge>
            )}
            {Icon && <Icon size={24} className='text-sidebar-icon' />}
          </Link>
        </PopoverAnchor>
        {hasChildren && (
          <PopoverContent side='left' className='border-sidebar-border bg-sidebar ms-5 w-72 border shadow-sm'>
            <div>
              <p className='border-sidebar-border text-sidebar-foreground flex w-full items-center border-b p-4 text-lg font-bold'>{title}</p>
              <SubMenus ref={ref} items={children} onItemClick={handleClick} />
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}
