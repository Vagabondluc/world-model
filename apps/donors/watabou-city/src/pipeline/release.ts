// @ts-nocheck
/**
 * Release Gate Module with A6 Blocker Invariant Checking
 * 
 * This module provides release decision functionality integrated with
 * A6 Wave 0 blocker invariant enforcement. Release is blocked when
 * any blocker invariant fails.
 * 
 * @module pipeline/release
 */

import { ConsensusResult } from './consensus';
import { PolicyReport } from './policy';
import { CityDiagnostics } from '../domain/diagnostics/metrics';

/**
 * Invariant severity levels for A6 release gate.
 */
export enum InvariantSeverity {
  BLOCKER = 'blocker',
  CRITICAL = 'critical',
  MAJOR = 'major',
  MINOR = 'minor'
}

/**
 * Result of evaluating a single invariant.
 */
export interface InvariantResult {
  invariantId: string;
  passed: boolean;
  severity: InvariantSeverity;
  measuredValue?: number | boolean;
  threshold?: number | boolean;
  message: string;
}

/**
 * Blocker condition function type.
 * Returns true if the blocker condition is triggered (release should be blocked).
 */
export type BlockerCondition = (diagnostics: CityDiagnostics) => boolean;

/**
 * Release decision with A6-specific fields.
 */
export interface ReleaseDecision {
  // ==========================================================================
  // Base release decision fields
  // ==========================================================================
  /** Whether release is approved */
  approved: boolean;
  /** Whether conformance tests passed */
  conformance_pass: boolean;
  /** Whether profile tests passed */
  profile_pass: boolean;
  /** Whether policy tests passed */
  policy_pass: boolean;
  /** Whether consensus was reached */
  consensus_pass: boolean;
  /** Whether evidence requirements passed */
  evidence_pass: boolean;
  /** Release profile used */
  profile: 'baseline' | 'strict' | 'release';
  /** ISO 8601 timestamp of decision */
  timestamp: string;
  
  // ==========================================================================
  // A6-specific fields
  // ==========================================================================
  /** Invariant IDs that blocked release */
  a6_blockers: string[];
  /** Number of blocker invariants failed */
  a6_blocker_count: number;
  /** Number of major invariants failed */
  a6_major_count: number;
  /** Number of minor invariants failed */
  a6_minor_count: number;
  /** Total repair operations in trace */
  a6_repair_trace_entries: number;
  /** Whether A6 invariants passed */
  a6_invariants_pass: boolean;
  /** Whether repair trace is complete */
  a6_repair_trace_complete: boolean;
  /** Whether diagnostics are complete */
  a6_diagnostics_complete: boolean;
}

/**
 * Predefined blocker conditions that halt release.
 * 
 * These conditions map to specific A6 invariants that are marked as blockers:
 * - C1: Road-wall gate resolution (CRC-A6-011)
 * - C2: River-wall strategy resolution (CRC-A6-021)
 * - C3: Offscreen routes (CRC-A6-031)
 * - C4.3: Building overlap (CRC-A6-043)
 * - RR3: Road-river crossing (CRC-A6-071)
 * - W4.1: Wall self-intersection (CRC-A6-081)
 * - F8.1: Farms inside wall (CRC-A6-121)
 * - G6.1: Connectivity threshold (CRC-A6-101)
 */
export const BLOCKER_CONDITIONS: Array<{
  id: string;
  description: string;
  check: BlockerCondition;
}> = [
  {
    id: 'CRC-A6-011',
    description: 'Road-wall gate resolution: unresolved road-wall intersections or gate-gap clipping issues exist',
    check: (d: CityDiagnostics) =>
      (d.unresolved_road_wall_intersections ?? 0) > 0 ||
      (d.gate_gap_clipping_count ?? 0) > 0
  },
  {
    id: 'CRC-A6-021',
    description: 'River-wall strategy resolution: unresolved river-wall intersections exist',
    check: (d: CityDiagnostics) => (d.unresolved_river_wall_intersections ?? 0) > 0
  },
  {
    id: 'CRC-A6-031',
    description: 'Offscreen routes: fewer than 2 offscreen roads',
    check: (d: CityDiagnostics) => (d.offscreen_road_count ?? 0) < 2
  },
  {
    id: 'CRC-A6-043',
    description: 'Building overlap: buildings overlap or intersect wall geometry',
    check: (d: CityDiagnostics) =>
      (d.building_overlap_count ?? 0) > 0 ||
      (d.building_wall_intersection_count ?? 0) > 0
  },
  {
    id: 'CRC-A6-071',
    description: 'Road-river crossing: unresolved road-river intersections exist',
    check: (d: CityDiagnostics) => (d.unresolved_road_river_intersections ?? 0) > 0
  },
  {
    id: 'CRC-A6-081',
    description: 'Wall self-intersection: wall has self-intersections or towers overlap river',
    check: (d: CityDiagnostics) =>
      (d.wall_self_intersections ?? 0) > 0 ||
      (d.tower_river_overlap_count ?? 0) > 0
  },
  {
    id: 'CRC-A6-121',
    description: 'Farm placement policy: at most 2 farms inside wall and majority of farms outside wall',
    check: (d: CityDiagnostics) => {
      const inside = d.farms_inside_wall_count ?? 0;
      const total = d.farms_total_count ?? 0;
      if (inside > 2) return true;
      if (total <= 0) return false;
      const outside = total - inside;
      return outside <= inside;
    }
  },
  {
    id: 'CRC-A6-101',
    description: 'Connectivity threshold: largest component ratio below 0.8',
    check: (d: CityDiagnostics) => (d.largest_component_ratio ?? 1) < 0.8
  },
];

/**
 * Phase 8: Quality gate thresholds for building cell-fill packer.
 * These are non-blocking checks that report quality regressions.
 */
export const QUALITY_GATE_THRESHOLDS = {
  /** Minimum acceptable mean coverage delta vs baseline */
  minCoverageDelta: 0.08,
  /** Maximum acceptable alignment regression (degrees) vs baseline */
  maxAlignmentRegressionDeg: 5.0,
  /** Maximum acceptable rejection ratio (rejections / total attempts) */
  maxRejectionRatio: 0.5,
} as const;

/**
 * Phase 8: Quality gate result for building cell-fill metrics.
 */
export interface QualityGateResult {
  /** Whether all quality gates passed */
  passed: boolean;
  /** Coverage delta vs baseline (positive = improvement) */
  coverageDelta: number | null;
  /** Whether coverage gate passed */
  coverageGatePassed: boolean;
  /** Alignment delta vs baseline (negative = improvement) */
  alignmentDelta: number | null;
  /** Whether alignment gate passed */
  alignmentGatePassed: boolean;
  /** Rejection ratio (0-1) */
  rejectionRatio: number | null;
  /** Whether rejection gate passed */
  rejectionGatePassed: boolean;
  /** Human-readable messages explaining gate results */
  messages: string[];
}

/**
 * Phase 8: Evaluate quality gates for building cell-fill metrics.
 * These are non-blocking checks that report quality regressions.
 *
 * @param diagnostics - City diagnostics to evaluate
 * @param baseline - Optional baseline metrics for comparison
 * @returns Quality gate result with pass/fail status and details
 */
export function evaluateQualityGates(
  diagnostics: CityDiagnostics,
  baseline?: {
    mean_cell_coverage: number;
    mean_alignment_error_deg: number;
  }
): QualityGateResult {
  const messages: string[] = [];
  let allPassed = true;

  // Coverage gate
  const actualCoverage = diagnostics.building_cell_actual_coverage ?? 0;
  const coverageDelta = baseline
    ? actualCoverage - baseline.mean_cell_coverage
    : null;
  const coverageGatePassed = coverageDelta === null
    ? true
    : coverageDelta >= QUALITY_GATE_THRESHOLDS.minCoverageDelta;
  
  if (!coverageGatePassed) {
    allPassed = false;
    messages.push(
      `Coverage delta ${coverageDelta?.toFixed(4)} below threshold ` +
      `${QUALITY_GATE_THRESHOLDS.minCoverageDelta} (baseline: ${baseline?.mean_cell_coverage.toFixed(4)}, ` +
      `actual: ${actualCoverage.toFixed(4)})`
    );
  } else if (coverageDelta !== null) {
    messages.push(
      `Coverage delta ${coverageDelta.toFixed(4)} meets threshold ` +
      `(>= ${QUALITY_GATE_THRESHOLDS.minCoverageDelta})`
    );
  }

  // Alignment gate
  const alignmentError = diagnostics.building_alignment_error_mean ?? 0;
  const alignmentDelta = baseline
    ? alignmentError - baseline.mean_alignment_error_deg
    : null;
  // For alignment, negative delta is improvement (less error)
  const alignmentGatePassed = alignmentDelta === null
    ? true
    : alignmentDelta <= QUALITY_GATE_THRESHOLDS.maxAlignmentRegressionDeg;
  
  if (!alignmentGatePassed) {
    allPassed = false;
    messages.push(
      `Alignment regression ${alignmentDelta?.toFixed(2)}° exceeds threshold ` +
      `${QUALITY_GATE_THRESHOLDS.maxAlignmentRegressionDeg}° (baseline: ${baseline?.mean_alignment_error_deg.toFixed(2)}°, ` +
      `actual: ${alignmentError.toFixed(2)}°)`
    );
  } else if (alignmentDelta !== null) {
    messages.push(
      `Alignment delta ${alignmentDelta.toFixed(2)}° within threshold ` +
      `(<= ${QUALITY_GATE_THRESHOLDS.maxAlignmentRegressionDeg}°)`
    );
  }

  // Rejection ratio gate
  const rejectionCount = diagnostics.building_pack_rejection_count ?? 0;
  const targetCoverage = diagnostics.building_cell_target_coverage ?? 0.3;
  // Estimate total attempts based on target coverage (rough heuristic)
  const estimatedAttempts = Math.max(10, Math.round(targetCoverage * 100));
  const rejectionRatio = rejectionCount / estimatedAttempts;
  const rejectionGatePassed = rejectionRatio <= QUALITY_GATE_THRESHOLDS.maxRejectionRatio;
  
  if (!rejectionGatePassed) {
    allPassed = false;
    messages.push(
      `Rejection ratio ${(rejectionRatio * 100).toFixed(1)}% exceeds threshold ` +
      `${(QUALITY_GATE_THRESHOLDS.maxRejectionRatio * 100)}% (${rejectionCount} rejections)`
    );
  } else {
    messages.push(
      `Rejection ratio ${(rejectionRatio * 100).toFixed(1)}% within threshold ` +
      `(<= ${(QUALITY_GATE_THRESHOLDS.maxRejectionRatio * 100)}%)`
    );
  }

  return {
    passed: allPassed,
    coverageDelta,
    coverageGatePassed,
    alignmentDelta,
    alignmentGatePassed,
    rejectionRatio,
    rejectionGatePassed,
    messages,
  };
}

/**
 * Major invariant conditions (non-blocking but tracked).
 */
export const MAJOR_CONDITIONS: Array<{
  id: string;
  description: string;
  check: BlockerCondition;
}> = [
  {
    id: 'CRC-A6-051',
    description: 'Road turn angle: minimum turn angle below 30 degrees',
    check: (d: CityDiagnostics) => (d.min_turn_angle_observed ?? 90) < 30
  },
  {
    id: 'CRC-A6-061',
    description: 'Bridge endpoint snapping: unsnapped bridge endpoints exist',
    check: (d: CityDiagnostics) => (d.bridge_endpoint_unsnapped_count ?? 0) > 0
  },
  {
    id: 'CRC-A6-083',
    description: 'Wall shape complexity: ratio exceeds 4.0',
    check: (d: CityDiagnostics) => (d.wall_shape_complexity_ratio ?? 3.5) > 4.0
  },
  {
    id: 'CRC-A6-091',
    description: 'Radial density error: MAE exceeds 0.3',
    check: (d: CityDiagnostics) => (d.density_radial_mae ?? 0) > 0.3
  }
];

/**
 * Minor invariant conditions (non-blocking, informational).
 */
export const MINOR_CONDITIONS: Array<{
  id: string;
  description: string;
  check: BlockerCondition;
}> = [
  {
    id: 'CRC-A6-052',
    description: 'Micro-segments: excessive micro-segments in road network',
    check: (d: CityDiagnostics) => (d.micro_segment_count ?? 0) > 50
  },
  {
    id: 'CRC-A6-092',
    description: 'Adjacent density coherence: large density differences between blocks',
    check: (d: CityDiagnostics) => (d.adjacent_density_diff_max ?? 0) > 0.5
  }
];

/**
 * Evaluates all blocker conditions against diagnostics.
 * 
 * @param diagnostics - City diagnostics to evaluate
 * @returns Array of failed blocker invariant IDs
 */
export function evaluateBlockerConditions(diagnostics: CityDiagnostics): string[] {
  const failedBlockers: string[] = [];
  
  for (const condition of BLOCKER_CONDITIONS) {
    if (condition.check(diagnostics)) {
      failedBlockers.push(condition.id);
    }
  }
  
  return failedBlockers;
}

/**
 * Evaluates all major conditions against diagnostics.
 * 
 * @param diagnostics - City diagnostics to evaluate
 * @returns Array of failed major invariant IDs
 */
export function evaluateMajorConditions(diagnostics: CityDiagnostics): string[] {
  const failedMajor: string[] = [];
  
  for (const condition of MAJOR_CONDITIONS) {
    if (condition.check(diagnostics)) {
      failedMajor.push(condition.id);
    }
  }
  
  return failedMajor;
}

/**
 * Evaluates all minor conditions against diagnostics.
 * 
 * @param diagnostics - City diagnostics to evaluate
 * @returns Array of failed minor invariant IDs
 */
export function evaluateMinorConditions(diagnostics: CityDiagnostics): string[] {
  const failedMinor: string[] = [];
  
  for (const condition of MINOR_CONDITIONS) {
    if (condition.check(diagnostics)) {
      failedMinor.push(condition.id);
    }
  }
  
  return failedMinor;
}

/**
 * Checks if diagnostics have all required A6 keys.
 * 
 * @param diagnostics - City diagnostics to check
 * @returns True if all required keys are present
 */
export function checkDiagnosticsCompleteness(diagnostics: CityDiagnostics): boolean {
  const requiredKeys: (keyof CityDiagnostics)[] = [
    'min_turn_angle_observed',
    'micro_segment_count',
    'bridge_endpoint_unsnapped_count',
    'wall_shape_complexity_ratio',
    'density_radial_mae',
    'road_component_count',
    'largest_component_ratio',
    'farms_inside_wall_count',
    'boundary_derivation_source',
    'render_layer_stack'
  ];
  
  for (const key of requiredKeys) {
    if (diagnostics[key] === undefined) {
      return false;
    }
  }
  
  return true;
}

/**
 * Creates a base release decision.
 * 
 * @param conformancePassed - Whether conformance tests passed
 * @param consensus - Consensus result
 * @param policy - Policy report
 * @param profile - Release profile
 * @param profilePassed - Whether profile tests passed
 * @param evidencePassed - Whether evidence requirements passed
 * @returns Base release decision
 */
export function makeReleaseDecision(
  conformancePassed: boolean,
  consensus: ConsensusResult,
  policy: PolicyReport,
  profile: 'baseline' | 'strict' | 'release' = 'baseline',
  profilePassed = true,
  evidencePassed = true,
): ReleaseDecision {
  const conformance_pass = conformancePassed;
  const profile_pass = profilePassed;
  const policy_pass = policy.status === 'pass';
  const consensus_pass = consensus.consensus === 'pass';
  const evidence_pass = evidencePassed;
  
  const approved = conformance_pass && profile_pass && policy_pass && consensus_pass && evidence_pass;

  return {
    approved,
    conformance_pass,
    profile_pass,
    policy_pass,
    consensus_pass,
    evidence_pass,
    profile,
    timestamp: new Date().toISOString(),
    
    // A6 fields with defaults
    a6_blockers: [],
    a6_blocker_count: 0,
    a6_major_count: 0,
    a6_minor_count: 0,
    a6_repair_trace_entries: 0,
    a6_invariants_pass: true,
    a6_repair_trace_complete: true,
    a6_diagnostics_complete: true,
  };
}

/**
 * Creates an A6-aware release decision with blocker invariant checking.
 * 
 * This function evaluates all blocker conditions and blocks release
 * if any blocker invariant fails, regardless of other pass/fail status.
 * 
 * @param conformancePassed - Whether conformance tests passed
 * @param consensus - Consensus result
 * @param policy - Policy report
 * @param diagnostics - City diagnostics for A6 invariant checking
 * @param profile - Release profile
 * @param profilePassed - Whether profile tests passed
 * @param evidencePassed - Whether evidence requirements passed
 * @param repairTraceEntries - Number of repair trace entries (optional)
 * @returns Complete release decision with A6 fields
 */
export function makeA6ReleaseDecision(
  conformancePassed: boolean,
  consensus: ConsensusResult,
  policy: PolicyReport,
  diagnostics: CityDiagnostics,
  profile: 'baseline' | 'strict' | 'release' = 'baseline',
  profilePassed = true,
  evidencePassed = true,
  repairTraceEntries = 0,
): ReleaseDecision {
  // Get base decision
  const baseDecision = makeReleaseDecision(
    conformancePassed,
    consensus,
    policy,
    profile,
    profilePassed,
    evidencePassed
  );
  
  // Evaluate A6 invariant conditions
  const blockerFailures = evaluateBlockerConditions(diagnostics);
  const majorFailures = evaluateMajorConditions(diagnostics);
  const minorFailures = evaluateMinorConditions(diagnostics);
  
  const a6InvariantsPass = blockerFailures.length === 0;
  const diagnosticsComplete = checkDiagnosticsCompleteness(diagnostics);
  
  // Release is blocked if any blocker invariant fails
  const approved = baseDecision.approved && a6InvariantsPass;
  
  return {
    ...baseDecision,
    approved,
    
    // A6-specific fields
    a6_blockers: blockerFailures,
    a6_blocker_count: blockerFailures.length,
    a6_major_count: majorFailures.length,
    a6_minor_count: minorFailures.length,
    a6_repair_trace_entries: repairTraceEntries,
    a6_invariants_pass: a6InvariantsPass,
    a6_repair_trace_complete: repairTraceEntries > 0 || blockerFailures.length === 0,
    a6_diagnostics_complete: diagnosticsComplete,
  };
}

/**
 * A6 Release Gate class for comprehensive release evaluation.
 * 
 * Provides methods for evaluating release readiness with full
 * A6 blocker invariant checking and detailed failure reporting.
 */
export class A6ReleaseGate {
  private customBlockerConditions: Array<{
    id: string;
    description: string;
    check: BlockerCondition;
  }> = [];
  
  /**
   * Adds a custom blocker condition to the release gate.
   * 
   * @param id - Invariant ID
   * @param description - Description of the condition
   * @param check - Function that returns true if condition fails
   */
  addBlockerCondition(
    id: string,
    description: string,
    check: BlockerCondition
  ): void {
    this.customBlockerConditions.push({ id, description, check });
  }
  
  /**
   * Evaluates all blocker conditions including custom ones.
   * 
   * @param diagnostics - City diagnostics to evaluate
   * @returns Array of failed blocker invariant IDs
   */
  evaluateAllBlockers(diagnostics: CityDiagnostics): string[] {
    const standardBlockers = evaluateBlockerConditions(diagnostics);
    const customBlockers = this.customBlockerConditions
      .filter(condition => condition.check(diagnostics))
      .map(condition => condition.id);
    
    return [...standardBlockers, ...customBlockers];
  }
  
  /**
   * Evaluates release readiness with comprehensive A6 checking.
   * 
   * @param conformancePassed - Whether conformance tests passed
   * @param consensus - Consensus result
   * @param policy - Policy report
   * @param diagnostics - City diagnostics
   * @param profile - Release profile
   * @param profilePassed - Whether profile tests passed
   * @param evidencePassed - Whether evidence requirements passed
   * @param repairTraceEntries - Number of repair trace entries
   * @returns Complete release decision
   */
  evaluateReleaseReadiness(
    conformancePassed: boolean,
    consensus: ConsensusResult,
    policy: PolicyReport,
    diagnostics: CityDiagnostics,
    profile: 'baseline' | 'strict' | 'release' = 'baseline',
    profilePassed = true,
    evidencePassed = true,
    repairTraceEntries = 0,
  ): ReleaseDecision {
    // Get standard A6 decision
    const decision = makeA6ReleaseDecision(
      conformancePassed,
      consensus,
      policy,
      diagnostics,
      profile,
      profilePassed,
      evidencePassed,
      repairTraceEntries
    );
    
    // Also check custom blockers
    const customBlockers = this.customBlockerConditions
      .filter(condition => condition.check(diagnostics))
      .map(condition => condition.id);
    
    if (customBlockers.length > 0) {
      decision.a6_blockers.push(...customBlockers);
      decision.a6_blocker_count += customBlockers.length;
      decision.approved = false;
      decision.a6_invariants_pass = false;
    }
    
    return decision;
  }
  
  /**
   * Gets a human-readable summary of the release decision.
   * 
   * @param decision - Release decision to summarize
   * @returns Formatted summary string
   */
  getDecisionSummary(decision: ReleaseDecision): string {
    const lines: string[] = [
      `Release Decision: ${decision.approved ? 'APPROVED' : 'BLOCKED'}`,
      `Profile: ${decision.profile}`,
      `Timestamp: ${decision.timestamp}`,
      '',
      'Gate Status:',
      `  Conformance: ${decision.conformance_pass ? 'PASS' : 'FAIL'}`,
      `  Profile: ${decision.profile_pass ? 'PASS' : 'FAIL'}`,
      `  Policy: ${decision.policy_pass ? 'PASS' : 'FAIL'}`,
      `  Consensus: ${decision.consensus_pass ? 'PASS' : 'FAIL'}`,
      `  Evidence: ${decision.evidence_pass ? 'PASS' : 'FAIL'}`,
      '',
      'A6 Invariant Status:',
      `  Invariants: ${decision.a6_invariants_pass ? 'PASS' : 'FAIL'}`,
      `  Blockers: ${decision.a6_blocker_count}`,
      `  Major: ${decision.a6_major_count}`,
      `  Minor: ${decision.a6_minor_count}`,
      `  Repair Trace Entries: ${decision.a6_repair_trace_entries}`,
      `  Diagnostics Complete: ${decision.a6_diagnostics_complete ? 'Yes' : 'No'}`,
    ];
    
    if (decision.a6_blockers.length > 0) {
      lines.push('', 'Failed Blockers:');
      for (const blockerId of decision.a6_blockers) {
        const condition = [...BLOCKER_CONDITIONS, ...this.customBlockerConditions]
          .find(c => c.id === blockerId);
        lines.push(`  - ${blockerId}: ${condition?.description ?? 'Unknown'}`);
      }
    }
    
    return lines.join('\n');
  }
}

/**
 * Default export: A6 release gate instance.
 */
export const defaultReleaseGate = new A6ReleaseGate();
