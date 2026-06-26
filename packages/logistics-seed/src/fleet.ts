import type {
  AssignmentDto,
  DriverDto,
  VehicleDto,
} from "@dash/logistics-contracts";
import {
  EU_CORRIDORS,
  EU_COUNTRY_CODES,
  EU_HUBS,
  buildEuPlate,
  daysAgo,
  getHubById,
} from "./european-context";
import {
  ASSIGNMENT_COUNT,
  DRIVER_COUNT,
  SHIPMENT_COUNT,
  VEHICLE_COUNT,
} from "./entity-counts";

export const VEHICLE_TYPES = ["van", "rigid", "articulated"] as const;
export const VEHICLE_STATUSES = ["active", "maintenance", "idle"] as const;

export const ASSIGNMENT_STATUSES = [
  "scheduled",
  "active",
  "completed",
  "cancelled",
] as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

const DRIVER_FIRST_NAMES = [
  "Thomas",
  "Marie",
  "Jan",
  "Sofia",
  "Lars",
  "Elena",
  "Pieter",
  "Anna",
  "Marco",
  "Claire",
  "Henrik",
  "Isabella",
  "Klaus",
  "Nina",
  "Pavel",
] as const;

const DRIVER_LAST_NAMES = [
  "Müller",
  "Dubois",
  "Jansen",
  "Rossi",
  "Andersen",
  "Kowalski",
  "Schmidt",
  "Laurent",
  "Vermeulen",
  "García",
  "Novák",
  "Bergström",
  "Weber",
  "Moreau",
] as const;

export { ASSIGNMENT_COUNT, DRIVER_COUNT, VEHICLE_COUNT } from "./entity-counts";

function buildDriver(id: number): DriverDto {
  const hub = EU_HUBS[id % EU_HUBS.length];
  return {
    id,
    firstName: DRIVER_FIRST_NAMES[id % DRIVER_FIRST_NAMES.length],
    lastName: DRIVER_LAST_NAMES[id % DRIVER_LAST_NAMES.length],
    licenseCountry: EU_COUNTRY_CODES[id % EU_COUNTRY_CODES.length],
    depotHubId: hub.id,
  };
}

function buildVehicle(id: number): VehicleDto {
  const hub = EU_HUBS[id % EU_HUBS.length];
  const types: VehicleDto["type"][] = ["van", "rigid", "articulated"];
  const type = types[id % types.length];
  const capacityKg = type === "van" ? 3500 : type === "rigid" ? 18000 : 24000;
  const fuelConsumptionL100 =
    type === "van" ? 12.5 : type === "rigid" ? 28 : 32;
  const statuses: VehicleDto["status"][] = [
    "active",
    "active",
    "active",
    "idle",
    "maintenance",
  ];

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

function buildAssignment(id: number): AssignmentDto {
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

export function buildDrivers(): DriverDto[] {
  return Array.from({ length: DRIVER_COUNT }, (_, i) => buildDriver(i + 1));
}

export function buildVehicles(): VehicleDto[] {
  return Array.from({ length: VEHICLE_COUNT }, (_, i) => buildVehicle(i + 1));
}

export function buildAssignments(): AssignmentDto[] {
  return Array.from({ length: ASSIGNMENT_COUNT }, (_, i) =>
    buildAssignment(i + 1),
  );
}

export function getDriverById(
  drivers: DriverDto[],
  id: number,
): DriverDto | undefined {
  return drivers.find((d) => d.id === id);
}

export function getVehicleById(
  vehicles: VehicleDto[],
  id: number,
): VehicleDto | undefined {
  return vehicles.find((v) => v.id === id);
}

export function getAssignmentById(
  assignments: AssignmentDto[],
  id: number,
): AssignmentDto | undefined {
  return assignments.find((a) => a.id === id);
}

export function getDriverDisplayName(driver: DriverDto): string {
  return `${driver.firstName} ${driver.lastName}`;
}

export function getFleetUtilizationPercent(vehicles: VehicleDto[]): number {
  const active = vehicles.filter((v) => v.status === "active").length;
  return Math.round((active / vehicles.length) * 1000) / 10;
}

export function getActiveAssignmentsCount(
  assignments: AssignmentDto[],
): number {
  return assignments.filter(
    (a) => a.status === "active" || a.status === "scheduled",
  ).length;
}

export function getDriversOnDutyCount(assignments: AssignmentDto[]): number {
  const activeDriverIds = new Set(
    assignments.filter((a) => a.status === "active").map((a) => a.driverId),
  );
  return activeDriverIds.size;
}

export function getActiveVehicles(vehicles: VehicleDto[]): VehicleDto[] {
  return vehicles.filter((v) => v.status === "active");
}
