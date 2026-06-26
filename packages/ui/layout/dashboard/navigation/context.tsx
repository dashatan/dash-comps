"use client";

import { createContext, useContext, type ReactNode } from "react";
import type {
  DashboardLinkProps,
  DashboardNavigation,
} from "@dash/ui/layout/dashboard/navigation/types";

const DashboardNavigationContext = createContext<DashboardNavigation | null>(
  null,
);

export function DashboardNavigationProvider({
  navigation,
  children,
}: {
  navigation: DashboardNavigation;
  children: ReactNode;
}) {
  return (
    <DashboardNavigationContext.Provider value={navigation}>
      {children}
    </DashboardNavigationContext.Provider>
  );
}

export function useDashboardNavigation(): DashboardNavigation {
  const navigation = useContext(DashboardNavigationContext);
  if (!navigation) {
    throw new Error(
      "useDashboardNavigation must be used within DashboardNavigationProvider",
    );
  }
  return navigation;
}

export function useDashboardPathname(): string {
  return useDashboardNavigation().pathname;
}

export function useDashboardRouter() {
  const { push, back } = useDashboardNavigation();
  return { push, back };
}

export function DashboardLink({ href, ...props }: DashboardLinkProps) {
  const { Link } = useDashboardNavigation();
  return <Link href={href} {...props} />;
}
