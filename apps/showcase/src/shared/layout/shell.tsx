import type { ReactNode } from "react";
import { useLayoutEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ShowcaseSidebar } from "@/shared/layout/sidebar";
import { ShowcaseHeader } from "@/shared/layout/header";
import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
} from "@/components/layout/dashboard/types";
import useDashboardSignals from "@/components/layout/dashboard/context/useDashboardSignals";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const { expand } = useDashboardSignals();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const sidebarWidth = expand ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED;

  useLayoutEffect(() => {
    const main = document.getElementById("app-main-scroll");
    main?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
      <aside
        className="hidden h-full shrink-0 overflow-hidden border-e border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col"
        style={{ width: sidebarWidth }}
      >
        <ShowcaseSidebar />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <ShowcaseHeader />
        <main
          id="app-main-scroll"
          className="min-h-0 w-full flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
