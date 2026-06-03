import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
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
  return (
    <CatalogPageShell slug="cards">
      <ShowcaseSection title="Default card">
        <Card className="w-full ">
          <CardHeader>
            <CardTitle>Project overview</CardTitle>
            <CardDescription>
              Track progress across your active dashboards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Cards adapt to light and dark themes using semantic tokens from
              your design system.
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">View details</Button>
            <Button variant="outlined" size="sm">
              Dismiss
            </Button>
          </CardFooter>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection title="Variants" delay={0.05}>
        <Card variant="default" className="w-48 p-4">
          <p className="text-sm font-medium">Default</p>
        </Card>
        <Card variant="outline" className="w-48 p-4">
          <p className="text-sm font-medium">Outline</p>
        </Card>
        <Card variant="ghost" className="w-48 p-4">
          <p className="text-sm font-medium">Ghost</p>
        </Card>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
