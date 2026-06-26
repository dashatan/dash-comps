type KeepsValueField<P> = keyof P extends "name" | "value"
  ? true
  : keyof P extends "name" | "value" | "total"
    ? true
    : false;

/** Tooltip payload inferred from a series/data point. */
export type ChartDataPayload<P> = P extends number
  ? unknown
  : P extends { value: number }
    ? KeepsValueField<P> extends true
      ? P
      : P
    : P extends object
      ? P
      : unknown;

export type SeriesDataPointUnion<
  S extends readonly { data?: readonly unknown[] }[],
> = NonNullable<S[number]["data"]>[number];

/** Infer tooltip type from chart `series` entries that expose `data`. */
export type InferChartPayloadFromSeries<
  S extends readonly { data?: readonly unknown[] }[],
> = ChartDataPayload<SeriesDataPointUnion<S>>;

export type DataPointUnion<D extends readonly unknown[]> = D[number];

/** Infer tooltip type from a top-level `data` array (pie, map, doughnut, …). */
export type InferChartPayloadFromData<D extends readonly unknown[]> =
  ChartDataPayload<DataPointUnion<D>>;
