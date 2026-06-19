import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { ErrorHandler } from "@/components/common/errors";
import { AppShell } from "@/shared/layout/shell";

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <AppShell>
      <ErrorHandler resetKeys={[pathname]} className="flex min-h-0 flex-1 flex-col">
        <AnimatePresence mode="wait">
          <Outlet key={pathname} />
        </AnimatePresence>
      </ErrorHandler>
    </AppShell>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
