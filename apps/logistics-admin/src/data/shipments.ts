import type { NumberRangeFilterValue, TableData } from "@/components/compound/table/types";
import {
  EU_CORRIDORS,
  EU_HUBS,
  SHIPMENT_STATUSES,
  daysAgo,
  daysFromNow,
  getCorridorById,
  getHubById,
  type EuCorridor,
  type EuCountryCode,
  type EuRegion,
  type ShipmentStatus,
} from "@/data/european-context";
import {
  ASSIGNMENT_COUNT,
  CUSTOMER_COUNT,
  DRIVER_COUNT,
  SHIPMENT_COUNT,
  VEHICLE_COUNT,
} from "@/data/entity-counts";

export type Shipment = {
  id: number;
  trackingNumber: string;
  status: ShipmentStatus;
  corridorId: EuCorridor["id"];
  originHubId: EuCorridor["originHubId"];
  destinationHubId: EuCorridor["destinationHubId"];
  originCity: string;
  destinationCity: string;
  countryCode: EuCountryCode;
  region: EuRegion;
  customerId: number;
  vehicleId: number;
  driverId: number;
  weightKg: number;
  costEur: number;
  revenueEur: number;
  distanceKm: number;
  crossBorder: boolean;
  scheduledAt: number;
  deliveredAt: number | null;
  onTime: boolean;
};

export { SHIPMENT_COUNT } from "@/data/entity-counts";

function buildShipment(id: number): Shipment {
  const corridor = EU_CORRIDORS[id % EU_CORRIDORS.length];
  const origin = getHubById(corridor.originHubId);
  const destination = getHubById(corridor.destinationHubId);
  const status = SHIPMENT_STATUSES[id % SHIPMENT_STATUSES.length];
  const crossBorder = origin.countryCode !== destination.countryCode;
  const weightKg = 120 + (id % 180) * 25;
  const distanceKm = corridor.distanceKm + (id % 40);
  const costEur = Math.round(180 + distanceKm * 0.85 + weightKg * 0.12);
  const revenueEur = Math.round(costEur * (1.12 + (id % 8) * 0.02));
  const scheduledAt = daysAgo(45 - (id % 45));
  const isDelivered = status === "delivered";
  const isDelayed = status === "delayed";
  const deliveredAt = isDelivered || isDelayed
    ? scheduledAt + (isDelayed ? 36 : 22) * 3_600_000
    : status === "in_transit"
      ? null
      : status === "pending"
        ? null
        : null;
  const onTime = isDelivered ? id % 9 !== 0 : isDelayed ? false : status === "cancelled" ? false : true;

  return {
    id,
    trackingNumber: `EU-${2026}-${String(id).padStart(6, "0")}`,
    status,
    corridorId: corridor.id,
    originHubId: origin.id,
    destinationHubId: destination.id,
    originCity: origin.city,
    destinationCity: destination.city,
    countryCode: origin.countryCode,
    region: origin.region,
    customerId: 1 + (id % CUSTOMER_COUNT),
    vehicleId: 1 + (id % VEHICLE_COUNT),
    driverId: 1 + (id % DRIVER_COUNT),
    weightKg,
    costEur,
    revenueEur,
    distanceKm,
    crossBorder,
    scheduledAt,
    deliveredAt,
    onTime,
  };
}

export const SHIPMENTS: Shipment[] = Array.from(
  { length: SHIPMENT_COUNT },
  (_, i) => buildShipment(i + 1),
);

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return [value];
  return [];
}

function asNumberRange(value: unknown): NumberRangeFilterValue | undefined {
  if (!Array.isArray(value)) return undefined;
  return [value[0] as number | undefined, value[1] as number | undefined];
}

export function filterAndSortShipments(rows: Shipment[], state: TableData): Shipment[] {
  let result = [...rows];

  const tracking = state.filters?.trackingNumber as string | undefined;
  if (tracking?.trim()) {
    const q = tracking.trim().toLowerCase();
    result = result.filter((r) => r.trackingNumber.toLowerCase().includes(q));
  }

  const status = state.filters?.status as string | undefined;
  if (status) {
    result = result.filter((r) => r.status === status);
  }

  const regions = asStringArray(state.filters?.region);
  if (regions.length) {
    result = result.filter((r) => regions.includes(r.region));
  }

  const country = state.filters?.countryCode as string | undefined;
  if (country) {
    result = result.filter((r) => r.countryCode === country);
  }

  const corridor = state.filters?.corridorId as string | undefined;
  if (corridor) {
    result = result.filter((r) => r.corridorId === corridor);
  }

  const revenueRange = asNumberRange(state.filters?.revenueEur);
  if (revenueRange) {
    const [min, max] = revenueRange;
    if (min !== undefined) result = result.filter((r) => r.revenueEur >= min);
    if (max !== undefined) result = result.filter((r) => r.revenueEur <= max);
  }

  const scheduledAfter = state.filters?.scheduledAt as number | number[] | undefined;
  if (scheduledAfter !== undefined) {
    const ts = Array.isArray(scheduledAfter) ? scheduledAfter[0] : scheduledAfter;
    if (typeof ts === "number") {
      result = result.filter((r) => r.scheduledAt >= ts);
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
        case "trackingNumber":
          return a.trackingNumber.localeCompare(b.trackingNumber) * dir;
        case "status":
          return a.status.localeCompare(b.status) * dir;
        case "originCity":
          return a.originCity.localeCompare(b.originCity) * dir;
        case "destinationCity":
          return a.destinationCity.localeCompare(b.destinationCity) * dir;
        case "weightKg":
          return (a.weightKg - b.weightKg) * dir;
        case "revenueEur":
          return (a.revenueEur - b.revenueEur) * dir;
        case "costEur":
          return (a.costEur - b.costEur) * dir;
        case "scheduledAt":
          return (a.scheduledAt - b.scheduledAt) * dir;
        default:
          return 0;
      }
    });
  }

  return result;
}

export function paginateShipments<T>(rows: T[], state: TableData): T[] {
  const page = state.page ?? 0;
  const rowsPerPage = state.rows ?? 15;
  const start = page * rowsPerPage;
  return rows.slice(start, start + rowsPerPage);
}

export function getActiveShipments(): Shipment[] {
  return SHIPMENTS.filter((s) => s.status === "in_transit" || s.status === "pending");
}

export function getDelayedShipments(): Shipment[] {
  return SHIPMENTS.filter((s) => s.status === "delayed");
}

export function getShipmentsInDateRange(startMs: number, endMs: number): Shipment[] {
  return SHIPMENTS.filter((s) => s.scheduledAt >= startMs && s.scheduledAt <= endMs);
}

export function getMonthToDateRange(): { start: number; end: number } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  return { start, end: Date.now() };
}

export { EU_CORRIDORS, EU_HUBS, getCorridorById, daysFromNow };
