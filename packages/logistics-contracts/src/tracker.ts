import { z } from "zod";

export const trackerEventSchema = z.object({
  id: z.number().int(),
  time: z.number(),
  latlng: z.tuple([z.number(), z.number()]),
  name: z.string(),
  error: z.boolean(),
  miss: z.boolean(),
  speed: z.number(),
  province: z.string(),
  deviceId: z.union([z.number(), z.string()]),
  road: z.string(),
  roadId: z.union([z.number(), z.string()]),
  trafficId: z.union([z.number(), z.string()]),
  crimes: z.array(z.string()),
});

export const trackerPlaybackQuerySchema = z.object({
  vehicleId: z.coerce.number().int().min(1),
  from: z.coerce.number().optional(),
  to: z.coerce.number().optional(),
});

export type TrackerEventDto = z.infer<typeof trackerEventSchema>;
export type TrackerPlaybackQuery = z.infer<typeof trackerPlaybackQuerySchema>;
