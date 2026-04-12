
import { AbsTime, DomainId } from '../types';
import { FieldId } from '../registry/FieldRegistry';

/**
 * Operations allowed on authoritative fields.
 */
export enum DeltaOpV1 {
  SET = 'SET',           // Overwrite value (e.g., God mode, Regeneration)
  ADD = 'ADD',           // Numeric addition (e.g., Erosion, Temperature flux)
  SUB = 'SUB',           // Numeric subtraction
  BIT_OR = 'BIT_OR',     // Flag setting
  BIT_AND = 'BIT_AND'    // Flag clearing
}

/**
 * A single atomic mutation to a specific field.
 */
export interface DeltaPayloadV1 {
  fieldId: FieldId;
  op: DeltaOpV1;
  value: number; // Value in canonical units (Meters, Celsius, PPM, etc.)
}

/**
 * A collection of changes applying to a single entity (Cell, Region, etc.).
 */
export interface EntityDeltaV1 {
  targetId: string; // E.g., "cell-1042", "global", "civ-5"
  changes: DeltaPayloadV1[];
}

/**
 * The transactional envelope for a set of mutations happening at a specific time.
 * This is the atomic unit of history in the simulation.
 */
export interface WorldDeltaBatchV1 {
  id: string;               // Unique Batch ID (UUID/Hash)
  timestamp: AbsTime;       // When this delta is applied
  sourceDomain: DomainId;   // Who caused this? (e.g., HYDROLOGY, PLAYER)
  reasonCode: number;       // For causality tracking (defined in Event Registry)
  description?: string;     // Debug/Narrative text
  deltas: EntityDeltaV1[];  // Sparse list of entities changed
}
