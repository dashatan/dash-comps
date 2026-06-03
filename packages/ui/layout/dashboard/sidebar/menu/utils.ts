import { MenuItem } from '@/components/layout/dashboard/types'

export function isActiveMenu(item: MenuItem, pathname: string) {
  const hasTag =
    item.pathTags && item.path
      ? !!item.pathTags.find((x) => {
          const p = pathname?.split('/') || ''
          const p1 = p[1]
          const p2 = p[2]
          const basePart = [p1, p2].join('/')
          return basePart === x
        })
      : false
  const isActive = pathname === item.path || (pathname && item.pathTags?.includes(pathname)) || hasTag

  return isActive
}
