import { TableData } from "@/components/compound/table/types";
import { Params } from "@/lib/types";

// Configuration interface for parameter building
export interface ParamsConfig {
  defaultLimit?: number;
  defaultOffset?: number;
  orderingPrefix?: string;
  orderingSuffix?: string;
  includeFilters?: boolean;
  filterTransformers?: Record<string, (value: any) => any>;
}

// Default configuration
const DEFAULT_CONFIG: Required<ParamsConfig> = {
  defaultLimit: 10,
  defaultOffset: 0,
  orderingPrefix: "",
  orderingSuffix: "",
  includeFilters: true,
  filterTransformers: {},
};

// Type for ordering direction
export type OrderingDirection = "asc" | "desc" | "none";

// Interface for ordering configuration
export interface OrderingConfig {
  field?: string;
  direction: OrderingDirection;
  customOrdering?: string;
}

/**
 * Builds ordering string from sort configuration
 */
function buildOrdering(
  config: OrderingConfig,
  paramsConfig: ParamsConfig,
): string | undefined {
  const { field, direction, customOrdering } = config;
  const { orderingPrefix, orderingSuffix } = paramsConfig;

  // If custom ordering is provided, use it
  if (customOrdering) {
    return customOrdering;
  }

  // If no field or direction is 'none', return undefined
  if (!field || direction === "none") {
    return undefined;
  }

  // Build ordering string
  const prefix = direction === "desc" ? "-" : "";
  const ordering = `${prefix}${field}`;

  return `${orderingPrefix}${ordering}${orderingSuffix}`;
}

/**
 * Transforms filters using configured transformers
 */
function transformFilters(
  filters: Record<string, any> | undefined,
  config: ParamsConfig,
): Record<string, any> {
  if (!filters || !config.includeFilters) {
    return {};
  }

  const transformed: Record<string, any> = {};

  for (const [key, value] of Object.entries(filters)) {
    const transformer = config.filterTransformers?.[key];
    transformed[key] = transformer ? transformer(value) : value;
  }

  return transformed;
}

/**
 * Validates and normalizes pagination parameters
 */
function normalizePagination(
  config: ParamsConfig,
  rows?: number,
  offset?: number,
): { limit?: number; offset?: number } {
  return {
    limit: rows ?? config.defaultLimit,
    offset: offset ?? config.defaultOffset,
  };
}

/**
 * Determines ordering direction from sort order
 */
function getOrderingDirection(sortOrder: number | null | undefined): OrderingDirection {
  if (sortOrder === null || sortOrder === undefined || sortOrder === 0) {
    return "none";
  }
  return sortOrder === -1 ? "desc" : "asc";
}

/**
 * Enhanced getParams function with configuration support
 */
export function getParams(
  data: Partial<TableData>,
  config: Partial<ParamsConfig> = {},
): Partial<Params> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { rows, offset, sortOrder, sortField, filters } = data;

  // Normalize pagination
  const pagination = normalizePagination(mergedConfig, rows, offset);

  // Build ordering configuration
  const orderingConfig: OrderingConfig = {
    field: sortField,
    direction: getOrderingDirection(sortOrder),
    customOrdering: sortOrder && !sortField ? `${sortOrder}` : undefined,
  };

  // Build ordering string
  const ordering = buildOrdering(orderingConfig, mergedConfig);

  // Transform filters
  const transformedFilters = transformFilters(filters, mergedConfig);

  // Build final params object
  const params: Partial<Params> = {
    limit: pagination.limit,
    offset: pagination.offset,
    ...(ordering && { ordering }),
    ...transformedFilters,
  };

  return params;
}

/**
 * Creates a configured getParams function with preset configuration
 */
export function createGetParams(config: ParamsConfig) {
  return (data: Partial<TableData>) => getParams(data, config);
}

/**
 * Utility function to create filter transformers
 */
export function createFilterTransformers(
  transformers: Record<string, (value: any) => any>,
) {
  return transformers;
}
