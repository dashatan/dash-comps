import { showcaseCarouselImages } from "@/features/catalog/data/carousel-samples";

const gridBase = "/grid";

/** Dashboard widget imagery — reuses banner/carousel assets where they fit. */
export const showcaseGridImages = {
  /** Chart / analytics widgets (laptop dashboard, graphs). */
  chart: `${gridBase}/widget-analytics.jpg`,
  /** Traffic, funnel, and wide analytics panels. */
  analytics: "/banners/analytics.jpg",
  /** Campaign, sprint board, and goal-tracking widgets. */
  campaign: `${gridBase}/widget-campaign.jpg`,
  /** Team / active-users context. */
  team: `${gridBase}/widget-team-kpi.jpg`,
  /** Storefront and retail summary widgets. */
  storefront: `${gridBase}/widget-storefront.jpg`,
  /** Sessions-by-region and funnel overview widgets. */
  traffic: `${gridBase}/widget-traffic.jpg`,
  /** KPI strip thumbnails keyed by metric. */
  kpi: {
    revenue: showcaseCarouselImages.hero.retail,
    orders: showcaseCarouselImages.hero.food,
    users: `${gridBase}/widget-team-kpi.jpg`,
    conversion: `${gridBase}/widget-analytics.jpg`,
  },
  /** Product spotlight widgets. */
  product: showcaseCarouselImages.product,
  /** Activity-feed avatars (order events, reviews). */
  avatar: {
    ali: "/avatars/ali.jpg",
    mina: "/avatars/mina.jpg",
    reza: "/avatars/reza.jpg",
    sara: "/avatars/sara.jpg",
  },
  /** Promo / release banners inside widgets. */
  banner: showcaseCarouselImages.banner,
} as const;

export type ShowcaseGridProductKey = keyof typeof showcaseGridImages.product;

export type ShowcaseGridAvatarKey = keyof typeof showcaseGridImages.avatar;
