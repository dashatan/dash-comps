import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import type { TitleComponentOption } from "echarts";
import { useTheme } from "next-themes";
import { forwardRef, useEffect, useRef, useState, type Ref } from "react";
import { createSeriesConfig, createTooltipFormatter, getTheme } from "./helpers";
import EChartsReact from "echarts-for-react";
import { cn } from "@/lib";
import { useLanguage } from "@/lib";
import {
  CHART_TOOLTIP_HTML_STYLE,
  ChartTooltipConfig,
  createTooltipItemsFormatter,
} from "./tooltip";

export type ChartData = {
  name: string;
  value: number;
};

export type ChartProps<T = unknown> = Omit<
  React.ComponentProps<typeof ReactECharts>,
  "option"
> &
  ChartTooltipConfig<T> & {
    options?: EChartsOption;
    grid?: EChartsOption["grid"];
    height?: string | number;
    width?: string | number;
    className?: string;
    containerClassName?: string;
    loading?: boolean;
    theme?: string;
    onChartReady?: (instance: echarts.ECharts) => void;
    onEvents?: Record<string, Function>;
    id?: string;
    textColor?: string;
    style?: React.CSSProperties;
  };

function BaseChartInner<T = unknown>(
  {
    options,
    grid,
    height = "100%",
    width = "100%",
    className,
    containerClassName,
    loading = false,
    theme: chartTheme,
    onChartReady,
    onEvents,
    id = "chart-container",
    textColor,
    style,
    tooltipItems,
    tooltipTitle,
    ...props
  }: ChartProps<T>,
  ref: Ref<EChartsReact>,
) {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = getTheme();
  const fillsContainer = height === "100%" || height === "100";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!chartInstance || !containerRef.current) return;
    const observer = new ResizeObserver(() => chartInstance.resize());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [chartInstance]);

  useEffect(() => {
    if (chartInstance && mounted) {
      const newOptions = {
        backgroundColor: "transparent",
        textStyle: {
          color: theme.textColor,
        },
      };
      chartInstance.setOption(newOptions, false);
    }
  }, [resolvedTheme, theme, chartInstance, mounted]);

  const opts = options ?? {};
  const chartOptions: EChartsOption = {
    ...opts,
    backgroundColor: "transparent",
    grid: {
      left: "4%",
      right: "4%",
      bottom: options?.legend ? "15%" : "3%",
      top: "6%",
      containLabel: true,
      ...(options?.grid && !Array.isArray(options.grid) ? options.grid : {}),
      ...grid,
    },
    textStyle: {
      fontFamily: theme.fontFamily,
      color: theme.textColor,
      ...opts.textStyle,
    },
    title: opts.title
      ? {
          ...(opts.title as TitleComponentOption),
          textStyle: {
            fontFamily: theme.fontFamily,
            color: theme.textColor,
            ...(opts.title as TitleComponentOption)?.textStyle,
          },
        }
      : undefined,
    ...(opts.visualMap && {
      visualMap: {
        inRange: {
          color: theme.mapColors["range-colors"],
        },
        ...opts.visualMap,
      },
    }),
    legend: opts.legend
      ? {
          ...opts.legend,
          backgroundColor: "transparent",
          textStyle: {
            fontFamily: theme.fontFamily,
            color: theme.textColor,
            fontSize: 12,
            ...((opts.legend as any)?.textStyle || {}),
          },
          itemWidth: 12,
          itemHeight: 12,
          itemGap: 16,
          selectedMode: true,
          inactiveColor: theme.mutedColor,
        }
      : { show: false },
    tooltip:
      opts.tooltip || tooltipItems
        ? {
            ...(tooltipItems
              ? CHART_TOOLTIP_HTML_STYLE
              : {
                  backgroundColor: theme.backgroundColor,
                  borderColor: theme.borderColor,
                  borderWidth: 1,
                  borderRadius: 4,
                  padding: [8, 12],
                  textStyle: {
                    fontFamily: theme.fontFamily,
                    color: theme.textColor,
                    fontSize: 12,

                    ...((opts.tooltip as { textStyle?: object })?.textStyle || {}),
                  },
                  extraCssText: "box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);",
                  formatter: createTooltipFormatter(theme),
                }),
            ...opts.tooltip,
            ...(tooltipItems && {
              ...CHART_TOOLTIP_HTML_STYLE,
              formatter: createTooltipItemsFormatter({ tooltipItems, tooltipTitle }),
            }),
          }
        : undefined,
    series: opts.series
      ? Array.isArray(opts.series)
        ? opts.series.map((series, index) => createSeriesConfig(series, index, theme))
        : createSeriesConfig(opts.series, 0, theme)
      : undefined,
  };

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      style={{ height, width, ...style }}
      className={cn(
        "flex-full flex-flex-col min-h-0 w-full",
        fillsContainer ? "h-full" : "@desktop:min-h-auto h-auto @sm:min-h-60",
        containerClassName,
      )}
      id={id}
    >
      <ReactECharts
        ref={ref}
        option={chartOptions}
        style={{ height: "100%", width: "100%" }}
        className={className}
        theme={chartTheme || resolvedTheme}
        onEvents={onEvents}
        onChartReady={(instance) => {
          setChartInstance(instance);
          onChartReady?.(instance);
        }}
        {...props}
      />
    </div>
  );
}

type BaseChartComponent = <T = unknown>(
  props: ChartProps<T> & { ref?: Ref<EChartsReact> },
) => ReturnType<typeof BaseChartInner>;

export const BaseChart = forwardRef(BaseChartInner) as BaseChartComponent;
