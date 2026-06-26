import { type ReactNode } from "react";
import Skeleton from "@/components/common/skeleton";
import SkeletonField from "@/components/compound/table/components/body/skeleton";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

const HEIGHTS = ["h-3", "h-4", "h-6", "h-8", "h-10", "h-12", "h-16"] as const;
const WIDTHS = ["w-24", "w-48", "w-72", "w-1/2", "w-3/4", "w-full"] as const;
const RADII = [
  "rounded-none",
  "rounded-sm",
  "rounded-md",
  "rounded-lg",
  "rounded-xl",
  "rounded-2xl",
  "rounded-full",
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
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

export function SkeletonPage() {
  const p = useShowcasePage("skeleton");

  return (
    <CatalogPageShell slug="skeleton">
      <ShowcaseSection
        title={p("default.title")}
        description={p("default.description")}
        layout="stack"
      >
        <Skeleton />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("textPlaceholders.title")}
        description={p("textPlaceholders.description")}
        layout="stack"
      >
        <ShowcaseRow label={p("rows.short")}>
          <Skeleton className="h-4 w-24" />
        </ShowcaseRow>
        <ShowcaseRow label={p("rows.medium")}>
          <Skeleton className="h-4 w-48" />
        </ShowcaseRow>
        <ShowcaseRow label={p("rows.long")}>
          <Skeleton className="h-4 w-72" />
        </ShowcaseRow>
        <ShowcaseRow label={p("rows.full")}>
          <Skeleton className="h-4 w-full" />
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("heights.title")}
        description={p("heights.description")}
        layout="stack"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HEIGHTS.map((height) => (
            <ShowcaseRow
              key={height}
              label={height}
              className="rounded-xl border border-border bg-muted/20 px-4 py-4"
            >
              <Skeleton className={cn(height, "w-full")} />
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("widths.title")}
        description={p("widths.description")}
        layout="stack"
      >
        {WIDTHS.map((width) => (
          <ShowcaseRow key={width} label={width}>
            <Skeleton className={cn("h-10", width)} />
          </ShowcaseRow>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("borderRadius.title")}
        description={p("borderRadius.description")}
        layout="stack"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RADII.map((radius) => (
            <ShowcaseRow
              key={radius}
              label={radius}
              className="items-center rounded-xl border border-border bg-muted/20 px-4 py-4"
            >
              <Skeleton className={cn("h-12 w-full", radius)} />
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("shapes.title")}
        description={p("shapes.description")}
      >
        <Skeleton className="size-12 shrink-0 rounded-full" />
        <Skeleton className="size-12 shrink-0 rounded-none" />
        <Skeleton className="h-10 w-32 shrink-0 rounded-full" />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("cardBlock.title")}
        description={p("cardBlock.description")}
        layout="stack"
        className="w-full"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex w-full flex-col gap-3">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("listRows.title")}
        description={p("listRows.description")}
        layout="stack"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("tableField.title")}
        description={p("tableField.description")}
        layout="stack"
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <SkeletonField key={index} />
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("buttonPlaceholder.title")}
        description={p("buttonPlaceholder.description")}
      >
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("profileRow.title")}
        description={p("profileRow.description")}
        layout="stack"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("articleLayout.title")}
        description={p("articleLayout.description")}
        layout="stack"
      >
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-3 w-40" />
        <div className="space-y-2 pt-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("gridList.title")}
        description={p("gridList.description")}
        layout="stack"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("fillContainer.title")}
        description={p("fillContainer.description")}
        layout="stack"
      >
        <div className="relative h-56 w-full overflow-hidden rounded-xl border border-border">
          <Skeleton className="size-full flex-1" />
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("inContext.title")}
        description={p("inContext.description")}
        layout="stack"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-24 w-full rounded-xl" />
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-muted/15 p-6">
            <div className="flex items-start gap-3">
              <Skeleton className="size-12 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
