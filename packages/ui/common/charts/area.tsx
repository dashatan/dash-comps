import { EChartsOption } from "echarts";
import { BaseChart, ChartProps } from "./base";
import { InferChartPayloadFromSeries } from "@/components/common/charts/infer";

export type AreaSeriesInput = {
  name: string;
  data: readonly unknown[];
  stack?: string;
  smooth?: boolean;
  areaStyle?: {
    opacity?: number;
    color?: string;
  };
};

export type AreaChartProps<
  S extends readonly AreaSeriesInput[] = readonly AreaSeriesInput[],
> = Omit<ChartProps<InferChartPayloadFromSeries<S>>, "options"> & {
  xAxis: string[];
  series: S;
  title?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
};

function AreaChartInner<const S extends readonly AreaSeriesInput[]>({
  xAxis,
  series,
  title,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  ...props
}: AreaChartProps<S>) {
  const options: EChartsOption = {
    title: title ? { text: title } : undefined,
    tooltip: {
      trigger: "axis",
      show: showTooltip,
    },
    legend: {
      show: showLegend,
      data: series.map((s) => s.name),
    },
    grid: {
      show: showGrid,
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xAxis,
    },
    yAxis: {
      type: "value",
    },
    series: series.map((s) => ({
      name: s.name,
      type: "line",
      stack: s.stack,
      smooth: s.smooth,
      data: [...s.data],
      areaStyle: s.areaStyle || {
        opacity: 0.3,
      },
    })) as EChartsOption["series"],
  };

  return (
    <BaseChart<InferChartPayloadFromSeries<S>> options={options} {...props} />
  );
}

export const AreaChart = AreaChartInner;

export default AreaChart;
