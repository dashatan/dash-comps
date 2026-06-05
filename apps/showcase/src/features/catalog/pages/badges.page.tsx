import type { ReactNode } from "react";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
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
  return (
    <CatalogPageShell slug="badges">
      {/* 1. Severities — filled (default) */}
      <ShowcaseSection title="Severities (filled)">
        {SEVERITIES.map((severity) => (
          <Badge key={severity} severity={severity}>
            {severity}
          </Badge>
        ))}
      </ShowcaseSection>

      {/* 2. Outline — all severities */}
      <ShowcaseSection title="Severities (outline)" delay={0.05}>
        {SEVERITIES.map((severity) => (
          <Badge key={severity} severity={severity} appearance="outline">
            {severity}
          </Badge>
        ))}
      </ShowcaseSection>

      {/* 3. Sizes — wide variant (default) */}
      <ShowcaseSection title="Sizes (wide)" delay={0.1}>
        {SIZES.map((size) => (
          <Badge key={size} size={size}>
            {size}
          </Badge>
        ))}
      </ShowcaseSection>

      {/* 4. Variants */}
      <ShowcaseSection title="Variants" delay={0.15}>
        <ShowcaseRow label="Wide (default)">
          {SIZES.map((size) => (
            <Badge key={size} variant="wide" size={size}>
              {size}
            </Badge>
          ))}
        </ShowcaseRow>
        <ShowcaseRow label="Circle (dot indicators)">
          {SIZES.map((size) => (
            <Badge key={size} variant="circle" size={size} severity="primary" />
          ))}
        </ShowcaseRow>
        <ShowcaseRow label="Square">
          <Badge variant="square">Square</Badge>
          <Badge variant="square" severity="success" appearance="outline">
            Outline
          </Badge>
        </ShowcaseRow>
      </ShowcaseSection>

      {/* 5. Interactive / decorative modifiers */}
      <ShowcaseSection title="Modifiers" delay={0.2} layout="stack">
        <ShowcaseRow label="With shadow">
          {SEVERITIES.map((severity) => (
            <Badge key={severity} severity={severity} withShadow>
              {severity}
            </Badge>
          ))}
        </ShowcaseRow>
        <ShowcaseRow label="With ring (hover to see)">
          {SEVERITIES.map((severity) => (
            <Badge key={severity} severity={severity} withRing>
              {severity}
            </Badge>
          ))}
        </ShowcaseRow>
        <ShowcaseRow label="Highlight">
          <Badge highlight severity="primary">
            Highlighted
          </Badge>
          <Badge highlight severity="danger" appearance="outline">
            Outline + highlight
          </Badge>
        </ShowcaseRow>
        <ShowcaseRow label="Disabled">
          {SEVERITIES.map((severity) => (
            <Badge key={severity} severity={severity} disabled>
              {severity}
            </Badge>
          ))}
        </ShowcaseRow>
      </ShowcaseSection>

      {/* 6. Combined examples */}
      <ShowcaseSection title="Combinations" delay={0.25}>
        <Badge severity="success" size="lg" appearance="outline" withRing>
          Large outline
        </Badge>
        <Badge severity="warning" size="sm" variant="square" withShadow>
          Small square
        </Badge>
        <Badge severity="danger" size="2xl" highlight>
          2XL highlight
        </Badge>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
