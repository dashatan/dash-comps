import { graphic, SeriesOption } from "echarts";

export const getTheme = () => {
  const root = document.documentElement;
  const style = getComputedStyle(root);

  return {
    fontFamily:
      style.getPropertyValue("--font-family").trim() || "Inter, system-ui, sans-serif",
    backgroundColor: style.getPropertyValue("--card").trim(),
    textColor: style.getPropertyValue("--foreground").trim(),
    borderColor: style.getPropertyValue("--border").trim(),
    mutedColor: style.getPropertyValue("--muted").trim(),
    fontSize: style.getPropertyValue("--font-size").trim() || "14px",
    chartColors: {
      "chart-1": style.getPropertyValue("--chart-1").trim(),
      "chart-2": style.getPropertyValue("--chart-2").trim(),
      "chart-3": style.getPropertyValue("--chart-3").trim(),
      "chart-4": style.getPropertyValue("--chart-4").trim(),
      "chart-5": style.getPropertyValue("--chart-5").trim(),
      "chart-6": style.getPropertyValue("--chart-6").trim(),
      "chart-7": style.getPropertyValue("--chart-7").trim(),
      "chart-8": style.getPropertyValue("--chart-8").trim(),
      "chart-9": style.getPropertyValue("--chart-9").trim(),
      "chart-10": style.getPropertyValue("--chart-10").trim(),
      "chart-11": style.getPropertyValue("--chart-11").trim(),
      "chart-12": style.getPropertyValue("--chart-12").trim(),
    },
    doughnutColors: {
      "doughnut-1": style.getPropertyValue("--color-doughnut-1").trim(),
      "doughnut-2": style.getPropertyValue("--color-doughnut-2").trim(),
      "doughnut-3": style.getPropertyValue("--color-doughnut-3").trim(),
      "doughnut-4": style.getPropertyValue("--color-doughnut-4").trim(),
      "doughnut-5": style.getPropertyValue("--color-doughnut-5").trim(),
      "doughnut-6": style.getPropertyValue("--color-doughnut-6").trim(),
      "doughnut-7": style.getPropertyValue("--color-doughnut-7").trim(),
    },
    mapColors: {
      "range-colors": [
        style.getPropertyValue("--chart-map").trim(),
        style.getPropertyValue("--chart-map-light").trim(),
      ],
    },
  };
};

function oklchToRgba(oklch: string): { r: number; g: number; b: number } {
  // Extract values from oklch string (e.g., "oklch(0.5 0.2 240)")
  const match = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) return { r: 0, g: 0, b: 0 };

  const [, l, c, h] = match.map(Number);

  // Convert OKLCH to RGB using a simplified conversion
  // This is a basic approximation - for more accurate conversion,
  // you might want to use a color conversion library
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const bValue = c * Math.sin(hRad);

  // Convert to RGB
  const r = Math.round((l + 1.402 * a) * 255);
  const g = Math.round((l - 0.344136 * a - 0.714136 * bValue) * 255);
  const b = Math.round((l + 1.772 * bValue) * 255);

  return {
    r: Math.max(0, Math.min(255, r)),
    g: Math.max(0, Math.min(255, g)),
    b: Math.max(0, Math.min(255, b)),
  };
}

function addOpacityToColor(color: string, opacity: number): string {
  // If the color is already in rgba format, update the opacity
  if (color.startsWith("rgba")) {
    return color.replace(/[\d.]+\)$/, `${opacity})`);
  }
  // If the color is in oklch format, convert to rgba
  if (color.startsWith("oklch")) {
    const { r, g, b } = oklchToRgba(color);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  // If the color is in hex format, convert to rgba
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
}

export const createSeriesConfig = (
  series: any,
  index: number,
  theme?: ReturnType<typeof getTheme>,
): SeriesOption => {
  const chartColors: Record<string, string> = theme?.chartColors ?? {};
  const colorKeys = Object.keys(chartColors);
  const seriesColor =
    series.color ||
    (colorKeys.length > 0
      ? chartColors[colorKeys[index % colorKeys.length]!]
      : undefined);

  // Check if it's a pie chart
  if (series.type === "pie") {
    return {
      ...series,
      color: Object.values(chartColors),

      label: {
        color: theme?.textColor,
        fontSize: 12,
        fontFamily: theme?.fontFamily,
        ...series?.label,
      },
      emphasis: {
        ...series.emphasis,
        itemStyle: {
          ...series?.emphasis?.itemStyle,
          color: "inherit",
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.2)",
        },
        label: {
          ...series?.emphasis?.label,
          fontWeight: "bold",
        },
      },
    };
  }

  // For non-pie charts, use the existing styling
  return {
    ...series,
    color: seriesColor,
    itemStyle: { ...series?.itemStyle, color: seriesColor },
    lineStyle: { ...series?.lineStyle, color: seriesColor },
    areaStyle: {
      opacity: 0.2,
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: seriesColor },
        { offset: 1, color: theme?.backgroundColor || "transparent" },
      ]),
      ...series?.areaStyle,
    },
    emphasis: {
      ...series.emphasis,
      itemStyle: { ...series?.emphasis?.itemStyle, color: seriesColor },
      lineStyle: { ...series?.emphasis?.lineStyle, color: seriesColor },
      areaStyle: {
        ...series?.emphasis?.areaStyle,
        color: "inherit",
      },
    },
  };
};

export const createTooltipFormatter = (theme: ReturnType<typeof getTheme>) => {
  return (params: any) => {
    if (Array.isArray(params)) {
      return (
        `<span style="color: ${theme.textColor}; font-family: ${theme.fontFamily}; font-weight: bold;">${params[0].name}</span><br/>` +
        params
          .map(
            (param) =>
              `<span style="color: ${theme.textColor}; font-family: ${theme.fontFamily};">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${param.color};"></span>
                  <span style="margin-left: 5px; margin-right: 5px;">${param.seriesName}: ${param.value.toLocaleString()}</span>
                </span>`,
          )
          .join("<br/>")
      );
    }
    return (
      `<div style="color: ${theme.textColor}; font-family: ${theme.fontFamily};">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${params.color};"></span>
          <strong style="margin-left: 5px; margin-right: 5px;">${params.name}</strong>
        </div>` +
      `<div style="display: flex; align-items: center; ">
          <strong style="">${params.value.toLocaleString()}</strong>
          <strong style="margin-left: 5px; margin-right: 5px;">(${params.percent}%)</strong>
        </div>`
    );
  };
};

export const negativeFormatter = (value: number | string): string => {
  let num = Number(value);
  if (isNaN(num)) return String(value);
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const formatted = Number.isInteger(absNum)
    ? absNum.toLocaleString()
    : absNum.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  return isNegative ? formatted + "-" : formatted;
};
