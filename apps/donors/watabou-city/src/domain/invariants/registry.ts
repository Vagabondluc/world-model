// @ts-nocheck
/**
 * A6 Invariant Registry
 * 
 * Central registry for all 54 A6 invariants organized by category.
 * Provides lookup methods for accessing invariant specifications.
 * 
 * @module domain/invariants/registry
 */

import {
  StageId,
  Severity,
  InvariantCategory,
  InvariantSpec,
  InvariantRegistry,
  STAGE_ORDER
} from './types';

/**
 * A6 Invariant Registry Implementation
 * 
 * Manages all 54 A6 invariants and provides efficient lookup methods
 * for accessing specifications by ID, stage, or severity.
 */
export class A6InvariantRegistry implements InvariantRegistry {
  private invariants: Map<string, InvariantSpec> = new Map();
  private stageMap: Map<StageId, InvariantSpec[]> = new Map();
  private categoryMap: Map<InvariantCategory, InvariantSpec[]> = new Map();

  constructor() {
    this.initializeInvariants();
    this.buildStageMappings();
    this.buildCategoryMappings();
  }

  /**
   * Get an invariant specification by its ID.
   */
  getSpec(id: string): InvariantSpec | undefined {
    return this.invariants.get(id);
  }

  /**
   * Get all invariant specifications for a given stage.
   */
  getSpecsForStage(stage: StageId): InvariantSpec[] {
    return this.stageMap.get(stage) || [];
  }

  /**
   * Get all blocker-level invariant specifications.
   */
  getBlockers(): InvariantSpec[] {
    return Array.from(this.invariants.values())
      .filter(inv => inv.severity === 'blocker');
  }

  /**
   * Get all registered invariant specifications.
   */
  getAllSpecs(): InvariantSpec[] {
    return Array.from(this.invariants.values());
  }

  /**
   * Get the total count of registered invariants.
   */
  getCount(): number {
    return this.invariants.size;
  }

  /**
   * Get all invariants for a given category.
   */
  getSpecsByCategory(category: InvariantCategory): InvariantSpec[] {
    return this.categoryMap.get(category) || [];
  }

  /**
   * Get invariants organized by execution order for a stage.
   */
  getExecutionOrderForStage(stage: StageId): InvariantSpec[] {
    const stageInvariants = this.getSpecsForStage(stage);
    // Sort by severity (blockers first) then by ID
    return stageInvariants.sort((a, b) => {
      const severityOrder = { blocker: 0, major: 1, minor: 2 };
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return a.id.localeCompare(b.id);
    });
  }

  /**
   * Get all unique categories that have invariants.
   */
  getCategories(): InvariantCategory[] {
    return Array.from(this.categoryMap.keys());
  }

  /**
   * Check if an invariant exists with the given ID.
   */
  hasInvariant(id: string): boolean {
    return this.invariants.has(id);
  }

  // Private methods

  private register(spec: InvariantSpec): void {
    this.invariants.set(spec.id, spec);
  }

  private buildStageMappings(): void {
    for (const stage of STAGE_ORDER) {
      this.stageMap.set(stage, []);
    }
    
    for (const invariant of this.invariants.values()) {
      const stageInvariants = this.stageMap.get(invariant.stage) || [];
      stageInvariants.push(invariant);
      this.stageMap.set(invariant.stage, stageInvariants);
    }
  }

  private buildCategoryMappings(): void {
    for (const invariant of this.invariants.values()) {
      const categoryInvariants = this.categoryMap.get(invariant.category) || [];
      categoryInvariants.push(invariant);
      this.categoryMap.set(invariant.category, categoryInvariants);
    }
  }

  private initializeInvariants(): void {
    // ===========================================
    // C0: Wall Fit and Bailey (5 invariants)
    // ===========================================
    
    this.register({
      id: 'CRC-A6-001',
      category: 'C0',
      stage: 'S02_BOUNDARY',
      severity: 'blocker',
      intent: 'Wall must fully enclose the defended footprint with no gaps',
      measure: 'Ratio of defended footprint area inside wall boundary',
      constraint: 'Coverage >= 0.98',
      repair: 'Extend wall path to cover gaps or adjust defended footprint',
      evidence: ['wall_defended_footprint_coverage'],
      testId: 'test-c0-001'
    });

    this.register({
      id: 'CRC-A6-002',
      category: 'C0',
      stage: 'S02_BOUNDARY',
      severity: 'major',
      intent: 'Bailey zone ratio must be within acceptable bounds for city type',
      measure: 'Ratio of bailey area to total defended area',
      constraint: '0.05 <= bailey_ratio <= 0.35',
      repair: 'Adjust bailey zone boundaries or wall placement',
      evidence: ['bailey_ratio_typed_zone_enforcement'],
      testId: 'test-c0-002'
    });

    this.register({
      id: 'CRC-A6-003',
      category: 'C0',
      stage: 'S02_BOUNDARY',
      severity: 'major',
      intent: 'Bailey must have a patrol loop for guard movement',
      measure: 'Existence of connected patrol path in bailey zone',
      constraint: 'patrol_loop_exists == true',
      repair: 'Add connecting path segments to create patrol loop',
      evidence: ['bailey_patrol_loop_existence'],
      testId: 'test-c0-003'
    });

    this.register({
      id: 'CRC-A6-004',
      category: 'C0',
      stage: 'S03_GATES',
      severity: 'major',
      intent: 'Each bailey gate must connect to a bridgehead or internal road',
      measure: 'Count of bailey gates with valid connections',
      constraint: 'All bailey gates connected',
      repair: 'Add road connections from bailey gates to bridgeheads',
      evidence: ['bailey_gate_bridgehead_connectivity'],
      testId: 'test-c0-004'
    });

    this.register({
      id: 'CRC-A6-005',
      category: 'C0',
      stage: 'S02_BOUNDARY',
      severity: 'minor',
      intent: 'Wall refit operations must be deterministic and traceable',
      measure: 'Completeness of repair trace for wall modifications',
      constraint: 'repair_trace_completeness >= 0.95',
      repair: 'Log all wall modification steps to repair trace',
      evidence: ['deterministic_wall_refit_repair_trace'],
      testId: 'test-c0-005'
    });

    // ===========================================
    // C1: Gate Semantics (4 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-011',
      category: 'C1',
      stage: 'S07_ROAD_WALL_SEMANTICS',
      severity: 'blocker',
      intent: 'Every road-wall intersection must resolve to gate opening or road pruning',
      measure: 'Count of unresolved road-wall intersections',
      constraint: 'unresolved_intersections == 0',
      repair: 'Add gate at intersection or prune road segment',
      evidence: ['road_wall_gate_resolution'],
      testId: 'test-c1-011'
    });

    this.register({
      id: 'CRC-A6-012',
      category: 'C1',
      stage: 'S03_GATES',
      severity: 'minor',
      intent: 'Gatehouses must have proper symbol coverage for rendering',
      measure: 'Ratio of gates with gatehouse symbols',
      constraint: 'gatehouse_coverage >= 0.8',
      repair: 'Add gatehouse symbols to gates missing them',
      evidence: ['gatehouse_symbol_coverage'],
      testId: 'test-c1-012'
    });

    this.register({
      id: 'CRC-A6-013',
      category: 'C1',
      stage: 'S03_GATES',
      severity: 'major',
      intent: 'Gates must maintain minimum spacing for defensive plausibility',
      measure: 'Minimum distance between adjacent gates',
      constraint: 'min_gate_spacing >= 50 units',
      repair: 'Remove or relocate closely-spaced gates',
      evidence: ['minimum_gate_spacing'],
      testId: 'test-c1-013'
    });

    this.register({
      id: 'CRC-A6-014',
      category: 'C1',
      stage: 'S03_GATES',
      severity: 'minor',
      intent: 'Gate gaps must be properly clipped for visual clarity',
      measure: 'Visibility of unclipped gate gaps',
      constraint: 'unclipped_gaps == 0',
      repair: 'Apply gap clipping algorithm to gate openings',
      evidence: ['gate_gap_clipping_visibility'],
      testId: 'test-c1-014'
    });

    // ===========================================
    // C2: River-Wall Semantics (6 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-021',
      category: 'C2',
      stage: 'S05_RIVER_ENFORCEMENT',
      severity: 'blocker',
      intent: 'No unresolved river-wall conflicts allowed',
      measure: 'Count of river-wall intersections without resolution',
      constraint: 'unresolved_conflicts == 0',
      repair: 'Apply river-wall resolution strategy (watergate, bridge, quay)',
      evidence: ['unresolved_river_wall_conflicts'],
      testId: 'test-c2-021'
    });

    this.register({
      id: 'CRC-A6-022',
      category: 'C2',
      stage: 'S05_RIVER_ENFORCEMENT',
      severity: 'major',
      intent: 'River strategy selection must be deterministic based on context',
      measure: 'Consistency of strategy selection for similar contexts',
      constraint: 'strategy_selection_deterministic == true',
      repair: 'Apply deterministic strategy selection rules',
      evidence: ['river_strategy_selection'],
      testId: 'test-c2-022'
    });

    this.register({
      id: 'CRC-A6-023',
      category: 'C2',
      stage: 'S05_RIVER_ENFORCEMENT',
      severity: 'major',
      intent: 'Watergate strategy must satisfy contract requirements',
      measure: 'Watergate placement validity',
      constraint: 'watergate_contract_satisfied == true',
      repair: 'Ensure watergate has proper gate and channel geometry',
      evidence: ['watergate_strategy_contract'],
      testId: 'test-c2-023'
    });

    this.register({
      id: 'CRC-A6-024',
      category: 'C2',
      stage: 'S05_RIVER_ENFORCEMENT',
      severity: 'major',
      intent: 'River wall strategy must maintain wall continuity',
      measure: 'Wall continuity at river crossing points',
      constraint: 'wall_continuous_at_crossing == true',
      repair: 'Add wall segments along riverbank or bridge abutments',
      evidence: ['river_wall_strategy_contract'],
      testId: 'test-c2-024'
    });

    this.register({
      id: 'CRC-A6-025',
      category: 'C2',
      stage: 'S05_RIVER_ENFORCEMENT',
      severity: 'major',
      intent: 'Quay controlled strategy must provide dock access',
      measure: 'Quay accessibility from land and water',
      constraint: 'quay_accessible == true',
      repair: 'Add quay platform and connecting roads',
      evidence: ['quay_controlled_strategy_contract'],
      testId: 'test-c2-025'
    });

    this.register({
      id: 'CRC-A6-026',
      category: 'C2',
      stage: 'S07_5_BRIDGES',
      severity: 'major',
      intent: 'Fortified bridge strategy must include defensive structures',
      measure: 'Presence of fortifications at bridge endpoints',
      constraint: 'bridge_fortified == true for fortified_bridges',
      repair: 'Add tower or gatehouse at bridge endpoints',
      evidence: ['fortified_bridge_strategy_contract'],
      testId: 'test-c2-026'
    });

    // ===========================================
    // C3: External Routes (4 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-031',
      category: 'C3',
      stage: 'S06_ROADS',
      severity: 'blocker',
      intent: 'Minimum number of external routes must connect to city',
      measure: 'Count of offscreen external routes',
      constraint: 'external_route_count >= 2',
      repair: 'Add external road connections to map edge',
      evidence: ['minimum_offscreen_external_route_count'],
      testId: 'test-c3-031'
    });

    this.register({
      id: 'CRC-A6-032',
      category: 'C3',
      stage: 'S06_ROADS',
      severity: 'major',
      intent: 'External routes must terminate at gate nodes',
      measure: 'Ratio of external routes connected to gates',
      constraint: 'gate_connected_ratio >= 0.9',
      repair: 'Route external roads to nearest gate or add gate at termination',
      evidence: ['external_routes_gate_nodes'],
      testId: 'test-c3-032'
    });

    this.register({
      id: 'CRC-A6-033',
      category: 'C3',
      stage: 'S06_ROADS',
      severity: 'major',
      intent: 'External routes must properly cross wall boundary',
      measure: 'Count of valid wall crossings by external routes',
      constraint: 'all_crossings_valid == true',
      repair: 'Add gate at wall crossing or adjust route path',
      evidence: ['external_routes_wall_crossings'],
      testId: 'test-c3-033'
    });

    this.register({
      id: 'CRC-A6-034',
      category: 'C3',
      stage: 'S06_ROADS',
      severity: 'minor',
      intent: 'External route headings should diverge for coverage',
      measure: 'Angular divergence between external route headings',
      constraint: 'min_heading_divergence >= 30 degrees',
      repair: 'Adjust external route origins for better angular distribution',
      evidence: ['external_route_heading_divergence'],
      testId: 'test-c3-034'
    });

    // ===========================================
    // C4: Arterial/Blocks/Coverage (5 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-041',
      category: 'C4',
      stage: 'S06_ROADS',
      severity: 'blocker',
      intent: 'Arterial skeleton must be fully connected',
      measure: 'Connectivity ratio of arterial road network',
      constraint: 'arterial_connectivity == 1.0',
      repair: 'Add connecting arterial segments to isolated components',
      evidence: ['arterial_skeleton_connectivity'],
      testId: 'test-c4-041'
    });

    this.register({
      id: 'CRC-A6-042',
      category: 'C4',
      stage: 'S08_BLOCKS',
      severity: 'blocker',
      intent: 'All blocks must have valid polygon geometry',
      measure: 'Count of blocks with invalid polygons',
      constraint: 'invalid_blocks == 0',
      repair: 'Fix or remove blocks with self-intersecting or degenerate polygons',
      evidence: ['block_polygonization_validity'],
      testId: 'test-c4-042'
    });

    this.register({
      id: 'CRC-A6-043',
      category: 'C4',
      stage: 'S13_BUILDINGS',
      severity: 'blocker',
      intent: 'Buildings must not overlap each other',
      measure: 'Count of building pairs with overlapping footprints',
      constraint: 'overlapping_pairs == 0',
      repair: 'Remove or reposition overlapping buildings',
      evidence: ['building_overlap_hard_zero'],
      testId: 'test-c4-043'
    });

    this.register({
      id: 'CRC-A6-044',
      category: 'C4',
      stage: 'S13_BUILDINGS',
      severity: 'major',
      intent: 'Building coverage per block must be within tolerance',
      measure: 'Ratio of actual to target coverage per block',
      constraint: '0.4 <= coverage_ratio <= 0.8 per block',
      repair: 'Add or remove buildings to achieve target coverage',
      evidence: ['per_block_coverage_tolerance'],
      testId: 'test-c4-044'
    });

    this.register({
      id: 'CRC-A6-045',
      category: 'C4',
      stage: 'S13_BUILDINGS',
      severity: 'major',
      intent: 'Buildings must align to block frontage',
      measure: 'Ratio of buildings with proper frontage alignment',
      constraint: 'frontage_alignment_ratio >= 0.7',
      repair: 'Rotate or reposition buildings to face road frontage',
      evidence: ['frontage_alignment_minimum_ratio'],
      testId: 'test-c4-045'
    });

    // ===========================================
    // R1: Road Geometry (4 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-051',
      category: 'R1',
      stage: 'S06_ROADS',
      severity: 'major',
      intent: 'Road turn angles must be within acceptable bounds',
      measure: 'Maximum turn angle at road vertices',
      constraint: 'max_turn_angle <= 120 degrees',
      repair: 'Add intermediate vertices to smooth sharp turns',
      evidence: ['road_turn_angle_constraints'],
      testId: 'test-r1-051'
    });

    this.register({
      id: 'CRC-A6-052',
      category: 'R1',
      stage: 'S06_ROADS',
      severity: 'major',
      intent: 'Road segment lengths must be within bounds',
      measure: 'Distribution of road segment lengths',
      constraint: '10 <= segment_length <= 200 units',
      repair: 'Subdivide long segments or merge short segments',
      evidence: ['road_segment_length_constraints'],
      testId: 'test-r1-052'
    });

    this.register({
      id: 'CRC-A6-053',
      category: 'R1',
      stage: 'S03_GATES',
      severity: 'minor',
      intent: 'Gate approach angles should allow smooth entry',
      measure: 'Angle of road approach to gate',
      constraint: 'approach_angle_deviation <= 45 degrees',
      repair: 'Curve road approach to align with gate orientation',
      evidence: ['gate_approach_angle_quality'],
      testId: 'test-r1-053'
    });

    this.register({
      id: 'CRC-A6-054',
      category: 'R1',
      stage: 'S07_5_BRIDGES',
      severity: 'minor',
      intent: 'Bridge approach angles should allow smooth crossing',
      measure: 'Angle of road approach to bridge',
      constraint: 'bridge_approach_angle_deviation <= 30 degrees',
      repair: 'Align road segment with bridge axis',
      evidence: ['bridge_approach_angle_quality'],
      testId: 'test-r1-054'
    });

    // ===========================================
    // B2: Bridge-Road Alignment (3 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-061',
      category: 'B2',
      stage: 'S07_5_BRIDGES',
      severity: 'blocker',
      intent: 'Bridge endpoints must snap to road network',
      measure: 'Distance from bridge endpoints to nearest road',
      constraint: 'snap_distance <= 5 units',
      repair: 'Snap bridge endpoints to road vertices or add connecting segment',
      evidence: ['bridge_endpoint_snapping'],
      testId: 'test-b2-061'
    });

    this.register({
      id: 'CRC-A6-062',
      category: 'B2',
      stage: 'S07_5_BRIDGES',
      severity: 'major',
      intent: 'Bridgeheads must have plaza reservation for traffic',
      measure: 'Presence of plaza area at bridge endpoints',
      constraint: 'plaza_reserved == true for major bridges',
      repair: 'Reserve plaza space at bridge landings',
      evidence: ['bridgehead_plaza_reservation'],
      testId: 'test-b2-062'
    });

    this.register({
      id: 'CRC-A6-063',
      category: 'B2',
      stage: 'S07_5_BRIDGES',
      severity: 'major',
      intent: 'Bridges must maintain minimum spacing',
      measure: 'Minimum distance between bridge crossings',
      constraint: 'min_bridge_spacing >= 100 units',
      repair: 'Remove or relocate closely-spaced bridges',
      evidence: ['minimum_bridge_spacing'],
      testId: 'test-b2-063'
    });

    // ===========================================
    // RR3: Road-River Interaction (1 invariant)
    // ===========================================

    this.register({
      id: 'CRC-A6-071',
      category: 'RR3',
      stage: 'S07_5_BRIDGES',
      severity: 'blocker',
      intent: 'Roads can only cross rivers at designated crossing points',
      measure: 'Count of unauthorized road-river crossings',
      constraint: 'unauthorized_crossings == 0',
      repair: 'Add bridge at crossing or reroute road',
      evidence: ['road_river_crossing_authority'],
      testId: 'test-rr3-071'
    });

    // ===========================================
    // W4: Wall Topology (4 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-081',
      category: 'W4',
      stage: 'S02_BOUNDARY',
      severity: 'blocker',
      intent: 'Wall must not self-intersect',
      measure: 'Count of wall self-intersection points',
      constraint: 'self_intersections == 0',
      repair: 'Remove loop or adjust wall path to eliminate intersection',
      evidence: ['wall_self_intersection_hard_zero'],
      testId: 'test-w4-081'
    });

    this.register({
      id: 'CRC-A6-082',
      category: 'W4',
      stage: 'S02_BOUNDARY',
      severity: 'major',
      intent: 'Wall interior angles must be concave for defensibility',
      measure: 'Ratio of concave to total interior angles',
      constraint: 'concavity_ratio >= 0.6',
      repair: 'Adjust wall path to create concave angles',
      evidence: ['wall_interior_angle_concavity'],
      testId: 'test-w4-082'
    });

    this.register({
      id: 'CRC-A6-083',
      category: 'W4',
      stage: 'S02_BOUNDARY',
      severity: 'minor',
      intent: 'Wall shape complexity must be within bounds',
      measure: 'Ratio of wall perimeter to convex hull perimeter',
      constraint: 'complexity_ratio <= 2.0',
      repair: 'Simplify wall path to reduce complexity',
      evidence: ['wall_shape_complexity_ratio'],
      testId: 'test-w4-083'
    });

    this.register({
      id: 'CRC-A6-084',
      category: 'W4',
      stage: 'S02_BOUNDARY',
      severity: 'major',
      intent: 'Tower spacing must be within specified band',
      measure: 'Ratio of towers within spacing tolerance',
      constraint: '0.7 <= towers_in_band_ratio <= 1.0',
      repair: 'Add or remove towers to achieve proper spacing',
      evidence: ['tower_spacing_band_compliance'],
      testId: 'test-w4-084'
    });

    // ===========================================
    // D5: Density Sanity (2 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-091',
      category: 'D5',
      stage: 'S13_BUILDINGS',
      severity: 'major',
      intent: 'Building density must fall off radially from center',
      measure: 'Error bound of radial density falloff',
      constraint: 'falloff_error <= 0.2',
      repair: 'Adjust building distribution to match radial falloff profile',
      evidence: ['radial_density_falloff_error_bound'],
      testId: 'test-d5-091'
    });

    this.register({
      id: 'CRC-A6-092',
      category: 'D5',
      stage: 'S13_BUILDINGS',
      severity: 'minor',
      intent: 'Adjacent blocks must have coherent density',
      measure: 'Maximum density difference between adjacent blocks',
      constraint: 'adjacent_density_diff <= 0.3',
      repair: 'Smooth density transitions between blocks',
      evidence: ['adjacent_block_density_coherence_bound'],
      testId: 'test-d5-092'
    });

    // ===========================================
    // G6: Connectivity Robustness (3 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-101',
      category: 'G6',
      stage: 'S06_ROADS',
      severity: 'blocker',
      intent: 'Largest road component must cover threshold of network',
      measure: 'Ratio of roads in largest connected component',
      constraint: 'largest_component_ratio >= 0.9',
      repair: 'Add connecting roads to join isolated components',
      evidence: ['largest_road_component_threshold'],
      testId: 'test-g6-101'
    });

    this.register({
      id: 'CRC-A6-102',
      category: 'G6',
      stage: 'S07_5_BRIDGES',
      severity: 'major',
      intent: 'Bridges must reduce component fragmentation',
      measure: 'Change in component count after bridge placement',
      constraint: 'bridges_reduce_components == true',
      repair: 'Add bridges to connect separated road components',
      evidence: ['bridges_reduce_component_fragmentation'],
      testId: 'test-g6-102'
    });

    this.register({
      id: 'CRC-A6-103',
      category: 'G6',
      stage: 'S06_ROADS',
      severity: 'minor',
      intent: 'Road network must not contain meaningless loops',
      measure: 'Count of degenerate or unnecessary loops',
      constraint: 'meaningless_loops == 0',
      repair: 'Remove redundant road segments creating unnecessary loops',
      evidence: ['meaningless_loops_absent'],
      testId: 'test-g6-103'
    });

    // ===========================================
    // L7: Landmark Anchoring (3 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-111',
      category: 'L7',
      stage: 'S11_ASSIGNMENTS',
      severity: 'major',
      intent: 'Market must be placed on arterial road with high degree',
      measure: 'Degree of road node at market location',
      constraint: 'market_arterial_degree >= 3',
      repair: 'Relocate market to intersection of arterial roads',
      evidence: ['market_arterial_degree_threshold'],
      testId: 'test-l7-111'
    });

    this.register({
      id: 'CRC-A6-112',
      category: 'L7',
      stage: 'S11_ASSIGNMENTS',
      severity: 'major',
      intent: 'Fortress must have spatial relationship with wall',
      measure: 'Distance from fortress to wall',
      constraint: 'fortress_wall_distance <= 100 units',
      repair: 'Relocate fortress closer to wall boundary',
      evidence: ['fortress_wall_relationship_threshold'],
      testId: 'test-l7-112'
    });

    this.register({
      id: 'CRC-A6-113',
      category: 'L7',
      stage: 'S11_ASSIGNMENTS',
      severity: 'minor',
      intent: 'Inns must be in proximity to gates',
      measure: 'Maximum distance from inn to nearest gate',
      constraint: 'inn_gate_distance <= 80 units',
      repair: 'Relocate inns closer to gate locations',
      evidence: ['gate_inn_proximity_threshold'],
      testId: 'test-l7-113'
    });

    // ===========================================
    // F8: Farm Logic (3 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-121',
      category: 'F8',
      stage: 'S14_FARMS',
      severity: 'blocker',
      intent: 'Farms must be placed outside city wall',
      measure: 'Count of farms inside wall boundary',
      constraint: 'farms_inside_wall == 0',
      repair: 'Remove or relocate farms to outside wall',
      evidence: ['farms_outside_wall'],
      testId: 'test-f8-121'
    });

    this.register({
      id: 'CRC-A6-122',
      category: 'F8',
      stage: 'S14_FARMS',
      severity: 'major',
      intent: 'Farms must be near external routes for transport',
      measure: 'Ratio of farms near external roads',
      constraint: 'farms_near_routes_ratio >= 0.7',
      repair: 'Relocate farms closer to external road network',
      evidence: ['farms_near_external_routes'],
      testId: 'test-f8-122'
    });

    this.register({
      id: 'CRC-A6-123',
      category: 'F8',
      stage: 'S14_FARMS',
      severity: 'minor',
      intent: 'Farms must meet minimum cluster size for efficiency',
      measure: 'Average farm cluster size',
      constraint: 'avg_cluster_size >= 3',
      repair: 'Consolidate isolated farms into clusters',
      evidence: ['farm_minimum_cluster_size'],
      testId: 'test-f8-123'
    });

    // ===========================================
    // R9: Render Semantics (2 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-131',
      category: 'R9',
      stage: 'S_RENDER',
      severity: 'major',
      intent: 'Render layers must be in canonical order',
      measure: 'Compliance with layer stack order specification',
      constraint: 'layer_order_correct == true',
      repair: 'Reorder render layers to match canonical specification',
      evidence: ['canonical_layer_stack_order_contract'],
      testId: 'test-r9-131'
    });

    this.register({
      id: 'CRC-A6-132',
      category: 'R9',
      stage: 'S_RENDER',
      severity: 'major',
      intent: 'Bridge elements must render above river and wall above buildings',
      measure: 'Z-order compliance for key element relationships',
      constraint: 'z_order_correct == true',
      repair: 'Adjust z-indices to satisfy rendering precedence',
      evidence: ['bridge_above_river_wall_above_buildings_precedence'],
      testId: 'test-r9-132'
    });

    // ===========================================
    // U10: Boundary Derivation (2 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-141',
      category: 'U10',
      stage: 'S02_BOUNDARY',
      severity: 'major',
      intent: 'Boundary must be derived from defended footprint',
      measure: 'Provenance tracking of boundary derivation',
      constraint: 'boundary_provenance_tracked == true',
      repair: 'Record boundary derivation steps in provenance log',
      evidence: ['boundary_provenance_defended_footprint_derived'],
      testId: 'test-u10-141'
    });

    this.register({
      id: 'CRC-A6-142',
      category: 'U10',
      stage: 'S02_BOUNDARY',
      severity: 'major',
      intent: 'Wall path must be functionally dependent on defended footprint anchors',
      measure: 'Dependency tracking between wall and footprint',
      constraint: 'wall_footprint_dependency_tracked == true',
      repair: 'Record wall-to-footprint anchor dependencies',
      evidence: ['wall_path_functionally_dependent_defended_footprint_anchors'],
      testId: 'test-u10-142'
    });

    // ===========================================
    // Cross-Cutting: Evidence and Stage Hooks (4 invariants)
    // ===========================================

    this.register({
      id: 'CRC-A6-151',
      category: 'CROSS_CUTTING',
      stage: 'S16_DIAGNOSTICS',
      severity: 'blocker',
      intent: 'Stage hook execution order must be deterministic',
      measure: 'Consistency of hook execution order across runs',
      constraint: 'execution_order_deterministic == true',
      repair: 'Ensure hooks execute in priority order with resolved dependencies',
      evidence: ['stage_hook_execution_order_deterministic'],
      testId: 'test-cross-151'
    });

    this.register({
      id: 'CRC-A6-152',
      category: 'CROSS_CUTTING',
      stage: 'S16_DIAGNOSTICS',
      severity: 'major',
      intent: 'Invariant repair traces must be complete',
      measure: 'Completeness ratio of repair trace schema',
      constraint: 'repair_trace_completeness >= 0.95',
      repair: 'Ensure all invariant evaluations generate repair traces',
      evidence: ['invariant_repair_trace_completeness_schema'],
      testId: 'test-cross-152'
    });

    this.register({
      id: 'CRC-A6-153',
      category: 'CROSS_CUTTING',
      stage: 'S16_DIAGNOSTICS',
      severity: 'blocker',
      intent: 'Blocker invariant failure must halt release',
      measure: 'Release blocked when blocker invariants fail',
      constraint: 'blocker_halts_release == true',
      repair: 'Ensure release gate checks blocker invariant status',
      evidence: ['blocker_invariant_failure_halts_release'],
      testId: 'test-cross-153'
    });

    this.register({
      id: 'CRC-A6-154',
      category: 'CROSS_CUTTING',
      stage: 'S16_DIAGNOSTICS',
      severity: 'major',
      intent: 'Diagnostics keys must be complete for A6 registry',
      measure: 'Ratio of present A6 diagnostic keys',
      constraint: 'diagnostics_completeness >= 0.95',
      repair: 'Add missing diagnostic keys to output',
      evidence: ['diagnostics_key_completeness_a6_registry'],
      testId: 'test-cross-154'
    });
  }
}

// Singleton instance for convenience
let registryInstance: A6InvariantRegistry | null = null;

/**
 * Get the singleton instance of the A6 invariant registry.
 */
export function getA6Registry(): A6InvariantRegistry {
  if (!registryInstance) {
    registryInstance = new A6InvariantRegistry();
  }
  return registryInstance;
}

/**
 * Reset the singleton instance (useful for testing).
 */
export function resetA6Registry(): void {
  registryInstance = null;
}
