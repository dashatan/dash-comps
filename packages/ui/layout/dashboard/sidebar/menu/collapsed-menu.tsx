import { cn } from "@dash/core";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@dash/ui/common/overlay/popover";
import type { MenuItem } from "@dash/ui/layout/dashboard/types";
import SubMenus from "@dash/ui/layout/dashboard/sidebar/menu/submenus";
import Badge from "@dash/ui/common/badge/badge";
import {
  DashboardLink,
  useDashboardPathname,
} from "@dash/ui/layout/dashboard/navigation/context";
import { DirectionalChevron } from "@dash/ui/layout/dashboard/direction/directional-icon";
import { useDashboardDirection } from "@dash/ui/layout/dashboard/direction/use-dashboard-direction";
import { getSidebarPopoverSide } from "@dash/ui/layout/dashboard/direction/rotation";

type CollapsedMenuItemProps = MenuItem;

const useHoverState = (hasChildren: boolean) => {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasChildren) return;

    const timer = setInterval(() => {
      setOpen(hover);
    }, 100);

    return () => clearInterval(timer);
  }, [hover, hasChildren]);

  return { hover, setHover, open };
};

const isPathActive = (
  pathname: string | null,
  path?: string,
  pathTags?: string[],
  children?: MenuItem[],
) => {
  if (!pathname) return false;

  const basePath = pathname.split("/")[1];

  if (path) {
    const itemBasePath = path.split("/")[1];
    if (basePath === itemBasePath) return true;
  }

  if (children?.some((child) => child.path === pathname)) return true;

  if (pathTags?.includes(basePath)) return true;

  return false;
};

export default function CollapsedMenuItem(props: CollapsedMenuItemProps) {
  const { title, path, Icon, children, pathTags, badge, onClick } = props;
  const pathname = useDashboardPathname();
  const { isRtl } = useDashboardDirection();
  const ref = useRef<HTMLDivElement>(null);
  const hasChildren = Boolean(children?.length);
  const { setHover, open } = useHoverState(hasChildren);
  const popoverSide = getSidebarPopoverSide(isRtl, "menu");

  const isActive = isPathActive(pathname, path, pathTags, children);

  const handleClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick(props);
      return;
    }
    if (item.children?.length) {
      setHover((prev) => !prev);
    }
  };

  return (
    <div
      onMouseEnter={() => hasChildren && setHover(true)}
      onMouseLeave={() => hasChildren && setHover(false)}
    >
      <Popover open={open}>
        <PopoverAnchor className="relative">
          {open && hasChildren && (
            <DirectionalChevron
              variant="flyout"
              open={open}
              size={18}
              className="absolute -inset-e-4 top-1/2 -translate-y-1/2 fill-current text-sidebar-icon"
            />
          )}
          <DashboardLink
            href={(!onClick && path) || ""}
            id={`collapsed-menu-${path?.replace(/\//g, "-") || title.replace(/\s+/g, "-").toLowerCase()}`}
            className={cn(
              "flex h-12 cursor-pointer items-center rounded-lg px-2 select-none",
              "w-12 justify-center gap-4 text-sidebar-foreground transition-all",
              {
                "bg-sidebar-accent text-sidebar-foreground": isActive,
                "hover:bg-sidebar-accent/70": !isActive,
              },
            )}
            onClick={() => !hasChildren && handleClick(props)}
          >
            {badge && (
              <Badge
                className="absolute -top-1 -right-1 z-20 h-4 w-4 min-w-4 text-2xs dir-ltr"
                size="sm"
              >
                {badge}
              </Badge>
            )}
            {Icon && <Icon size={24} className="text-sidebar-icon" />}
          </DashboardLink>
        </PopoverAnchor>
        {hasChildren && (
          <PopoverContent
            side={popoverSide}
            className="ms-5 w-72 border border-sidebar-border bg-sidebar shadow-sm"
          >
            <div>
              <p className="flex w-full items-center border-b border-sidebar-border p-4 text-lg font-bold text-sidebar-foreground">
                {title}
              </p>
              <SubMenus ref={ref} items={children} onItemClick={handleClick} />
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
