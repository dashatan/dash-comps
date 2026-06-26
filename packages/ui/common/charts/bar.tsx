import { EChartsOption } from "echarts";
import { BaseChart, ChartProps } from "./base";
import { negativeFormatter } from "@/components/common/charts/helpers";
import { InferChartPayloadFromSeries } from "@/components/common/charts/infer";
import { getHexColor } from "@/lib/utils";

export type BarSeriesLabel = {
  show?: boolean;
  position?:
    | "left"
    | "right"
    | "inside"
    | "insideLeft"
    | "insideRight"
    | "insideTop"
    | "insideBottom";
  formatter?:
    | string
    | ((params: { value?: number | string; data?: unknown }) => string);
  color?: string;
  fontSize?: number;
  distance?: number;
};

export type BarSeriesInput = {
  name: string;
  data: readonly unknown[];
  stack?: string;
  color?: string;
  itemStyle?: { borderRadius?: number | number[] };
  showBackground?: boolean;
  backgroundStyle?: { color?: string; borderRadius?: number | number[] };
  label?: BarSeriesLabel;
};

export type BarChartProps<
  S extends readonly BarSeriesInput[] = readonly BarSeriesInput[],
> = Omit<ChartProps<InferChartPayloadFromSeries<S>>, "options"> & {
  xAxis: string[];
  series: S;
  title?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  horizontal?: boolean;
  rotateLabels?: boolean;
  rotateLabelsAngle?: number;
  barWidth?: string | number;
  barCategoryGap?: string | number;
  borderRadius?: number;
  labelFontSize?: number;
  showXAxisTicks?: boolean;
  emphasisColor?: string;
  emphasisBorderRadius?: number;
  emphasisShadow?: boolean;
  enableEmphasis?: boolean;
  fontSize?: number | string;
  options?: EChartsOption;
};

function BarChartInner<const S extends readonly BarSeriesInput[]>({
  xAxis,
  series,
  title,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  horizontal = false,
  rotateLabels = false,
  rotateLabelsAngle = 45,
  barWidth = "60%",
  barCategoryGap,
  borderRadius = 4,
  labelFontSize = 10,
  showXAxisTicks = true,
  emphasisColor,
  emphasisBorderRadius,
  emphasisShadow = true,
  enableEmphasis = true,
  fontSize = 12,
  options: opts,
  ...props
}: BarChartProps<S>) {
  const options: EChartsOption = {
    title: title ? { text: title } : undefined,
    tooltip: {
      trigger: "axis",
      show: showTooltip,
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: getHexColor("--color-card-accent"),
          color: getHexColor("--color-card-foreground"),
          borderColor: getHexColor("--color-border"),
          borderWidth: 0,
          formatter: (params) =>
            negativeFormatter(params.value as number | string),
        },
      },
      formatter: (params: unknown) => {
        const items = params as {
          name: string;
          seriesName?: string;
          value?: number | string;
          marker?: string;
        }[];
        let result = items[0].name + "<br/>";
        items.forEach((param) => {
          result +=
            (param.marker ?? "") +
            (param.seriesName ?? "") +
            ": " +
            negativeFormatter(param.value ?? "") +
            "<br/>";
        });
        return result;
      },
      ...opts?.tooltip,
    },
    legend: {
      show: showLegend,
      data: series.map((s) => s.name),
      ...opts?.legend,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: showLegend ? "15%" : "3%",
      containLabel: true,
      ...opts?.grid,
    },
    xAxis: (horizontal
      ? {
          type: "value" as const,
          axisLabel: {
            formatter: negativeFormatter,
            fontSize,
          },
          ...(opts?.xAxis && !Array.isArray(opts.xAxis) ? opts.xAxis : {}),
        }
      : {
          type: "category" as const,
          data: xAxis,
          axisTick: {
            show: showXAxisTicks,
          },
          axisLabel: rotateLabels
            ? {
                rotate: rotateLabelsAngle,
                interval: 0,
                margin: 10,
                fontSize: labelFontSize,
              }
            : { fontSize },
          ...(opts?.xAxis && !Array.isArray(opts.xAxis) ? opts.xAxis : {}),
        }) as EChartsOption["xAxis"],
    yAxis: (horizontal
      ? {
          type: "category" as const,
          data: xAxis,
          ...(opts?.yAxis && !Array.isArray(opts.yAxis) ? opts.yAxis : {}),
        }
      : {
          type: "value" as const,
          axisLabel: {
            formatter: negativeFormatter,
            fontSize,
          },
          ...(opts?.yAxis && !Array.isArray(opts.yAxis) ? opts.yAxis : {}),
        }) as EChartsOption["yAxis"],
    series: series.map((s) => ({
      name: s.name,
      type: "bar" as const,
      data: [...s.data],
      stack: s.stack,
      barWidth: barWidth,
      ...(barCategoryGap !== undefined && { barCategoryGap }),
      color: s.color,
      showBackground: s.showBackground,
      backgroundStyle: s.backgroundStyle,
      itemStyle: {
        borderRadius: [borderRadius, borderRadius, 0, 0],
        color: s.color,
        ...s.itemStyle,
      },
      emphasis: enableEmphasis
        ? {
            itemStyle: {
              color: emphasisColor || s.color,
              borderRadius: emphasisBorderRadius
                ? [emphasisBorderRadius, emphasisBorderRadius, 0, 0]
                : undefined,
              shadowBlur: emphasisShadow ? 10 : undefined,
              shadowColor: emphasisShadow ? "rgba(0, 0, 0, 0.3)" : undefined,
              shadowOffsetY: emphasisShadow ? 4 : undefined,
            },
            focus: "self",
            blurScope: "coordinateSystem",
          }
        : undefined,
      label: {
        show: false,
        formatter: (params: { value?: number | string }) =>
          negativeFormatter(params.value ?? ""),
        ...s.label,
      },
    })) as EChartsOption["series"],
    ...(opts?.dataZoom && { dataZoom: opts.dataZoom }),
  };

  return (
    <BaseChart<InferChartPayloadFromSeries<S>> options={options} {...props} />
  );
}

export const BarChart = BarChartInner;

export default BarChart;
