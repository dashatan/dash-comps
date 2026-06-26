import mapLibreGl from "maplibre-gl";
import cctvIconUrl from "../components/cctv.svg";

const provinces = {
  97000000: { name: "گلستان", lat: 37.289, long: 55.16 },
  95000000: { name: "بوشهر", lat: 28.922, long: 50.835 },
  14000000: { name: "قم", lat: 34.639, long: 50.875 },
  75000000: { name: "همدان", lat: 34.798, long: 48.515 },
  91000000: { name: "اردبیل", lat: 38.249, long: 48.297 },
  26000000: { name: "آذربایجان شرقی", lat: 38.066, long: 46.299 },
  62000000: { name: "ایرانشهر", lat: 27.205, long: 60.684 },
  45000000: { name: "کرمان", lat: 30.283, long: 57.083 },
  31000000: { name: "خراسان رضوی", lat: 36.297, long: 59.606 },
  64000000: { name: "هرمزگان", lat: 27.183, long: 56.267 },
  21000000: { name: "اصفهان", lat: 32.653, long: 51.667 },
  93000000: { name: "یزد", lat: 31.897, long: 54.367 },
  33000000: { name: "خراسان جنوبی", lat: 32.866, long: 59.217 },
  51000000: { name: "مرکزی", lat: 34.097, long: 49.698 },
  81000000: { name: "لرستان", lat: 33.466, long: 48.35 },
  45000001: { name: "کرمان جنوب", lat: 28.95, long: 57.77 },
  41000000: { name: "فارس", lat: 29.617, long: 52.538 },
  67000000: { name: "زنجان", lat: 36.676, long: 48.478 },
  18000000: { name: "البرز", lat: 35.83, long: 50.991 },
  77000000: { name: "چهارمحال و بختیاری", lat: 32.327, long: 50.864 },
  15000000: { name: "قزوین", lat: 36.274, long: 49.998 },
  32000000: { name: "خراسان شمالی", lat: 37.476, long: 57.331 },
  36000000: { name: "خوزستان", lat: 31.318, long: 48.67 },
  61000000: { name: "سیستان وبلوچستان", lat: 29.495, long: 60.863 },
  87000000: { name: "سمنان", lat: 35.577, long: 53.392 },
  54000000: { name: "گیلان", lat: 37.28, long: 49.583 },
  85000000: { name: "کهگیلویه و بویراحمد", lat: 30.65, long: 51.583 },
  16000000: { name: "مازندران", lat: 36.565, long: 53.058 },
  57000000: { name: "آذربایجان غربی", lat: 37.555, long: 45.073 },
  73000000: { name: "کردستان", lat: 35.311, long: 46.996 },
  83000000: { name: "ایلام", lat: 33.637, long: 46.422 },
  71000000: { name: "کرمانشاه", lat: 34.314, long: 47.065 },
  11000000: { name: "تهران", lat: 35.689, long: 51.389 },
};

type ClusterPoint = {
  id: string | number;
  lng: number;
  lat: number;
  properties?: Record<string, any>;
};

type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: { type: "Point"; coordinates: [number, number] };
    properties: Record<string, any>;
  }>;
};

const SOURCE_ID = "cluster-points";
const SOURCE_ID_LOW_ZOOM = "cluster-points-low-zoom"; // Custom clustering for low zoom
const LAYER_CLUSTER = "cluster-points";
const LAYER_CLUSTER_COUNT = "cluster-points-count";
const LAYER_UNCLUSTERED = "cluster-points-unclustered";
const LAYER_LOW_ZOOM = "cluster-points-low-zoom"; // Custom clustering layer
const LAYER_LOW_ZOOM_COUNT = "cluster-points-low-zoom-count";

/**
 * Service to manage cluster points on map
 */
export class ClusterPointsService {
  private static instance: ClusterPointsService;
  private provinceSourceIds: Set<string> = new Set();
  private provinceLayerIds: Set<string> = new Set();
  private onDeviceClickCallback?: (
    deviceId: number,
    deviceName?: string,
    location?: { lat: number; lng: number },
  ) => void;

  public static getInstance(): ClusterPointsService {
    if (!ClusterPointsService.instance) {
      ClusterPointsService.instance = new ClusterPointsService();
    }
    return ClusterPointsService.instance;
  }

  public setOnDeviceClick(
    callback?: (
      deviceId: number,
      deviceName?: string,
      location?: { lat: number; lng: number },
    ) => void,
  ): void {
    this.onDeviceClickCallback = callback;
  }

  /**
   * Convert points to GeoJSON format.
   * When weightField is set, each feature gets a numeric "weight" from that property (default 1) for cluster aggregation.
   */
  private pointsToGeoJSON(
    points: ClusterPoint[],
    weightField?: string,
  ): GeoJSONFeatureCollection {
    return {
      type: "FeatureCollection",
      features: points.map((point) => {
        const weight = weightField
          ? point.properties?.[weightField] != null
            ? Number(point.properties[weightField])
            : 1
          : 1;
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [point.lng, point.lat],
          },
          properties: {
            id: point.id,
            weight: Number.isFinite(weight) ? weight : 1,
            ...point.properties,
          },
        };
      }),
    };
  }

  /**
   * Custom clustering for low zoom - aggregate points by grid
   */
  private createCustomClusters(
    points: ClusterPoint[],
    gridSize: number = 2,
  ): GeoJSONFeatureCollection {
    // Group points by grid cells
    const gridMap = new Map<
      string,
      { count: number; lng: number; lat: number; ids: (string | number)[] }
    >();

    points.forEach((point) => {
      const stateId = point.properties?.state_id;
      // if (!stateId) {
      //   // Fallback: use grid-based clustering if state_id is missing
      //   const gridLng = Math.floor(point.lng / gridSize) * gridSize
      //   const gridLat = Math.floor(point.lat / gridSize) * gridSize
      //   const key = `grid_${gridLng}_${gridLat}`

      //   if (!gridMap.has(key)) {
      //     gridMap.set(key, {
      //       count: 0,
      //       lng: gridLng + gridSize / 2,
      //       lat: gridLat + gridSize / 2,
      //       ids: [],
      //     })
      //   }
      //   const cell = gridMap.get(key)!
      //   cell.count++
      //   cell.ids.push(point.id)
      //   return
      // }

      // Use state_id for clustering
      const stateIdNum =
        typeof stateId === "string" ? Number(stateId) : stateId;
      const key = `${stateIdNum}`;
      const province = provinces[stateIdNum as keyof typeof provinces];

      if (!province) {
        console.warn(`Province not found for state_id: ${stateId}`);
        return;
      }

      if (!gridMap.has(key)) {
        gridMap.set(key, {
          count: 0,
          lng: province.long,
          lat: province.lat,
          ids: [],
        });
      }
      const cell = gridMap.get(key)!;
      cell.count++;
      cell.ids.push(point.id);
    });

    // points.forEach((point) => {
    // Create grid key based on rounded coordinates
    //   const gridLng = Math.floor(point.lng / gridSize) * gridSize
    //   const gridLat = Math.floor(point.lat / gridSize) * gridSize
    //   const key = `${gridLng}_${gridLat}`

    //   if (!gridMap.has(key)) {
    //     gridMap.set(key, {
    //       count: 0,
    //       lng: gridLng + gridSize / 2, // Center of grid cell
    //       lat: gridLat + gridSize / 2,
    //       ids: [],
    //     })
    //   }

    //   const cell = gridMap.get(key)!
    //   cell.count++
    //   cell.ids.push(point.id)
    // })

    console.log(
      `[Custom Clustering] Created ${gridMap.size} clusters from ${points.length} points, gridSize=${gridSize.toFixed(2)}`,
    );

    // Convert to GeoJSON
    const features = Array.from(gridMap.entries()).map(([key, cell]) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [cell.lng, cell.lat] as [number, number],
      },
      properties: {
        count: cell.count,
        ids: cell.ids,
        gridKey: key,
      },
    }));

    return {
      type: "FeatureCollection",
      features,
    };
  }

  /**
   * Set cluster points data on map.
   * @param weightField - Optional property key (e.g. "traffic_count"). When set, each point is weighted by that value for cluster aggregation and labels; otherwise each point counts as 1.
   */
  public setData(
    map: mapLibreGl.Map,
    points: ClusterPoint[],
    currentZoom?: number,
    fitBounds: boolean = false,
    weightField?: string,
  ): void {
    if (!map.isStyleLoaded()) return;

    if (!points.length) return;

    const zoom = currentZoom ?? map.getZoom();
    const LOW_ZOOM_THRESHOLD = 8;
    const useCustomClustering = zoom < LOW_ZOOM_THRESHOLD;

    console.log(
      `Setting data: zoom=${zoom}, useCustomClustering=${useCustomClustering}, points=${points.length}, weightField=${weightField ?? "none"}`,
    );

    // Only remove layers if switching between clustering modes
    const hasBuiltInLayers = map.getLayer(LAYER_CLUSTER) !== undefined;
    const hasProvinceLayers = this.provinceLayerIds.size > 0;

    // Hide old layers immediately before switching for smoother transition
    if (useCustomClustering && hasBuiltInLayers) {
      // Switching from built-in to custom - hide built-in layers first
      this.updateLayersVisibility(map, zoom);
      // Then remove built-in layers
      this.removeLayers(map);
    } else if (!useCustomClustering && hasProvinceLayers) {
      // Switching from custom to built-in - hide province layers first
      this.updateLayersVisibility(map, zoom);
      // Then remove province layers
      this.removeLowZoomLayers(map);
    }

    if (useCustomClustering) {
      // Use custom clustering for low zoom
      this.setCustomClusteringData(map, points, zoom, weightField);
    } else {
      // Use MapLibre built-in clustering for high zoom
      this.setBuiltInClusteringData(map, points, weightField);
    }

    // Fit bounds only if explicitly requested (e.g., initial load)
    if (fitBounds && points.length > 0) {
      const bounds = new mapLibreGl.LngLatBounds();
      points.forEach((point) => bounds.extend([point.lng, point.lat]));
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12,
      });
    }
  }

  /**
   * Set built-in MapLibre clustering (for high zoom).
   * When weightField is set, cluster label shows sum of that property; otherwise point count.
   */
  private setBuiltInClusteringData(
    map: mapLibreGl.Map,
    points: ClusterPoint[],
    weightField?: string,
  ): void {
    const geoJsonData = this.pointsToGeoJSON(points, weightField);

    const clusterSourceOptions: mapLibreGl.GeoJSONSourceSpecification = {
      type: "geojson",
      data: geoJsonData as any,
      cluster: true,
      clusterMaxZoom: 10,
      clusterRadius: 100,
      clusterProperties: {
        weight_sum: ["+", ["get", "weight"]],
      },
    };

    const existingSource = map.getSource(SOURCE_ID) as
      | mapLibreGl.GeoJSONSource
      | undefined;
    if (existingSource) {
      existingSource.setData(geoJsonData as any);
    } else {
      map.addSource(SOURCE_ID, clusterSourceOptions);
    }

    if (!map.getLayer(LAYER_CLUSTER)) {
      map.addLayer({
        id: LAYER_CLUSTER,
        type: "circle",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#6C63FF",
          "circle-opacity": 0.8,
          "circle-radius": 25,
        },
      });
    }

    const clusterCountTextField = weightField
      ? ["to-string", ["get", "weight_sum"]]
      : "{point_count_abbreviated}";

    if (!map.getLayer(LAYER_CLUSTER_COUNT)) {
      map.addLayer({
        id: LAYER_CLUSTER_COUNT,
        type: "symbol",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        layout: {
          "text-field": clusterCountTextField as any,
          "text-font": ["NotoSansArabic-Regular"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });
    } else {
      map.setLayoutProperty(
        LAYER_CLUSTER_COUNT,
        "text-field",
        clusterCountTextField as any,
      );
    }

    // Add unclustered points with custom camera marker (circle + icon + triangle)
    const CAMERA_ICON_ID = "camera-marker";
    const CAMERA_ICON_URL = cctvIconUrl;

    // Helper function to create custom marker with circle, icon, and triangle
    const createCustomMarker = (
      cameraIcon: HTMLImageElement,
    ): HTMLImageElement => {
      const padding = 4; // Padding around marker
      const circleRadius = 16;
      const triangleHeight = 14; // Triangle height (increased)
      const triangleWidth = 16; // Triangle base width (increased)
      const circleCenterX = padding + circleRadius; // X position of circle center
      const circleY = padding + circleRadius; // Y position of circle center

      // Calculate total size needed
      const totalHeight = padding + circleRadius * 2 + triangleHeight + padding;
      const totalWidth = padding + circleRadius * 2 + padding;
      const size = Math.max(totalWidth, totalHeight);

      // Create canvas with enough space
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      // Clear canvas with transparent background
      ctx.clearRect(0, 0, size, size);

      // Draw triangle first (so it's behind the circle)
      // Triangle starts right below the circle
      const triangleTopY = circleY + circleRadius; // Top of triangle (touches circle bottom)
      const triangleBottomY = size - padding; // Bottom point (tip of pin)
      const triangleCenterX = circleCenterX; // Center aligned with circle

      ctx.fillStyle = "#6C63FF";
      ctx.beginPath();
      ctx.moveTo(triangleCenterX, triangleBottomY); // Bottom point (tip of pin)
      ctx.lineTo(triangleCenterX - triangleWidth / 2, triangleTopY); // Left point (touches circle)
      ctx.lineTo(triangleCenterX + triangleWidth / 2, triangleTopY); // Right point (touches circle)
      ctx.closePath();
      ctx.fill(); // Only fill, no stroke

      // Draw circle background (on top of triangle)
      ctx.fillStyle = "#6C63FF";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(circleCenterX, circleY, circleRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw camera icon on circle (on top of everything)
      const iconSize = 20;
      const iconX = circleCenterX - iconSize / 2;
      const iconY = circleY - iconSize / 2;
      ctx.drawImage(cameraIcon, iconX, iconY, iconSize, iconSize);

      // Convert canvas to image
      const markerImg = new Image();
      markerImg.src = canvas.toDataURL();
      return markerImg;
    };

    // Helper function to create icon layer
    const createIconLayer = () => {
      if (map.getLayer(LAYER_UNCLUSTERED)) {
        map.removeLayer(LAYER_UNCLUSTERED);
      }
      map.addLayer({
        id: LAYER_UNCLUSTERED,
        type: "symbol",
        source: SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        layout: {
          "icon-image": CAMERA_ICON_ID,
          "icon-size": 1,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-anchor": "bottom", // Anchor at bottom (triangle tip)
        },
      });
      console.log("[Camera Icon] Custom marker layer created");
    };

    // Helper function to create circle layer (fallback)
    const createCircleLayer = () => {
      if (map.getLayer(LAYER_UNCLUSTERED)) {
        map.removeLayer(LAYER_UNCLUSTERED);
      }
      map.addLayer({
        id: LAYER_UNCLUSTERED,
        type: "circle",
        source: SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#6C63FF",
          "circle-opacity": 0.9,
          "circle-radius": 10,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-opacity": 1,
        },
      });
      console.log("[Camera Icon] Circle layer created as fallback");
    };

    if (!map.getLayer(LAYER_UNCLUSTERED)) {
      // Check if custom marker already exists
      if (map.hasImage(CAMERA_ICON_ID)) {
        createIconLayer();
      } else {
        // Create circle layer first (immediate visibility)
        createCircleLayer();

        // Load camera icon and create custom marker
        const cameraImg = new Image();
        cameraImg.crossOrigin = "anonymous";
        cameraImg.onload = () => {
          try {
            // Create custom marker with circle, icon, and triangle
            const customMarker = createCustomMarker(cameraImg);

            customMarker.onload = () => {
              try {
                if (map.hasImage(CAMERA_ICON_ID)) {
                  map.removeImage(CAMERA_ICON_ID);
                }
                map.addImage(CAMERA_ICON_ID, customMarker);
                console.log("[Camera Icon] Custom marker created and added");
                createIconLayer();
              } catch (err) {
                console.error(
                  "[Camera Icon] Failed to add custom marker:",
                  err,
                );
              }
            };
          } catch (err) {
            console.error("[Camera Icon] Failed to create custom marker:", err);
          }
        };
        cameraImg.onerror = (error) => {
          console.error("[Camera Icon] Failed to load camera icon:", error);
          // Circle layer already exists, keep it
        };
        cameraImg.src = CAMERA_ICON_URL;
      }
    } else {
      // Layer exists, check if we need to upgrade from circle to custom marker
      const existingLayer = map.getLayer(LAYER_UNCLUSTERED);
      if (
        existingLayer &&
        existingLayer.type === "circle" &&
        map.hasImage(CAMERA_ICON_ID)
      ) {
        createIconLayer();
      }
    }
  }

  /**
   * Set custom clustering data (for low zoom) - one source per province.
   * When weightField is set, count is the sum of that property per province; otherwise number of points.
   */
  private setCustomClusteringData(
    map: mapLibreGl.Map,
    points: ClusterPoint[],
    zoom: number,
    weightField?: string,
  ): void {
    const pointsByProvince = new Map<number, ClusterPoint[]>();

    points.forEach((point) => {
      const stateId = point.properties?.state_id;
      if (!stateId) return;

      const stateIdNum =
        typeof stateId === "string" ? Number(stateId) : stateId;
      const province = provinces[stateIdNum as keyof typeof provinces];
      if (!province) return;

      if (!pointsByProvince.has(stateIdNum)) {
        pointsByProvince.set(stateIdNum, []);
      }
      pointsByProvince.get(stateIdNum)!.push(point);
    });

    pointsByProvince.forEach((provincePoints, stateId) => {
      const province = provinces[stateId as keyof typeof provinces];
      if (!province) return;

      const sourceId = `province-${stateId}`;
      const layerId = `province-${stateId}-layer`;
      const layerCountId = `province-${stateId}-count`;
      const count = weightField
        ? provincePoints.reduce(
            (sum, p) =>
              sum +
              (p.properties?.[weightField] != null
                ? Number(p.properties[weightField]) || 1
                : 1),
            0,
          )
        : provincePoints.length;
      const displayCount = Number.isFinite(count)
        ? Math.round(count)
        : provincePoints.length;

      const geoJsonData: GeoJSONFeatureCollection = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [province.long, province.lat],
            },
            properties: {
              count: displayCount,
              state_id: stateId,
              province_name: province.name,
            },
          },
        ],
      };

      // Add or update source
      const existingSource = map.getSource(sourceId) as
        | mapLibreGl.GeoJSONSource
        | undefined;
      if (existingSource) {
        existingSource.setData(geoJsonData as any);
      } else {
        try {
          map.addSource(sourceId, {
            type: "geojson",
            data: geoJsonData as any,
            cluster: false,
          });
          this.provinceSourceIds.add(sourceId);
        } catch (error) {
          console.error(`Failed to add source for province ${stateId}:`, error);
          return;
        }
      }

      // Add circle layer (only if doesn't exist) - same style as cluster circles
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-color": "#6C63FF",
            "circle-opacity": 0.8,
            "circle-radius": 25,
          },
        });
        this.provinceLayerIds.add(layerId);
      }

      // Add count label layer (only if doesn't exist) - same style as cluster count
      if (!map.getLayer(layerCountId)) {
        map.addLayer({
          id: layerCountId,
          type: "symbol",
          source: sourceId,
          layout: {
            "text-field": ["to-string", ["get", "count"]],
            "text-font": ["NotoSansArabic-Regular"],
            "text-size": 12,
          },
          paint: {
            "text-color": "#ffffff",
          },
        });
        this.provinceLayerIds.add(layerCountId);
      }
    });

    // Remove sources and layers for provinces that no longer have points
    const activeSourceIds = new Set(
      Array.from(pointsByProvince.keys()).map((id) => `province-${id}`),
    );

    // Remove inactive sources and layers
    this.provinceSourceIds.forEach((sourceId) => {
      if (!activeSourceIds.has(sourceId)) {
        try {
          const stateId = sourceId.replace("province-", "");
          const layerId = `province-${stateId}-layer`;
          const layerCountId = `province-${stateId}-count`;

          if (map.getLayer(layerId)) map.removeLayer(layerId);
          if (map.getLayer(layerCountId)) map.removeLayer(layerCountId);
          if (map.getSource(sourceId)) map.removeSource(sourceId);

          this.provinceLayerIds.delete(layerId);
          this.provinceLayerIds.delete(layerCountId);
          this.provinceSourceIds.delete(sourceId);
        } catch (error) {
          console.debug("Error removing province source:", error);
        }
      }
    });

    console.log(
      `[Province Sources] Created ${pointsByProvince.size} province sources from ${points.length} points`,
    );
  }

  /**
   * Update layers visibility based on zoom level
   * Low zoom (< 8): Show province sources
   * High zoom (>= 8): Show built-in MapLibre clusters
   * Note: MapLibre automatically updates clusters when zoom changes
   */
  public updateLayersVisibility(map: mapLibreGl.Map, zoom: number): void {
    if (!map.isStyleLoaded()) return;

    const LOW_ZOOM_THRESHOLD = 8;
    const showBuiltInClusters = zoom >= LOW_ZOOM_THRESHOLD;

    try {
      // Update built-in cluster layers visibility
      // MapLibre automatically reclusters on zoom, we just need to update visibility
      if (map.getLayer(LAYER_CLUSTER)) {
        map.setLayoutProperty(
          LAYER_CLUSTER,
          "visibility",
          showBuiltInClusters ? "visible" : "none",
        );
      }
      if (map.getLayer(LAYER_CLUSTER_COUNT)) {
        map.setLayoutProperty(
          LAYER_CLUSTER_COUNT,
          "visibility",
          showBuiltInClusters ? "visible" : "none",
        );
      }
      if (map.getLayer(LAYER_UNCLUSTERED)) {
        map.setLayoutProperty(
          LAYER_UNCLUSTERED,
          "visibility",
          showBuiltInClusters ? "visible" : "none",
        );
      }

      // Update province layers visibility
      this.provinceLayerIds.forEach((layerId) => {
        try {
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(
              layerId,
              "visibility",
              showBuiltInClusters ? "none" : "visible",
            );
          }
        } catch (error) {
          // Ignore errors for individual layers
        }
      });
    } catch (error) {
      // Layers might not exist yet
      console.debug("Layers not ready for visibility update:", error);
    }
  }

  /**
   * Attach click and hover handlers
   */
  public attachHandlers(map: mapLibreGl.Map): () => void {
    const handleClusterClick = (e: any) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [LAYER_CLUSTER],
      });
      if (!features.length) return;

      const currentZoom = map.getZoom();
      map.easeTo({
        center: e.lngLat,
        zoom: Math.min(currentZoom + 2, 18),
      });
    };

    const handlePointClick = (e: any) => {
      const feature = e.features?.[0];
      if (!feature) return;

      const coordinates = (
        feature.geometry as GeoJSON.Point
      )?.coordinates?.slice();
      const properties = feature.properties || {};
      const deviceId = properties.id || feature.id;
      const deviceName = properties.name || properties.CameraName || "";
      const lat = properties.lat || (coordinates && coordinates[1]);
      const lng = properties.lng || (coordinates && coordinates[0]);

      // Call the callback if provided
      if (this.onDeviceClickCallback && deviceId) {
        this.onDeviceClickCallback(
          deviceId,
          deviceName,
          lat && lng ? { lat, lng } : undefined,
        );
      }

      // Fly to the point
      if (coordinates && coordinates.length === 2) {
        map.flyTo({
          center: coordinates as [number, number],
          zoom: 15,
        });
      }
    };

    const setPointer = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const resetCursor = () => {
      map.getCanvas().style.cursor = "";
    };

    // Built-in cluster handlers
    map.on("click", LAYER_CLUSTER, handleClusterClick);
    map.on("click", LAYER_UNCLUSTERED, handlePointClick);
    map.on("mouseenter", LAYER_CLUSTER as any, setPointer);
    map.on("mouseleave", LAYER_CLUSTER as any, resetCursor);
    map.on("mouseenter", LAYER_UNCLUSTERED as any, setPointer);
    map.on("mouseleave", LAYER_UNCLUSTERED as any, resetCursor);

    // Province layer handlers - attach to all province layers
    const provinceClickHandlers: Array<{
      layerId: string;
      handler: (e: any) => void;
    }> = [];
    const provinceHoverHandlers: Array<{
      layerId: string;
      enter: () => void;
      leave: () => void;
    }> = [];

    this.provinceLayerIds.forEach((layerId) => {
      // Only attach to circle layers, not count layers
      if (layerId.endsWith("-layer")) {
        const clickHandler = (e: any) => {
          e.preventDefault();
          const currentZoom = map.getZoom();
          const targetZoom = Math.min(currentZoom + 2, 18);

          // Use flyTo with a duration to ensure smooth transition
          map.flyTo({
            center: e.lngLat,
            zoom: targetZoom,
            duration: 1000,
          });
        };
        map.on("click", layerId, clickHandler);
        provinceClickHandlers.push({ layerId, handler: clickHandler });

        map.on("mouseenter", layerId as any, setPointer);
        map.on("mouseleave", layerId as any, resetCursor);
        provinceHoverHandlers.push({
          layerId,
          enter: setPointer,
          leave: resetCursor,
        });
      }
    });

    // Return cleanup function
    return () => {
      try {
        map.off("click", LAYER_CLUSTER, handleClusterClick);
        map.off("click", LAYER_UNCLUSTERED, handlePointClick);
        map.off("mouseenter", LAYER_CLUSTER as any, setPointer);
        map.off("mouseleave", LAYER_CLUSTER as any, resetCursor);
        map.off("mouseenter", LAYER_UNCLUSTERED as any, setPointer);
        map.off("mouseleave", LAYER_UNCLUSTERED as any, resetCursor);

        // Cleanup province handlers
        provinceClickHandlers.forEach(({ layerId, handler }) => {
          map.off("click", layerId, handler);
        });
        provinceHoverHandlers.forEach(({ layerId, enter, leave }) => {
          map.off("mouseenter", layerId as any, enter);
          map.off("mouseleave", layerId as any, leave);
        });
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }

  /**
   * Remove built-in clustering layers and source
   */
  public removeLayers(map: mapLibreGl.Map): void {
    try {
      if (map.getLayer(LAYER_UNCLUSTERED)) map.removeLayer(LAYER_UNCLUSTERED);
      if (map.getLayer(LAYER_CLUSTER_COUNT))
        map.removeLayer(LAYER_CLUSTER_COUNT);
      if (map.getLayer(LAYER_CLUSTER)) map.removeLayer(LAYER_CLUSTER);
      if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
    } catch (error) {
      // Ignore if layers don't exist
    }
  }

  /**
   * Remove province layers and sources
   */
  private removeLowZoomLayers(map: mapLibreGl.Map): void {
    try {
      // Remove all province layers
      this.provinceLayerIds.forEach((layerId) => {
        try {
          if (map.getLayer(layerId)) map.removeLayer(layerId);
        } catch (error) {
          // Ignore individual errors
        }
      });

      // Remove all province sources
      this.provinceSourceIds.forEach((sourceId) => {
        try {
          if (map.getSource(sourceId)) map.removeSource(sourceId);
        } catch (error) {
          // Ignore individual errors
        }
      });

      // Clear tracking sets
      this.provinceLayerIds.clear();
      this.provinceSourceIds.clear();
    } catch (error) {
      // Ignore if layers don't exist
    }
  }

  /**
   * Detach all handlers and remove layers
   */
  public detach(map: mapLibreGl.Map): void {
    this.removeLayers(map);
    this.removeLowZoomLayers(map);
  }
}

export type { ClusterPoint };
