"use client";

import { useCallback, useMemo } from "react";
import { FieldValues, Path, useFormContext, useWatch } from "react-hook-form";
import { LocationPickerCore } from "@/components/compound/location-picker/core";
import {
  mergeLocationFilters,
  pickLocationFilters,
} from "@/components/compound/location-picker/lib/pick-location-filters";
import {
  LocationPickerCommitPayload,
  LocationPickerDateHint,
  LocationPickerFilters,
  LocationPickerProps,
  LocationPickerRoutingState,
} from "@/components/compound/location-picker/types";

function toRoutingState(value: unknown): LocationPickerRoutingState {
  return value && typeof value === "object"
    ? { ...(value as LocationPickerRoutingState) }
    : {};
}

/** Form-connected picker — only entry point that uses react-hook-form. */
export default function LocationPicker<T extends FieldValues = FieldValues>({
  name,
  routingName = "routing" as Path<T>,
  ...props
}: LocationPickerProps<T>) {
  const form = useFormContext<T>();
  const namePath = name as Path<T>;
  const routingPath = routingName as Path<T>;

  const committedRaw = useWatch({ control: form.control, name: namePath });
  const routingRaw = useWatch({ control: form.control, name: routingPath });

  const committed = useMemo(
    () => pickLocationFilters(committedRaw),
    [committedRaw],
  );
  const initialRouting = useMemo(
    () => toRoutingState(routingRaw),
    [routingRaw],
  );

  const dateHint = useMemo((): LocationPickerDateHint | undefined => {
    if (
      String(name) !== "filters" ||
      !committedRaw ||
      typeof committedRaw !== "object"
    ) {
      return props.dateHint;
    }
    const block = committedRaw as { date?: number[]; deviceDateRange?: string };
    return { date: block.date, deviceDateRange: block.deviceDateRange };
  }, [committedRaw, name, props.dateHint]);

  const onCommit = useCallback(
    ({ filters, routing }: LocationPickerCommitPayload) => {
      form.setValue(
        namePath,
        mergeLocationFilters(form.getValues(namePath), filters) as never,
        { shouldDirty: true, shouldValidate: true },
      );
      const { isLoading: _isLoading, ...routingToCommit } = routing;
      form.setValue(
        routingPath,
        {
          ...toRoutingState(form.getValues(routingPath)),
          ...routingToCommit,
          isLoading: false,
        } as never,
        { shouldDirty: true },
      );
    },
    [form, namePath, routingPath],
  );

  const onCommittedChange = useCallback(
    (filters: LocationPickerFilters) => {
      form.setValue(
        namePath,
        mergeLocationFilters(form.getValues(namePath), filters) as never,
        { shouldDirty: true, shouldValidate: true },
      );
    },
    [form, namePath],
  );

  return (
    <LocationPickerCore
      {...props}
      committed={committed}
      initialRouting={initialRouting}
      onCommit={onCommit}
      onCommittedChange={onCommittedChange}
      dateHint={dateHint}
    />
  );
}

export { LocationPickerCore } from "@/components/compound/location-picker/core";
export {
  normalizeLocation,
  filterLocationData,
  resolveDisplayValue,
  enrichDevices,
} from "@/components/compound/location-picker/lib";
