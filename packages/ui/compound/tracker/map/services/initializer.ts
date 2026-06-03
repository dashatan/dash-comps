import mapLibreGl from 'maplibre-gl'
import { MAP_CONFIG } from '../config/constants'
import { createMapControl, CustomControl } from '../controls'
import { trackerStore } from '../../store'

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
    // Check global flag first to prevent multiple calls
    if (typeof window !== 'undefined' && mapLibreGl.setRTLTextPlugin && !globalRTLInitialized) {
      try {
        mapLibreGl
          .setRTLTextPlugin('/mapbox-gl-rtl-text.js', true)
          .then(() => {
            globalRTLInitialized = true
            trackerStore.getState().setRtlSet(true)
          })
          .catch((error) => {
            // Plugin may already be set - this is expected behavior
            console.debug('RTL plugin already initialized:', error.message)
            globalRTLInitialized = true
            trackerStore.getState().setRtlSet(true)
          })
      } catch (error) {
        // Plugin may already be set - this is expected behavior
        console.debug('RTL plugin already initialized:', error)
        globalRTLInitialized = true
        trackerStore.getState().setRtlSet(true)
      }
    } else if (globalRTLInitialized) {
      // Plugin already initialized, just update the signal
      trackerStore.getState().setRtlSet(true)
    }
  }

  /**
   * Create a new map instance
   */
  public createMap(container: HTMLDivElement, theme: 'light' | 'dark', onLoad?: () => void): mapLibreGl.Map {
    const { mapTiles } = trackerStore.getState();
    const style = theme === "dark" ? mapTiles.dark : mapTiles.light;

    // Validate that we have a valid style URL
    if (!style) {
      console.warn('Map tiles not configured yet, using fallback style')
      // Use a fallback style or wait for proper configuration
      throw new Error('Map tiles not configured')
    }

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
    const style = theme === "dark" ? mapTiles.dark : mapTiles.light;

    // Validate that we have a valid style URL
    if (!style) {
      console.warn('Map tiles not configured yet, skipping style update')
      return
    }

    map.setStyle(style)

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
