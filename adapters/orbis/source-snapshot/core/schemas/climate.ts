import { z } from 'zod';

export enum ClimateLevel {
  L1_0D = 'L1_0D',
  L2_0D_Atm = 'L2_0D_Atm',
  L3_0D_Albedo = 'L3_0D_Albedo',
  L4_1D_LatBands = 'L4_1D_LatBands'
}
export const ClimateLevelSchema = z.nativeEnum(ClimateLevel);

export const BiomeIdSchema = z.number().int().nonnegative();
export type BiomeId = z.infer<typeof BiomeIdSchema>;

export const ClimateParamsV1Schema = z.object({
  level: ClimateLevelSchema,
  eccentricityPPM: z.number().int().nonnegative(),
  perihelionPPM: z.number().int().nonnegative(),

  // albedo
  alphaIcePPM: z.number().int().nonnegative(),
  alphaWaterPPM: z.number().int().nonnegative(),
  T_ice_mK: z.number().int(),
  T_warm_mK: z.number().int(),

  // ice fraction thresholds
  T_freeze_mK: z.number().int(),
  T_melt_mK: z.number().int(),

  // outgoing radiation coefficient
  sigmaTildePPM: z.number().int().nonnegative(),

  // mixing
  diffusionDPPM: z.number().int().nonnegative(),

  // inertia and step
  thermalInertiaPPM: z.number().int().nonnegative(),
  dtPPM: z.number().int().nonnegative(),

  // altitude coupling
  useLapse: z.boolean(),
  lapse_mK_per_cm_PPM: z.number().int().nonnegative(),

  // precip proxy
  precipEquatorPeakPPM: z.number().int().nonnegative(),
  desertDipLatBand: z.number().int().nonnegative(),
  desertDipDepthPPM: z.number().int().nonnegative(),
  precipRecoveryPPM: z.number().int().nonnegative()
});
export type ClimateParamsV1 = z.infer<typeof ClimateParamsV1Schema>;

export const ClimateInputsSchema = z.object({
  SolarStrengthPPM: z.number().int().nonnegative(),
  AxialTiltµdeg: z.number().int().nonnegative(),
  yearPhasePPM: z.number().int().nonnegative().max(1000000),
  RotationRatePPM: z.number().int().nonnegative().optional(),
  SeaLevelcm: z.number().int().optional()
});
export type ClimateInputs = z.infer<typeof ClimateInputsSchema>;