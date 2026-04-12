// @ts-nocheck
/**
 * Represents a semantic conflict between addenda.
 */
export interface SemanticConflict {
  topic: string;
  baseContractRule: string;
  addendumRule: string;
  resolution: string;
}

/**
 * Represents a documented resolution decision.
 */
export interface ResolutionDecision {
  topic: string;
  candidates: string[];
  resolution: string;
  timestamp: number;
}

/**
 * Configuration for AddendumResolver
 */
export interface AddendumResolverConfig {
  trackDecisions?: boolean;
}

/**
 * Resolves semantic conflicts between the base contract and addenda.
 * Supports A1 (Scaffold), A2 (Hydro), A3 (Local Structure), and A4 (Functional Plausibility) addenda.
 */
export class AddendumResolver {
  private config: AddendumResolverConfig;
  private decisions: ResolutionDecision[] = [];
  
  // A1 Scaffold-related topics
  private scaffoldTopics = [
    'global_scaffold_coverage',
    'inner_patch_contiguity',
    'scaffold_driven_placement',
    'circumference_extraction',
    'seed_distribution',
    'selective_relaxation',
    'deterministic_seeding',
    'wall_extraction',
    'gate_placement',
    'gate_core_routing',
    'district_assignment',
    'building_synthesis',
    'scaffold'
  ];

  // A2 Hydro-related topics
  private hydroTopics = [
    'river_determinism',
    'river_centerline',
    'river_width',
    'river_clipping',
    'hydro_awareness',
    'river_corridor',
    'wall_hydro_awareness',
    'road_hydro_awareness',
    'district_hydro_awareness',
    'parcel_hydro_awareness',
    'rural_hydro_awareness',
    'cross_river_connectivity',
    'southern-bend-river',
    'hydro-semantics'
  ];

  // A3 Local structure-related topics
  private localStructureTopics = [
    'wall_smoothness',
    'wall-smoothness',
    'north_wall_smoothness',
    'tower_spacing',
    'tower-spacing',
    'vegetation_clip_buffers',
    'southern_bend_flow',
    'farmland_egress_alignment',
    'quadrant_density_balance',
    'local-structure',
    'local_structure',
    'perimeter_quality'
  ];

  // A4 Functional plausibility topics
  private functionalPlausibilityTopics = [
    'building_wall_collision',
    'interior_wall_clear_zone',
    'road_wall_intersection',
    'river_wall_intersection',
    'bridge_validity',
    'geometry_layer_integrity',
    'wall_thickness',
    'tower_rhythm',
    'street_hierarchy',
    'block_geometry',
    'parcel_frontage',
    'density_gradient',
    'public_squares',
    'riverbank_setback',
    'quay_embankment',
    'bridgeheads',
    'gate_count',
    'gate_typology',
    'wall_alignment',
    'external_route',
    'farmland_access',
    'gate_suburbs',
    'district_polygons',
    'label_placement',
    'landmark_anchoring',
    'voronoi_suppression',
    'road_readability',
    'building_typology',
    'symbol_weight',
    'deterministic_replay',
    'violation_overlay',
    'auto_fix',
    'functional_plausibility'
  ];

  // Precedence order (lower number = higher precedence)
  private precedenceOrder: Record<string, number> = {
    'geometric-topological-validity': 1,
    'mandatory-connectivity': 2,
    'A2-hydro-semantics': 3,
    'A3-local-structure-quality': 4,
    'A4-functional-plausibility': 5,
    'style-jitter-randomness': 6
  };

  constructor(config?: AddendumResolverConfig) {
    this.config = config ?? { trackDecisions: false };
  }

  /**
   * Finds all scaffold-related semantic conflicts.
   */
  findScaffoldConflicts(): SemanticConflict[] {
    return this.scaffoldTopics.map(topic => ({
      topic,
      baseContractRule: `base-${topic}`,
      addendumRule: `A1-${topic}`,
      resolution: 'A1'
    }));
  }

  /**
   * Resolves a specific topic to the appropriate addendum.
   */
  resolve(topic: string, candidates?: string[]): string {
    let resolution: string;

    // Check for geometric validity (highest precedence)
    if (topic === 'geometric-validity' || topic === 'geometric-topological-validity') {
      resolution = 'geometric-topological-validity';
    }
    // Check A1 scaffold topics
    else if (this.scaffoldTopics.includes(topic)) {
      resolution = 'A1';
    }
    // Check A2 hydro topics
    else if (this.hydroTopics.includes(topic)) {
      resolution = 'A2';
    }
    // Check A3 local structure topics
    else if (this.localStructureTopics.includes(topic)) {
      resolution = 'A3';
    }
    // Check A4 functional plausibility topics
    else if (this.functionalPlausibilityTopics.includes(topic)) {
      resolution = 'A4';
    }
    // Default resolution based on candidates
    else if (candidates && candidates.length > 0) {
      // Pick the one with highest precedence
      resolution = candidates.reduce((best, candidate) => {
        const bestPrecedence = this.precedenceOrder[best] ?? 99;
        const candidatePrecedence = this.precedenceOrder[candidate] ?? 99;
        return candidatePrecedence < bestPrecedence ? candidate : best;
      }, candidates[0]);
    }
    // Default to base contract
    else {
      resolution = 'base';
    }

    // Track decision if configured
    if (this.config.trackDecisions) {
      this.decisions.push({
        topic,
        candidates: candidates ?? [],
        resolution,
        timestamp: Date.now()
      });
    }

    return resolution;
  }

  /**
   * Gets the precedence level for a topic.
   */
  getPrecedence(topic: string): number {
    return this.precedenceOrder[topic] ?? 99;
  }

  /**
   * Checks if A1 takes precedence for a given topic.
   */
  isA1Precedent(topic: string): boolean {
    return this.scaffoldTopics.includes(topic);
  }

  /**
   * Checks if A2 takes precedence for a given topic.
   */
  isA2Precedent(topic: string): boolean {
    return this.hydroTopics.includes(topic);
  }

  /**
   * Checks if A3 takes precedence for a given topic.
   */
  isA3Precedent(topic: string): boolean {
    return this.localStructureTopics.includes(topic);
  }

  /**
   * Checks if A4 takes precedence for a given topic.
   */
  isA4Precedent(topic: string): boolean {
    return this.functionalPlausibilityTopics.includes(topic);
  }

  /**
   * Gets all scaffold topics.
   */
  getScaffoldTopics(): string[] {
    return [...this.scaffoldTopics];
  }

  /**
   * Gets all hydro topics.
   */
  getHydroTopics(): string[] {
    return [...this.hydroTopics];
  }

  /**
   * Gets all local structure topics.
   */
  getLocalStructureTopics(): string[] {
    return [...this.localStructureTopics];
  }

  /**
   * Gets all functional plausibility topics.
   */
  getFunctionalPlausibilityTopics(): string[] {
    return [...this.functionalPlausibilityTopics];
  }

  /**
   * Gets all documented resolution decisions.
   */
  getDecisions(): ResolutionDecision[] {
    return [...this.decisions];
  }

  /**
   * Clears all documented decisions.
   */
  clearDecisions(): void {
    this.decisions = [];
  }
}

/**
 * Resolves A3 precedence for a given topic.
 */
export function resolveA3Precedence(topic: string): string {
  const resolver = new AddendumResolver();
  return resolver.resolve(topic);
}

/**
 * Finds semantic conflicts between addenda.
 */
export function findSemanticConflicts(addenda: Record<string, { topics: string[] }>): SemanticConflict[] {
  const conflicts: SemanticConflict[] = [];
  const topicCounts: Map<string, string[]> = new Map();

  // Count how many addenda claim each topic
  for (const [addendum, data] of Object.entries(addenda)) {
    for (const topic of data.topics) {
      const existing = topicCounts.get(topic) ?? [];
      existing.push(addendum);
      topicCounts.set(topic, existing);
    }
  }

  // Create conflicts for topics claimed by multiple addenda
  for (const [topic, addenda] of topicCounts) {
    if (addenda.length > 1) {
      const resolver = new AddendumResolver();
      conflicts.push({
        topic,
        baseContractRule: `base-${topic}`,
        addendumRule: addenda.map(a => `${a}-${topic}`).join(','),
        resolution: resolver.resolve(topic, addenda)
      });
    }
  }

  return conflicts;
}
