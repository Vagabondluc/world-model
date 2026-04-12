import { z } from 'zod';
import { AbsTimeSchema, DomainIdSchema, Digest64Schema } from './core';

// --- PARAMETERS (docs/56-unified-parameter-registry-schema-contract.md) ---
export enum ParamTypeV1 {
  INT32 = 'INT32',
  UINT32 = 'UINT32',
  FLOAT64 = 'FLOAT64',
  BOOL = 'BOOL',
  ENUM = 'ENUM'
}
export const ParamTypeV1Schema = z.nativeEnum(ParamTypeV1);

export const ParamValueV1Schema = z.union([
  z.number().int(),
  z.number(), // float64
  z.boolean(),
  z.literal(0),
  z.literal(1)
]);

export const ParamBoundsV1Schema = z.object({
  min: z.number(),
  max: z.number(),
  step: z.number().optional()
});

export const ParamFlagsV1Schema = z.object({
  affectsDeterminism: z.boolean(),
  mutableAtRuntime: z.boolean(),
  requiresRestart: z.boolean(),
  experimental: z.boolean().optional()
});

export enum ParamProvenanceV1 {
  EARTH = 'EARTH',
  GAMEPLAY = 'GAMEPLAY',
  FITTED = 'FITTED',
  SPECULATIVE = 'SPECULATIVE'
}
export const ParamProvenanceV1Schema = z.nativeEnum(ParamProvenanceV1);

export const ParameterDefinitionV1Schema = z.object({
  id: z.string(),
  type: ParamTypeV1Schema,
  defaultValue: ParamValueV1Schema,
  unit: z.string(),
  bounds: ParamBoundsV1Schema,
  flags: ParamFlagsV1Schema,
  provenance: ParamProvenanceV1Schema,
  calibratedOn: z.string().optional(),
  paramVersion: z.number().int().nonnegative(),
  description: z.string(),
  deprecatedSince: z.number().int().optional(),
  replacementParamId: z.string().optional()
});

export const DomainParameterSchemaV1Schema = z.object({
  domainId: DomainIdSchema,
  schemaVersion: z.number().int().nonnegative(),
  parameters: z.array(ParameterDefinitionV1Schema)
});

export const DomainParameterStateV1Schema = z.object({
  domainId: DomainIdSchema,
  schemaVersion: z.number().int().nonnegative(),
  values: z.record(z.string(), ParamValueV1Schema)
});
export type DomainParameterStateV1 = z.infer<typeof DomainParameterStateV1Schema>;

// --- SNAPSHOTS (docs/57-save-load-snapshot-contract.md) ---
export const RNGStateSnapshotV1Schema = z.object({
  baseSeed: z.bigint().nonnegative(),
  eventCounter: z.bigint().nonnegative()
});

export const DomainStateSnapshotV1Schema = z.object({
  domainId: DomainIdSchema,
  schemaVersion: z.number().int().nonnegative(),
  stateVersion: z.number().int().nonnegative(),
  authoritativeState: z.instanceof(Uint8Array), // BinaryBlob
  derivedCache: z.instanceof(Uint8Array).optional(),
  lastRunTime: AbsTimeSchema
});

export const SchedulerSnapshotV1Schema = z.object({
  domainNextRun: z.record(z.string(), AbsTimeSchema), // DomainId as key
  activeDomains: z.array(DomainIdSchema)
});

export const SnapshotV1Schema = z.object({
  snapshotVersion: z.number().int().nonnegative(),
  engineVersion: z.number().int().nonnegative(),
  registryVersion: z.number().int().nonnegative(),
  absTime: AbsTimeSchema,
  engineStep: z.bigint().nonnegative(),
  rngState: RNGStateSnapshotV1Schema,
  schedulerState: SchedulerSnapshotV1Schema,
  domainStates: z.array(DomainStateSnapshotV1Schema),
  parameterStates: z.array(DomainParameterStateV1Schema),
  globalDigest: Digest64Schema
});
export type SnapshotV1 = z.infer<typeof SnapshotV1Schema>;

// --- AUTHORITY (docs/58-state-authority-contract.md) ---
export enum DataKindV1 {
  ScalarGlobal = 'ScalarGlobal',
  ScalarDomain = 'ScalarDomain',
  FieldCell = 'FieldCell',
  FieldRegion = 'FieldRegion',
  LayerSparse = 'LayerSparse',
  EntityRecord = 'EntityRecord'
}
export const DataKindV1Schema = z.nativeEnum(DataKindV1);

export enum AuthorityModeV1 {
  Authoritative = 'Authoritative',
  DerivedCache = 'DerivedCache',
  PresentationOnly = 'PresentationOnly'
}
export const AuthorityModeV1Schema = z.nativeEnum(AuthorityModeV1);

export enum BoundPolicyV1 {
  Reject = 'Reject',
  Clamp = 'Clamp'
}
export const BoundPolicyV1Schema = z.nativeEnum(BoundPolicyV1);

export const AuthorityEntryV1Schema = z.object({
  id: z.number().int().nonnegative(),
  kind: DataKindV1Schema,
  mode: AuthorityModeV1Schema,
  ownerDomainId: DomainIdSchema,
  upstreamDeps: z.array(z.number().int()).optional(),
  clampMin: z.number().int(),
  clampMax: z.number().int(),
  boundPolicy: BoundPolicyV1Schema
});

export const AuthorityRegistryV1Schema = z.object({
  registryVersion: z.number().int().nonnegative(),
  entries: z.array(AuthorityEntryV1Schema)
});
export type AuthorityRegistryV1 = z.infer<typeof AuthorityRegistryV1Schema>;

// --- VALIDATION & INVARIANTS (docs/59-worlddelta-validation-invariant-enforcement.md) ---
export enum InvariantCheckKindV1 {
  NonNegativeField = 'NonNegativeField',
  RangeScalar = 'RangeScalar',
  ConservationWithinPPM = 'ConservationWithinPPM',
  MonotonicIncreasing = 'MonotonicIncreasing',
  SumLayerNotExceedScalar = 'SumLayerNotExceedScalar',
  PopNotExceedEnergy = 'PopNotExceedEnergy',
  ProbabilityPPMRange = 'ProbabilityPPMRange'
}
export const InvariantCheckKindV1Schema = z.nativeEnum(InvariantCheckKindV1);

export const InvariantDefV1Schema = z.object({
  id: z.number().int().nonnegative(),
  domainId: DomainIdSchema,
  severity: z.enum(["Warn", "Halt", "QuarantineDomain"]),
  check: InvariantCheckKindV1Schema,
  args: z.array(z.number().int()),
  dependentIds: z.array(z.number().int())
});

export const DeltaRejectionTraceV1Schema = z.object({
  time: AbsTimeSchema,
  domainId: DomainIdSchema,
  eventId: z.bigint().nonnegative(),
  deltaId: z.bigint().nonnegative(),
  reasonCodeId: z.number().int().nonnegative(),
  targetId: z.number().int().nonnegative(),
  detailsDigest: Digest64Schema
});

// --- EVENT SCHEMA (docs/60-event-schema-reason-code-registry.md) ---
export const EventTypeDefinitionV1Schema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string(),
  domainId: DomainIdSchema,
  payloadSchema: z.object({
    fields: z.array(z.object({
      fieldId: z.number().int().nonnegative(),
      valueType: z.string() // ValueType
    }))
  }),
  producesDeltas: z.boolean()
});

export const ReasonCodeDefinitionV1Schema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string(),
  severity: z.enum(["Info", "Warn", "Error"])
});

export const InvariantCodeDefinitionV1Schema = z.object({
  id: z.number().int().nonnegative(),
  domainId: DomainIdSchema,
  name: z.string(),
  severityDefault: z.enum(["Warn", "Halt", "QuarantineDomain"])
});

export const ExplainCodeDefinitionV1Schema = z.object({
  id: z.number().int().nonnegative(),
  domainId: DomainIdSchema,
  name: z.string()
});

export const EventSchemaRegistryV1Schema = z.object({
  registryVersion: z.number().int().nonnegative(),
  eventTypes: z.array(EventTypeDefinitionV1Schema),
  reasonCodes: z.array(ReasonCodeDefinitionV1Schema),
  invariantCodes: z.array(InvariantCodeDefinitionV1Schema),
  explainCodes: z.array(ExplainCodeDefinitionV1Schema)
});

export const EventInstanceV1Schema = z.object({
  eventId: z.bigint().nonnegative(),
  eventTypeId: z.number().int().nonnegative(),
  domainId: DomainIdSchema,
  absTime: AbsTimeSchema,
  payload: z.instanceof(Uint8Array) // FixedBinaryBlob
});