import mapLibreGl from 'maplibre-gl'
import { Coordinate, ArrowAnimationParams, AnimationParams } from '../types'
import { RouteDrawer } from './route'
import { MarkerManager } from './marker'
import { calculateBearing, interpolate } from '../../utils'

/**
 * Animation service for route and marker animations
 */
export class AnimationService {
  private static instance: AnimationService
  private routeDrawer: RouteDrawer
  private markerManager: MarkerManager

  public static getInstance(): AnimationService {
    if (!AnimationService.instance) {
      AnimationService.instance = new AnimationService()
    }
    return AnimationService.instance
  }

  constructor() {
    this.routeDrawer = RouteDrawer.getInstance()
    this.markerManager = MarkerManager.getInstance()
  }

  /**
   * Animate the passed route progression
   */
  public animatePassedRoute(map: mapLibreGl.Map, routeCoords: Coordinate[], eventOsrmIndices: number[], params: AnimationParams): void {
    if (!map || !routeCoords.length || !eventOsrmIndices.length) return

    const run = () => {
      if (!map.isStyleLoaded()) return

      const { duration, fromIndex, toIndex } = params
      const fromRouteIndex = eventOsrmIndices[fromIndex] ?? 0
      const toRouteIndex = eventOsrmIndices[toIndex] ?? 0

      if (fromRouteIndex === toRouteIndex) {
        const passedCoords = routeCoords.slice(0, toRouteIndex + 1)
        this.routeDrawer.updatePassedRoute(map, routeCoords, passedCoords)
        return
      }

      const start = performance.now()

      const animate = (time: number) => {
        const t = Math.min((time - start) / duration, 1)
        const interpolatedIndex = interpolate(fromRouteIndex, toRouteIndex, t)

        const passedCoords = this.calculatePassedCoords(routeCoords, interpolatedIndex)
        this.routeDrawer.updatePassedRoute(map, routeCoords, passedCoords)

        if (t < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }

    if (map.isStyleLoaded()) {
      run()
      return
    }

    map.once("load", run)
  }

  /**
   * Animate arrow marker along the route
   */
  public animateArrowMarker(routeCoords: Coordinate[], eventOsrmIndices: number[], params: ArrowAnimationParams): void {
    const { marker, element, duration, fromIndex, toIndex, arrowAnimFrameRef, lastArrowAngleRef } = params

    if (!routeCoords || routeCoords.length < 2) return

    const start = performance.now()

    const animate = (time: number) => {
      const t = Math.min((time - start) / duration, 1)
      const interpolatedIndex = interpolate(fromIndex, toIndex, t)

      const { coordinate, angle } = this.calculateArrowPosition(routeCoords, interpolatedIndex, lastArrowAngleRef.current)

      if (coordinate) {
        const [lat, lng] = coordinate
        if (!isNaN(lat) && !isNaN(lng)) {
          marker.setLngLat([lng, lat])
          this.markerManager.updateArrowRotation(element, angle)
          lastArrowAngleRef.current = angle
        }
      }

      if (t < 1) {
        arrowAnimFrameRef.current = requestAnimationFrame(animate)
      }
    }

    arrowAnimFrameRef.current = requestAnimationFrame(animate)
  }

  /**
   * Calculate passed coordinates up to a given index
   */
  private calculatePassedCoords(routeCoords: Coordinate[], interpolatedIndex: number): Coordinate[] {
    const lowerIndex = Math.max(0, Math.min(routeCoords.length - 1, Math.floor(interpolatedIndex)))
    const upperIndex = Math.max(0, Math.min(routeCoords.length - 1, Math.ceil(interpolatedIndex)))
    const frac = interpolatedIndex - lowerIndex

    let lat = routeCoords[lowerIndex][0]
    let lng = routeCoords[lowerIndex][1]

    if (upperIndex !== lowerIndex && routeCoords[upperIndex]) {
      lat += (routeCoords[upperIndex][0] - routeCoords[lowerIndex][0]) * frac
      lng += (routeCoords[upperIndex][1] - routeCoords[lowerIndex][1]) * frac
    }

    const passedCoords = routeCoords.slice(0, lowerIndex + 1)
    passedCoords.push([lat, lng])

    return passedCoords
  }

  /**
   * Calculate arrow position and angle along the route
   */
  private calculateArrowPosition(
    routeCoords: Coordinate[],
    interpolatedIndex: number,
    fallbackAngle: number
  ): { coordinate: Coordinate | null; angle: number } {
    const lowerIndex = Math.max(0, Math.min(routeCoords.length - 1, Math.floor(interpolatedIndex)))
    const upperIndex = Math.max(0, Math.min(routeCoords.length - 1, Math.ceil(interpolatedIndex)))
    const frac = interpolatedIndex - lowerIndex

    let lat = routeCoords[lowerIndex][0]
    let lng = routeCoords[lowerIndex][1]
    let angle = fallbackAngle

    if (upperIndex !== lowerIndex) {
      lat += (routeCoords[upperIndex][0] - routeCoords[lowerIndex][0]) * frac
      lng += (routeCoords[upperIndex][1] - routeCoords[lowerIndex][1]) * frac
      angle = calculateBearing(routeCoords[lowerIndex], routeCoords[upperIndex])
    } else {
      // Try to get bearing from current point to the next available point
      const nextPointIndex = Math.min(lowerIndex + 1, routeCoords.length - 1)
      if (nextPointIndex > lowerIndex) {
        angle = calculateBearing(routeCoords[lowerIndex], routeCoords[nextPointIndex])
      }
    }

    return {
      coordinate: [lat, lng],
      angle,
    }
  }

  /**
   * Create arrow marker with initial position offset
   */
  public createArrowMarkerWithOffset(
    map: mapLibreGl.Map,
    fromCoord: Coordinate,
    toCoord: Coordinate,
    fromRouteIndex: number,
    toRouteIndex: number,
    initialAngle: number,
    offsetRatio: number = 0.1
  ): { marker: mapLibreGl.Marker; element: HTMLDivElement } {
    const element = this.markerManager.createArrowElement({
      angle: initialAngle,
      zIndex: 1001,
    })

    // Calculate initial position with offset
    let initialLat = fromCoord[0]
    let initialLng = fromCoord[1]

    if (fromRouteIndex !== toRouteIndex) {
      initialLat = fromCoord[0] + (toCoord[0] - fromCoord[0]) * offsetRatio
      initialLng = fromCoord[1] + (toCoord[1] - fromCoord[1]) * offsetRatio
    }

    const marker = new mapLibreGl.Marker({
      element,
      anchor: 'center',
    })
      .setLngLat([initialLng, initialLat] as [number, number])
      .addTo(map)

    return { marker, element }
  }

  /**
   * Cancel animation frame if it exists
   */
  public cancelAnimation(animFrameRef: React.MutableRefObject<number | null>): void {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
  }

  /**
   * Clean up marker
   */
  public cleanupMarker(markerRef: React.MutableRefObject<mapLibreGl.Marker | null>, map: mapLibreGl.Map | null): void {
    if (markerRef.current && map) {
      markerRef.current.remove()
      markerRef.current = null
    }
  }
}
