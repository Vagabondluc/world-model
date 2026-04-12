import { z } from 'zod';
import { AbsTimeSchema } from './core';

export const RiverIdSchema = z.number().int().nonnegative();
export const BasinIdSchema = z.number().int().nonnegative();
export const MouthIdSchema = z.number().int().nonnegative();
export const NodeIdSchema = z.number().int().nonnegative();

export const MouthSchema = z.object({
  mouthId: MouthIdSchema,
  cellId: z.number().int().nonnegative(),
  basinId: BasinIdSchema,
  strengthPPM: z.number().int().nonnegative()
});

export const BasinSchema = z.object({
  basinId: BasinIdSchema,
  mouthId: MouthIdSchema,
  cellIds: z.array(z.number().int().nonnegative()).optional(),
  areaWeightPPM: z.number().int().nonnegative()
});

export const RiverNodeSchema = z.object({
  nodeId: NodeIdSchema,
  cellId: z.number().int().nonnegative(),
  nextNodeId: NodeIdSchema.or(z.literal(0)),
  flowPPM: z.number().int().nonnegative(),
  widthPPM: z.number().int().nonnegative(),
  depthPPM: z.number().int().nonnegative()
});

export const RiverGraphSchema = z.object({
  riverId: RiverIdSchema,
  basinId: BasinIdSchema,
  mouthId: MouthIdSchema,
  sourceNodeIds: z.array(NodeIdSchema),
  nodes: z.array(RiverNodeSchema)
});

export const HydroParamsV1Schema = z.object({
  // ABCD Model Parameters
  soilSaturation_b: z.number().int().nonnegative(),
  rechargeRatio_c: z.number().int().nonnegative(),
  baseflowRate_d: z.number().int().nonnegative(),

  mouthCount: z.number().int().nonnegative(),
  coastRadius: z.number().int().nonnegative(),
  coastOceanFracMinPPM: z.number().int().nonnegative(),

  basinBarrierSlopePPM: z.number().int().nonnegative(),
  basinBarrierPenaltyPPM: z.number().int().nonnegative(),

  flatSlopeThresholdPPM: z.number().int().nonnegative(),
  maxSearchRadius: z.number().int().nonnegative(),

  riverMinFlowPPM: z.number().int().nonnegative(),

  widthCurveA_PPM: z.number().int().nonnegative(),
  widthCurveB_PPM: z.number().int().nonnegative(),
  depthCurveA_PPM: z.number().int().nonnegative(),
  depthCurveB_PPM: z.number().int().nonnegative(),

  lakeMinFlowPPM: z.number().int().nonnegative(),

  deltaFlowThresholdPPM: z.number().int().nonnegative(),
  deltaSplitChancePPM: z.number().int().nonnegative(),

  waterfallDrop_cm: z.number().int(),
  canyonSlopeThresholdPPM: z.number().int().nonnegative(),
  canyonChancePPM: z.number().int().nonnegative()
});
export type HydroParamsV1 = z.infer<typeof HydroParamsV1Schema>;
