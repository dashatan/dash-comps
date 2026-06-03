import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { getHexColor } from "@dash/core/utils";

export function useThemeColors() {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState({
    background: "",
    foreground: "",
    primary: "",
    secondary: "",
    error: "",
    success: "",
    info: "",
    warning: "",
    border: "",
    muted: "",
    chart1: "",
    chart2: "",
    chart3: "",
    chart4: "",
    chart5: "",
    chart6: "",
    chart7: "",
    chart8: "",
    chart9: "",
    chart10: "",
    chart11: "",
    chart12: "",
    chartRange1: "",
    chartRange3: "",
    chartRange4: "",
    chartRange5: "",
    chartRange6: "",
    chartMap: "",
    chartMapLight: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Force a small delay to ensure CSS variables are updated
    const timeoutId = setTimeout(() => {
      setColors({
        background: getHexColor("--background"),
        foreground: getHexColor("--foreground"),
        border: getHexColor("--border"),
        muted: getHexColor("--muted"),
        chart1: getHexColor("--chart-1"),
        chart2: getHexColor("--chart-2"),
        chart3: getHexColor("--chart-3"),
        chart4: getHexColor("--chart-4"),
        chart5: getHexColor("--chart-5"),
        chart6: getHexColor("--chart-6"),
        chart7: getHexColor("--chart-7"),
        chart8: getHexColor("--chart-8"),
        chart9: getHexColor("--chart-9"),
        chart10: getHexColor("--chart-10"),
        chart11: getHexColor("--chart-11"),
        chart12: getHexColor("--chart-12"),
        chartRange1: getHexColor("--color-chart-range-1"),
        chartRange3: getHexColor("--color-chart-range-3"),
        chartRange4: getHexColor("--color-chart-range-4"),
        chartRange5: getHexColor("--color-chart-range-5"),
        chartRange6: getHexColor("--color-chart-range-6"),
        chartMap: getHexColor("--chart-map"),
        chartMapLight: getHexColor("--chart-map-light"),
        primary: getHexColor("--color-primary"),
        secondary: getHexColor("--color-secondary"),
        error: getHexColor("--color-error"),
        success: getHexColor("--color-success"),
        info: getHexColor("--color-info"),
        warning: getHexColor("--color-warning"),
      });
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [resolvedTheme]);

  return colors;
}
