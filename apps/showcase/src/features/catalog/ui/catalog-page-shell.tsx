import type { ReactNode } from "react";
import { PageTransition } from "@/shared/motion/primitives";
import { ComponentPageHeader } from "@/features/catalog/ui/showcase-section";
import { useCategoryMeta } from "@/features/catalog/use-category-meta";
import type { CatalogSlug } from "@/features/catalog/registry";

type CatalogPageShellProps = {
  slug: CatalogSlug;
  children: ReactNode;
  title?: string;
  description?: string;
};

export function CatalogPageShell({
  slug,
  children,
  title,
  description,
}: CatalogPageShellProps) {
  const meta = useCategoryMeta(slug);
  return (
    <PageTransition className="flex w-full min-w-0 flex-col">
      <ComponentPageHeader
        title={title ?? meta.title}
        description={description ?? meta.description}
        label={meta.componentLabel}
      />
      {children}
    </PageTransition>
  );
}
