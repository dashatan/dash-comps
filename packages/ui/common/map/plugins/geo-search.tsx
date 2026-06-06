"use client";

import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import { useMapPlugin } from "@/components/common/map/hooks/use-map-plugin";
import { createSearchIcon } from "@/components/common/map/utils/markers";
import type { MapGeoSearchProps } from "@/components/common/map/types";

export function MapGeoSearch({
  nominatimUrl,
  searchLabel,
  acceptLanguage = "fa,fa-IR",
  position = "topright",
  markerIcon = createSearchIcon(),
}: MapGeoSearchProps) {
  useMapPlugin((map) => {
    const provider = new OpenStreetMapProvider({
      searchUrl: nominatimUrl,
      params: { "accept-language": acceptLanguage },
    });

    // leaflet-geosearch constructor typings are incomplete
    const control = new (GeoSearchControl as unknown as new (options: object) => L.Control)({
      provider,
      style: "bar",
      searchLabel,
      marker: { icon: markerIcon },
      position,
    });

    map.addControl(control);

    return () => {
      try {
        map.removeControl(control);
      } catch {
        // Map may already be destroyed during React unmount
      }
    };
  }, [nominatimUrl, searchLabel, acceptLanguage, position, markerIcon]);

  return null;
}
