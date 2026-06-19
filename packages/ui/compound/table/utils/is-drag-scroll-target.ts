const INTERACTIVE_SELECTOR =
  'button, input, select, textarea, a, label, [role="checkbox"], [role="button"], [data-no-drag-scroll]'

export function isDragScrollTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return !!target.closest(INTERACTIVE_SELECTOR)
}
