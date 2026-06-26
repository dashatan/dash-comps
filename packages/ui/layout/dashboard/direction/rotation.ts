export type DirectionalIconState = {
  open?: boolean;
  expanded?: boolean;
};

/** Rotation in degrees for ChevronRight (0° = points east). */
export function getChevronRotation(
  variant: "forward" | "menu" | "flyout",
  isRtl: boolean,
  state: DirectionalIconState = {},
): number {
  switch (variant) {
    case "forward":
      return isRtl ? 180 : 0;
    case "menu":
      return state.open ? 90 : isRtl ? 180 : 0;
    case "flyout":
      return isRtl ? 0 : 180;
    default:
      return 0;
  }
}

/** Rotation in degrees for ArrowRight (0° = points east). */
export function getBackArrowRotation(isRtl: boolean): number {
  return isRtl ? 0 : 180;
}

/** Rotation in degrees for SidebarRight toggle icon. */
export function getSidebarToggleRotation(
  isRtl: boolean,
  expanded: boolean,
): number {
  return expanded ? (isRtl ? 0 : 180) : isRtl ? 180 : 0;
}

/** Flip spin direction for theme toggle entrance animations. */
export function getMotionSpinDirection(isRtl: boolean): 1 | -1 {
  return isRtl ? -1 : 1;
}

/** Popover side away from the sidebar edge. */
export function getSidebarPopoverSide(
  isRtl: boolean,
  edge: "menu" | "pinned",
): "left" | "right" {
  if (edge === "menu") {
    return isRtl ? "right" : "left";
  }
  return isRtl ? "left" : "right";
}
