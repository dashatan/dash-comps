import { Event } from '@/components/compound/tracker/types'
import { Coordinate, LngLat, BearingCalculator, EventFilter, CoordinateTransformer } from '@/components/compound/tracker/map/types'

export function makeOsrmCoordString(events?: Event[]) {
  if (!events?.length) return

  const validEvents = events.filter(
    (event) =>
      event?.latlng &&
      Array.isArray(event.latlng) &&
      event.latlng.length === 2 &&
      typeof event.latlng[0] === 'number' &&
      typeof event.latlng[1] === 'number' &&
      !isNaN(event.latlng[0]) &&
      !isNaN(event.latlng[1])
  )
  if (validEvents.length < 2) return

  let sampledEvents = validEvents

  const coordString = sampledEvents
    .map((e) => `${e.latlng[1]},${e.latlng[0]}`) // [lng,lat]
    .join(';')
  return coordString
}

// Helper: Map each event to the closest OSRM route index
export function mapEventsToOsrmIndices(events: Event[], osrmRoute: [number, number][]) {
  if (!osrmRoute.length || !events.length) return []
  const osrmIndices: number[] = []
  let lastMinIndex = 0 // Keep track of the last found index to ensure forward progression

  events.forEach((event) => {
    let minDist = Infinity
    let minIndex = lastMinIndex // Start search from the last found index

    for (let i = lastMinIndex; i < osrmRoute.length; i++) {
      const d = Math.hypot(event.latlng[0] - osrmRoute[i][0], event.latlng[1] - osrmRoute[i][1])
      if (d < minDist) {
        minDist = d
        minIndex = i
      }
    }
    osrmIndices.push(minIndex)
    lastMinIndex = minIndex // Update lastMinIndex for the next event
  })
  return osrmIndices
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

/**
 * Map utility functions
 */

// === Coordinate Utilities ===

/**
 * Convert [lat, lng] to [lng, lat] for MapLibre
 */
export const coordinateToLngLat: CoordinateTransformer = ([lat, lng]) => [lng, lat]

/**
 * Convert [lng, lat] to [lat, lng] from MapLibre
 */
export const lngLatToCoordinate = ([lng, lat]: LngLat): Coordinate => [lat, lng]

// === Bearing Calculation ===

/**
 * Calculate bearing between two coordinates
 */
export const calculateBearing: BearingCalculator = (from, to) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const toDeg = (rad: number) => (rad * 180) / Math.PI

  const lat1 = toRad(from[0])
  const lat2 = toRad(to[0])
  const dLon = toRad(to[1] - from[1])

  const y = Math.sin(dLon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)

  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

// === Event Validation ===

/**
 * Filter valid events with proper coordinates
 */
export const getValidEvents: EventFilter = (eventsArr) => {
  return eventsArr.filter(
    (event) =>
      event?.latlng &&
      Array.isArray(event.latlng) &&
      event.latlng.length === 2 &&
      typeof event.latlng[0] === 'number' &&
      typeof event.latlng[1] === 'number' &&
      !isNaN(event.latlng[0]) &&
      !isNaN(event.latlng[1])
  )
}

// === Data Processing ===

/**
 * Group traffics by device ID
 */
export const groupTrafficsByDevice = (traffics: any[]): Map<number, any[]> => {
  const deviceGroups = new Map<number, any[]>()

  for (const traffic of traffics) {
    if (!traffic.device?.id) continue

    const deviceId = traffic.device.id
    if (!deviceGroups.has(deviceId)) {
      deviceGroups.set(deviceId, [])
    }
    deviceGroups.get(deviceId)!.push(traffic)
  }

  return deviceGroups
}

// === Animation Utilities ===

/**
 * Interpolate between two values
 */
export const interpolate = (start: number, end: number, t: number): number => {
  return start + (end - start) * t
}

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculate interpolated coordinate between two points
 */
export const interpolateCoordinate = (from: Coordinate, to: Coordinate, t: number): Coordinate => {
  const lat = interpolate(from[0], to[0], t)
  const lng = interpolate(from[1], to[1], t)
  return [lat, lng]
}

// === Validation Utilities ===

/**
 * Check if coordinate is valid
 */
export const isValidCoordinate = (coord: any): coord is Coordinate => {
  return Array.isArray(coord) && coord.length === 2 && typeof coord[0] === 'number' && typeof coord[1] === 'number' && !isNaN(coord[0]) && !isNaN(coord[1])
}

/**
 * Check if coordinates array is valid
 */
export const areValidCoordinates = (coords: any[]): coords is Coordinate[] => {
  return Array.isArray(coords) && coords.every(isValidCoordinate)
}

// === Distance Calculation ===

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (from: Coordinate, to: Coordinate): number => {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (from[0] * Math.PI) / 180
  const φ2 = (to[0] * Math.PI) / 180
  const Δφ = ((to[0] - from[0]) * Math.PI) / 180
  const Δλ = ((to[1] - from[1]) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

// === Export all utilities ===
export {
  calculateBearing as getBearing, // Alias for backward compatibility
}
