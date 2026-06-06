export const LOADING_VARIANTS = [
  "spinner",
  "dots",
  "pulse",
  "bars",
  "ring",
  "orbit",
  "ripple",
  "line",
] as const;

export const LOADING_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export const LOADING_SEVERITIES = [
  "primary",
  "muted",
  "success",
  "warning",
  "danger",
  "info",
] as const;

export const LOADING_MODES = ["inline", "overlay", "fullscreen"] as const;

export const LOADING_BACKDROPS = ["none", "subtle", "solid", "blur"] as const;

export type LoadingVariant = (typeof LOADING_VARIANTS)[number];
export type LoadingSize = (typeof LOADING_SIZES)[number];
export type LoadingSeverity = (typeof LOADING_SEVERITIES)[number];
export type LoadingMode = (typeof LOADING_MODES)[number];
export type LoadingBackdrop = (typeof LOADING_BACKDROPS)[number];

export type LoadingProps = {
  variant?: LoadingVariant;
  size?: LoadingSize;
  severity?: LoadingSeverity;
  mode?: LoadingMode;
  backdrop?: LoadingBackdrop;
  label?: string;
  className?: string;
  indicatorClassName?: string;
  labelClassName?: string;
  "aria-label"?: string;
};

export type LoadingIndicatorProps = {
  variant: LoadingVariant;
  size: LoadingSize;
  severity: LoadingSeverity;
  className?: string;
};
