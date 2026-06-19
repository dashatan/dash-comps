/**
 * Grab-to-scroll: content follows the pointer.
 * Pull right (+Δx) → content moves right; pull left (−Δx) → content moves left.
 *
 * The scroll container must use `dir-ltr` so scrollLeft behaves the same in every
 * locale (see `#table-inner` in table.tsx). Table layout RTL is set on `<table>`.
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
