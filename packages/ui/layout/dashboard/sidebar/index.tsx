"use client";

import React, { useEffect, useMemo, useState, forwardRef, useRef } from "react";
import { useDashboardRouter } from "@dash/ui/layout/dashboard/navigation/context";
import { cn, nestedSearch } from "@dash/core";
import { Divider } from "@dash/ui/common/divider";
import BasicTextInput from "@dash/ui/common/inputs/text/basic";
import type { TranslationKeys } from "@dash/core/language/locales";
import SidebarMenu from "@dash/ui/layout/dashboard/sidebar/menu";
import type { MenuItem } from "@dash/ui/layout/dashboard/types";
import useDashboardSignals from "@dash/ui/layout/dashboard/context/useDashboardSignals";
import { useDashboardLayout } from "@dash/ui/layout/dashboard/context/layout-context";
import PinnedMenus from "@dash/ui/layout/dashboard/sidebar/menu/pinned-menus";
import CollapsedPinnedMenus from "@dash/ui/layout/dashboard/sidebar/menu/collapsed-pinned-menus";
import { SearchNormal1 } from "iconsax-reactjs";
import { SidebarToggleIcon } from "@dash/ui/layout/dashboard/direction/directional-icon";
import Button from "@dash/ui/common/buttons";
import { X } from "lucide-react";
import { useLanguage } from "@dash/core";

function useTranslatedMenus(
  menuItems: MenuItem[],
  t: (key: TranslationKeys) => string,
  language: string,
) {
  return useMemo(() => {
    return menuItems.flatMap((item) => ({
      ...item,
      title: t(item.title as TranslationKeys),
      children: item.children?.flatMap((child) => ({
        ...child,
        title: t(child.title as TranslationKeys),
      })),
    }));
  }, [menuItems, t, language]);
}

export const LogoSection = ({
  expand,
  onLogoClick,
  appName,
  logoSrc,
}: {
  expand: boolean;
  onLogoClick: () => void;
  appName: string;
  logoSrc: string;
}) => (
  <div
    className={cn(
      "my-4 flex cursor-pointer items-center gap-0",
      expand ? "justify-start" : "justify-center",
    )}
    onClick={onLogoClick}
  >
    <div
      className={cn("flex items-center gap-2 p-2 whitespace-nowrap", {
        "justify-center": !expand,
      })}
    >
      <img
        src={logoSrc}
        alt={appName}
        className="size-10 shrink-0 rounded-lg object-contain"
      />
      {expand ? (
        <span className="text-xl text-sidebar-foreground">{appName}</span>
      ) : null}
    </div>
  </div>
);

const ToggleButton = ({
  expand,
  setExpand,
}: {
  expand: boolean;
  setExpand: (v: boolean) => void;
}) => (
  <div
    className={cn(
      "cursor-pointer rounded-full border-none bg-sidebar text-sidebar-icon transition-all",
    )}
    onClick={() => setExpand(!expand)}
  >
    <SidebarToggleIcon expanded={expand} />
  </div>
);

const SearchBar = ({
  expand,
  setSearchText,
  searchText,
  t,
}: {
  expand: boolean;
  searchText: string | undefined;
  setSearchText: (v?: string) => void;
  t: (key: TranslationKeys) => string;
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className={cn(
        "flex min-h-12 w-full cursor-text items-center rounded-lg border bg-input",
        { hidden: !expand },
      )}
      onClick={() => {
        searchInputRef?.current?.focus();
      }}
    >
      <SearchNormal1
        className="ms-4 me-2 min-w-6 text-sidebar-icon"
        size={24}
      />
      <BasicTextInput
        ref={searchInputRef}
        placeholder={t("common.sidebarSearchInput")}
        value={searchText}
        autoFocus
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        className="bg-transparent p-0"
      />
      <Button
        size={24}
        variant="icon"
        severity="info"
        className={cn(
          "pointer-events-none ms-auto me-2 opacity-0 transition-all",
          {
            "pointer-events-auto opacity-100": !!searchText?.length,
          },
        )}
        onClick={() => {
          setSearchText(undefined);
        }}
      >
        <X size={14} />
      </Button>
    </div>
  );
};

export type SidebarProps = {
  menuItems: MenuItem[];
  footer: React.ReactNode;
  width?: number;
  /** Desktop: collapsible rail. Drawer: always expanded (mobile sheet). */
  variant?: "desktop" | "drawer";
};

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ footer, menuItems, width, variant = "desktop" }, ref) => {
    const isDrawer = variant === "drawer";
    const { t, language } = useLanguage();
    const router = useDashboardRouter();
    const { expand, setExpand, loadingMenus, pinned } = useDashboardSignals();
    const { menuSettings, branding } = useDashboardLayout();
    const visibleMenus = menuSettings.visibleMenus ?? [];
    const defaultExpanded = menuSettings.defaultExpanded;
    const isExpanded = isDrawer ? true : expand;

    const items = useMemo(() => {
      if (!visibleMenus.length) return menuItems;
      return menuItems.filter((item) =>
        visibleMenus.includes(item.path || item.title),
      );
    }, [menuItems, visibleMenus]);

    const translatedMenus = useTranslatedMenus(
      items,
      t,
      language,
    ) as MenuItem[];
    const [menus, setMenus] = useState<MenuItem[]>(translatedMenus);
    const [searchText, setSearchText] = useState<string>();

    function handleSearch(text?: string) {
      const newMenus = nestedSearch(
        translatedMenus,
        "title",
        text,
      ) as MenuItem[];
      setMenus(newMenus);
    }

    useEffect(() => {
      handleSearch(searchText);
    }, [searchText, language, translatedMenus]);

    useEffect(() => {
      if (isDrawer) return;
      setExpand(defaultExpanded ?? true);
    }, [defaultExpanded, isDrawer, setExpand]);

    return (
      <div
        ref={ref}
        className={cn(
          "sticky inset-s-0 top-0 z-5 flex h-full flex-col overflow-x-hidden border-sidebar-border",
          "overflow-y-auto bg-sidebar transition-all duration-300 ease-in-out",
          !isDrawer && "border-e",
        )}
        style={{ width, minWidth: width, maxWidth: width }}
      >
        <div className="flex-1 p-4 pt-0">
          <div className="sticky top-0 z-6 bg-sidebar pb-2">
            <div
              className={cn("flex h-20 w-full items-center justify-between", {
                "justify-center pt-4": !isExpanded,
              })}
            >
              <LogoSection
                expand={isExpanded}
                onLogoClick={() => router.push("/")}
                appName={branding.appName}
                logoSrc={branding.logoSrc}
              />
              {!isDrawer && (
                <ToggleButton expand={expand} setExpand={setExpand} />
              )}
            </div>
            <SearchBar
              expand={isExpanded}
              searchText={searchText}
              setSearchText={setSearchText}
              t={t}
            />
          </div>
          {!!pinned.length &&
            (isExpanded ? <PinnedMenus /> : <CollapsedPinnedMenus />)}
          <Divider />
          <SidebarMenu
            loading={loadingMenus}
            items={menus}
            type={isExpanded ? "expanded" : "collapsed"}
          />
        </div>
        <div className={cn("sticky bottom-0 z-6 mt-auto bg-sidebar px-4 py-2")}>
          {footer}
        </div>
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

export default Sidebar;

/** @deprecated Use `<Sidebar variant="drawer" />` */
export function MobileSidebar(props: SidebarProps) {
  return <Sidebar {...props} variant="drawer" />;
}
