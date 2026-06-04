import type { SelectContainerProps } from "@/components/common/inputs/select/types";

export type WeightRange = { from?: number; to?: number };

export type WeightPreset = {
  label: string;
  value: WeightRange;
};

export type WeightInputProps = Omit<SelectContainerProps, "value"> & {
  unit?: string;
  presets?: WeightPreset[];
  value?: WeightRange;
  onChange?: (value?: WeightRange) => void;
  className?: {
    panelBody?: string;
    panelFooter?: string;
    item?: string;
  };
};
