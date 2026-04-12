
import { DomainId } from '../types';

export enum DataKindV1 {
  ScalarGlobal = 'SCALAR_GLOBAL',
  ScalarDomain = 'SCALAR_DOMAIN',
  FieldCell = 'FIELD_CELL',
  FieldRegion = 'FIELD_REGION',
  LayerSparse = 'LAYER_SPARSE',
  EntityRecord = 'ENTITY_RECORD'
}

export enum AuthorityModeV1 {
  Authoritative = 'AUTHORITATIVE', // Only owner can write, downstream relies on this
  DerivedCache = 'DERIVED_CACHE',  // Recomputable optimization, owner writes
  PresentationOnly = 'PRESENTATION_ONLY' // Not for simulation logic
}

export enum BoundPolicyV1 {
  Reject = 'REJECT',
  Clamp = 'CLAMP'
}

export interface AuthorityEntryV1 {
  id: number;
  kind: DataKindV1;
  mode: AuthorityModeV1;
  ownerDomainId: DomainId;
  upstreamDeps?: number[]; // IDs this datum depends on
  clampMin?: number;
  clampMax?: number;
  boundPolicy?: BoundPolicyV1;
  description?: string;
}

export interface AuthorityRegistryV1 {
  registryVersion: number;
  entries: AuthorityEntryV1[];
}
