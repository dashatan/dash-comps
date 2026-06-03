import { Device, Province, Road } from "@/features/resources/types";
import { FilterTrafficDataParams } from "@/features/traffic/normalizations/filter";
import {
  FilteredLocationData,
  LocationFilterParams,
} from "@/components/compound/location-picker/lib/types";

function filterProvincesFromParams(props: FilterTrafficDataParams): Province[] | undefined {
  const sourcesIds = props.sources?.map((x) => x.id);
  let provinces = props.provinces?.filter((x) =>
    x.source ? x.source.some((y) => sourcesIds?.includes(y)) : false,
  );
  provinces = provinces?.filter((x) => {
    if (!props.selectedSources?.length) return true;
    return props.selectedSources.some((y) => x.source?.includes(y));
  });
  return provinces;
}

function filterRoadsFromProvinces(
  props: FilterTrafficDataParams,
  filteredProvinces: Province[] | undefined,
): Road[] | undefined {
  const provincesIds = filteredProvinces?.map((x) => x.id);
  let roads = props.roads?.filter((x) =>
    x.province ? provincesIds?.includes(x.province) : false,
  );
  roads = roads?.filter((x) => {
    if (!props.selectedProvinces?.length) {
      if (!props.selectedSources?.length) return true;
      return props.selectedSources.some((y) => y === x.source);
    }
    return props.selectedProvinces.some((y) => y === x.province);
  });
  return roads;
}

function filterDevicesFromProvinces(
  props: FilterTrafficDataParams,
  filteredProvinces: Province[] | undefined,
): Device[] | undefined {
  const provincesIds = filteredProvinces?.map((x) => x.id);
  return props.devices
    ?.filter((x) => (x.province ? provincesIds?.includes(x.province) : false))
    ?.filter((x) => {
      if (
        props.selectedDeviceTypes?.length &&
        x.device_type &&
        !props.selectedDeviceTypes.includes(x.device_type)
      ) {
        return false;
      }
      if (!props.selectedRoads?.length) {
        if (!props.selectedProvinces?.length) {
          if (!props.selectedSources?.length) return true;
          return props.selectedSources.some((y) => y === x.source);
        }
        return props.selectedProvinces.some((y) => y === x.province);
      }
      return props.selectedRoads.some((y) => y === x.road);
    });
}

/** Single-pass hierarchy filter (provinces computed once). */
export function filterLocationData(params: FilterTrafficDataParams): FilteredLocationData {
  const filteredProvinces = filterProvincesFromParams(params);
  return {
    provinces: filteredProvinces,
    roads: filterRoadsFromProvinces(params, filteredProvinces),
    devices: filterDevicesFromProvinces(params, filteredProvinces),
  };
}

export function filterLocationDataFromSelection(
  params: LocationFilterParams,
): FilteredLocationData {
  const { selection, ...resources } = params;
  return filterLocationData({
    devices: resources.devices,
    provinces: resources.provinces,
    roads: resources.roads,
    sources: resources.sources,
    selectedDeviceTypes: selection.deviceTypes,
    selectedProvinces: selection.provinces,
    selectedRoads: selection.roads,
    selectedSources: selection.sources,
    selectedDevices: selection.devices,
  });
}
