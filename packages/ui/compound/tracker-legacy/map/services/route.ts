import mapLibreGl from "maplibre-gl";
import {
  MAP_STYLES,
  LAYER_IDS,
  SOURCE_IDS,
  MAP_CONFIG,
  ANIMATION_CONFIG,
  MOBILE_MAP_PADDING,
} from "../config/constants";
import { getMapFitPadding } from "../../map-fit-padding";
import { useTrackerStore } from "../../store";
import { Coordinate, DrawingContext } from "../types";
import { getValidEvents, coordinateToLngLat } from "../../utils";
import { MarkerManager } from "./marker";
import { TooltipService } from "./tooltip";
import { deviceType, getHexColor, type Translation } from "@/lib";

/**
 * Route drawing and map visualization service
 */
export class RouteDrawer {
  private static instance: RouteDrawer;
  private markerManager: MarkerManager;
  private tooltipService: TooltipService;

  public static getInstance(): RouteDrawer {
    if (!RouteDrawer.instance) {
      RouteDrawer.instance = new RouteDrawer();
    }
    return RouteDrawer.instance;
  }

  constructor() {
    this.markerManager = MarkerManager.getInstance();
    this.tooltipService = TooltipService.getInstance();
  }

  /**
   * Draw route and markers on the map
   */
  public drawRouteAndMarkers(
    context: DrawingContext,
    markerRefs: React.RefObject<mapLibreGl.Marker[]>,
    onEventClick: (index: number) => void,
    getTranslation: () => Translation,
    locale: string,
    autoPaneMap: boolean,
    force?: boolean,
  ): void {
    const { map, events, routeCoords, activeEventIndex } = context;

    if (!map || !events?.length) return;
    if (!force && !map.isStyleLoaded()) return;

    // Clean up existing layers and markers
    this.cleanupExistingLayers(map);
    this.markerManager.removeMarkers(markerRefs.current);

    if (!routeCoords || routeCoords.length <= 1) return;

    // Draw route
    this.drawRoute(map, routeCoords);

    // Create and add markers
    const validEvents = getValidEvents(events);
    const t = getTranslation();

    const markers = this.markerManager.createMarkersForEvents(
      map,
      validEvents,
      activeEventIndex,
      onEventClick,
      (event) =>
        this.tooltipService.generateTooltipContent(event, events, t, locale),
    );

    (markerRefs as { current: mapLibreGl.Marker[] }).current = markers;

    // Adjust map view
    if (autoPaneMap) {
      this.adjustMapView(map, routeCoords);
    }
  }

  /**
   * Refresh event markers when the active index changes (without redrawing the route).
   */
  public updateEventMarkers(
    context: DrawingContext,
    markerRefs: React.RefObject<mapLibreGl.Marker[]>,
    onEventClick: (index: number) => void,
    getTranslation: () => Translation,
    locale: string,
  ): void {
    const { map, events, activeEventIndex } = context;

    if (!map || !events?.length || !map.isStyleLoaded()) return;

    this.markerManager.removeMarkers(markerRefs.current);

    const validEvents = getValidEvents(events);
    const t = getTranslation();
    const markers = this.markerManager.createMarkersForEvents(
      map,
      validEvents,
      activeEventIndex,
      onEventClick,
      (event) =>
        this.tooltipService.generateTooltipContent(event, events, t, locale),
    );

    (markerRefs as { current: mapLibreGl.Marker[] }).current = markers;
  }

  /**
   * Draw route line on the map
   */
  private drawRoute(map: mapLibreGl.Map, routeCoords: Coordinate[]): void {
    const routeColor = getHexColor(MAP_STYLES.ROUTE_BASE_COLOR_VAR);
    const coordinates = routeCoords.map(coordinateToLngLat);

    // Add route source
    map.addSource(SOURCE_IDS.ROUTE, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates,
        },
        properties: {},
      },
    });

    // Find the first symbol layer to insert route below it
    const firstSymbolLayerId = this.getFirstSymbolLayerId(map);

    // Add route layer
    map.addLayer(
      {
        id: LAYER_IDS.ROUTE,
        type: "line",
        source: SOURCE_IDS.ROUTE,
        paint: {
          "line-color": routeColor,
          "line-width": MAP_STYLES.LINE_WIDTH,
        },
      },
      firstSymbolLayerId,
    );

    // Add passed-route source/layer (updated during playback animation)
    map.addSource(SOURCE_IDS.PASSED_ROUTE, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "LineString", coordinates: [] },
        properties: {},
      },
    });
    this.addPassedRouteLayer(map, firstSymbolLayerId);
  }

  /**
   * Add passed route layer if source exists
   */
  private addPassedRouteLayer(
    map: mapLibreGl.Map,
    firstSymbolLayerId?: string,
  ): void {
    if (
      map.getSource(SOURCE_IDS.PASSED_ROUTE) &&
      !map.getLayer(LAYER_IDS.PASSED_ROUTE)
    ) {
      const passedRouteColor = getHexColor(MAP_STYLES.ROUTE_PASSED_COLOR_VAR);

      map.addLayer(
        {
          id: LAYER_IDS.PASSED_ROUTE,
          type: "line",
          source: SOURCE_IDS.PASSED_ROUTE,
          paint: {
            "line-color": passedRouteColor,
            "line-width": MAP_STYLES.PASSED_LINE_WIDTH,
          },
        },
        firstSymbolLayerId,
      );
    }
  }

  /**
   * Clean up existing route layers and sources
   */
  private cleanupExistingLayers(map: mapLibreGl.Map): void {
    // Remove route layer and source
    if (map.getLayer(LAYER_IDS.ROUTE)) {
      map.removeLayer(LAYER_IDS.ROUTE);
    }
    if (map.getSource(SOURCE_IDS.ROUTE)) {
      map.removeSource(SOURCE_IDS.ROUTE);
    }

    // Remove passed-route layer and source
    if (map.getLayer(LAYER_IDS.PASSED_ROUTE)) {
      map.removeLayer(LAYER_IDS.PASSED_ROUTE);
    }
    if (map.getSource(SOURCE_IDS.PASSED_ROUTE)) {
      map.removeSource(SOURCE_IDS.PASSED_ROUTE);
    }
  }

  /**
   * Get the ID of the first symbol layer
   */
  private getFirstSymbolLayerId(map: mapLibreGl.Map): string | undefined {
    const layers = map.getStyle().layers;
    if (layers && layers.length > 0) {
      const symbolLayer = layers.find((layer) => layer.type === "symbol");
      return symbolLayer?.id;
    }
    return undefined;
  }

  /**
   * Adjust map view to fit the route
   */
  public fitRouteToView(map: mapLibreGl.Map, routeCoords: Coordinate[]): void {
    this.adjustMapView(map, routeCoords);
  }

  /**
   * Adjust map view to fit the route
   */
  private adjustMapView(map: mapLibreGl.Map, routeCoords: Coordinate[]): void {
    const isMobile = deviceType() === "mobile";
    const overlayInsets = useTrackerStore.getState().mapOverlayInsets;
    const padding = isMobile
      ? MOBILE_MAP_PADDING
      : getMapFitPadding(overlayInsets);

    setTimeout(() => {
      if (routeCoords.length === 1) {
        const [lat, lng] = routeCoords[0];
        map.setCenter([lng, lat]);
        map.setZoom(MAP_CONFIG.DETAIL_ZOOM);
      } else if (routeCoords.length > 1) {
        const bounds = this.calculateRouteBounds(routeCoords);
        map.fitBounds(bounds, {
          padding,
          maxZoom: MAP_CONFIG.MAX_ZOOM,
          animate: true,
        });
      }
    }, ANIMATION_CONFIG.AUTO_PANE_TIMEOUT);
  }

  /**
   * Calculate bounds for the route
   */
  private calculateRouteBounds(
    routeCoords: Coordinate[],
  ): mapLibreGl.LngLatBounds {
    const firstPoint = routeCoords[0];
    const bounds = new mapLibreGl.LngLatBounds(
      [firstPoint[1], firstPoint[0]], // [lng, lat]
      [firstPoint[1], firstPoint[0]], // [lng, lat]
    );

    routeCoords.forEach(([lat, lng]) => {
      bounds.extend([lng, lat]);
    });

    return bounds;
  }

  /**
   * Update passed route visualization
   */
  public updatePassedRoute(
    map: mapLibreGl.Map,
    routeCoords: Coordinate[],
    passedCoords: Coordinate[],
  ): void {
    if (!map.isStyleLoaded()) return;

    const passedRouteColor = getHexColor(MAP_STYLES.ROUTE_PASSED_COLOR_VAR);
    const coordinates = passedCoords.map(coordinateToLngLat);

    const geojson = {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates,
      },
      properties: {},
    };

    if (map.getSource(SOURCE_IDS.PASSED_ROUTE)) {
      // Update existing source
      (
        map.getSource(SOURCE_IDS.PASSED_ROUTE) as mapLibreGl.GeoJSONSource
      ).setData(geojson);
    } else {
      // Add new source and layer
      map.addSource(SOURCE_IDS.PASSED_ROUTE, {
        type: "geojson",
        data: geojson,
      });

      const firstSymbolLayerId = this.getFirstSymbolLayerId(map);
      this.addPassedRouteLayer(map, firstSymbolLayerId);
    }
  }
}
