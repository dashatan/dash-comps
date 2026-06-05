import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { Button } from "@/components/common/buttons";

export function CardsPage() {
  const p = useShowcasePage("cards");

  return (
    <CatalogPageShell slug="cards">
      <ShowcaseSection title={p("defaultCard.title")}>
        <Card className="w-full ">
          <CardHeader>
            <CardTitle>{p("defaultCard.cardTitle")}</CardTitle>
            <CardDescription>{p("defaultCard.cardDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">{p("defaultCard.cardContent")}</p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">{p("defaultCard.viewDetails")}</Button>
            <Button variant="outlined" size="sm">
              {p("defaultCard.dismiss")}
            </Button>
          </CardFooter>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection title={p("variants.title")} delay={0.05}>
        <Card variant="default" className="w-48 p-4">
          <p className="text-sm font-medium">{p("variants.default")}</p>
        </Card>
        <Card variant="outline" className="w-48 p-4">
          <p className="text-sm font-medium">{p("variants.outline")}</p>
        </Card>
        <Card variant="ghost" className="w-48 p-4">
          <p className="text-sm font-medium">{p("variants.ghost")}</p>
        </Card>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
