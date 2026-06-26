/**
 * Map configuration constants
 * Centralized configuration for map styling and behavior
 */

// === Map Styling Constants ===
export const MAP_STYLES = {
  ROUTE_BASE_COLOR_VAR: "--color-primary",
  ROUTE_PASSED_COLOR_VAR: "--color-success",
  LINE_WIDTH: 4,
  PASSED_LINE_WIDTH: 5,
  CIRCLE_POINT_SIZE: 17,
  CIRCLE_POINT_BORDER: 2,
} as const;

// === Map Configuration ===
export const MAP_CONFIG = {
  CENTER_COORD: [50.5, 7.5] as [number, number],
  MAX_PITCH: 80,
  DEFAULT_ZOOM: 5,
  DETAIL_ZOOM: 15,
  MAX_ZOOM: 18,
  RENDER_WORLD_COPIES: false,
  ATTRIBUTION_CONTROL: false,
} as const;

// === Animation Configuration ===
export const ANIMATION_CONFIG = {
  TOOLTIP_HIDE_DELAY: 300, // milliseconds
  AUTO_PANE_TIMEOUT: 100, // milliseconds
  ARROW_OFFSET_RATIO: 0.1, // 10% along the segment
  /** Calibrates pointer SVG asset to geographic bearing (degrees). */
  ARROW_BEARING_OFFSET: -59,
} as const;

// === Padding Configuration ===
/** Fallback padding when overlay insets are not measured yet (mobile layout). */
export const MOBILE_MAP_PADDING = {
  left: 40,
  top: 40,
  right: 40,
  bottom: 480,
} as const;

// === Layer IDs ===
export const LAYER_IDS = {
  ROUTE: "route",
  PASSED_ROUTE: "passed-route",
} as const;

// === Source IDs ===
export const SOURCE_IDS = {
  ROUTE: "route",
  PASSED_ROUTE: "passed-route",
} as const;
