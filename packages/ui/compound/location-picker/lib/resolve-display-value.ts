import {
  DisplayValueKey,
  LocationResources,
  ResolvedDisplayValue,
} from "@/components/compound/location-picker/lib/types";
import { LocationPickerFilters } from "@/components/compound/location-picker/types";

const DISPLAY_PRIORITY: DisplayValueKey[] = [
  "devices",
  "roads",
  "provinces",
  "sources",
];

function resolveValueType(
  selection: LocationPickerFilters,
): DisplayValueKey | undefined {
  for (const key of DISPLAY_PRIORITY) {
    if (selection[key]?.length) return key;
  }
  return undefined;
}

function selectedEntities(
  resources: LocationResources,
  selection: LocationPickerFilters,
  valueType: DisplayValueKey,
) {
  const ids = selection[valueType];
  if (!ids?.length) return undefined;

  const list =
    valueType === "sources"
      ? resources.sources
      : valueType === "provinces"
        ? resources.provinces
        : valueType === "roads"
          ? resources.roads
          : resources.devices;

  return list?.filter((item) => ids.includes(item.id));
}

/** Resolves trigger chips / count from current filter selection. */
export function resolveDisplayValue(
  resources: LocationResources,
  selection: LocationPickerFilters,
): ResolvedDisplayValue {
  const valueType = resolveValueType(selection);
  const value = valueType
    ? selectedEntities(resources, selection, valueType)
    : undefined;
  const chips =
    value?.map((item) => ({ value: item.id, label: item.name })) ?? [];

  return {
    valueType,
    value,
    chips,
    count: value?.length ?? 0,
  };
}
