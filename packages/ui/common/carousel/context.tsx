"use client";

import { createContext, useContext, type CSSProperties } from "react";
import type {
  CarouselApi,
  CarouselControlSize,
  CarouselControlVariant,
  CarouselControlsPosition,
  CarouselGap,
  CarouselIndicatorPosition,
  CarouselIndicatorVariant,
  CarouselOrientation,
  CarouselRounded,
  CarouselSize,
  CarouselTransition,
} from "@/components/common/carousel/types";

export type CarouselContextValue = {
  index: number;
  count: number;
  api: CarouselApi;
  size: CarouselSize;
  rounded: CarouselRounded;
  orientation: CarouselOrientation;
  transition: CarouselTransition;
  gap: CarouselGap;
  slidesPerView: number;
  peek: boolean;
  loop: boolean;
  rtl: boolean;
  isDragging: boolean;
  dragOffset: number;
  autoPlay: boolean;
  duration: number;
  isPlaying: boolean;
  showControls: boolean;
  showIndicators: boolean;
  controlsVariant: CarouselControlVariant;
  controlsSize: CarouselControlSize;
  controlsPosition: CarouselControlsPosition;
  indicatorVariant: CarouselIndicatorVariant;
  indicatorPosition: CarouselIndicatorPosition;
  legacyIndicatorClassName?: (isActive: boolean) => string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  setCount: (count: number) => void;
  onDragStart: (clientPosition: number) => void;
  onDragMove: (clientPosition: number) => void;
  onDragEnd: () => void;
  registerProgressReset: (reset: () => void) => void;
  progressKey: number;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function CarouselProvider({
  value,
  children,
}: {
  value: CarouselContextValue;
  children: React.ReactNode;
}) {
  return (
    <CarouselContext.Provider value={value}>{children}</CarouselContext.Provider>
  );
}

export function useCarouselContext(): CarouselContextValue {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("Carousel compound components must be used within Carousel.");
  }
  return context;
}

export function useOptionalCarouselContext(): CarouselContextValue | null {
  return useContext(CarouselContext);
}
