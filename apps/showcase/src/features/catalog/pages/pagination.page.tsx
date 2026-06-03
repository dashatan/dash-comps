import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/common/pagination";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

const TOTAL = 5;

export function PaginationPage() {
  const [page, setPage] = useState(1);

  return (
    <CatalogPageShell slug="pagination">
      <ShowcaseSection title="Page links">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
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
                  setPage((p) => Math.min(TOTAL, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </ShowcaseSection>
      <ShowcaseSection title="Current page" delay={0.05}>
        <p className="text-muted-foreground text-sm">Page {page} of {TOTAL}</p>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
