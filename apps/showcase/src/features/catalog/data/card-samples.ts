export const showcaseCardImages = {
  workspace: "/banners/workspace.jpg",
  business: "/banners/business.jpg",
  analytics: "/banners/analytics.jpg",
  team: "/banners/team.jpg",
} as const;

export const showcaseCardSeverities = [
  "default",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "muted",
] as const;

export const showcaseCardAppearances = [
  "soft",
  "outline",
  "solid",
  "ghost",
] as const;

export const showcaseCardSizes = ["sm", "md", "lg"] as const;

export const showcaseCardRounded = ["none", "md", "xl", "2xl"] as const;

export const showcaseCardShadows = ["none", "sm", "md", "lg"] as const;

export const showcaseCardMediaAspects = ["square", "video", "wide"] as const;

export const showcaseCardOrientations = ["vertical", "horizontal"] as const;
