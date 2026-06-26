import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { cn } from "@/lib";
import { HEADER_HEIGHT } from "@/components/layout/dashboard/types";
import LanguageSelect from "@/components/layout/dashboard/header/language-select";
import { ThemeToggle } from "@/shared/layout/theme-toggle";
import { useShowcaseShell } from "@/features/catalog/i18n";
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
  const {
    title: showcaseTitle,
    nav,
    catalog,
    categoryTitle,
  } = useShowcaseShell();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const slug = pathname.split("/").pop();
  const category = catalogCategories.find((c) => c.slug === slug);
  const title =
    pathname === "/"
      ? nav.home
      : pathname === "/components"
        ? catalog.indexTitle
        : category
          ? categoryTitle(category.slug)
          : showcaseTitle;

  return (
    <header
      className={cn(
        "flex shrink-0 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 text-sidebar-foreground md:px-6",
      )}
      style={{ height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="icon"
              severity="info"
              className="flex size-10 p-0 md:hidden"
            >
              <Menu className="size-5 text-sidebar-icon" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[min(100%,320px)] bg-sidebar p-0"
          >
            <SheetTitle className="sr-only">{nav.categories}</SheetTitle>
            <div style={{ width: SIDEBAR_WIDTH }} className="h-full">
              <ShowcaseSidebar forceExpanded />
            </div>
          </SheetContent>
        </Sheet>
        <nav className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <Link to="/" className="transition-colors hover:text-foreground">
            {nav.home}
          </Link>
          {pathname !== "/" ? (
            <>
              <span>/</span>
              <span className="truncate font-medium text-foreground">
                {title}
              </span>
            </>
          ) : null}
        </nav>
        <h1 className="truncate text-base font-semibold text-foreground sm:hidden">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSelect />
        <ThemeToggle />
      </div>
    </header>
  );
}
