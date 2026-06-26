import type {
  NumberRangeFilterValue,
  TableData,
} from "@/components/compound/table/types";
import type { ColorType } from "@/components/common/badge/color";

export type CommerceUserRow = {
  id: number;
  nameKey: (typeof TABLE_NAME_KEYS)[number];
  status: (typeof TABLE_STATUSES)[number];
  region: (typeof TABLE_REGIONS)[number];
  segment: (typeof TABLE_SEGMENTS)[number];
  tier: (typeof TABLE_TIERS)[number];
  category: (typeof TABLE_CATEGORIES)[number];
  orders: number;
  totalSpent: number;
  loyaltyScore: number;
  lastOrderAt: number;
  registeredAt: number;
  color: ColorType;
  subscriptionEnd: number;
  newsletterEnabled: boolean;
};

export const TABLE_ROW_COUNT = 1247;

export const TABLE_REGIONS = [
  "tehran",
  "isfahan",
  "shiraz",
  "tabriz",
  "mashhad",
  "ahvaz",
  "kerman",
  "yazd",
] as const;

export const TABLE_SEGMENTS = [
  "retail",
  "wholesale",
  "enterprise",
  "subscription",
  "marketplace",
] as const;

export const TABLE_STATUSES = [
  "active",
  "pending",
  "inactive",
  "churned",
] as const;

export const TABLE_TIERS = [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "vip",
] as const;

export const TABLE_CATEGORIES = [
  "electronics",
  "fashion",
  "home",
  "beauty",
  "food",
] as const;

export const TABLE_NAME_KEYS = [
  "sara",
  "ali",
  "mina",
  "reza",
  "leila",
  "amir",
  "neda",
  "hassan",
  "fatemeh",
  "karim",
  "zahra",
  "omar",
] as const;

const STATUS_CYCLE = TABLE_STATUSES;
const REGION_CYCLE = TABLE_REGIONS;
const SEGMENT_CYCLE = TABLE_SEGMENTS;
const TIER_CYCLE = TABLE_TIERS;
const CATEGORY_CYCLE = TABLE_CATEGORIES;
const NAME_CYCLE = TABLE_NAME_KEYS;
const COLOR_CYCLE: ColorType[] = [
  "green",
  "yellow",
  "red",
  "blue",
  "teal",
  "orange",
  "indigo",
  "gray",
];

function daysAgo(days: number): number {
  return Date.now() - days * 86_400_000;
}

function buildRow(id: number): CommerceUserRow {
  return {
    id,
    nameKey: NAME_CYCLE[id % NAME_CYCLE.length],
    status: STATUS_CYCLE[id % STATUS_CYCLE.length],
    region: REGION_CYCLE[id % REGION_CYCLE.length],
    segment: SEGMENT_CYCLE[id % SEGMENT_CYCLE.length],
    tier: TIER_CYCLE[id % TIER_CYCLE.length],
    category: CATEGORY_CYCLE[id % CATEGORY_CYCLE.length],
    orders: 3 + (id % 120),
    totalSpent: 250_000 + (id % 500) * 18_500,
    loyaltyScore: 15 + (id % 85),
    lastOrderAt: daysAgo(3 + (id % 90)),
    registeredAt: daysAgo(120 + (id % 900)),
    color: COLOR_CYCLE[id % COLOR_CYCLE.length],
    subscriptionEnd: daysAgo(-(30 + (id % 720))),
    newsletterEnabled: id % 4 !== 0,
  };
}

export const TABLE_ALL_ROWS: CommerceUserRow[] = Array.from(
  { length: TABLE_ROW_COUNT },
  (_, i) => buildRow(i + 1),
);

function asNumberRange(value: unknown): NumberRangeFilterValue | undefined {
  if (!Array.isArray(value)) return undefined;
  return [value[0] as number | undefined, value[1] as number | undefined];
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return [value];
  return [];
}

export function filterAndSortTableRows<
  T extends {
    id: number;
    name: string;
    status: string;
    region: string;
    segment: string;
    orders: number;
    totalSpent: number;
    lastOrderAt: number;
    registeredAt: number;
    loyaltyScore: number;
  },
>(rows: T[], state: TableData): T[] {
  let result = [...rows];

  const name = state.filters?.name as string | undefined;
  if (name?.trim()) {
    const q = name.trim().toLowerCase();
    result = result.filter((r) => r.name.toLowerCase().includes(q));
  }

  const status = state.filters?.status as string | undefined;
  if (status) {
    result = result.filter((r) => r.status === status);
  }

  const regions = asStringArray(state.filters?.region);
  if (regions.length) {
    result = result.filter((r) => regions.includes(r.region));
  }

  const segment = state.filters?.segment as string | undefined;
  if (segment) {
    result = result.filter((r) => r.segment === segment);
  }

  const ordersRange = asNumberRange(state.filters?.orders);
  if (ordersRange) {
    const [min, max] = ordersRange;
    if (min !== undefined) result = result.filter((r) => r.orders >= min);
    if (max !== undefined) result = result.filter((r) => r.orders <= max);
  }

  const orderAfter = state.filters?.lastOrderAt as
    | number
    | number[]
    | undefined;
  if (orderAfter !== undefined) {
    const ts = Array.isArray(orderAfter) ? orderAfter[0] : orderAfter;
    if (typeof ts === "number") {
      result = result.filter((r) => r.lastOrderAt >= ts);
    }
  }

  const sortField = state.sortField;
  const sortOrder = state.sortOrder;
  if (sortField && sortOrder) {
    const dir = sortOrder === 1 ? 1 : -1;
    result.sort((a, b) => {
      switch (sortField) {
        case "id":
          return (a.id - b.id) * dir;
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "orders":
          return (a.orders - b.orders) * dir;
        case "totalSpent":
          return (a.totalSpent - b.totalSpent) * dir;
        case "registeredAt":
          return (a.registeredAt - b.registeredAt) * dir;
        case "loyaltyScore":
          return (a.loyaltyScore - b.loyaltyScore) * dir;
        default:
          return 0;
      }
    });
  }

  return result;
}

export function paginateTableRows<T>(rows: T[], state: TableData): T[] {
  const page = state.page ?? 0;
  const rowsPerPage = state.rows ?? 15;
  const start = page * rowsPerPage;
  return rows.slice(start, start + rowsPerPage);
}
