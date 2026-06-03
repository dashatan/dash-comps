import type { TooltipItem } from "@/components/common/charts/tooltip";
import type { ReactNode } from "react";
import type L from "leaflet";

// /** Single URL or light/dark pair for theme-aware tiles. */
// export type MapTiles = string | { light: string; dark?: string };

// export type MapTheme = "light" | "dark";

export type LeafletMapProps = {
  center?: Point;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  /** Tile source(s). Pass `{ light, dark }` when dark tiles are available. */
  // tiles: MapTiles;
  /**
   * Which tile variant to use when `tiles` is an object.
   * Omit to default to `"light"`. Wire to `useTheme().resolvedTheme` when ready.
   */
  // theme?: MapTheme;
  tileUrl: string;
  zoomControl?: boolean;
  pmIgnore?: boolean;
  className?: string;
  mapOptions?: Omit<L.MapOptions, "zoomControl">;
  whenReady?: (map: L.Map) => void;
  onCenterChange?: (center: Point) => void;
  children?: ReactNode;
};

export type GeomanShape =
  | "Marker"
  | "Circle"
  | "CircleMarker"
  | "Rectangle"
  | "Polygon"
  | "Line"
  | "Text"
  | "Cut";

export type GeomanCreateEvent = {
  shape: GeomanShape;
  layer: L.Layer;
  /** Populated for Polygon and Rectangle shapes. */
  polygon: Point[];
};

export type MapGeomanProps = {
  showToolbar?: boolean;
  toolbarPosition?: L.ControlPosition;
  toolbarOptions?: {
    drawMarker?: boolean;
    drawPolyline?: boolean;
    drawText?: boolean;
    rotateMode?: boolean;
    drawCircleMarker?: boolean;
    drawCircle?: boolean;
    cutPolygon?: boolean;
  };
  /** Shapes to enable for drawing (requires toolbar or imperative enableDraw). */
  enabledShapes?: GeomanShape[];
  drawPathOptions?: L.PathOptions;
  onCreate?: (event: GeomanCreateEvent) => void;
};

export type MapGeoSearchProps = {
  nominatimUrl: string;
  searchLabel: string;
  acceptLanguage?: string;
  position?: L.ControlPosition;
  markerIcon?: L.Icon | L.DivIcon;
};

export type MapDeviceClusterProps = {
  devices: Array<{
    id: number;
    lat: string;
    long: string;
    name?: string;
    province?: string | number;
    provinceName?: string;
    road?: string | number;
    roadName?: string;
    source?: string | number;
    sourceName?: string;
  }>;
  icon: L.Icon | L.DivIcon;
  onMarkerClick?: (deviceId: number, latLng: L.LatLng) => void;
};

export type MapPolylineProps = {
  points: Point[];
  pathOptions?: L.PolylineOptions;
  className?: string;
  fitBounds?: boolean;
  fitBoundsPadding?: L.FitBoundsOptions["padding"];
};

export type MapFitBoundsProps = {
  bounds: Point[] | L.LatLngBounds;
  padding?: L.FitBoundsOptions["padding"];
  enabled?: boolean;
};

export type MapClickPlacementProps = {
  active: boolean;
  icon: L.Icon | L.DivIcon;
  draggable?: boolean;
  onPlace: (position: Point) => void;
};

export type MapMarkerItem = {
  lat: string | number;
  long: string | number;
};

export type MapOverlayItemsConfig<T> = {
  tooltipItems?: (item: T) => TooltipItem[];
  tooltipTitle?: (item: T) => string | undefined;
  popupItems?: (item: T) => TooltipItem[];
  popupTitle?: (item: T) => string | undefined;
};

export type MapMarkersProps<T extends MapMarkerItem = MapMarkerItem> = MapOverlayItemsConfig<T> & {
  data: T[];
  icon?: L.Icon | L.DivIcon | ((item: T) => L.Icon | L.DivIcon);
  cluster?: boolean;
  /** Highlights and focuses the map when this key changes. */
  selectedKey?: string | number | null;
  getItemKey?: (item: T) => string | number | undefined;
  /** Minimum zoom when focusing a selected marker. */
  selectionMinZoom?: number;
  /** Pixel pan after selection focus (sidebar offset). */
  selectionPanOffsetPx?: [number, number];
  /** Raw HTML tooltip; ignored when `tooltipItems` is set. */
  tooltip?: (item: T) => string;
  /** Raw HTML popup; ignored when `popupItems` is set. */
  popup?: (item: T) => string;
  popupOptions?: L.PopupOptions;
  onMarkerClick?: (item: T, latLng: L.LatLng) => void;
};
