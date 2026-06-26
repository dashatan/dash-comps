import { z } from "zod";
import {
  accountTierSchema,
  euCountryCodeSchema,
  euRegionSchema,
} from "@dash/logistics-contracts";

export const demoAccountFormSchema = z.object({
  name: z.string().trim().min(2, "Company name must be at least 2 characters"),
  legalSuffix: z
    .string()
    .trim()
    .min(1, "Legal suffix is required (e.g. GmbH, BV)"),
  city: z.string().trim().min(2, "City is required"),
  countryCode: euCountryCodeSchema,
  region: euRegionSchema,
  accountTier: accountTierSchema,
  vatNumber: z
    .string()
    .trim()
    .min(8, "VAT number must be at least 8 characters")
    .regex(/^[A-Z]{2}[A-Z0-9]+$/, "Use EU VAT format (e.g. DE123456789)"),
  phone: z
    .string()
    .trim()
    .min(8, "Phone number must be at least 8 digits")
    .regex(/^\+?[0-9\s()-]+$/, "Invalid phone number format"),
});

export type DemoAccountFormValues = z.infer<typeof demoAccountFormSchema>;

export const demoAccountFormDefaults: DemoAccountFormValues = {
  name: "",
  legalSuffix: "GmbH",
  city: "",
  countryCode: "DE",
  region: "dach",
  accountTier: "standard",
  vatNumber: "",
  phone: "",
};
