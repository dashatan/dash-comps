import { LabelContainerProps } from "@/components/common/inputs/select/types";
import { FieldValues, Path } from "react-hook-form";

export type LocationPickerFilters = {
  sources?: number[];
  devices?: number[];
  roads?: number[];
  provinces?: number[];
  deviceTypes?: number[];
};

export type LocationPickerRoutingState = {
  addingOrigin?: boolean;
  addingDestination?: boolean;
  originLatLng?: Point;
  destinationLatLng?: Point;
  routes?: {
    index: number;
    title: string;
    distance: number;
    duration: number;
    summary?: string;
    destinationName?: string;
    originName?: string;
    devices?: number[];
  }[];
  selectedRoute?: number;
  isLoading?: boolean;
};

export type LocationPickerCommitPayload = {
  filters: LocationPickerFilters;
  routing: LocationPickerRoutingState;
};

export type LocationPickerDateHint = {
  date?: number[];
  deviceDateRange?: string;
};

export type LocationPickerCoreProps = {
  committed: LocationPickerFilters;
  initialRouting?: LocationPickerRoutingState;
  onCommit: (payload: LocationPickerCommitPayload) => void;
  onCommittedChange: (filters: LocationPickerFilters) => void;
  dateHint?: LocationPickerDateHint;
  label?: string;
  className?: { input?: string; content?: string; calendar?: string };
  labelContainerProps?: Omit<LabelContainerProps, "hasValue" | "ref">;
  width?: string | number;
};

export type LocationPickerProps<T extends FieldValues = FieldValues> = Omit<
  LocationPickerCoreProps,
  "committed" | "initialRouting" | "onCommit" | "onCommittedChange"
> & {
  name: Path<T>;
  routingName?: Path<T>;
};
