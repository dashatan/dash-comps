import type { CSSProperties } from "react";
import type {
  BannerAppearance,
  BannerImage,
  BannerImageAlign,
  BannerImageBlend,
  BannerImageMode,
  BannerImageOpacity,
  BannerSeverity,
} from "@/components/common/banner/types";

export function resolveBannerImageSrc(
  src?: string | null,
  image?: BannerImage,
): string | undefined {
  if (src) return src;
  if (!image) return undefined;
  return typeof image === "string" ? image : image.src;
}

export function resolveBannerImageOpacity(
  imageOpacity: BannerImageOpacity = "default",
): string | number {
  if (typeof imageOpacity === "number") return imageOpacity;

  switch (imageOpacity) {
    case "subtle":
      return 0.15;
    case "strong":
      return 0.55;
    default:
      return "var(--banner-bg-opacity, 0.3)";
  }
}

export function resolveBannerBackgroundPosition(
  imageAlign: BannerImageAlign,
  imagePositionX?: CSSProperties["backgroundPositionX"],
  imagePositionY: CSSProperties["backgroundPositionY"] = "50%",
): string {
  if (imagePositionX) {
    return `${imagePositionX} ${imagePositionY}`;
  }

  switch (imageAlign) {
    case "start":
      return `left ${imagePositionY}`;
    case "center":
      return `center ${imagePositionY}`;
    case "end":
    default:
      return `right ${imagePositionY}`;
  }
}

export function resolveBannerBackgroundSize(
  imageMode: BannerImageMode,
  imageSize: CSSProperties["backgroundSize"] = "40%",
): CSSProperties["backgroundSize"] {
  switch (imageMode) {
    case "cover":
      return "cover";
    case "contain":
      return "contain";
    case "decor":
    default:
      return imageSize;
  }
}

export function resolveBannerBlendMode(
  imageBlend: BannerImageBlend,
): CSSProperties["backgroundBlendMode"] | undefined {
  if (imageBlend === "none") return undefined;
  return imageBlend;
}
