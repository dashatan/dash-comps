import { useLocation, Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { cn } from "@/lib";
import { HEADER_HEIGHT } from "@/components/layout/dashboard/types";
import LanguageSelect from "@/components/layout/dashboard/header/language-select";
import { ThemeToggle } from "@/shared/layout/theme-toggle";
import { useShowcaseI18n } from "@/i18n";
import { catalogCategories } from "@/features/catalog/registry";
import Button from "@/components/common/buttons";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/common/overlay/sheet";
import { ShowcaseSidebar } from "@/shared/layout/sidebar";
import { SIDEBAR_WIDTH } from "@/components/layout/dashboard/types";

export function ShowcaseHeader() {
  const { t } = useShowcaseI18n();
  const location = useLocation();
  const slug = location.pathname.split("/").pop();
  const category = catalogCategories.find((c) => c.slug === slug);
  const title =
    location.pathname === "/"
      ? t.nav.home
      : location.pathname === "/components"
        ? t.catalog.indexTitle
        : category
          ? t.categories[category.slug].title
          : t.showcase;

  return (
    <header
      className={cn(
        "border-sidebar-border bg-sidebar text-sidebar-foreground flex shrink-0 items-center justify-between border-b px-4 md:px-6",
      )}
      style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="icon" severity="info" className="flex size-10 p-0 md:hidden">
              <Menu className="text-sidebar-icon size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-sidebar w-[min(100%,320px)] p-0">
            <SheetTitle className="sr-only">{t.nav.categories}</SheetTitle>
            <div style={{ width: SIDEBAR_WIDTH }} className="h-full">
              <ShowcaseSidebar forceExpanded />
            </div>
          </SheetContent>
        </Sheet>
        <nav className="text-muted-foreground hidden items-center gap-2 text-sm sm:flex">
          <Link to="/" className="hover:text-foreground transition-colors">
            {t.nav.home}
          </Link>
          {location.pathname !== "/" ? (
            <>
              <span>/</span>
              <span className="text-foreground truncate font-medium">{title}</span>
            </>
          ) : null}
        </nav>
        <h1 className="text-foreground truncate text-base font-semibold sm:hidden">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSelect />
        <ThemeToggle />
      </div>
    </header>
  );
}
