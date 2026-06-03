import mapLibreGl from 'maplibre-gl'
import { Event } from '../../types'

/**
 * Core map types and interfaces
 */

// === Map Reference Types ===
export interface MapRefs {
  mapContainerRef: React.RefObject<HTMLDivElement>
  mapRef: React.RefObject<mapLibreGl.Map | null>
  markerRefs: React.MutableRefObject<mapLibreGl.Marker[]>
  movingMarkerRef: React.MutableRefObject<mapLibreGl.Marker | null>
  arrowAnimFrameRef: React.MutableRefObject<number | null>
  prevActiveEventIndex: React.MutableRefObject<number>
  lastArrowAngleRef: React.MutableRefObject<number>
}

// === Coordinate Types ===
export type Coordinate = [number, number] // [lat, lng]
export type LngLat = [number, number] // [lng, lat]

// === Animation Types ===
export interface AnimationParams {
  duration: number
  fromIndex: number
  toIndex: number
}

export interface ArrowAnimationParams extends AnimationParams {
  marker: mapLibreGl.Marker
  element: HTMLDivElement
  arrowAnimFrameRef: React.MutableRefObject<number | null>
  lastArrowAngleRef: React.MutableRefObject<number>
}

// === Tooltip Types ===
export interface TooltipConfig {
  hideDelay: number
  position: 'top' | 'bottom' | 'left' | 'right'
}

// === Map Layer Types ===
export interface RouteLayerConfig {
  id: string
  color: string
  width: number
  sourceId: string
}

// === Marker Types ===
export interface MarkerConfig {
  size: number
  borderWidth: number
  isActive: boolean
  event: Event
}

export interface ArrowMarkerConfig {
  angle: number
  zIndex: number
}

// === Map State Types ===
export interface MapState {
  isInitialized: boolean
  isStyleLoaded: boolean
  eventOsrmIndices: number[]
}

// === Event Handler Types ===
export type EventClickHandler = (eventIndex: number) => void
export type TooltipContentGenerator = () => string

// === Utility Function Types ===
export type BearingCalculator = (from: Coordinate, to: Coordinate) => number
export type EventFilter = (events: Event[]) => Event[]
export type CoordinateTransformer = (coord: Coordinate) => LngLat

// === Map Drawing Types ===
export interface DrawingContext {
  map: mapLibreGl.Map
  events: Event[]
  routeCoords: Coordinate[]
  eventOsrmIndices: number[]
  activeEventIndex: number
}

// === Map Controls Types ===
export interface MapControlsConfig {
  enableZoom: boolean
  enableCompass: boolean
  enableFullscreen: boolean
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}
