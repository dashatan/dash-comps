import React, { useState } from "react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/common/overlay/popover";
import { Pin } from "lucide-react";
import useDashboardSignals from "@/components/layout/dashboard/context/useDashboardSignals";
import PinnedMenusList from "./pinned-menus-list";

export default function CollapsedPinnedMenus() {
  const { pinned, setPinned } = useDashboardSignals();
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  // Sync popover open state with hover
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
          side="right"
          className="w-80 border border-sidebar-border bg-sidebar p-0 shadow-sm"
        >
          <PinnedMenusList pinned={pinned} setPinned={setPinned} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
