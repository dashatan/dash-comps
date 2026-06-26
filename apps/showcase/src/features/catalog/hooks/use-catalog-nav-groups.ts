import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  catalogCategoryGroups,
  type CatalogGroup,
} from "@/features/catalog/registry";

const STORAGE_KEY = "showcase-catalog-nav-groups";

type OpenGroups = Record<CatalogGroup, boolean>;

const defaultOpenGroups: OpenGroups = {
  common: true,
  compound: true,
};

function readStoredOpenGroups(): OpenGroups {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultOpenGroups;
    return {
      ...defaultOpenGroups,
      ...(JSON.parse(raw) as Partial<OpenGroups>),
    };
  } catch {
    return defaultOpenGroups;
  }
}

export function useCatalogNavGroups() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const activeSlug = pathname.startsWith("/components/")
    ? pathname.replace("/components/", "").split("/")[0]
    : undefined;

  const activeGroup = useMemo(
    () =>
      catalogCategoryGroups.find(({ items }) =>
        items.some((item) => item.slug === activeSlug),
      )?.group,
    [activeSlug],
  );

  const [openGroups, setOpenGroups] =
    useState<OpenGroups>(readStoredOpenGroups);

  useEffect(() => {
    if (!activeGroup) return;

    setOpenGroups((previous) => {
      if (previous[activeGroup]) return previous;

      const next = { ...previous, [activeGroup]: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [activeGroup]);

  const setGroupOpen = useCallback((group: CatalogGroup, open: boolean) => {
    setOpenGroups((previous) => {
      const next = { ...previous, [group]: open };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isGroupOpen = useCallback(
    (group: CatalogGroup) => openGroups[group],
    [openGroups],
  );

  return { activeSlug, isGroupOpen, setGroupOpen };
}
