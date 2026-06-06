import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import type {
  carouselControlVariants,
  carouselIndicatorVariants,
  carouselIndicatorsVariants,
  carouselItemVariants,
  carouselProgressVariants,
  carouselTrackVariants,
  carouselVariants,
} from "@/components/common/carousel/variants";

export type CarouselSize = NonNullable<
  VariantProps<typeof carouselVariants>["size"]
>;
export type CarouselRounded = NonNullable<
  VariantProps<typeof carouselVariants>["rounded"]
>;
export type CarouselOrientation = NonNullable<
  VariantProps<typeof carouselVariants>["orientation"]
>;
export type CarouselTransition = NonNullable<
  VariantProps<typeof carouselItemVariants>["transition"]
>;
export type CarouselGap = NonNullable<
  VariantProps<typeof carouselTrackVariants>["gap"]
>;
export type CarouselControlVariant = NonNullable<
  VariantProps<typeof carouselControlVariants>["variant"]
>;
export type CarouselControlSize = NonNullable<
  VariantProps<typeof carouselControlVariants>["size"]
>;
export type CarouselControlsPosition = "inside" | "outside" | "bottom";
export type CarouselIndicatorVariant = NonNullable<
  VariantProps<typeof carouselIndicatorsVariants>["variant"]
>;
export type CarouselIndicatorPosition = NonNullable<
  VariantProps<typeof carouselIndicatorsVariants>["position"]
>;

export type CarouselApi = {
  index: number;
  count: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  isPlaying: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  play: () => void;
  pause: () => void;
};

export type CarouselRootProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> &
  VariantProps<typeof carouselVariants> & {
    children?: ReactNode;
    /** @deprecated Prefer compound `Carousel.Item` children */
    slides?: React.ReactNode[];
    /** @deprecated Use `indicatorClassName` on `Carousel.Indicators` */
    classNameFunction?: (isActive: boolean) => string;
    value?: number;
    defaultValue?: number;
    onValueChange?: (index: number) => void;
    autoPlay?: boolean;
    duration?: number;
    pauseOnHover?: boolean;
    pauseOnFocus?: boolean;
    loop?: boolean;
    transition?: CarouselTransition;
    gap?: "none" | "sm" | "md" | "lg";
    slidesPerView?: number;
    slidesToScroll?: number;
    peek?: boolean;
    showControls?: boolean;
    showIndicators?: boolean;
    controlsVariant?: CarouselControlVariant;
    controlsSize?: CarouselControlSize;
    controlsPosition?: CarouselControlsPosition;
    indicatorVariant?: CarouselIndicatorVariant;
    indicatorPosition?: CarouselIndicatorPosition;
    rtl?: boolean;
    onSlideChange?: (index: number) => void;
    /** Root width — any valid CSS width (e.g. `"50%"`, `"20rem"`, `320`). */
    width?: CSSProperties["width"];
    /** Viewport height — any valid CSS height (e.g. `"400px"`, `"50vh"`, `320`). */
    height?: CSSProperties["height"];
  };

export type CarouselContentProps = HTMLAttributes<HTMLDivElement>;

export type CarouselItemProps = HTMLAttributes<HTMLDivElement>;

export type CarouselPreviousProps = Omit<
  HTMLAttributes<HTMLButtonElement>,
  "children"
> &
  VariantProps<typeof carouselControlVariants> & {
    label?: string;
  };

export type CarouselNextProps = Omit<
  HTMLAttributes<HTMLButtonElement>,
  "children"
> &
  VariantProps<typeof carouselControlVariants> & {
    label?: string;
  };

export type CarouselIndicatorsProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof carouselIndicatorsVariants> & {
    /** @deprecated Use variant styling via props */
    indicatorClassName?: (isActive: boolean) => string;
  };

export type CarouselIndicatorProps = HTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof carouselIndicatorVariants> & {
    index: number;
  };

export type CarouselProgressProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof carouselProgressVariants>;

export type CarouselCounterProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof carouselProgressVariants>;
