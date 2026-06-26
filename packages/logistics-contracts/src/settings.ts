import { z } from "zod";
import { euRegionSchema } from "./reference";

export const organisationSettingsSchema = z.object({
  companyName: z.string(),
  defaultCurrency: z.string(),
  defaultRegion: euRegionSchema,
  depotHubIds: z.array(z.string()),
  locale: z.string(),
});

export type OrganisationSettingsDto = z.infer<
  typeof organisationSettingsSchema
>;

export const integrationTypeSchema = z.enum(["erp", "telematics", "carrier"]);

export const integrationStatusSchema = z.enum([
  "connected",
  "error",
  "pending",
]);

export const integrationSchema = z.object({
  id: z.string(),
  provider: z.string(),
  type: integrationTypeSchema,
  status: integrationStatusSchema,
  lastSyncAt: z.number().nullable(),
});

export type IntegrationDto = z.infer<typeof integrationSchema>;
export type IntegrationType = z.infer<typeof integrationTypeSchema>;
export type IntegrationStatus = z.infer<typeof integrationStatusSchema>;
