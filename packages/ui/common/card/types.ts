import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import type {
  cardDescriptionVariants,
  cardMediaVariants,
  cardSectionVariants,
  cardTitleVariants,
  cardVariants,
} from "@/components/common/card/variants";

export type CardSize = NonNullable<VariantProps<typeof cardVariants>["size"]>;
export type CardSeverity = NonNullable<
  VariantProps<typeof cardVariants>["severity"]
>;
export type CardAppearance = NonNullable<
  VariantProps<typeof cardVariants>["appearance"]
>;
export type CardRounded = NonNullable<
  VariantProps<typeof cardVariants>["rounded"]
>;
export type CardShadow = NonNullable<
  VariantProps<typeof cardVariants>["shadow"]
>;
export type CardOrientation = NonNullable<
  VariantProps<typeof cardVariants>["orientation"]
>;
export type CardMediaAspect = NonNullable<
  VariantProps<typeof cardMediaVariants>["aspect"]
>;
export type CardMediaFit = NonNullable<
  VariantProps<typeof cardMediaVariants>["fit"]
>;
export type CardMediaPosition = NonNullable<
  VariantProps<typeof cardMediaVariants>["position"]
>;


/** @deprecated Use `appearance` instead */
export type CardLegacyVariant = "default" | "outline" | "ghost";

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
  VariantProps<typeof cardVariants> & {
    children?: ReactNode;
    /** @deprecated Use `appearance` instead */
    variant?: CardLegacyVariant;
    divided?: boolean;
    interactive?: boolean;
    selected?: boolean;
    onClick?: HTMLAttributes<HTMLDivElement>["onClick"];
  };

export type CardSectionProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardSectionVariants>;

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof cardTitleVariants>;

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof cardDescriptionVariants>;

export type CardBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  severity?: CardSeverity;
};

export type CardMediaProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> &
  VariantProps<typeof cardMediaVariants> & {
    src: string;
    alt: string;
  };

export type CardActionsProps = HTMLAttributes<HTMLDivElement>;
