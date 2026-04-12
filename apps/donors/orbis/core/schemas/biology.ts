import { z } from 'zod';
import { AbsTimeSchema, DomainIdSchema, MathPPMSchema } from './core';

// --- NOMENCLATURE (docs/18-nomenclature.md) ---
export const SpeciesIdSchema = z.string().regex(/^S-[0-9A-Fa-f]{16}$/);
export type SpeciesId = z.infer<typeof SpeciesIdSchema>;

// --- TRUNKS (docs/10-life-engine.md) ---
export enum TrunkId {
  Bacteria = 'Bacteria',
  Archaea = 'Archaea',
  Eukarya_Opisthokonta = 'Eukarya_Opisthokonta',
  Eukarya_Archaeplastida = 'Eukarya_Archaeplastida',
  Eukarya_SAR = 'Eukarya_SAR',
  Eukarya_Excavata = 'Eukarya_Excavata',
  Eukarya_Amoebozoa = 'Eukarya_Amoebozoa'
}
export const TrunkIdSchema = z.nativeEnum(TrunkId);

// --- GENOME MODULES (docs/07-species-modules.md) ---
export enum MetabolismModule {
  AnaerobicFerment = 'AnaerobicFerment',
  Chemosynthesis = 'Chemosynthesis',
  OxygenicPhotosynthesis = 'OxygenicPhotosynthesis',
  AerobicRespiration = 'AerobicRespiration',
  FacultativeSwitch = 'FacultativeSwitch'
}
export const MetabolismModuleSchema = z.nativeEnum(MetabolismModule);

export enum StructureModule {
  Cytoskeleton = 'Cytoskeleton',
  MulticellularAdhesion = 'MulticellularAdhesion',
  MineralizedSupport = 'MineralizedSupport',
  MycelialNetwork = 'MycelialNetwork',
  VascularTransport = 'VascularTransport',
  Exoskeleton = 'Exoskeleton'
}
export const StructureModuleSchema = z.nativeEnum(StructureModule);

export enum NeuralModule {
  ChemicalSignaling = 'ChemicalSignaling',
  LightDetection = 'LightDetection',
  SimpleGanglia = 'SimpleGanglia',
  CentralizedBrain = 'CentralizedBrain',
  Echolocation = 'Echolocation',
  Electroreception = 'Electroreception'
}
export const NeuralModuleSchema = z.nativeEnum(NeuralModule);

export enum ReproductionModule {
  AsexualDivision = 'AsexualDivision',
  SexualRecombination = 'SexualRecombination',
  SporeRelease = 'SporeRelease',
  AlternatingGenerations = 'AlternatingGenerations',
  Parthenogenesis = 'Parthenogenesis'
}
export const ReproductionModuleSchema = z.nativeEnum(ReproductionModule);

export enum AdaptationModule {
  Thermotolerance = 'Thermotolerance',
  Cryotolerance = 'Cryotolerance',
  RadiationShielding = 'RadiationShielding',
  AquaticRespiration = 'AquaticRespiration',
  TerrestrialRespiration = 'TerrestrialRespiration',
  FlightCapability = 'FlightCapability',
  BurrowingCapability = 'BurrowingCapability'
}
export const AdaptationModuleSchema = z.nativeEnum(AdaptationModule);

export const ModuleIdSchema = z.number().int().nonnegative();

// --- SPECIES TEMPLATE (docs/08-species-template-procedural-biology.md) ---
export enum TrophicRoleId {
  PrimaryProducer = 'PrimaryProducer',
  Decomposer = 'Decomposer',
  Herbivore = 'Herbivore',
  Omnivore = 'Omnivore',
  Carnivore = 'Carnivore',
  ApexPredator = 'ApexPredator',
  Parasite = 'Parasite',
  FilterFeeder = 'FilterFeeder'
}
export const TrophicRoleIdSchema = z.nativeEnum(TrophicRoleId);

export const SpeciesParamsSchema = z.object({
  bodySizePPM: MathPPMSchema,
  metabolismPPM: MathPPMSchema,
  reproductionRatePPM: MathPPMSchema,
  lifespanPPM: MathPPMSchema,
  mobilityPPM: MathPPMSchema,
  intelligencePPM: MathPPMSchema,
  socialityPPM: MathPPMSchema,
  aggressionPPM: MathPPMSchema,
  resiliencePPM: MathPPMSchema
});

export const ViabilityFlagsSchema = z.object({
  noEnergyStrategy: z.boolean(),
  habitatMismatch: z.boolean(),
  oxygenToleranceFail: z.boolean(),
  energyDeficit: z.boolean(),
  lowReproduction: z.boolean()
});

export const TagInstanceSchema = z.object({
  tagId: z.number().int().nonnegative(),
  intensityPPM: MathPPMSchema,
  origin: z.number().int().optional()
});

export const TagQuerySchema = z.object({
  require: z.array(TagInstanceSchema),
  exclude: z.array(TagInstanceSchema)
});

export const HabitatPrefsSchema = z.object({
  preferred: z.array(z.object({ biomeQuery: TagQuerySchema, weightPPM: MathPPMSchema })),
  tolerated: z.array(z.object({ biomeQuery: TagQuerySchema, weightPPM: MathPPMSchema })),
  forbidden: z.array(TagQuerySchema)
});

export const SpeciesTemplateSchema = z.object({
  speciesId: SpeciesIdSchema,
  trunkId: z.number().int(), // Assuming numeric ID here based on TrunkDef
  tags: z.array(TagInstanceSchema),
  modules: z.array(ModuleIdSchema),
  trophicRole: TrophicRoleIdSchema,
  habitatPrefs: HabitatPrefsSchema,
  params: SpeciesParamsSchema,
  viability: ViabilityFlagsSchema,
  nicheSignature: z.bigint()
});
export type SpeciesTemplate = z.infer<typeof SpeciesTemplateSchema>;

// --- TROPHIC ENERGY (docs/12-trophic-energy.md) ---
export enum TrophicLevel {
  Producer = 0,
  PrimaryConsumer = 1,
  SecondaryConsumer = 2,
  Apex = 3,
  Decomposer = 4
}
export const TrophicLevelSchema = z.nativeEnum(TrophicLevel);

export const TrophicEfficiencyV1Schema = z.object({
  producerToHerbivorePPM: MathPPMSchema,
  herbivoreToCarnivorePPM: MathPPMSchema,
  carnivoreToApexPPM: MathPPMSchema,
  decomposerReturnPPM: MathPPMSchema
});

export const TrophicGlobalsV1Schema = z.object({
  k0PPM: MathPPMSchema,
  k1PPM: MathPPMSchema,
  k2PPM: MathPPMSchema,
  minEnergyPPM: MathPPMSchema,
  maxScaleDownPPM: MathPPMSchema
});

// --- POPULATION DYNAMICS (docs/52-population-dynamics-predator-prey-stability.md) ---
export const PopStateCellSchema = z.object({
  densityPPM: MathPPMSchema,
  biomassPPM: MathPPMSchema.optional(),
  lastTick: AbsTimeSchema
});
export type PopStateCell = z.infer<typeof PopStateCellSchema>;

export const SpeciesBioParamsV1Schema = z.object({
  rGrowthPPM: MathPPMSchema,
  mortalityPPM: MathPPMSchema,
  dispersalPPM: MathPPMSchema,
  assimilationPPM: MathPPMSchema,
  predationEfficiencyPPM: MathPPMSchema,
  attackRatePPM: MathPPMSchema,
  handlingPPM: MathPPMSchema,
  minViablePPM: MathPPMSchema,
  panicSensitivityPPM: MathPPMSchema
});

export const FeedingEdgeSchema = z.object({
  predator: SpeciesIdSchema,
  prey: SpeciesIdSchema,
  weightPPM: MathPPMSchema
});