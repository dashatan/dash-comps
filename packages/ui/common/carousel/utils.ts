import type { CarouselGap } from "@/components/common/carousel/types";
import { GAP_PX } from "@/components/common/carousel/variants";

export function normalizeSlidesPerView(value: number) {
  return Math.max(1, Math.floor(value));
}

export function normalizeSlidesToScroll(toScroll: number, perView: number) {
  const normalizedPerView = normalizeSlidesPerView(perView);
  return Math.max(1, Math.min(Math.floor(toScroll), normalizedPerView));
}

export function resolveMaxIndex(
  count: number,
  slidesPerView: number,
  loop: boolean,
) {
  if (count <= 0) return 0;
  if (loop) return count - 1;

  const perView = normalizeSlidesPerView(slidesPerView);
  return Math.max(0, count - perView);
}

export function clampCarouselIndex(
  index: number,
  count: number,
  slidesPerView: number,
  loop: boolean,
) {
  if (count <= 0) return 0;

  if (loop) {
    const normalized = index % count;
    return normalized < 0 ? normalized + count : normalized;
  }

  const maxIndex = resolveMaxIndex(count, slidesPerView, loop);
  return Math.max(0, Math.min(index, maxIndex));
}

export function resolveSlideWidth(
  viewportWidth: number,
  slidesPerView: number,
  gap: CarouselGap,
  peek: boolean,
) {
  if (viewportWidth <= 0) return 0;

  const perView = normalizeSlidesPerView(slidesPerView);
  const gapPx = GAP_PX[gap ?? "none"];

  if (peek && perView <= 1) {
    return viewportWidth * 0.88;
  }

  if (perView <= 1) {
    return viewportWidth;
  }

  const totalGap = gapPx * (perView - 1);
  return (viewportWidth - totalGap) / perView;
}

export function resolveTrackOffset(
  index: number,
  slideWidth: number,
  gapPx: number,
  dragOffset: number,
  orientation: "horizontal" | "vertical",
  rtl: boolean,
) {
  const step = slideWidth + gapPx;
  const base = index * step;
  const total = (rtl ? 1 : -1) * base + dragOffset;

  if (orientation === "vertical") {
    return `translate3d(0, ${-base + dragOffset}px, 0)`;
  }

  return `translate3d(${total}px, 0, 0)`;
}

export function resolveFallbackTrackOffset(
  index: number,
  slidesPerView: number,
  dragOffset: number,
  rtl: boolean,
) {
  const perView = normalizeSlidesPerView(slidesPerView);
  const step = 100 / perView;
  const base = index * step;
  const direction = rtl ? 1 : -1;

  return `translate3d(calc(${direction * base}% + ${dragOffset}px), 0, 0)`;
}

export function resolveFallbackSlideWidthPercent(slidesPerView: number) {
  const perView = normalizeSlidesPerView(slidesPerView);
  return `${100 / perView}%`;
}
