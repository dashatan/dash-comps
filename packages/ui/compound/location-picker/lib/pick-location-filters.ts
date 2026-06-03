import { LocationPickerFilters } from "@/components/compound/location-picker/types";

export function pickLocationFilters(value: unknown): LocationPickerFilters {
  if (!value || typeof value !== "object") return {};

  const record = value as Record<string, unknown>;

  return {
    sources: record.sources as number[] | undefined,
    provinces: record.provinces as number[] | undefined,
    roads: record.roads as number[] | undefined,
    devices: record.devices as number[] | undefined,
    deviceTypes: record.deviceTypes as number[] | undefined,
  };
}

export function mergeLocationFilters(
  current: unknown,
  draft: LocationPickerFilters,
): LocationPickerFilters & Record<string, unknown> {
  const base =
    current && typeof current === "object"
      ? { ...(current as Record<string, unknown>) }
      : {};

  return {
    ...base,
    ...draft,
  };
}
