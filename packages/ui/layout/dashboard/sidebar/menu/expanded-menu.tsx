import { useRef, useCallback, useEffect } from "react";
import SubMenus from "@dash/ui/layout/dashboard/sidebar/menu/submenus";
import { cn } from "@dash/core";
import Badge from "@dash/ui/common/badge/badge";
import type { MenuItem } from "@dash/ui/layout/dashboard/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@dash/ui/common/collapsible";
import useDashboardSignals from "@dash/ui/layout/dashboard/context/useDashboardSignals";
import {
  DashboardLink,
  useDashboardPathname,
} from "@dash/ui/layout/dashboard/navigation/context";
import { DirectionalChevron } from "@dash/ui/layout/dashboard/direction/directional-icon";

interface ExpandedMenuItemProps extends MenuItem {
  id?: number;
}

export default function ExpandedMenuItem(props: ExpandedMenuItemProps) {
  const { title, path, Icon, children, pathTags, badge, id } = props;
  const { openMenuId, setOpenMenuId } = useDashboardSignals();
  const pathname = useDashboardPathname();
  const pathnameBase = pathname?.split("/")[1];
  const pathBase = path?.split("/")?.[1] || pathTags?.[0]?.split("/")?.[1];
  let isActive = pathnameBase === pathBase;

  if (!isActive) isActive = !!children?.find((x) => x.path === pathname);
  if (!isActive && pathTags)
    isActive = !!pathTags.find((x) => pathname?.split("/")[1] === x);

  const ref = useRef<HTMLDivElement>(null);
  const hasChildren = !!children?.length;
  const isOpen = id === openMenuId;

  useEffect(() => {
    if (isActive) {
      setOpenMenuId(id);
    }
  }, [isActive, id, setOpenMenuId]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent) => {
      if (hasChildren) {
        e.preventDefault();
        setOpenMenuId(openMenuId === id ? undefined : id);
      }
      if (props.onClick) {
        props.onClick(props);
      }
    },
    [hasChildren, id, openMenuId, props, setOpenMenuId],
  );

  const handleSubMenuClick = useCallback((item: MenuItem) => {
    if (item.onClick) {
      item.onClick(item);
    }
  }, []);

  return (
    <div className="flex flex-col">
      <Collapsible open={isOpen}>
        <CollapsibleTrigger asChild>
          <DashboardLink
            href={(!hasChildren && path) || ""}
            onClick={handleLinkClick}
            id={`menu-${path?.replace(/\//g, "-") || title.replace(/\s+/g, "-").toLowerCase()}`}
            className={cn(
              "flex h-12 cursor-pointer items-center justify-start rounded-lg px-2 select-none",
              "gap-4 text-sidebar-foreground transition-all duration-200",
              {
                "bg-sidebar-accent": isActive,
                "hover:bg-sidebar-accent": !isActive,
              },
            )}
          >
            {Icon && (
              <Icon size={24} className={cn("mx-1 text-sidebar-icon")} />
            )}
            <span
              className={cn(
                "text-base font-bold whitespace-nowrap text-foreground",
              )}
            >
              {title}
            </span>
            {!!badge && <Badge highlight>{badge}</Badge>}
            {hasChildren && (
              <div className="ms-auto flex h-6 w-6 shrink-0 items-center justify-center">
                <DirectionalChevron
                  variant="menu"
                  open={isOpen}
                  size={16}
                  className="w-4 text-sidebar-foreground"
                />
              </div>
            )}
          </DashboardLink>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SubMenus
            ref={ref}
            items={children}
            onItemClick={handleSubMenuClick}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
