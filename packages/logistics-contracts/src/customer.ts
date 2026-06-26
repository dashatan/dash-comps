import { z } from "zod";
import { euCountryCodeSchema, euRegionSchema } from "./reference";

export const accountTierSchema = z.enum(["standard", "premium", "enterprise"]);

export const customerSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  suffix: z.string(),
  city: z.string(),
  countryCode: euCountryCodeSchema,
  region: euRegionSchema,
  vatNumber: z.string(),
  phone: z.string(),
  accountTier: accountTierSchema,
  shipmentCount: z.number().int(),
});

export type CustomerDto = z.infer<typeof customerSchema>;
export type AccountTier = z.infer<typeof accountTierSchema>;

export const billingCycleSchema = z.enum(["monthly", "quarterly", "annual"]);

export const serviceContractSchema = z.object({
  id: z.number().int(),
  customerId: z.number().int(),
  customerName: z.string(),
  corridorIds: z.array(z.string()),
  slaOnTimePercent: z.number(),
  billingCycle: billingCycleSchema,
  startDate: z.number(),
  endDate: z.number(),
  tier: accountTierSchema,
});

export type ServiceContractDto = z.infer<typeof serviceContractSchema>;
