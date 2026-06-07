export {
  ALERT_ANIMATIONS,
  ALERT_APPEARANCES,
  ALERT_LAYOUTS,
  ALERT_SEVERITIES,
  ALERT_SIZES,
} from "@/components/common/alert";

export const showcaseAlertSeverities = [
  "default",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "muted",
] as const;

export const showcaseAlertAppearances = ["soft", "outline", "ghost"] as const;

export const showcaseAlertSizes = ["sm", "md", "lg", "xl"] as const;

export const showcaseAlertLayouts = ["center", "start", "row"] as const;

export const showcaseAlertAnimations = [
  "jumpIn",
  "shake",
  "bounceIn",
  "flipUp",
  "none",
] as const;
