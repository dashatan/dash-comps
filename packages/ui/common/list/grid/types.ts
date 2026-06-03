import type { CSSProperties, ReactNode } from "react";

export type GridDefaultSort = {
  field: string;
  order: 1 | -1;
};

export type GridColumnClassName = {
  header?: string;
  body?: string;
  content?: string;
  td?: string;
  l1?: string;
  l2?: string;
};

export type GridColumn<T extends object = Record<string, unknown>> = {
  field?: keyof T;
  width?: number | string;
  header: string | ReactNode;
  body?: (data: T) => ReactNode;
  sortable?: boolean;
  className?: GridColumnClassName;
  headerClassName?: GridColumnClassName;
  bodyClassName?: GridColumnClassName;
  style?: CSSProperties;
};

export interface GridProps<T extends object = Record<string, unknown>> {
  columns: GridColumn<T>[];
  data?: T[];
  /** Fixed row height for body rows. Number = pixels. Default: 40 */
  rowHeight?: number | string;
  /** Fixed row height for the header row. Number = pixels. Default: 40 */
  headerHeight?: number | string;
  loading?: boolean;
  defaultSort?: GridDefaultSort;
  className?: {
    container?: string;
    header?: string;
    body?: string;
  };
  onCellClick?: (data: T, column: GridColumn<T>, rowIndex: number) => void;
  onSortChange?: (field: string | null, order: 1 | 0 | -1) => void;
}
