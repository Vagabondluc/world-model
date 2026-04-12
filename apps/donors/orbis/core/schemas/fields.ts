import { z } from 'zod';
import { AbsTimeSchema, MathPPMSchema } from './core';
import { TagInstanceSchema } from './biology';

// --- FIELD REPRESENTATION (docs/54-field-representation-projection-contract.md) ---
export const ContinuousFieldsSchema = z.object({
  T: z.function(),
  P: z.function(),
  A: z.function(),
  B: z.function(),
  Si: z.function(),
  E: z.function(),
  I: z.function()
});

export const DiscretizationStrategySchema = z.enum([
  "lat_lon_grid",
  "icosahedral_grid",
  "spectral_harmonics",
  "zonal_bands",
  "hybrid_bands_diffusion"
]);

export const BandSchema = z.object({
  bandId: z.number().int().nonnegative(),
  latCenter: z.number(),
  latMin: z.number(),
  latMax: z.number(),
  area: z.number(),
  areaWeight: z.number(),
  temperature: z.number(),
  albedo: z.number(),
  iceFraction: z.number(),
  insolation: z.number(),
  heatFlux: z.number()
});

export const SurfaceCellSchema = z.object({
  cellId: z.bigint().nonnegative(),
  centerLat: z.number(),
  centerLon: z.number(),
  area: z.number(),
  normalizedArea: z.number(),
  neighborCellIds: z.array(z.bigint().nonnegative()),
  temperature: z.number(),
  precipitation: z.number(),
  albedo: z.number(),
  iceFraction: z.number(),
  elevation: z.number(),
  slope: z.number(),
  aspect: z.number(),
  biomass: z.number(),
  speciesDensities: z.array(z.number()),
  biomeTypeId: z.number().int().nonnegative(),
  tags: z.array(TagInstanceSchema)
});

export const FieldStateSchema = z.object({
  bands: z.array(BandSchema),
  cells: z.array(SurfaceCellSchema),
  totalEnergy: z.number(),
  totalBiomass: z.number(),
  globalIceFraction: z.number(),
  version: z.string(),
  lastUpdated: AbsTimeSchema
});