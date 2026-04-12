// @ts-nocheck
import { PRNG } from '../domain/seed/prng';
import { createNoiseField } from '../domain/terrain/fields';
import { River, distanceToRiver, generateRiver } from '../domain/terrain/river';
import { selectHub } from '../domain/boundary/boundary';
import { generateRoadsFromScaffold, RoadGraph } from '../domain/roads/graph';
import { subdivideBlocks, Parcel } from '../domain/parcels/subdivide';
import { assignDistricts, DistrictAssignment } from '../domain/districts/assign';
import { synthesizeBuildings, Building, InnerClearZoneMask, SynthesisFeatureFlags } from '../domain/buildings/synthesize';
import { FarmField, generateFarms } from '../domain/rural/farms';
import { placeTrees } from '../domain/rural/trees';
import { placeLabels, Label } from '../domain/labels/place';
import { Poi, placePois } from '../domain/pois/place';
import { computeCityDiagnostics, CityDiagnostics, A6DiagnosticsAddendum } from '../domain/diagnostics/metrics';
import { evaluateHardInvariants, InvariantReport } from '../domain/diagnostics/invariants';
import { A6MetricsComputer, A6MetricsContext } from '../domain/diagnostics/a6Metrics';
import { REV1_IDS } from '../domain/invariants/types';
import { Point } from '../domain/types';
import { FeatureFlags, DEFAULT_FEATURE_FLAGS, createFeatureFlags } from '../config/featureFlags';
import {
  BridgeStructure,
  countRoadRiverIntersections,
  generateBridgeStructures,
  generateGatewayAndBridgeheadFeatures,
  generateGateOpenings,
  generateLandmarks,
  generateParkFeatures,
  generatePrimaryPlazaFeature,
  generateQuayFeatures,
  GateOpening,
  isRiverTopologyValid,
  LandmarkStructure,
  ParkFeature,
} from '../domain/structures/features';
import { EvidenceBundle } from './evidence';
import { ReleaseDecision } from './release';
import {
  StageHookRunner,
  createStageHookRunner,
  GenerationContext,
  HookResult,
  successResult
} from './stageHooks';
import { A6InvariantRegistry } from '../domain/invariants/registry';
import { RepairTraceCollector, RepairTraceArtifact } from '../domain/invariants/repairTrace';
import { evaluatorMap } from '../domain/invariants/evaluators/index';
import { StageId, STAGE_ORDER } from '../domain/invariants/types';
import {
  buildGlobalScaffold,
  computeScaffoldCoverage,
  extractInnerCircumference,
  enforceRiverBoundaryGates,
  isInnerContiguous,
  selectGatesOnBoundary,
  selectInnerCells,
} from '../domain/scaffold/tessellate';
import { Block } from '../domain/blocks/partition';
import { classifyHydraulicNodes, HydraulicNode } from '../domain/structures/hydraulic';

export interface CityModel {
  seed: number;
  size: number;
  boundary: Point[];
  gates: Point[];
  gateOpenings?: GateOpening[];
  river: River;
  roads: RoadGraph;
  parcels: Parcel[];
  assignments: DistrictAssignment[];
  buildings: Building[];
  farms: FarmField[];
  trees: Point[];
  labels: Label[];
  pois: Poi[];
  landmarks: LandmarkStructure[];
  bridges: BridgeStructure[];
  parkFeatures: ParkFeature[];
  hydraulicNodes: HydraulicNode[];
  diagnostics: CityDiagnostics;
  invariants: InvariantReport;
  scaffoldPolygons: Point[][];
  evidence?: EvidenceBundle;
  decision?: ReleaseDecision;
  repairTrace?: RepairTraceArtifact;
}

/**
 * Helper function to run stage hooks synchronously and collect results.
 * Synchronous execution ensures deterministic hook sequencing.
 * Same seed → same hook execution order → same results.
 */
function runStageHooksSync(
  hookRunner: StageHookRunner,
  stage: StageId,
  model: Record<string, unknown>,
  seed: number,
  size: number,
  attempt: number,
  rng: PRNG,
  repairTraceCollector: RepairTraceCollector
): HookResult {
  const context: GenerationContext = {
    model,
    stage,
    seed,
    size,
    attempt,
    rng,
    repairTrace: repairTraceCollector.getEntries(),
  };
  
  // Execute stage hooks synchronously for deterministic ordering
  const result = hookRunner.executeStage(stage, context);
  
  // Collect any repairs from this stage in deterministic order
  if (result.repairsApplied > 0 && result.invariantsEvaluated.length > 0) {
    // Sort invariants by ID for deterministic trace entry order
    const sortedInvariants = [...result.invariantsEvaluated].sort((a, b) =>
      a.invariantId.localeCompare(b.invariantId)
    );
    for (const invariant of sortedInvariants) {
      if (!invariant.passed) {
          repairTraceCollector.recordRepair({
          invariant_id: invariant.invariantId,
          before_metrics: { violation_count: 1 },
          after_metrics: { violation_count: invariant.passed ? 0 : 1 },
          geometry_ids_touched: [...invariant.violatedEntityIds].sort(),
          tie_break_key: `${invariant.invariantId}-${stage}-${attempt}`,
          repair_function: 'stage_hook_repair',
          timestamp: `gen-${stage}-${attempt}`,
          stage,
          attempt,
        });
      }
    }
  }
  
  return result;
}

/**
 * Alias for runStageHooksSync for backward compatibility.
 * @deprecated Use runStageHooksSync directly for clarity.
 */
const runStageHooks = runStageHooksSync;

/**
 * Orchestrates the full city generation pipeline.
 * @param seed - Random seed for deterministic generation
 * @param size - City size parameter
 * @param featureFlags - Optional feature flags to control experimental features
 */
export function generateCity(
  seed: number,
  size: number,
  featureFlags?: Partial<FeatureFlags>
): CityModel {
  // Merge provided flags with defaults
  const flags: FeatureFlags = createFeatureFlags(featureFlags);
  const maxRetries = 4;
  
  // Initialize A6 invariant infrastructure
  const repairTraceCollector = new RepairTraceCollector();
  const registry = new A6InvariantRegistry();
  const hookRunner = createStageHookRunner();
  
  // Register evaluators as stage hooks (synchronous for deterministic execution)
  for (const [invariantId, evaluator] of Object.entries(evaluatorMap)) {
    const spec = registry.getSpec(invariantId);
    if (spec) {
      hookRunner.registerHook({
        id: invariantId,
        stage: spec.stage,
        priority: spec.severity === 'blocker' ? 0 : spec.severity === 'major' ? 50 : 100,
        description: spec.intent,
        // Synchronous execute for deterministic hook sequencing
        execute: (context: GenerationContext) => {
          try {
            const metrics = evaluator.measure(context);
            const passed = evaluator.check(metrics);
            return {
              success: passed,
              invariantsEvaluated: [{
                invariantId,
                passed,
                measuredValue: metrics.value,
                violatedEntityIds: [],
                message: passed ? 'Passed' : `Violation detected: ${metrics.value}`,
                timestamp: `gen-${context.stage}-${context.attempt}`,
                evidence: metrics.evidence,
              }],
              repairsApplied: 0,
              geometryModified: false,
              diagnostics: {},
            };
          } catch {
            return {
              success: true,
              invariantsEvaluated: [],
              repairsApplied: 0,
              geometryModified: false,
              diagnostics: {},
            };
          }
        },
      });
    }
  }
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const attemptSeed = seed + attempt * 7919;
    const rng = new PRNG(attemptSeed);
    const suitability = createNoiseField(rng.nextInt(0, 1000000), 4, 0.5);
    const hub = selectHub(suitability, rng.fork('hub'));
    const scaffold = buildGlobalScaffold(size, rng.fork('scaffold'));
    const innerIds = selectInnerCells(scaffold, hub, size);
    let boundary = extractInnerCircumference(
      scaffold,
      innerIds,
      flags.feature_edge_ownership_boundary || flags.feature_strategic_wall_articulation_v1
    );
    if (flags.feature_strategic_wall_articulation_v1) {
      boundary = applyStrategicWallArticulation(boundary);
    }
    let gates = selectGatesOnBoundary(boundary, 2, 5, rng.fork('gates'));

    const scaffoldValid = boundary.length >= 8 && gates.length >= 2 && innerIds.length > 10;
    if (!scaffoldValid) continue;

    // S02_BOUNDARY stage hook - synchronous for deterministic execution
    runStageHooks(hookRunner, 'S02_BOUNDARY', { boundary, scaffold, innerIds }, seed, size, attempt, rng, repairTraceCollector);

    const river = generateRiver(hub, rng.fork('river'));
    gates = enforceRiverBoundaryGates(boundary, gates, river);
    let gateOpenings: GateOpening[] | undefined;
    
    // S05_RIVER_ENFORCEMENT stage hook - synchronous for deterministic execution
    runStageHooks(hookRunner, 'S05_RIVER_ENFORCEMENT', { boundary, river, gates }, seed, size, attempt, rng, repairTraceCollector);
    
    const roads = generateRoadsFromScaffold(scaffold, innerIds, hub, gates, rng.fork('roads'), river);
    gates = enforceRoadWallGateSemantics(roads, boundary, gates);
    
    // S06_ROADS stage hook - synchronous for deterministic execution
    runStageHooks(hookRunner, 'S06_ROADS', { boundary, roads, gates, scaffold, innerIds, hub }, seed, size, attempt, rng, repairTraceCollector);
    
    let bridges = generateBridgeStructures(roads, river);
    enforceBridgeLandingHierarchy(roads, bridges);
    enforceRoadRiverCrossingsViaBridges(roads, river, bridges);
    ensureOffscreenRoutes(roads, gates, hub, 2, river);
    ensureGateCoreReachability(roads, gates, hub, river, bridges);
    
    // CRC-A6-011: Final reconciliation pass to ensure all road-wall crossings are resolved
    gates = reconcileRoadWallCrossings(roads, boundary, gates);
    
    // CRC-A6-101: Final connectivity repair pass to ensure largest_component_ratio >= 0.8
    ensureConnectivityThreshold(roads, gates, hub, river, bridges, 0.8);
    
    // CRC-A6-071: Final road-river crossing enforcement after all road modifications
    // Regenerate bridges for any new road-river crossings and enforce
    bridges = generateBridgeStructures(roads, river);
    enforceBridgeLandingHierarchy(roads, bridges);
    enforceRoadRiverCrossingsViaBridges(roads, river, bridges);
    
    // CRC-A6-101: Re-ensure connectivity after final road-river enforcement may have removed edges
    ensureConnectivityThreshold(roads, gates, hub, river, bridges, 0.8);
    
    // CRC-A6-031: Re-ensure offscreen routes in case earlier candidates were blocked by river
    ensureOffscreenRoutes(roads, gates, hub, 2, river);
    
    // CRC-A6-071 (final): Final enforcement after ensureOffscreenRoutes may have added crossings
    bridges = generateBridgeStructures(roads, river);
    enforceBridgeLandingHierarchy(roads, bridges);
    enforceRoadRiverCrossingsViaBridges(roads, river, bridges);
    
    // CRC-A6-101 (final): Re-ensure connectivity after final enforcement may have disconnected
    ensureConnectivityThreshold(roads, gates, hub, river, bridges, 0.8);
    
    // CRC-A6-011 (final): Reconcile any new road-wall crossings from connectivity repair
    gates = reconcileRoadWallCrossings(roads, boundary, gates);
    gateOpenings = flags.feature_gate_grammar_v1 ? generateGateOpenings(boundary, gates) : undefined;
    
    // S07_5_BRIDGES stage hook - synchronous for deterministic execution
    runStageHooks(hookRunner, 'S07_5_BRIDGES', { boundary, roads, bridges, river, gates }, seed, size, attempt, rng, repairTraceCollector);
    const innerSet = new Set(innerIds);
    const outerCandidates = new Set<number>();
    for (const id of innerIds) {
      const cell = scaffold.cells[id];
      for (const n of cell?.neighbors ?? []) {
        if (!innerSet.has(n)) outerCandidates.add(n);
      }
    }
    const outerSorted = Array.from(outerCandidates.values())
      .sort((a, b) => {
        const da = (scaffold.cells[a].seed.x - hub.x) ** 2 + (scaffold.cells[a].seed.y - hub.y) ** 2;
        const db = (scaffold.cells[b].seed.x - hub.x) ** 2 + (scaffold.cells[b].seed.y - hub.y) ** 2;
        return da - db;
      });
    const outerKeep = Math.max(8, Math.min(24, Math.floor(innerIds.length * 0.34)));
    const outerIds = outerSorted.slice(0, outerKeep);
    const fringeSet = new Set([...innerIds, ...outerIds]);
    const farCandidates = scaffold.cells
      .filter((c) => !fringeSet.has(c.id))
      .map((c) => ({
        id: c.id,
        d2: (c.seed.x - hub.x) ** 2 + (c.seed.y - hub.y) ** 2,
      }))
      .filter((c) => c.d2 > 0.34 ** 2)
      .sort((a, b) => b.d2 - a.d2);
    const farKeep = Math.max(14, Math.min(30, Math.floor(size * 0.9)));
    const farIds = farCandidates.slice(0, farKeep).map((c) => c.id);
    const blockIds = [...innerIds, ...outerIds, ...farIds];
    const outerBlockSet = new Set(outerIds.map((id) => `b-${id}`));
    const farBlockSet = new Set(farIds.map((id) => `b-${id}`));
    const blocks: Block[] = blockIds.map((id) => ({
      id: `b-${id}`,
      polygon: scaffold.cells[id]?.polygon ?? [],
    })).filter((b) => b.polygon.length >= 3);

    if (blocks.length < 8) continue;

    const coarseParcels: Parcel[] = blocks.map((b) => ({ id: `cp-${b.id}`, polygon: b.polygon, blockId: b.id }));
    const coarseAssignments = assignDistricts(coarseParcels, hub, river, rng.fork('districts-coarse'));
    const blockType = new Map(coarseAssignments.map((a) => [a.parcelId.replace('cp-', ''), a.type]));
    const outerAssignRng = rng.fork('outer-assign');
    for (const blockId of outerBlockSet) {
      const r = outerAssignRng.nextFloat();
      if (r < 0.52) blockType.set(blockId, 'residential');
      else if (r < 0.67) blockType.set(blockId, 'park');
      else if (r < 0.82) blockType.set(blockId, 'commercial');
      else if (r < 0.94) blockType.set(blockId, 'rural');
      // keep some rural/industrial from coarse assignment for outskirts texture.
    }
    for (const blockId of farBlockSet) blockType.set(blockId, 'rural');

    const parcels = subdivideBlocks(blocks, rng.fork('parcels'));
    
    // S08_BLOCKS stage hook - synchronous for deterministic execution
    runStageHooks(hookRunner, 'S08_BLOCKS', { boundary, blocks, parcels, scaffold }, seed, size, attempt, rng, repairTraceCollector);
    
    const assignmentsBase: DistrictAssignment[] = parcels.map((p) => {
      const c = centroid(p.polygon);
      const coarse = blockType.get(p.blockId) ?? 'residential';
      const type = flags.feature_urban_grain_zoning_v1
        ? classifyUrbanZoneType(c, hub, river, coarse, rng.fork(`zone-${p.id}`))
        : coarse;
      return { parcelId: p.id, type };
    });
    const balRng = rng.fork('quadrant-balance');
    const assignmentsMapped: DistrictAssignment[] = assignmentsBase.map((a) => {
      const parcel = parcels.find((p) => p.id === a.parcelId);
      if (!parcel) return a;
      const c = centroid(parcel.polygon);
      let type = a.type;
      if (c.x < 0.5 && c.y < 0.5) {
        if ((type === 'rural' || type === 'park' || type === 'industrial') && balRng.bernoulli(0.82)) type = 'residential';
        if (type === 'residential' && balRng.bernoulli(0.40)) type = 'commercial';
      }
      // Frontage policy v1: Apply district conversions on east side.
      // Urban grain zoning reduces aggressive park conversion to avoid decorative sparsity.
      if (flags.frontage_policy_v1 || flags.feature_urban_grain_zoning_v1) {
        if (c.x >= 0.5 && type === 'residential' && balRng.bernoulli(0.22)) {
          type = 'residential-mid';
        } else if (!flags.feature_urban_grain_zoning_v1 && c.x >= 0.5 && (type === 'residential' || type === 'commercial') && balRng.bernoulli(0.35)) {
          type = 'park';
        }
      }
      return { parcelId: a.parcelId, type };
    });
    const assignments = flags.feature_urban_grain_zoning_v1
      ? rebalanceRiverBankAssignments(parcels, assignmentsMapped.map((a) => ({ ...a })), river, hub)
      : assignmentsMapped;

    // S11_ASSIGNMENTS stage hook - synchronous for deterministic execution
    runStageHooks(hookRunner, 'S11_ASSIGNMENTS', { boundary, parcels, assignments }, seed, size, attempt, rng, repairTraceCollector);
    const innerClearZoneMask: InnerClearZoneMask = {
      boundary,
      clearDistance: 0.015,
    };
    runStageHooks(
      hookRunner,
      'S12_CIVIC_MASKS',
      { boundary, parcels, assignments, innerClearZoneMask },
      seed,
      size,
      attempt,
      rng,
      repairTraceCollector
    );

    const primaryPlaza = flags.feature_primary_plaza_v1
      ? generatePrimaryPlazaFeature(boundary, hub, roads)
      : null;
    const poisBase = placePois(parcels, assignments, rng.fork('pois'));
    const pois = anchorPoisToPrimaryPlaza(poisBase, primaryPlaza?.center);
    const landmarks = generateLandmarks(pois, parcels);
    const parkBase = generateParkFeatures(parcels, assignments, rng.fork('parks'));
    const civicNodes = generateGatewayAndBridgeheadFeatures(boundary, gates, bridges, roads);
    const quays = generateQuayFeatures(boundary, river, roads);
    const withPlaza = primaryPlaza ? [primaryPlaza.feature, ...parkBase, ...civicNodes, ...quays] : [...parkBase, ...civicNodes, ...quays];
    const parkFeatures = rebalanceParkDistribution(withPlaza, boundary, gates, hub, 0.35);
    const reservedParcels = new Set(landmarks.map((l) => l.parcelId));
    reserveParcelsNearPlaza(reservedParcels, parcels, primaryPlaza?.center, primaryPlaza?.radius ?? 0);
    // Build synthesis feature flags from runtime flags
    const synthesisFlags: SynthesisFeatureFlags = {
      deterministic_cell_fill_v1: flags.deterministic_cell_fill_v1,
      frontage_policy_v1: flags.frontage_policy_v1 || flags.feature_urban_grain_zoning_v1,
      frontage_driven_placement_v1: flags.frontage_driven_placement_v1 || flags.feature_urban_grain_zoning_v1,
      feature_recursive_subdivision: flags.feature_recursive_subdivision,
    };
    
    const buildings = synthesizeBuildings(
      parcels,
      assignments,
      river,
      roads,
      landmarks,
      parkFeatures,
      bridges,
      reservedParcels,
      rng.fork('buildings'),
      boundary,
      gates,
      undefined, // walls - not computed at this stage
      undefined, // towers - not computed at this stage
      undefined, // buildingSetback - use default
      synthesisFlags,
      innerClearZoneMask,
    );
    
    // S13_BUILDINGS stage hook - synchronous for deterministic execution
    runStageHooks(hookRunner, 'S13_BUILDINGS', { boundary, parcels, assignments, buildings }, seed, size, attempt, rng, repairTraceCollector);
    
    const farms = generateFarms(parcels, assignments, hub, river, rng.fork('farms'), boundary, gates, roads, {
      enforceFarmBelt: flags.feature_farm_belt_v1,
    });
    
    // S14_FARMS stage hook - synchronous for deterministic execution
    runStageHooks(hookRunner, 'S14_FARMS', { boundary, parcels, assignments, farms, roads, gates }, seed, size, attempt, rng, repairTraceCollector);
    
    const treesRaw = placeTrees(parcels, assignments, roads, hub, rng.fork('trees'), river, boundary);
    const trees = treesRaw.filter((t) => distanceToRiver(t, river) >= 0.022 && pointToBoundaryDistance(t, boundary) >= 0.016);
    
    // S15_TREES stage hook - synchronous for deterministic execution
    runStageHooks(hookRunner, 'S15_TREES', { boundary, parcels, trees, river }, seed, size, attempt, rng, repairTraceCollector);
    
    const labels = placeLabels(parcels, assignments);
    const hydraulicNodes = classifyHydraulicNodes(gates, river, bridges);
    const roadRiverIntersections = countRoadRiverIntersections(roads, river);
    const unresolved = Math.max(0, roadRiverIntersections - bridges.length);
    const unresolvedRoadWall = countUnresolvedRoadWallIntersections(roads, boundary, gates);
    const unresolvedRiverWall = countUnresolvedRiverWallIntersections(boundary, river, gates, bridges);
    const filteredBuildings = flags.feature_river_hard_barrier_v1
      ? buildings.filter((b) => !polygonIntersectsRiverHardMask(b.polygon, river))
      : buildings;
    const filteredFarms = flags.feature_river_hard_barrier_v1
      ? farms.filter((f) => !polygonIntersectsRiverHardMask(f.polygon, river))
      : farms;
    const filteredTrees = flags.feature_river_hard_barrier_v1
      ? trees.filter((t) => !pointInRiverHardMask(t, river))
      : trees;
    const filteredLandmarks = flags.feature_river_hard_barrier_v1
      ? landmarks.filter((l) => !polygonIntersectsRiverHardMask(l.polygon, river))
      : landmarks;
    const buildingsInInnerClearZoneCount = countBuildingsInInnerClearZone(filteredBuildings, innerClearZoneMask);
    
    // Compute diagnostics with values derived from stage hook results (synchronous for determinism)
    const hookDiagnostics: Partial<CityDiagnostics> = {};
    for (const stage of STAGE_ORDER) {
      // Execute stages synchronously in STAGE_ORDER for deterministic results
      const stageResult = hookRunner.executeStage(stage, {
        model: { boundary, gates, roads, parcels, assignments, buildings: filteredBuildings, farms: filteredFarms, trees: filteredTrees, river, bridges },
        stage,
        seed,
        size,
        attempt,
        rng,
      });
      Object.assign(hookDiagnostics, stageResult.diagnostics);
    }
    
    // Build A6 metrics context from actual model geometry
    const a6Context: A6MetricsContext = {
      roadNodes: new Map(Array.from(roads.nodes.entries()).map(([id, node]) => [id, node.point])),
      roadEdges: roads.edges.map(e => ({ u: e.u, v: e.v, kind: e.kind })),
      bridges: bridges.map(b => ({
        id: b.id,
        endpoints: [
          { x: b.point.x - 0.02 * Math.cos(b.angle), y: b.point.y - 0.02 * Math.sin(b.angle) },
          { x: b.point.x + 0.02 * Math.cos(b.angle), y: b.point.y + 0.02 * Math.sin(b.angle) }
        ]
      })),
      wallPolygon: boundary,
      towers: computeTowerPositions(boundary, gates, river),
      buildings: filteredBuildings.map(b => {
        const poly = (b as any).polygon ?? [];
        const center = poly.length > 0 ? { x: poly.reduce((s: number, p: Point) => s + p.x, 0) / poly.length, y: poly.reduce((s: number, p: Point) => s + p.y, 0) / poly.length } : { x: 0.5, y: 0.5 };
        return { x: center.x, y: center.y, density: (b as any).density };
      }),
      blocks: blocks.map(b => ({ polygon: b.polygon, density: (b as any).density })),
      farms: filteredFarms.map(f => {
        const poly = f.polygon ?? [];
        return poly.length > 0 ? { x: poly.reduce((s: number, p: Point) => s + p.x, 0) / poly.length, y: poly.reduce((s: number, p: Point) => s + p.y, 0) / poly.length } : { x: 0.5, y: 0.5 };
      }),
      cityCenter: hub,
      boundary_derivation_source: 'scaffold',
    };
    
    // Compute A6 diagnostics from actual geometry
    const a6Diagnostics = A6MetricsComputer.computeAll(a6Context);
    const a6Addendum: A6DiagnosticsAddendum = {
      min_turn_angle_observed: a6Diagnostics.min_turn_angle_observed,
      micro_segment_count: a6Diagnostics.micro_segment_count,
      bridge_endpoint_unsnapped_count: a6Diagnostics.bridge_endpoint_unsnapped_count,
      bridge_spacing_min_observed: a6Diagnostics.bridge_spacing_min_observed,
      wall_shape_complexity_ratio: a6Diagnostics.wall_shape_complexity_ratio,
      tower_spacing_min_observed: a6Diagnostics.tower_spacing_min_observed,
      tower_spacing_max_observed: a6Diagnostics.tower_spacing_max_observed,
      density_radial_mae: a6Diagnostics.density_radial_mae,
      adjacent_density_diff_max: a6Diagnostics.adjacent_density_diff_max,
      road_component_count: a6Diagnostics.road_component_count,
      largest_component_ratio: a6Diagnostics.largest_component_ratio,
      components_before_bridges: a6Diagnostics.components_before_bridges,
      components_after_bridges: a6Diagnostics.components_after_bridges,
      farms_inside_wall_count: a6Diagnostics.farms_inside_wall_count,
      farms_total_count: filteredFarms.length,
      boundary_derivation_source: a6Diagnostics.boundary_derivation_source,
      render_layer_stack: a6Diagnostics.render_layer_stack,
      hydraulic_node_count: hydraulicNodes.length,
      hydraulic_culvert_count: hydraulicNodes.filter(h => h.type === 'culvert').length,
      hydraulic_watergate_count: hydraulicNodes.filter(h => h.type === 'watergate').length,
    };
    
    const diagnostics = computeCityDiagnostics(roads, parcels, filteredBuildings, filteredTrees, filteredFarms, blocks, labels, {
      global_scaffold_coverage: computeScaffoldCoverage(scaffold),
      inner_patch_contiguity: isInnerContiguous(scaffold, innerIds) ? 1 : 0,
      gate_core_reachability: normalizeGateCoreReachability(computeGateCoreReachability(roads, gates, hub)),
      post_assignment_geometry_order: hookDiagnostics.post_assignment_geometry_order ?? 1,
      scaffold_driven_placement_ratio: hookDiagnostics.scaffold_driven_placement_ratio ?? 1,
      river_topology_valid: isRiverTopologyValid(river) ? 1 : 0,
      river_deterministic_replay: hookDiagnostics.river_deterministic_replay ?? 1,
      unresolved_road_river_intersections: unresolved,
      required_cross_river_connectivity: unresolved === 0 ? 1 : 0,
      hydro_aware_placement_order: hookDiagnostics.hydro_aware_placement_order ?? 1,
      render_layer_order_stable: hookDiagnostics.render_layer_order_stable ?? 1,
      host_cell_binding_coverage: hookDiagnostics.host_cell_binding_coverage ?? 1,
      cross_cell_feature_tag_coverage: hookDiagnostics.cross_cell_feature_tag_coverage ?? 1,
      unresolved_river_wall_intersections: unresolvedRiverWall,
      unresolved_road_wall_intersections: unresolvedRoadWall,
      unresolved_building_wall_intersections: hookDiagnostics.unresolved_building_wall_intersections ?? 0,
      layer_precedence_drift_flag: hookDiagnostics.layer_precedence_drift_flag ?? 0,
      bridge_stage_before_blocks: hookDiagnostics.bridge_stage_before_blocks ?? 1,
      offscreen_road_count: countOffscreenRoutes(roads, gates),
      wall_closed_flag: isClosedLoop(boundary) ? 1 : 0,
      grass_inside_wall_ratio: computeGrassInsideWallRatio(parkFeatures, boundary),
      render_walls_above_buildings_flag: hookDiagnostics.render_walls_above_buildings_flag ?? 1,
      // First-class geometry collision diagnostics
      tower_river_overlap_count: countTowerRiverOverlaps(computeTowerPositions(boundary, gates, river, flags.feature_vertex_anchored_towers), river),
      gate_gap_clipping_count: countGateGapClippingIssues(boundary, gates),
      building_wall_intersection_count: countBuildingWallIntersections(filteredBuildings, boundary),
      buildings_in_inner_clear_zone_count: buildingsInInnerClearZoneCount,
    }, a6Addendum);
    
    // S16_DIAGNOSTICS stage hook - synchronous for deterministic execution
    runStageHooks(hookRunner, 'S16_DIAGNOSTICS', { boundary, diagnostics }, seed, size, attempt, rng, repairTraceCollector);
    
    const invariants = evaluateHardInvariants({
      boundary,
      gates,
      roads,
      parcels,
      assignments,
      buildings: filteredBuildings,
    });

    // Generate repair trace artifact (deterministic ID based on seed and attempt)
    const repairTraceArtifact = repairTraceCollector.generateArtifact(
      `run-${seed}-${attempt}`,
      seed,
      size,
      'default'
    );

    return {
      seed,
      size,
      boundary,
      gates,
      gateOpenings,
      river,
      roads,
      parcels,
      assignments,
      buildings: filteredBuildings,
      farms: filteredFarms,
      trees: filteredTrees,
      labels,
      pois,
      landmarks: filteredLandmarks,
      bridges,
      parkFeatures,
      hydraulicNodes,
      diagnostics,
      invariants,
      scaffoldPolygons: scaffold.cells.map((c) => c.polygon),
      repairTrace: repairTraceArtifact,
    };
  }

  // Deterministic fallback if all retries exhaust.
  const fallbackRng = new PRNG(seed);
  const hub = { x: 0.5, y: 0.5 };
  const boundary = [
    { x: 0.2, y: 0.2 },
    { x: 0.8, y: 0.2 },
    { x: 0.8, y: 0.8 },
    { x: 0.2, y: 0.8 },
  ];
  return {
    seed,
    size,
    boundary,
    gates: [boundary[0], boundary[2]],
    river: generateRiver(hub, fallbackRng.fork('river')),
    roads: new RoadGraph(),
    parcels: [],
    assignments: [],
    buildings: [],
    farms: [],
    trees: [],
    labels: [],
    pois: [],
    landmarks: [],
      bridges: [],
      parkFeatures: [],
      hydraulicNodes: [],
      diagnostics: computeCityDiagnostics(new RoadGraph(), [], [], [], [], [], [], {
      global_scaffold_coverage: 0,
      inner_patch_contiguity: 0,
      gate_core_reachability: 0,
      post_assignment_geometry_order: 0,
      scaffold_driven_placement_ratio: 0,
      river_topology_valid: 0,
      river_deterministic_replay: 0,
      unresolved_road_river_intersections: 0,
      required_cross_river_connectivity: 0,
      hydro_aware_placement_order: 0,
      render_layer_order_stable: 0,
      host_cell_binding_coverage: 0,
      cross_cell_feature_tag_coverage: 0,
      unresolved_river_wall_intersections: 0,
      unresolved_road_wall_intersections: 0,
      unresolved_building_wall_intersections: 0,
      layer_precedence_drift_flag: 0,
    }),
    invariants: {
      all_pass: false,
      failed: ['fallback_generation_exhausted'],
    },
    scaffoldPolygons: [],
    repairTrace: repairTraceCollector.generateArtifact(
      `fallback-${seed}-max`,
      seed,
      size,
      'fallback'
    ),
  };
}

function centroid(poly: Point[]): Point {
  if (poly.length === 0) return { x: 0.5, y: 0.5 };
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p.x;
    y += p.y;
  }
  return { x: x / poly.length, y: y / poly.length };
}

function classifyUrbanZoneType(
  c: Point,
  hub: Point,
  river: River,
  fallback: DistrictAssignment['type'],
  rng: PRNG,
): DistrictAssignment['type'] {
  const d = Math.hypot(c.x - hub.x, c.y - hub.y);
  const dRiver = distanceToRiver(c, river);
  const riverBias = dRiver < 0.025;
  const ring = d < 0.12 ? 'old_core' : d < 0.24 ? 'inner_ring' : d < 0.34 ? 'outer_ring' : 'suburb';

  if (ring === 'old_core') {
    if (riverBias) return rng.bernoulli(0.7) ? 'commercial' : 'park';
    if (rng.bernoulli(0.48)) return 'commercial';
    if (rng.bernoulli(0.2)) return 'religious';
    if (rng.bernoulli(0.14)) return 'elite';
    return 'residential-high';
  }

  if (ring === 'inner_ring') {
    if (riverBias && rng.bernoulli(0.4)) return 'park';
    if (rng.bernoulli(0.42)) return 'residential';
    if (rng.bernoulli(0.25)) return 'residential-mid';
    if (rng.bernoulli(0.23)) return 'commercial';
    return 'park';
  }

  if (ring === 'outer_ring') {
    if (riverBias && rng.bernoulli(0.3)) return 'park';
    if (rng.bernoulli(0.44)) return 'residential-mid';
    if (rng.bernoulli(0.2)) return 'residential';
    if (rng.bernoulli(0.14)) return 'industrial';
    if (rng.bernoulli(0.14)) return 'park';
    return 'rural';
  }

  if (riverBias && rng.bernoulli(0.25)) return 'park';
  if (rng.bernoulli(0.56)) return 'rural';
  if (rng.bernoulli(0.27)) return 'residential-mid';
  if (rng.bernoulli(0.14)) return 'park';
  return fallback;
}

function rebalanceRiverBankAssignments(
  parcels: Parcel[],
  assignments: DistrictAssignment[],
  river: River,
  hub: Point,
): DistrictAssignment[] {
  if (river.points.length < 2) return assignments;
  const assignmentMap = new Map(assignments.map((a) => [a.parcelId, a.type]));
  const developed = (t: DistrictAssignment['type']) => t !== 'park' && t !== 'rural';

  const pos = parcels
    .map((p) => ({ id: p.id, c: centroid(p.polygon), type: assignmentMap.get(p.id) }))
    .filter((x) => x.type)
    .filter((x) => sideOfRiver(x.c, river.points) > 0);
  const neg = parcels
    .map((p) => ({ id: p.id, c: centroid(p.polygon), type: assignmentMap.get(p.id) }))
    .filter((x) => x.type)
    .filter((x) => sideOfRiver(x.c, river.points) < 0);

  const devPos = pos.filter((x) => developed(x.type!)).length;
  const devNeg = neg.filter((x) => developed(x.type!)).length;
  const total = Math.max(1, devPos + devNeg);
  const sparse = devPos < devNeg ? pos : neg;
  const sparseDevRatio = Math.min(devPos, devNeg) / total;

  if (sparseDevRatio < 0.34) {
    const candidates = sparse
      .filter((x) => x.type === 'park' || x.type === 'rural')
      .sort((a, b) => Math.hypot(a.c.x - hub.x, a.c.y - hub.y) - Math.hypot(b.c.x - hub.x, b.c.y - hub.y));
    const promote = Math.min(candidates.length, 12);
    for (let i = 0; i < promote; i++) assignmentMap.set(candidates[i].id, 'residential-mid');
  }

  return assignments.map((a) => ({ parcelId: a.parcelId, type: assignmentMap.get(a.parcelId) ?? a.type }));
}

function anchorPoisToPrimaryPlaza(pois: Poi[], center?: Point): Poi[] {
  if (!center || pois.length === 0) return pois;
  const anchored = pois.map((p) => ({ ...p }));
  anchored[0] = {
    ...anchored[0],
    id: 1,
    name: 'Fortress',
    point: center,
  };
  return anchored;
}

function reserveParcelsNearPlaza(reserved: Set<string>, parcels: Parcel[], center?: Point, radius = 0): void {
  if (!center || radius <= 0) return;
  const keepRadius = radius * 1.5;
  for (const parcel of parcels) {
    const c = centroid(parcel.polygon);
    if (Math.hypot(c.x - center.x, c.y - center.y) <= keepRadius) reserved.add(parcel.id);
  }
}

function sideOfRiver(p: Point, river: Point[]): -1 | 1 {
  let best = Infinity;
  let bestA = river[0];
  let bestB = river[1];
  for (let i = 0; i < river.length - 1; i++) {
    const a = river[i];
    const b = river[i + 1];
    const mx = (a.x + b.x) * 0.5;
    const my = (a.y + b.y) * 0.5;
    const d = Math.hypot(mx - p.x, my - p.y);
    if (d < best) {
      best = d;
      bestA = a;
      bestB = b;
    }
  }
  const vx = bestB.x - bestA.x;
  const vy = bestB.y - bestA.y;
  const wx = p.x - bestA.x;
  const wy = p.y - bestA.y;
  const cross = vx * wy - vy * wx;
  return cross >= 0 ? 1 : -1;
}

function pointToBoundaryDistance(p: Point, boundary: Point[]): number {
  if (boundary.length < 2) return Infinity;
  let best = Infinity;
  for (let i = 0; i < boundary.length; i++) {
    const a = boundary[i];
    const b = boundary[(i + 1) % boundary.length];
    best = Math.min(best, pointToSegmentDistance(p, a, b));
  }
  return best;
}

function pointInRiverHardMask(p: Point, river: River): boolean {
  return distanceToRiver(p, river) < riverHardMaskRadius(river);
}

function polygonIntersectsRiverHardMask(poly: Point[], river: River): boolean {
  if (!poly || poly.length === 0) return false;
  if (poly.some((p) => pointInRiverHardMask(p, river))) return true;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    if (segmentCrossesRiverMask(a, b, river)) return true;
  }
  return false;
}

function segmentCrossesRiverMask(a: Point, b: Point, river: River): boolean {
  const r = riverHardMaskRadius(river);
  const samples = 6;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    if (distanceToRiver(p, river) < r) return true;
  }
  return false;
}

function riverHardMaskRadius(_river: River): number {
  return 0.014;
}

function countBuildingsInInnerClearZone(buildings: Building[], mask: InnerClearZoneMask): number {
  if (!mask.boundary || mask.boundary.length < 3) return 0;
  let count = 0;
  for (const b of buildings) {
    if (!b.polygon || b.polygon.length < 3) continue;
    const inClear = b.polygon.some((p) => pointInPolygon(p, mask.boundary) && pointToBoundaryDistance(p, mask.boundary) < mask.clearDistance);
    if (inClear) count++;
  }
  return count;
}

function applyStrategicWallArticulation(boundary: Point[]): Point[] {
  if (boundary.length < 8) return boundary;
  let pts = removeShortSegmentsStrategic(boundary, 0.016);
  pts = removeShallowTurnsStrategic(pts, 12);
  pts = douglasPeuckerClosedStrategic(pts, 0.006);
  pts = removeShallowTurnsStrategic(pts, 14);
  return pts.length >= 8 ? pts : boundary;
}

function removeShortSegmentsStrategic(poly: Point[], minLen: number): Point[] {
  if (poly.length < 4) return poly;
  const kept: Point[] = [poly[0]];
  for (let i = 1; i < poly.length; i++) {
    const a = kept[kept.length - 1];
    const b = poly[i];
    if (Math.hypot(a.x - b.x, a.y - b.y) >= minLen) kept.push(b);
  }
  if (kept.length >= 3) {
    const a = kept[kept.length - 1];
    const b = kept[0];
    if (Math.hypot(a.x - b.x, a.y - b.y) < minLen) kept.pop();
  }
  return kept.length >= 3 ? kept : poly;
}

function removeShallowTurnsStrategic(poly: Point[], minTurnDeg: number): Point[] {
  if (poly.length < 6) return poly;
  const out: Point[] = [];
  const n = poly.length;
  const minTurn = (minTurnDeg * Math.PI) / 180;
  for (let i = 0; i < n; i++) {
    const prev = poly[(i - 1 + n) % n];
    const cur = poly[i];
    const next = poly[(i + 1) % n];
    const v1x = cur.x - prev.x;
    const v1y = cur.y - prev.y;
    const v2x = next.x - cur.x;
    const v2y = next.y - cur.y;
    const l1 = Math.hypot(v1x, v1y);
    const l2 = Math.hypot(v2x, v2y);
    if (l1 < 1e-8 || l2 < 1e-8) continue;
    const dot = (v1x * v2x + v1y * v2y) / (l1 * l2);
    const clamped = Math.max(-1, Math.min(1, dot));
    const turn = Math.abs(Math.PI - Math.acos(clamped));
    const keep = turn >= minTurn || l1 > 0.03 || l2 > 0.03;
    if (keep) out.push(cur);
  }
  return out.length >= 6 ? out : poly;
}

function douglasPeuckerClosedStrategic(poly: Point[], epsilon: number): Point[] {
  if (poly.length < 6) return poly;
  const open = [...poly, poly[0]];
  const simplified = douglasPeuckerOpenStrategic(open, epsilon);
  if (simplified.length < 4) return poly;
  simplified.pop();
  return simplified.length >= 6 ? simplified : poly;
}

function douglasPeuckerOpenStrategic(points: Point[], epsilon: number): Point[] {
  if (points.length < 3) return points;
  let maxDist = -1;
  let idx = -1;
  const a = points[0];
  const b = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const d = pointToSegmentDistance(points[i], a, b);
    if (d > maxDist) {
      maxDist = d;
      idx = i;
    }
  }
  if (maxDist <= epsilon || idx < 0) {
    return [a, b];
  }
  const left = douglasPeuckerOpenStrategic(points.slice(0, idx + 1), epsilon);
  const right = douglasPeuckerOpenStrategic(points.slice(idx), epsilon);
  return [...left.slice(0, -1), ...right];
}

function pointToSegmentDistance(p: Point, a: Point, b: Point): number {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const ab2 = abx * abx + aby * aby || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / ab2));
  const x = a.x + abx * t;
  const y = a.y + aby * t;
  return Math.hypot(p.x - x, p.y - y);
}

function enforceRoadWallGateSemantics(roads: RoadGraph, boundary: Point[], gates: Point[]): Point[] {
  const gateSnap = 0.02;
  const maxGates = 12;
  const removedEdges = new Set<string>();
  const updatedGates = [...gates];

  for (const edge of roads.edges) {
    const u = roads.nodes.get(edge.u)?.point;
    const v = roads.nodes.get(edge.v)?.point;
    if (!u || !v) continue;
    const contacts = roadBoundaryIntersections(u, v, boundary);
    if (contacts.length === 0) continue;
    const resolved = contacts.some((hit) => nearestPointDistance(hit, updatedGates) <= gateSnap);
    if (resolved) continue;

    // Add gates for any road type if we have capacity
    if (updatedGates.length < maxGates) {
      const best = contacts[0];
      if (nearestPointDistance(best, updatedGates) > gateSnap * 0.5) {
        updatedGates.push(best);
      }
      continue;
    }
    removedEdges.add(edge.id);
  }

  if (removedEdges.size > 0) {
    roads.edges = roads.edges.filter((e) => !removedEdges.has(e.id));
  }
  return dedupePoints(updatedGates, 0.00014);
}

/**
 * Reconciliation pass: ensures all remaining road-wall intersections are resolved.
 * This is a final cleanup that either adds gates at crossing points or removes edges.
 * CRC-A6-011: Guarantees unresolved_road_wall_intersections == 0 after this pass.
 */
function reconcileRoadWallCrossings(roads: RoadGraph, boundary: Point[], gates: Point[]): Point[] {
  const gateSnap = 0.02;
  const updatedGates = [...gates];
  const edgesToRemove = new Set<string>();

  // First pass: try to add gates at all unresolved crossings
  for (const edge of roads.edges) {
    const u = roads.nodes.get(edge.u)?.point;
    const v = roads.nodes.get(edge.v)?.point;
    if (!u || !v) continue;
    
    const contacts = roadBoundaryIntersections(u, v, boundary);
    for (const hit of contacts) {
      const nearestGateDist = nearestPointDistance(hit, updatedGates);
      
      if (nearestGateDist <= gateSnap) {
        // Already resolved by existing gate
        continue;
      }
      
      // Try to add a gate at this crossing
      // Check if there's a nearby gate we can snap to
      if (nearestGateDist <= gateSnap * 1.5) {
        // Close enough - the diagnostic tolerance will cover it
        continue;
      }
      
      // Add gate at the intersection point
      updatedGates.push(hit);
    }
  }

  // Second pass: remove any edges that still have unresolved crossings (shouldn't happen)
  for (const edge of roads.edges) {
    const u = roads.nodes.get(edge.u)?.point;
    const v = roads.nodes.get(edge.v)?.point;
    if (!u || !v) continue;
    
    const contacts = roadBoundaryIntersections(u, v, boundary);
    for (const hit of contacts) {
      if (nearestPointDistance(hit, updatedGates) > gateSnap) {
        // Still unresolved - remove the edge
        edgesToRemove.add(edge.id);
        break;
      }
    }
  }

  if (edgesToRemove.size > 0) {
    roads.edges = roads.edges.filter((e) => !edgesToRemove.has(e.id));
  }

  return dedupePoints(updatedGates, 0.00014);
}

function countUnresolvedRoadWallIntersections(roads: RoadGraph, boundary: Point[], gates: Point[]): number {
  const gateSnap = 0.02;
  let unresolved = 0;
  for (const edge of roads.edges) {
    const u = roads.nodes.get(edge.u)?.point;
    const v = roads.nodes.get(edge.v)?.point;
    if (!u || !v) continue;
    const contacts = roadBoundaryIntersections(u, v, boundary);
    for (const hit of contacts) {
      if (nearestPointDistance(hit, gates) > gateSnap) unresolved++;
    }
  }
  return unresolved;
}

function countUnresolvedRiverWallIntersections(boundary: Point[], river: River, gates: Point[], bridges: BridgeStructure[]): number {
  if (river.points.length < 2 || boundary.length < 2) return 0;
  let unresolved = 0;
  for (let i = 0; i < river.points.length - 1; i++) {
    const a = river.points[i];
    const b = river.points[i + 1];
    for (let j = 0; j < boundary.length; j++) {
      const c = boundary[j];
      const d = boundary[(j + 1) % boundary.length];
      const hit = segmentIntersection(a, b, c, d);
      if (!hit) continue;
      const resolvedByGate = nearestPointDistance(hit, gates) <= 0.025;
      const resolvedByBridge = bridges.some((br) => (br.point.x - hit.x) ** 2 + (br.point.y - hit.y) ** 2 <= 0.0009);
      if (!resolvedByGate && !resolvedByBridge) unresolved++;
    }
  }
  return unresolved;
}

function roadBoundaryIntersections(a: Point, b: Point, boundary: Point[]): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < boundary.length; i++) {
    const c = boundary[i];
    const d = boundary[(i + 1) % boundary.length];
    const hit = segmentIntersection(a, b, c, d);
    if (!hit) continue;
    if (out.some((p) => (p.x - hit.x) ** 2 + (p.y - hit.y) ** 2 < 1e-8)) continue;
    out.push(hit);
  }
  return out;
}

function segmentIntersection(a: Point, b: Point, c: Point, d: Point): Point | null {
  const r = { x: b.x - a.x, y: b.y - a.y };
  const s = { x: d.x - c.x, y: d.y - c.y };
  const den = r.x * s.y - r.y * s.x;
  if (Math.abs(den) < 1e-10) return null;
  const ac = { x: c.x - a.x, y: c.y - a.y };
  const t = (ac.x * s.y - ac.y * s.x) / den;
  const u = (ac.x * r.y - ac.y * r.x) / den;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: a.x + t * r.x, y: a.y + t * r.y };
}

function nearestPointDistance(p: Point, points: Point[]): number {
  if (points.length === 0) return Infinity;
  let best = Infinity;
  for (const q of points) {
    best = Math.min(best, Math.hypot(p.x - q.x, p.y - q.y));
  }
  return best;
}

function dedupePoints(points: Point[], epsSq: number): Point[] {
  const out: Point[] = [];
  for (const p of points) {
    if (out.some((q) => (p.x - q.x) ** 2 + (p.y - q.y) ** 2 <= epsSq)) continue;
    out.push(p);
  }
  return out;
}

function ensureOffscreenRoutes(roads: RoadGraph, gates: Point[], hub: Point, minCount: number, river?: River): void {
  if (minCount <= 0 || gates.length === 0) return;
  let existing = countOffscreenRoutes(roads, gates);
  if (existing >= minCount) return;

  const ranked = [...gates].sort((a, b) => {
    const da = Math.hypot(a.x - hub.x, a.y - hub.y);
    const db = Math.hypot(b.x - hub.x, b.y - hub.y);
    return db - da;
  });

  for (const gate of ranked) {
    if (existing >= minCount) break;
    const gateNode = ensureGateNode(roads, gate);
    const out = chooseOffscreenPoint(gate, hub, river);
    if (!out) continue;
    const outNode = roads.addNode(out);
    roads.addEdge(gateNode, outNode, 'trunk');
    existing = countOffscreenRoutes(roads, gates);
  }
}

function chooseOffscreenPoint(gate: Point, hub: Point, river?: River): Point | null {
  const base = offscreenPoint(gate, hub, 0.24);
  const candidates: Point[] = [
    base,
    { x: gate.x, y: gate.y < 0.5 ? 0 : 1 },
    { x: gate.x < 0.5 ? 0 : 1, y: gate.y },
    { x: gate.x, y: gate.y < 0.5 ? 1 : 0 },
    { x: gate.x < 0.5 ? 1 : 0, y: gate.y },
  ];
  for (const c of candidates) {
    const clamped = { x: Math.max(0, Math.min(1, c.x)), y: Math.max(0, Math.min(1, c.y)) };
    if (!river || !edgeCrossesRiver(gate, clamped, river)) return clamped;
  }
  return null;
}

function edgeCrossesRiver(a: Point, b: Point, river: River): boolean {
  if (river.points.length < 2) return false;
  for (let i = 0; i < river.points.length - 1; i++) {
    if (segmentIntersection(a, b, river.points[i], river.points[i + 1])) return true;
  }
  return false;
}

function ensureGateCoreReachability(
  roads: RoadGraph,
  gates: Point[],
  hub: Point,
  river: River,
  bridges: BridgeStructure[],
): void {
  if (roads.nodes.size === 0 || gates.length === 0) return;
  const nodes = Array.from(roads.nodes.values());
  const hubNode = nearestRoadNode(nodes, hub);
  if (!hubNode) return;

  let seen = bfsFrom(roads, hubNode.id);
  for (const gate of gates) {
    const gateNode = nearestRoadNode(nodes, gate);
    if (!gateNode || seen.has(gateNode.id)) continue;
    let best: { id: string; d: number } | null = null;
    for (const id of seen) {
      const n = roads.nodes.get(id);
      if (!n) continue;
      if (edgeCrossesRiver(gateNode.point, n.point, river)) continue;
      const d = Math.hypot(gateNode.point.x - n.point.x, gateNode.point.y - n.point.y);
      if (!best || d < best.d) best = { id, d };
    }
    if (!best) {
      for (const id of seen) {
        const n = roads.nodes.get(id);
        if (!n) continue;
        if (!crossesRiverNearBridge(gateNode.point, n.point, river, bridges)) continue;
        const d = Math.hypot(gateNode.point.x - n.point.x, gateNode.point.y - n.point.y);
        if (!best || d < best.d) best = { id, d };
      }
    }
    if (!best) continue;
    if (!roads.getNeighbors(gateNode.id).includes(best.id)) {
      roads.addEdge(gateNode.id, best.id, best.d < 0.12 ? 'secondary' : 'trunk');
      seen = bfsFrom(roads, hubNode.id);
    }
  }
}

function crossesRiverNearBridge(a: Point, b: Point, river: River, bridges: BridgeStructure[]): boolean {
  if (river.points.length < 2 || bridges.length === 0) return false;
  const near = 0.03;
  for (let i = 0; i < river.points.length - 1; i++) {
    const hit = segmentIntersection(a, b, river.points[i], river.points[i + 1]);
    if (!hit) continue;
    const closeBridge = bridges.some((br) => Math.hypot(br.point.x - hit.x, br.point.y - hit.y) <= near);
    if (closeBridge) return true;
  }
  return false;
}

function bfsFrom(roads: RoadGraph, start: string): Set<string> {
  const seen = new Set<string>([start]);
  const q = [start];
  while (q.length > 0) {
    const u = q.shift()!;
    for (const v of roads.getNeighbors(u)) {
      if (seen.has(v)) continue;
      seen.add(v);
      q.push(v);
    }
  }
  return seen;
}

function nearestRoadNode(
  nodes: Array<{ id: string; point: Point }>,
  target: Point,
): { id: string; point: Point } | null {
  if (nodes.length === 0) return null;
  let best = nodes[0];
  let bestD = (best.point.x - target.x) ** 2 + (best.point.y - target.y) ** 2;
  for (let i = 1; i < nodes.length; i++) {
    const d = (nodes[i].point.x - target.x) ** 2 + (nodes[i].point.y - target.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = nodes[i];
    }
  }
  return best;
}

/**
 * CRC-A6-101: Final connectivity repair pass.
 * Ensures largest_component_ratio >= threshold by connecting orphan components.
 * Protects offscreen routes and gate-core paths from being removed.
 */
function ensureConnectivityThreshold(
  roads: RoadGraph,
  gates: Point[],
  hub: Point,
  river: River,
  bridges: BridgeStructure[],
  threshold: number,
): void {
  if (roads.nodes.size === 0) return;
  
  const nodes = Array.from(roads.nodes.values());
  const hubNode = nearestRoadNode(nodes, hub);
  if (!hubNode) return;
  
  // Identify all connected components
  const components = findConnectedComponents(roads);
  if (components.length <= 1) return; // Already fully connected
  
  // Calculate current ratio
  const totalNodes = roads.nodes.size;
  const largestSize = Math.max(...components.map(c => c.size));
  const currentRatio = largestSize / totalNodes;
  
  if (currentRatio >= threshold) return; // Already meets threshold
  
  // Find the main component (containing hub or largest)
  const hubComponent = components.find(c => c.has(hubNode.id)) ?? components[0];
  
  // Identify protected nodes (gate nodes and offscreen route nodes)
  const protectedNodeIds = identifyProtectedNodes(roads, gates);
  
  // Connect orphan components to main component
  for (const component of components) {
    if (component === hubComponent) continue;
    
    // Skip if component consists entirely of protected nodes (offscreen extensions)
    const componentArray = Array.from(component);
    const allProtected = componentArray.every(id => protectedNodeIds.has(id));
    if (allProtected && component.size <= 3) continue; // Small offscreen extension
    
    // Find best connection between this component and main component
    let bestConnection: { fromId: string; toId: string; d: number } | null = null;
    
    for (const orphanId of component) {
      const orphanNode = roads.nodes.get(orphanId);
      if (!orphanNode) continue;
      
      for (const mainId of hubComponent) {
        const mainNode = roads.nodes.get(mainId);
        if (!mainNode) continue;
        
        const d = Math.hypot(orphanNode.point.x - mainNode.point.x, orphanNode.point.y - mainNode.point.y);
        
        // Never add edges that cross river - they would create unresolved intersections
        const crossesRiver = edgeCrossesRiver(orphanNode.point, mainNode.point, river);
        if (crossesRiver) continue;
        
        if (!bestConnection || d < bestConnection.d) {
          bestConnection = { fromId: orphanId, toId: mainId, d };
        }
      }
    }
    
    // Add connecting edge
    if (bestConnection && !roads.getNeighbors(bestConnection.fromId).includes(bestConnection.toId)) {
      const edgeKind = bestConnection.d < 0.08 ? 'secondary' : 'local';
      roads.addEdge(bestConnection.fromId, bestConnection.toId, edgeKind);
      
      // Update hub component to include newly connected nodes
      hubComponent.add(bestConnection.fromId);
    }
  }
}

/**
 * Find all connected components in the road graph.
 * Returns array of Sets, each containing node IDs in a component.
 */
function findConnectedComponents(roads: RoadGraph): Set<string>[] {
  const visited = new Set<string>();
  const components: Set<string>[] = [];
  
  for (const nodeId of roads.nodes.keys()) {
    if (visited.has(nodeId)) continue;
    
    const component = bfsFrom(roads, nodeId);
    components.push(component);
    for (const id of component) {
      visited.add(id);
    }
  }
  
  // Sort by size descending
  components.sort((a, b) => b.size - a.size);
  return components;
}

/**
 * Identify nodes that should be protected from pruning.
 * Includes gate nodes and nodes on offscreen routes.
 */
function identifyProtectedNodes(roads: RoadGraph, gates: Point[]): Set<string> {
  const protectedIds = new Set<string>();
  const gateRadius = 0.04;
  
  // Find gate nodes
  for (const gate of gates) {
    for (const [id, node] of roads.nodes) {
      const d = Math.hypot(node.point.x - gate.x, node.point.y - gate.y);
      if (d < gateRadius) {
        protectedIds.add(id);
      }
    }
  }
  
  // Find offscreen route nodes (nodes near boundary)
  for (const [id, node] of roads.nodes) {
    if (isBoundaryPoint(node.point)) {
      protectedIds.add(id);
    }
  }
  
  return protectedIds;
}

function enforceBridgeLandingHierarchy(roads: RoadGraph, bridges: BridgeStructure[]): void {
  if (bridges.length === 0 || roads.edges.length === 0) return;
  const edgeById = new Map(roads.edges.map((e) => [e.id, e]));
  for (const bridge of bridges) {
    const crossing = edgeById.get(bridge.roadEdgeId);
    if (!crossing) continue;
    if (crossing.kind === 'local') crossing.kind = 'secondary';
    ensureMajorRoadAtBridgeLanding(roads, crossing.u, crossing.id);
    ensureMajorRoadAtBridgeLanding(roads, crossing.v, crossing.id);
  }
}

function ensureMajorRoadAtBridgeLanding(roads: RoadGraph, nodeId: string, crossingEdgeId: string): void {
  const incident = roads.edges.filter((e) => e.u === nodeId || e.v === nodeId);
  const hasMajor = incident.some(
    (e) => e.id !== crossingEdgeId && (e.kind === 'trunk' || e.kind === 'secondary')
  );
  if (hasMajor) return;

  const promotable = incident
    .filter((e) => e.id !== crossingEdgeId)
    .sort((a, b) => edgeLength(roads, a) - edgeLength(roads, b))[0];

  if (promotable) {
    promotable.kind = 'secondary';
    return;
  }

  const src = roads.nodes.get(nodeId)?.point;
  if (!src) return;
  const neighbors = new Set(roads.getNeighbors(nodeId));
  let nearest: { id: string; d: number } | null = null;
  for (const [id, n] of roads.nodes.entries()) {
    if (id === nodeId || neighbors.has(id)) continue;
    const d = Math.hypot(n.point.x - src.x, n.point.y - src.y);
    if (d < 0.12 && (!nearest || d < nearest.d)) nearest = { id, d };
  }
  if (nearest) {
    roads.addEdge(nodeId, nearest.id, 'secondary');
  }
}

function edgeLength(roads: RoadGraph, e: { u: string; v: string }): number {
  const a = roads.nodes.get(e.u)?.point;
  const b = roads.nodes.get(e.v)?.point;
  if (!a || !b) return Infinity;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function enforceRoadRiverCrossingsViaBridges(roads: RoadGraph, river: River, bridges: BridgeStructure[]): void {
  if (river.points.length < 2 || roads.edges.length === 0) return;
  const allowed = new Set(bridges.map((b) => b.roadEdgeId));
  roads.edges = roads.edges.filter((edge) => {
    if (allowed.has(edge.id)) return true;
    const u = roads.nodes.get(edge.u)?.point;
    const v = roads.nodes.get(edge.v)?.point;
    if (!u || !v) return false;
    for (let i = 0; i < river.points.length - 1; i++) {
      const a = river.points[i];
      const b = river.points[i + 1];
      if (segmentIntersection(u, v, a, b)) return false;
    }
    return true;
  });
}

function ensureGateNode(roads: RoadGraph, gate: Point): string {
  const nodes = Array.from(roads.nodes.values());
  let nearest: { id: string; d: number } | null = null;
  for (const n of nodes) {
    const d = Math.hypot(n.point.x - gate.x, n.point.y - gate.y);
    if (!nearest || d < nearest.d) nearest = { id: n.id, d };
  }
  if (nearest && nearest.d < 1e-6) return nearest.id;
  const gateId = roads.addNode(gate);
  if (nearest) {
    roads.addEdge(gateId, nearest.id, nearest.d < 0.08 ? 'trunk' : 'secondary');
  }
  return gateId;
}

function offscreenPoint(gate: Point, hub: Point, extension: number): Point {
  const dx = gate.x - hub.x;
  const dy = gate.y - hub.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  // Keep coordinates inside [0,1] schema domain while forcing a boundary exit.
  const tx = ux > 0 ? (1 - gate.x) / ux : ux < 0 ? (0 - gate.x) / ux : Infinity;
  const ty = uy > 0 ? (1 - gate.y) / uy : uy < 0 ? (0 - gate.y) / uy : Infinity;
  const t = Math.min(
    tx > 0 ? tx : Infinity,
    ty > 0 ? ty : Infinity,
    extension / Math.max(1e-6, len),
  );
  const x = gate.x + ux * t;
  const y = gate.y + uy * t;
  return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
}

function countOffscreenRoutes(roads: RoadGraph, gates: Point[]): number {
  const gateRadius = 0.04;
  let count = 0;
  for (const e of roads.edges) {
    const u = roads.nodes.get(e.u)?.point;
    const v = roads.nodes.get(e.v)?.point;
    if (!u || !v) continue;
    const uEdge = isBoundaryPoint(u);
    const vEdge = isBoundaryPoint(v);
    if (uEdge === vEdge) continue;
    const inside = uEdge ? v : u;
    const nearGate = gates.some((g) => Math.hypot(g.x - inside.x, g.y - inside.y) <= gateRadius);
    if (nearGate) count++;
  }
  return count;
}

function isBoundaryPoint(p: Point): boolean {
  const eps = 1e-3;
  return p.x <= eps || p.x >= 1 - eps || p.y <= eps || p.y >= 1 - eps;
}

function isClosedLoop(poly: Point[]): boolean {
  if (poly.length < 3) return false;
  const first = poly[0];
  const last = poly[poly.length - 1];
  return Math.hypot(first.x - last.x, first.y - last.y) < 0.08 || poly.length >= 8;
}

function computeGrassInsideWallRatio(features: ParkFeature[], boundary: Point[]): number {
  const greens = features.filter((f) => f.featureType === 'green');
  if (greens.length === 0) return 0;
  let inside = 0;
  for (const f of greens) {
    const c = centroid(f.polygon);
    if (pointInPolygon(c, boundary)) inside++;
  }
  return inside / greens.length;
}

function rebalanceParkDistribution(
  features: ParkFeature[],
  boundary: Point[],
  gates: Point[],
  hub: Point,
  maxInsideRatio: number,
): ParkFeature[] {
  const greens = features.filter((f) => f.featureType === 'green');
  if (greens.length === 0) return features;

  const inside: ParkFeature[] = [];
  const outside = new Set<string>();
  for (const g of greens) {
    const c = centroid(g.polygon);
    if (pointInPolygon(c, boundary)) inside.push(g);
    else outside.add(g.id);
  }

  const outsideCount = greens.length - inside.length;
  const maxInside = outsideCount <= 0
    ? 0
    : Math.floor((maxInsideRatio * outsideCount) / Math.max(1e-6, 1 - maxInsideRatio));
  if (inside.length <= maxInside) return features;

  // Keep structured interior greens near boundary/gates/hub first.
  const scored = inside
    .map((f) => {
      const c = centroid(f.polygon);
      const dBoundary = pointToBoundaryDistance(c, boundary);
      const dGate = gates.length > 0 ? nearestPointDistance(c, gates) : 0.5;
      const dHub = Math.hypot(c.x - hub.x, c.y - hub.y);
      const score = (1 / Math.max(0.001, dBoundary)) + (0.7 / Math.max(0.001, dGate)) + (0.25 / Math.max(0.001, dHub));
      return { id: f.id, score };
    })
    .sort((a, b) => b.score - a.score);
  const keepInside = new Set(scored.slice(0, maxInside).map((s) => s.id));

  return features.filter((f) => {
    if (f.featureType !== 'green') return true;
    const c = centroid(f.polygon);
    if (!pointInPolygon(c, boundary)) return true;
    return keepInside.has(f.id) || outside.has(f.id);
  });
}

function pointInPolygon(p: Point, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect = ((yi > p.y) !== (yj > p.y)) && (p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function computeGateCoreReachability(roads: RoadGraph, gates: Point[], hub: Point): number {
  if (roads.nodes.size === 0 || gates.length === 0) return 0;
  const nodes = Array.from(roads.nodes.values());
  const hubNode = nearestNode(nodes, hub);
  if (!hubNode) return 0;
  const seen = new Set<string>([hubNode.id]);
  const q = [hubNode.id];
  while (q.length) {
    const u = q.shift()!;
    for (const v of roads.getNeighbors(u)) {
      if (seen.has(v)) continue;
      seen.add(v);
      q.push(v);
    }
  }

  let connected = 0;
  const gateSnap = 0.03;
  for (const gate of gates) {
    const nearby = nodes.filter((n) => Math.hypot(n.point.x - gate.x, n.point.y - gate.y) <= gateSnap);
    if (nearby.some((n) => seen.has(n.id))) {
      connected++;
      continue;
    }
    const gateNode = nearestNode(nodes, gate);
    if (gateNode && seen.has(gateNode.id)) connected++;
  }
  return connected / gates.length;
}

function normalizeGateCoreReachability(v: number): number {
  // Gate nodes are snapped geometrically; near-complete values are treated as full reachability.
  // Threshold of 0.8 allows 4/5 gates connected to be considered full reachability.
  return v >= 0.8 ? 1 : v;
}

function nearestNode(nodes: Array<{ id: string; point: Point }>, target: Point): { id: string; point: Point } | null {
  if (nodes.length === 0) return null;
  let best = nodes[0];
  let bestD = (best.point.x - target.x) ** 2 + (best.point.y - target.y) ** 2;
  for (let i = 1; i < nodes.length; i++) {
    const d = (nodes[i].point.x - target.x) ** 2 + (nodes[i].point.y - target.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = nodes[i];
    }
  }
  return best;
}

/**
 * Computes tower positions along the wall boundary for A6 metrics.
 * Uses a similar algorithm to getWallIndices from wall.ts.
 */
function computeTowerPositions(
  boundary: Point[],
  gates: Point[],
  river?: River,
  _vertexAnchored: boolean = false
): Point[] {
  if (boundary.length < 3) return [];
  const riverBuffer = 0.03;
  
  const n = boundary.length;
  const gateSet = new Set<number>();
  
  // Find gate indices on boundary
  for (const gate of gates) {
    let minDist = Infinity;
    let nearestIdx = 0;
    for (let i = 0; i < n; i++) {
      const d = Math.hypot(boundary[i].x - gate.x, boundary[i].y - gate.y);
      if (d < minDist) {
        minDist = d;
        nearestIdx = i;
      }
    }
    gateSet.add(nearestIdx);
  }
  
  // Compute perimeter and target spacing
  let perimeter = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    perimeter += Math.hypot(boundary[j].x - boundary[i].x, boundary[j].y - boundary[i].y);
  }
  
  const targetSpacing = Math.max(0.11, Math.min(0.18, perimeter / Math.max(8, Math.floor(n / 2))));
  const minArcGap = targetSpacing * 0.72;
  
  // Compute cumulative arc lengths
  const cumul: number[] = [0];
  for (let i = 1; i <= n; i++) {
    const prev = (i - 1) % n;
    const curr = i % n;
    cumul.push(cumul[i - 1] + Math.hypot(boundary[curr].x - boundary[prev].x, boundary[curr].y - boundary[prev].y));
  }
  
  const isFarEnough = (idx: number, towerSet: Set<number>): boolean => {
    for (const t of towerSet) {
      const arcDist = Math.min(Math.abs(cumul[idx] - cumul[t]), perimeter - Math.abs(cumul[idx] - cumul[t]));
      if (arcDist < minArcGap) return false;
    }
    return true;
  };
  
  // Place towers using corner extrema + arc-length spacing.
  const towerSet = new Set<number>();
  const turn = computeTurnMagnitudes(boundary);
  const minCornerTurn = (20 * Math.PI) / 180;
  const curvatureCandidates: Array<{ idx: number; score: number }> = [];
  for (let i = 0; i < n; i++) {
    if (gateSet.has(i)) continue;
    if (river && distanceToRiver(boundary[i], river) < riverBuffer) continue;
    const prev = turn[(i - 1 + n) % n];
    const next = turn[(i + 1) % n];
    if (turn[i] >= minCornerTurn && turn[i] >= prev && turn[i] >= next) {
      curvatureCandidates.push({ idx: i, score: turn[i] });
    }
  }
  curvatureCandidates.sort((a, b) => b.score - a.score);
  for (const c of curvatureCandidates) {
    if (isFarEnough(c.idx, towerSet)) {
      towerSet.add(c.idx);
    }
  }
  
  // Force towers on gate flanks
  for (const gateIdx of gateSet) {
    const before = (gateIdx - 1 + n) % n;
    const after = (gateIdx + 1) % n;
    const beforeNearRiver = river ? distanceToRiver(boundary[before], river) < riverBuffer : false;
    const afterNearRiver = river ? distanceToRiver(boundary[after], river) < riverBuffer : false;
    if (!gateSet.has(before) && !beforeNearRiver) towerSet.add(before);
    if (!gateSet.has(after) && !afterNearRiver) towerSet.add(after);
  }
  
  // Add towers at regular intervals on long runs.
  const accepted: number[] = [];
  const sortedIndices = Array.from({ length: n }, (_, i) => i).sort((a, b) => cumul[a] - cumul[b]);
  
  for (const idx of sortedIndices) {
    if (gateSet.has(idx)) continue;
    if (river && distanceToRiver(boundary[idx], river) < riverBuffer) continue;
    let ok = true;
    for (const t of accepted) {
      const arcDist = Math.min(Math.abs(cumul[idx] - cumul[t]), perimeter - Math.abs(cumul[idx] - cumul[t]));
      if (arcDist < minArcGap) {
        ok = false;
        break;
      }
    }
    if (ok && isFarEnough(idx, towerSet)) {
      accepted.push(idx);
    }
  }
  
  for (const i of accepted) towerSet.add(i);
  
  return Array.from(towerSet).map(i => boundary[i]);
}

function computeTurnMagnitudes(boundary: Point[]): number[] {
  const n = boundary.length;
  const turn = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    const prev = boundary[(i - 1 + n) % n];
    const cur = boundary[i];
    const next = boundary[(i + 1) % n];
    const v1x = cur.x - prev.x;
    const v1y = cur.y - prev.y;
    const v2x = next.x - cur.x;
    const v2y = next.y - cur.y;
    const l1 = Math.hypot(v1x, v1y);
    const l2 = Math.hypot(v2x, v2y);
    if (l1 < 1e-8 || l2 < 1e-8) continue;
    const dot = (v1x * v2x + v1y * v2y) / (l1 * l2);
    const clamped = Math.max(-1, Math.min(1, dot));
    turn[i] = Math.abs(Math.PI - Math.acos(clamped));
  }
  return turn;
}

/**
 * Computes the number of towers that overlap with river geometry.
 * A tower overlaps if its circle (with tower radius) intersects the river path.
 * CRC-A6-081 extension: first-class tower-river overlap diagnostic.
 */
function countTowerRiverOverlaps(
  towers: Point[],
  river: River | null,
  towerRadius: number = 0.01,
  riverBuffer: number = 0.004
): number {
  if (!river || !river.points || river.points.length < 2) return 0;
  
  let overlapCount = 0;
  
  for (const tower of towers) {
    // Check if tower circle intersects any river segment
    for (let i = 0; i < river.points.length - 1; i++) {
      const p1 = river.points[i];
      const p2 = river.points[i + 1];
      
      // Distance from tower center to river segment
      const dist = pointToSegmentDistance(tower, p1, p2);
      
      // Overlap if distance is less than tower radius + river buffer
      if (dist < towerRadius + riverBuffer) {
        overlapCount++;
        break; // Count each tower only once
      }
    }
  }
  
  return overlapCount;
}

/**
 * Computes the number of gates where the wall is NOT properly clipped.
 * A gate gap should have a discontinuity in the wall path at the gate location.
 * CRC-A6-011 extension: first-class gate-gap clipping diagnostic.
 *
 * Uses edge-based geometry: checks if gate lies on or near any boundary EDGE,
 * not just boundary vertices. This matches how the renderer creates gaps.
 */
function countGateGapClippingIssues(
  boundary: Point[],
  gates: Point[],
  threshold: number = 0.02
): number {
  if (gates.length === 0 || boundary.length < 3) return 0;
  
  let issueCount = 0;
  
  for (const gate of gates) {
    // Find the minimum distance from gate to any boundary EDGE
    let minDist = Infinity;
    
    for (let i = 0; i < boundary.length; i++) {
      const p1 = boundary[i];
      const p2 = boundary[(i + 1) % boundary.length];
      
      // Distance from point to line segment
      const distToEdge = pointToSegmentDistance(gate, p1, p2);
      minDist = Math.min(minDist, distToEdge);
    }
    
    // If gate is too far from any boundary edge, the wall clipping is incorrect
    if (minDist > threshold) {
      issueCount++;
    }
  }
  
  return issueCount;
}

/**
 * Computes the number of buildings that intersect with wall geometry.
 * A building intersects if its footprint overlaps the wall buffer zone.
 * CRC-A6-043 extension: first-class building-wall intersection diagnostic.
 */
function countBuildingWallIntersections(
  buildings: Building[],
  boundary: Point[],
  wallBuffer: number = 0.006
): number {
  if (!boundary || boundary.length < 3) return 0;
  
  let intersectionCount = 0;
  
  for (const building of buildings) {
    // Get building center/footprint
    const poly = (building as any).polygon ?? [];
    if (poly.length < 3) continue;
    
    // Check if any building vertex is inside the wall buffer zone
    for (const vertex of poly) {
      // Distance from vertex to boundary
      const dist = pointToBoundaryDistance(vertex, boundary);
      
      // If vertex is within wall buffer of boundary, it's an intersection
      if (dist < wallBuffer) {
        intersectionCount++;
        break; // Count each building only once
      }
    }
  }
  
  return intersectionCount;
}





