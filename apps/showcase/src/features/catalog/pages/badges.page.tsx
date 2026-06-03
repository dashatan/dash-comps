import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import Badge from "@/components/common/badge";

export function BadgesPage() {
  return (
    <CatalogPageShell slug="badges">
      <ShowcaseSection title="Severities">
        <Badge severity="primary">Primary</Badge>
        <Badge severity="secondary">Secondary</Badge>
        <Badge severity="success">Success</Badge>
        <Badge severity="warning">Warning</Badge>
        <Badge severity="danger">Danger</Badge>
        <Badge severity="info">Info</Badge>
      </ShowcaseSection>

      <ShowcaseSection title="Sizes" delay={0.05}>
        <Badge size="xs">XS</Badge>
        <Badge size="sm">SM</Badge>
        <Badge size="md">MD</Badge>
        <Badge size="lg">LG</Badge>
        <Badge size="xl">XL</Badge>
      </ShowcaseSection>

      <ShowcaseSection title="Appearances" delay={0.1}>
        <Badge severity="primary" appearance="filled">
          Filled
        </Badge>
        <Badge severity="primary" appearance="outline">
          Outline
        </Badge>
        <Badge severity="success" withShadow>
          With shadow
        </Badge>
        <Badge severity="warning" withRing>
          With ring
        </Badge>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
