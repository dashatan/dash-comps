import type { ListParams } from "@dash/logistics-contracts";
import { listParamsSchema } from "@dash/logistics-contracts";

export function parseListParams(
  query: Record<string, string | string[] | undefined>,
): ListParams {
  const filters: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(query)) {
    if (
      key === "page" ||
      key === "pageSize" ||
      key === "sortField" ||
      key === "sortOrder"
    ) {
      continue;
    }
    if (key.startsWith("filter.")) {
      const filterKey = key.slice("filter.".length);
      const raw = Array.isArray(value) ? value[0] : value;
      if (raw === undefined) continue;
      try {
        filters[filterKey] = JSON.parse(raw);
      } catch {
        filters[filterKey] = raw;
      }
    }
  }

  return listParamsSchema.parse({
    page: query.page,
    pageSize: query.pageSize,
    sortField: query.sortField,
    sortOrder: query.sortOrder,
    filters: Object.keys(filters).length ? filters : undefined,
  });
}
