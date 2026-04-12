
import { AbsTime, DomainId, DomainMode } from '../types';

/**
 * Event IDs for the deterministic invalidation system.
 */
export type EventId =
  | "ClimateChanged"
  | "SeaLevelChanged"
  | "TectonicsEpochChanged"
  | "CarbonChanged"
  | "MagnetosphereChanged"
  | "BiomeInvalidated"
  | "HydrologyInvalidated";

/**
 * A discrete simulation event used for invalidation and history tracking.
 */
export interface SimEvent {
  atTimeUs: AbsTime;
  id: EventId;
  payloadHash: number; // Small deterministic hash for change detection
}

/**
 * Configuration for a specific simulation domain's clock.
 */
export interface DomainClockSpec {
  domain: DomainId;
  quantumUs: AbsTime;        // Smallest resolution
  stepUs: AbsTime;           // Standard update step
  mode: DomainMode;
  maxCatchupSteps: number;   // Performance safety limit
}

/**
 * Persistent state of a domain's progress through absolute time.
 */
export interface DomainClockState {
  lastStepTimeUs: AbsTime;
}

/**
 * Interface for domains that can be stepped incrementally or regenerated to a point in time.
 * Includes optional hooks for Snapshot V1 serialization.
 */
export interface ISimDomain {
  id: DomainId;
  step(): void;
  regenerateTo(tNowUs: AbsTime): void;
  
  // Snapshot V1 Hooks (Optional during migration)
  getSnapshot?(): any; 
  restoreSnapshot?(state: any): void;
}
