import { z } from "zod";

export const routePlanStatusSchema = z.enum([
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

export const routePlanSchema = z.object({
  id: z.number().int(),
  corridorId: z.string(),
  corridorLabel: z.string(),
  vehicleId: z.number().int(),
  driverId: z.number().int(),
  departureWindow: z.number(),
  status: routePlanStatusSchema,
});

export type RoutePlanDto = z.infer<typeof routePlanSchema>;
export type RoutePlanStatus = z.infer<typeof routePlanStatusSchema>;
