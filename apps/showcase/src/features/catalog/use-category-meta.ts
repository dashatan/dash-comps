import { useShowcaseI18n } from "@/i18n";
import type { CatalogSlug } from "@/features/catalog/registry";

export function useCategoryMeta(slug: CatalogSlug) {
  const { t } = useShowcaseI18n();
  const category = t.categories[slug];
  return {
    title: category.title,
    description: category.description,
    componentLabel: t.catalog.componentLabel,
  };
}
