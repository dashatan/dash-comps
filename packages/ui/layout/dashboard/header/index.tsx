"use client";

import { cn } from "@dash/core";
import BreadCrumbs from "@dash/ui/layout/dashboard/header/breadcrumbs";
import Clock from "@dash/ui/layout/dashboard/header/clock";
import LanguageSelect from "@dash/ui/layout/dashboard/header/language-select";
import ThemeToggle from "@dash/ui/layout/dashboard/header/theme-toggle";
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from "@dash/ui/layout/dashboard/types";
import Button from "@dash/ui/common/buttons";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@dash/ui/common/overlay/sheet";
import Sidebar from "@dash/ui/layout/dashboard/sidebar";
import { useDashboardLayout } from "@dash/ui/layout/dashboard/context/layout-context";
import { useState } from "react";

export default function DashboardHeader() {
  const { menuItems, footer, menuSettings } = useDashboardLayout();
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
        "flex w-full items-center justify-between border-b border-sidebar-border px-6 mobile:px-2",
        "bg-sidebar text-sidebar-foreground",
      )}
      style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }}
    >
      <div className="min-w-0 flex-1">
        <BreadCrumbs />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <LanguageSelect />
        <ThemeToggle />
        {menuSettings.showClock ? (
          <div className="hidden mobile:block">
            <Clock />
          </div>
        ) : null}
        <div className="flex mobile:hidden">
          <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
            <SheetTrigger asChild>
              <Button variant="icon" severity="info" className="size-12 p-0">
                <Menu className="text-sidebar-icon" />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-0">
              <SheetTitle />
              <Sidebar
                variant="drawer"
                menuItems={mobileMenuItems}
                footer={footer}
                width={SIDEBAR_WIDTH}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
