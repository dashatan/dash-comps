import type {
  DefaultLabelFormatterCallbackParams,
  EChartsOption,
  SeriesOption,
  TooltipComponentFormatterCallbackParams,
} from "echarts";

/** First series entry whether `option.series` is a single object or an array (ECharts allows both). */
export function firstSeriesFromOptions(series: EChartsOption["series"]): SeriesOption | undefined {
  if (series == null) return undefined;
  return Array.isArray(series) ? series[0] : series;
}

/**
 * Widened series fragment for merging `emphasis` / `itemStyle` / `label` without fighting the
 * full `SeriesOption` discriminated union.
 */
export type LooseSeriesOptionMerge = {
  emphasis?: {
    itemStyle?: Record<string, unknown>;
    label?: Record<string, unknown>;
    [key: string]: unknown;
  };
  itemStyle?: Record<string, unknown>;
  label?: Record<string, unknown>;
  select?: Record<string, unknown>;
};

export function firstSeriesLooseMerge(series: EChartsOption["series"]): LooseSeriesOptionMerge | undefined {
  const first = firstSeriesFromOptions(series);
  return first as LooseSeriesOptionMerge | undefined;
}

/** ECharts-only numeric fields (e.g. map `aspectScale`): coerce string props; reject NaN / 0 like `value || fallback`. */
export function resolveNumericChartOption(value: string | number | undefined, fallback = 1): number {
  const n = typeof value === "string" ? Number.parseFloat(value) : (value ?? fallback);
  return n && Number.isFinite(n) ? n : fallback;
}

export function tooltipCallbackParamsFirst(
  params: TooltipComponentFormatterCallbackParams,
): DefaultLabelFormatterCallbackParams | undefined {
  return Array.isArray(params) ? params[0] : params;
}

export function tooltipFormatterParamsData(params: TooltipComponentFormatterCallbackParams): unknown {
  return tooltipCallbackParamsFirst(params)?.data;
}

/** Narrow `data.name` against a `Record` so it is safe to use as an index key. */
export function dataNameInRecord<T extends PropertyKey>(
  data: unknown,
  record: Record<T, unknown>,
): T | undefined {
  if (data == null || typeof data !== "object") return undefined;
  const name = (data as { name?: unknown }).name;
  if (typeof name !== "string" || !(name in record)) return undefined;
  return name as T;
}
