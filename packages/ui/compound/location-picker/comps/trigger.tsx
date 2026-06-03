"use client";

import { memo, useCallback } from "react";
import { Map1 } from "iconsax-reactjs";
import SelectTriggerTemplate from "@/components/common/inputs/select/comps/trigger";
import { DialogTrigger } from "@/components/common/overlay/dialog";
import { SelectItem } from "@/components/common/inputs/select/types";
import { useLocationDisplayValue } from "@/components/compound/location-picker/hooks/use-location-display-value";
import { LabelContainerProps } from "@/components/common/inputs/select/types";
import { LocationPickerFilters } from "@/components/compound/location-picker/types";
import useResources from "@/features/resources/utils/useResources";

type LocationPickerTriggerProps = {
  committed: LocationPickerFilters;
  onCommittedChange: (filters: LocationPickerFilters) => void;
  label?: string;
  width?: string | number;
  labelContainerProps?: Omit<LabelContainerProps, "hasValue" | "ref">;
};

function LocationPickerTriggerComponent({
  committed,
  onCommittedChange,
  label,
  width,
  labelContainerProps,
}: LocationPickerTriggerProps) {
  const { sources, provinces, roads, devices } = useResources();
  const display = useLocationDisplayValue(
    { sources, provinces, roads, devices },
    committed,
  );

  const handleChipRemove = useCallback(
    (val: SelectItem) => {
      if (!display.valueType) return;
      const selected = committed[display.valueType];
      onCommittedChange({
        ...committed,
        [display.valueType]: selected?.filter((id) => id !== val.value),
      });
    },
    [committed, display.valueType, onCommittedChange],
  );

  const handleClear = useCallback(() => {
    if (!display.valueType) return;
    onCommittedChange({ ...committed, [display.valueType]: undefined });
  }, [committed, display.valueType, onCommittedChange]);

  return (
    <DialogTrigger className="w-full" style={{ width }}>
      <SelectTriggerTemplate
        {...labelContainerProps}
        label={label}
        chips={display.chips}
        showChips={display.count > 0}
        labelType="count"
        onRemove={handleChipRemove}
        count={display.count}
        onClear={handleClear}
        Icon={<Map1 />}
      />
    </DialogTrigger>
  );
}

export const LocationPickerTrigger = memo(LocationPickerTriggerComponent);
