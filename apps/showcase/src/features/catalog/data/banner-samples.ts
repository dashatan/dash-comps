export const showcaseBannerImages = {
  workspace: "/banners/workspace.jpg",
  business: "/banners/business.jpg",
  analytics: "/banners/analytics.jpg",
  team: "/banners/team.jpg",
} as const;

export const showcaseBannerSizes = ["sm", "md", "lg", "xl", "hero"] as const;

export const showcaseBannerSeverities = [
  "default",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
] as const;

export const showcaseBannerAppearances = ["soft", "outline", "solid"] as const;

export const showcaseBannerLayouts = ["start", "center", "row"] as const;

export const showcaseBannerImageModes = ["decor", "cover", "contain"] as const;

export const showcaseBannerImageAligns = ["start", "end"] as const;

export const showcaseBannerImageBlends = [
  "none",
  "multiply",
  "overlay",
] as const;

export const showcaseBannerImageOpacities = [
  "subtle",
  "default",
  "strong",
] as const;
