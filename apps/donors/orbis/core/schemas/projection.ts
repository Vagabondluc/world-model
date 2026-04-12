import { z } from 'zod';
import { AbsTimeSchema, MathPPMSchema } from './core';
import { BiomeIdSchema } from './climate'; // Assuming BiomeId is defined there
import { SpeciesIdSchema, TrunkIdSchema, TrophicRoleIdSchema, TagInstanceSchema } from './biology';

// --- MULTI-AXIAL PROJECTION (docs/61-multi-axial-world-generation.md) ---
export enum StratumId {
  Aero = 'Aero',
  Terra = 'Terra',
  Litho = 'Litho',
  Abyssal = 'Abyssal'
}
export const StratumIdSchema = z.nativeEnum(StratumId);

export enum PlaneId {
  Material = 'Material',
  Feywild = 'Feywild',
  Shadowfell = 'Shadowfell'
}
export const PlaneIdSchema = z.nativeEnum(PlaneId);

export const StratumTransformV1Schema = z.object({
  stratum: StratumIdSchema,
  elevationOffsetM: z.number().int(),
  tempOffsetmK: z.number().int(),
  moistureOffsetPPM: z.number().int()
});

export const PlaneTransformV1Schema = z.object({
  plane: PlaneIdSchema,
  vitalityMultPPM: MathPPMSchema,
  decayRatePPM: MathPPMSchema,
  magicDensityPPM: MathPPMSchema
});

export const StratumProjectionSchema = z.object({
  stratumId: StratumIdSchema,
  depthRangeM: z.tuple([z.number().int(), z.number().int()]),
  pressurePPM: MathPPMSchema,
  temperatureGradientmCPer100m: z.number().int(),
  baseBiome: z.any(), // BiomeId
  stratumBiome: z.any() // BiomeId
});

export const PlaneProjectionSchema = z.object({
  planeId: PlaneIdSchema,
  lawSet: PlaneIdSchema,
  timeDilationPPM: MathPPMSchema,
  ambientMagicPPM: MathPPMSchema,
  corruptionThresholdPPM: MathPPMSchema,
  planeBiome: z.any() // BiomeId
});

export const MultiAxialCellProjectionSchema = z.object({
  climate: z.any(), // ClimateInputs
  stratumId: StratumIdSchema,
  planeId: PlaneIdSchema,
  baseBiome: z.any(), // BiomeId
  stratumBiome: z.any(), // BiomeId
  planeBiome: z.any(), // BiomeId
  finalBiome: z.any(), // BiomeId
  seed: z.bigint().nonnegative(),
  worldSeed: z.bigint().nonnegative()
});

export const PlaneLifeRuleOverlayV1Schema = z.object({
  plane: PlaneIdSchema,
  vitalityMultPPM: MathPPMSchema,
  decayRatePPM: MathPPMSchema,
  fertilityBiasPPM: z.number().int(),
  encounterBiasPPM: z.number().int()
});

// --- SPECIALIZED BIOMES (docs/62-specialized-biomes.md) ---
export enum SpecializedBiomeId {
  MANGROVE = 'MANGROVE',
  CLIFFS = 'CLIFFS',
  BEACH = 'BEACH',
  ALPINE_TUNDRA = 'ALPINE_TUNDRA',
  HIGH_DESERT = 'HIGH_DESERT',
  SAVANNA = 'SAVANNA',
  CHAPARRAL = 'CHAPARRAL',
  POLAR_DESERT = 'POLAR_DESERT',
  TROPICAL_MONTANE = 'TROPICAL_MONTANE'
}
export const SpecializedBiomeIdSchema = z.nativeEnum(SpecializedBiomeId);

export const BiomeConstraintsV1Schema = z.object({
  elevationM: z.tuple([z.number().int(), z.number().int()]).optional(),
  tempCC: z.tuple([z.number().int(), z.number().int()]).optional(),
  precipPPM: z.tuple([MathPPMSchema, MathPPMSchema]).optional(),
  slopePPM: z.tuple([MathPPMSchema, MathPPMSchema]).optional(),
  isCoastal: z.boolean().optional(),
  waterDepthM: z.tuple([z.number().int(), z.number().int()]).optional(),
  waterSalinityPPM: z.tuple([MathPPMSchema, MathPPMSchema]).optional()
});

export const SpecializedBiomeDefV1Schema = z.object({
  id: SpecializedBiomeIdSchema,
  parentBiome: z.any(), // BiomeId
  constraints: BiomeConstraintsV1Schema,
  tags: z.array(z.number().int().nonnegative())
});

// --- BESTIARY (docs/17-bestiary.md) ---
export enum ConservationStatus {
  Dominant = 'Dominant',
  Stable = 'Stable',
  Vulnerable = 'Vulnerable',
  Endangered = 'Endangered',
  Collapsing = 'Collapsing',
  Extinct = 'Extinct'
}
export const ConservationStatusSchema = z.nativeEnum(ConservationStatus);

export const InteractionProfileSchema = z.object({
  aggression01: z.number(),
  domestication01: z.number(),
  ecologicalImpact01: z.number(),
  civilizationPotential01: z.number()
});

export const ClimateEnvelopeSchema = z.object({
  minTempK: z.number(),
  maxTempK: z.number(),
  minPrecip: z.number(),
  maxRadiation: z.number()
});

export const BestiaryEntrySchema = z.object({
  id: SpeciesIdSchema,
  scientificName: z.string(),
  commonName: z.string(),
  trunk: TrunkIdSchema,
  tier: z.string(), // LifeTier
  role: z.string(), // Role
  habitat: z.array(z.string()), // Habitat
  population01: z.number(),
  conservationStatus: ConservationStatusSchema,
  adaptability01: z.number(),
  radiationTolerance01: z.number(),
  climateRange: ClimateEnvelopeSchema,
  interactionProfile: InteractionProfileSchema
});

export const YieldProfileSchema = z.object({
  foodPPM: MathPPMSchema,
  materialPPM: MathPPMSchema,
  medicinePPM: MathPPMSchema,
  toxinPPM: MathPPMSchema
});