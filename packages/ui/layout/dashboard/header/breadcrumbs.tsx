import { H2 } from "@dash/ui/common/typography";
import { cn, deviceType } from "@dash/core";
import { useLanguage } from "@dash/core";
import type { Translation } from "@dash/core/language/client";
import type { TranslationKeys } from "@dash/core/language/locales";
import useDashboardSignals from "@dash/ui/layout/dashboard/context/useDashboardSignals";
import {
  useDashboardPathname,
  useDashboardRouter,
} from "@dash/ui/layout/dashboard/navigation/context";
import type { Breadcrumb } from "@dash/ui/layout/dashboard/types";
import { Home } from "iconsax-reactjs";
import Button from "@dash/ui/common/buttons";
import { LogoSection } from "@dash/ui/layout/dashboard/sidebar";
import { useDashboardLayout } from "@dash/ui/layout/dashboard/context/layout-context";
import {
  DirectionalBackArrow,
  DirectionalChevron,
} from "@dash/ui/layout/dashboard/direction/directional-icon";

const breadcrumbPathToNavKey: Record<string, string> = {
  users: "userManagement",
  "traffic/search": "trafficSearch",
  "traffic/tracker": "trafficTracker",
  "traffic/travel": "trips",
  "traffic/trips": "trips",
  trips: "trips",
  "/trips": "trips",
  "traffic/bulk-requests": "bulkActions",
  "watch-list": "watchList",
  "co-path": "coPath",
  "co-location": "coLocation",
  encounter: "encounterPossibility",
  locating: "locating",
  notifications: "notification",
  devices: "cameras",
  provinces: "provinces",
  "users/log": "userLog",
  "watch-list/plates": "watchListPlates",
  companies: "companies",
  plates: "plates",
  persons: "persons",
  "bulk-actions": "bulkActions",
  changelog: "changelog",
  "advanced-search": "advancedSearch",
  "plate-finder": "plateFinder",
  "plate-finder/search": "plateSearch",
  dashboard: "main",
  "monitoring/sources": "sources",
  "monitoring/devices": "cameras",
  "monitoring/services": "services",
  "profiles/persons": "persons",
  "profiles/plates": "plates",
  "profiles/sources": "sources",
  "profiles/provinces": "provinces",
  "profiles/companies": "companies",
  "profiles/devices": "cameras",
  tutorial: "tutorial",
  reports: "reports",
};

function resolveBreadcrumbLabel(path: string, t: Translation): string {
  const crumb = t(`breadCrumbs.${path}` as TranslationKeys);
  if (crumb) return crumb;

  const navKey = breadcrumbPathToNavKey[path];
  if (navKey) {
    return (
      t(`common.nav.${navKey}` as TranslationKeys) ||
      t(`common.${navKey}` as TranslationKeys)
    );
  }

  return "";
}

function getBreadcrumbsFromPath(
  pathname: string,
  t: Translation,
): Breadcrumb[] {
  const pathArr = (pathname || "").split("/").filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [];

  breadcrumbs.push({
    label: t("breadCrumbs." as TranslationKeys) || "/",
    href: "/",
  });

  pathArr.forEach((_, i, a) => {
    let word = "";
    for (let len = Math.min(5, i + 1); len > 0; len--) {
      const index = a.slice(i - len + 1, i + 1).join("/");
      word = resolveBreadcrumbLabel(index, t);
      if (word) break;
    }
    breadcrumbs.push({
      label: word || a[i],
      href: "/" + a.slice(0, i + 1).join("/"),
    });
  });

  return breadcrumbs;
}

export default function BreadCrumbs() {
  const router = useDashboardRouter();
  const pathname = useDashboardPathname();
  const { t } = useLanguage();
  const { breadcrumbs } = useDashboardSignals();
  const { branding } = useDashboardLayout();

  const items: Breadcrumb[] = breadcrumbs?.items?.length
    ? breadcrumbs.items
    : getBreadcrumbsFromPath(pathname, t);

  const lastIndex = items.length - 1;
  const title =
    breadcrumbs?.title || (items.length ? items[lastIndex].label : "");
  const isMobile = deviceType() === "mobile";

  if (items.length === 1 && isMobile)
    return (
      <LogoSection
        expand={true}
        onLogoClick={() => router.push("/")}
        appName={branding.appName}
        logoSrc={branding.logoSrc}
      />
    );

  return (
    <div className="flex items-center gap-3">
      {items.length > 1 && (
        <Button
          variant="icon"
          severity="info"
          size={32}
          className="p-0 text-sidebar-icon transition-all duration-300 hover:text-sidebar-foreground"
          onClick={() => router.back()}
        >
          <DirectionalBackArrow className="size-8" />
        </Button>
      )}
      <div>
        <H2
          className={cn(
            "mt-1 w-36 max-w-36 whitespace-nowrap text-sidebar-foreground",
            "hidden text-xl font-extrabold md:flex",
          )}
        >
          {title}
        </H2>
        <div className="mt-1 flex items-stretch gap-2">
          {items.length > 1 &&
            items.map((item, i) => {
              const last = i === lastIndex;
              return (
                <div key={i} className="flex items-center gap-2">
                  <span
                    onClick={() => {
                      if (!last && item.href) router.push(item.href);
                    }}
                    className={cn(
                      "flex h-full items-center justify-center text-sm font-semibold transition-all duration-300",
                      {
                        "cursor-pointer text-sidebar-icon hover:text-sidebar-foreground":
                          !last && item.href,
                        "cursor-default text-sidebar-foreground":
                          last || !item.href,
                      },
                    )}
                  >
                    {item.href === "/" ? (
                      <Home
                        variant="Bold"
                        size={20}
                        className="-mt-1 text-sidebar-icon transition-all duration-300 hover:text-sidebar-foreground"
                      />
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </span>
                  <span className="cursor-default text-sidebar-foreground">
                    {last ? (
                      ""
                    ) : (
                      <DirectionalChevron
                        variant="forward"
                        size={16}
                        className="size-4 text-sidebar-icon"
                      />
                    )}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
