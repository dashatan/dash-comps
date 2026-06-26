"use client";

import type { CSSProperties } from "react";
import Sidebar from "@dash/ui/layout/dashboard/sidebar";
import DashboardHeader from "@dash/ui/layout/dashboard/header";
import {
  type DashboardBranding,
  type DashboardMenuSettings,
  type MenuItem,
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH,
  MIN_SCREEN_WIDTH,
} from "@dash/ui/layout/dashboard/types";
import useDashboardSignals from "@dash/ui/layout/dashboard/context/useDashboardSignals";
import { DashboardLayoutProvider } from "@dash/ui/layout/dashboard/context/layout-context";
import { DashboardNavigationProvider } from "@dash/ui/layout/dashboard/navigation/context";
import type { DashboardNavigation } from "@dash/ui/layout/dashboard/navigation/types";
import { useLanguage } from "@dash/core";
import { getDocumentDirection } from "@dash/core/language/utils";
import { cn } from "@dash/core";

export type {
  MenuItem,
  Breadcrumb,
  Breadcrumbs,
  DashboardMenuSettings,
  DashboardBranding,
} from "@dash/ui/layout/dashboard/types";
export type {
  DashboardNavigation,
  DashboardLinkProps,
} from "@dash/ui/layout/dashboard/navigation/types";
export {
  HEADER_HEIGHT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
  MIN_SCREEN_WIDTH,
} from "@dash/ui/layout/dashboard/types";
export { default as useDashboardSignals } from "@dash/ui/layout/dashboard/context/useDashboardSignals";
export {
  useDashboardLayout,
  DashboardLayoutProvider,
} from "@dash/ui/layout/dashboard/context/layout-context";
export {
  DashboardNavigationProvider,
  useDashboardNavigation,
  useDashboardPathname,
  useDashboardRouter,
  DashboardLink,
} from "@dash/ui/layout/dashboard/navigation/context";
export { useTanStackDashboardNavigation } from "@dash/ui/layout/dashboard/adapters/tanstack-router";
export {
  DirectionalChevron,
  DirectionalBackArrow,
  SidebarToggleIcon,
} from "@dash/ui/layout/dashboard/direction/directional-icon";
export { useDashboardDirection } from "@dash/ui/layout/dashboard/direction/use-dashboard-direction";
export { default as useBreadcrumbs } from "@dash/ui/layout/dashboard/header/useBreadcrumbs";
export { useDashboardStore } from "@dash/ui/layout/dashboard/store/dashboard-store";

export type DashboardLayoutProps = {
  children: React.ReactNode;
  menuItems: MenuItem[];
  footer: React.ReactNode;
  navigation: DashboardNavigation;
  menuSettings?: DashboardMenuSettings;
  branding?: DashboardBranding;
};

export default function DashboardLayout({
  children,
  menuItems,
  footer,
  navigation,
  menuSettings,
  branding,
}: DashboardLayoutProps) {
  const { expand } = useDashboardSignals();
  const { language } = useLanguage();
  const isRtl = getDocumentDirection(language) === "rtl";
  const width = expand ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <DashboardNavigationProvider navigation={navigation}>
      <DashboardLayoutProvider
        menuItems={menuItems}
        footer={footer}
        menuSettings={menuSettings}
        branding={branding}
        isRtl={isRtl}
      >
        <main
          className={cn(
            "flex size-full h-screen overflow-y-auto",
            isRtl && "flex-row-reverse",
          )}
        >
          <div className="sticky start-0 top-0 hidden mobile:flex">
            <Sidebar menuItems={menuItems} footer={footer} width={width} />
          </div>
          <div
            id="content"
            className="flex w-full flex-1 flex-col mobile:w-[calc(100%-var(--sidebar-width))]"
            style={
              {
                "--sidebar-width": `${width}px`,
                minWidth: MIN_SCREEN_WIDTH,
              } as CSSProperties
            }
          >
            <DashboardHeader />
            <div
              className="flex flex-1 flex-col"
              aria-label="Dashboard content"
            >
              {children}
            </div>
          </div>
        </main>
      </DashboardLayoutProvider>
    </DashboardNavigationProvider>
  );
}
