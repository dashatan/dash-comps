import type { HTMLAttributes, ReactNode } from "react";
import type { CSSProperties } from "react";
import type { VariantProps } from "class-variance-authority";
import type {
  bannerDescriptionVariants,
  bannerTitleVariants,
  bannerVariants,
} from "@/components/common/banner/variants";

export type BannerImage = string | { src: string };

export type BannerSize = NonNullable<
  VariantProps<typeof bannerVariants>["size"]
>;
export type BannerSeverity = NonNullable<
  VariantProps<typeof bannerVariants>["severity"]
>;
export type BannerAppearance = NonNullable<
  VariantProps<typeof bannerVariants>["appearance"]
>;
export type BannerRounded = NonNullable<
  VariantProps<typeof bannerVariants>["rounded"]
>;
export type BannerShadow = NonNullable<
  VariantProps<typeof bannerVariants>["shadow"]
>;
export type BannerLayout = NonNullable<
  VariantProps<typeof bannerVariants>["layout"]
>;
export type BannerImageMode = NonNullable<
  VariantProps<typeof bannerVariants>["imageMode"]
>;
export type BannerImageAlign = "start" | "center" | "end";
export type BannerImageBlend = "none" | "multiply" | "overlay" | "soft-light";
export type BannerImageOpacity = "subtle" | "default" | "strong" | number;

export type BannerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
  VariantProps<typeof bannerVariants> & {
    children?: ReactNode;
    src?: string | null;
    /** @deprecated Use `src` instead */
    image?: BannerImage;
    imageSize?: CSSProperties["backgroundSize"];
    imagePositionX?: CSSProperties["backgroundPositionX"];
    imagePositionY?: CSSProperties["backgroundPositionY"];
    imageAlign?: BannerImageAlign;
    imageBlend?: BannerImageBlend;
    imageOpacity?: BannerImageOpacity;
    dismissible?: boolean;
    onDismiss?: () => void;
    interactive?: boolean;
    contentClassName?: string;
    contentAlign?: "start" | "center" | "end";
    mediaClassName?: string;
  };

export type BannerBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  severity?: BannerSeverity;
};

export type BannerTitleProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof bannerTitleVariants>;

export type BannerDescriptionProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof bannerDescriptionVariants>;
export type BannerActionsProps = HTMLAttributes<HTMLDivElement>;
