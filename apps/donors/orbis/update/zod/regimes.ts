import { z } from 'zod';
import { AbsTimeSchema, DomainIdSchema, UnitFamilyV1Schema } from './core';

// --- REGIME TRIGGERS (docs/73-phase-transition-regime-change.md) ---
export enum RegimeTriggerKindV1 {
  ScalarThreshold = 'ScalarThreshold',
  FieldFractionThreshold = 'FieldFractionThreshold',
  RateThreshold = 'RateThreshold',
  Timer = 'Timer'
}
export const RegimeTriggerKindV1Schema = z.nativeEnum(RegimeTriggerKindV1);

export const RegimeTriggerDefV1Schema = z.object({
  id: z.number().int().nonnegative(),
  kind: RegimeTriggerKindV1Schema,
  sourceId: z.number().int().nonnegative(),
  threshold: z.number().int(),
  hysteresisPPM: z.number().int().nonnegative(),
  minTicksInState: z.number().int().nonnegative()
});

export const RegimeStateMachineV1Schema = z.object({
  machineId: z.number().int().nonnegative(),
  domainId: DomainIdSchema,
  stateId: z.number().int().nonnegative(),
  enteredAt: AbsTimeSchema
});

// --- REGIME METRICS (docs/74-regime-metrics-observables.md) ---
export enum MetricKindV1 {
  Climate = 'Climate',
  Biosphere = 'Biosphere',
  CoreMagnetosphere = 'CoreMagnetosphere',
  Civilization = 'Civilization',
  Composite = 'Composite'
}
export const MetricKindV1Schema = z.nativeEnum(MetricKindV1);

export enum MetricScopeV1 {
  Global = 'Global',
  Region = 'Region',
  Cell = 'Cell',
  Species = 'Species',
  Civilization = 'Civilization'
}
export const MetricScopeV1Schema = z.nativeEnum(MetricScopeV1);

export const MetricDefV1Schema = z.object({
  id: z.number().int().nonnegative(),
  kind: MetricKindV1Schema,
  scope: MetricScopeV1Schema,
  unit: UnitFamilyV1Schema,
  sourceIds: z.array(z.number().int().nonnegative())
});

export const MetricSampleV1Schema = z.object({
  metricId: z.number().int().nonnegative(),
  time: AbsTimeSchema,
  scopeId: z.number().int().nonnegative().optional(),
  value: z.number().int()
});
