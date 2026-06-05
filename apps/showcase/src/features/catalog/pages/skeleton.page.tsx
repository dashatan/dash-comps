import Skeleton from "@/components/common/skeleton";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function SkeletonPage() {
  const p = useShowcasePage("skeleton");

  return (
    <CatalogPageShell slug="skeleton">
      <ShowcaseSection title={p("textPlaceholders.title")}>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-24" />
      </ShowcaseSection>
      <ShowcaseSection title={p("cardBlock.title")} delay={0.05} className="w-full">
        <div className="flex w-full max-w-md flex-col gap-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
