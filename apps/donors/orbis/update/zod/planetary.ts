import { z } from 'zod';
import { AbsTimeSchema } from './core';

// --- MAGNETOSPHERE (docs/02-magnetosphere.md) ---
export const MagnetosphereStateSchema = z.object({
  health01: z.number().min(0).max(1),
  polarity: z.union([z.literal(1), z.literal(-1)]),
  phase01: z.number().min(0).max(1),
  lastFlipTimeMs: AbsTimeSchema
});
export type MagnetosphereState = z.infer<typeof MagnetosphereStateSchema>;

export const MagnetosphereDriversSchema = z.object({
  coreHeat01: z.number().min(0).max(1),
  rotation01: z.number().min(0).max(1),
  tectonicHeatFlux01: z.number().min(0).max(1)
});
export type MagnetosphereDrivers = z.infer<typeof MagnetosphereDriversSchema>;

// --- BIOSPHERE CAPACITY (docs/05-biosphere-capacity.md) ---
export const BiosphereCapacity01Schema = z.number().min(0).max(1);

export const BiosphereViewModelSchema = z.object({
  vitality01: z.number().min(0).max(1),
  dominantTier: z.enum(["Sterile", "Microbial", "Simple", "Complex", "Advanced"]),
  collapseRisk: z.enum(["Low", "Moderate", "High"])
});