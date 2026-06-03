import { create } from "zustand";
import type { Breadcrumbs, MenuItem } from "@/components/layout/dashboard/types";
import storage from "./storage";

const PINNED_KEY = "pinned-menus";

const initialPinned = storage.local.get<MenuItem[]>(PINNED_KEY) ?? [];

type DashboardStoreState = {
  expand: boolean;
  pinned: MenuItem[];
  breadcrumbs: Breadcrumbs;
  openMenuId: number | undefined;
  loadingMenus: boolean;
  setExpand: (expand: boolean) => void;
  setPinned: (pinned: MenuItem[]) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumbs | null) => void;
  setOpenMenuId: (openMenuId: number | undefined) => void;
  setLoadingMenus: (loadingMenus: boolean) => void;
};

export const useDashboardStore = create<DashboardStoreState>((set) => ({
  expand: true,
  pinned: initialPinned,
  breadcrumbs: { items: [] },
  openMenuId: undefined,
  loadingMenus: false,
  setExpand: (expand) => set({ expand }),
  setPinned: (pinned) => {
    storage.local.set(PINNED_KEY, pinned);
    set({ pinned });
  },
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs: breadcrumbs ?? { items: [] } }),
  setOpenMenuId: (openMenuId) => set({ openMenuId }),
  setLoadingMenus: (loadingMenus) => set({ loadingMenus }),
}));

export default function useDashboardSignals() {
  const expand = useDashboardStore((state) => state.expand);
  const setExpand = useDashboardStore((state) => state.setExpand);
  const openMenuId = useDashboardStore((state) => state.openMenuId);
  const setOpenMenuId = useDashboardStore((state) => state.setOpenMenuId);
  const breadcrumbs = useDashboardStore((state) => state.breadcrumbs);
  const setBreadcrumbs = useDashboardStore((state) => state.setBreadcrumbs);
  const loadingMenus = useDashboardStore((state) => state.loadingMenus);
  const setLoadingMenus = useDashboardStore((state) => state.setLoadingMenus);
  const pinned = useDashboardStore((state) => state.pinned);
  const setPinned = useDashboardStore((state) => state.setPinned);

  return {
    expand,
    setExpand,
    openMenuId,
    setOpenMenuId,
    breadcrumbs,
    setBreadcrumbs,
    loadingMenus,
    setLoadingMenus,
    pinned,
    setPinned,
  };
}
