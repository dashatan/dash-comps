import { useShowcaseShell } from "@/features/catalog/i18n";
import type { CatalogSlug } from "@/features/catalog/registry";

export function useCategoryMeta(slug: CatalogSlug) {
  const { catalog, categoryTitle, categoryDescription } = useShowcaseShell();
  return {
    title: categoryTitle(slug),
    description: categoryDescription(slug),
    componentLabel: catalog.componentLabel,
  };
}
