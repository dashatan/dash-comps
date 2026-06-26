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
    title: "logisticsAdmin.nav.overview",
    path: "/",
    Icon: LayoutDashboard,
  },
  {
    title: "logisticsAdmin.nav.analytics",
    path: "/analytics",
    Icon: BarChart3,
  },
  {
    title: "logisticsAdmin.nav.reports",
    path: "/reports",
    Icon: FileBarChart,
    children: [
      {
        title: "logisticsAdmin.nav.deliveryPerformance",
        path: "/reports/delivery-performance",
      },
      {
        title: "logisticsAdmin.nav.revenueByRoute",
        path: "/reports/revenue-by-route",
      },
      {
        title: "logisticsAdmin.nav.fleetUtilization",
        path: "/reports/fleet-utilization",
      },
    ],
  },
  {
    title: "logisticsAdmin.nav.shipments",
    path: "/shipments",
    Icon: Package,
  },
  {
    title: "logisticsAdmin.nav.fleet",
    path: "/fleet",
    Icon: Truck,
    children: [
      {
        title: "logisticsAdmin.nav.vehicles",
        path: "/fleet/vehicles",
      },
      {
        title: "logisticsAdmin.nav.drivers",
        path: "/fleet/drivers",
      },
      {
        title: "logisticsAdmin.nav.assignments",
        path: "/fleet/assignments",
      },
    ],
  },
  {
    title: "logisticsAdmin.nav.tracker",
    path: "/tracker",
    Icon: Radio,
    children: [
      {
        title: "logisticsAdmin.nav.liveMap",
        path: "/tracker/live",
      },
      {
        title: "logisticsAdmin.nav.playback",
        path: "/tracker/playback",
      },
    ],
  },
  {
    title: "logisticsAdmin.nav.customers",
    path: "/customers",
    Icon: Users,
    children: [
      {
        title: "logisticsAdmin.nav.accounts",
        path: "/customers/accounts",
      },
      {
        title: "logisticsAdmin.nav.contracts",
        path: "/customers/contracts",
      },
    ],
  },
  {
    title: "logisticsAdmin.nav.routes",
    path: "/routes",
    Icon: Route,
    children: [
      {
        title: "logisticsAdmin.nav.corridors",
        path: "/routes/corridors",
      },
      {
        title: "logisticsAdmin.nav.planning",
        path: "/routes/planning",
      },
    ],
  },
  {
    title: "logisticsAdmin.nav.warehouses",
    path: "/warehouses",
    Icon: Building2,
    children: [
      {
        title: "logisticsAdmin.nav.hubs",
        path: "/warehouses/hubs",
      },
      {
        title: "logisticsAdmin.nav.capacity",
        path: "/warehouses/capacity",
      },
    ],
  },
  {
    title: "logisticsAdmin.nav.finance",
    path: "/finance",
    Icon: Wallet,
    children: [
      {
        title: "logisticsAdmin.nav.invoices",
        path: "/finance/invoices",
      },
      {
        title: "logisticsAdmin.nav.payments",
        path: "/finance/payments",
      },
    ],
  },
  {
    title: "logisticsAdmin.nav.settings",
    path: "/settings",
    Icon: Settings,
    children: [
      {
        title: "logisticsAdmin.nav.appearance",
        path: "/settings/appearance",
      },
      {
        title: "logisticsAdmin.nav.branding",
        path: "/settings/branding",
      },
      {
        title: "logisticsAdmin.nav.organisation",
        path: "/settings/organisation",
      },
      {
        title: "logisticsAdmin.nav.integrations",
        path: "/settings/integrations",
      },
    ],
  },
];
