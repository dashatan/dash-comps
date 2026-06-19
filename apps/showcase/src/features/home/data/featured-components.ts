import type { CatalogSlug } from "@/features/catalog/registry";

export type FeaturedComponent = {
  slug: CatalogSlug;
  span?: "default" | "wide" | "tall";
};

export const featuredCompoundComponents = [
  { slug: "tracker", span: "wide" },
  { slug: "location-picker", span: "tall" },
  { slug: "table" },
  { slug: "dashboard" },
  { slug: "license-plate" },
  { slug: "form" },
] as const satisfies readonly FeaturedComponent[];

export const featuredCommonComponents = [
  { slug: "buttons" },
  { slug: "cards", span: "wide" },
  { slug: "carousel" },
  { slug: "inputs" },
  { slug: "badges" },
  { slug: "tabs", span: "wide" },
  { slug: "chips" },
  { slug: "alerts" },
] as const satisfies readonly FeaturedComponent[];
