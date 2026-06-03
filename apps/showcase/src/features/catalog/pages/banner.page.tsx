import Banner from "@/components/common/banner";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function BannerPage() {
  return (
    <CatalogPageShell slug="banner">
      <ShowcaseSection title="With image" description="Banner from @/components/common/banner.">
        <Banner className="min-h-28 w-full rounded-xl p-4" image="/favicon.svg">
          <p className="font-semibold">Welcome banner</p>
          <p className="text-muted-foreground text-sm">Promotional surface with background image.</p>
        </Banner>
      </ShowcaseSection>
      <ShowcaseSection title="Content only" delay={0.05}>
        <Banner className="bg-primary/10 min-h-20 w-full rounded-xl p-4">
          <p className="font-medium">No image — gradient / solid background via className.</p>
        </Banner>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
