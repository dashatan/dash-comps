import { useState, type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib";
import { Button } from "@/components/common/buttons";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import {
  showcaseCardSizes,
  showcaseCardVariants,
} from "@/features/catalog/data/card-samples";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

function CardStack({ children }: { children: ReactNode }) {
  return <div className="flex w-full min-w-0 flex-col gap-4">{children}</div>;
}

function LabeledCard({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-2", className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

export function CardsPage() {
  const p = useShowcasePage("cards");
  const [selected, setSelected] = useState(false);

  return (
    <CatalogPageShell slug="cards">
      <ShowcaseSection
        title={p("compound.title")}
        description={p("compound.description")}
        layout="stack"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{p("compound.cardTitle")}</CardTitle>
            <CardDescription>{p("compound.cardDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {p("compound.cardContent")}
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">{p("compound.viewDetails")}</Button>
            <Button variant="outlined" size="sm">
              {p("compound.dismiss")}
            </Button>
          </CardFooter>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("headerAction.title")}
        description={p("headerAction.description")}
        layout="stack"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{p("headerAction.cardTitle")}</CardTitle>
            <CardDescription>
              {p("headerAction.cardDescription")}
            </CardDescription>
            <CardAction>
              <Button
                variant="icon"
                severity="muted"
                size={32}
                aria-label={p("headerAction.menuLabel")}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {p("headerAction.cardContent")}
            </p>
          </CardContent>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("variants.title")}
        description={p("variants.description")}
      >
        {showcaseCardVariants.map((variant) => (
          <LabeledCard key={variant} label={p(`variants.${variant}`)}>
            <Card variant={variant} className="w-full">
              <CardContent>
                <p className="text-sm font-medium">
                  {p(`variants.${variant}`)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {p("variants.sampleContent")}
                </p>
              </CardContent>
            </Card>
          </LabeledCard>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sizes.title")}
        description={p("sizes.description")}
        layout="stack"
      >
        <CardStack>
          {showcaseCardSizes.map((size) => (
            <LabeledCard key={size} label={p(`sizes.${size}`)} className="">
              <Card size={size} className="w-full">
                <CardHeader className="px-0">
                  <CardTitle>{p("sizes.sampleTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <p className="text-sm text-muted-foreground">
                    {p("sizes.sampleContent")}
                  </p>
                </CardContent>
              </Card>
            </LabeledCard>
          ))}
        </CardStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("compositions.title")}
        description={p("compositions.description")}
      >
        <LabeledCard label={p("compositions.contentOnly")}>
          <Card className="w-full">
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {p("compositions.contentOnlyBody")}
              </p>
            </CardContent>
          </Card>
        </LabeledCard>

        <LabeledCard label={p("compositions.headerContent")}>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{p("compositions.headerContentTitle")}</CardTitle>
              <CardDescription>
                {p("compositions.headerContentDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {p("compositions.headerContentBody")}
              </p>
            </CardContent>
          </Card>
        </LabeledCard>

        <LabeledCard label={p("compositions.titleOnly")}>
          <Card variant="outline" className="w-full">
            <CardHeader>
              <CardTitle>{p("compositions.titleOnlyLabel")}</CardTitle>
            </CardHeader>
          </Card>
        </LabeledCard>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("bordered.title")}
        description={p("bordered.description")}
        layout="stack"
      >
        <Card className="w-full">
          <CardHeader className="border-b">
            <CardTitle>{p("bordered.cardTitle")}</CardTitle>
            <CardDescription>{p("bordered.cardDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{p("bordered.cardContent")}</p>
          </CardContent>
          <CardFooter className="gap-2 border-t">
            <Button size="sm">{p("bordered.save")}</Button>
            <Button variant="outlined" size="sm">
              {p("bordered.cancel")}
            </Button>
          </CardFooter>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("interactive.title")}
        description={p("interactive.description")}
        layout="stack"
      >
        <Card
          role="button"
          tabIndex={0}
          aria-pressed={selected}
          onClick={() => setSelected((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setSelected((value) => !value);
            }
          }}
          className={cn(
            "w-full cursor-pointer transition-colors outline-none",
            "hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            selected && "border-primary ring-1 ring-primary/20",
          )}
        >
          <CardHeader>
            <CardTitle>{p("interactive.cardTitle")}</CardTitle>
            <CardDescription>
              {p("interactive.cardDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {p("interactive.cardContent")}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              size="sm"
              variant={selected ? "contained" : "outlined"}
              className="pointer-events-none"
            >
              {selected ? p("interactive.selected") : p("interactive.select")}
            </Button>
          </CardFooter>
        </Card>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
