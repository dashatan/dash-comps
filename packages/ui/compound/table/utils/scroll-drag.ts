export function isRtlElement(element: HTMLElement): boolean {
  return getComputedStyle(element).direction === 'rtl'
}

export function applyDragScroll(
  element: HTMLElement,
  startScrollLeft: number,
  startScrollTop: number,
  deltaX: number,
  deltaY: number,
): void {
  const rtl = isRtlElement(element)
  element.scrollLeft = rtl ? startScrollLeft + deltaX : startScrollLeft - deltaX
  element.scrollTop = startScrollTop - deltaY
}
