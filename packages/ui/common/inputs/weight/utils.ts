import type { WeightRange } from "@/components/common/inputs/weight/types";

export function formatWeightLabel(
  value: WeightRange | undefined,
  unit: string,
  fromLabel: string,
  toLabel: string,
): string {
  if (value?.from === undefined && value?.to === undefined) {
    return "";
  }

  const parts: string[] = [];

  if (value?.from !== undefined) {
    parts.push(`${fromLabel} ${value.from} ${unit}`);
  }
  if (value?.to !== undefined) {
    parts.push(`${toLabel} ${value.to} ${unit}`);
  }

  return parts.join(" - ");
}

export function isSameRange(a?: WeightRange, b?: WeightRange) {
  return a?.from === b?.from && a?.to === b?.to;
}

export function cloneRange(range: WeightRange): WeightRange {
  return { from: range.from, to: range.to };
}
