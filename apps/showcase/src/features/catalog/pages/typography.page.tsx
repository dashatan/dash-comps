import type { ReactNode } from "react";
import { H1, H2, H3, H4, P } from "@/components/common/typography";
import Marquee from "@/components/common/typography/marquee";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

const HEADING_LEVELS = [
  { key: "h1", Component: H1 },
  { key: "h2", Component: H2 },
  { key: "h3", Component: H3 },
  { key: "h4", Component: H4 },
] as const;

const PARAGRAPH_TONES = [
  { key: "default", className: undefined },
  { key: "muted", className: "text-muted-foreground" },
  { key: "primary", className: "text-primary" },
  { key: "success", className: "text-success" },
  { key: "warning", className: "text-warning" },
  { key: "error", className: "text-error" },
  { key: "info", className: "text-info" },
  { key: "mono", className: "font-mono" },
] as const;

function ShowcaseRow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function StyleTag({ children }: { children: string }) {
  return (
    <span className="text-muted-foreground font-mono text-xs">{children}</span>
  );
}

export function TypographyPage() {
  const p = useShowcasePage("typography");

  return (
    <CatalogPageShell slug="typography">
      <ShowcaseSection
        title={p("headings.title")}
        description={p("headings.description")}
        layout="stack"
      >
        {HEADING_LEVELS.map(({ key, Component }) => (
          <ShowcaseRow
            key={key}
            label={p(`headings.styles.${key}`)}
            className="gap-1"
          >
            <Component>{p(`headings.${key}`)}</Component>
          </ShowcaseRow>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("hierarchy.title")}
        description={p("hierarchy.description")}
        layout="stack"
        contentClassName="items-start gap-4"
      >
        <H1>{p("headings.h1")}</H1>
        <H2>{p("hierarchy.subtitle")}</H2>
        <H3>{p("headings.h3")}</H3>
        <H4>{p("headings.h4")}</H4>
        <P>{p("hierarchy.body")}</P>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("paragraph.title")}
        description={p("paragraph.description")}
        layout="stack"
        contentClassName="items-start"
      >
        <P>{p("paragraph.body")}</P>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("paragraphTones.title")}
        description={p("paragraphTones.description")}
        layout="stack"
        contentClassName="items-start gap-4"
      >
        {PARAGRAPH_TONES.map(({ key, className }) => (
          <ShowcaseRow key={key} label={p(`paragraphTones.tones.${key}`)}>
            <P className={className}>{p("paragraphTones.sample")}</P>
          </ShowcaseRow>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("headingOverrides.title")}
        description={p("headingOverrides.description")}
        layout="stack"
        contentClassName="items-start gap-4"
      >
        <ShowcaseRow label="text-primary">
          <H2 className="text-primary">{p("headingOverrides.primaryH2")}</H2>
        </ShowcaseRow>
        <ShowcaseRow label="truncate">
          <H4 className="w-64 truncate">{p("headingOverrides.truncatedH4")}</H4>
        </ShowcaseRow>
        <ShowcaseRow label="uppercase tracking-wide">
          <H3 className="text-muted-foreground text-sm tracking-wide uppercase">
            {p("headingOverrides.uppercaseH3")}
          </H3>
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("htmlAttributes.title")}
        description={p("htmlAttributes.description")}
        layout="stack"
        contentClassName="items-start"
      >
        <H2 id="typography-demo-heading" aria-label={p("htmlAttributes.ariaLabel")}>
          {p("headings.h2")}
        </H2>
        <StyleTag>id=&quot;typography-demo-heading&quot; · aria-label</StyleTag>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("marquee.title")}
        description={p("marquee.description")}
        layout="stack"
      >
        <ShowcaseRow label={p("marquee.rows.static")}>
          <Marquee className="border-border w-48 rounded border px-3 text-sm font-semibold">
            {p("marquee.short")}
          </Marquee>
        </ShowcaseRow>
        <ShowcaseRow label={p("marquee.rows.scrolling")}>
          <Marquee className="border-border w-48 rounded border px-3 text-sm font-semibold">
            {p("marquee.long")}
          </Marquee>
        </ShowcaseRow>
        <ShowcaseRow label={p("marquee.rows.styled")}>
          <Marquee className="border-border text-foreground flex min-h-10 w-48 items-center justify-center overflow-hidden rounded border text-center text-sm font-semibold">
            {p("marquee.styled")}
          </Marquee>
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("inContext.title")}
        description={p("inContext.description")}
        layout="stack"
        contentClassName="items-stretch gap-5"
      >
        <div className="flex w-full min-w-0 flex-col gap-2">
          <H2>{p("inContext.panelTitle")}</H2>
          <H4 className="text-muted-foreground">{p("inContext.panelSubtitle")}</H4>
          <P>{p("inContext.panelBody")}</P>
        </div>
        <div className="border-border flex w-full min-w-0 items-center justify-between gap-4 border-t pt-4">
          <P className="font-semibold">{p("inContext.rowLabel")}</P>
          <Marquee className="border-border text-foreground flex min-h-10 w-48 shrink-0 items-center justify-center overflow-hidden rounded border text-center text-sm font-semibold">
            {p("inContext.rowValue")}
          </Marquee>
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
