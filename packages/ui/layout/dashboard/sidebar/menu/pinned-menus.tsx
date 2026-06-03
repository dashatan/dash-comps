import Button from "@/components/common/buttons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/common/collapsible";
import useDashboardSignals from "@/components/layout/dashboard/context/useDashboardSignals";
import { useLanguage } from "@/lib";
import PlusMinusIcon from "@/components/common/icons/PlusMinusIcon";
import PinnedMenusList from "./pinned-menus-list";
import { useState } from "react";

export default function PinnedMenus() {
  const { t } = useLanguage();
  const { pinned, setPinned } = useDashboardSignals();
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-4 text-sm">
      <CollapsibleTrigger asChild>
        <div className="text-sidebar-icon flex h-12 w-full cursor-pointer items-center justify-between text-sm transition-all">
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
