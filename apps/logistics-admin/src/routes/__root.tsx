import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import DashboardLayout, {
  useTanStackDashboardNavigation,
} from "@dash/ui/layout/dashboard";
import { ErrorHandler } from "@/components/common/errors";
import { menuItems } from "@/config/menu-items";
import { DashboardFooter } from "@/shared/coming-soon";
import { useAppStore } from "@/store";

function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const navigation = useTanStackDashboardNavigation();
  const menuSettings = useAppStore((state) => state.preferences.menuSettings);
  const sidebarBranding = useAppStore(
    (state) => state.preferences.sidebarBranding,
  );

  return (
    <DashboardLayout
      navigation={navigation}
      menuItems={menuItems}
      footer={<DashboardFooter />}
      branding={sidebarBranding}
      menuSettings={{
        visibleMenus: menuSettings.visibleMenus,
        defaultExpanded: menuSettings.defaultExpanded,
        showClock: menuSettings.showClock,
      }}
    >
      <ErrorHandler
        resetKeys={[pathname]}
        className="flex min-h-0 flex-1 flex-col overflow-auto"
      >
        <Outlet />
      </ErrorHandler>
    </DashboardLayout>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
