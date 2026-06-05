import type { TranslationParams } from "@/lib/language/plural";
import { useShowcaseLocale } from "@/i18n/provider";
import type { CatalogSlug } from "@/features/catalog/registry";

export function useShowcasePage(slug: CatalogSlug) {
  const { t } = useShowcaseLocale();
  return (suffix: string, params?: TranslationParams) =>
    t(`pages.${slug}.${suffix}`, params);
}

export function useShowcaseShell() {
  const { t } = useShowcaseLocale();
  return {
    t,
    appName: t("appName"),
    title: t("title"),
    nav: {
      home: t("nav.home"),
      allComponents: t("nav.allComponents"),
      categories: t("nav.categories"),
      common: t("nav.common"),
      compound: t("nav.compound"),
    },
    home: {
      badge: t("home.badge"),
      title: t("home.title"),
      titleHighlight: t("home.titleHighlight"),
      description: t("home.description"),
      browse: t("home.browse"),
      startButtons: t("home.startButtons"),
    },
    catalog: {
      indexTitle: t("catalog.indexTitle"),
      indexDescription: t("catalog.indexDescription"),
      componentLabel: t("catalog.componentLabel"),
      groupComponents: t("catalog.groupComponents"),
    },
    sidebar: {
      collapse: t("sidebar.collapse"),
      expand: t("sidebar.expand"),
    },
    categoryTitle: (slug: CatalogSlug) => t(`categories.${slug}.title`),
    categoryDescription: (slug: CatalogSlug) => t(`categories.${slug}.description`),
  };
}
