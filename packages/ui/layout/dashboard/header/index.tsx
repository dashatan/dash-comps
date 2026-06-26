"use client";

import { cn } from "@/lib";
import BreadCrumbs from "./breadcrumbs";
import Clock from "./clock";
import ThemeToggle from "./theme-toggle";
import { usePreferences } from "@/lib";
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from "../types";
import Button from "@/components/common/buttons";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/common/overlay/sheet";
import { MobileSidebar } from "@/components/layout/dashboard/sidebar";
import { useDashboardLayout } from "@/components/layout/dashboard/context/layout-context";
import { useState } from "react";

export default function DashboardHeader() {
  const { preferences } = usePreferences();
  const { menuItems, footer } = useDashboardLayout();
  const [open, setOpen] = useState(false);

  const mobileMenuItems = menuItems.map((x) => ({
    ...x,
    onClick: x.children ? undefined : () => setOpen(false),
    children: x.children?.map((y) => ({
      ...y,
      onClick: y.children ? undefined : () => setOpen(false),
    })),
  }));

  return (
    <div
      className={cn(
        "border-sidebar-border mobile:px-2 flex w-full items-center justify-between border-b px-6",
        "bg-sidebar text-sidebar-foreground",
      )}
      style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }}
    >
      <BreadCrumbs />
      <div className="mobile:hidden flex items-center gap-4">
        <ThemeToggle />
        {preferences.showClock && <Clock />}
      </div>
      <div className="not-mobile:hidden">
        <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
          <SheetTrigger asChild>
            <Button variant="icon" severity="info" className="size-12 p-0">
              <Menu className="text-sidebar-icon" />
            </Button>
          </SheetTrigger>
          <SheetContent className="p-0">
            <SheetTitle />
            <MobileSidebar
              menuItems={mobileMenuItems}
              footer={footer}
              width={SIDEBAR_WIDTH}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
