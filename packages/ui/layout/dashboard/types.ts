import { TranslationKeys } from '@/lib/language/locales'

export const HEADER_HEIGHT = 60
export const SIDEBAR_WIDTH = 320
export const SIDEBAR_WIDTH_COLLAPSED = 80
export const MIN_SCREEN_WIDTH = 342

export type MenuItem = {
  title: TranslationKeys
  path?: string
  pathTags?: string[]
  permissionPath?: string
  Icon?: React.ComponentType<any>
  children?: MenuItem[]
  onClick?: (item?: MenuItem) => void
  open?: boolean
  entityName?: string
  badge?: string
}

export type Breadcrumb = {
  label: string
  href?: any
}

export type Breadcrumbs = {
  items: Breadcrumb[]
  title?: string
}
