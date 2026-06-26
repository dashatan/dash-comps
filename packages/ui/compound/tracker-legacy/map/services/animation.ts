import mapLibreGl from "maplibre-gl";
import type {
  Coordinate,
  ArrowAnimationParams,
  AnimationParams,
} from "../types";
import { RouteDrawer } from "./route";
import { MarkerManager } from "./marker";
import { calculateBearing, interpolate } from "../../utils";

export class AnimationService {
  private static instance: AnimationService;
  private routeDrawer: RouteDrawer;
  private markerManager: MarkerManager;

  public static getInstance(): AnimationService {
    if (!AnimationService.instance) {
      AnimationService.instance = new AnimationService();
    }
    return AnimationService.instance;
  }

  constructor() {
    this.routeDrawer = RouteDrawer.getInstance();
    this.markerManager = MarkerManager.getInstance();
  }

  public animatePassedRoute(
    map: mapLibreGl.Map,
    routeCoords: Coordinate[],
    eventOsrmIndices: number[],
    params: AnimationParams,
  ): void {
    if (!map || !routeCoords.length || !eventOsrmIndices.length) return;
    if (!map.isStyleLoaded()) return;

    const { duration, fromIndex, toIndex } = params;
    const fromRouteIndex = eventOsrmIndices[fromIndex] ?? 0;
    const toRouteIndex = eventOsrmIndices[toIndex] ?? 0;

    if (fromRouteIndex === undefined || toRouteIndex === undefined) return;

    const start = performance.now();

    const animate = (time: number) => {
      const t = Math.min((time - start) / duration, 1);
      const interpolatedIndex = interpolate(fromRouteIndex, toRouteIndex, t);

      const passedCoords = this.calculatePassedCoords(
        routeCoords,
        interpolatedIndex,
      );
      this.routeDrawer.updatePassedRoute(map, routeCoords, passedCoords);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  public animateArrowMarker(
    routeCoords: Coordinate[],
    params: ArrowAnimationParams,
  ): void {
    const {
      marker,
      element,
      duration,
      fromIndex,
      toIndex,
      arrowAnimFrameRef,
      lastArrowAngleRef,
    } = params;

    if (!routeCoords || routeCoords.length < 2) return;

    const start = performance.now();

    const animate = (time: number) => {
      const t = Math.min((time - start) / duration, 1);
      const interpolatedIndex = interpolate(fromIndex, toIndex, t);

      const { coordinate, angle } = this.calculateArrowPosition(
        routeCoords,
        interpolatedIndex,
        lastArrowAngleRef.current,
      );

      if (coordinate) {
        const [lat, lng] = coordinate;
        if (!isNaN(lat) && !isNaN(lng)) {
          marker.setLngLat([lng, lat]);
          this.markerManager.updateArrowRotation(element, angle);
          lastArrowAngleRef.current = angle;
        }
      }

      if (t < 1) {
        arrowAnimFrameRef.current = requestAnimationFrame(animate);
      }
    };

    arrowAnimFrameRef.current = requestAnimationFrame(animate);
  }

  private calculatePassedCoords(
    routeCoords: Coordinate[],
    interpolatedIndex: number,
  ): Coordinate[] {
    const lowerIndex = Math.max(
      0,
      Math.min(routeCoords.length - 1, Math.floor(interpolatedIndex)),
    );
    const upperIndex = Math.max(
      0,
      Math.min(routeCoords.length - 1, Math.ceil(interpolatedIndex)),
    );
    const frac = interpolatedIndex - lowerIndex;

    let lat = routeCoords[lowerIndex][0];
    let lng = routeCoords[lowerIndex][1];

    if (upperIndex !== lowerIndex && routeCoords[upperIndex]) {
      lat += (routeCoords[upperIndex][0] - routeCoords[lowerIndex][0]) * frac;
      lng += (routeCoords[upperIndex][1] - routeCoords[lowerIndex][1]) * frac;
    }

    const passedCoords = routeCoords.slice(0, lowerIndex + 1);
    passedCoords.push([lat, lng]);

    return passedCoords;
  }

  private calculateArrowPosition(
    routeCoords: Coordinate[],
    interpolatedIndex: number,
    fallbackAngle: number,
  ): { coordinate: Coordinate | null; angle: number } {
    const lowerIndex = Math.max(
      0,
      Math.min(routeCoords.length - 1, Math.floor(interpolatedIndex)),
    );
    const upperIndex = Math.max(
      0,
      Math.min(routeCoords.length - 1, Math.ceil(interpolatedIndex)),
    );
    const frac = interpolatedIndex - lowerIndex;

    let lat = routeCoords[lowerIndex][0];
    let lng = routeCoords[lowerIndex][1];
    let angle = fallbackAngle;

    if (upperIndex !== lowerIndex) {
      lat += (routeCoords[upperIndex][0] - routeCoords[lowerIndex][0]) * frac;
      lng += (routeCoords[upperIndex][1] - routeCoords[lowerIndex][1]) * frac;
      angle = calculateBearing(
        routeCoords[lowerIndex],
        routeCoords[upperIndex],
      );
    } else {
      const nextPointIndex = Math.min(lowerIndex + 1, routeCoords.length - 1);
      if (nextPointIndex > lowerIndex) {
        angle = calculateBearing(
          routeCoords[lowerIndex],
          routeCoords[nextPointIndex],
        );
      }
    }

    return {
      coordinate: [lat, lng],
      angle,
    };
  }

  public createArrowMarkerWithOffset(
    map: mapLibreGl.Map,
    fromCoord: Coordinate,
    toCoord: Coordinate,
    fromRouteIndex: number,
    toRouteIndex: number,
    initialAngle: number,
    offsetRatio: number = 0.1,
  ): { marker: mapLibreGl.Marker; element: HTMLDivElement } {
    const element = this.markerManager.createArrowElement({
      angle: initialAngle,
      zIndex: 1001,
    });

    let initialLat = fromCoord[0];
    let initialLng = fromCoord[1];

    if (fromRouteIndex !== toRouteIndex) {
      initialLat = fromCoord[0] + (toCoord[0] - fromCoord[0]) * offsetRatio;
      initialLng = fromCoord[1] + (toCoord[1] - fromCoord[1]) * offsetRatio;
    }

    const marker = new mapLibreGl.Marker({
      element,
      anchor: "center",
    })
      .setLngLat([initialLng, initialLat] as [number, number])
      .addTo(map);

    return { marker, element };
  }

  public cancelAnimation(animFrameRef: React.RefObject<number | null>): void {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }

  public cleanupMarker(
    markerRef: React.RefObject<mapLibreGl.Marker | null>,
    map: mapLibreGl.Map | null,
  ): void {
    if (markerRef.current && map) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }
}
