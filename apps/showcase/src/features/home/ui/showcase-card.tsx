import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { catalogLinkParams } from "@/shared/router/nav-link";
import type { CatalogCategory, CatalogSlug } from "@/features/catalog/registry";
import { cn } from "@/lib";

type ShowcaseCardProps = {
  category: CatalogCategory;
  title: string;
  description: string;
  exploreLabel: string;
  variantsLabel: string;
  preview: ReactNode;
  span?: "default" | "wide" | "tall";
};

const spanClass: Record<NonNullable<ShowcaseCardProps["span"]>, string> = {
  default: "",
  wide: "sm:col-span-2",
  tall: "sm:row-span-2",
};

export function ShowcaseCard({
  category,
  title,
  description,
  exploreLabel,
  variantsLabel,
  preview,
  span = "default",
}: ShowcaseCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/30 backdrop-blur-sm",
        "transition-colors duration-300 hover:border-primary/35",
        spanClass[span],
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_65%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <Link
        to="/components/$slug"
        params={catalogLinkParams(category.slug as CatalogSlug)}
        className="relative flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-40 flex-1 items-center justify-center overflow-hidden border-b border-border/50 p-4 md:p-5">
          {preview}
        </div>

        <div className="relative p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <category.icon className="size-4" />
            </div>
            <span className="text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase tabular-nums">
              {variantsLabel}
            </span>
          </div>

          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>

          <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {exploreLabel}
            <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
