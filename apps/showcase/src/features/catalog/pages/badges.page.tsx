import type { ReactNode } from "react";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";
import Badge from "@/components/common/badge";
import type { BadgeProps } from "@/components/common/badge";

const SEVERITIES = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
] as const satisfies readonly NonNullable<BadgeProps["severity"]>[];

const SIZES = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
] as const satisfies readonly NonNullable<BadgeProps["size"]>[];

function ShowcaseRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function BadgesPage() {
  const p = useShowcasePage("badges");

  return (
    <CatalogPageShell slug="badges">
      <ShowcaseSection title={p("severitiesFilled.title")}>
        {SEVERITIES.map((severity) => (
          <Badge key={severity} severity={severity}>
            {severity}
          </Badge>
        ))}
      </ShowcaseSection>

      <ShowcaseSection title={p("severitiesOutline.title")} delay={0.05}>
        {SEVERITIES.map((severity) => (
          <Badge key={severity} severity={severity} appearance="outline">
            {severity}
          </Badge>
        ))}
      </ShowcaseSection>

      <ShowcaseSection title={p("sizesWide.title")} delay={0.1}>
        {SIZES.map((size) => (
          <Badge key={size} size={size}>
            {size}
          </Badge>
        ))}
      </ShowcaseSection>

      <ShowcaseSection title={p("variants.title")} delay={0.15}>
        <ShowcaseRow label={p("variants.wideDefault")}>
          {SIZES.map((size) => (
            <Badge key={size} variant="wide" size={size}>
              {size}
            </Badge>
          ))}
        </ShowcaseRow>
        <ShowcaseRow label={p("variants.circleDot")}>
          {SIZES.map((size) => (
            <Badge key={size} variant="circle" size={size} severity="primary" />
          ))}
        </ShowcaseRow>
        <ShowcaseRow label={p("variants.square")}>
          <Badge variant="square">{p("variants.square")}</Badge>
          <Badge variant="square" severity="success" appearance="outline">
            {p("variants.outline")}
          </Badge>
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection title={p("modifiers.title")} delay={0.2} layout="stack">
        <ShowcaseRow label={p("modifiers.withShadow")}>
          {SEVERITIES.map((severity) => (
            <Badge key={severity} severity={severity} withShadow>
              {severity}
            </Badge>
          ))}
        </ShowcaseRow>
        <ShowcaseRow label={p("modifiers.withRing")}>
          {SEVERITIES.map((severity) => (
            <Badge key={severity} severity={severity} withRing>
              {severity}
            </Badge>
          ))}
        </ShowcaseRow>
        <ShowcaseRow label={p("modifiers.highlight")}>
          <Badge highlight severity="primary">
            {p("modifiers.highlighted")}
          </Badge>
          <Badge highlight severity="danger" appearance="outline">
            {p("modifiers.outlineHighlight")}
          </Badge>
        </ShowcaseRow>
        <ShowcaseRow label={p("modifiers.disabled")}>
          {SEVERITIES.map((severity) => (
            <Badge key={severity} severity={severity} disabled>
              {severity}
            </Badge>
          ))}
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection title={p("combinations.title")} delay={0.25}>
        <Badge severity="success" size="lg" appearance="outline" withRing>
          {p("combinations.largeOutline")}
        </Badge>
        <Badge severity="warning" size="sm" variant="square" withShadow>
          {p("combinations.smallSquare")}
        </Badge>
        <Badge severity="danger" size="2xl" highlight>
          {p("combinations.highlight2xl")}
        </Badge>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
