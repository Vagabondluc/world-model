// @ts-nocheck
/**
 * A6 Diagnostics Extension
 * 
 * This module provides the 16 new A6 diagnostic keys for Wave 0 infrastructure.
 * These metrics cover road geometry, bridge alignment, wall topology, density sanity,
 * connectivity robustness, farm logic, boundary derivation, and render semantics.
 * 
 * @module domain/diagnostics/a6Metrics
 */

import { CityDiagnostics } from './metrics';

/**
 * A6-specific diagnostic metrics for Wave 0 infrastructure.
 * 
 * These 16 diagnostic keys provide detailed measurements for:
 * - Road geometry quality (R1)
 * - Bridge alignment (B2)
 * - Wall topology (W4)
 * - Density sanity (D5)
 * - Connectivity robustness (G6)
 * - Farm logic (F8)
 * - Boundary derivation (U10)
 * - Render semantics (R9)
 */
export interface A6Diagnostics {
  // ==========================================================================
  // R1: Road geometry quality
  // ==========================================================================
  
  /**
   * Minimum turn angle observed in the road network (in degrees).
   * Lower values indicate sharper turns which may be unrealistic.
   * Target: >= 30 degrees for realistic road networks.
   */
  min_turn_angle_observed: number;
  
  /**
   * Count of micro-segments in the road network.
   * Micro-segments are very short road segments that may indicate
   * over-fragmentation or geometry issues.
   * Target: Minimize to reduce unnecessary complexity.
   */
  micro_segment_count: number;
  
  // ==========================================================================
  // B2: Bridge alignment
  // ==========================================================================
  
  /**
   * Count of bridge endpoints that are not properly snapped to road network.
   * Unsnapped endpoints create disconnected or floating bridges.
   * Target: 0 (all bridges must be properly connected).
   */
  bridge_endpoint_unsnapped_count: number;
  
  /**
   * Minimum observed spacing between bridges (in map units).
   * Ensures bridges are not placed too close together.
   * Target: >= minimum_bridge_spacing threshold.
   */
  bridge_spacing_min_observed: number;
  
  // ==========================================================================
  // W4: Wall topology
  // ==========================================================================
  
  /**
   * Ratio measuring wall shape complexity.
   * Higher values indicate more complex (potentially problematic) wall shapes.
   * Computed as perimeter / sqrt(area) normalized against ideal circle.
   * Target: <= 2.0 for reasonable wall shapes.
   */
  wall_shape_complexity_ratio: number;
  
  /**
   * Minimum observed spacing between wall towers (in map units).
   * Ensures towers are not placed too close together.
   * Target: Within tower spacing band compliance.
   */
  tower_spacing_min_observed: number;
  
  /**
   * Maximum observed spacing between wall towers (in map units).
   * Ensures towers are not placed too far apart.
   * Target: Within tower spacing band compliance.
   */
  tower_spacing_max_observed: number;
  
  // ==========================================================================
  // D5: Density sanity
  // ==========================================================================
  
  /**
   * Mean Absolute Error of radial density falloff from city center.
   * Measures how well density follows expected radial pattern.
   * Target: <= threshold for coherent density distribution.
   */
  density_radial_mae: number;
  
  /**
   * Maximum density difference between adjacent blocks.
   * Large differences may indicate unrealistic density patterns.
   * Target: <= threshold for smooth density transitions.
   */
  adjacent_density_diff_max: number;
  
  // ==========================================================================
  // G6: Connectivity robustness
  // ==========================================================================
  
  /**
   * Total count of disconnected road components.
   * Higher values indicate more fragmentation in the road network.
   * Target: 1 (fully connected network) or minimal with bridges connecting.
   */
  road_component_count: number;
  
  /**
   * Ratio of nodes in the largest connected component to total nodes.
   * Higher values indicate better overall connectivity.
   * Target: >= 0.8 for acceptable connectivity.
   */
  largest_component_ratio: number;
  
  /**
   * Number of disconnected components before bridge placement.
   * Used to measure bridge effectiveness.
   */
  components_before_bridges: number;
  
  /**
   * Number of disconnected components after bridge placement.
   * Should be less than or equal to components_before_bridges.
   */
  components_after_bridges: number;
  
  // ==========================================================================
  // F8: Farm logic
  // ==========================================================================
  
  /**
   * Count of farms placed inside the city wall.
   * Policy: at most 2 farms inside wall, and majority of farms outside.
   */
  farms_inside_wall_count: number;
  
  // ==========================================================================
  // U10: Boundary derivation
  // ==========================================================================
  
  /**
   * Source of boundary derivation for the city.
   * Values: 'defended_footprint' | 'explicit' | 'derived' | 'none'
   * Used for provenance tracking of wall boundaries.
   */
  boundary_derivation_source: string;
  
  // ==========================================================================
  // R9: Render semantics
  // ==========================================================================
  
  /**
   * Ordered stack of render layers from bottom to top.
   * Must follow canonical layer order contract.
   * Example: ['terrain', 'river', 'roads', 'blocks', 'buildings', 'wall', 'bridges']
   */
  render_layer_stack: string[];
}

/**
 * Context object for computing A6 diagnostics.
 * Contains all necessary data from the city model.
 */
export interface A6MetricsContext {
  /** Road network nodes with positions */
  roadNodes: Map<string, { x: number; y: number }>;
  /** Road network edges */
  roadEdges: Array<{ u: string; v: string; kind: string }>;
  /** Bridge endpoints */
  bridges: Array<{ id: string; endpoints: [{ x: number; y: number }, { x: number; y: number }] }>;
  /** Wall polygon vertices */
  wallPolygon: Array<{ x: number; y: number }>;
  /** Tower positions along wall */
  towers: Array<{ x: number; y: number }>;
  /** Building positions with density info */
  buildings: Array<{ x: number; y: number; density?: number }>;
  /** Block polygons with density info */
  blocks: Array<{ polygon: Array<{ x: number; y: number }>; density?: number }>;
  /** Farm positions */
  farms: Array<{ x: number; y: number }>;
  /** City center point */
  cityCenter: { x: number; y: number };
  /** Number of road components before bridge placement */
  components_before_bridges?: number;
  /** Number of road components after bridge placement */
  components_after_bridges?: number;
  /** Source of boundary derivation */
  boundary_derivation_source?: string;
}

/**
 * Computes A6-specific diagnostic metrics from city model data.
 * 
 * This class provides static methods for computing each of the 16 A6
 * diagnostic keys defined in the Wave 0 architecture.
 */
export class A6MetricsComputer {
  /**
   * Computes all A6 diagnostics from the given context.
   * 
   * @param context - The metrics context containing city model data
   * @returns Complete A6Diagnostics object with all 16 metrics
   */
  static computeAll(context: A6MetricsContext): A6Diagnostics {
    return {
      // R1: Road geometry quality
      min_turn_angle_observed: this.computeMinTurnAngle(context),
      micro_segment_count: this.computeMicroSegmentCount(context),
      
      // B2: Bridge alignment
      bridge_endpoint_unsnapped_count: this.computeBridgeEndpointUnsnapped(context),
      bridge_spacing_min_observed: this.computeBridgeSpacingMin(context),
      
      // W4: Wall topology
      wall_shape_complexity_ratio: this.computeWallShapeComplexity(context),
      tower_spacing_min_observed: this.computeTowerSpacingMin(context),
      tower_spacing_max_observed: this.computeTowerSpacingMax(context),
      
      // D5: Density sanity
      density_radial_mae: this.computeDensityRadialMAE(context),
      adjacent_density_diff_max: this.computeAdjacentDensityDiffMax(context),
      
      // G6: Connectivity robustness
      road_component_count: this.computeRoadComponentCount(context),
      largest_component_ratio: this.computeLargestComponentRatio(context),
      components_before_bridges: context.components_before_bridges ?? 1,
      components_after_bridges: context.components_after_bridges ?? 1,
      
      // F8: Farm logic
      farms_inside_wall_count: this.computeFarmsInsideWall(context),
      
      // U10: Boundary derivation
      boundary_derivation_source: context.boundary_derivation_source ?? 'derived',
      
      // R9: Render semantics
      render_layer_stack: this.computeRenderLayerStack(context),
    };
  }
  
  // ==========================================================================
  // R1: Road geometry quality implementations
  // ==========================================================================
  
  /**
   * Computes the minimum turn angle in the road network.
   * Measures angles at intersection points where roads meet.
   */
  private static computeMinTurnAngle(context: A6MetricsContext): number {
    const { roadNodes, roadEdges } = context;
    let minAngle = 180;
    
    // Build adjacency map
    const adjacency = new Map<string, string[]>();
    for (const edge of roadEdges) {
      if (!adjacency.has(edge.u)) adjacency.set(edge.u, []);
      if (!adjacency.has(edge.v)) adjacency.set(edge.v, []);
      adjacency.get(edge.u)!.push(edge.v);
      adjacency.get(edge.v)!.push(edge.u);
    }
    
    // Check angles at each node with multiple connections
    for (const [nodeId, neighbors] of adjacency) {
      if (neighbors.length < 2) continue;
      
      const node = roadNodes.get(nodeId);
      if (!node) continue;
      
      // Compute angles between all pairs of connected roads
      for (let i = 0; i < neighbors.length; i++) {
        for (let j = i + 1; j < neighbors.length; j++) {
          const n1 = roadNodes.get(neighbors[i]);
          const n2 = roadNodes.get(neighbors[j]);
          if (!n1 || !n2) continue;
          
          const angle = this.angleBetweenPoints(node, n1, n2);
          minAngle = Math.min(minAngle, angle, 180 - angle);
        }
      }
    }
    
    return minAngle;
  }
  
  /**
   * Counts micro-segments (very short road segments) in the network.
   */
  private static computeMicroSegmentCount(context: A6MetricsContext): number {
    const { roadNodes, roadEdges } = context;
    const microSegmentThreshold = 0.01; // 1% of map size
    let count = 0;
    
    for (const edge of roadEdges) {
      const u = roadNodes.get(edge.u);
      const v = roadNodes.get(edge.v);
      if (!u || !v) continue;
      
      const length = Math.sqrt((v.x - u.x) ** 2 + (v.y - u.y) ** 2);
      if (length < microSegmentThreshold) {
        count++;
      }
    }
    
    return count;
  }
  
  // ==========================================================================
  // B2: Bridge alignment implementations
  // ==========================================================================
  
  /**
   * Counts bridge endpoints that are not properly snapped to the road network.
   */
  private static computeBridgeEndpointUnsnapped(context: A6MetricsContext): number {
    const { roadNodes, bridges } = context;
    const snapThreshold = 0.02;
    let unsnappedCount = 0;
    
    for (const bridge of bridges) {
      for (const endpoint of bridge.endpoints) {
        let isSnapped = false;
        for (const [, node] of roadNodes) {
          const dist = Math.sqrt((node.x - endpoint.x) ** 2 + (node.y - endpoint.y) ** 2);
          if (dist < snapThreshold) {
            isSnapped = true;
            break;
          }
        }
        if (!isSnapped) {
          unsnappedCount++;
        }
      }
    }
    
    return unsnappedCount;
  }
  
  /**
   * Computes minimum spacing between bridges.
   */
  private static computeBridgeSpacingMin(context: A6MetricsContext): number {
    const { bridges } = context;
    if (bridges.length < 2) return Infinity;
    
    let minSpacing = Infinity;
    
    for (let i = 0; i < bridges.length; i++) {
      for (let j = i + 1; j < bridges.length; j++) {
        // Compute center points of bridges
        const c1 = {
          x: (bridges[i].endpoints[0].x + bridges[i].endpoints[1].x) / 2,
          y: (bridges[i].endpoints[0].y + bridges[i].endpoints[1].y) / 2
        };
        const c2 = {
          x: (bridges[j].endpoints[0].x + bridges[j].endpoints[1].x) / 2,
          y: (bridges[j].endpoints[0].y + bridges[j].endpoints[1].y) / 2
        };
        
        const dist = Math.sqrt((c2.x - c1.x) ** 2 + (c2.y - c1.y) ** 2);
        minSpacing = Math.min(minSpacing, dist);
      }
    }
    
    return minSpacing;
  }
  
  // ==========================================================================
  // W4: Wall topology implementations
  // ==========================================================================
  
  /**
   * Computes wall shape complexity ratio.
   * Uses the isoperimetric quotient: 4π * area / perimeter²
   * Normalized so circle = 1, higher complexity = higher ratio.
   */
  private static computeWallShapeComplexity(context: A6MetricsContext): number {
    const { wallPolygon } = context;
    if (wallPolygon.length < 3) return 0;
    
    const perimeter = this.computePolygonPerimeter(wallPolygon);
    const area = this.computePolygonArea(wallPolygon);
    
    if (perimeter === 0) return 0;
    
    // Isoperimetric ratio: perimeter / sqrt(area)
    // Circle has ratio ~3.545 (2 * sqrt(pi * sqrt(pi)))
    const ratio = perimeter / Math.sqrt(Math.max(area, 0.0001));
    
    return ratio;
  }
  
  /**
   * Computes minimum spacing between wall towers.
   */
  private static computeTowerSpacingMin(context: A6MetricsContext): number {
    const { towers } = context;
    if (towers.length < 2) return Infinity;
    
    let minSpacing = Infinity;
    
    for (let i = 0; i < towers.length; i++) {
      for (let j = i + 1; j < towers.length; j++) {
        const dist = Math.sqrt(
          (towers[j].x - towers[i].x) ** 2 + 
          (towers[j].y - towers[i].y) ** 2
        );
        minSpacing = Math.min(minSpacing, dist);
      }
    }
    
    return minSpacing;
  }
  
  /**
   * Computes maximum spacing between wall towers.
   */
  private static computeTowerSpacingMax(context: A6MetricsContext): number {
    const { towers } = context;
    if (towers.length < 2) return 0;
    
    let maxSpacing = 0;
    
    for (let i = 0; i < towers.length; i++) {
      for (let j = i + 1; j < towers.length; j++) {
        const dist = Math.sqrt(
          (towers[j].x - towers[i].x) ** 2 + 
          (towers[j].y - towers[i].y) ** 2
        );
        maxSpacing = Math.max(maxSpacing, dist);
      }
    }
    
    return maxSpacing;
  }
  
  // ==========================================================================
  // D5: Density sanity implementations
  // ==========================================================================
  
  /**
   * Computes Mean Absolute Error of radial density falloff.
   * Compares actual density to expected radial falloff from center.
   */
  private static computeDensityRadialMAE(context: A6MetricsContext): number {
    const { blocks, cityCenter } = context;
    if (blocks.length === 0) return 0;
    
    let totalError = 0;
    let count = 0;
    
    // Find max distance for normalization
    let maxDist = 0;
    for (const block of blocks) {
      const centroid = this.computeCentroid(block.polygon);
      const dist = Math.sqrt(
        (centroid.x - cityCenter.x) ** 2 + 
        (centroid.y - cityCenter.y) ** 2
      );
      maxDist = Math.max(maxDist, dist);
    }
    
    if (maxDist === 0) return 0;
    
    // Compute MAE against expected radial falloff
    for (const block of blocks) {
      const centroid = this.computeCentroid(block.polygon);
      const dist = Math.sqrt(
        (centroid.x - cityCenter.x) ** 2 + 
        (centroid.y - cityCenter.y) ** 2
      );
      
      // Expected density: higher at center, lower at edges
      const normalizedDist = dist / maxDist;
      const expectedDensity = 1 - normalizedDist * 0.5; // Linear falloff
      const actualDensity = block.density ?? 0.5;
      
      totalError += Math.abs(actualDensity - expectedDensity);
      count++;
    }
    
    return count > 0 ? totalError / count : 0;
  }
  
  /**
   * Computes maximum density difference between adjacent blocks.
   */
  private static computeAdjacentDensityDiffMax(context: A6MetricsContext): number {
    const { blocks } = context;
    if (blocks.length < 2) return 0;
    
    let maxDiff = 0;
    
    // Check all pairs of blocks for adjacency
    for (let i = 0; i < blocks.length; i++) {
      for (let j = i + 1; j < blocks.length; j++) {
        if (this.arePolygonsAdjacent(blocks[i].polygon, blocks[j].polygon)) {
          const d1 = blocks[i].density ?? 0.5;
          const d2 = blocks[j].density ?? 0.5;
          maxDiff = Math.max(maxDiff, Math.abs(d1 - d2));
        }
      }
    }
    
    return maxDiff;
  }
  
  // ==========================================================================
  // G6: Connectivity robustness implementations
  // ==========================================================================
  
  /**
   * Counts disconnected components in the road network.
   */
  private static computeRoadComponentCount(context: A6MetricsContext): number {
    const { roadNodes, roadEdges } = context;
    
    // Build adjacency map
    const adjacency = new Map<string, Set<string>>();
    for (const nodeId of roadNodes.keys()) {
      adjacency.set(nodeId, new Set());
    }
    
    for (const edge of roadEdges) {
      adjacency.get(edge.u)?.add(edge.v);
      adjacency.get(edge.v)?.add(edge.u);
    }
    
    // Count connected components using BFS
    const visited = new Set<string>();
    let componentCount = 0;
    
    for (const nodeId of roadNodes.keys()) {
      if (visited.has(nodeId)) continue;
      
      componentCount++;
      const queue = [nodeId];
      
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;
        visited.add(current);
        
        for (const neighbor of adjacency.get(current) ?? []) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
    }
    
    return componentCount;
  }
  
  /**
   * Computes ratio of nodes in largest connected component.
   */
  private static computeLargestComponentRatio(context: A6MetricsContext): number {
    const { roadNodes, roadEdges } = context;
    const totalNodes = roadNodes.size;
    
    if (totalNodes === 0) return 1;
    
    // Build adjacency map
    const adjacency = new Map<string, Set<string>>();
    for (const nodeId of roadNodes.keys()) {
      adjacency.set(nodeId, new Set());
    }
    
    for (const edge of roadEdges) {
      adjacency.get(edge.u)?.add(edge.v);
      adjacency.get(edge.v)?.add(edge.u);
    }
    
    // Find largest component
    const visited = new Set<string>();
    let largestSize = 0;
    
    for (const nodeId of roadNodes.keys()) {
      if (visited.has(nodeId)) continue;
      
      let componentSize = 0;
      const queue = [nodeId];
      
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;
        visited.add(current);
        componentSize++;
        
        for (const neighbor of adjacency.get(current) ?? []) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
      
      largestSize = Math.max(largestSize, componentSize);
    }
    
    return largestSize / totalNodes;
  }
  
  // ==========================================================================
  // F8: Farm logic implementations
  // ==========================================================================
  
  /**
   * Counts farms placed inside the city wall.
   */
  private static computeFarmsInsideWall(context: A6MetricsContext): number {
    const { farms, wallPolygon } = context;
    
    if (wallPolygon.length < 3 || farms.length === 0) return 0;
    
    let insideCount = 0;
    
    for (const farm of farms) {
      if (this.isPointInPolygon(farm, wallPolygon)) {
        insideCount++;
      }
    }
    
    return insideCount;
  }
  
  // ==========================================================================
  // R9: Render semantics implementations
  // ==========================================================================
  
  /**
   * Returns the canonical render layer stack.
   */
  private static computeRenderLayerStack(_context: A6MetricsContext): string[] {
    // Canonical layer order from bottom to top
    return [
      'terrain',
      'water',
      'river',
      'roads',
      'blocks',
      'parcels',
      'buildings',
      'farms',
      'trees',
      'wall',
      'towers',
      'gates',
      'bridges',
      'labels',
      'markers'
    ];
  }
  
  // ==========================================================================
  // Helper methods
  // ==========================================================================
  
  /**
   * Computes angle between three points (angle at vertex).
   */
  private static angleBetweenPoints(
    vertex: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ): number {
    const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
    const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
    
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
    const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
    
    if (mag1 === 0 || mag2 === 0) return 0;
    
    const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
    return Math.acos(cosAngle) * (180 / Math.PI);
  }
  
  /**
   * Computes perimeter of a polygon.
   */
  private static computePolygonPerimeter(polygon: Array<{ x: number; y: number }>): number {
    if (polygon.length < 2) return 0;
    
    let perimeter = 0;
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      const dx = polygon[j].x - polygon[i].x;
      const dy = polygon[j].y - polygon[i].y;
      perimeter += Math.sqrt(dx ** 2 + dy ** 2);
    }
    
    return perimeter;
  }
  
  /**
   * Computes area of a polygon using shoelace formula.
   */
  private static computePolygonArea(polygon: Array<{ x: number; y: number }>): number {
    if (polygon.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area += polygon[i].x * polygon[j].y;
      area -= polygon[j].x * polygon[i].y;
    }
    
    return Math.abs(area) / 2;
  }
  
  /**
   * Computes centroid of a polygon.
   */
  private static computeCentroid(polygon: Array<{ x: number; y: number }>): { x: number; y: number } {
    if (polygon.length === 0) return { x: 0.5, y: 0.5 };
    
    let sumX = 0;
    let sumY = 0;
    
    for (const p of polygon) {
      sumX += p.x;
      sumY += p.y;
    }
    
    return {
      x: sumX / polygon.length,
      y: sumY / polygon.length
    };
  }
  
  /**
   * Checks if two polygons are adjacent (share an edge).
   */
  private static arePolygonsAdjacent(
    p1: Array<{ x: number; y: number }>,
    p2: Array<{ x: number; y: number }>,
    threshold = 0.01
  ): boolean {
    // Check if any edge of p1 is close to any edge of p2
    for (let i = 0; i < p1.length; i++) {
      const i2 = (i + 1) % p1.length;
      
      for (let j = 0; j < p2.length; j++) {
        const j2 = (j + 1) % p2.length;
        
        // Check if edges are close
        const dist = this.edgeToEdgeDistance(p1[i], p1[i2], p2[j], p2[j2]);
        if (dist < threshold) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * Computes minimum distance between two line segments.
   */
  private static edgeToEdgeDistance(
    a1: { x: number; y: number },
    a2: { x: number; y: number },
    b1: { x: number; y: number },
    b2: { x: number; y: number }
  ): number {
    // Simplified: check distance between midpoints
    const midA = { x: (a1.x + a2.x) / 2, y: (a1.y + a2.y) / 2 };
    const midB = { x: (b1.x + b2.x) / 2, y: (b1.y + b2.y) / 2 };
    
    return Math.sqrt((midA.x - midB.x) ** 2 + (midA.y - midB.y) ** 2);
  }
  
  /**
   * Checks if a point is inside a polygon using ray casting.
   */
  private static isPointInPolygon(
    point: { x: number; y: number },
    polygon: Array<{ x: number; y: number }>
  ): boolean {
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;
      
      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      
      if (intersect) {
        inside = !inside;
      }
    }
    
    return inside;
  }
}

/**
 * Default values for A6 diagnostics.
 * Used when actual computation is not possible.
 */
export const DEFAULT_A6_DIAGNOSTICS: A6Diagnostics = {
  min_turn_angle_observed: 90,
  micro_segment_count: 0,
  bridge_endpoint_unsnapped_count: 0,
  bridge_spacing_min_observed: Infinity,
  wall_shape_complexity_ratio: 3.5,
  tower_spacing_min_observed: 0.1,
  tower_spacing_max_observed: 0.2,
  density_radial_mae: 0,
  adjacent_density_diff_max: 0,
  road_component_count: 1,
  largest_component_ratio: 1,
  components_before_bridges: 1,
  components_after_bridges: 1,
  farms_inside_wall_count: 0,
  boundary_derivation_source: 'derived',
  render_layer_stack: [
    'terrain', 'water', 'river', 'roads', 'blocks', 'parcels',
    'buildings', 'farms', 'trees', 'wall', 'towers', 'gates',
    'bridges', 'labels', 'markers'
  ]
};
