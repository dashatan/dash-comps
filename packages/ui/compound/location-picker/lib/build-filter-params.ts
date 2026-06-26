import { FilterTrafficDataParams } from "@/features/traffic/normalizations/filter";
import {
  LocationFilterParams,
  LocationResources,
} from "@/components/compound/location-picker/lib/types";
import { LocationPickerFilters } from "@/components/compound/location-picker/types";
import { Device } from "@/features/resources/types";

export function buildFilterParams(
  resources: LocationResources,
  enrichedDevices: Device[] | undefined,
  selection: LocationPickerFilters,
): FilterTrafficDataParams {
  return {
    devices: enrichedDevices,
    provinces: resources.provinces,
    roads: resources.roads,
    sources: resources.sources,
    selectedDeviceTypes: selection.deviceTypes,
    selectedProvinces: selection.provinces,
    selectedRoads: selection.roads,
    selectedSources: selection.sources,
    selectedDevices: selection.devices,
  };
}

export function toLocationFilterParams(
  resources: LocationResources,
  enrichedDevices: Device[] | undefined,
  selection: LocationPickerFilters,
): LocationFilterParams {
  return {
    sources: resources.sources,
    provinces: resources.provinces,
    roads: resources.roads,
    devices: enrichedDevices,
    selection,
  };
}
