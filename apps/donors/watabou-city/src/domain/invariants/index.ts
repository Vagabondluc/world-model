// @ts-nocheck
/**
 * A6 Invariants Module
 * 
 * Exports all types, interfaces, and the invariant registry for the
 * A6 invariant system as specified in the Wave 0 architecture.
 * 
 * @module domain/invariants
 */

// Core types and interfaces
export type {
  StageId,
  Severity,
  InvariantCategory,
  InvariantSpec,
  InvariantResult,
  InvariantRegistry,
  EvidenceKeyMapping
} from './types';

// Constants
export {
  A6_EVIDENCE_KEYS,
  STAGE_ORDER
} from './types';

// Registry implementation
export {
  A6InvariantRegistry,
  getA6Registry,
  resetA6Registry
} from './registry';
