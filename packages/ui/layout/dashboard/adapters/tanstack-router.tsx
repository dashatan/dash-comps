"use client";

import { forwardRef, useMemo } from "react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import type {
  DashboardLinkProps,
  DashboardNavigation,
} from "@dash/ui/layout/dashboard/navigation/types";

const TanStackDashboardLink = forwardRef<HTMLAnchorElement, DashboardLinkProps>(
  function TanStackDashboardLink({ href, ...props }, ref) {
    return <RouterLink ref={ref} to={href} {...props} />;
  },
);

export function useTanStackDashboardNavigation(): DashboardNavigation {
  const pathname = useLocation({ select: (state) => state.pathname });
  const navigate = useNavigate();
  const router = useRouter();

  return useMemo(
    () => ({
      pathname,
      push: (href: string) => navigate({ to: href }),
      back: () => router.history.back(),
      Link: TanStackDashboardLink,
    }),
    [pathname, navigate, router],
  );
}
