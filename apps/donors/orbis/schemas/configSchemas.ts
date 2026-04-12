
import { z } from 'zod';
import { PlanetType, PlaneId, StratumId } from '../types';

export const OrbitalConfigSchema = z.object({
  dayLengthSeconds: z.number().min(60).max(172800), // 1 min to 48 hours
  yearLengthDays: z.number().int().min(10).max(1000),
  axialTilt: z.number().min(0).max(90),
});

export const MagnetosphereConfigSchema = z.object({
  dipoleTilt: z.number().min(0).max(45),
  strength: z.number().min(0).max(10),
});

export const TerrainConfigSchema = z.object({
  planetType: z.nativeEnum(PlanetType).default(PlanetType.TERRA),
  scale: z.number().min(0.1).max(10.0),
  seaLevel: z.number().min(-0.5).max(0.5),
  elevationScale: z.number().min(0.5).max(3.0),
  subdivisions: z.number().int().min(1).max(7), // Hard cap at 7 (163k hexes) for browser safety
  plateCount: z.number().int().min(4).max(24),
  lacunarity: z.number().min(1.0).max(4.0),
  persistence: z.number().min(0.0).max(1.0),
  tempOffset: z.number().min(-30).max(30),
  moistureOffset: z.number().min(-1.0).max(1.0),
  orbital: OrbitalConfigSchema,
  magnetosphere: MagnetosphereConfigSchema.default({ dipoleTilt: 11.5, strength: 1.0 }),
  supercontinentCycle: z.boolean().optional(),
  unitProfile: z.enum(['legacy_index', 'v1_meter']).default('legacy_index').optional(),
  
  // Phase 25: Multi-Axial
  activePlane: z.nativeEnum(PlaneId).default(PlaneId.MATERIAL),
  activeStratum: z.nativeEnum(StratumId).default(StratumId.TERRA),
});

export const VoxelConfigSchema = z.object({
  resolution: z.number().int().min(8).max(128),
});

export const ProjectionConfigSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  padding: z.number().int().nonnegative().default(200),
  seamOffsetRadians: z.number().default(0),
});

export type ValidatedTerrainConfig = z.infer<typeof TerrainConfigSchema>;
export type ValidatedVoxelConfig = z.infer<typeof VoxelConfigSchema>;
export type ValidatedProjectionConfig = z.infer<typeof ProjectionConfigSchema>;
