import type { MenuItem } from "@/components/layout/dashboard/types";
import { Home, LayoutGrid } from "lucide-react";

export const menuItems: MenuItem[] = [
  {
    title: "app.name",
    path: "/",
    Icon: Home,
  },
  {
    title: "common.components",
    path: "/components",
    Icon: LayoutGrid,
    children: [],
  },
];
