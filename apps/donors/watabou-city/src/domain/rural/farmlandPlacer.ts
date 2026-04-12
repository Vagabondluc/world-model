// @ts-nocheck
/**
 * Farmland Placer - CRC-A4-022
 *
 * Clusters farmland near external roads, gates, and suitable terrain/water access.
 *
 * Acceptance Criteria:
 * - Farms cluster near external roads, gates, and suitable terrain/water access
 * - Access ratio (farms near features / total farms) >= farmAccessRatioThreshold
 * - Farmland placement considers terrain suitability and water proximity
 *
 * HARD CONSTRAINTS:
 * - farm ⊂ outside(wallOuterBuffer)
 * - farm ⊂ within(roadAccessBand)
 * - farm ∩ roadsBuffer == ∅
 */

import { Point, dist, isPointInPolygon, FarmPlacementConstraints, DEFAULT_FARM_CONSTRAINTS } from '../types';
import { PRNG } from '../seed/prng';
import { River, distanceToRiver } from '../terrain/river';
import { RoadGraph } from '../roads/graph';
import { ExternalRoad, ExternalRoute } from '../roads/externalRouteGenerator';

export interface Farm {
  id: string;
  polygon: Point[];
  centroid: Point;
  nearExternalRoad: boolean;
  nearGate: boolean;
  nearWater: boolean;
  terrainSuitability: number;
  /** Whether farm satisfies all hard constraints */
  constraintsSatisfied?: boolean;
  /** Distance to wall outer edge (for constraint validation) */
  wallDistance?: number;
  /** Distance to nearest road (for access band check) */
  roadAccessDistance?: number;
}

export interface Terrain {
  suitability: number[][];
  width: number;
  height: number;
}

export interface Water {
  points: Point[];
  polygon: Point[];
}

export interface FarmlandPlacerConfig {
  farmRoadDistance: number;
  farmGateDistance: number;
  farmWaterDistance: number;
  farmAccessRatioThreshold: number;
  minFarmArea: number;
  maxFarmArea: number;
}

export const DEFAULT_FARMLAND_CONFIG: FarmlandPlacerConfig = {
  farmRoadDistance: 0.15,
  farmGateDistance: 0.2,
  farmWaterDistance: 0.08,
  farmAccessRatioThreshold: 0.7,
  minFarmArea: 0.0001,
  maxFarmArea: 0.01
};

export class FarmlandPlacer {
  private config: FarmlandPlacerConfig;
  private rng: PRNG;
  
  constructor(rng: PRNG, config?: Partial<FarmlandPlacerConfig>) {
    this.rng = rng;
    this.config = { ...DEFAULT_FARMLAND_CONFIG, ...config };
  }
  
  /**
   * Places farmland considering external features, terrain, and water access.
   */
  placeFarmland(
    parcels: Point[][],
    externalRoads: ExternalRoad[],
    gates: Point[],
    terrain?: Terrain,
    water?: Water[],
    river?: River
  ): Farm[] {
    const farms: Farm[] = [];
    
    // Score parcels by access to features
    const scoredParcels = parcels.map((polygon, index) => {
      const centroid = this.calculateCentroid(polygon);
      const score = this.calculateAccessScore(centroid, externalRoads, gates, water, river);
      return { polygon, centroid, score, index };
    });
    
    // Sort by score (higher is better)
    scoredParcels.sort((a, b) => b.score - a.score);
    
    // Select parcels with good access
    const accessThreshold = 0.3;
    const selectedParcels = scoredParcels.filter(p => p.score >= accessThreshold);
    
    // Ensure we have some farms even with lower scores
    const minFarms = Math.max(1, Math.floor(parcels.length * 0.3));
    const farmsToPlace = Math.max(selectedParcels.length, minFarms);
    
    for (let i = 0; i < Math.min(farmsToPlace, scoredParcels.length); i++) {
      const parcel = scoredParcels[i];
      const farm = this.createFarm(parcel.polygon, parcel.centroid, externalRoads, gates, water, river, terrain);
      farms.push(farm);
    }
    
    return farms;
  }
  
  /**
   * Calculates the centroid of a polygon.
   */
  private calculateCentroid(polygon: Point[]): Point {
    let x = 0, y = 0;
    for (const p of polygon) {
      x += p.x;
      y += p.y;
    }
    return { x: x / polygon.length, y: y / polygon.length };
  }
  
  /**
   * Calculates an access score for a point based on proximity to features.
   */
  private calculateAccessScore(
    point: Point,
    externalRoads: ExternalRoad[],
    gates: Point[],
    water?: Water[],
    river?: River
  ): number {
    let score = 0;
    
    // Score for external road proximity
    const roadDist = this.nearestExternalRoadDistance(point, externalRoads);
    if (roadDist < this.config.farmRoadDistance) {
      score += 0.4 * (1 - roadDist / this.config.farmRoadDistance);
    }
    
    // Score for gate proximity
    const gateDist = this.nearestGateDistance(point, gates);
    if (gateDist < this.config.farmGateDistance) {
      score += 0.3 * (1 - gateDist / this.config.farmGateDistance);
    }
    
    // Score for water proximity
    const waterDist = this.nearestWaterDistance(point, water, river);
    if (waterDist < this.config.farmWaterDistance) {
      score += 0.3 * (1 - waterDist / this.config.farmWaterDistance);
    }
    
    return score;
  }
  
  /**
   * Calculates distance to nearest external road.
   */
  private nearestExternalRoadDistance(point: Point, externalRoads: ExternalRoad[]): number {
    let minDist = Infinity;
    
    for (const road of externalRoads) {
      for (const route of road.routes) {
        for (const pathPoint of route.path) {
          const d = dist(point, pathPoint);
          minDist = Math.min(minDist, d);
        }
      }
      
      // Also check the road's main path
      for (const pathPoint of road.path) {
        const d = dist(point, pathPoint);
        minDist = Math.min(minDist, d);
      }
    }
    
    return minDist;
  }
  
  /**
   * Calculates distance to nearest gate.
   */
  private nearestGateDistance(point: Point, gates: Point[]): number {
    let minDist = Infinity;
    for (const gate of gates) {
      const d = dist(point, gate);
      minDist = Math.min(minDist, d);
    }
    return minDist;
  }
  
  /**
   * Calculates distance to nearest water feature.
   */
  private nearestWaterDistance(point: Point, water?: Water[], river?: River): number {
    let minDist = Infinity;
    
    if (water) {
      for (const w of water) {
        for (const p of w.points) {
          const d = dist(point, p);
          minDist = Math.min(minDist, d);
        }
      }
    }
    
    if (river) {
      const riverDist = distanceToRiver(point, river);
      minDist = Math.min(minDist, riverDist);
    }
    
    return minDist;
  }
  
  /**
   * Creates a farm from a parcel.
   */
  private createFarm(
    polygon: Point[],
    centroid: Point,
    externalRoads: ExternalRoad[],
    gates: Point[],
    water?: Water[],
    river?: River,
    terrain?: Terrain
  ): Farm {
    const roadDist = this.nearestExternalRoadDistance(centroid, externalRoads);
    const gateDist = this.nearestGateDistance(centroid, gates);
    const waterDist = this.nearestWaterDistance(centroid, water, river);
    
    return {
      id: `farm-${this.rng.nextInt(0, 100000)}`,
      polygon,
      centroid,
      nearExternalRoad: roadDist < this.config.farmRoadDistance,
      nearGate: gateDist < this.config.farmGateDistance,
      nearWater: waterDist < this.config.farmWaterDistance,
      terrainSuitability: terrain ? this.getTerrainSuitability(centroid, terrain) : 0.5
    };
  }
  
  /**
   * Gets terrain suitability at a point.
   */
  private getTerrainSuitability(point: Point, terrain: Terrain): number {
    const x = Math.floor(point.x * terrain.width);
    const y = Math.floor(point.y * terrain.height);
    
    if (x >= 0 && x < terrain.width && y >= 0 && y < terrain.height) {
      return terrain.suitability[y][x];
    }
    
    return 0;
  }
}

/**
 * Checks if a farm is near external features.
 */
export function isNearExternalFeatures(
  farm: Farm,
  externalRoads: ExternalRoad[],
  gates: Point[],
  distance: number
): boolean {
  // Check road proximity
  for (const road of externalRoads) {
    for (const route of road.routes) {
      for (const pathPoint of route.path) {
        if (dist(farm.centroid, pathPoint) < distance) {
          return true;
        }
      }
    }
  }
  
  // Check gate proximity
  for (const gate of gates) {
    if (dist(farm.centroid, gate) < distance) {
      return true;
    }
  }
  
  return false;
}

/**
 * Calculates the farm access ratio.
 */
export function calculateFarmAccessRatio(
  farms: Farm[],
  externalRoads: ExternalRoad[],
  gates: Point[],
  distance: number
): number {
  if (farms.length === 0) return 0;
  
  const farmsNearFeatures = farms.filter(farm => 
    isNearExternalFeatures(farm, externalRoads, gates, distance)
  );
  
  return farmsNearFeatures.length / farms.length;
}

/**
 * Analyzes terrain suitability for farming.
 */
export function analyzeTerrainSuitability(terrain: Terrain, point: Point): number {
  const x = Math.floor(point.x * terrain.width);
  const y = Math.floor(point.y * terrain.height);
  
  if (x >= 0 && x < terrain.width && y >= 0 && y < terrain.height) {
    return terrain.suitability[y][x];
  }
  
  return 0;
}

/**
 * Analyzes water proximity for a point.
 */
export function analyzeWaterProximity(point: Point, water?: Water[], river?: River): number {
  let minDist = Infinity;
  
  if (water) {
    for (const w of water) {
      for (const p of w.points) {
        const d = dist(point, p);
        minDist = Math.min(minDist, d);
      }
    }
  }
  
  if (river) {
    const riverDist = distanceToRiver(point, river);
    minDist = Math.min(minDist, riverDist);
  }
  
  return minDist === Infinity ? 1 : minDist;
}

/**
 * Generates a test city with external features for farmland placement.
 */
export function generateCityWithExternalFeatures(): any {
  const parcels: Point[][] = [
    [{ x: 0.1, y: 0.1 }, { x: 0.15, y: 0.1 }, { x: 0.15, y: 0.15 }, { x: 0.1, y: 0.15 }],
    [{ x: 0.2, y: 0.1 }, { x: 0.25, y: 0.1 }, { x: 0.25, y: 0.15 }, { x: 0.2, y: 0.15 }],
    [{ x: 0.1, y: 0.2 }, { x: 0.15, y: 0.2 }, { x: 0.15, y: 0.25 }, { x: 0.1, y: 0.25 }],
    [{ x: 0.3, y: 0.3 }, { x: 0.35, y: 0.3 }, { x: 0.35, y: 0.35 }, { x: 0.3, y: 0.35 }],
    [{ x: 0.4, y: 0.4 }, { x: 0.45, y: 0.4 }, { x: 0.45, y: 0.45 }, { x: 0.4, y: 0.45 }],
  ];
  
  const gates: Point[] = [
    { x: 0, y: 0.5 },
    { x: 1, y: 0.5 },
  ];
  
  const externalRoads: ExternalRoad[] = [
    {
      id: 'ext-1',
      routes: [{
        id: 'route-1',
        gateId: 'gate-1',
        path: [{ x: 0, y: 0.5 }, { x: -0.1, y: 0.5 }, { x: -0.2, y: 0.5 }],
        length: 0.2,
        connectedToNetwork: true
      }],
      path: [{ x: 0, y: 0.5 }, { x: -0.1, y: 0.5 }, { x: -0.2, y: 0.5 }]
    }
  ];
  
  const terrain: Terrain = {
    suitability: Array(10).fill(null).map(() => Array(10).fill(0.8)),
    width: 10,
    height: 10
  };
  
  const water: Water[] = [
    {
      points: [{ x: 0.5, y: 0.5 }, { x: 0.51, y: 0.51 }],
      polygon: [{ x: 0.5, y: 0.5 }, { x: 0.51, y: 0.5 }, { x: 0.51, y: 0.51 }, { x: 0.5, y: 0.51 }]
    }
  ];
  
  const rng = new PRNG(12345);
  const placer = new FarmlandPlacer(rng);
  const farms = placer.placeFarmland(parcels, externalRoads, gates, terrain, water);
  
  return {
    farms,
    externalRoads,
    gates,
    terrain,
    water,
    config: {
      farmRoadDistance: 0.15,
      farmGateDistance: 0.2,
      farmAccessRatioThreshold: 0.7
    }
  };
}

/**
 * Places farmland on a city (wrapper function).
 */
export function placeFarmland(city: any): Farm[] {
  const rng = new PRNG(city.seed || 12345);
  const placer = new FarmlandPlacer(rng, city.config);
  
  return placer.placeFarmland(
    city.parcels || [],
    city.externalRoads || [],
    city.gates || [],
    city.terrain,
    city.water,
    city.river
  );
}

/**
 * Validates farm placement against hard constraints.
 * HARD CONSTRAINTS:
 * - farm ⊂ outside(wallOuterBuffer)
 * - farm ⊂ within(roadAccessBand)
 * - farm ∩ roadsBuffer == ∅
 */
export function validateFarmConstraints(
  farm: Farm,
  wallPolygon: Point[],
  roadGraph: RoadGraph,
  constraints: FarmPlacementConstraints = DEFAULT_FARM_CONSTRAINTS
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  // Check if farm is outside wall
  if (constraints.mustBeOutsideWall && wallPolygon.length >= 3) {
    const centroidInside = isPointInPolygon(farm.centroid, wallPolygon);
    if (centroidInside) {
      violations.push('Farm centroid is inside wall boundary');
    }
    
    // Check all polygon vertices
    const anyVertexInside = farm.polygon.some(p => isPointInPolygon(p, wallPolygon));
    if (anyVertexInside) {
      violations.push('Farm polygon overlaps wall boundary');
    }
  }
  
  // Check road access band (farm must be within access distance of a road)
  if (constraints.maxRoadDistance < Infinity) {
    let minRoadDist = Infinity;
    for (const node of roadGraph.nodes.values()) {
      const d = dist(farm.centroid, node.point);
      minRoadDist = Math.min(minRoadDist, d);
    }
    
    if (minRoadDist > constraints.maxRoadDistance) {
      violations.push(`Farm is too far from road access (${minRoadDist.toFixed(3)} > ${constraints.maxRoadDistance})`);
    }
  }
  
  // Check road buffer (farm must not overlap roads)
  if (constraints.minRoadBuffer > 0) {
    for (const node of roadGraph.nodes.values()) {
      const d = dist(farm.centroid, node.point);
      if (d < constraints.minRoadBuffer) {
        violations.push(`Farm overlaps road buffer (distance: ${d.toFixed(3)})`);
        break;
      }
    }
  }
  
  return { valid: violations.length === 0, violations };
}

/**
 * Validates all farms against constraints.
 */
export function validateAllFarmConstraints(
  farms: Farm[],
  wallPolygon: Point[],
  roadGraph: RoadGraph,
  constraints: FarmPlacementConstraints = DEFAULT_FARM_CONSTRAINTS
): { valid: boolean; farmViolations: Array<{ farmId: string; violations: string[] }> } {
  const farmViolations: Array<{ farmId: string; violations: string[] }> = [];
  
  for (const farm of farms) {
    const result = validateFarmConstraints(farm, wallPolygon, roadGraph, constraints);
    if (!result.valid) {
      farmViolations.push({ farmId: farm.id, violations: result.violations });
    }
  }
  
  return { valid: farmViolations.length === 0, farmViolations };
}

/**
 * Filters farms to only include those satisfying all hard constraints.
 * HARD CONSTRAINT: Farms not meeting constraints are removed.
 */
export function filterFarmsByConstraints(
  farms: Farm[],
  wallPolygon: Point[],
  roadGraph: RoadGraph,
  constraints: FarmPlacementConstraints = DEFAULT_FARM_CONSTRAINTS
): Farm[] {
  return farms.filter(farm => {
    const result = validateFarmConstraints(farm, wallPolygon, roadGraph, constraints);
    farm.constraintsSatisfied = result.valid;
    return result.valid;
  });
}

/**
 * Checks if a farm has gate access.
 * HARD CONSTRAINT: Farms must have access to a gate for transportation.
 */
export function hasGateAccess(farm: Farm, gates: Point[], maxDistance: number = 0.2): boolean {
  for (const gate of gates) {
    if (dist(farm.centroid, gate) <= maxDistance) {
      return true;
    }
  }
  return false;
}

/**
 * Computes the wall outer buffer polygon.
 * Used for checking if farms are outside the wall area.
 */
export function computeWallOuterBuffer(wallPolygon: Point[], bufferDistance: number): Point[] {
  if (wallPolygon.length < 3) return [];
  
  // Simple buffer: expand polygon outward
  const centroid = wallPolygon.reduce(
    (acc, p) => ({ x: acc.x + p.x / wallPolygon.length, y: acc.y + p.y / wallPolygon.length }),
    { x: 0, y: 0 }
  );
  
  return wallPolygon.map(p => {
    const dx = p.x - centroid.x;
    const dy = p.y - centroid.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return {
      x: p.x + (dx / len) * bufferDistance,
      y: p.y + (dy / len) * bufferDistance
    };
  });
}
