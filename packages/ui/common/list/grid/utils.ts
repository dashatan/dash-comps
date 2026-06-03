import type { CSSProperties } from "react";
import type { GridColumn } from "@/components/common/list/grid/types";

export const GRID_ROW_HEIGHT_VAR = "--grid-row-height";
export const GRID_HEADER_HEIGHT_VAR = "--grid-header-height";
export const DEFAULT_GRID_ROW_HEIGHT = 40;
export const DEFAULT_GRID_HEADER_HEIGHT = 40;

export function formatGridHeight(
  height?: number | string,
  fallback = DEFAULT_GRID_ROW_HEIGHT,
): string {
  if (height == null) return `${fallback}px`;
  return typeof height === "number" ? `${height}px` : height;
}

export function getGridStyle(options?: {
  rowHeight?: number | string;
  headerHeight?: number | string;
}): CSSProperties {
  return {
    [GRID_ROW_HEIGHT_VAR]: formatGridHeight(options?.rowHeight, DEFAULT_GRID_ROW_HEIGHT),
    [GRID_HEADER_HEIGHT_VAR]: formatGridHeight(
      options?.headerHeight,
      DEFAULT_GRID_HEADER_HEIGHT,
    ),
  } as CSSProperties;
}

export function formatGridColumnWidth(width?: number | string): string {
  if (width == null || width === "") {
    return "minmax(0, 1fr)";
  }
  return typeof width === "number" ? `${width}px` : width;
}

export function getGridTemplateColumns(columns: Pick<GridColumn, "width">[]): string {
  if (columns.length === 0) return "";
  if (columns.every((column) => column.width == null)) {
    return `repeat(${columns.length}, minmax(0, 1fr))`;
  }
  return columns.map((column) => formatGridColumnWidth(column.width)).join(" ");
}
