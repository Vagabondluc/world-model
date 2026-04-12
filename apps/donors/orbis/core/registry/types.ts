
import { DomainId } from '../types';

export enum ParamTypeV1 {
  INT32 = 'INT32',
  UINT32 = 'UINT32',
  FLOAT64 = 'FLOAT64',
  BOOL = 'BOOL',
  ENUM = 'ENUM'
}

export type ParamValueV1 = number; // JS number covers int/float. 

export interface ParamBoundsV1 {
  min: number;
  max: number;
  step?: number;
}

export interface ParamFlagsV1 {
  affectsDeterminism: boolean;
  mutableAtRuntime: boolean;
  requiresRestart: boolean;
  experimental?: boolean;
}

export enum ParamProvenanceV1 {
  EARTH = 'EARTH',        // Empirical Earth data
  GAMEPLAY = 'GAMEPLAY',  // Tuned for UX
  FITTED = 'FITTED',      // Derived from stability runs
  SPECULATIVE = 'SPECULATIVE' // Best-guess
}

export interface ParameterDefinitionV1 {
  id: string;
  type: ParamTypeV1;
  defaultValue: ParamValueV1;
  unit: string;
  bounds: ParamBoundsV1;
  flags: ParamFlagsV1;
  provenance: ParamProvenanceV1;
  description: string;
}

export interface DomainParameterSchemaV1 {
  domainId: DomainId;
  schemaVersion: number;
  parameters: ParameterDefinitionV1[];
}

export interface GlobalParameterRegistryV1 {
  registryVersion: number;
  domains: DomainParameterSchemaV1[];
}

export interface ParamChangeEventV1 {
  domainId: DomainId;
  paramId: string;
  oldValue: ParamValueV1;
  newValue: ParamValueV1;
  absTime: bigint;
}
