"use client";

import { useState } from "react";
import SelectContainer from "@/components/common/inputs/select/container";
import { WeightPresets } from "@/components/common/inputs/weight/presets";
import type {
  WeightInputProps,
  WeightPreset,
  WeightRange,
} from "@/components/common/inputs/weight/types";
import {
  cloneRange,
  formatWeightLabel,
  isSameRange,
} from "@/components/common/inputs/weight/utils";
import TextInput from "@/components/common/inputs/text";
import { useLanguage } from "@dash/core";

export type { WeightInputProps, WeightPreset, WeightRange } from "@/components/common/inputs/weight/types";

function formatFieldValue(n: number | undefined) {
  return n === undefined ? "" : String(n);
}

export default function WeightInput({
  presets,
  onChange,
  value,
  unit: unitProp,
  ...props
}: WeightInputProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const unit = unitProp ?? "kg";
  const fieldKey = `${value?.from ?? ""}-${value?.to ?? ""}`;

  const displayLabel = formatWeightLabel(
    value,
    unit,
    t("common.from"),
    t("common.to"),
  );

  function commitRange(next?: WeightRange) {
    onChange?.(next);
  }

  function handlePresetSelect(preset: WeightPreset) {
    const next = cloneRange(preset.value);

    if (isSameRange(value, next)) {
      commitRange(undefined);
      return;
    }

    commitRange(next);
  }

  function handleClear() {
    commitRange(undefined);
  }

  function handleRangeChange(next: WeightRange) {
    commitRange(cloneRange(next));
  }

  return (
    <SelectContainer
      onClear={handleClear}
      {...props}
      value={displayLabel}
      open={open}
      onOpenChange={setOpen}
    >
      <div>
        {presets && presets.length > 0 ? (
          <WeightPresets
            presets={presets}
            selected={value}
            onSelect={handlePresetSelect}
          />
        ) : null}

        <div className="flex items-end justify-between gap-4 border-t p-4">
          <TextInput
            key={`weight-from-${fieldKey}`}
            label={t("common.fromWeight")}
            prefix={unit}
            type="number"
            min={0}
            value={formatFieldValue(value?.from)}
            onChange={(v) => {
              const num = parseFloat(v);
              handleRangeChange({
                from: Number.isNaN(num) ? undefined : num,
                to: value?.to,
              });
            }}
          />

          <TextInput
            key={`weight-to-${fieldKey}`}
            label={t("common.toWeight")}
            prefix={unit}
            type="number"
            min={value?.from ?? 0}
            value={formatFieldValue(value?.to)}
            onChange={(v) => {
              const num = parseFloat(v);
              handleRangeChange({
                from: value?.from,
                to: Number.isNaN(num) ? undefined : num,
              });
            }}
          />
        </div>
      </div>
    </SelectContainer>
  );
}
