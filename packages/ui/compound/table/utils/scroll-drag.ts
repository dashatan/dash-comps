export function isRtlElement(element: HTMLElement): boolean {
  return getComputedStyle(element).direction === 'rtl'
}

/**
 * Grab-to-scroll: content follows the pointer (drag right → content moves right).
 * Use the same delta sign for LTR and RTL — flipping for RTL double-inverts in
 * Chromium when the scroll container inherits `dir="rtl"` from the document.
 */
export function applyDragScroll(
  element: HTMLElement,
  startScrollLeft: number,
  startScrollTop: number,
  deltaX: number,
  deltaY: number,
): void {
  element.scrollLeft = startScrollLeft - deltaX
  element.scrollTop = startScrollTop - deltaY
}
