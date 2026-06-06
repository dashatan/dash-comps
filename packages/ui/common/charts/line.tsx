import { EChartsOption, LineSeriesOption, YAXisComponentOption } from "echarts";
import { BaseChart, ChartProps } from "./base";
import { InferChartPayloadFromSeries } from "@/components/common/charts/infer";
import { getHexColor } from "@/lib/utils";
import { negativeFormatter } from "@/components/common/charts/helpers";

export type LineSeriesInput = Omit<LineSeriesOption, "data"> & {
  data?: readonly unknown[];
};

export type LineChartProps<
  S extends readonly LineSeriesInput[] = readonly LineSeriesInput[],
> = Omit<ChartProps<InferChartPayloadFromSeries<S>>, "options"> & {
  xAxis: string[];
  series: S;
  title?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  animation?: boolean;
  fontSize?: number;
  options?: EChartsOption;
  colors?: string[];
  showArea?: boolean;
  type?: "line" | "smooth" | "step";
};

function LineChartInner<const S extends readonly LineSeriesInput[]>({
  xAxis,
  series,
  title,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  animation = true,
  fontSize = 12,
  options = {},
  colors,
  showArea = true,
  type,
  ...props
}: LineChartProps<S>) {
  const { xAxis: xAxisOption, tooltip, yAxis, ...otherOptions } = options;
  const defaultOptions: EChartsOption = {
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
          formatter: (params) => negativeFormatter(params.value as number | string),
        },
      },
      ...tooltip,
    },
    legend: { show: showLegend, bottom: 0, ...options?.legend },
    grid: { show: false, ...options?.grid },
    xAxis: {
      type: "category",
      data: xAxis,
      axisLabel: { fontSize },
      ...(xAxisOption && !Array.isArray(xAxisOption) ? (xAxisOption as object) : {}),
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize },
      ...(Array.isArray(yAxis) ? {} : (yAxis ?? {})),
    } as YAXisComponentOption,
    series: series.map((s, index) => ({
      type: "line",
      name: s.name,
      data: s.data ? [...s.data] : s.data,
      smooth: type === "smooth",
      step: type === "step" ? "middle" : false,
      animation: animation,
      color: colors?.[index] || s.color,
      areaStyle: { opacity: showArea ? 0.2 : 0 },
      ...s,
    })) as EChartsOption["series"],
    ...otherOptions,
  };

  return (
    <BaseChart<InferChartPayloadFromSeries<S>> options={defaultOptions} {...props} />
  );
}

export const LineChart = LineChartInner;

export default LineChart;
