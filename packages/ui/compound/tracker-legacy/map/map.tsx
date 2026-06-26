import { useEffect } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import { useTrackerStore } from "../store";
import { useLanguage } from "@/lib";
import { calculateBearing, getIntlLocale } from "../utils";
import {
  MapInitializer,
  RouteDrawer,
  AnimationService,
  TooltipService,
  MarkerManager,
  ANIMATION_CONFIG,
  useMapState,
} from "./index";

export default function ObservesTrackerMap() {
  const { resolvedTheme } = useTheme();
  const { t, language } = useLanguage();
  const dateLocale = getIntlLocale(language);

  const events = useTrackerStore((state) => state.events);
  const routeCoords = useTrackerStore((state) => state.routeCoords);
  const activeEventIndex = useTrackerStore((state) => state.activeEventIndex);
  const playSpeed = useTrackerStore((state) => state.playSpeed);
  const autoPaneMap = useTrackerStore((state) => state.autoPaneMap);
  const routeIsLoading = useTrackerStore((state) => state.routeIsLoading);
  const mapTiles = useTrackerStore((state) => state.mapTiles);
  const mapOverlayInsets = useTrackerStore((state) => state.mapOverlayInsets);
  const setActiveEventIndex = useTrackerStore((state) => state.setActiveEventIndex);

  const mapInitializer = MapInitializer.getInstance();
  const routeDrawer = RouteDrawer.getInstance();
  const animationService = AnimationService.getInstance();
  const tooltipService = TooltipService.getInstance();
  const markerManager = MarkerManager.getInstance();

  const {
    mapContainerRef,
    mapRef,
    markerRefs,
    movingMarkerRef,
    arrowAnimFrameRef,
    prevActiveEventIndex,
    lastArrowAngleRef,
    eventOsrmIndices,
  } = useMapState();

  const currentTileUrl = resolvedTheme === "dark" ? mapTiles.dark : mapTiles.light;
  const tilesConfigured = Boolean(currentTileUrl);

  useEffect(() => {
    mapInitializer.initializeRTLSupport();

    if (!tilesConfigured) return;

    const theme = resolvedTheme === "dark" ? "dark" : "light";
    let map = mapRef.current;

    if (map) {
      mapInitializer.updateMapStyle(map, theme, () => handleMapReady(true));
    } else if (mapContainerRef.current) {
      try {
        map = mapInitializer.createMap(mapContainerRef.current, theme, () =>
          handleMapReady(),
        );
        mapRef.current = map;
      } catch (error) {
        console.warn("Failed to create map:", error);
      }
    }
  }, [resolvedTheme, mapTiles.light, mapTiles.dark, tilesConfigured]);

  useEffect(() => {
    handleMapReady();
  }, [events, routeCoords, eventOsrmIndices]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !autoPaneMap || routeCoords.length < 2) return;

    routeDrawer.fitRouteToView(map, routeCoords);
  }, [mapOverlayInsets, routeCoords, autoPaneMap]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !events.length || routeCoords.length <= 1) return;

    routeDrawer.updateEventMarkers(
      {
        map,
        events,
        routeCoords,
        eventOsrmIndices,
        activeEventIndex,
      },
      markerRefs,
      (index) => setActiveEventIndex(index),
      () => t,
      dateLocale,
    );
  }, [activeEventIndex, events, routeCoords, eventOsrmIndices, t, dateLocale]);

  useEffect(() => {
    handleRouteAnimation();
  }, [routeCoords, eventOsrmIndices, activeEventIndex, playSpeed]);

  useEffect(() => {
    handleArrowAnimation();
    prevActiveEventIndex.current = activeEventIndex;

    return () => {
      animationService.cancelAnimation(arrowAnimFrameRef);
      animationService.cleanupMarker(movingMarkerRef, mapRef.current);
    };
  }, [activeEventIndex, playSpeed, eventOsrmIndices, routeCoords, events]);

  function handleMapReady(force?: boolean) {
    const map = mapRef.current;
    if (!map || !events.length) return;

    routeDrawer.drawRouteAndMarkers(
      {
        map,
        events,
        routeCoords,
        eventOsrmIndices,
        activeEventIndex,
      },
      markerRefs,
      (index) => setActiveEventIndex(index),
      () => t,
      dateLocale,
      autoPaneMap,
      force,
    );
  }

  function handleRouteAnimation() {
    const map = mapRef.current;
    if (!map || !routeCoords.length || !eventOsrmIndices.length) return;

    animationService.animatePassedRoute(map, routeCoords, eventOsrmIndices, {
      fromIndex: prevActiveEventIndex.current,
      toIndex: activeEventIndex,
      duration: playSpeed,
    });
  }

  function handleArrowAnimation() {
    const map = mapRef.current;
    if (!map || !events.length || !eventOsrmIndices.length || !routeCoords.length) return;

    animationService.cancelAnimation(arrowAnimFrameRef);
    animationService.cleanupMarker(movingMarkerRef, mapRef.current);

    const currentIndex = prevActiveEventIndex.current;
    const nextIndex = activeEventIndex;
    const fromRouteIndex = eventOsrmIndices[currentIndex] ?? 0;
    const toRouteIndex = eventOsrmIndices[nextIndex] ?? 0;
    const fromCoord = routeCoords[fromRouteIndex];
    const toCoord = routeCoords[toRouteIndex];

    if (!fromCoord || !toCoord) return;

    const initialAngle =
      fromRouteIndex !== toRouteIndex
        ? calculateBearing(fromCoord, toCoord)
        : lastArrowAngleRef.current;

    if (fromRouteIndex !== toRouteIndex) {
      lastArrowAngleRef.current = initialAngle;
    }

    const { marker, element } = animationService.createArrowMarkerWithOffset(
      map,
      fromCoord,
      toCoord,
      fromRouteIndex,
      toRouteIndex,
      initialAngle,
      ANIMATION_CONFIG.ARROW_OFFSET_RATIO,
    );

    const tooltipGenerator = tooltipService.createTooltipGenerator(
      events[nextIndex],
      events,
      t,
      dateLocale,
    );
    markerManager.attachTooltip(element, tooltipGenerator, mapRef.current ?? undefined);

    movingMarkerRef.current = marker;

    if (fromRouteIndex !== toRouteIndex) {
      animationService.animateArrowMarker(routeCoords, {
        marker,
        element,
        fromIndex: fromRouteIndex,
        toIndex: toRouteIndex,
        duration: playSpeed,
        arrowAnimFrameRef,
        lastArrowAngleRef,
      });
    }
  }

  return (
    <div
      ref={mapContainerRef}
      id="maplibre-map"
      className="flex h-full w-full items-start justify-center"
    >
      {!tilesConfigured && (
        <div className="bg-background/70 font-family mobile:translate-x-0 z-6 flex h-16 translate-x-40 items-center justify-center gap-2 rounded-md p-4 text-lg">
          <Loader2 className="animate-spin" />
          <span>{t("common.loading")}</span>
        </div>
      )}
      {tilesConfigured && routeIsLoading && (
        <div className="bg-background/70 font-family mobile:translate-x-0 z-6 flex h-16 translate-x-40 items-center justify-center gap-2 rounded-md p-4 text-lg">
          <Loader2 className="animate-spin" />
          <span>{t("observe.loadingRoute")}</span>
        </div>
      )}
    </div>
  );
}
