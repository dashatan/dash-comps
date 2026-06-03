"use client";

import React, { useEffect, useMemo, useState, forwardRef, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn, nestedSearch } from "@/lib/utils";
import { Divider } from "@/components/common/divider";
import BasicTextInput from "@/components/common/inputs/text/basic";
import { TranslationKeys } from "@/lib/language/locales";
import SidebarMenu from "@/components/layout/dashboard/sidebar/menu";
import { MenuItem } from "@/components/layout/dashboard/types";
import useDashboardSignals from "@/components/layout/dashboard/context/useDashboardSignals";
import PinnedMenus from "@/components/layout/dashboard/sidebar/menu/pinned-menus";
import CollapsedPinnedMenus from "@/components/layout/dashboard/sidebar/menu/collapsed-pinned-menus";
import { SidebarRight, SearchNormal1 } from "iconsax-reactjs";
import Button from "@/components/common/buttons";
import { X } from "lucide-react";
import { useLanguage } from "@/lib";
import { useAppStore } from "@/store";

// Custom hook to translate menu items
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

// Logo and App Info
export const LogoSection = ({
  expand,
  onLogoClick,
  t,
}: {
  expand: boolean;
  onLogoClick: () => void;
  t: (key: TranslationKeys) => string;
}) => (
  <div
    className={cn("my-4 flex cursor-pointer items-center gap-0", { hidden: !expand })}
    onClick={onLogoClick}
  >
    <div className="flex items-center gap-2 p-2 whitespace-nowrap">
      {/* <span className='text-sidebar-foreground text-2xl font-bold'>{t('app.name')}</span> */}
      <img src="/logo.svg" alt="Logo" className="text-sidebar-foreground size-10" />
      <span className="text-sidebar-foreground text-xl">{t("app.name")}</span>
    </div>
  </div>
);

// Sidebar Toggle Button
const ToggleButton = ({
  expand,
  setExpand,
}: {
  expand: boolean;
  setExpand: (v: boolean) => void;
}) => (
  <div
    className={cn(
      "text-sidebar-icon bg-sidebar cursor-pointer rounded-full border-none transition-all",
      // 'hover:r-sidebar-icon hover:ring-offset-sidebar hover:ring-2 hover:ring-offset-2'
    )}
    onClick={() => setExpand(!expand)}
  >
    <SidebarRight
      size={24}
      className={cn("transition-all", {
        "ltr:rotate-180": expand,
        "rtl:rotate-180": !expand,
      })}
    />
  </div>
);

// Search Bar
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
        "bg-input flex min-h-12 w-full cursor-text items-center rounded-lg border",
        { hidden: !expand },
      )}
      onClick={() => {
        searchInputRef?.current?.focus();
      }}
    >
      <SearchNormal1 className="text-sidebar-icon ms-4 me-2 min-w-6" size={24} />
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
        className={cn("pointer-events-none ms-auto me-2 opacity-0 transition-all", {
          "pointer-events-auto opacity-100": !!searchText?.length,
        })}
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
};

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ footer, menuItems, width }, ref) => {
    const { t, language } = useLanguage();
    const router = useRouter();
    const { expand, setExpand, loadingMenus, pinned } = useDashboardSignals();
    const visibleMenus = useAppStore((state) => state.preferences.menuSettings.visibleMenus);
    const defaultExpanded = useAppStore((state) => state.preferences.menuSettings.defaultExpanded);

    const items = useMemo(() => {
      if (!visibleMenus.length) return menuItems;
      return menuItems.filter((item) => visibleMenus.includes(item.path || item.title));
    }, [menuItems, visibleMenus]);
    // Translate menu items
    const translatedMenus = useTranslatedMenus(items, t, language) as MenuItem[];
    const [menus, setMenus] = useState<MenuItem[]>(translatedMenus);
    const [searchText, setSearchText] = useState<string>();

    // Search handler
    function handleSearch(text?: string) {
      const newMenus = nestedSearch(translatedMenus, "title", text) as MenuItem[];
      setMenus(newMenus);
    }

    // Update menus on search or language change
    useEffect(() => {
      handleSearch(searchText);
    }, [searchText, language, translatedMenus]);

    useEffect(() => {
      setExpand(defaultExpanded || true);
    }, [defaultExpanded]);

    return (
      <div
        ref={ref}
        className={cn(
          "border-sidebar-border sticky inset-s-0 top-0 z-5 flex h-full flex-col overflow-x-hidden",
          "bg-sidebar overflow-y-auto border-l transition-all duration-300 ease-in-out",
        )}
        style={{ width, minWidth: width, maxWidth: width }}
      >
        <div className="flex-1 p-4 pt-0">
          <div className="bg-sidebar sticky top-0 z-6 pb-2">
            <div
              className={cn("flex h-20 w-full items-center justify-between", {
                "justify-center pt-4": !expand,
              })}
            >
              <LogoSection
                expand={expand}
                onLogoClick={() => router.push("/")}
                t={t}
              />
              <ToggleButton expand={expand} setExpand={setExpand} />
            </div>
            <SearchBar
              expand={expand}
              searchText={searchText}
              setSearchText={setSearchText}
              t={t}
            />
          </div>
          {!!pinned.length &&
            (expand ? <PinnedMenus /> : <CollapsedPinnedMenus />)}
          <Divider />
          <SidebarMenu
            loading={loadingMenus}
            items={menus}
            type={expand ? "expanded" : "collapsed"}
          />
        </div>
        <div className={cn("bg-sidebar sticky bottom-0 z-6 mt-auto px-4 py-2")}>
          {footer}
        </div>
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

export default Sidebar;

export function MobileSidebar({ menuItems, footer, width }: SidebarProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { loadingMenus, pinned } = useDashboardSignals();
  const visibleMenus = useAppStore((state) => state.preferences.menuSettings.visibleMenus);

  const items = useMemo(() => {
    if (!visibleMenus.length) return menuItems;
    return menuItems.filter((item) => visibleMenus.includes(item.path || item.title));
  }, [menuItems, visibleMenus]);
  // Translate menu items
  const translatedMenus = useTranslatedMenus(items, t, language) as MenuItem[];
  const [menus, setMenus] = useState<MenuItem[]>(translatedMenus);
  const [searchText, setSearchText] = useState<string>();

  // Search handler
  function handleSearch(text?: string) {
    const newMenus = nestedSearch(translatedMenus, "title", text) as MenuItem[];
    setMenus(newMenus);
  }

  // Update menus on search or language change
  useEffect(() => {
    handleSearch(searchText);
  }, [searchText, language, translatedMenus]);

  return (
    <div
      className={cn(
        "bg-sidebar z-5 flex h-full flex-col overflow-x-hidden overflow-y-auto",
      )}
      style={{ width, minWidth: width, maxWidth: width }}
    >
      <div className="flex-1 p-4 pt-0">
        <div className="bg-sidebar sticky top-0 z-6 pb-2">
          <div className={cn("flex h-20 w-full items-center justify-between")}>
            <LogoSection expand={true} onLogoClick={() => router.push("/")} t={t} />
          </div>
          <SearchBar
            expand={true}
            searchText={searchText}
            setSearchText={setSearchText}
            t={t}
          />
        </div>
        {!!pinned.length && <PinnedMenus />}
        <Divider />
        <SidebarMenu loading={loadingMenus} items={menus} type="expanded" />
      </div>
      <div className={cn("bg-sidebar sticky bottom-0 z-6 mt-auto px-4 py-2")}>
        {footer}
      </div>
    </div>
  );
}
