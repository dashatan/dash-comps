import type { ReactNode } from "react";
import IndicatorShape from "@/components/common/shapes/indicator";
import Square from "@/components/common/shapes/square";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

const SQUARE_STATUSES = ["ok", "warning", "danger", "none"] as const;
const SQUARE_SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

const INDICATOR_COLORS = [
  { key: "default", className: "bg-background" },
  { key: "success", className: "bg-success" },
  { key: "warning", className: "bg-warning" },
  { key: "error", className: "bg-error" },
  { key: "primary", className: "bg-primary" },
  { key: "secondary", className: "bg-secondary" },
  { key: "info", className: "bg-info" },
  { key: "muted", className: "bg-muted-foreground" },
] as const;

const INDICATOR_SIZES = [
  { key: "xs", className: "size-1.5" },
  { key: "sm", className: "size-2" },
  { key: "md", className: "size-3" },
  { key: "lg", className: "size-4" },
  { key: "xl", className: "size-5" },
] as const;

const INDICATOR_RADIUS = [
  { key: "none", className: "rounded-none" },
  { key: "sm", className: "rounded-sm" },
  { key: "md", className: "rounded-md" },
  { key: "full", className: "rounded-full" },
] as const;

function ShowcaseRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function LabeledShape({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {children}
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  );
}

export function ShapesPage() {
  const p = useShowcasePage("shapes");

  return (
    <CatalogPageShell slug="shapes">
      <ShowcaseSection
        title={p("indicator.default.title")}
        description={p("indicator.default.description")}
      >
        <LabeledShape label={p("indicator.colors.default")}>
          <IndicatorShape />
        </LabeledShape>
      </ShowcaseSection>

      <ShowcaseSection title={p("indicator.colors.title")} delay={0.05}>
        {INDICATOR_COLORS.map(({ key, className }) => (
          <LabeledShape key={key} label={p(`indicator.colors.${key}`)}>
            <IndicatorShape className={className} />
          </LabeledShape>
        ))}
      </ShowcaseSection>

      <ShowcaseSection title={p("indicator.sizes.title")} delay={0.1} layout="stack">
        <ShowcaseRow label={p("indicator.sizes.title")}>
          {INDICATOR_SIZES.map(({ key, className }) => (
            <LabeledShape key={key} label={p(`indicator.sizes.${key}`)}>
              <IndicatorShape className={`bg-primary ${className}`} />
            </LabeledShape>
          ))}
        </ShowcaseRow>
        <ShowcaseRow label={p("indicator.radius.title")}>
          {INDICATOR_RADIUS.map(({ key, className }) => (
            <LabeledShape key={key} label={p(`indicator.radius.${key}`)}>
              <IndicatorShape className={`bg-primary size-4 ${className}`} />
            </LabeledShape>
          ))}
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection title={p("square.statuses.title")} delay={0.15}>
        {SQUARE_STATUSES.map((status) => (
          <LabeledShape key={status} label={p(`square.statuses.${status}`)}>
            <Square status={status} />
          </LabeledShape>
        ))}
      </ShowcaseSection>

      <ShowcaseSection title={p("square.sizes.title")} delay={0.2}>
        {SQUARE_SIZES.map((size) => (
          <LabeledShape key={size} label={size}>
            <Square size={size} />
          </LabeledShape>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("square.hover.title")}
        description={p("square.hover.description")}
        delay={0.25}
      >
        {SQUARE_SIZES.map((size) => (
          <Square key={size} size={size} status="ok" />
        ))}
      </ShowcaseSection>

      <ShowcaseSection title={p("square.customization.title")} delay={0.3} layout="stack">
        <ShowcaseRow label={p("square.customization.colors")}>
          <Square className="bg-secondary" />
          <Square className="bg-info" />
          <Square className="bg-muted-foreground" />
        </ShowcaseRow>
        <ShowcaseRow label={p("square.customization.radius")}>
          <Square className="rounded-none" size="lg" />
          <Square className="rounded-sm" size="lg" />
          <Square className="rounded-lg" size="lg" />
          <Square className="rounded-full" size="lg" />
        </ShowcaseRow>
        <ShowcaseRow label={p("square.customization.ring")}>
          <Square className="ring-primary ring-2 ring-offset-2" size="lg" />
          <Square
            className="ring-warning ring-2 ring-offset-2"
            size="lg"
            status="warning"
          />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection title={p("square.combinations.title")} delay={0.35}>
        <Square status="warning" size="2xl" />
        <Square status="danger" size="lg" />
        <Square status="none" size="sm" />
        <Square status="ok" size="xs" className="ring-primary ring-2 ring-offset-1" />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
