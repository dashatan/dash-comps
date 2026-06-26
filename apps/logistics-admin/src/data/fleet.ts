import type { TableData } from "@/components/compound/table/types";
import {
  EU_CORRIDORS,
  EU_HUBS,
  EU_COUNTRY_CODES,
  EU_REGIONS,
  buildEuPlate,
  daysAgo,
  getHubById,
  type EuCountryCode,
  type EuRegion,
} from "@/data/european-context";
import {
  ASSIGNMENT_COUNT,
  DRIVER_COUNT,
  SHIPMENT_COUNT,
  VEHICLE_COUNT,
} from "@/data/entity-counts";

export type Driver = {
  id: number;
  firstName: string;
  lastName: string;
  licenseCountry: EuCountryCode;
  depotHubId: (typeof EU_HUBS)[number]["id"];
};

export type Vehicle = {
  id: number;
  plate: string;
  type: "van" | "rigid" | "articulated";
  capacityKg: number;
  fuelConsumptionL100: number;
  depotHubId: (typeof EU_HUBS)[number]["id"];
  countryCode: EuCountryCode;
  region: EuRegion;
  status: "active" | "maintenance" | "idle";
};

export const VEHICLE_TYPES = ["van", "rigid", "articulated"] as const;
export const VEHICLE_STATUSES = ["active", "maintenance", "idle"] as const;

export const ASSIGNMENT_STATUSES = [
  "scheduled",
  "active",
  "completed",
  "cancelled",
] as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export type Assignment = {
  id: number;
  vehicleId: number;
  driverId: number;
  shipmentId: number | null;
  depotHubId: (typeof EU_HUBS)[number]["id"];
  region: EuRegion;
  status: AssignmentStatus;
  startAt: number;
  endAt: number | null;
  corridorLabel: string;
};

const DRIVER_FIRST_NAMES = [
  "Thomas", "Marie", "Jan", "Sofia", "Lars", "Elena", "Pieter", "Anna",
  "Marco", "Claire", "Henrik", "Isabella", "Klaus", "Nina", "Pavel",
] as const;

const DRIVER_LAST_NAMES = [
  "Müller", "Dubois", "Jansen", "Rossi", "Andersen", "Kowalski", "Schmidt",
  "Laurent", "Vermeulen", "García", "Novák", "Bergström", "Weber", "Moreau",
] as const;


export {
  ASSIGNMENT_COUNT,
  DRIVER_COUNT,
  VEHICLE_COUNT,
} from "@/data/entity-counts";

function buildDriver(id: number): Driver {
  const hub = EU_HUBS[id % EU_HUBS.length];
  return {
    id,
    firstName: DRIVER_FIRST_NAMES[id % DRIVER_FIRST_NAMES.length],
    lastName: DRIVER_LAST_NAMES[id % DRIVER_LAST_NAMES.length],
    licenseCountry: EU_COUNTRY_CODES[id % EU_COUNTRY_CODES.length],
    depotHubId: hub.id,
  };
}

function buildVehicle(id: number): Vehicle {
  const hub = EU_HUBS[id % EU_HUBS.length];
  const types: Vehicle["type"][] = ["van", "rigid", "articulated"];
  const type = types[id % types.length];
  const capacityKg = type === "van" ? 3500 : type === "rigid" ? 18000 : 24000;
  const fuelConsumptionL100 = type === "van" ? 12.5 : type === "rigid" ? 28 : 32;
  const statuses: Vehicle["status"][] = ["active", "active", "active", "idle", "maintenance"];

  return {
    id,
    plate: buildEuPlate(hub.countryCode, id),
    type,
    capacityKg,
    fuelConsumptionL100,
    depotHubId: hub.id,
    countryCode: hub.countryCode,
    region: hub.region,
    status: statuses[id % statuses.length],
  };
}

function buildAssignment(id: number): Assignment {
  const corridor = EU_CORRIDORS[id % EU_CORRIDORS.length];
  const hub = getHubById(corridor.originHubId);
  const status = ASSIGNMENT_STATUSES[id % ASSIGNMENT_STATUSES.length];
  const startAt = daysAgo(30 - (id % 30));
  const endAt =
    status === "completed" || status === "cancelled"
      ? startAt + (18 + (id % 48)) * 3_600_000
      : status === "active"
        ? null
        : null;

  return {
    id,
    vehicleId: 1 + (id % VEHICLE_COUNT),
    driverId: 1 + (id % DRIVER_COUNT),
    shipmentId: id % 4 === 0 ? null : 1 + (id % SHIPMENT_COUNT),
    depotHubId: hub.id,
    region: hub.region,
    status,
    startAt,
    endAt,
    corridorLabel: corridor.label,
  };
}

export const DRIVERS: Driver[] = Array.from({ length: DRIVER_COUNT }, (_, i) => buildDriver(i + 1));
export const VEHICLES: Vehicle[] = Array.from({ length: VEHICLE_COUNT }, (_, i) => buildVehicle(i + 1));
export const ASSIGNMENTS: Assignment[] = Array.from(
  { length: ASSIGNMENT_COUNT },
  (_, i) => buildAssignment(i + 1),
);

export function getDriverById(id: number): Driver | undefined {
  return DRIVERS.find((d) => d.id === id);
}

export function getVehicleById(id: number): Vehicle | undefined {
  return VEHICLES.find((v) => v.id === id);
}

export function getAssignmentById(id: number): Assignment | undefined {
  return ASSIGNMENTS.find((a) => a.id === id);
}

export function getDriverDisplayName(driver: Driver): string {
  return `${driver.firstName} ${driver.lastName}`;
}

export function getFleetUtilizationPercent(): number {
  const active = VEHICLES.filter((v) => v.status === "active").length;
  return Math.round((active / VEHICLES.length) * 1000) / 10;
}

export function getActiveAssignmentsCount(): number {
  return ASSIGNMENTS.filter((a) => a.status === "active" || a.status === "scheduled").length;
}

export function getDriversOnDutyCount(): number {
  const activeDriverIds = new Set(
    ASSIGNMENTS.filter((a) => a.status === "active").map((a) => a.driverId),
  );
  return activeDriverIds.size;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return [value];
  return [];
}

function paginateRows<T>(rows: T[], state: TableData): T[] {
  const page = state.page ?? 0;
  const rowsPerPage = state.rows ?? 15;
  const start = page * rowsPerPage;
  return rows.slice(start, start + rowsPerPage);
}

export function filterAndSortVehicles(rows: Vehicle[], state: TableData): Vehicle[] {
  let result = [...rows];

  const plate = state.filters?.plate as string | undefined;
  if (plate?.trim()) {
    const q = plate.trim().toLowerCase();
    result = result.filter((r) => r.plate.toLowerCase().includes(q));
  }

  const status = state.filters?.status as string | undefined;
  if (status) result = result.filter((r) => r.status === status);

  const type = state.filters?.type as string | undefined;
  if (type) result = result.filter((r) => r.type === type);

  const regions = asStringArray(state.filters?.region);
  if (regions.length) result = result.filter((r) => regions.includes(r.region));

  const country = state.filters?.countryCode as string | undefined;
  if (country) result = result.filter((r) => r.countryCode === country);

  return sortRows(result, state);
}

export function filterAndSortDrivers(rows: Driver[], state: TableData): Driver[] {
  let result = [...rows];

  const name = state.filters?.name as string | undefined;
  if (name?.trim()) {
    const q = name.trim().toLowerCase();
    result = result.filter((r) =>
      getDriverDisplayName(r).toLowerCase().includes(q),
    );
  }

  const country = state.filters?.licenseCountry as string | undefined;
  if (country) result = result.filter((r) => r.licenseCountry === country);

  return sortRows(result, state, { nameField: "firstName" });
}

export function filterAndSortAssignments(
  rows: Assignment[],
  state: TableData,
): Assignment[] {
  let result = [...rows];

  const status = state.filters?.status as string | undefined;
  if (status) result = result.filter((r) => r.status === status);

  const regions = asStringArray(state.filters?.region);
  if (regions.length) result = result.filter((r) => regions.includes(r.region));

  const corridor = state.filters?.corridorLabel as string | undefined;
  if (corridor?.trim()) {
    const q = corridor.trim().toLowerCase();
    result = result.filter((r) => r.corridorLabel.toLowerCase().includes(q));
  }

  return sortRows(result, state);
}

export function paginateVehicles<T>(rows: T[], state: TableData): T[] {
  return paginateRows(rows, state);
}

export function paginateDrivers<T>(rows: T[], state: TableData): T[] {
  return paginateRows(rows, state);
}

export function paginateAssignments<T>(rows: T[], state: TableData): T[] {
  return paginateRows(rows, state);
}

function sortRows<T extends { id: number }>(
  rows: T[],
  state: TableData,
  options?: { nameField?: keyof T },
): T[] {
  const sortField = state.sortField;
  const sortOrder = state.sortOrder;
  if (!sortField || !sortOrder) return rows;

  const dir = sortOrder === 1 ? 1 : -1;
  return [...rows].sort((a, b) => {
    const aRec = a as Record<string, unknown>;
    const bRec = b as Record<string, unknown>;
    const aVal = aRec[sortField];
    const bVal = bRec[sortField];

    if (sortField === options?.nameField && typeof aVal === "string" && typeof bVal === "string") {
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

export { getHubById };
