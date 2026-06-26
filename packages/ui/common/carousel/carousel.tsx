"use client";

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactElement,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib";
import {
  CarouselProvider,
  useCarouselContext,
} from "@/components/common/carousel/context";
import type {
  CarouselContentProps,
  CarouselCounterProps,
  CarouselIndicatorProps,
  CarouselIndicatorsProps,
  CarouselItemProps,
  CarouselNextProps,
  CarouselPreviousProps,
  CarouselProgressProps,
  CarouselRootProps,
} from "@/components/common/carousel/types";
import { useCarousel } from "@/components/common/carousel/use-carousel";
import { normalizeSlidesPerView } from "@/components/common/carousel/utils";
import {
  resolveFallbackSlideWidthPercent,
  resolveFallbackTrackOffset,
  resolveSlideWidth,
  resolveTrackOffset,
} from "@/components/common/carousel/utils";
import {
  GAP_PX,
  carouselControlVariants,
  carouselControlsGroupVariants,
  carouselFractionVariants,
  carouselIndicatorVariants,
  carouselIndicatorsVariants,
  carouselItemVariants,
  carouselProgressVariants,
  carouselTrackVariants,
  carouselVariants,
  carouselViewportVariants,
} from "@/components/common/carousel/variants";

function useViewportWidth() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const measure = useCallback((node: HTMLDivElement | null) => {
    viewportRef.current = node;
    if (node) {
      setWidth(node.clientWidth);
    }
  }, []);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const update = () => setWidth(node.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { measureViewport: measure, viewportWidth: width };
}

const CarouselRoot = forwardRef<HTMLDivElement, CarouselRootProps>(
  (
    {
      className,
      children,
      slides,
      classNameFunction,
      value,
      defaultValue = 0,
      onValueChange,
      onSlideChange,
      autoPlay = false,
      duration = 5000,
      pauseOnHover = true,
      pauseOnFocus = true,
      loop = false,
      transition = "slide",
      gap = "none",
      slidesPerView = 1,
      slidesToScroll = 1,
      peek = false,
      showControls = true,
      showIndicators = true,
      controlsVariant = "outline",
      controlsSize,
      controlsPosition = "inside",
      indicatorVariant = "dots",
      indicatorPosition = "bottom",
      rtl,
      size = "md",
      rounded = "xl",
      orientation = "horizontal",
      width,
      height,
      style,
      ...props
    },
    ref,
  ) => {
    const legacyCount = slides?.length ?? 0;
    const resolvedControlsSize = controlsSize ?? size ?? "md";

    const {
      index,
      count,
      api,
      isPlaying,
      isDragging,
      dragOffset,
      progressKey,
      setCount,
      onDragStart,
      onDragMove,
      onDragEnd,
      registerProgressReset,
      handleMouseEnter,
      handleMouseLeave,
      handleFocus,
      handleBlur,
      handleKeyDown,
    } = useCarousel({
      count: legacyCount,
      value,
      defaultValue,
      onValueChange,
      onSlideChange,
      autoPlay,
      duration,
      pauseOnHover,
      pauseOnFocus,
      loop,
      rtl: rtl ?? false,
      slidesPerView,
      slidesToScroll,
    });

    const resolvedRtl = useMemo(() => {
      if (rtl !== undefined) return rtl;
      if (typeof document === "undefined") return false;
      return document.documentElement.dir === "rtl";
    }, [rtl]);

    const contextValue = useMemo(
      () => ({
        index,
        count,
        api,
        size: size ?? "md",
        rounded: rounded ?? "xl",
        orientation: orientation ?? "horizontal",
        transition: transition ?? "slide",
        gap: gap ?? "none",
        slidesPerView: slidesPerView ?? 1,
        slidesToScroll: slidesToScroll ?? 1,
        peek: peek ?? false,
        loop: loop ?? false,
        rtl: resolvedRtl,
        isDragging,
        dragOffset,
        autoPlay: autoPlay ?? false,
        duration: duration ?? 5000,
        isPlaying,
        showControls: showControls ?? true,
        showIndicators: showIndicators ?? true,
        controlsVariant: controlsVariant ?? "outline",
        controlsSize: resolvedControlsSize,
        controlsPosition: controlsPosition ?? "inside",
        indicatorVariant: indicatorVariant ?? "dots",
        indicatorPosition: indicatorPosition ?? "bottom",
        legacyIndicatorClassName: classNameFunction,
        width,
        height,
        setCount,
        onDragStart,
        onDragMove,
        onDragEnd,
        registerProgressReset,
        progressKey,
      }),
      [
        index,
        count,
        api,
        size,
        rounded,
        orientation,
        transition,
        gap,
        slidesPerView,
        slidesToScroll,
        peek,
        loop,
        resolvedRtl,
        isDragging,
        dragOffset,
        autoPlay,
        duration,
        isPlaying,
        showControls,
        showIndicators,
        controlsVariant,
        resolvedControlsSize,
        controlsPosition,
        indicatorVariant,
        indicatorPosition,
        classNameFunction,
        width,
        height,
        setCount,
        onDragStart,
        onDragMove,
        onDragEnd,
        registerProgressReset,
        progressKey,
      ],
    );

    const legacyContent =
      slides && slides.length > 0 ? (
        <>
          <CarouselContent>
            {slides.map((slide, slideIndex) => (
              <CarouselItem key={slideIndex}>{slide}</CarouselItem>
            ))}
          </CarouselContent>
          {showControls ? (
            <CarouselControls position={controlsPosition} />
          ) : null}
          {showIndicators ? (
            <CarouselIndicators
              variant={indicatorVariant}
              position={indicatorPosition}
              size={size}
            />
          ) : null}
        </>
      ) : null;

    return (
      <CarouselProvider value={contextValue}>
        <div
          ref={ref}
          data-slot="carousel"
          dir={resolvedRtl ? "rtl" : "ltr"}
          className={cn(
            carouselVariants({ size, rounded, orientation }),
            className,
          )}
          style={{ width, ...style }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocusCapture={handleFocus}
          onBlurCapture={handleBlur}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {legacyContent ?? children}
        </div>
      </CarouselProvider>
    );
  },
);

CarouselRoot.displayName = "Carousel";

const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, children, style, ...props }, ref) => {
    const {
      index,
      setCount,
      size,
      rounded,
      orientation,
      transition,
      gap,
      slidesPerView,
      peek,
      rtl,
      height: viewportHeight,
      isDragging,
      dragOffset,
      onDragStart,
      onDragMove,
      onDragEnd,
    } = useCarouselContext();

    const { measureViewport, viewportWidth } = useViewportWidth();
    const [slideHeights, setSlideHeights] = useState<Record<number, number>>(
      {},
    );

    const registerSlideHeight = useCallback(
      (slideIndex: number, height: number) => {
        setSlideHeights((prev) => {
          if (prev[slideIndex] === height) return prev;
          return { ...prev, [slideIndex]: height };
        });
      },
      [],
    );

    const gapPx = GAP_PX[gap ?? "none"];
    const effectiveSlidesPerView = transition === "fade" ? 1 : slidesPerView;
    const slideWidth = resolveSlideWidth(
      viewportWidth,
      effectiveSlidesPerView,
      gap ?? "none",
      peek,
    );

    const slideCount = useMemo(
      () => Children.toArray(children).filter(isValidElement).length,
      [children],
    );

    useEffect(() => {
      if (slideCount > 0) {
        setCount(slideCount);
      }
    }, [setCount, slideCount]);

    const trackTransform = useMemo(() => {
      if (transition !== "slide") return undefined;

      if (slideWidth > 0) {
        return resolveTrackOffset(
          index,
          slideWidth,
          gapPx,
          dragOffset,
          orientation,
          rtl,
        );
      }

      return resolveFallbackTrackOffset(
        index,
        effectiveSlidesPerView,
        dragOffset,
        rtl,
      );
    }, [
      transition,
      slideWidth,
      index,
      gapPx,
      dragOffset,
      orientation,
      rtl,
      effectiveSlidesPerView,
    ]);

    const dynamicHeight = useMemo(() => {
      if (viewportHeight !== undefined || transition === "fade")
        return undefined;

      const perView = normalizeSlidesPerView(effectiveSlidesPerView);
      const lastVisibleIndex =
        peek && perView <= 1 ? index + 1 : index + perView - 1;
      let max = 0;

      for (let i = index; i <= lastVisibleIndex; i += 1) {
        const measured = slideHeights[i];
        if (measured !== undefined) {
          max = Math.max(max, measured);
        }
      }

      return max > 0 ? max : undefined;
    }, [
      viewportHeight,
      transition,
      index,
      effectiveSlidesPerView,
      slideHeights,
      peek,
    ]);

    const resolvedViewportHeight = viewportHeight ?? dynamicHeight;
    const hasFixedHeight = viewportHeight !== undefined;

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        measureViewport(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [measureViewport, ref],
    );

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      const position =
        orientation === "vertical" ? event.clientY : event.clientX;
      onDragStart(position);
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
      const position =
        orientation === "vertical" ? event.clientY : event.clientX;
      onDragMove(position);
    };

    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      onDragEnd();
    };

    return (
      <div
        ref={setRefs}
        data-slot="carousel-viewport"
        aria-live="polite"
        className={cn(
          carouselViewportVariants({
            size,
            rounded,
            orientation,
            transition,
          }),
          dynamicHeight !== undefined &&
            !hasFixedHeight &&
            "transition-[height] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          className,
        )}
        style={{
          ...(resolvedViewportHeight !== undefined
            ? { height: resolvedViewportHeight }
            : undefined),
          ...style,
        }}
        {...props}
      >
        <div
          data-slot="carousel-track"
          className={cn(
            carouselTrackVariants({
              transition,
              orientation,
              gap,
              dragging: isDragging,
            }),
            hasFixedHeight && transition === "slide" && "h-full",
          )}
          style={{
            transform: trackTransform,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {Children.map(children, (child, childIndex) => {
            if (!isValidElement(child)) return child;

            const itemWidth =
              transition === "slide" && slideWidth > 0
                ? slideWidth
                : resolveFallbackSlideWidthPercent(effectiveSlidesPerView);

            return cloneElement(
              child as ReactElement<CarouselItemInternalProps>,
              {
                index: childIndex,
                registerSlideHeight:
                  !hasFixedHeight && transition === "slide"
                    ? registerSlideHeight
                    : undefined,
                style: {
                  ...((child.props as CarouselItemInternalProps).style ?? {}),
                  width: itemWidth,
                  flexBasis: itemWidth,
                  flexShrink: 0,
                },
              },
            );
          })}
        </div>
      </div>
    );
  },
);

CarouselContent.displayName = "CarouselContent";

type CarouselItemInternalProps = CarouselItemProps & {
  index?: number;
  registerSlideHeight?: (index: number, height: number) => void;
};

const CarouselItem = forwardRef<HTMLDivElement, CarouselItemInternalProps>(
  (
    { className, index = 0, style, children, registerSlideHeight, ...props },
    ref,
  ) => {
    const {
      index: activeIndex,
      transition,
      orientation,
      slidesPerView,
      peek,
      height: viewportHeight,
    } = useCarouselContext();

    const itemRef = useRef<HTMLDivElement | null>(null);
    const perView = normalizeSlidesPerView(slidesPerView);
    const hasFixedHeight = viewportHeight !== undefined;

    const isActive =
      transition === "fade"
        ? index === activeIndex
        : peek
          ? index >= activeIndex && index <= activeIndex + 1
          : index >= activeIndex && index < activeIndex + perView;

    const setItemRef = useCallback(
      (node: HTMLDivElement | null) => {
        itemRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    useEffect(() => {
      if (
        transition !== "slide" ||
        hasFixedHeight ||
        !registerSlideHeight ||
        !itemRef.current
      ) {
        return;
      }

      const node = itemRef.current;

      const report = () => {
        registerSlideHeight(index, node.offsetHeight);
      };

      report();

      const observer = new ResizeObserver(report);
      observer.observe(node);
      return () => observer.disconnect();
    }, [transition, hasFixedHeight, registerSlideHeight, index, children]);

    return (
      <div
        ref={setItemRef}
        data-slot="carousel-item"
        role="group"
        aria-roledescription="slide"
        aria-hidden={transition === "fade" ? !isActive : false}
        aria-label={`Slide ${index + 1}`}
        className={cn(
          carouselItemVariants({
            transition,
            orientation,
            visible: isActive,
            fixedHeight: hasFixedHeight && transition === "slide",
          }),
          hasFixedHeight && transition === "slide" && "*:h-full *:min-h-0",
          className,
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CarouselItem.displayName = "CarouselItem";

function CarouselControls({
  position,
  className,
}: {
  position?: CarouselRootProps["controlsPosition"];
  className?: string;
}) {
  const { controlsPosition } = useCarouselContext();
  const resolvedPosition = position ?? controlsPosition;

  if (resolvedPosition === "outside") {
    return null;
  }

  return (
    <div
      className={cn(
        carouselControlsGroupVariants({ position: resolvedPosition }),
        className,
      )}
    >
      <CarouselPrevious className="pointer-events-auto" />
      <CarouselNext className="pointer-events-auto" />
    </div>
  );
}

const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselPreviousProps>(
  (
    { className, variant, size, rounded, label = "Previous slide", ...props },
    ref,
  ) => {
    const { api, controlsVariant, controlsSize, rtl } = useCarouselContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        disabled={!api.canScrollPrev}
        className={cn(
          carouselControlVariants({
            variant: variant ?? controlsVariant,
            size: size ?? controlsSize,
            rounded: rounded ?? "full",
          }),
          className,
        )}
        onClick={api.scrollPrev}
        {...props}
      >
        {rtl ? (
          <ChevronRight className="size-4" aria-hidden />
        ) : (
          <ChevronLeft className="size-4" aria-hidden />
        )}
      </button>
    );
  },
);

CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = forwardRef<HTMLButtonElement, CarouselNextProps>(
  (
    { className, variant, size, rounded, label = "Next slide", ...props },
    ref,
  ) => {
    const { api, controlsVariant, controlsSize, rtl } = useCarouselContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        disabled={!api.canScrollNext}
        className={cn(
          carouselControlVariants({
            variant: variant ?? controlsVariant,
            size: size ?? controlsSize,
            rounded: rounded ?? "full",
          }),
          className,
        )}
        onClick={api.scrollNext}
        {...props}
      >
        {rtl ? (
          <ChevronLeft className="size-4" aria-hidden />
        ) : (
          <ChevronRight className="size-4" aria-hidden />
        )}
      </button>
    );
  },
);

CarouselNext.displayName = "CarouselNext";

const CarouselIndicators = forwardRef<HTMLDivElement, CarouselIndicatorsProps>(
  (
    { className, variant, position, size, indicatorClassName, ...props },
    ref,
  ) => {
    const {
      count,
      index: activeIndex,
      indicatorVariant,
      indicatorPosition,
      legacyIndicatorClassName,
    } = useCarouselContext();

    const resolvedVariant = variant ?? indicatorVariant;
    const resolvedPosition = position ?? indicatorPosition;
    const resolvedClassNameFn = indicatorClassName ?? legacyIndicatorClassName;
    const isOverlay =
      resolvedPosition === "bottom" || resolvedPosition === "overlay";

    if (count <= 1) return null;

    if (resolvedVariant === "fraction") {
      return (
        <div
          ref={ref}
          className={cn(
            carouselIndicatorsVariants({
              variant: resolvedVariant,
              position: resolvedPosition,
              size,
            }),
            className,
          )}
          {...props}
        >
          <CarouselCounter size={size} />
        </div>
      );
    }

    if (resolvedVariant === "progress") {
      return (
        <div
          ref={ref}
          className={cn(
            carouselIndicatorsVariants({
              variant: resolvedVariant,
              position: resolvedPosition,
              size,
            }),
            className,
          )}
          {...props}
        >
          <CarouselProgress size={size} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="tablist"
        aria-label="Carousel pagination"
        className={cn(
          carouselIndicatorsVariants({
            variant: resolvedVariant,
            position: resolvedPosition,
            size,
          }),
          isOverlay &&
            "bg-linear-to-t from-background/70 via-background/20 to-transparent",
          className,
        )}
        {...props}
      >
        {Array.from({ length: count }).map((_, indicatorIndex) => (
          <CarouselIndicator
            key={indicatorIndex}
            index={indicatorIndex}
            variant={resolvedVariant}
            size={size}
            active={indicatorIndex === activeIndex}
            className={resolvedClassNameFn?.(indicatorIndex === activeIndex)}
          />
        ))}
      </div>
    );
  },
);

CarouselIndicators.displayName = "CarouselIndicators";

const CarouselIndicator = forwardRef<HTMLButtonElement, CarouselIndicatorProps>(
  ({ className, index, variant, size, active, ...props }, ref) => {
    const { index: activeIndex, api, indicatorVariant } = useCarouselContext();
    const isActive = active ?? index === activeIndex;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-label={`Go to slide ${index + 1}`}
        aria-selected={isActive}
        className={cn(
          carouselIndicatorVariants({
            variant: variant ?? indicatorVariant,
            size,
            active: isActive,
          }),
          className,
        )}
        onClick={() => api.scrollTo(index)}
        {...props}
      />
    );
  },
);

CarouselIndicator.displayName = "CarouselIndicator";

const CarouselProgress = forwardRef<HTMLDivElement, CarouselProgressProps>(
  ({ className, size, ...props }, ref) => {
    const {
      index,
      count,
      duration,
      autoPlay,
      isPlaying,
      progressKey,
      registerProgressReset,
    } = useCarouselContext();

    useEffect(() => {
      registerProgressReset(() => undefined);
    }, [registerProgressReset, progressKey]);

    if (count <= 1) return null;

    return (
      <div
        ref={ref}
        className={cn(carouselProgressVariants({ size }), className)}
        {...props}
      >
        <div
          key={`${index}-${progressKey}`}
          className="h-full w-0 rounded-full bg-primary"
          style={{
            animation:
              autoPlay && isPlaying
                ? `carousel-progress ${duration}ms linear forwards`
                : undefined,
          }}
        />
      </div>
    );
  },
);

CarouselProgress.displayName = "CarouselProgress";

const CarouselCounter = forwardRef<HTMLDivElement, CarouselCounterProps>(
  ({ className, size, ...props }, ref) => {
    const { index, count } = useCarouselContext();

    return (
      <div
        ref={ref}
        className={cn(carouselFractionVariants({ size }), className)}
        {...props}
      >
        {index + 1} / {count}
      </div>
    );
  },
);

CarouselCounter.displayName = "CarouselCounter";

type CarouselComponent = typeof CarouselRoot & {
  Content: typeof CarouselContent;
  Item: typeof CarouselItem;
  Previous: typeof CarouselPrevious;
  Next: typeof CarouselNext;
  Controls: typeof CarouselControls;
  Indicators: typeof CarouselIndicators;
  Indicator: typeof CarouselIndicator;
  Progress: typeof CarouselProgress;
  Counter: typeof CarouselCounter;
};

const Carousel = Object.assign(CarouselRoot, {
  Content: CarouselContent,
  Item: CarouselItem,
  Previous: CarouselPrevious,
  Next: CarouselNext,
  Controls: CarouselControls,
  Indicators: CarouselIndicators,
  Indicator: CarouselIndicator,
  Progress: CarouselProgress,
  Counter: CarouselCounter,
}) as CarouselComponent;

export { Carousel };
export type { CarouselComponent };

export {
  CarouselRoot,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselControls,
  CarouselIndicators,
  CarouselIndicator,
  CarouselProgress,
  CarouselCounter,
  carouselVariants,
};

export default Carousel;
