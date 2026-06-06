export {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselCounter,
  CarouselIndicator,
  CarouselIndicators,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselProgress,
  CarouselRoot,
  carouselVariants,
  default,
} from "@/components/common/carousel/carousel";

export type { CarouselComponent } from "@/components/common/carousel/carousel";

export {
  carouselControlVariants,
  carouselControlsGroupVariants,
  carouselFractionVariants,
  carouselIndicatorVariants,
  carouselIndicatorsVariants,
  carouselItemVariants,
  carouselProgressVariants,
  carouselTrackVariants,
  carouselViewportVariants,
} from "@/components/common/carousel/variants";

export type {
  CarouselApi,
  CarouselContentProps,
  CarouselControlSize,
  CarouselControlVariant,
  CarouselControlsPosition,
  CarouselCounterProps,
  CarouselGap,
  CarouselIndicatorPosition,
  CarouselIndicatorProps,
  CarouselIndicatorVariant,
  CarouselIndicatorsProps,
  CarouselItemProps,
  CarouselNextProps,
  CarouselOrientation,
  CarouselPreviousProps,
  CarouselProgressProps,
  CarouselRootProps,
  CarouselRounded,
  CarouselSize,
  CarouselTransition,
} from "@/components/common/carousel/types";

export { CarouselProvider, useCarouselContext } from "@/components/common/carousel/context";
export { useCarousel } from "@/components/common/carousel/use-carousel";
export {
  clampCarouselIndex,
  normalizeSlidesPerView,
  normalizeSlidesToScroll,
  resolveMaxIndex,
  resolveSlideWidth,
  resolveTrackOffset,
} from "@/components/common/carousel/utils";
