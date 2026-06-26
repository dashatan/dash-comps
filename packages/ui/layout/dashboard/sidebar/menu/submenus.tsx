import Button from "@dash/ui/common/buttons";
import type { MenuItem } from "@dash/ui/layout/dashboard/types";
import { cn } from "@dash/core";
import { Star } from "lucide-react";
import useDashboardSignals from "@dash/ui/layout/dashboard/context/useDashboardSignals";
import { isActiveMenu } from "@dash/ui/layout/dashboard/sidebar/menu/utils";
import {
  DashboardLink,
  useDashboardPathname,
} from "@dash/ui/layout/dashboard/navigation/context";
import { forwardRef } from "react";

export type SubMenusProps = {
  items?: MenuItem[];
  onItemClick: (item: MenuItem) => void;
};

const SubMenus = forwardRef<HTMLDivElement, SubMenusProps>(
  ({ items, onItemClick }, ref) => {
    const pathname = useDashboardPathname();
    const { setPinned, pinned } = useDashboardSignals();

    return (
      <div ref={ref}>
        {items?.map((item, i, a) => {
          const isActive = isActiveMenu(item, pathname);
          const first = i === 0;
          const last = i === a.length - 1;
          const single = first && last;
          const isPinned = !!pinned.find((x) => x.title === item.title);

          return (
            <DashboardLink
              href={item.path ?? ""}
              key={item.title}
              id={`submenu-${item.path?.replace(/\//g, "-") || item.title.replace(/\s+/g, "-").toLowerCase()}`}
              className="relative flex h-14 p-2 ps-11 pb-0"
              onClick={() => onItemClick(item)}
            >
              <div
                className={cn(
                  "absolute start-6 top-0 h-full w-0.5 translate-x-px bg-sidebar-border",
                  {
                    "top-auto bottom-0 h-1/2": first,
                    "h-1/2": last,
                    hidden: single,
                  },
                )}
              ></div>
              <div
                className={cn(
                  "absolute start-4.5 top-1/2 flex size-3 -translate-y-1/2 items-center justify-center rounded-full bg-sidebar-border transition-all",
                  {
                    "start-3 size-6 bg-sidebar-primary/50 opacity-100":
                      isActive,
                  },
                )}
              >
                <div
                  className={cn(
                    "size-3 rounded-full bg-sidebar-border transition-all",
                    {
                      "bg-sidebar-primary": isActive,
                    },
                  )}
                ></div>
              </div>

              <div
                className={cn(
                  "w-full cursor-pointer rounded-lg p-4 text-start text-base font-medium transition-all select-none",
                  "group z-1 flex items-center justify-between text-sidebar-foreground",
                  {
                    "bg-sidebar-accent": isActive,
                    "hover:bg-sidebar-accent": !isActive,
                  },
                )}
              >
                <span>{item.title}</span>
                <Button
                  variant="icon"
                  severity="info"
                  size={32}
                  rounded="full"
                  className={cn("z-2 transition-opacity", {
                    "opacity-100": isPinned,
                    "opacity-0 group-hover:opacity-100": !isPinned,
                  })}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setPinned(
                      isPinned
                        ? pinned.filter((x) => x.title !== item.title)
                        : pinned.concat(item),
                    );
                  }}
                >
                  <Star
                    size={16}
                    className={cn("transition-all", {
                      "fill-sidebar-pinned text-sidebar-pinned": isPinned,
                      "text-sidebar-pin": !isPinned,
                    })}
                  />
                </Button>
              </div>
            </DashboardLink>
          );
        })}
      </div>
    );
  },
);

SubMenus.displayName = "SubMenus";

export default SubMenus;
