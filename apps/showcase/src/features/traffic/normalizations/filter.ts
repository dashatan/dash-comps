import type { Device, Province, Road, Source } from "@/features/resources/types";

export type FilterTrafficDataParams = {
  sources?: Source[];
  provinces?: Province[];
  roads?: Road[];
  devices?: Device[];
  selectedSources?: number[];
  selectedProvinces?: number[];
  selectedRoads?: number[];
  selectedDevices?: number[];
  selectedDeviceTypes?: number[];
};
