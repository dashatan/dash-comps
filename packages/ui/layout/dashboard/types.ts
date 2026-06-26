export const HEADER_HEIGHT = 60;
export const SIDEBAR_WIDTH = 320;
export const SIDEBAR_WIDTH_COLLAPSED = 80;
export const MIN_SCREEN_WIDTH = 342;

export type MenuIconProps = {
  size?: number;
  className?: string;
  variant?: string;
};

export type MenuItem = {
  title: string;
  path?: string;
  pathTags?: string[];
  permissionPath?: string;
  Icon?: React.ComponentType<MenuIconProps>;
  children?: MenuItem[];
  onClick?: (item?: MenuItem) => void;
  open?: boolean;
  entityName?: string;
  badge?: string;
};

export type Breadcrumb = {
  label: string;
  href?: string;
};

export type Breadcrumbs = {
  items: Breadcrumb[];
  title?: string;
};

export type DashboardMenuSettings = {
  visibleMenus?: string[];
  defaultExpanded?: boolean;
  showClock?: boolean;
};
