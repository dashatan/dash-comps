import { z } from "zod";
import { euCountryCodeSchema, euRegionSchema } from "./reference";

export const vehicleTypeSchema = z.enum(["van", "rigid", "articulated"]);
export const vehicleStatusSchema = z.enum(["active", "maintenance", "idle"]);
export const assignmentStatusSchema = z.enum([
  "scheduled",
  "active",
  "completed",
  "cancelled",
]);

export const driverSchema = z.object({
  id: z.number().int(),
  firstName: z.string(),
  lastName: z.string(),
  licenseCountry: euCountryCodeSchema,
  depotHubId: z.string(),
});

export const vehicleSchema = z.object({
  id: z.number().int(),
  plate: z.string(),
  type: vehicleTypeSchema,
  capacityKg: z.number(),
  fuelConsumptionL100: z.number(),
  depotHubId: z.string(),
  countryCode: euCountryCodeSchema,
  region: euRegionSchema,
  status: vehicleStatusSchema,
});

export const assignmentSchema = z.object({
  id: z.number().int(),
  vehicleId: z.number().int(),
  driverId: z.number().int(),
  shipmentId: z.number().int().nullable(),
  depotHubId: z.string(),
  region: euRegionSchema,
  status: assignmentStatusSchema,
  startAt: z.number(),
  endAt: z.number().nullable(),
  corridorLabel: z.string(),
});

export const fleetSummarySchema = z.object({
  vehicleCount: z.number().int(),
  driverCount: z.number().int(),
  assignmentCount: z.number().int(),
  utilizationPercent: z.number(),
  activeAssignments: z.number().int(),
  driversOnDuty: z.number().int(),
  activeVehicles: z.number().int(),
  maintenanceCount: z.number().int(),
});

export type DriverDto = z.infer<typeof driverSchema>;
export type VehicleDto = z.infer<typeof vehicleSchema>;
export type AssignmentDto = z.infer<typeof assignmentSchema>;
export type FleetSummaryDto = z.infer<typeof fleetSummarySchema>;
