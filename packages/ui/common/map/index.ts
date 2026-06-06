// Shell
export { LeafletMap } from "@/components/common/map/leaflet-map";
export { LeafletMapProvider, useLeafletMap, useLeafletMapReady } from "@/components/common/map/context";

// Hooks
export { useMapPlugin } from "@/components/common/map/hooks/use-map-plugin";
export { useMapTheme } from "@/components/common/map/hooks/use-map-theme";
export { useGeomanDraw } from "@/components/common/map/hooks/use-geoman-draw";
export { useGeomanCreate } from "@/components/common/map/hooks/use-geoman-create";

// Plugins
export { MapGeoSearch } from "@/components/common/map/plugins/geo-search";
export { MapGeoman } from "@/components/common/map/plugins/geoman";
export { MapGeomanControls } from "@/components/common/map/plugins/geoman-controls";
export { MapDeviceCluster } from "@/components/common/map/plugins/device-cluster";
export { MapPolyline } from "@/components/common/map/plugins/polyline";
export { MapFitBounds } from "@/components/common/map/plugins/fit-bounds";
export { MapClickPlacement } from "@/components/common/map/plugins/click-placement";
export { MapMarkers as Markers } from "@/components/common/map/plugins/markers";
export { MapZoomControls } from "@/components/common/map/plugins/zoom-controls";

// Utils
export { resolveTileUrl } from "@/components/common/map/utils/tiles";
export { formatMapOverlayHtml } from "@/components/common/map/utils/overlay-content";
export {
  extractPolygonPoints,
  removeLayer,
  removeMarker,
  safeRemoveLayer,
} from "@/components/common/map/utils/layers";
export {
  createActiveDeviceIcon,
  createClusterIcon,
  createDestinationIcon,
  createDeviceIcon,
  createInactiveDeviceIcon,
  createDeviceMarkers,
  createMarkerClusterGroup,
  createOriginIcon,
  createSearchIcon,
  devicePopupContent,
  deviceTooltipContent,
  popupConfig,
  tooltipConfig,
  type MapDeviceInfo,
} from "@/components/common/map/utils/markers";

// Types
export type {
  GeomanCreateEvent,
  GeomanShape,
  LeafletMapProps,
  MapClickPlacementProps,
  MapDeviceClusterProps,
  MapFitBoundsProps,
  MapGeoSearchProps,
  MapGeomanProps,
  MapPolylineProps,
  MapMarkerItem,
  MapMarkersProps,
  MapOverlayItemsConfig,
} from "@/components/common/map/types";
export type { TooltipItem } from "@/components/common/charts/tooltip";
