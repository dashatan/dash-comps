import { z } from "zod";
import {
  accountTierSchema,
  billingCycleSchema,
} from "@dash/logistics-contracts";

const isoDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format");

export const demoContractFormSchema = z
  .object({
    customerName: z
      .string()
      .trim()
      .min(2, "Customer name must be at least 2 characters"),
    tier: accountTierSchema,
    slaOnTimePercent: z.coerce
      .number()
      .min(80, "SLA must be at least 80%")
      .max(100, "SLA cannot exceed 100%"),
    billingCycle: billingCycleSchema,
    corridorCount: z.coerce
      .number()
      .int()
      .min(1, "At least one corridor is required")
      .max(24, "Maximum 24 corridors"),
    startDate: isoDateSchema,
    endDate: isoDateSchema,
    notes: z.string().trim().max(500, "Notes cannot exceed 500 characters"),
  })
  .refine(
    (data) =>
      new Date(data.endDate).getTime() > new Date(data.startDate).getTime(),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export type DemoContractFormValues = z.infer<typeof demoContractFormSchema>;

export const demoContractFormDefaults: DemoContractFormValues = {
  customerName: "",
  tier: "standard",
  slaOnTimePercent: 95,
  billingCycle: "monthly",
  corridorCount: 1,
  startDate: "",
  endDate: "",
  notes: "",
};
