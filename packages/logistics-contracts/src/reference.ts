import { z } from "zod";

export const euCountryCodeSchema = z.enum([
  "DE",
  "NL",
  "FR",
  "BE",
  "PL",
  "IT",
  "ES",
  "AT",
  "CZ",
  "SE",
  "DK",
]);

export const euRegionSchema = z.enum([
  "benelux",
  "dach",
  "iberia",
  "nordics",
  "central_europe",
  "western_europe",
]);

export const euHubSchema = z.object({
  id: z.string(),
  city: z.string(),
  countryCode: euCountryCodeSchema,
  region: euRegionSchema,
  lat: z.number(),
  lng: z.number(),
});

export const euCorridorSchema = z.object({
  id: z.string(),
  originHubId: z.string(),
  destinationHubId: z.string(),
  label: z.string(),
  distanceKm: z.number(),
});

export type EuHubDto = z.infer<typeof euHubSchema>;
export type EuCorridorDto = z.infer<typeof euCorridorSchema>;
