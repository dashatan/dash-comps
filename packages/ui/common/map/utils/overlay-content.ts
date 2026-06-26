import {
  TOOLTIP_ICONS,
  resolveTooltipItemColors,
  type TooltipItem,
} from "@/components/common/charts/tooltip";

function formatOverlayValue(value: string | number): string {
  return typeof value === "number" ? value.toLocaleString() : value;
}

function renderOverlayColorDot(color: string): string {
  return `<span class="sirat-map-overlay-dot" style="background-color:${color}"></span>`;
}

function renderOverlayIcon(icon: keyof typeof TOOLTIP_ICONS): string {
  return `<span class="sirat-map-overlay-icon">${TOOLTIP_ICONS[icon]}</span>`;
}

function formatOverlayRow(item: TooltipItem): string {
  const parts: string[] = [];

  if (item.withColorDot && item.color) {
    parts.push(renderOverlayColorDot(item.color));
  }
  if (item.icon) {
    parts.push(renderOverlayIcon(item.icon));
  }

  const hasLeading = parts.length > 0;

  const leading = parts.length > 0 ? parts.join("") : "";

  return `<div class="sirat-map-overlay-row">
    <div class="sirat-map-overlay-row-label">
      ${hasLeading ? `<span class="sirat-map-overlay-row-leading">${leading}</span>` : ""}
      <span>${item.name}:</span>
    </div>
    <span class="sirat-map-overlay-row-value">${formatOverlayValue(item.value)}</span>
  </div>`;
}

export function formatMapOverlayHtml(
  title?: string,
  items?: TooltipItem[],
): string {
  const resolvedItems = items ? resolveTooltipItemColors(items) : [];
  const rows = resolvedItems.map(formatOverlayRow).join("");
  const titleRow = title
    ? `<div class="sirat-map-overlay-title">${title}</div>`
    : "";

  return `<div class="sirat-map-overlay-content">${titleRow}${rows}</div>`;
}
