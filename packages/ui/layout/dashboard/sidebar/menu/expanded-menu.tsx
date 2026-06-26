import { usePathname } from "next/navigation";
import { useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import SubMenus from "@/components/layout/dashboard/sidebar/menu/submenus";
import { cn } from "@/lib";
import { ChevronLeft } from "lucide-react";
import Badge from "@/components/common/badge/badge";
import { MenuItem } from "@/components/layout/dashboard/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/common/collapsible";
import useDashboardSignals from "@/components/layout/dashboard/context/useDashboardSignals";

interface ExpandedMenuItemProps extends MenuItem {
  id?: number;
}

export default function ExpandedMenuItem(props: ExpandedMenuItemProps) {
  const { title, path, Icon, children, pathTags, badge, id } = props;
  const { openMenuId, setOpenMenuId } = useDashboardSignals();
  const pathname = usePathname();
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
  }, [isActive]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent) => {
      if (hasChildren) {
        e.preventDefault();
        setOpenMenuId(openMenuId === id ? undefined : id);
      }
      if (props.onClick) {
        // e.preventDefault()
        props.onClick(props);
      }
    },
    [hasChildren, id, props],
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
          <Link
            href={(!hasChildren && (path as any)) || ""}
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
                <ChevronLeft
                  className={cn(
                    "w-4 text-sidebar-foreground transition-transform duration-300 ltr:rotate-180",
                    {
                      "ltr:-rotate-90 rtl:-rotate-90": isOpen,
                    },
                  )}
                />
              </div>
            )}
          </Link>
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
