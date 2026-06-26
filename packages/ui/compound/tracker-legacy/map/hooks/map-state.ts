import { useRef, useState, useEffect } from "react";
import mapLibreGl from "maplibre-gl";
import { useTrackerStore } from "../../store";
import { mapEventsToOsrmIndices } from "../../utils";
import { MapRefs, MapState } from "../types";

export const useMapState = (): MapRefs & MapState => {
  const events = useTrackerStore((state) => state.events);
  const routeCoords = useTrackerStore((state) => state.routeCoords);
  const activeEventIndex = useTrackerStore((state) => state.activeEventIndex);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapLibreGl.Map | null>(null);
  const markerRefs = useRef<mapLibreGl.Marker[]>([]);
  const movingMarkerRef = useRef<mapLibreGl.Marker | null>(null);
  const arrowAnimFrameRef = useRef<number | null>(null);
  const prevActiveEventIndex = useRef<number>(activeEventIndex);
  const lastArrowAngleRef = useRef<number>(0);

  const [eventOsrmIndices, setEventOsrmIndices] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    const indices =
      routeCoords.length && events.length
        ? mapEventsToOsrmIndices(events, routeCoords)
        : [];
    setEventOsrmIndices(indices);
  }, [routeCoords, events]);

  useEffect(() => {
    if (mapRef.current && !mapReady) {
      setIsInitialized(true);
      setMapReady(true);
      const map = mapRef.current;

      const handleStyleData = () => setIsStyleLoaded(true);
      const handleStyleLoad = () =>
        setIsStyleLoaded(map.isStyleLoaded() || false);

      map.on("styledata", handleStyleData);
      map.on("load", handleStyleLoad);

      return () => {
        map.off("styledata", handleStyleData);
        map.off("load", handleStyleLoad);
      };
    }
  }, [mapReady]);

  useEffect(() => {
    return () => {
      if (arrowAnimFrameRef.current !== null) {
        cancelAnimationFrame(arrowAnimFrameRef.current);
        arrowAnimFrameRef.current = null;
      }
      if (movingMarkerRef.current && mapRef.current) {
        movingMarkerRef.current.remove();
        movingMarkerRef.current = null;
      }
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
    };
  }, []);

  return {
    mapContainerRef,
    mapRef,
    markerRefs,
    movingMarkerRef,
    arrowAnimFrameRef,
    prevActiveEventIndex,
    lastArrowAngleRef,
    isInitialized,
    isStyleLoaded,
    eventOsrmIndices,
  };
};
