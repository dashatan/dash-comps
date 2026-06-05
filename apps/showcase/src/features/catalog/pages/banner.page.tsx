import Banner from "@/components/common/banner";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

export function BannerPage() {
  const p = useShowcasePage("banner");

  return (
    <CatalogPageShell slug="banner">
      <ShowcaseSection title={p("withImage.title")} description={p("withImage.description")}>
        <Banner className="min-h-28 w-full rounded-xl p-4" image="/favicon.svg">
          <p className="font-semibold">{p("withImage.heading")}</p>
          <p className="text-muted-foreground text-sm">{p("withImage.subheading")}</p>
        </Banner>
      </ShowcaseSection>
      <ShowcaseSection title={p("contentOnly.title")} delay={0.05}>
        <Banner className="bg-primary/10 min-h-20 w-full rounded-xl p-4">
          <p className="font-medium">{p("contentOnly.content")}</p>
        </Banner>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
