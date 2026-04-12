// @ts-nocheck
import { Point, dist } from '../types';

/**
 * Configuration for farmland egress analysis
 */
export interface FarmlandEgressConfig {
  minFarmlandEgressFraction: number;   // Minimum fraction of farms aligned with egress (default: 0.6)
  gateVectorRadius: number;            // Radius around gates for alignment check
  egressCorridorWidth: number;         // Width of road egress corridors
  maxDisconnectThreshold: number;      // Maximum distance for cluster connectivity
  maxRandomScatterScore: number;       // Maximum allowed random scatter score
}

/**
 * Farm structure for analysis
 */
export interface FarmForAnalysis {
  id: string;
  centroid: Point;
}

/**
 * Gate structure for analysis
 */
export interface GateForAnalysis {
  id: string;
  position: Point;
}

/**
 * Road structure for analysis
 */
export interface RoadForAnalysis {
  id: string;
  points: Point[];
}

/**
 * Farmland cluster
 */
export interface FarmlandCluster {
  farms: FarmForAnalysis[];
  center: Point;
  hasAccess: boolean;
}

/**
 * Access point cluster
 */
export interface AccessPointCluster {
  gateId: string;
  center: Point;
  farms: FarmForAnalysis[];
  farmCount: number;
}

/**
 * Distribution pattern analysis result
 */
export interface DistributionPattern {
  isAccessLinked: boolean;
  randomScatterScore: number;
  clusteringCoefficient: number;
}

/**
 * Result of farmland egress validation
 */
export interface FarmlandEgressResult {
  isValid: boolean;
  alignedFraction: number;
  disconnectedClusters: number;
  isAccessLinked: boolean;
  randomScatterScore: number;
  violations: string[];
}

/**
 * Identifies farms outside the wall boundary.
 */
export function getExteriorFarms(
  farms: FarmForAnalysis[],
  wallPolygon: Point[]
): FarmForAnalysis[] {
  return farms.filter(farm => !isPointInPolygon(farm.centroid, wallPolygon));
}

/**
 * Checks if a point is inside a polygon.
 */
function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  const n = polygon.length;
  
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    if (((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  
  return inside;
}

/**
 * Checks if a farm centroid is near a gate vector.
 */
export function isNearGateVector(
  centroid: Point,
  gates: GateForAnalysis[],
  radius: number
): boolean {
  for (const gate of gates) {
    if (dist(centroid, gate.position) <= radius) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a farm centroid is near a road egress corridor.
 */
export function isNearRoadEgress(
  centroid: Point,
  roads: RoadForAnalysis[],
  corridorWidth: number
): boolean {
  for (const road of roads) {
    for (let i = 0; i < road.points.length - 1; i++) {
      const d = distanceToSegment(centroid, road.points[i], road.points[i + 1]);
      if (d <= corridorWidth / 2) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Computes distance from point to line segment.
 */
function distanceToSegment(point: Point, start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lenSq = dx * dx + dy * dy;
  
  if (lenSq === 0) return dist(point, start);
  
  const t = Math.max(0, Math.min(1,
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / lenSq
  ));
  
  const projection = {
    x: start.x + t * dx,
    y: start.y + t * dy
  };
  
  return dist(point, projection);
}

/**
 * Identifies clusters of nearby farms.
 */
export function identifyFarmlandClusters(
  farms: FarmForAnalysis[],
  clusterDistance: number
): FarmlandCluster[] {
  const clusters: FarmlandCluster[] = [];
  const assigned = new Set<string>();
  
  for (const farm of farms) {
    if (assigned.has(farm.id)) continue;
    
    // Start a new cluster
    const clusterFarms: FarmForAnalysis[] = [farm];
    assigned.add(farm.id);
    
    // Find all farms within cluster distance
    let changed = true;
    while (changed) {
      changed = false;
      for (const other of farms) {
        if (assigned.has(other.id)) continue;
        
        for (const clusterFarm of clusterFarms) {
          if (dist(other.centroid, clusterFarm.centroid) <= clusterDistance) {
            clusterFarms.push(other);
            assigned.add(other.id);
            changed = true;
            break;
          }
        }
      }
    }
    
    // Compute cluster center
    const center = {
      x: clusterFarms.reduce((sum, f) => sum + f.centroid.x, 0) / clusterFarms.length,
      y: clusterFarms.reduce((sum, f) => sum + f.centroid.y, 0) / clusterFarms.length
    };
    
    clusters.push({
      farms: clusterFarms,
      center,
      hasAccess: false
    });
  }
  
  return clusters;
}

/**
 * Checks if a cluster has exit access.
 */
export function hasExitAccess(
  cluster: FarmlandCluster,
  gates: GateForAnalysis[],
  roads: RoadForAnalysis[],
  maxDisconnect: number
): boolean {
  for (const farm of cluster.farms) {
    // Check gate access
    for (const gate of gates) {
      if (dist(farm.centroid, gate.position) <= maxDisconnect) {
        return true;
      }
    }
    
    // Check road access
    for (const road of roads) {
      for (let i = 0; i < road.points.length - 1; i++) {
        const d = distanceToSegment(farm.centroid, road.points[i], road.points[i + 1]);
        if (d <= maxDisconnect) {
          return true;
        }
      }
    }
  }
  
  return false;
}

/**
 * Analyzes the distribution pattern of farms.
 */
export function analyzeDistributionPattern(
  farms: FarmForAnalysis[],
  gates: GateForAnalysis[]
): DistributionPattern {
  if (farms.length === 0 || gates.length === 0) {
    return {
      isAccessLinked: true,
      randomScatterScore: 0,
      clusteringCoefficient: 0
    };
  }
  
  // Compute average distance to nearest gate
  let totalNearestGateDist = 0;
  for (const farm of farms) {
    let minDist = Infinity;
    for (const gate of gates) {
      minDist = Math.min(minDist, dist(farm.centroid, gate.position));
    }
    totalNearestGateDist += minDist;
  }
  const avgNearestGateDist = totalNearestGateDist / farms.length;
  
  // Compute expected random distance
  const farmCentroids = farms.map(f => f.centroid);
  const extent = computeExtent(farmCentroids);
  const expectedRandomDist = Math.sqrt(extent.width * extent.height) / 2;
  
  // Random scatter score is ratio of actual to expected
  const randomScatterScore = Math.min(1, avgNearestGateDist / expectedRandomDist);
  
  // Compute clustering coefficient
  const clusteringCoefficient = computeClusteringCoefficient(farms);
  
  // Access-linked if farms are closer to gates than random
  const isAccessLinked = randomScatterScore < 0.5 && clusteringCoefficient > 0.3;
  
  return {
    isAccessLinked,
    randomScatterScore,
    clusteringCoefficient
  };
}

/**
 * Computes the extent of a set of points.
 */
function computeExtent(points: Point[]): { width: number; height: number } {
  if (points.length === 0) return { width: 0, height: 0 };
  
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  
  return {
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Computes clustering coefficient for farms.
 */
function computeClusteringCoefficient(farms: FarmForAnalysis[]): number {
  if (farms.length < 3) return 0;
  
  const avgDistance = computeAverageNearestNeighborDistance(farms);
  const extent = computeExtent(farms.map(f => f.centroid));
  const area = extent.width * extent.height;
  
  // Expected average distance for random distribution
  const density = farms.length / area;
  const expectedDistance = 0.5 / Math.sqrt(density);
  
  // Clustering coefficient: lower ratio means more clustered
  return Math.max(0, 1 - avgDistance / expectedDistance);
}

/**
 * Computes average nearest neighbor distance.
 */
function computeAverageNearestNeighborDistance(farms: FarmForAnalysis[]): number {
  let totalDist = 0;
  
  for (const farm of farms) {
    let minDist = Infinity;
    for (const other of farms) {
      if (farm.id === other.id) continue;
      minDist = Math.min(minDist, dist(farm.centroid, other.centroid));
    }
    totalDist += minDist;
  }
  
  return totalDist / farms.length;
}

/**
 * Computes farm clusters around access points.
 */
export function computeAccessPointClusters(
  farms: FarmForAnalysis[],
  gates: GateForAnalysis[],
  radius: number
): AccessPointCluster[] {
  const clusters: AccessPointCluster[] = [];
  
  for (const gate of gates) {
    const nearbyFarms = farms.filter(
      f => dist(f.centroid, gate.position) <= radius
    );
    
    clusters.push({
      gateId: gate.id,
      center: gate.position,
      farms: nearbyFarms,
      farmCount: nearbyFarms.length
    });
  }
  
  return clusters;
}

/**
 * FarmlandEgressAnalyzer validates farmland egress alignment according to CRC-A3-005.
 * Ensures exterior farms align with gate vectors or road egress corridors.
 */
export class FarmlandEgressAnalyzer {
  private config: FarmlandEgressConfig;
  
  constructor(config?: Partial<FarmlandEgressConfig>) {
    this.config = {
      minFarmlandEgressFraction: config?.minFarmlandEgressFraction ?? 0.6,
      gateVectorRadius: config?.gateVectorRadius ?? 30,
      egressCorridorWidth: config?.egressCorridorWidth ?? 20,
      maxDisconnectThreshold: config?.maxDisconnectThreshold ?? 50,
      maxRandomScatterScore: config?.maxRandomScatterScore ?? 0.3
    };
  }
  
  /**
   * Validates farmland egress alignment.
   */
  validateFarmlandEgress(
    farms: FarmForAnalysis[],
    wallPolygon: Point[],
    gates: GateForAnalysis[],
    roads: RoadForAnalysis[]
  ): FarmlandEgressResult {
    const violations: string[] = [];
    
    // Get exterior farms
    const exteriorFarms = getExteriorFarms(farms, wallPolygon);
    
    if (exteriorFarms.length === 0) {
      return {
        isValid: true,
        alignedFraction: 1,
        disconnectedClusters: 0,
        isAccessLinked: true,
        randomScatterScore: 0,
        violations: []
      };
    }
    
    // Check alignment with gate vectors or road egress
    const alignedFarms = exteriorFarms.filter(farm =>
      isNearGateVector(farm.centroid, gates, this.config.gateVectorRadius) ||
      isNearRoadEgress(farm.centroid, roads, this.config.egressCorridorWidth)
    );
    
    const alignedFraction = alignedFarms.length / exteriorFarms.length;
    
    if (alignedFraction < this.config.minFarmlandEgressFraction) {
      violations.push(
        `Only ${(alignedFraction * 100).toFixed(1)}% of farms aligned with egress ` +
        `(minimum: ${(this.config.minFarmlandEgressFraction * 100)}%)`
      );
    }
    
    // Check for disconnected clusters
    const clusters = identifyFarmlandClusters(exteriorFarms, 50);
    let disconnectedClusters = 0;
    
    for (const cluster of clusters) {
      cluster.hasAccess = hasExitAccess(
        cluster, gates, roads, this.config.maxDisconnectThreshold
      );
      if (!cluster.hasAccess) {
        disconnectedClusters++;
      }
    }
    
    if (disconnectedClusters > 0) {
      violations.push(
        `Found ${disconnectedClusters} farmland cluster(s) disconnected from all exits`
      );
    }
    
    // Analyze distribution pattern
    const pattern = analyzeDistributionPattern(exteriorFarms, gates);
    
    if (pattern.randomScatterScore > this.config.maxRandomScatterScore) {
      violations.push(
        `Farm distribution appears random (scatter score: ${pattern.randomScatterScore.toFixed(2)})`
      );
    }
    
    return {
      isValid: violations.length === 0,
      alignedFraction,
      disconnectedClusters,
      isAccessLinked: pattern.isAccessLinked,
      randomScatterScore: pattern.randomScatterScore,
      violations
    };
  }
}
