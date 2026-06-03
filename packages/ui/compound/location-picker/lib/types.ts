import { Device, Province, Road, Source } from "@/features/resources/types";
import { LocationPickerFilters } from "@/components/compound/location-picker/types";

export type LocationFilterParams = {
  sources?: Source[];
  provinces?: Province[];
  roads?: Road[];
  devices?: Device[];
  selection: LocationPickerFilters;
};

export type FilteredLocationData = {
  provinces?: Province[];
  roads?: Road[];
  devices?: Device[];
};

export type LocationResources = {
  sources?: Source[];
  provinces?: Province[];
  roads?: Road[];
  devices?: Device[];
};

export type DisplayValueKey = keyof Pick<
  LocationPickerFilters,
  "sources" | "provinces" | "roads" | "devices"
>;

export type DisplayEntity = { id: number; name: string };

export type ResolvedDisplayValue = {
  valueType?: DisplayValueKey;
  value?: DisplayEntity[];
  chips: { value: number; label: string }[];
  count: number;
};
