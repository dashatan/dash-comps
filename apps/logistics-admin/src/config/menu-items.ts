import type { MenuItem } from "@/components/layout/dashboard/types";
import {
  BarChart3,
  Building2,
  FileBarChart,
  LayoutDashboard,
  Package,
  Route,
  Settings,
  Truck,
  Users,
  Wallet,
  Radio,
} from "lucide-react";

export const menuItems: MenuItem[] = [
  {
    title: "nav.overview",
    path: "/",
    Icon: LayoutDashboard,
  },
  {
    title: "nav.analytics",
    path: "/analytics",
    Icon: BarChart3,
  },
  {
    title: "nav.reports",
    path: "/reports",
    Icon: FileBarChart,
    children: [
      {
        title: "nav.deliveryPerformance",
        path: "/reports/delivery-performance",
      },
      {
        title: "nav.revenueByRoute",
        path: "/reports/revenue-by-route",
      },
      {
        title: "nav.fleetUtilization",
        path: "/reports/fleet-utilization",
      },
    ],
  },
  {
    title: "nav.shipments",
    path: "/shipments",
    Icon: Package,
  },
  {
    title: "nav.fleet",
    path: "/fleet",
    Icon: Truck,
    children: [
      {
        title: "nav.vehicles",
        path: "/fleet/vehicles",
      },
      {
        title: "nav.drivers",
        path: "/fleet/drivers",
      },
      {
        title: "nav.assignments",
        path: "/fleet/assignments",
      },
    ],
  },
  {
    title: "nav.tracker",
    path: "/tracker",
    Icon: Radio,
    children: [
      {
        title: "nav.liveMap",
        path: "/tracker/live",
      },
      {
        title: "nav.playback",
        path: "/tracker/playback",
      },
    ],
  },
  {
    title: "nav.customers",
    path: "/customers",
    Icon: Users,
    children: [
      {
        title: "nav.accounts",
        path: "/customers/accounts",
      },
      {
        title: "nav.contracts",
        path: "/customers/contracts",
      },
    ],
  },
  {
    title: "nav.routes",
    path: "/routes",
    Icon: Route,
    children: [
      {
        title: "nav.corridors",
        path: "/routes/corridors",
      },
      {
        title: "nav.planning",
        path: "/routes/planning",
      },
    ],
  },
  {
    title: "nav.warehouses",
    path: "/warehouses",
    Icon: Building2,
    children: [
      {
        title: "nav.hubs",
        path: "/warehouses/hubs",
      },
      {
        title: "nav.capacity",
        path: "/warehouses/capacity",
      },
    ],
  },
  {
    title: "nav.finance",
    path: "/finance",
    Icon: Wallet,
    children: [
      {
        title: "nav.invoices",
        path: "/finance/invoices",
      },
      {
        title: "nav.payments",
        path: "/finance/payments",
      },
    ],
  },
  {
    title: "nav.settings",
    path: "/settings",
    Icon: Settings,
    children: [
      {
        title: "nav.appearance",
        path: "/settings/appearance",
      },
      {
        title: "nav.branding",
        path: "/settings/branding",
      },
      {
        title: "nav.organisation",
        path: "/settings/organisation",
      },
      {
        title: "nav.integrations",
        path: "/settings/integrations",
      },
    ],
  },
];
