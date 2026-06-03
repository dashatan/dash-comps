import { NavLink } from "react-router-dom";
import { ChevronRight, Home, LayoutGrid, Sidebar as SidebarIcon } from "lucide-react";
import { cn } from "@/lib";
import { catalogCategories } from "@/features/catalog/registry";
import { useShowcaseI18n } from "@/i18n";
import useDashboardSignals from "@/components/layout/dashboard/context/useDashboardSignals";

type ShowcaseSidebarProps = {
  /** Always show labels (e.g. mobile drawer). */
  forceExpanded?: boolean;
};

export function ShowcaseSidebar({ forceExpanded = false }: ShowcaseSidebarProps) {
  const { t } = useShowcaseI18n();
  const { expand, setExpand } = useDashboardSignals();
  const isExpanded = forceExpanded || expand;

  const navItems = [
    { to: "/", label: t.nav.home, icon: Home },
    { to: "/components", label: t.nav.allComponents, icon: LayoutGrid },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="border-sidebar-border flex items-center justify-between gap-2 border-b px-3 py-4">
        {isExpanded ? (
          <div className="min-w-0 ps-1">
            <p className="text-primary text-xs font-semibold tracking-widest uppercase">
              {t.appName}
            </p>
            <h1 className="text-sidebar-foreground truncate text-lg font-bold">{t.showcase}</h1>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => !forceExpanded && setExpand(!expand)}
          className="text-sidebar-icon hover:bg-sidebar-accent shrink-0 rounded-full p-2 transition-colors"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
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
          <p className="text-sidebar-foreground/60 mt-6 mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
            {t.nav.categories}
          </p>
        ) : null}

        <ul className="space-y-0.5">
          {catalogCategories.map((category) => {
            const label = t.categories[category.slug].title;
            return (
              <li key={category.slug}>
                <NavLink
                  to={`/components/${category.slug}`}
                  title={!isExpanded ? label : undefined}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center rounded-lg py-2 text-sm transition-colors",
                      isExpanded ? "justify-between px-3" : "justify-center px-2",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )
                  }
                >
                  {isExpanded ? (
                    <>
                      <span className="flex items-center gap-2 truncate">
                        <category.icon className="size-4 shrink-0 opacity-70" />
                        {label}
                      </span>
                      <ChevronRight className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-60" />
                    </>
                  ) : (
                    <category.icon className="size-4 shrink-0" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
