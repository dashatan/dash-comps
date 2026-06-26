import { z } from "zod";

export const hubCapacitySchema = z.object({
  hubId: z.string(),
  city: z.string(),
  storageSlots: z.number().int(),
  usedSlots: z.number().int(),
  throughputPerDay: z.number().int(),
});

export type HubCapacityDto = z.infer<typeof hubCapacitySchema>;

export const hubCapacitySummarySchema = z.object({
  totalSlots: z.number().int(),
  usedSlots: z.number().int(),
  avgUtilizationPercent: z.number(),
  hubCount: z.number().int(),
});

export type HubCapacitySummaryDto = z.infer<typeof hubCapacitySummarySchema>;
