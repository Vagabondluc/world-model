import { z } from 'zod';
import { AbsTimeSchema, DomainIdSchema, MathPPMSchema } from './core';

// --- NEEDS & BEHAVIORS (docs/32-need-driven-behavior.md) ---
export const NeedIdSchema = z.number().int().nonnegative();

export const NeedStateSchema = z.object({
  levelPPM: MathPPMSchema,
  decayRatePPM: MathPPMSchema,
  priorityWeightPPM: MathPPMSchema
});

export const EntityNeedsSchema = z.object({
  needs: z.array(NeedStateSchema)
});
export type EntityNeeds = z.infer<typeof EntityNeedsSchema>;

export const BehaviorSchema = z.object({
  id: z.string(),
  targetNeed: NeedIdSchema,
  effectStrength: z.number(),
  environmentalCost: z.number(),
  risk01: z.number()
});

// --- DECISION ENGINE (docs/39-deterministic-utility-decision.md) ---
export const EntityIdSchema = z.bigint().nonnegative();
export const ActionIdSchema = z.number().int().nonnegative();

export const TagDeltaSchema = z.object({
  tagId: z.number().int().nonnegative(),
  deltaPPM: z.number().int()
});

// Import TagQuerySchema from biology.ts if needed, but here we redefined it or will import later
// For now, let's assume availability or use a placeholder if circular dependency is an issue.
// Since these are just schemas, we can define them or import them.

export const ActionDefSchema = z.object({
  actionId: ActionIdSchema,
  domain: DomainIdSchema,
  // requirements
  requiresTags: z.any().optional(), // TagQuery
  forbidsTags: z.any().optional(),  // TagQuery
  // feasibility
  preconditions: z.array(z.any()),  // Condition[]
  cost: z.record(z.string(), MathPPMSchema), // CostVector
  cooldownTicks: z.number().int().nonnegative(),
  // effects
  needDeltaPPM: z.record(z.string(), z.number().int()),
  tagDeltaPPM: z.array(TagDeltaSchema),
  worldDelta: z.array(z.any()) // WorldDelta[]
});

export const DecisionExplainSchema = z.object({
  time: AbsTimeSchema,
  entityId: EntityIdSchema,
  actionId: ActionIdSchema,
  dominantNeed: z.number().int(),
  scoreTotal: z.bigint(),
  topNeedTerms: z.array(z.tuple([z.number().int(), z.bigint()])),
  topTagTerms: z.array(z.tuple([z.number().int(), z.bigint()])),
  penalties: z.object({
    cost: z.bigint(),
    risk: z.bigint(),
    instability: z.bigint()
  })
});

// --- WORLD DELTA (docs/40-action-resolution-world-delta.md) ---
export enum DeltaDomain {
  Resources = 'Resources',
  Population = 'Population',
  Biomass = 'Biomass',
  LandCover = 'LandCover',
  Atmosphere = 'Atmosphere',
  Pollution = 'Pollution',
  Infrastructure = 'Infrastructure',
  Conflict = 'Conflict',
  Knowledge = 'Knowledge',
  Culture = 'Culture'
}
export const DeltaDomainSchema = z.nativeEnum(DeltaDomain);

export const WorldDeltaSchema = z.object({
  time: AbsTimeSchema,
  domain: DeltaDomainSchema,
  scope: z.number().int(), // ScopeId
  targetA: z.bigint().nonnegative(),
  targetB: z.bigint().nonnegative().optional(),
  kind: z.number().int().nonnegative(),
  amountPPM: z.number().int(),
  capPPM: MathPPMSchema.optional(),
  sourceEntity: z.bigint().nonnegative(),
  actionId: ActionIdSchema,
  index: z.number().int().nonnegative()
});

// --- ECONOMICS (docs/45-economic-flow-trade-network.md) ---
export const TradeNodeSchema = z.object({
  nodeId: z.bigint().nonnegative(),
  biomeId: z.bigint().nonnegative(),
  settlementTier: z.number().int().nonnegative(),
  productionPPM: MathPPMSchema,
  demandPPM: MathPPMSchema,
  storagePPM: MathPPMSchema
});
export type TradeNode = z.infer<typeof TradeNodeSchema>;

export const TradeEdgeSchema = z.object({
  edgeId: z.bigint().nonnegative(),
  fromNodeId: z.bigint().nonnegative(),
  toNodeId: z.bigint().nonnegative(),
  travelCostPPM: MathPPMSchema,
  capacityPPM: MathPPMSchema,
  riskPPM: MathPPMSchema
});
export type TradeEdge = z.infer<typeof TradeEdgeSchema>;

export const EconomicTickStateSchema = z.object({
  time: AbsTimeSchema,
  nodeProsperityPPM: z.record(z.string(), MathPPMSchema),
  nodeScarcityPPM: z.record(z.string(), MathPPMSchema),
  edgeUtilizationPPM: z.record(z.string(), MathPPMSchema),
  networkStabilityPPM: MathPPMSchema
});
export type EconomicTickState = z.infer<typeof EconomicTickStateSchema>;