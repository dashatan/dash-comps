import {
  EU_HUBS,
  EU_COUNTRY_CODES,
  buildEuPlate,
  type EuCountryCode,
  type EuRegion,
} from "@/data/european-context";

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

const DRIVER_FIRST_NAMES = [
  "Thomas", "Marie", "Jan", "Sofia", "Lars", "Elena", "Pieter", "Anna",
  "Marco", "Claire", "Henrik", "Isabella", "Klaus", "Nina", "Pavel",
] as const;

const DRIVER_LAST_NAMES = [
  "Müller", "Dubois", "Jansen", "Rossi", "Andersen", "Kowalski", "Schmidt",
  "Laurent", "Vermeulen", "García", "Novák", "Bergström", "Weber", "Moreau",
] as const;

const VEHICLE_COUNT = 86;
const DRIVER_COUNT = 92;

export { VEHICLE_COUNT, DRIVER_COUNT };

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

export const DRIVERS: Driver[] = Array.from({ length: DRIVER_COUNT }, (_, i) => buildDriver(i + 1));
export const VEHICLES: Vehicle[] = Array.from({ length: VEHICLE_COUNT }, (_, i) => buildVehicle(i + 1));

export function getDriverById(id: number): Driver | undefined {
  return DRIVERS.find((d) => d.id === id);
}

export function getVehicleById(id: number): Vehicle | undefined {
  return VEHICLES.find((v) => v.id === id);
}

export function getDriverDisplayName(driver: Driver): string {
  return `${driver.firstName} ${driver.lastName}`;
}

export function getFleetUtilizationPercent(): number {
  const active = VEHICLES.filter((v) => v.status === "active").length;
  return Math.round((active / VEHICLES.length) * 1000) / 10;
}
