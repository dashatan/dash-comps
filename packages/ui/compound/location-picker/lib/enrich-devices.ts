import { Device, Province, Road, Source } from "@/features/resources/types";

export type NameLookup = {
  provinces: Map<number, string>;
  roads: Map<number, string>;
  sources: Map<number, string>;
};

export function buildNameLookup(resources: {
  provinces?: Province[];
  roads?: Road[];
  sources?: Source[];
}): NameLookup {
  return {
    provinces: new Map(resources.provinces?.map((p) => [p.id, p.name]) ?? []),
    roads: new Map(resources.roads?.map((r) => [r.id, r.name]) ?? []),
    sources: new Map(resources.sources?.map((s) => [s.id, s.name]) ?? []),
  };
}

export function enrichDevices(
  devices: Device[] | undefined,
  lookup: NameLookup,
): Device[] | undefined {
  if (!devices?.length) return devices;

  return devices.map((device) => ({
    ...device,
    provinceName:
      device.province !== undefined
        ? lookup.provinces.get(device.province)
        : device.provinceName,
    roadName:
      device.road !== undefined
        ? lookup.roads.get(device.road)
        : device.roadName,
    sourceName:
      device.source !== undefined
        ? lookup.sources.get(device.source)
        : device.sourceName,
  }));
}
