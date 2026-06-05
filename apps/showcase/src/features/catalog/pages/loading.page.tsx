import SpinnerLoading from "@/components/common/loading/spinner";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function LoadingPage() {
  const p = useShowcasePage("loading");

  return (
    <CatalogPageShell slug="loading">
      <ShowcaseSection title={p("defaultSpinner.title")}>
        <SpinnerLoading />
      </ShowcaseSection>
      <ShowcaseSection title={p("sizes.title")} delay={0.05}>
        <SpinnerLoading className="size-5" />
        <SpinnerLoading className="size-8" />
        <SpinnerLoading className="size-12" />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
