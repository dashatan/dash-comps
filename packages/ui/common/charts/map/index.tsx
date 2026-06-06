import { forwardRef, useEffect, useMemo, type Ref } from "react";
import * as echarts from "echarts";
import iranGeoJson from "./IRGeoJson3.json" with { type: "json" };
import {
  MapAreaClickParams,
  MapData,
  MapDataName,
  mapFaName,
  noneIntractableProvinces,
} from "./types";
import { BaseChart, ChartProps } from "../base";
import { InferChartPayloadFromData } from "../infer";
import {
  dataNameInRecord,
  firstSeriesLooseMerge,
  resolveNumericChartOption,
  tooltipFormatterParamsData,
} from "../echarts-utils";
import {
  buildTooltipFormatterContext,
  CHART_TOOLTIP_HTML_STYLE,
  formatChartTooltipHtml,
} from "../tooltip";
import {
  DefaultLabelFormatterCallbackParams,
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
} from "echarts";
import { useThemeColors } from "@/lib/hooks/use-theme-colors";
import EChartsReact from "echarts-for-react";
import { getHexColor } from "@/lib/utils";

export type { TooltipItem } from "../tooltip";
export { formatChartTooltipHtml, formatMapTooltipHtml } from "../tooltip";

export type MapProps<D extends readonly MapData[] = readonly MapData[]> = Omit<
  ChartProps<InferChartPayloadFromData<D>>,
  "options"
> & {
    data?: D;
    height?: string;
    width?: string;
    onMapClick?: (params: MapAreaClickParams) => void;
    rangeText?: string[];
    rangeColors?: string[];
    rangeMin?: number;
    rangeMax?: number;
    borderColor?: string;
    options?: EChartsOption;
    disableDefaultTooltip?: boolean;
    left?: string | number;
    bottom?: string | number;
    right?: string | number;
    top?: string | number;
    roam?: boolean;
    showLabel?: boolean;
    aspectScale?: string | number;
  };

function defaultRangeColors() {
  return [getHexColor("--color-chart-range-2"), getHexColor("--color-chart-range-7")];
}

const NONE_INTERACTIVE_NAMES = new Set<string>(noneIntractableProvinces);

function MapInner<const D extends readonly MapData[]>(
  {
    data,
    height = "100%",
    width = "100%",
    onMapClick,
    onChartReady,
    options,
    rangeText,
    rangeColors,
    rangeMin,
    rangeMax,
    borderColor,
    disableDefaultTooltip = false,
    left,
    bottom,
    right,
    top,
    roam = true,
    showLabel = false,
    aspectScale = 1,
    tooltipItems,
    tooltipTitle,
    ...props
  }: MapProps<D>,
  ref: Ref<EChartsReact>,
) {
  const colors = useThemeColors();
  const rngColors = rangeColors || defaultRangeColors();
  const mapData = data ?? ([] as unknown as D);

  useEffect(() => {
    echarts.registerMap(
      "iran",
      iranGeoJson as Parameters<typeof echarts.registerMap>[1],
    );
  }, []);

  // Ensure non-interactive provinces are always included with blue color, even if missing from data
  const enrichedData = useMemo(() => {
    const dataProvinceNames = new Set(mapData.map((item) => item.name));
    const result = [...mapData];

    // Add missing non-interactive provinces with blue color
    noneIntractableProvinces.forEach((provinceName) => {
      if (!dataProvinceNames.has(provinceName)) {
        result.push({
          name: provinceName,
          value: 0, // Default value since they're not interactive
        } as D[number]);
      }
    });

    return result.map((item) => {
      const isNonInteractive = NONE_INTERACTIVE_NAMES.has(item.name);
      return {
        ...item,
        // Make non-interactive provinces silent (no clicks, no tooltips, no events)
        silent: isNonInteractive,
        // Set blue color for non-interactive provinces (seas)
        itemStyle: isNonInteractive
          ? {
              areaColor: rngColors?.[rngColors.length - 1], // Blue color for seas
            }
          : undefined,
      };
    });
  }, [mapData]);

  const option: EChartsOption = useMemo(() => {
    const firstSeries = firstSeriesLooseMerge(options?.series);
    const aspectScaleNumber = resolveNumericChartOption(aspectScale);

    return {
      tooltip: disableDefaultTooltip
        ? { show: false, ...options?.tooltip }
        : {
            trigger: "item",
            ...CHART_TOOLTIP_HTML_STYLE,
            formatter: (params: TooltipComponentFormatterCallbackParams) => {
              const rawData = tooltipFormatterParamsData(params);
              const region = dataNameInRecord<MapDataName>(rawData, mapFaName);
              if (region == null) return "";
              if (noneIntractableProvinces.includes(region)) return "";

              if (tooltipItems && rawData != null && typeof rawData === "object") {
                const seriesData = rawData as InferChartPayloadFromData<D>;
                const context = buildTooltipFormatterContext(params);
                const title = tooltipTitle?.(seriesData, context);
                return formatChartTooltipHtml(
                  title,
                  tooltipItems(seriesData, context),
                  context,
                );
              }

              const value =
                rawData != null && typeof rawData === "object"
                  ? (rawData as { value?: unknown }).value
                  : undefined;
              return `${mapFaName[region]}: ${typeof value === "number" ? value.toLocaleString() : value}`;
            },
            ...options?.tooltip,
          },
      visualMap: {
        min:
          rangeMin !== undefined
            ? rangeMin
            : Math.min(...mapData.map((item) => item.value)) || 0,
        max: rangeMax ? rangeMax : Math.max(...mapData.map((item) => item.value)) || 100,
        text: rangeText,
        realtime: true,
        calculable: false,
        orient: "horizontal",
        left: "center",
        bottom: "0",
        inRange: {
          color: rngColors,
        },
        ...options?.visualMap,
      },
      series: [
        {
          name: "Iran",
          showLegendSymbol: false,
          type: "map",
          map: "iran",
          roam: roam,
          left: left || "center",
          bottom: bottom || "auto",
          right: right || "auto",
          top: top || "top",
          aspectScale: aspectScaleNumber,
          silent: false,
          emphasis: {
            itemStyle: {
              areaColor: "none",
              borderColor: borderColor || getHexColor("--color-chart-range-1"),
              borderType: "dashed",
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.3)",
              shadowOffsetX: 0,
              shadowOffsetY: 4,
              ...firstSeries?.emphasis?.itemStyle,
            },
            label: {
              show: showLabel,
              color: "rgba(255, 255, 255, 1)",
              textBorderWidth: 2,
              textBorderColor: "rgba(0, 0, 0, 0.5)",
              fontSize: 10,
              formatter: (params: DefaultLabelFormatterCallbackParams) => {
                const region = dataNameInRecord<MapDataName>(params.data, mapFaName);
                return region ? mapFaName[region] : "";
              },
              ...firstSeries?.emphasis?.label,
            },
            ...firstSeries?.emphasis,
          },
          itemStyle: {
            borderColor: borderColor || getHexColor("--color-chart-range-1"),
            borderWidth: 1,
            ...firstSeries?.itemStyle,
          },
          label: {
            show: showLabel,
            color: "rgba(255, 255, 255, 1)",
            textBorderWidth: 2,
            textBorderColor: "rgba(0, 0, 0, 0.5)",
            fontSize: 10,
            formatter: (params: DefaultLabelFormatterCallbackParams) => {
              const region = dataNameInRecord<MapDataName>(params.data, mapFaName);
              return region ? mapFaName[region] : "";
            },
            ...firstSeries?.label,
          },
          select: {
            disabled: true,
            ...firstSeries?.select,
          },
          data: enrichedData,
        },
      ],
    };
  }, [
    data,
    enrichedData,
    rangeText,
    options,
    colors,
    rangeMin,
    rangeMax,
    rangeColors,
    borderColor,
    left,
    bottom,
    right,
    top,
    disableDefaultTooltip,
    aspectScale,
    roam,
    showLabel,
    tooltipItems,
    tooltipTitle,
  ]);

  return (
    <BaseChart
      id="map-chart"
      ref={ref}
      options={option}
      height={height}
      width={width}
      onChartReady={onChartReady}
      {...props}
    />
  );
}

const Map = forwardRef(MapInner) as <const D extends readonly MapData[] = readonly MapData[]>(
  props: MapProps<D> & { ref?: Ref<EChartsReact> },
) => ReturnType<typeof MapInner>;

export default Map;
