// @ts-nocheck
/**
 * Core A6 Invariant Types
 * 
 * This file defines the core types for the A6 invariant system as specified
 * in the Wave 0 architecture document.
 * 
 * @module domain/invariants/types
 */

/**
 * Stage identifiers for the 14 pipeline stages.
 * Each stage represents a distinct phase in city generation.
 */
export type StageId =
  | 'S02_BOUNDARY'
  | 'S03_GATES'
  | 'S05_RIVER_ENFORCEMENT'
  | 'S06_ROADS'
  | 'S07_ROAD_WALL_SEMANTICS'
  | 'S07_5_BRIDGES'
  | 'S08_BLOCKS'
  | 'S11_ASSIGNMENTS'
  | 'S12_CIVIC_MASKS'
  | 'S13_BUILDINGS'
  | 'S14_FARMS'
  | 'S15_TREES'
  | 'S16_DIAGNOSTICS'
  | 'S_RENDER';

/**
 * Invariant severity levels.
 * - blocker: Must pass for release, halts generation if failed
 * - major: Significant issue, should be addressed
 * - minor: Minor issue, informational
 */
export type Severity = 'blocker' | 'major' | 'minor';

/**
 * Invariant category identifiers.
 * Groups related invariants by their domain concern.
 */
export type InvariantCategory =
  | 'C0'   // Wall fit and bailey
  | 'C1'   // Gate semantics
  | 'C2'   // River-wall semantics
  | 'C3'   // External routes
  | 'C4'   // Arterial/Blocks/Coverage
  | 'R1'   // Road geometry
  | 'B2'   // Bridge-road alignment
  | 'RR3'  // Road-river interaction
  | 'W4'   // Wall topology
  | 'D5'   // Density sanity
  | 'G6'   // Connectivity robustness
  | 'L7'   // Landmark anchoring
  | 'F8'   // Farm logic
  | 'R9'   // Render semantics
  | 'U10'  // Boundary derivation
  | 'CROSS_CUTTING'; // Cross-cutting concerns

/**
 * Specification for an A6 invariant.
 * Defines the properties and constraints for a single invariant rule.
 */
export interface InvariantSpec {
  /** Unique invariant identifier in format 'CRC-A6-XXX' or category format 'C0.1' */
  id: string;
  
  /** Category this invariant belongs to */
  category: InvariantCategory;
  
  /** Pipeline stage where this invariant is evaluated */
  stage: StageId;
  
  /** Severity level determining impact on release */
  severity: Severity;
  
  /** Human-readable description of the invariant's intent */
  intent: string;
  
  /** How the invariant is measured/evaluated */
  measure: string;
  
  /** The constraint that must be satisfied */
  constraint: string;
  
  /** Repair strategy when invariant is violated */
  repair: string;
  
  /** Evidence keys produced by this invariant */
  evidence: string[];
  
  /** Optional test identifier for verification */
  testId?: string;
}

/**
 * Result of evaluating an invariant.
 * Contains the outcome and details of the evaluation.
 */
export interface InvariantResult {
  /** ID of the invariant that was evaluated */
  invariantId: string;
  
  /** Whether the invariant passed */
  passed: boolean;
  
  /** The measured value from evaluation */
  measuredValue?: number | boolean;
  
  /** The threshold that was compared against */
  threshold?: number | boolean;
  
  /** IDs of entities that violated the invariant */
  violatedEntityIds: string[];
  
  /** Human-readable message describing the result */
  message: string;
  
  /** ISO timestamp when the evaluation occurred */
  timestamp: string;
  
  /** Additional evidence data from the evaluation */
  evidence: Record<string, unknown>;
}

/**
 * Registry interface for managing invariant specifications.
 * Provides lookup and query methods for accessing invariants.
 */
export interface InvariantRegistry {
  /** Get an invariant specification by its ID */
  getSpec(id: string): InvariantSpec | undefined;
  
  /** Get all invariant specifications for a given stage */
  getSpecsForStage(stage: StageId): InvariantSpec[];
  
  /** Get all blocker-level invariant specifications */
  getBlockers(): InvariantSpec[];
  
  /** Get all registered invariant specifications */
  getAllSpecs(): InvariantSpec[];
  
  /** Get the total count of registered invariants */
  getCount(): number;
}

/**
 * Mapping from invariant IDs to their evidence keys.
 * Used for looking up the diagnostic key for a given invariant.
 */
export type EvidenceKeyMapping = Record<string, string>;

/**
 * Evidence keys for A6 invariants.
 * Maps invariant IDs to their corresponding diagnostic key names.
 */
export const A6_EVIDENCE_KEYS: EvidenceKeyMapping = {
  // C0 Wall fit and bailey
  'CRC-A6-001': 'wall_defended_footprint_coverage',
  'CRC-A6-002': 'bailey_ratio_typed_zone_enforcement',
  'CRC-A6-003': 'bailey_patrol_loop_existence',
  'CRC-A6-004': 'bailey_gate_bridgehead_connectivity',
  'CRC-A6-005': 'deterministic_wall_refit_repair_trace',
  
  // C1 Gate semantics
  'CRC-A6-011': 'road_wall_gate_resolution',
  'CRC-A6-012': 'gatehouse_symbol_coverage',
  'CRC-A6-013': 'minimum_gate_spacing',
  'CRC-A6-014': 'gate_gap_clipping_visibility',
  
  // C2 River-wall semantics
  'CRC-A6-021': 'unresolved_river_wall_conflicts',
  'CRC-A6-022': 'river_strategy_selection',
  'CRC-A6-023': 'watergate_strategy_contract',
  'CRC-A6-024': 'river_wall_strategy_contract',
  'CRC-A6-025': 'quay_controlled_strategy_contract',
  'CRC-A6-026': 'fortified_bridge_strategy_contract',
  
  // C3 External routes
  'CRC-A6-031': 'minimum_offscreen_external_route_count',
  'CRC-A6-032': 'external_routes_gate_nodes',
  'CRC-A6-033': 'external_routes_wall_crossings',
  'CRC-A6-034': 'external_route_heading_divergence',
  
  // C4 Hierarchy, blocks, coverage
  'CRC-A6-041': 'arterial_skeleton_connectivity',
  'CRC-A6-042': 'block_polygonization_validity',
  'CRC-A6-043': 'building_overlap_hard_zero',
  'CRC-A6-044': 'per_block_coverage_tolerance',
  'CRC-A6-045': 'frontage_alignment_minimum_ratio',
  
  // R1 Road geometry
  'CRC-A6-051': 'road_turn_angle_constraints',
  'CRC-A6-052': 'road_segment_length_constraints',
  'CRC-A6-053': 'gate_approach_angle_quality',
  'CRC-A6-054': 'bridge_approach_angle_quality',
  
  // B2 Bridge-road alignment
  'CRC-A6-061': 'bridge_endpoint_snapping',
  'CRC-A6-062': 'bridgehead_plaza_reservation',
  'CRC-A6-063': 'minimum_bridge_spacing',
  
  // RR3 Road-river interaction
  'CRC-A6-071': 'road_river_crossing_authority',
  
  // W4 Wall topology
  'CRC-A6-081': 'wall_self_intersection_hard_zero',
  'CRC-A6-082': 'wall_interior_angle_concavity',
  'CRC-A6-083': 'wall_shape_complexity_ratio',
  'CRC-A6-084': 'tower_spacing_band_compliance',
  
  // D5 Density sanity
  'CRC-A6-091': 'radial_density_falloff_error_bound',
  'CRC-A6-092': 'adjacent_block_density_coherence_bound',
  
  // G6 Connectivity robustness
  'CRC-A6-101': 'largest_road_component_threshold',
  'CRC-A6-102': 'bridges_reduce_component_fragmentation',
  'CRC-A6-103': 'meaningless_loops_absent',
  
  // L7 Landmark anchoring
  'CRC-A6-111': 'market_arterial_degree_threshold',
  'CRC-A6-112': 'fortress_wall_relationship_threshold',
  'CRC-A6-113': 'gate_inn_proximity_threshold',
  
  // F8 Farm logic
  'CRC-A6-121': 'farms_outside_wall',
  'CRC-A6-122': 'farms_near_external_routes',
  'CRC-A6-123': 'farm_minimum_cluster_size',
  
  // R9 Render semantics
  'CRC-A6-131': 'canonical_layer_stack_order_contract',
  'CRC-A6-132': 'bridge_above_river_wall_above_buildings_precedence',
  
  // U10 Structural boundary derivation
  'CRC-A6-141': 'boundary_provenance_defended_footprint_derived',
  'CRC-A6-142': 'wall_path_functionally_dependent_defended_footprint_anchors',
  
  // Cross-cutting evidence and stage hooks
  'CRC-A6-151': 'stage_hook_execution_order_deterministic',
  'CRC-A6-152': 'invariant_repair_trace_completeness_schema',
  'CRC-A6-153': 'blocker_invariant_failure_halts_release',
  'CRC-A6-154': 'diagnostics_key_completeness_a6_registry'
};

/**
 * Ordered list of all stage IDs in pipeline execution order.
 */
export const STAGE_ORDER: StageId[] = [
  'S02_BOUNDARY',
  'S03_GATES',
  'S05_RIVER_ENFORCEMENT',
  'S06_ROADS',
  'S07_ROAD_WALL_SEMANTICS',
  'S07_5_BRIDGES',
  'S08_BLOCKS',
  'S11_ASSIGNMENTS',
  'S12_CIVIC_MASKS',
  'S13_BUILDINGS',
  'S14_FARMS',
  'S15_TREES',
  'S16_DIAGNOSTICS',
  'S_RENDER'
];

/**
 * Canonical Requirement IDs (REV1)
 * These IDs map to the synchronized normative specifications in Doc25.
 */
export const REV1_IDS = {
  EDGE_OWNERSHIP_BOUNDARY: 'CRC-F04-REV1',
  CELL_FIRST_BLOCKS: 'CRC-F08-REV1',
  RECURSIVE_SUBDIVISION: 'CRC-F11-REV1',
  VERTEX_ANCHORED_TOWERS: 'CRC-A4-009-REV1',
} as const;

