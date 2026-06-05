import type { ReactNode } from "react";
import { cn } from "@/lib";
import { useShowcaseShell } from "@/features/catalog/i18n";

const contentLayoutClasses = {
  /** Default: demos in a wrapping row (buttons, badges, …) */
  inline: "flex w-full min-w-0 flex-wrap items-center gap-3",
  /** Vertical demos: forms, full-width controls, code blocks */
  stack: "flex w-full min-w-0 flex-col items-stretch gap-3",
} as const;

export type ShowcaseSectionLayout = keyof typeof contentLayoutClasses;

type ShowcaseSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  layout?: ShowcaseSectionLayout;
  className?: string;
  contentClassName?: string;
  /** @deprecated No longer used (scroll perf). Kept for API compatibility. */
  delay?: number;
};

export function ShowcaseSection({
  title,
  description,
  children,
  layout = "inline",
  className,
  contentClassName,
}: ShowcaseSectionProps) {
  return (
    <section className={cn("mb-10 w-full min-w-0", className)}>
      <div className="mb-4 w-full min-w-0">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description ? (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        ) : null}
      </div>
      <div
        className={cn(
          "border-border bg-card w-full min-w-0 rounded-2xl border p-6",
          contentLayoutClasses[layout],
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

type ComponentPageHeaderProps = {
  title: string;
  description: string;
  label?: string;
};

export function ComponentPageHeader({ title, description, label }: ComponentPageHeaderProps) {
  const { catalog } = useShowcaseShell();
  const resolvedLabel = label ?? catalog.componentLabel;
  return (
    <header className="mb-8 w-full min-w-0">
      <p className="text-primary text-sm font-medium tracking-wide uppercase">{resolvedLabel}</p>
      <h2 className="mt-1 text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground mt-2 text-base">{description}</p>
    </header>
  );
}
