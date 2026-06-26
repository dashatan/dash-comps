import { MAP_FIT_GUTTER, type MapOverlayInsets } from "./types";

export function getMapFitPadding(
  insets: MapOverlayInsets,
  gutter: number = MAP_FIT_GUTTER,
): MapOverlayInsets {
  return {
    top: insets.top + gutter,
    right: insets.right + gutter,
    bottom: insets.bottom + gutter,
    left: insets.left + gutter,
  };
}
