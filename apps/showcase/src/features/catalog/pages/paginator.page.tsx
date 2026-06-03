import { useState } from "react";
import { Paginator } from "@/components/common/paginator";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function PaginatorPage() {
  const [page, setPage] = useState(2);

  return (
    <CatalogPageShell slug="paginator">
      <ShowcaseSection title="Controlled">
        <Paginator
          currentPage={page}
          totalPages={8}
          pageSize={10}
          onPageChange={setPage}
        />
      </ShowcaseSection>
      <ShowcaseSection title="First page" delay={0.05}>
        <Paginator currentPage={1} totalPages={4} pageSize={25} onPageChange={() => undefined} />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
