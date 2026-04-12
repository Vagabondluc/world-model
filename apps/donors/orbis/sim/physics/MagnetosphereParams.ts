
import { DomainId } from '../../core/types';
import { DomainParameterSchemaV1, ParamTypeV1, ParamProvenanceV1 } from '../../core/registry/types';

export const MagnetosphereSchema: DomainParameterSchemaV1 = {
  domainId: DomainId.PLANET_PHYSICS,
  schemaVersion: 1,
  parameters: [
    {
      id: 'kDynamo',
      type: ParamTypeV1.INT32,
      defaultValue: 30_000,
      unit: 'PPM',
      bounds: { min: 0, max: 100_000, step: 100 },
      flags: { affectsDeterminism: true, mutableAtRuntime: false, requiresRestart: false },
      provenance: ParamProvenanceV1.FITTED,
      description: 'Dynamo generation coefficient based on core heat and rotation.'
    },
    {
      id: 'kDecay',
      type: ParamTypeV1.INT32,
      defaultValue: 10_000,
      unit: 'PPM',
      bounds: { min: 0, max: 100_000, step: 100 },
      flags: { affectsDeterminism: true, mutableAtRuntime: false, requiresRestart: false },
      provenance: ParamProvenanceV1.FITTED,
      description: 'Natural field decay rate per tick.'
    },
    {
      id: 'kInstability',
      type: ParamTypeV1.INT32,
      defaultValue: 15_000,
      unit: 'PPM',
      bounds: { min: 0, max: 100_000, step: 100 },
      flags: { affectsDeterminism: true, mutableAtRuntime: false, requiresRestart: false },
      provenance: ParamProvenanceV1.FITTED,
      description: 'Field instability contribution from lack of tectonic flux.'
    },
    {
      id: 'baseFlipRate',
      type: ParamTypeV1.INT32,
      defaultValue: 15_000,
      unit: 'PPM',
      bounds: { min: 0, max: 100_000, step: 100 },
      flags: { affectsDeterminism: true, mutableAtRuntime: false, requiresRestart: false },
      provenance: ParamProvenanceV1.EARTH,
      description: 'Base rate of polarity reversal phase accumulation.'
    },
    {
      id: 'flipChaos',
      type: ParamTypeV1.INT32,
      defaultValue: 2_000_000,
      unit: 'PPM',
      bounds: { min: 0, max: 5_000_000, step: 1000 },
      flags: { affectsDeterminism: true, mutableAtRuntime: false, requiresRestart: false },
      provenance: ParamProvenanceV1.GAMEPLAY,
      description: 'Chaotic acceleration of flips when field health is low.'
    }
  ]
};
