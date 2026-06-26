"use client";

import { useCallback, useMemo, useState } from "react";
import inPolygon from "robust-point-in-polygon";
import {
  createDeviceIcon,
  LeafletMap,
  MapDeviceCluster,
  MapGeoSearch,
  MapGeomanControls,
  MapZoomControls,
  type GeomanCreateEvent,
  type GeomanShape,
} from "@/components/common/map";
import { useLocationPickerStore } from "@/components/compound/location-picker/context";
import { Device } from "@/features/resources/types";
import { MAP_CONFIG } from "@/components/compound/tracker-legacy/map/config/constants";
import { isWithinIran } from "@/utils/geographic";
import { getMapTileUrl, getStoreEnv, useLanguage } from "@/lib";
import { useTheme } from "next-themes";

export type FilterMapProps = {
  devices?: Device[];
  color?: string;
  onSelect?: (selected: number[] | undefined) => void;
  center?: [number, number];
};

export default function FilterMap({
  devices: devicesProp,
  color,
  onSelect,
  center: c,
}: FilterMapProps) {
  const { t } = useLanguage();
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    c ?? MAP_CONFIG.CENTER_COORD,
  );
  const { filteredData, setDraftField } = useLocationPickerStore();
  const d = devicesProp ?? filteredData.devices;
  const { NOMINATIM_URL } = getStoreEnv();
  const { resolvedTheme } = useTheme();
  const tileUrl = getMapTileUrl(resolvedTheme);

  const devices = useMemo(
    () =>
      d?.filter((device) => {
        if (device.lat && device.long) {
          return isWithinIran(parseFloat(device.lat), parseFloat(device.long));
        }
        return true;
      }),
    [d],
  );

  const deviceIcon = useMemo(() => createDeviceIcon(), []);

  const handleShapeCreate = useCallback(
    (event: GeomanCreateEvent) => {
      if (event.shape !== "Polygon" && event.shape !== "Rectangle") return;
      if (!event.polygon.length) return;

      const selected = devices?.flatMap((device) =>
        inPolygon(event.polygon, [
          parseFloat(device.lat),
          parseFloat(device.long),
        ]) <= 0
          ? device.id
          : [],
      );

      if (onSelect) onSelect(selected);
      else setDraftField("devices", selected);
    },
    [devices, onSelect, setDraftField],
  );

  const enabledShapes = useMemo((): GeomanShape[] | undefined => {
    return color ? ["Polygon", "Rectangle"] : undefined;
  }, [color]);

  return (
    <LeafletMap
      tileUrl={tileUrl}
      center={mapCenter}
      zoom={5}
      pmIgnore={false}
      zoomControl={false}
      className="z-2 size-full p-4"
      onCenterChange={setMapCenter}
    >
      <MapZoomControls />
      <MapGeomanControls
        shapes={enabledShapes ?? ["Polygon", "Rectangle"]}
        drawPathOptions={color ? { color } : undefined}
        onCreate={handleShapeCreate}
      />
      <MapGeoSearch
        nominatimUrl={NOMINATIM_URL ?? ""}
        searchLabel={t("locationPicker.mapSearchPlaceholder")}
      />
      <MapDeviceCluster devices={devices ?? []} icon={deviceIcon} />
    </LeafletMap>
  );
}
