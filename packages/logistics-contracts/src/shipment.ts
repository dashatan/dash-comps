import { z } from "zod";
import { euCountryCodeSchema, euRegionSchema } from "./reference";

export const shipmentStatusSchema = z.enum([
  "pending",
  "in_transit",
  "delivered",
  "delayed",
  "cancelled",
]);

export const shipmentSchema = z.object({
  id: z.number().int(),
  trackingNumber: z.string(),
  status: shipmentStatusSchema,
  corridorId: z.string(),
  originHubId: z.string(),
  destinationHubId: z.string(),
  originCity: z.string(),
  destinationCity: z.string(),
  countryCode: euCountryCodeSchema,
  region: euRegionSchema,
  customerId: z.number().int(),
  vehicleId: z.number().int(),
  driverId: z.number().int(),
  weightKg: z.number(),
  costEur: z.number(),
  revenueEur: z.number(),
  distanceKm: z.number(),
  crossBorder: z.boolean(),
  scheduledAt: z.number(),
  deliveredAt: z.number().nullable(),
  onTime: z.boolean(),
});

export type ShipmentDto = z.infer<typeof shipmentSchema>;
