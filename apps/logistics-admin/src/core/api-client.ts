import { API_BASE_URL } from "@/core/env";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${normalizedPath}`, window.location.origin);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.pathname + url.search;
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }
    throw new ApiError(
      response.status,
      `Request failed: ${response.status}`,
      body,
    );
  }
  return response.json() as Promise<T>;
}

export const apiClient = {
  get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    return fetch(buildUrl(path, params)).then(parseJson<T>);
  },
};

export function listParamsToQuery(
  params: import("@dash/logistics-contracts").ListParams,
): Record<string, string> {
  const query: Record<string, string> = {
    page: String(params.page),
    pageSize: String(params.pageSize),
  };
  if (params.sortField) query.sortField = params.sortField;
  if (params.sortOrder !== undefined)
    query.sortOrder = String(params.sortOrder);
  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      if (value === undefined || value === "") continue;
      query[`filter.${key}`] =
        typeof value === "string" ? value : JSON.stringify(value);
    }
  }
  return query;
}
