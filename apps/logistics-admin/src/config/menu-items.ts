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

export const PLACEHOLDER_MODULE_IDS = [
  "fleet",
  "tracker",
  "customers",
  "routes",
  "warehouses",
  "finance",
  "settings",
] as const;

export type PlaceholderModuleId = (typeof PLACEHOLDER_MODULE_IDS)[number];

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
        title: "logisticsAdmin.nav.reports",
        path: "/reports/delivery-performance",
        entityName: "delivery-performance",
      },
      {
        title: "logisticsAdmin.nav.reports",
        path: "/reports/revenue-by-route",
        entityName: "revenue-by-route",
      },
      {
        title: "logisticsAdmin.nav.reports",
        path: "/reports/fleet-utilization",
        entityName: "fleet-utilization",
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
  },
  {
    title: "logisticsAdmin.nav.tracker",
    path: "/tracker",
    Icon: Radio,
  },
  {
    title: "logisticsAdmin.nav.customers",
    path: "/customers",
    Icon: Users,
  },
  {
    title: "logisticsAdmin.nav.routes",
    path: "/routes",
    Icon: Route,
  },
  {
    title: "logisticsAdmin.nav.warehouses",
    path: "/warehouses",
    Icon: Building2,
  },
  {
    title: "logisticsAdmin.nav.finance",
    path: "/finance",
    Icon: Wallet,
  },
  {
    title: "logisticsAdmin.nav.settings",
    path: "/settings",
    Icon: Settings,
  },
];

export function isPlaceholderModule(module: string): module is PlaceholderModuleId {
  return (PLACEHOLDER_MODULE_IDS as readonly string[]).includes(module);
}
