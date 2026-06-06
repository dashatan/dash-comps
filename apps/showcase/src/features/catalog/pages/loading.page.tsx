import { useState, type ReactNode } from "react";
import { Button } from "@/components/common/buttons";
import Loading, {
  LOADING_BACKDROPS,
  LOADING_SEVERITIES,
  LOADING_SIZES,
  LOADING_VARIANTS,
  type LoadingBackdrop,
  type LoadingSeverity,
  type LoadingSize,
  type LoadingVariant,
} from "@/components/common/loading";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

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
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function VariantTile({
  label,
  variant,
}: {
  label: string;
  variant: LoadingVariant;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3 rounded-xl border border-border bg-muted/20 px-6 py-8">
      <Loading variant={variant} size="lg" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

function OverlayFrame({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <ShowcaseRow label={label} className={className}>
      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-border bg-muted/20">
        <div className="absolute inset-0 p-4">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-muted-foreground mt-2 text-sm">{hint}</p>
        </div>
        {children}
      </div>
    </ShowcaseRow>
  );
}

export function LoadingPage() {
  const p = useShowcasePage("loading");
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);

  return (
    <CatalogPageShell slug="loading">
      <ShowcaseSection
        title={p("variants.title")}
        description={p("variants.description")}
        layout="stack"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LOADING_VARIANTS.map((variant) => (
            <VariantTile
              key={variant}
              variant={variant}
              label={p(`variants.items.${variant}`)}
            />
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sizes.title")}
        description={p("sizes.description")}
        layout="stack"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LOADING_SIZES.map((size) => (
            <ShowcaseRow
              key={size}
              label={p(`sizes.items.${size satisfies LoadingSize}`)}
              className="items-center rounded-xl border border-border bg-muted/20 px-4 py-6"
            >
              <Loading variant="spinner" size={size} />
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("severities.title")}
        description={p("severities.description")}
        layout="stack"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LOADING_SEVERITIES.map((severity) => (
            <ShowcaseRow
              key={severity}
              label={p(`severities.items.${severity satisfies LoadingSeverity}`)}
              className="items-center rounded-xl border border-border bg-muted/20 px-4 py-6"
            >
              <Loading
                variant="ring"
                severity={severity}
                size="lg"
              />
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("labels.title")}
        description={p("labels.description")}
        layout="stack"
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <ShowcaseRow label={p("labels.rows.default")}>
            <Loading variant="dots" label={p("labels.samples.default")} />
          </ShowcaseRow>
          <ShowcaseRow label={p("labels.rows.success")}>
            <Loading
              variant="pulse"
              severity="success"
              label={p("labels.samples.success")}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("labels.rows.warning")}>
            <Loading
              variant="bars"
              severity="warning"
              label={p("labels.samples.warning")}
            />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("inline.title")}
        description={p("inline.description")}
      >
        <Loading variant="orbit" size="lg" />
        <Loading variant="ripple" size="lg" severity="info" />
        <Loading variant="line" size="lg" />
        <Loading variant="dots" size="md" severity="muted" />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("overlay.title")}
        description={p("overlay.description")}
        layout="stack"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outlined"
            severity="input"
            onClick={() => setOverlayVisible((visible) => !visible)}
          >
            {overlayVisible ? p("overlay.hide") : p("overlay.show")}
          </Button>
        </div>
        <OverlayFrame
          label={p("overlay.sampleTitle")}
          hint={p("overlay.hint")}
        >
          {overlayVisible ? (
            <Loading
              mode="overlay"
              variant="spinner"
              size="lg"
              label={p("overlay.sampleLabel")}
            />
          ) : null}
        </OverlayFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("backdrops.title")}
        description={p("backdrops.description")}
        layout="stack"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {LOADING_BACKDROPS.filter((backdrop) => backdrop !== "none").map(
            (backdrop) => (
              <OverlayFrame
                key={backdrop}
                label={p(`backdrops.items.${backdrop satisfies LoadingBackdrop}`)}
                hint={p("overlay.hint")}
              >
                <Loading
                  mode="overlay"
                  backdrop={backdrop}
                  variant="ring"
                  size="lg"
                />
              </OverlayFrame>
            ),
          )}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("inContext.title")}
        description={p("inContext.description")}
        layout="stack"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="relative min-h-52 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-base font-semibold">{p("inContext.cardTitle")}</p>
              <p className="text-muted-foreground text-sm">
                {p("inContext.cardDescription")}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="h-10 rounded-lg bg-muted/60" />
                <div className="h-10 rounded-lg bg-muted/60" />
                <div className="h-10 rounded-lg bg-muted/60" />
              </div>
            </div>
            <Loading
              mode="overlay"
              backdrop="blur"
              variant="dots"
              label={p("inContext.cardLoading")}
            />
          </div>

          <div className="relative min-h-52 rounded-2xl border border-dashed border-border bg-muted/15 p-6">
            <p className="text-sm font-medium">{p("inContext.panelTitle")}</p>
            <p className="text-muted-foreground mt-2 text-sm">
              {p("inContext.panelDescription")}
            </p>
            <Loading
              mode="overlay"
              backdrop="solid"
              variant="bars"
              severity="primary"
              size="md"
            />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("fullscreen.title")}
        description={p("fullscreen.description")}
        layout="stack"
      >
        <Button
          severity="primary"
          onClick={() => setFullscreenVisible(true)}
        >
          {p("fullscreen.trigger")}
        </Button>
        {fullscreenVisible ? (
          <Loading
            mode="fullscreen"
            backdrop="blur"
            variant="orbit"
            size="xl"
            label={p("fullscreen.label")}
          />
        ) : null}
        {fullscreenVisible ? (
          <div className="fixed inset-x-0 bottom-6 z-10 flex justify-center">
            <Button
              variant="outlined"
              severity="input"
              onClick={() => setFullscreenVisible(false)}
            >
              {p("fullscreen.dismiss")}
            </Button>
          </div>
        ) : null}
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
