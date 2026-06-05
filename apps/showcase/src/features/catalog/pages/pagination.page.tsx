import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/common/pagination";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

const TOTAL = 5;

export function PaginationPage() {
  const p = useShowcasePage("pagination");
  const [page, setPage] = useState(1);

  return (
    <CatalogPageShell slug="pagination">
      <ShowcaseSection title={p("pageLinks.title")}>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.max(1, prev - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => (
              <PaginationItem key={n}>
                <PaginationLink
                  href="#"
                  isActive={page === n}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(n);
                  }}
                >
                  {n}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.min(TOTAL, prev + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </ShowcaseSection>
      <ShowcaseSection title={p("currentPage.title")} delay={0.05}>
        <p className="text-muted-foreground text-sm">
          {p("currentPage.info", { page, total: TOTAL })}
        </p>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
