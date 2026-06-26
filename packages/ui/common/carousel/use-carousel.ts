"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { CarouselApi } from "@/components/common/carousel/types";
import {
  clampCarouselIndex,
  normalizeSlidesPerView,
  normalizeSlidesToScroll,
  resolveMaxIndex,
} from "@/components/common/carousel/utils";

const SWIPE_THRESHOLD = 48;

type UseCarouselOptions = {
  count: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (index: number) => void;
  onSlideChange?: (index: number) => void;
  autoPlay?: boolean;
  duration?: number;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  loop?: boolean;
  rtl?: boolean;
  slidesPerView?: number;
  slidesToScroll?: number;
};

type UseCarouselResult = {
  index: number;
  count: number;
  api: CarouselApi;
  isPlaying: boolean;
  isDragging: boolean;
  dragOffset: number;
  progressKey: number;
  setCount: Dispatch<SetStateAction<number>>;
  onDragStart: (clientPosition: number) => void;
  onDragMove: (clientPosition: number) => void;
  onDragEnd: () => void;
  registerProgressReset: (reset: () => void) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
};

export function useCarousel({
  count,
  value,
  defaultValue = 0,
  onValueChange,
  onSlideChange,
  autoPlay = false,
  duration = 5000,
  pauseOnHover = true,
  pauseOnFocus = true,
  loop = false,
  rtl = false,
  slidesPerView = 1,
  slidesToScroll = 1,
}: UseCarouselOptions): UseCarouselResult {
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultValue);
  const [slideCount, setSlideCount] = useState(count);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const dragStartRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef(0);
  const progressResetRef = useRef<(() => void) | null>(null);
  const pausedByInteractionRef = useRef(false);
  const indexRef = useRef(defaultValue);

  const perView = normalizeSlidesPerView(slidesPerView);
  const scrollStep = normalizeSlidesToScroll(slidesToScroll, perView);
  const maxIndex = resolveMaxIndex(slideCount, perView, loop);

  const isControlled = value !== undefined;
  const index = clampCarouselIndex(
    isControlled ? value : uncontrolledIndex,
    slideCount,
    perView,
    loop,
  );

  indexRef.current = index;

  const setIndex = useCallback(
    (nextIndex: number) => {
      const resolved = clampCarouselIndex(nextIndex, slideCount, perView, loop);
      if (!isControlled) {
        setUncontrolledIndex(resolved);
      }
      onValueChange?.(resolved);
      onSlideChange?.(resolved);
      setProgressKey((current) => current + 1);
      progressResetRef.current?.();
    },
    [isControlled, loop, onSlideChange, onValueChange, perView, slideCount],
  );

  const canScrollPrev = loop || index > 0;
  const canScrollNext = loop || index < maxIndex;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (slideCount <= perView) return;
    setIsPlaying(true);
    pausedByInteractionRef.current = false;
  }, [perView, slideCount]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    pausedByInteractionRef.current = true;
    clearTimer();
  }, [clearTimer]);

  const scrollTo = useCallback(
    (targetIndex: number) => {
      setIndex(targetIndex);
    },
    [setIndex],
  );

  const scrollNext = useCallback(() => {
    const current = indexRef.current;
    if (!loop && current >= maxIndex) return;
    setIndex(current + scrollStep);
  }, [loop, maxIndex, scrollStep, setIndex]);

  const scrollPrev = useCallback(() => {
    const current = indexRef.current;
    if (!loop && current <= 0) return;
    setIndex(current - scrollStep);
  }, [loop, scrollStep, setIndex]);

  const startAutoplay = useCallback(() => {
    clearTimer();
    if (!autoPlay || slideCount <= perView || pausedByInteractionRef.current) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setIndex(indexRef.current + scrollStep);
    }, duration);
  }, [
    autoPlay,
    clearTimer,
    duration,
    perView,
    scrollStep,
    setIndex,
    slideCount,
  ]);

  useEffect(() => {
    if (count > 0) {
      setSlideCount(count);
    }
  }, [count]);

  useEffect(() => {
    if (!isControlled) {
      setUncontrolledIndex((current) =>
        clampCarouselIndex(current, slideCount, perView, loop),
      );
    }
  }, [isControlled, loop, perView, slideCount]);

  useEffect(() => {
    setIsPlaying(autoPlay);
    pausedByInteractionRef.current = !autoPlay;
  }, [autoPlay]);

  useEffect(() => {
    if (isPlaying && autoPlay && slideCount > perView) {
      startAutoplay();
      return clearTimer;
    }
    clearTimer();
    return undefined;
  }, [autoPlay, clearTimer, isPlaying, perView, slideCount, startAutoplay]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover && isPlaying) {
      clearTimer();
    }
  }, [clearTimer, isPlaying, pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover && isPlaying && autoPlay) {
      startAutoplay();
    }
  }, [autoPlay, isPlaying, pauseOnHover, startAutoplay]);

  const handleFocus = useCallback(() => {
    if (pauseOnFocus && isPlaying) {
      clearTimer();
    }
  }, [clearTimer, isPlaying, pauseOnFocus]);

  const handleBlur = useCallback(() => {
    if (pauseOnFocus && isPlaying && autoPlay) {
      startAutoplay();
    }
  }, [autoPlay, isPlaying, pauseOnFocus, startAutoplay]);

  const onDragStart = useCallback(
    (clientPosition: number) => {
      dragStartRef.current = clientPosition;
      dragOffsetRef.current = 0;
      isDraggingRef.current = true;
      setIsDragging(true);
      setDragOffset(0);
      clearTimer();
    },
    [clearTimer],
  );

  const onDragMove = useCallback((clientPosition: number) => {
    if (!isDraggingRef.current || dragStartRef.current === null) return;
    const delta = clientPosition - dragStartRef.current;
    dragOffsetRef.current = delta;
    setDragOffset(delta);
  }, []);

  const onDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    const offset = dragOffsetRef.current;
    const directionMultiplier = rtl ? -1 : 1;

    if (Math.abs(offset) >= SWIPE_THRESHOLD) {
      if (offset * directionMultiplier > 0) {
        scrollPrev();
      } else {
        scrollNext();
      }
    }

    dragStartRef.current = null;
    dragOffsetRef.current = 0;
    isDraggingRef.current = false;
    setIsDragging(false);
    setDragOffset(0);

    if (isPlaying && autoPlay) {
      startAutoplay();
    }
  }, [autoPlay, isPlaying, rtl, scrollNext, scrollPrev, startAutoplay]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const previousKey = rtl ? "ArrowRight" : "ArrowLeft";
      const nextKey = rtl ? "ArrowLeft" : "ArrowRight";

      if (event.key === previousKey) {
        event.preventDefault();
        scrollPrev();
      }

      if (event.key === nextKey) {
        event.preventDefault();
        scrollNext();
      }

      if (event.key === "Home") {
        event.preventDefault();
        scrollTo(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        scrollTo(maxIndex);
      }
    },
    [maxIndex, rtl, scrollNext, scrollPrev, scrollTo],
  );

  const registerProgressReset = useCallback((reset: () => void) => {
    progressResetRef.current = reset;
  }, []);

  const api = useMemo<CarouselApi>(
    () => ({
      index,
      count: slideCount,
      canScrollPrev,
      canScrollNext,
      isPlaying,
      scrollPrev,
      scrollNext,
      scrollTo,
      play,
      pause,
    }),
    [
      canScrollNext,
      canScrollPrev,
      index,
      isPlaying,
      pause,
      play,
      scrollNext,
      scrollPrev,
      scrollTo,
      slideCount,
    ],
  );

  return {
    index,
    count: slideCount,
    api,
    isPlaying,
    isDragging,
    dragOffset,
    progressKey,
    setCount: setSlideCount,
    onDragStart,
    onDragMove,
    onDragEnd,
    registerProgressReset,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleKeyDown,
  };
}
