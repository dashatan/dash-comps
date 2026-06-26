import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@dash/ui/common/collapsible";
import useDashboardSignals from "@dash/ui/layout/dashboard/context/useDashboardSignals";
import { useLanguage } from "@dash/core";
import PlusMinusIcon from "@dash/ui/common/icons/PlusMinusIcon";
import PinnedMenusList from "@dash/ui/layout/dashboard/sidebar/menu/pinned-menus-list";
import { useState } from "react";

export default function PinnedMenus() {
  const { t } = useLanguage();
  const { pinned, setPinned } = useDashboardSignals();
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-4 text-sm">
      <CollapsibleTrigger asChild>
        <div className="flex h-12 w-full cursor-pointer items-center justify-between text-sm text-sidebar-icon transition-all">
          {t("common.pinnedMenus")}
          <PlusMinusIcon toggled={open} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <PinnedMenusList pinned={pinned} setPinned={setPinned} />
      </CollapsibleContent>
    </Collapsible>
  );
}
