import mapLibreGl from 'maplibre-gl'
import { MAP_CONFIG } from '../config/constants'
import { createMapControl, CustomControl } from '../controls'
import { trackerStore } from '../../store'
import { resolveMapStyle } from '../utils/resolve-map-style'

// Global flag to track RTL plugin initialization across component mounts
let globalRTLInitialized = false

/**
 * Map initialization and style management service
 */
export class MapInitializer {
  private static instance: MapInitializer

  public static getInstance(): MapInitializer {
    if (!MapInitializer.instance) {
      MapInitializer.instance = new MapInitializer()
    }
    return MapInitializer.instance
  }

  /**
   * Initialize RTL text plugin for Farsi/Arabic/Hebrew support
   */
  public initializeRTLSupport(): void {
    if (globalRTLInitialized) {
      trackerStore.getState().setRtlSet(true)
      return
    }

    if (typeof window === 'undefined' || !mapLibreGl.setRTLTextPlugin) {
      return
    }

    globalRTLInitialized = true

    mapLibreGl
      .setRTLTextPlugin('/mapbox-gl-rtl-text.js', true)
      .then(() => {
        trackerStore.getState().setRtlSet(true)
      })
      .catch((error) => {
        console.debug('RTL plugin already initialized:', error.message)
        trackerStore.getState().setRtlSet(true)
      })
  }

  /**
   * Create a new map instance
   */
  public createMap(container: HTMLDivElement, theme: 'light' | 'dark', onLoad?: () => void): mapLibreGl.Map {
    const { mapTiles } = trackerStore.getState();
    const tileUrl = theme === "dark" ? mapTiles.dark : mapTiles.light;

    if (!tileUrl) {
      throw new Error('Map tiles not configured')
    }

    const style = resolveMapStyle(tileUrl)

    const center: [number, number] = MAP_CONFIG.CENTER_COORD

    const map = new mapLibreGl.Map({
      container,
      maxPitch: MAP_CONFIG.MAX_PITCH,
      renderWorldCopies: MAP_CONFIG.RENDER_WORLD_COPIES,
      style,
      center: [center[1], center[0]], // MapLibre expects [lng, lat]
      zoom: MAP_CONFIG.DEFAULT_ZOOM,
      attributionControl: MAP_CONFIG.ATTRIBUTION_CONTROL,
    })

    // Add load handler if provided
    if (onLoad) {
      map.on('load', onLoad)
    }

    // Add custom controls
    this.addCustomControls(map)

    return map
  }

  /**
   * Update map style
   */
  public updateMapStyle(map: mapLibreGl.Map, theme: 'light' | 'dark', onStyleLoad?: () => void): void {
    const { mapTiles } = trackerStore.getState();
    const tileUrl = theme === "dark" ? mapTiles.dark : mapTiles.light;

    if (!tileUrl) {
      return
    }

    map.setStyle(resolveMapStyle(tileUrl))

    if (onStyleLoad) {
      map.once('styledata', onStyleLoad)
    }
  }

  /**
   * Add custom controls to the map
   */
  private addCustomControls(map: mapLibreGl.Map): void {
    // Only add controls if they don't already exist
    if (!map._controls || map._controls.length === 0) {
      map.addControl(createMapControl(CustomControl), 'top-right')
    }
  }

  /**
   * Check if map is ready for operations
   */
  public isMapReady(map: mapLibreGl.Map | null): boolean {
    return map !== null && (map.isStyleLoaded() || false)
  }

  /**
   * Get the center coordinates
   */
  public getCenterCoordinates(): [number, number] {
    return MAP_CONFIG.CENTER_COORD
  }

  /**
   * Safely remove map instance
   */
  public destroyMap(map: mapLibreGl.Map): void {
    try {
      map.remove()
    } catch (error) {
      console.warn('Error destroying map:', error)
    }
  }
}
