import type {
  DefaultLabelFormatterCallbackParams,
  TooltipComponentFormatterCallbackParams,
} from "echarts";
import {
  tooltipCallbackParamsFirst,
  tooltipFormatterParamsData,
} from "./echarts-utils";

const svgAttrs =
  'xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

/** Inline SVG snippets for ECharts HTML tooltips (not React). */
export const TOOLTIP_ICONS = {
  calendar: `<svg ${svgAttrs}><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  chart: `<svg ${svgAttrs}><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 16h8"/><path d="M7 11h12"/><path d="M7 6h3"/></svg>`,
  devices: `<svg ${svgAttrs}><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/></svg>`,
  hash: `<svg ${svgAttrs}><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>`,
  "map-pin": `<svg ${svgAttrs}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  percent: `<svg ${svgAttrs}><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
  users: `<svg ${svgAttrs}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  activity: `<svg ${svgAttrs}><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a2 2 0 0 1-3.88 0L8.75 8.23a2 2 0 0 0-1.93-1.46H4"/></svg>`,
  check: `<svg ${svgAttrs}><path d="M20 6 9 17l-5-5"/></svg>`,
  street: `<svg ${svgAttrs}><path d="M16.75 12h3.632a1 1 0 0 0 .74-1.673l-2.895-4.18A2 2 0 0 0 16.158 6H7.842a2 2 0 0 0-1.667.847l-2.895 4.18A1 1 0 0 0 4.018 12H7.75"/><circle cx="12" cy="13" r="2"/><path d="M12 15v6"/></svg>`,
  camera: `<svg ${svgAttrs}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  speed: `<svg ${svgAttrs}><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
  plate: `<svg ${svgAttrs}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/><path d="M10 9v6"/><path d="M14 9v6"/></svg>`,
  violation: `<svg ${svgAttrs}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
  "red-light": `<svg ${svgAttrs}><path d="M12 3v18"/><circle cx="12" cy="8" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/><path d="M18 6h2a1 1 0 0 1 1 1v2"/><circle cx="19" cy="7.5" r="1"/></svg>`,
  traffic: `<svg ${svgAttrs}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
  x: `<svg ${svgAttrs}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
} as const;

export type TooltipIcon = keyof typeof TOOLTIP_ICONS;

export type TooltipFormatterPoint = {
  seriesName: string;
  seriesColor?: string;
  value: unknown;
};

export type TooltipFormatterContext = {
  /** Series color for the hovered point (first series on axis tooltips). */
  seriesColor?: string;
  /** One entry per series at the hovered axis category. */
  points?: TooltipFormatterPoint[];
};

export type TooltipItem = {
  /** Predefined icon key — rendered as inline SVG in the tooltip row. */
  icon?: TooltipIcon;
  /** Shows a colored circle; uses `color` when set, otherwise the hovered series color from `context`. */
  withColorDot?: boolean;
  color?: string;
  name: string;
  value: string | number;
};

export type ChartTooltipConfig<T = unknown> = {
  tooltipItems?: (data: T, context: TooltipFormatterContext) => TooltipItem[];
  /** When omitted, no title row is rendered. */
  tooltipTitle?: (
    data: T | undefined,
    context: TooltipFormatterContext,
  ) => string | undefined;
};

export const CHART_TOOLTIP_HTML_STYLE = {
  backgroundColor: "transparent",
  borderWidth: 0,
  padding: 0,
  hideDelay: 100,
} as const;

function formatTooltipValue(value: string | number): string {
  return typeof value === "number" ? value.toLocaleString() : value;
}

function paramSeriesColor(
  param: DefaultLabelFormatterCallbackParams,
): string | undefined {
  const c = param.color;
  return typeof c === "string" ? c : undefined;
}

export function buildTooltipFormatterContext(
  params: TooltipComponentFormatterCallbackParams,
): TooltipFormatterContext {
  if (Array.isArray(params)) {
    const points: TooltipFormatterPoint[] = params.map((p) => ({
      seriesName: p.seriesName ?? "",
      seriesColor: paramSeriesColor(p),
      value: p.value,
    }));
    return { seriesColor: points[0]?.seriesColor, points };
  }

  const first = tooltipCallbackParamsFirst(params);
  if (!first) return {};

  const seriesColor = paramSeriesColor(first);
  return {
    seriesColor,
    points: [
      {
        seriesName: first.seriesName ?? "",
        seriesColor,
        value: first.value,
      },
    ],
  };
}

export function resolveTooltipItemColors(
  items: TooltipItem[],
  context?: TooltipFormatterContext,
): TooltipItem[] {
  return items.map((item, index) => {
    if (!item.withColorDot || item.color) return item;
    const seriesColor =
      context?.points?.[index]?.seriesColor ??
      context?.seriesColor ??
      context?.points?.[0]?.seriesColor;
    return seriesColor ? { ...item, color: seriesColor } : item;
  });
}

function renderColorDot(color: string): string {
  return `<span class="inline-block h-2  w-2 shrink-0 rounded-full" style="background-color:${color}"></span>`;
}

function renderTooltipIcon(icon: TooltipIcon): string {
  return `<span class="inline-flex shrink-0 items-center text-gray-300">${TOOLTIP_ICONS[icon]}</span>`;
}

function formatTooltipRow(item: TooltipItem): string {
  const parts: string[] = [];

  if (item.withColorDot && item.color) {
    parts.push(renderColorDot(item.color));
  }
  if (item.icon) {
    parts.push(renderTooltipIcon(item.icon));
  }

  const leading = parts.length > 0 ? parts.join("") : "";

  return `<div class="flex items-center gap-2 pe-4 w-full justify-start">
            <div class="flex items-center ">
              ${leading && `<span class="w-3 px-1 flex items-center justify-center">${leading}</span>`}
              <span class="ps-1">${item.name}:</span>
            </div>
            <span>${formatTooltipValue(item.value)}</span>
          </div>`;
}

export function formatChartTooltipHtml(
  title?: string,
  items?: TooltipItem[],
  context?: TooltipFormatterContext,
): string {
  const resolvedItems = items ? resolveTooltipItemColors(items, context) : [];
  const rows = resolvedItems.map(formatTooltipRow).join("");
  const titleRow = title
    ? `<div class="flex items-center gap-2 font-semibold px-1">
         ${title}
       </div>`
    : "";

  return `<div class="text-sm bg-gray-800 text-gray-100 flex flex-col gap-2 w-full h-full p-2 rounded-lg">
            ${titleRow}
            ${rows}
          </div>`;
}

/** @deprecated Use formatChartTooltipHtml */
export const formatMapTooltipHtml = formatChartTooltipHtml;

function getTooltipItemData<T>(
  params: TooltipComponentFormatterCallbackParams,
): T | undefined {
  const raw = tooltipFormatterParamsData(params);
  if (raw != null && typeof raw === "object") return raw as T;
  return undefined;
}

function resolveTooltipTitle<T>(
  data: T | undefined,
  context: TooltipFormatterContext,
  tooltipTitle?: ChartTooltipConfig<T>["tooltipTitle"],
): string | undefined {
  if (!tooltipTitle) return undefined;
  const title = tooltipTitle(data, context);
  return title || undefined;
}

function axisTooltipItemsFromParams(
  params: DefaultLabelFormatterCallbackParams[],
): TooltipItem[] {
  return params.map((p) => ({
    name: p.seriesName ?? "",
    value: typeof p.value === "number" ? p.value : String(p.value ?? ""),
    withColorDot: true,
    color: paramSeriesColor(p),
  }));
}

export function createTooltipItemsFormatter<T>(config: ChartTooltipConfig<T>) {
  const { tooltipItems, tooltipTitle } = config;
  if (!tooltipItems) return undefined;

  return (params: TooltipComponentFormatterCallbackParams): string => {
    const context = buildTooltipFormatterContext(params);

    if (Array.isArray(params)) {
      const first = params[0];
      const rawData = first?.data;
      if (rawData != null && typeof rawData === "object") {
        const data = rawData as T;
        const title = resolveTooltipTitle(data, context, tooltipTitle);
        return formatChartTooltipHtml(
          title,
          tooltipItems(data, context),
          context,
        );
      }
      const title = resolveTooltipTitle(undefined, context, tooltipTitle);
      return formatChartTooltipHtml(
        title,
        axisTooltipItemsFromParams(params),
        context,
      );
    }

    const data = getTooltipItemData<T>(params);
    if (data != null) {
      const title = resolveTooltipTitle(data, context, tooltipTitle);
      return formatChartTooltipHtml(
        title,
        tooltipItems(data, context),
        context,
      );
    }

    const first = tooltipCallbackParamsFirst(params);
    const name = first?.name ?? "";
    const value = first?.value;
    const title = resolveTooltipTitle(undefined, context, tooltipTitle);
    return formatChartTooltipHtml(
      title,
      [
        {
          name,
          value: typeof value === "number" ? value : String(value ?? ""),
          withColorDot: true,
        },
      ],
      context,
    );
  };
}
