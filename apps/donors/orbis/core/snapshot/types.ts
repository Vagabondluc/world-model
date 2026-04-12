
import { AbsTime, DomainId } from '../types';

/**
 * SnapshotV1: The canonical save format for Orbis 2.0.
 * Follows Spec: docs/update/specs/57-save-load-snapshot-contract.md
 * 
 * All BigInts are serialized as strings to ensure JSON compatibility.
 */

export interface RNGStateSnapshotV1 {
  baseSeed: string;     // uint64 -> string
  eventCounter: string; // uint64 -> string
}

export interface SchedulerSnapshotV1 {
  domainNextRun: Record<string, string>; // DomainId -> AbsTime (string)
  activeDomains: DomainId[];
}

export interface DomainStateSnapshotV1 {
  domainId: DomainId;
  schemaVersion: number;
  stateVersion: number;
  authoritativeState: any; // Domain-specific JSON object or Blob
  derivedCache?: any;
  lastRunTime: string;     // AbsTime (string)
}

export interface SnapshotV1 {
  snapshotVersion: number;
  engineVersion: number;
  registryVersion: number;

  absTime: string;    // AbsTime (string)
  engineStep: string; // uint64 (string)

  rngState: RNGStateSnapshotV1;
  schedulerState: SchedulerSnapshotV1;

  domainStates: DomainStateSnapshotV1[];
  // parameterStates: DomainParameterStateV1[]; // Future integration with Registry

  globalDigest: string; // Digest64 (string)
}
