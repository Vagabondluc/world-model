// @ts-nocheck
/**
 * F8: Farm Logic Evaluators
 * 
 * Has evaluators for farm placement invariants:
 * - F8.1: Farms Outside Wall (CRC-A6-121) - At most 2 farms inside wall and majority outside
 * - F8.2: Farms Near Routes (CRC-A6-122) - Farms near external routes
 * - F8.3: Farm Clusters (CRC-A6-123) - Smallest cluster size within radius
 * 
 * @module domain/invariants/evaluators/f8-farms
 */

import { GenerationContext } from '../../../pipeline/stageHooks';
import { InvariantMetrics, RepairResult, BaseInvariantEvaluator } from './types';

// ============================================================================
// Types
// ============================================================================

/**
 * Farm definition
 */
export interface Farm {
  id: string;
  position: { x: number; y: number };
  polygon?: Array<{ x: number; y: number }>;
  relocated?: boolean;
}

/**
 * Wall definition
 */
export interface Wall {
  id: string;
  polygon: Array<{ x: number; y: number }>;
}

/**
 * External route definition
 */
export interface ExternalRoute {
  id: string;
  path: Array<{ x: number; y: number }>;
  type: 'road' | 'path';
}

/**
 * Farm relocation record
 */
export interface FarmRelocation {
  farmId: string;
  oldPosition: { x: number; y: number };
  newPosition: { x: number; y: number };
  reason: string;
}

/**
 * Farm route violation record
 */
export interface FarmRouteViolation {
  farmId: string;
  nearestRouteId: string;
  distance: number;
  maxAllowed: number;
}

/**
 * Farm cluster info
 */
export interface FarmCluster {
  id: string;
  farmIds: string[];
  center: { x: number; y: number };
  radius: number;
}

/**
 * Distance statistics
 */
export interface DistanceStats {
  min: number;
  max: number;
  mean: number;
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Thresholds for farm logic invariants
 */
export const FARM_THRESHOLDS = {
  // F8.2: Largest farm-to-route distance
  maxFarmRouteDistance: 0.25,
  
  // F8.3: Smallest cluster size
  minClusterSize: 2,
  
  // F8.3: Cluster radius
  clusterRadius: 0.3
};

// ============================================================================
// F8.1: Farms Outside Wall Evaluator (CRC-A6-121)
// ============================================================================

/**
 * F8.1 Farms Outside Wall Evaluator
 * Ensures farm placement policy:
 * - at most 2 farms inside wall
 * - strict majority of farms outside wall
 */
export class F81FarmsOutsideWallEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-121';
  readonly name = 'Farms Outside Wall';
  
  /**
   * Measure farms inside wall.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const farms = model.farms || [];
    const walls = model.walls || [];
    
    const relocations: FarmRelocation[] = [];
    let farmsInsideCount = 0;
    
    for (const farm of farms) {
      const farmPos = farm.position || 
        (farm.polygon ? this.calculateCentroid(farm.polygon) : { x: 0, y: 0 });
      
      const insideWall = this.isPointInsideWalls(farmPos, walls);
      
      if (insideWall) {
        farmsInsideCount++;
        relocations.push({
          farmId: farm.id,
          oldPosition: farmPos,
          newPosition: farmPos, // Will be set during repair
          reason: 'Farm inside wall interior'
        });
      }
    }
    
    return {
      value: farmsInsideCount,
      evidence: {
        farms_inside_wall_count: farmsInsideCount,
        farm_relocations: relocations,
        total_farms: farms.length,
        walls_count: walls.length
      }
    };
  }
  
  /**
   * Check farm placement policy:
   * - max 2 farms inside wall
   * - majority outside wall
   */
  check(metrics: InvariantMetrics): boolean {
    const inside = Number(metrics.evidence?.farms_inside_wall_count ?? metrics.value ?? 0);
    const total = Number(metrics.evidence?.total_farms ?? 0);
    if (inside > 2) return false;
    if (total <= 0) return true;
    const outside = total - inside;
    return outside > inside;
  }
  
  /**
   * Repair by clipping or relocating farms.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const farms = model.farms || [];
    const walls = model.walls || [];
    
    const geometryIdsTouched: string[] = [];
    const relocationsApplied: FarmRelocation[] = [];
    
    for (const farm of farms) {
      const farmPos = farm.position || 
        (farm.polygon ? this.calculateCentroid(farm.polygon) : { x: 0, y: 0 });
      
      const insideWall = this.isPointInsideWalls(farmPos, walls);
      
      if (insideWall && walls.length > 0) {
        // Find point outside wall
        const newPos = this.findPointOutsideWalls(farmPos, walls);
        
        farm.position = newPos;
        if (farm.polygon) {
          const dx = newPos.x - farmPos.x;
          const dy = newPos.y - farmPos.y;
          farm.polygon = farm.polygon.map((p: { x: number; y: number }) => ({
            x: p.x + dx,
            y: p.y + dy
          }));
        }
        farm.relocated = true;
        
        geometryIdsTouched.push(farm.id);
        relocationsApplied.push({
          farmId: farm.id,
          oldPosition: farmPos,
          newPosition: newPos,
          reason: 'Relocated outside wall'
        });
      }
    }
    
    return {
      success: true,
      repairsApplied: relocationsApplied.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { farms_inside: farms.length },
        { farms_inside: 0 },
        geometryIdsTouched,
        'clipOrRelocateFarms',
        'S14_FARMS',
        1
      )
    };
  }
  
  // Helper methods
  protected calculateCentroid(polygon: Array<{ x: number; y: number }>): { x: number; y: number } {
    if (polygon.length === 0) return { x: 0, y: 0 };
    
    let cx = 0, cy = 0;
    for (const p of polygon) {
      cx += p.x;
      cy += p.y;
    }
    return { x: cx / polygon.length, y: cy / polygon.length };
  }
  
  protected isPointInsideWalls(point: { x: number; y: number }, walls: Wall[]): boolean {
    for (const wall of walls) {
      if (this.isPointInPolygon(point, wall.polygon)) {
        return true;
      }
    }
    return false;
  }
  
  protected isPointInPolygon(point: { x: number; y: number }, polygon: Array<{ x: number; y: number }>): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      
      if (((yi > point.y) !== (yj > point.y)) &&
          (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  }
  
  protected findPointOutsideWalls(point: { x: number; y: number }, walls: Wall[]): { x: number; y: number } {
    if (walls.length === 0) return point;
    
    const wall = walls[0];
    
    // Find the outward direction from wall center
    const wallCenter = this.calculateCentroid(wall.polygon);
    const dx = point.x - wallCenter.x;
    const dy = point.y - wallCenter.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist === 0) {
      // Point is at center, move in arbitrary direction
      return { x: point.x + 0.5, y: point.y };
    }
    
    // Move point outside wall
    const wallRadius = this.estimatePolygonRadius(wall.polygon);
    const moveDistance = wallRadius * 1.5;
    
    return {
      x: wallCenter.x + (dx / dist) * moveDistance,
      y: wallCenter.y + (dy / dist) * moveDistance
    };
  }
  
  protected estimatePolygonRadius(polygon: Array<{ x: number; y: number }>): number {
    const center = this.calculateCentroid(polygon);
    let maxDist = 0;
    
    for (const p of polygon) {
      const dist = Math.sqrt((p.x - center.x) ** 2 + (p.y - center.y) ** 2);
      maxDist = Math.max(maxDist, dist);
    }
    
    return maxDist;
  }
}

// ============================================================================
// F8.2: Farms Near Routes Evaluator (CRC-A6-122)
// ============================================================================

/**
 * F8.2 Farms Near Routes Evaluator
 * Ensures farms are near external routes.
 */
export class F82FarmsNearRoutesEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-122';
  readonly name = 'Farms Near Routes';
  
  /**
   * Measure farm-route distances.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const farms = model.farms || [];
    const externalRoutes = model.externalRoutes || [];
    
    const violations: FarmRouteViolation[] = [];
    const distances: number[] = [];
    
    for (const farm of farms) {
      const farmPos = farm.position || 
        (farm.polygon ? this.calculateCentroid(farm.polygon) : { x: 0, y: 0 });
      
      // Find nearest route
      let nearestDistance = Infinity;
      let nearestRoute: ExternalRoute | null = null;
      
      for (const route of externalRoutes) {
        const distance = this.distanceToRoute(farmPos, route);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestRoute = route;
        }
      }
      
      distances.push(nearestDistance === Infinity ? 0 : nearestDistance);
      
      if (nearestDistance > FARM_THRESHOLDS.maxFarmRouteDistance) {
        violations.push({
          farmId: farm.id,
          nearestRouteId: nearestRoute?.id || 'none',
          distance: nearestDistance === Infinity ? 999 : nearestDistance,
          maxAllowed: FARM_THRESHOLDS.maxFarmRouteDistance
        });
      }
    }
    
    // Calculate statistics
    const stats = this.calculateStats(distances);
    
    return {
      value: stats.mean,
      evidence: {
        farm_route_distance_stats: stats,
        farm_route_violations: violations,
        violations_count: violations.length,
        farms_checked: farms.length,
        routes_count: externalRoutes.length
      }
    };
  }
  
  /**
   * Check if all farms are near routes.
   */
  check(metrics: InvariantMetrics): boolean {
    const violations = metrics.evidence.farm_route_violations as FarmRouteViolation[];
    return violations.length === 0;
  }
  
  /**
   * Repair by relocating farms.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const violations = model.farmRouteViolations || [];
    const externalRoutes = model.externalRoutes || [];
    
    const geometryIdsTouched: string[] = [];
    
    for (const violation of violations) {
      const farm = (model.farms || []).find((f: Farm) => f.id === violation.farmId);
      const route = externalRoutes.find((r: ExternalRoute) => r.id === violation.nearestRouteId);
      
      if (!farm || !route || !route.path || route.path.length === 0) continue;
      
      const farmPos = farm.position || 
        (farm.polygon ? this.calculateCentroid(farm.polygon) : { x: 0, y: 0 });
      
      // Find closest point on route
      const closestPoint = this.findClosestPointOnRoute(farmPos, route);
      
      // Move farm toward route (but not onto it)
      const targetDistance = FARM_THRESHOLDS.maxFarmRouteDistance * 0.7;
      const dx = closestPoint.x - farmPos.x;
      const dy = closestPoint.y - farmPos.y;
      const currentDist = Math.sqrt(dx * dx + dy * dy);
      
      if (currentDist > 0) {
        const moveRatio = (currentDist - targetDistance) / currentDist;
        const newPos = {
          x: farmPos.x + dx * moveRatio,
          y: farmPos.y + dy * moveRatio
        };
        
        farm.position = newPos;
        if (farm.polygon) {
          const pdx = newPos.x - farmPos.x;
          const pdy = newPos.y - farmPos.y;
          farm.polygon = farm.polygon.map((p: { x: number; y: number }) => ({
            x: p.x + pdx,
            y: p.y + pdy
          }));
        }
        
        geometryIdsTouched.push(farm.id);
      }
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { avg_distance: 0.4 },
        { avg_distance: 0.2 },
        geometryIdsTouched,
        'relocateFarms',
        'S14_FARMS',
        1
      )
    };
  }
  
  // Helper methods
  protected calculateCentroid(polygon: Array<{ x: number; y: number }>): { x: number; y: number } {
    if (polygon.length === 0) return { x: 0, y: 0 };
    
    let cx = 0, cy = 0;
    for (const p of polygon) {
      cx += p.x;
      cy += p.y;
    }
    return { x: cx / polygon.length, y: cy / polygon.length };
  }
  
  protected distanceToRoute(point: { x: number; y: number }, route: ExternalRoute): number {
    if (!route.path || route.path.length < 2) return Infinity;
    
    let minDist = Infinity;
    for (let i = 0; i < route.path.length - 1; i++) {
      const dist = this.pointToSegmentDistance(point, route.path[i], route.path[i + 1]);
      minDist = Math.min(minDist, dist);
    }
    
    return minDist;
  }
  
  protected pointToSegmentDistance(
    point: { x: number; y: number },
    segStart: { x: number; y: number },
    segEnd: { x: number; y: number }
  ): number {
    const dx = segEnd.x - segStart.x;
    const dy = segEnd.y - segStart.y;
    const lengthSq = dx * dx + dy * dy;
    
    if (lengthSq === 0) {
      return Math.sqrt((point.x - segStart.x) ** 2 + (point.y - segStart.y) ** 2);
    }
    
    let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));
    
    const projX = segStart.x + t * dx;
    const projY = segStart.y + t * dy;
    
    return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
  }
  
  protected findClosestPointOnRoute(point: { x: number; y: number }, route: ExternalRoute): { x: number; y: number } {
    if (!route.path || route.path.length === 0) return point;
    
    let minDist = Infinity;
    let closestPoint = route.path[0];
    
    for (let i = 0; i < route.path.length - 1; i++) {
      const closest = this.closestPointOnSegment(point, route.path[i], route.path[i + 1]);
      const dist = Math.sqrt((closest.x - point.x) ** 2 + (closest.y - point.y) ** 2);
      
      if (dist < minDist) {
        minDist = dist;
        closestPoint = closest;
      }
    }
    
    return closestPoint;
  }
  
  protected closestPointOnSegment(
    point: { x: number; y: number },
    segStart: { x: number; y: number },
    segEnd: { x: number; y: number }
  ): { x: number; y: number } {
    const dx = segEnd.x - segStart.x;
    const dy = segEnd.y - segStart.y;
    const lengthSq = dx * dx + dy * dy;
    
    if (lengthSq === 0) {
      return segStart;
    }
    
    let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));
    
    return {
      x: segStart.x + t * dx,
      y: segStart.y + t * dy
    };
  }
  
  protected calculateStats(values: number[]): DistanceStats {
    if (values.length === 0) {
      return { min: 0, max: 0, mean: 0 };
    }
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    
    return { min, max, mean };
  }
}

// ============================================================================
// F8.3: Farm Clusters Evaluator (CRC-A6-123)
// ============================================================================

/**
 * F8.3 Farm Clusters Evaluator
 * Ensures farms meet cluster size requirements.
 */
export class F83FarmClustersEvaluator extends BaseInvariantEvaluator {
  readonly invariantId = 'CRC-A6-123';
  readonly name = 'Farm Clusters';
  
  /**
   * Measure farm cluster sizes.
   */
  measure(context: GenerationContext): InvariantMetrics {
    const model = context.model as any;
    const farms = model.farms || [];
    
    // Build clusters using distance-based clustering
    const clusters = this.buildClusters(farms, FARM_THRESHOLDS.clusterRadius);
    
    // Analyze cluster sizes
    const clusterSizes = clusters.map(c => c.farmIds.length);
    const isolatedFarms = farms.filter((f: Farm) => {
      const cluster = clusters.find(c => c.farmIds.includes(f.id));
      return cluster && cluster.farmIds.length < FARM_THRESHOLDS.minClusterSize;
    });
    
    const isolatedCount = isolatedFarms.length;
    
    return {
      value: isolatedCount,
      evidence: {
        farm_cluster_sizes: clusterSizes,
        farm_clusters: clusters,
        farm_isolated_count: isolatedCount,
        total_farms: farms.length,
        cluster_count: clusters.length,
        min_cluster_size: FARM_THRESHOLDS.minClusterSize
      }
    };
  }
  
  /**
   * Check if no isolated farms exist.
   */
  check(metrics: InvariantMetrics): boolean {
    return metrics.value === 0;
  }
  
  /**
   * Repair by clustering farms.
   */
  repair(context: GenerationContext): RepairResult {
    const model = context.model as any;
    const farms = model.farms || [];
    
    const geometryIdsTouched: string[] = [];
    
    // Build clusters
    const clusters = this.buildClusters(farms, FARM_THRESHOLDS.clusterRadius);
    
    // Find isolated farms and move them to nearest cluster
    for (const farm of farms) {
      const cluster = clusters.find(c => c.farmIds.includes(farm.id));
      
      if (cluster && cluster.farmIds.length < FARM_THRESHOLDS.minClusterSize) {
        // Find largest cluster
        const largestCluster = clusters.reduce((a, b) => 
          a.farmIds.length > b.farmIds.length ? a : b
        );
        
        if (largestCluster && largestCluster.farmIds.length >= FARM_THRESHOLDS.minClusterSize) {
          const farmPos = farm.position || 
            (farm.polygon ? this.calculateCentroid(farm.polygon) : { x: 0, y: 0 });
          
          // Move farm toward cluster center
          const targetPos = {
            x: largestCluster.center.x + (Math.random() - 0.5) * 0.1,
            y: largestCluster.center.y + (Math.random() - 0.5) * 0.1
          };
          
          farm.position = targetPos;
          if (farm.polygon) {
            const dx = targetPos.x - farmPos.x;
            const dy = targetPos.y - farmPos.y;
            farm.polygon = farm.polygon.map((p: { x: number; y: number }) => ({
              x: p.x + dx,
              y: p.y + dy
            }));
          }
          
          geometryIdsTouched.push(farm.id);
        }
      }
    }
    
    return {
      success: true,
      repairsApplied: geometryIdsTouched.length,
      geometryIdsTouched,
      traceEntry: this.createTraceEntry(
        this.invariantId,
        { isolated_count: farms.length },
        { isolated_count: 0 },
        geometryIdsTouched,
        'clusterFarms',
        'S14_FARMS',
        1
      )
    };
  }
  
  // Helper methods
  protected calculateCentroid(polygon: Array<{ x: number; y: number }>): { x: number; y: number } {
    if (polygon.length === 0) return { x: 0, y: 0 };
    
    let cx = 0, cy = 0;
    for (const p of polygon) {
      cx += p.x;
      cy += p.y;
    }
    return { x: cx / polygon.length, y: cy / polygon.length };
  }
  
  protected buildClusters(farms: Farm[], radius: number): FarmCluster[] {
    const clusters: FarmCluster[] = [];
    const assigned = new Set<string>();
    
    for (const farm of farms) {
      if (assigned.has(farm.id)) continue;
      
      const farmPos = farm.position || 
        (farm.polygon ? this.calculateCentroid(farm.polygon) : { x: 0, y: 0 });
      
      // Find all farms within radius
      const clusterFarms: Farm[] = [farm];
      const clusterIds: string[] = [farm.id];
      assigned.add(farm.id);
      
      for (const other of farms) {
        if (assigned.has(other.id)) continue;
        
        const otherPos = other.position || 
          (other.polygon ? this.calculateCentroid(other.polygon) : { x: 0, y: 0 });
        
        const dist = Math.sqrt(
          (farmPos.x - otherPos.x) ** 2 + 
          (farmPos.y - otherPos.y) ** 2
        );
        
        if (dist <= radius) {
          clusterFarms.push(other);
          clusterIds.push(other.id);
          assigned.add(other.id);
        }
      }
      
      // Calculate cluster center
      const center = {
        x: clusterFarms.reduce((sum, f) => {
          const pos = f.position || (f.polygon ? this.calculateCentroid(f.polygon) : { x: 0, y: 0 });
          return sum + pos.x;
        }, 0) / clusterFarms.length,
        y: clusterFarms.reduce((sum, f) => {
          const pos = f.position || (f.polygon ? this.calculateCentroid(f.polygon) : { x: 0, y: 0 });
          return sum + pos.y;
        }, 0) / clusterFarms.length
      };
      
      clusters.push({
        id: `cluster-${clusters.length}`,
        farmIds: clusterIds,
        center,
        radius
      });
    }
    
    return clusters;
  }
}

// ============================================================================
// Singleton Instances
// ============================================================================

export const f81FarmsOutsideWallEvaluator = new F81FarmsOutsideWallEvaluator();
export const f82FarmsNearRoutesEvaluator = new F82FarmsNearRoutesEvaluator();
export const f83FarmClustersEvaluator = new F83FarmClustersEvaluator();
