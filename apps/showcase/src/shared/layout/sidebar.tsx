import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, Sidebar as SidebarIcon } from "lucide-react";
import { cn } from "@/lib";
import { catalogCategoryGroups } from "@/features/catalog/registry";
import { useCatalogNavGroups } from "@/features/catalog/hooks/use-catalog-nav-groups";
import { CatalogNavGroup } from "@/shared/layout/catalog-nav-group";
import { useShowcaseShell } from "@/features/catalog/i18n";
import useDashboardSignals from "@/components/layout/dashboard/context/useDashboardSignals";

type ShowcaseSidebarProps = {
  /** Always show labels (e.g. mobile drawer). */
  forceExpanded?: boolean;
};

export function ShowcaseSidebar({ forceExpanded = false }: ShowcaseSidebarProps) {
  const { appName, title, nav, sidebar, categoryTitle } = useShowcaseShell();
  const { expand, setExpand } = useDashboardSignals();
  const { isGroupOpen, setGroupOpen } = useCatalogNavGroups();
  const isExpanded = forceExpanded || expand;

  const navItems = [
    { to: "/", label: nav.home, icon: Home },
    { to: "/components", label: nav.allComponents, icon: LayoutGrid },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="border-sidebar-border flex items-center justify-between gap-2 border-b px-3 py-4">
        {isExpanded ? (
          <div className="min-w-0 ps-1">
            <p className="text-primary text-xs font-semibold tracking-widest uppercase">
              {appName}
            </p>
            <h1 className="text-sidebar-foreground truncate text-lg font-bold">{title}</h1>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => !forceExpanded && setExpand(!expand)}
          className="text-sidebar-icon hover:bg-sidebar-accent shrink-0 rounded-full p-2 transition-colors"
          aria-label={isExpanded ? sidebar.collapse : sidebar.expand}
        >
          <SidebarIcon
            className={cn("size-5 transition-transform", {
              "ltr:rotate-180": isExpanded,
              "rtl:rotate-0": !isExpanded,
            })}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                title={!isExpanded ? label : undefined}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    !isExpanded && "justify-center px-2",
                  )
                }
              >
                <Icon className="size-4 shrink-0" />
                {isExpanded ? <span>{label}</span> : null}
              </NavLink>
            </li>
          ))}
        </ul>

        {isExpanded ? (
          <div className="mt-5 space-y-2 px-1">
            <div className="bg-sidebar-border/60 h-px" />
            {catalogCategoryGroups.map(({ group, items }) => (
              <CatalogNavGroup
                key={group}
                group={group}
                label={nav[group]}
                items={items}
                isOpen={isGroupOpen(group)}
                onOpenChange={(open) => setGroupOpen(group, open)}
                getItemLabel={(category) => categoryTitle(category.slug)}
              />
            ))}
          </div>
        ) : (
          <ul className="mt-4 space-y-0.5">
            {catalogCategoryGroups.flatMap(({ items }) =>
              items.map((category) => {
                const label = categoryTitle(category.slug);
                return (
                  <li key={category.slug}>
                    <NavLink
                      to={`/components/${category.slug}`}
                      title={label}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-center rounded-lg px-2 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )
                      }
                    >
                      <category.icon className="size-4 shrink-0" />
                    </NavLink>
                  </li>
                );
              }),
            )}
          </ul>
        )}
      </nav>
    </div>
  );
}
