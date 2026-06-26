import React, { useState } from "react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@dash/ui/common/overlay/popover";
import { Pin } from "lucide-react";
import useDashboardSignals from "@dash/ui/layout/dashboard/context/useDashboardSignals";
import PinnedMenusList from "@dash/ui/layout/dashboard/sidebar/menu/pinned-menus-list";
import { useDashboardDirection } from "@dash/ui/layout/dashboard/direction/use-dashboard-direction";
import { getSidebarPopoverSide } from "@dash/ui/layout/dashboard/direction/rotation";

export default function CollapsedPinnedMenus() {
  const { pinned, setPinned } = useDashboardSignals();
  const { isRtl } = useDashboardDirection();
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const popoverSide = getSidebarPopoverSide(isRtl, "pinned");

  React.useEffect(() => {
    const timer = setInterval(() => {
      setOpen(hover);
    }, 100);
    return () => clearInterval(timer);
  }, [hover]);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex w-full items-center justify-center"
    >
      <Popover open={open}>
        <PopoverAnchor>
          <div className="flex size-10 cursor-pointer items-center justify-center rounded-lg transition-all hover:bg-sidebar-accent">
            <Pin size={20} className="text-sidebar-icon" />
          </div>
        </PopoverAnchor>
        <PopoverContent
          side={popoverSide}
          className="w-80 border border-sidebar-border bg-sidebar p-0 shadow-sm"
        >
          <PinnedMenusList pinned={pinned} setPinned={setPinned} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
