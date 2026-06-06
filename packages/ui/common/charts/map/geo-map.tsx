import { forwardRef, useEffect, useMemo, type Ref } from "react";
import * as echarts from "echarts";
import type {
  DefaultLabelFormatterCallbackParams,
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
} from "echarts";
import EChartsReact from "echarts-for-react";
import { BaseChart, ChartProps } from "../base";
import { InferChartPayloadFromData } from "../infer";
import {
  buildTooltipFormatterContext,
  CHART_TOOLTIP_HTML_STYLE,
  formatChartTooltipHtml,
} from "../tooltip";
import { tooltipFormatterParamsData } from "../echarts-utils";
import { getHexColor } from "@/lib/utils";

export type GeoMapDataItem = {
  name: string;
  value: number;
};

export type GeoMapProps<D extends readonly GeoMapDataItem[] = readonly GeoMapDataItem[]> =
  Omit<ChartProps<InferChartPayloadFromData<D>>, "options"> & {
    mapId: string;
    geoJson: Parameters<typeof echarts.registerMap>[1];
    data: D;
    rangeText?: [string, string];
    rangeColors?: string[];
    rangeMin?: number;
    rangeMax?: number;
    borderColor?: string;
    roam?: boolean;
    showLabel?: boolean;
    aspectScale?: number;
    nameFormatter?: (name: string) => string;
    options?: EChartsOption;
  };

function defaultRangeColors() {
  return [getHexColor("--color-chart-range-2"), getHexColor("--color-chart-range-7")];
}

function GeoMapInner<const D extends readonly GeoMapDataItem[]>(
  {
    mapId,
    geoJson,
    data,
    rangeText,
    rangeColors,
    rangeMin,
    rangeMax,
    borderColor,
    roam = true,
    showLabel = false,
    aspectScale = 0.85,
    nameFormatter = (name) => name,
    options,
    tooltipItems,
    tooltipTitle,
    ...props
  }: GeoMapProps<D>,
  ref: Ref<EChartsReact>,
) {
  const rngColors = rangeColors ?? defaultRangeColors();

  useEffect(() => {
    echarts.registerMap(mapId, geoJson);
  }, [mapId, geoJson]);

  const option: EChartsOption = useMemo(() => {
    const values = data.map((item) => item.value);
    const min = rangeMin ?? Math.min(...values, 0);
    const max = rangeMax ?? Math.max(...values, 100);

    return {
      tooltip: {
        trigger: "item",
        ...CHART_TOOLTIP_HTML_STYLE,
        formatter: (params: TooltipComponentFormatterCallbackParams) => {
          const rawData = tooltipFormatterParamsData(params);
          if (rawData == null || typeof rawData !== "object") return "";

          const seriesData = rawData as InferChartPayloadFromData<D>;
          const name =
            "name" in seriesData && typeof seriesData.name === "string"
              ? nameFormatter(seriesData.name)
              : "";

          if (tooltipItems) {
            const context = buildTooltipFormatterContext(params);
            const title = tooltipTitle?.(seriesData, context);
            return formatChartTooltipHtml(title, tooltipItems(seriesData, context), context);
          }

          const value =
            "value" in seriesData && typeof seriesData.value === "number"
              ? seriesData.value.toLocaleString()
              : "";
          return `${name}: ${value}`;
        },
        ...options?.tooltip,
      },
      visualMap: {
        min,
        max,
        text: rangeText,
        realtime: true,
        calculable: false,
        orient: "horizontal",
        left: "center",
        bottom: 0,
        inRange: { color: rngColors },
        ...options?.visualMap,
      },
      series: [
        {
          type: "map",
          map: mapId,
          roam,
          aspectScale,
          data: [...data],
          emphasis: {
            itemStyle: {
              areaColor: "inherit",
              borderColor: borderColor ?? getHexColor("--color-chart-range-1"),
              borderWidth: 2,
            },
            label: {
              show: showLabel,
              formatter: (params: DefaultLabelFormatterCallbackParams) => {
                const region =
                  params.data != null &&
                  typeof params.data === "object" &&
                  "name" in params.data &&
                  typeof params.data.name === "string"
                    ? params.data.name
                    : params.name;
                return nameFormatter(region);
              },
            },
          },
          itemStyle: {
            borderColor: borderColor ?? getHexColor("--color-chart-range-1"),
            borderWidth: 0.6,
          },
          label: {
            show: showLabel,
            fontSize: 9,
            formatter: (params: DefaultLabelFormatterCallbackParams) => {
              const region =
                params.data != null &&
                typeof params.data === "object" &&
                "name" in params.data &&
                typeof params.data.name === "string"
                  ? params.data.name
                  : params.name;
              return nameFormatter(region);
            },
          },
        },
      ],
      ...options,
    };
  }, [
    mapId,
    data,
    rangeText,
    rangeMin,
    rangeMax,
    rangeColors,
    borderColor,
    roam,
    showLabel,
    aspectScale,
    nameFormatter,
    options,
    tooltipItems,
    tooltipTitle,
    rngColors,
  ]);

  return <BaseChart ref={ref} options={option} {...props} />;
}

const GeoMapChart = forwardRef(GeoMapInner) as <
  const D extends readonly GeoMapDataItem[] = readonly GeoMapDataItem[],
>(
  props: GeoMapProps<D> & { ref?: Ref<EChartsReact> },
) => ReturnType<typeof GeoMapInner>;

export default GeoMapChart;
