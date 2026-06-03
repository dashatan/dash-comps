import SpinnerLoading from "@/components/common/loading/spinner";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function LoadingPage() {
  return (
    <CatalogPageShell slug="loading">
      <ShowcaseSection title="Default spinner">
        <SpinnerLoading />
      </ShowcaseSection>
      <ShowcaseSection title="Sizes" delay={0.05}>
        <SpinnerLoading className="size-5" />
        <SpinnerLoading className="size-8" />
        <SpinnerLoading className="size-12" />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
