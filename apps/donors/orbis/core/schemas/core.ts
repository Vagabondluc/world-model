
import { z } from 'zod';

// --- ABSOLUTE TIME (docs/01-time-clock-system.md) ---
export const AbsTimeSchema = z.bigint().nonnegative();
export type AbsTime = z.infer<typeof AbsTimeSchema>;

// --- DOMAIN IDS (docs/01-time-clock-system.md) ---
export enum DomainId {
  CORE_TIME = 0,
  PLANET_PHYSICS = 10,
  CLIMATE = 20,
  HYDROLOGY = 30,
  BIOSPHERE_CAPACITY = 40,
  TROPHIC_ENERGY = 50,
  POP_DYNAMICS = 60,
  EXTINCTION = 70,
  REFUGIA_COLONIZATION = 80,
  EVOLUTION_BRANCHING = 90,
  CIVILIZATION_NEEDS = 100,
  CIVILIZATION_BEHAVIOR = 110,
  WARFARE = 120,
  NARRATIVE_LOG = 200,
  MYTHOS = 201
}
export const DomainIdSchema = z.nativeEnum(DomainId);

// --- DOMAIN CLOCKS (docs/01-time-clock-system.md) ---
export enum DomainMode {
  Frozen = 'Frozen',
  Step = 'Step',
  HighRes = 'HighRes',
  Regenerate = 'Regenerate'
}
export const DomainModeSchema = z.nativeEnum(DomainMode);

export const DomainClockSpecSchema = z.object({
  domain: DomainIdSchema,
  quantumUs: AbsTimeSchema,
  stepUs: AbsTimeSchema,
  mode: DomainModeSchema,
  maxCatchupSteps: z.number().int().nonnegative()
});
export type DomainClockSpec = z.infer<typeof DomainClockSpecSchema>;

export const DomainClockStateSchema = z.object({
  lastStepTimeUs: AbsTimeSchema
});
export type DomainClockState = z.infer<typeof DomainClockStateSchema>;

// --- EVENTS (docs/01-time-clock-system.md) ---
export const EventIdSchema = z.enum([
  "ClimateChanged",
  "SeaLevelChanged",
  "TectonicsEpochChanged",
  "CarbonChanged",
  "MagnetosphereChanged",
  "BiomeInvalidated",
  "HydrologyInvalidated"
]);
export type EventId = z.infer<typeof EventIdSchema>;

export const SimEventSchema = z.object({
  atTimeUs: AbsTimeSchema,
  id: EventIdSchema,
  payloadHash: z.number().int()
});
export type SimEvent = z.infer<typeof SimEventSchema>;

// --- PLUGINS (docs/01-time-clock-system.md) ---
export const PluginSpecSchema = z.object({
  id: z.string(),
  runsOn: z.array(DomainIdSchema),
  reads: z.array(z.string()),
  writes: z.array(z.string()),
  deterministic: z.literal(true)
});
export type PluginSpec = z.infer<typeof PluginSpecSchema>;

// --- DETERMINISTIC RNG & DIGESTS (docs/35-deterministic-rng.md) ---
export const Digest64Schema = z.bigint();
export type Digest64 = z.infer<typeof Digest64Schema>;

export const DigestSaltSchema = z.number().int().nonnegative();
export type DigestSalt = z.infer<typeof DigestSaltSchema>;

export enum DigestSaltV1 {
  GlobalTickDigest = 1000,
  DomainParamsDigest = 1100,
  DomainStateDigest = 1200,
  DomainOutputsDigest = 1300,
  EventListDigest = 1400,
  DeltaListDigest = 1500,
  DenseFieldChunkDigest = 1600,
  SparseLayerDigest = 1700,
  ScopeDigestCell = 1800,
  ScopeDigestRegion = 1810,
  ScopeDigestSpecies = 1820,
  ScopeDigestCiv = 1830
}
export const DigestSaltV1Schema = z.nativeEnum(DigestSaltV1);

export const DomainDigestSnapshotV1Schema = z.object({
  domainId: DomainIdSchema,
  time: AbsTimeSchema,
  paramsDigest: Digest64Schema,
  stateDigest: Digest64Schema,
  outputsDigest: Digest64Schema,
  summaryDigest: Digest64Schema
});

export const GlobalDigestSnapshotV1Schema = z.object({
  time: AbsTimeSchema,
  eventListDigest: Digest64Schema,
  deltaListDigest: Digest64Schema,
  domainListDigest: Digest64Schema,
  globalDigest: Digest64Schema
});

// --- NUMERIC PRIMITIVES (docs/68-numerical-stability-fixed-point-math-contract.md) ---
export const MathPPMSchema = z.number().int(); // nominal 0..1_000_000
export const Fixed32Q16Schema = z.number().int(); // value / 65536
export const Fixed64Q32Schema = z.bigint(); // value / 2^32

export const UnitFamilyV1Schema = z.enum([
  "Meters",
  "KelvinQ16",
  "PPM",
  "JoulesQ32",
  "Count",
  "Id",
  "Boolean"
]);
export type UnitFamilyV1 = z.infer<typeof UnitFamilyV1Schema>;
