import type {
  AssignmentDto,
  DriverDto,
  ListParams,
  Paginated,
  ShipmentDto,
  VehicleDto,
} from "@dash/logistics-contracts";
import { paginate } from "@dash/logistics-contracts";
import { getDriverDisplayName } from "./fleet";

type NumberRangeFilterValue = [number | undefined, number | undefined];

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return [value];
  return [];
}

function asNumberRange(value: unknown): NumberRangeFilterValue | undefined {
  if (!Array.isArray(value)) return undefined;
  const [min, max] = value;
  return [
    typeof min === "number" ? min : undefined,
    typeof max === "number" ? max : undefined,
  ];
}

function getFilterString(
  filters: ListParams["filters"],
  key: string,
): string | undefined {
  const value = filters?.[key];
  return typeof value === "string" ? value : undefined;
}

function sortRows<T extends { id: number }>(
  rows: T[],
  params: ListParams,
  options?: { nameField?: keyof T & string },
): T[] {
  const { sortField, sortOrder } = params;
  if (!sortField || !sortOrder) return rows;

  const dir = sortOrder === 1 ? 1 : -1;
  return [...rows].sort((a, b) => {
    const aRec = a as Record<string, unknown>;
    const bRec = b as Record<string, unknown>;
    const aVal = aRec[sortField];
    const bVal = bRec[sortField];

    if (
      sortField === options?.nameField &&
      typeof aVal === "string" &&
      typeof bVal === "string"
    ) {
      return aVal.localeCompare(bVal) * dir;
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * dir;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * dir;
    }
    return 0;
  });
}

export function filterShipments(
  rows: ShipmentDto[],
  params: ListParams,
): ShipmentDto[] {
  let result = [...rows];
  const filters = params.filters;

  const tracking = getFilterString(filters, "trackingNumber");
  if (tracking?.trim()) {
    const q = tracking.trim().toLowerCase();
    result = result.filter((r) => r.trackingNumber.toLowerCase().includes(q));
  }

  const status = getFilterString(filters, "status");
  if (status) {
    result = result.filter((r) => r.status === status);
  }

  const regions = asStringArray(filters?.region);
  if (regions.length) {
    result = result.filter((r) => regions.includes(r.region));
  }

  const country = getFilterString(filters, "countryCode");
  if (country) {
    result = result.filter((r) => r.countryCode === country);
  }

  const corridor = getFilterString(filters, "corridorId");
  if (corridor) {
    result = result.filter((r) => r.corridorId === corridor);
  }

  const revenueRange = asNumberRange(filters?.revenueEur);
  if (revenueRange) {
    const [min, max] = revenueRange;
    if (min !== undefined) result = result.filter((r) => r.revenueEur >= min);
    if (max !== undefined) result = result.filter((r) => r.revenueEur <= max);
  }

  const scheduledAfter = filters?.scheduledAt;
  if (scheduledAfter !== undefined) {
    const ts = Array.isArray(scheduledAfter)
      ? scheduledAfter[0]
      : scheduledAfter;
    if (typeof ts === "number") {
      result = result.filter((r) => r.scheduledAt >= ts);
    }
  }

  const { sortField, sortOrder } = params;
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

export function filterVehicles(
  rows: VehicleDto[],
  params: ListParams,
): VehicleDto[] {
  let result = [...rows];
  const filters = params.filters;

  const plate = getFilterString(filters, "plate");
  if (plate?.trim()) {
    const q = plate.trim().toLowerCase();
    result = result.filter((r) => r.plate.toLowerCase().includes(q));
  }

  const status = getFilterString(filters, "status");
  if (status) result = result.filter((r) => r.status === status);

  const type = getFilterString(filters, "type");
  if (type) result = result.filter((r) => r.type === type);

  const regions = asStringArray(filters?.region);
  if (regions.length) result = result.filter((r) => regions.includes(r.region));

  const country = getFilterString(filters, "countryCode");
  if (country) result = result.filter((r) => r.countryCode === country);

  return sortRows(result, params);
}

export function filterDrivers(
  rows: DriverDto[],
  params: ListParams,
): DriverDto[] {
  let result = [...rows];
  const filters = params.filters;

  const name = getFilterString(filters, "name");
  if (name?.trim()) {
    const q = name.trim().toLowerCase();
    result = result.filter((r) =>
      getDriverDisplayName(r).toLowerCase().includes(q),
    );
  }

  const country = getFilterString(filters, "licenseCountry");
  if (country) result = result.filter((r) => r.licenseCountry === country);

  return sortRows(result, params, { nameField: "firstName" });
}

export function filterAssignments(
  rows: AssignmentDto[],
  params: ListParams,
): AssignmentDto[] {
  let result = [...rows];
  const filters = params.filters;

  const status = getFilterString(filters, "status");
  if (status) result = result.filter((r) => r.status === status);

  const regions = asStringArray(filters?.region);
  if (regions.length) result = result.filter((r) => regions.includes(r.region));

  const corridor = getFilterString(filters, "corridorLabel");
  if (corridor?.trim()) {
    const q = corridor.trim().toLowerCase();
    result = result.filter((r) => r.corridorLabel.toLowerCase().includes(q));
  }

  return sortRows(result, params);
}

export function listShipments(
  rows: ShipmentDto[],
  params: ListParams,
): Paginated<ShipmentDto> {
  return paginate(filterShipments(rows, params), params);
}

export function listVehicles(
  rows: VehicleDto[],
  params: ListParams,
): Paginated<VehicleDto> {
  return paginate(filterVehicles(rows, params), params);
}

export function listDrivers(
  rows: DriverDto[],
  params: ListParams,
): Paginated<DriverDto> {
  return paginate(filterDrivers(rows, params), params);
}

export function listAssignments(
  rows: AssignmentDto[],
  params: ListParams,
): Paginated<AssignmentDto> {
  return paginate(filterAssignments(rows, params), params);
}
