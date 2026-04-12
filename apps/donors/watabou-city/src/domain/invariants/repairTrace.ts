// @ts-nocheck
/**
 * Repair Trace System for A6 Invariants
 * 
 * This module provides the repair trace schema and collector for tracking
 * invariant violations and repairs throughout the city generation pipeline.
 * 
 * @module domain/invariants/repairTrace
 */

import { StageId, Severity } from './types';

/**
 * Represents a single repair trace entry documenting an invariant violation and repair.
 * Each entry captures the before/after state of a repair operation.
 */
export interface RepairTraceEntry {
  /** Unique identifier for the invariant that was violated */
  invariant_id: string;
  
  /** Metrics before the repair was applied */
  before_metrics: Record<string, number>;
  
  /** Metrics after the repair was applied */
  after_metrics: Record<string, number>;
  
  /** IDs of geometry entities that were modified during repair */
  geometry_ids_touched: string[];
  
  /** Key used for deterministic tie-breaking in repair ordering */
  tie_break_key: string;
  
  /** Name of the repair function that was applied */
  repair_function: string;
  
  /** ISO timestamp when the repair was applied */
  timestamp: string;
  
  /** Pipeline stage where the repair occurred */
  stage: StageId;
  
  /** Attempt number within the retry policy */
  attempt: number;
}

/**
 * Artifact containing the complete repair trace for a generation run.
 * Includes all entries and summary statistics.
 */
export interface RepairTraceArtifact {
  /** Unique identifier for this generation run */
  run_id: string;
  
  /** Seed used for generation */
  seed: number;
  
  /** Size parameter used for generation */
  size: number;
  
  /** Profile name used for generation */
  profile: string;
  
  /** All repair trace entries for this run */
  entries: RepairTraceEntry[];
  
  /** Summary statistics for the repair trace */
  summary: {
    /** Total number of repairs applied */
    total_repairs: number;
    
    /** Repairs grouped by invariant ID */
    by_invariant: Record<string, number>;
    
    /** Repairs grouped by pipeline stage */
    by_stage: Record<string, number>;
    
    /** Repairs grouped by severity level */
    by_severity: Record<Severity, number>;
    
    /** All geometry IDs that were touched by any repair */
    geometry_ids_touched: string[];
  };
  
  /** List of invariant IDs that are blocking release */
  release_blockers: string[];
}

/**
 * Collector for aggregating repair trace entries throughout generation.
 * Provides methods for recording repairs and generating artifacts.
 * 
 * @example
 * ```typescript
 * const collector = new RepairTraceCollector();
 * 
 * collector.recordRepair({
 *   invariant_id: 'CRC-A6-011',
 *   before_metrics: { violation_count: 3 },
 *   after_metrics: { violation_count: 0 },
 *   geometry_ids_touched: ['road-1', 'road-2'],
 *   tie_break_key: 'CRC-A6-011-0',
 *   repair_function: 'prune_road_segment',
 *   timestamp: new Date().toISOString(),
 *   stage: 'S07_ROAD_WALL_SEMANTICS',
 *   attempt: 0
 * });
 * 
 * const artifact = collector.generateArtifact('run-001', 12345, 100, 'default');
 * ```
 */
export class RepairTraceCollector {
  private entries: RepairTraceEntry[] = [];
  private runMetadata: {
    seed?: number;
    size?: number;
    profile?: string;
  } = {};

  /**
   * Records a repair operation in the trace.
   * 
   * @param entry - The repair trace entry to record
   */
  recordRepair(entry: RepairTraceEntry): void {
    this.entries.push(entry);
  }

  /**
   * Gets all recorded repair trace entries.
   * 
   * @returns Array of all repair trace entries
   */
  getEntries(): RepairTraceEntry[] {
    return [...this.entries];
  }

  /**
   * Gets repair trace entries for a specific invariant.
   * 
   * @param invariantId - The invariant ID to filter by
   * @returns Array of repair trace entries for the specified invariant
   */
  getEntriesForInvariant(invariantId: string): RepairTraceEntry[] {
    return this.entries.filter(entry => entry.invariant_id === invariantId);
  }

  /**
   * Gets repair trace entries for a specific pipeline stage.
   * 
   * @param stage - The stage ID to filter by
   * @returns Array of repair trace entries for the specified stage
   */
  getEntriesForStage(stage: StageId): RepairTraceEntry[] {
    return this.entries.filter(entry => entry.stage === stage);
  }

  /**
   * Gets the list of invariant IDs that are blocking release.
   * These are invariants with severity 'blocker' that have unresolved violations.
   * 
   * @returns Array of blocker invariant IDs
   */
  getBlockers(): string[] {
    // Group entries by invariant and check for unresolved issues
    const invariantStatus = new Map<string, { hasViolations: boolean; lastAttempt: number }>();
    
    for (const entry of this.entries) {
      const current = invariantStatus.get(entry.invariant_id) || { hasViolations: false, lastAttempt: -1 };
      
      // If after_metrics shows violations > 0, it's still blocked
      const hasViolations = (entry.after_metrics['violation_count'] ?? 0) > 0 ||
                           (entry.after_metrics['unresolved_count'] ?? 0) > 0;
      
      if (entry.attempt > current.lastAttempt) {
        current.lastAttempt = entry.attempt;
        current.hasViolations = hasViolations;
      }
      
      invariantStatus.set(entry.invariant_id, current);
    }
    
    // Return invariants that still have violations
    const blockers: string[] = [];
    for (const [invariantId, status] of invariantStatus) {
      if (status.hasViolations) {
        blockers.push(invariantId);
      }
    }
    
    return blockers;
  }

  /**
   * Generates a complete repair trace artifact for the generation run.
   * 
   * @param runId - Unique identifier for this run
   * @param seed - Seed used for generation
   * @param size - Size parameter used for generation
   * @param profile - Profile name used for generation
   * @returns Complete repair trace artifact
   */
  generateArtifact(
    runId: string,
    seed: number,
    size: number,
    profile: string
  ): RepairTraceArtifact {
    const summary = this.computeSummary();
    
    return {
      run_id: runId,
      seed,
      size,
      profile,
      entries: this.getEntries(),
      summary,
      release_blockers: this.getBlockers()
    };
  }

  /**
   * Clears all recorded entries and resets the collector.
   */
  clear(): void {
    this.entries = [];
    this.runMetadata = {};
  }

  /**
   * Sets metadata for the current run.
   * 
   * @param metadata - Partial metadata to set
   */
  setMetadata(metadata: Partial<{ seed: number; size: number; profile: string }>): void {
    this.runMetadata = { ...this.runMetadata, ...metadata };
  }

  /**
   * Gets the count of recorded entries.
   * 
   * @returns Number of repair trace entries
   */
  getCount(): number {
    return this.entries.length;
  }

  /**
   * Checks if there are any recorded entries.
   * 
   * @returns True if there are entries, false otherwise
   */
  hasEntries(): boolean {
    return this.entries.length > 0;
  }

  /**
   * Gets all unique geometry IDs touched by repairs.
   * 
   * @returns Array of unique geometry IDs
   */
  getTouchedGeometryIds(): string[] {
    const ids = new Set<string>();
    for (const entry of this.entries) {
      for (const id of entry.geometry_ids_touched) {
        ids.add(id);
      }
    }
    return Array.from(ids);
  }

  /**
   * Computes summary statistics from the recorded entries.
   * 
   * @returns Summary object with aggregated statistics
   */
  private computeSummary(): RepairTraceArtifact['summary'] {
    const byInvariant: Record<string, number> = {};
    const byStage: Record<string, number> = {};
    const bySeverity: Record<Severity, number> = {
      blocker: 0,
      major: 0,
      minor: 0
    };
    const geometryIdsTouched = new Set<string>();

    for (const entry of this.entries) {
      // Count by invariant
      byInvariant[entry.invariant_id] = (byInvariant[entry.invariant_id] || 0) + 1;
      
      // Count by stage
      byStage[entry.stage] = (byStage[entry.stage] || 0) + 1;
      
      // Collect geometry IDs
      for (const id of entry.geometry_ids_touched) {
        geometryIdsTouched.add(id);
      }
      
      // Note: severity is inferred from invariant_id prefix for now
      // In a full implementation, this would come from the registry
      const severity = this.inferSeverity(entry.invariant_id);
      bySeverity[severity]++;
    }

    return {
      total_repairs: this.entries.length,
      by_invariant: byInvariant,
      by_stage: byStage,
      by_severity: bySeverity,
      geometry_ids_touched: Array.from(geometryIdsTouched)
    };
  }

  /**
   * Infers severity from invariant ID based on known blocker invariants.
   * In a full implementation, this would query the A6InvariantRegistry.
   * 
   * @param invariantId - The invariant ID
   * @returns Inferred severity level
   */
  private inferSeverity(invariantId: string): Severity {
    // Known blocker invariants from A6 specification
    const blockerPatterns = [
      'CRC-A6-011', // road_wall_gate_resolution
      'CRC-A6-021', // unresolved_river_wall_conflicts
      'CRC-A6-043', // building_overlap_hard_zero
      'CRC-A6-081', // wall_self_intersection_hard_zero
      'CRC-A6-101', // largest_road_component_threshold
    ];
    
    if (blockerPatterns.some(pattern => invariantId.startsWith(pattern))) {
      return 'blocker';
    }
    
    // Major invariants
    if (invariantId.includes('minimum') || invariantId.includes('threshold')) {
      return 'major';
    }
    
    return 'minor';
  }
}

/**
 * Factory function to create a new repair trace collector.
 * 
 * @returns A new RepairTraceCollector instance
 */
export function createRepairTraceCollector(): RepairTraceCollector {
  return new RepairTraceCollector();
}

/**
 * Helper function to create a repair trace entry.
 * 
 * @param invariantId - The invariant ID
 * @param stage - The pipeline stage
 * @param attempt - The attempt number
 * @param repairFunction - The repair function name
 * @param beforeMetrics - Metrics before repair
 * @param afterMetrics - Metrics after repair
 * @param geometryIdsTouched - Geometry IDs modified
 * @returns A complete RepairTraceEntry
 */
export function createRepairEntry(
  invariantId: string,
  stage: StageId,
  attempt: number,
  repairFunction: string,
  beforeMetrics: Record<string, number>,
  afterMetrics: Record<string, number>,
  geometryIdsTouched: string[]
): RepairTraceEntry {
  return {
    invariant_id: invariantId,
    before_metrics: beforeMetrics,
    after_metrics: afterMetrics,
    geometry_ids_touched: geometryIdsTouched,
    tie_break_key: `${invariantId}-${stage}-${attempt}`,
    repair_function: repairFunction,
    timestamp: `gen-${stage}-${attempt}`,
    stage,
    attempt
  };
}
