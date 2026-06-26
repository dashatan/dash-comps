import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import DashboardLayout from "@/components/layout/dashboard";
import { ErrorHandler } from "@/components/common/errors";
import { menuItems } from "@/config/menu-items";
import { DashboardFooter } from "@/shared/coming-soon";

function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <DashboardLayout menuItems={menuItems} footer={<DashboardFooter />}>
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
