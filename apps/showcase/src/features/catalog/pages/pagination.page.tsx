import { useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/common/pagination";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

const VARIANTS = ["default", "ghost", "outline"] as const;
const DISABLED_CLASS = "pointer-events-none opacity-50";

type PaginationVariant = (typeof VARIANTS)[number];

function ShowcaseRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function getVisiblePages(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) {
    pages.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < total - 1) {
    pages.push("ellipsis");
  }

  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

type PaginationDemoProps = {
  page: number;
  totalPages: number;
  variant?: PaginationVariant;
  showFirstLast?: boolean;
  showPageLinks?: boolean;
  onPageChange?: (page: number) => void;
  className?: string;
};

function PaginationDemo({
  page,
  totalPages,
  variant = "default",
  showFirstLast = true,
  showPageLinks = true,
  onPageChange,
  className,
}: PaginationDemoProps) {
  const isFirst = page <= 1;
  const isLast = page >= totalPages;
  const visiblePages = getVisiblePages(page, totalPages);

  const go = (next: number) => {
    if (!onPageChange) {
      return;
    }
    onPageChange(Math.min(totalPages, Math.max(1, next)));
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, next: number) => {
    event.preventDefault();
    go(next);
  };

  return (
    <Pagination variant={variant} className={className}>
      <PaginationContent>
        {showFirstLast ? (
          <PaginationItem>
            <PaginationFirst
              href="#"
              className={cn(isFirst && DISABLED_CLASS)}
              onClick={(event) => handleClick(event, 1)}
            />
          </PaginationItem>
        ) : null}

        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={cn(isFirst && DISABLED_CLASS)}
            onClick={(event) => handleClick(event, page - 1)}
          />
        </PaginationItem>

        {showPageLinks
          ? visiblePages.map((item, index) =>
              item === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    isActive={page === item}
                    onClick={(event) => handleClick(event, item)}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )
          : null}

        <PaginationItem>
          <PaginationNext
            href="#"
            className={cn(isLast && DISABLED_CLASS)}
            onClick={(event) => handleClick(event, page + 1)}
          />
        </PaginationItem>

        {showFirstLast ? (
          <PaginationItem>
            <PaginationLast
              href="#"
              className={cn(isLast && DISABLED_CLASS)}
              onClick={(event) => handleClick(event, totalPages)}
            />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}

export function PaginationPage() {
  const p = useShowcasePage("pagination");
  const [page, setPage] = useState(5);
  const controlledTotal = 20;

  return (
    <CatalogPageShell slug="pagination">
      <ShowcaseSection title={p("controlled.title")} layout="stack">
        <PaginationDemo
          page={page}
          totalPages={controlledTotal}
          onPageChange={setPage}
        />
        <p className="text-sm text-muted-foreground">
          {p("controlled.info", { page, total: controlledTotal })}
        </p>
      </ShowcaseSection>

      <ShowcaseSection title={p("variants.title")} layout="stack" delay={0.05}>
        {VARIANTS.map((variant) => (
          <ShowcaseRow key={variant} label={p(`variants.${variant}`)}>
            <PaginationDemo page={3} totalPages={5} variant={variant} />
          </ShowcaseRow>
        ))}
      </ShowcaseSection>

      <ShowcaseSection title={p("navigation.title")} layout="stack" delay={0.1}>
        <ShowcaseRow label={p("navigation.previousNext")}>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </ShowcaseRow>
        <ShowcaseRow label={p("navigation.firstLast")}>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationFirst href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </ShowcaseRow>
        <ShowcaseRow label={p("navigation.full")}>
          <PaginationDemo page={4} totalPages={8} />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection title={p("pageLinks.title")} delay={0.15}>
        <Pagination>
          <PaginationContent>
            {Array.from({ length: 5 }, (_, index) => index + 1).map(
              (number) => (
                <PaginationItem key={number}>
                  <PaginationLink href="#" isActive={number === 3}>
                    {number}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
          </PaginationContent>
        </Pagination>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("ellipsis.title")}
        description={p("ellipsis.description")}
        delay={0.2}
      >
        <PaginationDemo page={10} totalPages={20} />
      </ShowcaseSection>

      <ShowcaseSection title={p("firstPage.title")} delay={0.25}>
        <PaginationDemo page={1} totalPages={10} />
      </ShowcaseSection>

      <ShowcaseSection title={p("lastPage.title")} delay={0.3}>
        <PaginationDemo page={10} totalPages={10} />
      </ShowcaseSection>

      <ShowcaseSection title={p("singlePage.title")} delay={0.35}>
        <PaginationDemo page={1} totalPages={1} />
      </ShowcaseSection>

      <ShowcaseSection title={p("fewPages.title")} delay={0.4}>
        <PaginationDemo page={2} totalPages={5} />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
