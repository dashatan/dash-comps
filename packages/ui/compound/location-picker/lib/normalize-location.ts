import { enrichDevices, buildNameLookup } from "@/components/compound/location-picker/lib/enrich-devices";
import { filterLocationDataFromSelection } from "@/components/compound/location-picker/lib/filter-location-data";
import {
  FilteredLocationData,
  LocationResources,
} from "@/components/compound/location-picker/lib/types";
import { LocationPickerFilters } from "@/components/compound/location-picker/types";

export function normalizeLocation(
  resources: LocationResources,
  selection: LocationPickerFilters,
): FilteredLocationData {
  const lookup = buildNameLookup(resources);
  const enrichedDevices = enrichDevices(resources.devices, lookup);

  return filterLocationDataFromSelection({
    sources: resources.sources,
    provinces: resources.provinces,
    roads: resources.roads,
    devices: enrichedDevices,
    selection,
  });
}
