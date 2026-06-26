/**
 * Map configuration constants
 * Centralized configuration for map styling and behavior
 */

// === Map Styling Constants ===
export const MAP_STYLES = {
  ROUTE_BASE_COLOR_VAR: "--color-primary",
  ROUTE_PASSED_COLOR_VAR: "--color-foreground",
  LINE_WIDTH: 4,
  CIRCLE_POINT_SIZE: 17,
  CIRCLE_POINT_BORDER: 2,
} as const;

// === Map Configuration ===
export const MAP_CONFIG = {
  CENTER_COORD: [35.691143, 51.428421] as [number, number],
  MAX_PITCH: 80,
  DEFAULT_ZOOM: 7,
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
} as const;

// === Padding Configuration ===
export const MAP_PADDING = {
  left: 300,
  top: 40,
  right: 40,
  bottom: 40,
} as const;

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
