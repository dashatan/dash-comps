import { H1, H2, H3, H4, P } from "@/components/common/typography";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function TypographyPage() {
  return (
    <CatalogPageShell slug="typography">
      <ShowcaseSection title="Headings" className="flex-col items-start gap-2">
        <H1>Heading 1</H1>
        <H2>Heading 2</H2>
        <H3>Heading 3</H3>
        <H4>Heading 4</H4>
      </ShowcaseSection>
      <ShowcaseSection title="Paragraph" delay={0.05} className="flex-col items-start">
        <P>Body text — default paragraph style from the typography module.</P>
        <P className="text-muted-foreground">Muted paragraph with className override.</P>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
