import { EChartsOption } from "echarts";
import { BaseChart, ChartProps } from "./base";
import { useMemo, forwardRef, type Ref } from "react";
import EChartsReact from "echarts-for-react";
import { useLanguage } from "@/lib";
import { useThemeColors } from "@/lib/hooks/use-theme-colors";
import { InferChartPayloadFromData } from "@/components/common/charts/infer";

export interface DoughnutDataItem {
  name: string;
  value: number;
  itemStyle?: { color: string };
  children?: DoughnutDataItem[];
}

export type DoughnutChartProps<
  D extends readonly DoughnutDataItem[] = readonly DoughnutDataItem[],
> = Omit<ChartProps<InferChartPayloadFromData<D>>, "options"> & {
  data: D;
  title?: string;
  textColor?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  radius?: [string, string];
  roseType?: "radius" | "area" | undefined;
  labelFontSize?: number;
  labelPosition?: "inside" | "outside";
  showLabelFromPercent?: number;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  minAngle?: number;
};

function DoughnutChartRender<const D extends readonly DoughnutDataItem[]>(
  {
    data,
    title,
    showLegend = false,
    showTooltip = false,
    radius = ["55%", "95%"],
    roseType,
    labelFontSize = 8,
    labelPosition = "outside",
    showLabelFromPercent = 0,
    borderWidth = 3,
    borderColor,
    borderRadius = 0,
    minAngle = 6,
    ...props
  }: DoughnutChartProps<D>,
  ref: Ref<EChartsReact>,
) {
  const { t } = useLanguage();
  const colors = useThemeColors();

  // Generate options with current data state
  const options: EChartsOption = useMemo(() => {
    const textColor = props.textColor || colors.foreground;
    return {
      title: {
        text: title,
        left: "center",
        subtextStyle: {
          color: textColor,
          fontSize: 12,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          const value = params.value;
          return `<p style="color: ${params.color}">${params.name}</p>
                    <div style="display: flex;">
                      <p style="padding: 0 5px;">
                        ${t("common.count")}:
                      </p> 
                      ${value.toLocaleString()} 
                      <p style="padding: 0 8px;">
                        (${params.percent}%)
                      </p>
                    </div>`;
        },
      },
      legend: showLegend
        ? {
            orient: "horizontal",
            scrollDataIndex: 1,
            left: "left",
            bottom: "0",
            type: "scroll",
            align: "left",
          }
        : undefined,
      series: [
        {
          name: title,
          type: "pie",
          radius: radius,
          roseType,
          data: [...data],
          minAngle,
          avoidLabelOverlap: true,
          // Label styling
          label: {
            show: true,
            color: textColor,
            position: labelPosition,
            fontSize: 12,
            overflow: "none",
            lineHeight: 14,
            formatter: function (params) {
              const pct = params.percent ?? 0;
              if (showLabelFromPercent < pct) {
                return `${pct.toFixed(2)}%`;
              }
              return ``;
            },
            alignTo: "edge",
          },

          // Label connector lines
          labelLine: {
            show: false,
            length: 10,
            length2: 2,
            smooth: true,
          },

          // Segment styling
          itemStyle: {
            borderRadius,
            borderColor: borderColor || colors.background,
            borderWidth,
          },

          // Hover state styling
          emphasis: {
            scale: false,
            label: {
              show: true,
            },
          },

          // Animation
          animationType: "expansion",
          animationDuration: 500,
          animationEasing: "cubicInOut",
        },
      ],
    };
  }, [
    data,
    title,
    labelFontSize,
    labelPosition,
    radius,
    roseType,
    showLegend,
    colors,
    borderWidth,
    borderColor,
    borderRadius,
  ]);

  return (
    <BaseChart<InferChartPayloadFromData<D>>
      ref={ref}
      options={options}
      {...props}
    />
  );
}

export const DoughnutChart = forwardRef(DoughnutChartRender) as <
  const D extends readonly DoughnutDataItem[] = readonly DoughnutDataItem[],
>(
  props: DoughnutChartProps<D> & { ref?: Ref<EChartsReact> },
) => ReturnType<typeof DoughnutChartRender>;

export default DoughnutChart;
