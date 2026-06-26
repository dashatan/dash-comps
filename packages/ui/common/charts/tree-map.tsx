import { EChartsOption } from "echarts";
import type { ECharts, TooltipComponentFormatterCallbackParams } from "echarts";
import { BaseChart, ChartProps } from "./base";
import { useMemo, useRef, useEffect, useCallback } from "react";
import { getTheme } from "./helpers";
import { InferChartPayloadFromData } from "@/components/common/charts/infer";

export interface TreeMapDataItem {
  name: string;
  value: number;
  children?: TreeMapDataItem[];
  itemStyle?: {
    color?: string;
  };
}

export type TreeMapChartProps<
  D extends readonly TreeMapDataItem[] = readonly TreeMapDataItem[],
> = Omit<ChartProps<InferChartPayloadFromData<D>>, "options"> & {
  data: D;
  title?: string;
  showTooltip?: boolean;
  visualDimension?: "value" | "index";
  roam?: boolean | "scale" | "move";
  nodeClick?: "zoomToNode" | "link" | false;
  breadcrumb?: boolean;
  labelFontSize?: number;
  upperLabel?: {
    show?: boolean;
    fontSize?: number;
  };
  itemStyle?: {
    borderColor?: string;
    borderWidth?: number;
    gapWidth?: number;
  };
  emphasis?: {
    itemStyle?: {
      borderColor?: string;
      borderWidth?: number;
    };
    label?: {
      show?: boolean;
      fontSize?: number;
    };
  };
  levels?: Array<{
    itemStyle?: {
      borderColor?: string;
      borderWidth?: number;
      gapWidth?: number;
    };
    upperLabel?: {
      show?: boolean;
    };
    label?: {
      show?: boolean;
    };
  }>;
};

// Helper function to calculate total value
const calculateTotal = (items: TreeMapDataItem[]): number => {
  return items.reduce((sum, item) => {
    const childrenTotal = item.children ? calculateTotal(item.children) : 0;
    return sum + item.value + childrenTotal;
  }, 0);
};

// Helper function to filter items below 2% threshold
const filterByPercentage = (
  items: TreeMapDataItem[],
  total: number,
  threshold: number = 2,
): TreeMapDataItem[] => {
  return items
    .map((item) => {
      const itemTotal =
        item.value + (item.children ? calculateTotal(item.children) : 0);
      const percentage = (itemTotal / total) * 100;

      if (percentage < threshold) {
        return null;
      }

      const filteredItem: TreeMapDataItem = {
        ...item,
      };

      if (item.children) {
        // Filter children using the same total for consistent percentage calculation
        filteredItem.children = filterByPercentage(
          item.children,
          total,
          threshold,
        );
        // If all children were filtered out, keep the parent but remove children
        if (filteredItem.children.length === 0) {
          delete filteredItem.children;
        }
      }

      return filteredItem;
    })
    .filter((item): item is TreeMapDataItem => item !== null);
};

function TreeMapChartInner<const D extends readonly TreeMapDataItem[]>({
  data,
  title,
  showTooltip = true,
  visualDimension = "value",
  roam = true,
  nodeClick = false,
  breadcrumb = true,
  labelFontSize = 12,
  upperLabel = {
    show: true,
    fontSize: 12,
  },
  itemStyle = {
    borderColor: "#fff",
    borderWidth: 2,
    gapWidth: 2,
  },
  emphasis = {
    itemStyle: {
      borderColor: "#333",
      borderWidth: 3,
    },
    label: {
      show: true,
      fontSize: 14,
    },
  },
  levels,
  ...props
}: TreeMapChartProps<D>) {
  const theme = getTheme();
  const chartInstanceRef = useRef<ECharts | null>(null);
  const isMouseDownOnChartRef = useRef<boolean>(false);

  // Filter data to remove items below 2%
  const filteredData = useMemo(() => {
    const items = [...data] as TreeMapDataItem[];
    const total = calculateTotal(items);
    return filterByPercentage(items, total, 2);
  }, [data]);

  // Reset viewport when user releases drag outside the chart so content stays in view
  const resetViewport = useCallback(() => {
    const instance = chartInstanceRef.current;
    if (!instance) return;
    try {
      instance.dispatchAction({ type: "restore" });
    } catch {
      // ignore
    }
    // TreeMap: restore may not reset roam; zoom back to root so view is in viewport
    requestAnimationFrame(() => {
      try {
        chartInstanceRef.current?.dispatchAction({
          type: "treemapZoomToNode",
          seriesIndex: 0,
          dataIndex: 0,
        });
      } catch {
        // ignore
      }
    });
  }, []);

  const handleChartReady = useCallback((instance: ECharts) => {
    chartInstanceRef.current = instance;
  }, []);

  // Reset view on any mouseup: inside chart or outside (so drag-and-drop always brings view back)
  useEffect(() => {
    const handleDocumentMouseUp = () => {
      if (isMouseDownOnChartRef.current) {
        isMouseDownOnChartRef.current = false;
        resetViewport();
      }
    };
    document.addEventListener("mouseup", handleDocumentMouseUp);
    return () => document.removeEventListener("mouseup", handleDocumentMouseUp);
  }, [resetViewport]);

  const onEvents = useMemo(
    () => ({
      mousedown: () => {
        isMouseDownOnChartRef.current = true;
      },
      mouseup: () => {
        isMouseDownOnChartRef.current = false;
        resetViewport();
      },
    }),
    [resetViewport],
  );

  const options: EChartsOption = useMemo(
    () => ({
      grid: {
        left: 40,
        right: 40,
        top: 4,
        bottom: 4,
        // containLabel: false,
      },
      title: title
        ? {
            text: title,
            left: "center",
            top: 0,
            textStyle: {
              fontSize: 16,
              fontWeight: "bold",
            },
          }
        : undefined,
      tooltip: showTooltip
        ? {
            trigger: "item",
            formatter: (params: TooltipComponentFormatterCallbackParams) => {
              const first = Array.isArray(params) ? params[0] : params;
              if (!first) return "";
              const { name, value } = first;
              return `${name}<br/>${first.marker ?? ""}${name}: ${value}`;
            },
          }
        : undefined,
      series: [
        {
          type: "treemap",
          data: filteredData,
          roam,
          nodeClick,
          left: 5,
          right: 5,
          top: 5,
          bottom: 5,
          visibleMin: 50,
          scaleLimit: {
            min: 1,
            max: 2,
          },
          breadcrumb: breadcrumb
            ? {
                show: true,
                height: 22,
                emptyItemWidth: 25,
                itemStyle: {
                  color: theme.backgroundColor,
                  borderColor: theme.borderColor,
                  borderWidth: 1,
                  shadowBlur: 0,
                  shadowColor: "transparent",
                },
                emphasis: {
                  itemStyle: {
                    color: theme.backgroundColor,
                  },
                },
              }
            : { show: false },
          // label: {
          //   show: true,
          //   formatter: '{b}',
          //   fontSize: labelFontSize,
          //   color: theme.textColor,
          //   overflow: 'truncate',
          // },
          upperLabel: upperLabel.show
            ? {
                show: true,
                height: 30,
                fontSize: upperLabel.fontSize || 12,
                color: theme.textColor,
              }
            : { show: false, padding: 0 },
          itemStyle: {
            borderColor: itemStyle.borderColor || theme.borderColor,
            borderWidth: itemStyle.borderWidth || 2,
            gapWidth: itemStyle.gapWidth || 2,
          },
          emphasis: {
            itemStyle: {
              borderColor: emphasis.itemStyle?.borderColor || theme.borderColor,
              borderWidth: emphasis.itemStyle?.borderWidth || 3,
            },
            label:
              emphasis.label?.show !== false
                ? {
                    show: true,
                    fontSize: emphasis.label?.fontSize || 14,
                    fontWeight: "bold",
                  }
                : { show: false },
          },
          visualDimension,
          levels: levels || [
            {
              itemStyle: {
                borderColor: "transparent",
                borderWidth: 1,
                gapWidth: 1,
              },
              upperLabel: {
                show: false,
              },
            },
            {
              itemStyle: {
                borderColor: "transparent",
                borderWidth: 1,
                gapWidth: 1,
              },
            },
          ],
        },
      ],
    }),
    [
      filteredData,
      title,
      showTooltip,
      visualDimension,
      roam,
      nodeClick,
      breadcrumb,
      labelFontSize,
      upperLabel,
      itemStyle,
      emphasis,
      levels,
      theme,
    ],
  );

  return (
    <BaseChart<InferChartPayloadFromData<D>>
      options={options}
      onChartReady={handleChartReady}
      onEvents={onEvents}
      {...props}
    />
  );
}

export const TreeMapChart = TreeMapChartInner;

export default TreeMapChart;
