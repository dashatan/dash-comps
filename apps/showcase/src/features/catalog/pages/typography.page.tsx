import { H1, H2, H3, H4, P } from "@/components/common/typography";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function TypographyPage() {
  const p = useShowcasePage("typography");

  return (
    <CatalogPageShell slug="typography">
      <ShowcaseSection title={p("headings.title")} className="flex-col items-start gap-2">
        <H1>{p("headings.h1")}</H1>
        <H2>{p("headings.h2")}</H2>
        <H3>{p("headings.h3")}</H3>
        <H4>{p("headings.h4")}</H4>
      </ShowcaseSection>
      <ShowcaseSection title={p("paragraph.title")} delay={0.05} className="flex-col items-start">
        <P>{p("paragraph.body")}</P>
        <P className="text-muted-foreground">{p("paragraph.muted")}</P>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
