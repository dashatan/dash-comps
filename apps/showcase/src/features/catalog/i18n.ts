import type { TranslationParams } from "@/lib/language/plural";
import { useShowcaseLocale } from "@/i18n/provider";
import type { ShowcaseTranslationKeys } from "@/i18n/locales/registry";
import type { CatalogSlug } from "@/features/catalog/registry";

type ShowcasePageKey<S extends CatalogSlug> = Extract<
  ShowcaseTranslationKeys,
  `pages.${S}.${string}`
>;

type ShowcasePageSuffix<S extends CatalogSlug> =
  ShowcasePageKey<S> extends `pages.${S}.${infer Rest}` ? Rest : never;

type ShowcaseCategoryKey<
  S extends CatalogSlug,
  Field extends "title" | "description",
> = Extract<ShowcaseTranslationKeys, `categories.${S}.${Field}`>;

export function useShowcasePage<S extends CatalogSlug>(slug: S) {
  const { t } = useShowcaseLocale();

  return (suffix: ShowcasePageSuffix<S>, params?: TranslationParams) =>
    t(`pages.${slug}.${suffix}` as ShowcasePageKey<S>, params);
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
    categoryTitle: <S extends CatalogSlug>(slug: S) =>
      t(`categories.${slug}.title` as ShowcaseCategoryKey<S, "title">),
    categoryDescription: <S extends CatalogSlug>(slug: S) =>
      t(
        `categories.${slug}.description` as ShowcaseCategoryKey<
          S,
          "description"
        >,
      ),
  };
}
