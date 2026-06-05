import { useState } from "react";
import { Paginator } from "@/components/common/paginator";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function PaginatorPage() {
  const p = useShowcasePage("paginator");
  const [page, setPage] = useState(2);

  return (
    <CatalogPageShell slug="paginator">
      <ShowcaseSection title={p("controlled.title")}>
        <Paginator
          currentPage={page}
          totalPages={8}
          pageSize={10}
          onPageChange={setPage}
        />
      </ShowcaseSection>
      <ShowcaseSection title={p("firstPage.title")} delay={0.05}>
        <Paginator currentPage={1} totalPages={4} pageSize={25} onPageChange={() => undefined} />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
