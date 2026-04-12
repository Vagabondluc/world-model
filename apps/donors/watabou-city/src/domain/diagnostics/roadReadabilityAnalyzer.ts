// @ts-nocheck
/**
 * Road Readability Analyzer - CRC-A4-028
 * 
 * Analyzes frontage and setback coherence to make road corridors
 * visually legible.
 * 
 * Acceptance Criteria:
 * - Frontage coherence meets threshold (minFrontageCoherence)
 * - Setback coherence meets threshold (minSetbackCoherence)
 * - Road corridors are visually distinct from surrounding buildings
 */

import { Point, dist } from '../types';

export interface Building {
  id: string;
  polygon: Point[];
  centroid: Point;
  roadId?: string;
  frontage?: number;
  setback?: number;
}

export interface Road {
  id: string;
  points: Point[];
  class: string;
  length: number;
  width: number;
}

export interface FrontageGap {
  startPoint: Point;
  endPoint: Point;
  length: number;
  roadId: string;
}

export interface RoadReadability {
  frontageCoherence: number;
  setbackCoherence: number;
  corridorVisibility: number;
  gaps: FrontageGap[];
}

export interface RoadReadabilityConfig {
  minFrontageCoherence: number;
  minSetbackCoherence: number;
  maxFrontageGapRatio: number;
  maxSetbackVariance: number;
  frontageCheckDistance: number;
}

export const DEFAULT_ROAD_READABILITY_CONFIG: RoadReadabilityConfig = {
  minFrontageCoherence: 0.6,
  minSetbackCoherence: 0.7,
  maxFrontageGapRatio: 0.3,
  maxSetbackVariance: 0.1,
  frontageCheckDistance: 0.05
};

export class RoadReadabilityAnalyzer {
  private config: RoadReadabilityConfig;
  
  constructor(config?: Partial<RoadReadabilityConfig>) {
    this.config = { ...DEFAULT_ROAD_READABILITY_CONFIG, ...config };
  }
  
  /**
   * Analyzes road readability for a city.
   */
  analyzeRoadReadability(roads: Road[], buildings: Building[]): RoadReadability {
    const frontageCoherence = this.calculateFrontageCoherence(roads, buildings);
    const setbackCoherence = this.calculateSetbackCoherence(roads, buildings);
    const corridorVisibility = this.calculateCorridorVisibility(roads, buildings);
    const gaps = this.findAllFrontageGaps(roads, buildings);
    
    return {
      frontageCoherence,
      setbackCoherence,
      corridorVisibility,
      gaps
    };
  }
  
  /**
   * Calculates frontage coherence across all roads.
   */
  private calculateFrontageCoherence(roads: Road[], buildings: Building[]): number {
    if (roads.length === 0 || buildings.length === 0) {
      return 1;
    }
    
    let totalCoherence = 0;
    let roadCount = 0;
    
    for (const road of roads) {
      const roadBuildings = this.getBuildingsNearRoad(road, buildings);
      
      if (roadBuildings.length > 0) {
        // Calculate what fraction of buildings face the road
        const facingBuildings = roadBuildings.filter(b => this.isBuildingFacingRoad(b, road));
        const facingRatio = facingBuildings.length / roadBuildings.length;
        
        // Calculate frontage coverage
        const coverage = this.calculateFrontageCoverage(road, facingBuildings);
        
        // Coherence is combination of facing ratio and coverage
        const coherence = (facingRatio + coverage) / 2;
        totalCoherence += coherence;
        roadCount++;
      }
    }
    
    return roadCount > 0 ? totalCoherence / roadCount : 1;
  }
  
  /**
   * Calculates setback coherence across all roads.
   */
  private calculateSetbackCoherence(roads: Road[], buildings: Building[]): number {
    if (roads.length === 0 || buildings.length === 0) {
      return 1;
    }
    
    let totalCoherence = 0;
    let roadCount = 0;
    
    for (const road of roads) {
      const roadBuildings = this.getBuildingsNearRoad(road, buildings);
      
      if (roadBuildings.length >= 2) {
        // Calculate setback variance
        const setbacks = roadBuildings.map(b => this.calculateSetback(b, road));
        const avgSetback = setbacks.reduce((sum, s) => sum + s, 0) / setbacks.length;
        const variance = this.calculateVariance(setbacks, avgSetback);
        
        // Coherence is inverse of normalized variance
        const maxVariance = this.config.maxSetbackVariance;
        const coherence = Math.max(0, 1 - variance / maxVariance);
        
        totalCoherence += coherence;
        roadCount++;
      }
    }
    
    return roadCount > 0 ? totalCoherence / roadCount : 1;
  }
  
  /**
   * Calculates corridor visibility score.
   */
  private calculateCorridorVisibility(roads: Road[], buildings: Building[]): number {
    if (roads.length === 0) {
      return 1;
    }
    
    let totalVisibility = 0;
    
    for (const road of roads) {
      // Check if road corridor is clear
      const roadBuildings = this.getBuildingsNearRoad(road, buildings);
      const avgSetback = roadBuildings.length > 0
        ? roadBuildings.reduce((sum, b) => sum + this.calculateSetback(b, road), 0) / roadBuildings.length
        : road.width * 2;
      
      // Visibility is good if average setback is at least road width
      const visibility = Math.min(1, avgSetback / road.width);
      totalVisibility += visibility;
    }
    
    return totalVisibility / roads.length;
  }
  
  /**
   * Gets buildings near a road.
   */
  private getBuildingsNearRoad(road: Road, buildings: Building[]): Building[] {
    const threshold = this.config.frontageCheckDistance;
    
    return buildings.filter(building => {
      for (const roadPoint of road.points) {
        if (dist(building.centroid, roadPoint) < threshold) {
          return true;
        }
      }
      return false;
    });
  }
  
  /**
   * Checks if a building is facing a road.
   */
  private isBuildingFacingRoad(building: Building, road: Road): boolean {
    // Find nearest road point
    let nearestDist = Infinity;
    let nearestPoint = road.points[0];
    
    for (const point of road.points) {
      const d = dist(building.centroid, point);
      if (d < nearestDist) {
        nearestDist = d;
        nearestPoint = point;
      }
    }
    
    // Check if any building vertex is closer to the road than the centroid
    // This indicates the building is oriented toward the road
    for (const vertex of building.polygon) {
      if (dist(vertex, nearestPoint) < nearestDist) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Calculates frontage coverage for a road.
   */
  private calculateFrontageCoverage(road: Road, buildings: Building[]): number {
    if (buildings.length === 0) {
      return 0;
    }
    
    // Estimate total frontage length
    let totalFrontage = 0;
    for (const building of buildings) {
      totalFrontage += this.estimateBuildingFrontage(building, road);
    }
    
    // Coverage ratio
    return Math.min(1, totalFrontage / road.length);
  }
  
  /**
   * Estimates the frontage length of a building along a road.
   */
  private estimateBuildingFrontage(building: Building, road: Road): number {
    // Basic estimation: use building width in direction parallel to road
    const roadDir = this.getRoadDirection(road);
    
    // Find building extent along road direction
    let minProj = Infinity;
    let maxProj = -Infinity;
    
    for (const vertex of building.polygon) {
      const proj = vertex.x * roadDir.x + vertex.y * roadDir.y;
      minProj = Math.min(minProj, proj);
      maxProj = Math.max(maxProj, proj);
    }
    
    return maxProj - minProj;
  }
  
  /**
   * Gets the direction vector of a road.
   */
  private getRoadDirection(road: Road): Point {
    if (road.points.length < 2) {
      return { x: 1, y: 0 };
    }
    
    const start = road.points[0];
    const end = road.points[road.points.length - 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    return { x: dx / len, y: dy / len };
  }
  
  /**
   * Calculates the setback of a building from a road.
   */
  private calculateSetback(building: Building, road: Road): number {
    let minDist = Infinity;
    
    for (const vertex of building.polygon) {
      for (const roadPoint of road.points) {
        const d = dist(vertex, roadPoint);
        minDist = Math.min(minDist, d);
      }
    }
    
    return minDist;
  }
  
  /**
   * Calculates variance of values.
   */
  private calculateVariance(values: number[], mean: number): number {
    if (values.length === 0) return 0;
    
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length);
  }
  
  /**
   * Finds all frontage gaps along roads.
   */
  findAllFrontageGaps(roads: Road[], buildings: Building[]): FrontageGap[] {
    const gaps: FrontageGap[] = [];
    
    for (const road of roads) {
      const roadGaps = findFrontageGaps(road, buildings);
      gaps.push(...roadGaps);
    }
    
    return gaps;
  }
}

/**
 * Finds frontage gaps along a specific road.
 */
export function findFrontageGaps(road: Road, buildings: Building[]): FrontageGap[] {
  const gaps: FrontageGap[] = [];
  const threshold = 0.05;
  
  // Get buildings near road
  const nearBuildings = buildings.filter(b => {
    for (const point of road.points) {
      if (dist(b.centroid, point) < threshold) {
        return true;
      }
    }
    return false;
  });
  
  // Sample road at intervals and check for nearby buildings
  const sampleInterval = 0.02;
  let gapStart: Point | null = null;
  
  for (let i = 0; i < road.points.length - 1; i++) {
    const start = road.points[i];
    const end = road.points[i + 1];
    const segmentLength = dist(start, end);
    const numSamples = Math.ceil(segmentLength / sampleInterval);
    
    for (let j = 0; j <= numSamples; j++) {
      const t = j / numSamples;
      const samplePoint = {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t
      };
      
      // Check if any building is near this sample point
      const hasNearbyBuilding = nearBuildings.some(b => 
        dist(b.centroid, samplePoint) < threshold
      );
      
      if (!hasNearbyBuilding) {
        if (!gapStart) {
          gapStart = samplePoint;
        }
      } else {
        if (gapStart) {
          gaps.push({
            startPoint: gapStart,
            endPoint: samplePoint,
            length: dist(gapStart, samplePoint),
            roadId: road.id
          });
          gapStart = null;
        }
      }
    }
  }
  
  // Close any remaining gap
  if (gapStart) {
    const lastPoint = road.points[road.points.length - 1];
    gaps.push({
      startPoint: gapStart,
      endPoint: lastPoint,
      length: dist(gapStart, lastPoint),
      roadId: road.id
    });
  }
  
  return gaps;
}

/**
 * Checks if a building is oriented toward a road.
 */
export function isBuildingOrientedToRoad(building: Building, road: Road): boolean {
  // Find nearest road point
  let nearestDist = Infinity;
  let nearestPoint = road.points[0];
  
  for (const point of road.points) {
    const d = dist(building.centroid, point);
    if (d < nearestDist) {
      nearestDist = d;
      nearestPoint = point;
    }
  }
  
  // Check if any building vertex is closer to the road than the centroid
  for (const vertex of building.polygon) {
    if (dist(vertex, nearestPoint) < nearestDist) {
      return true;
    }
  }
  
  return false;
}

/**
 * Generates a test city with roads and buildings.
 */
export function generateCityWithRoadsAndBuildings(): any {
  const roads: Road[] = [
    { 
      id: 'road-1', 
      points: [{ x: 0.3, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.7, y: 0.5 }], 
      class: 'arterial',
      length: 0.4,
      width: 0.02
    },
    { 
      id: 'road-2', 
      points: [{ x: 0.5, y: 0.3 }, { x: 0.5, y: 0.5 }, { x: 0.5, y: 0.7 }], 
      class: 'collector',
      length: 0.4,
      width: 0.015
    },
  ];
  
  const buildings: Building[] = [
    { id: 'b1', polygon: [{ x: 0.32, y: 0.52 }, { x: 0.36, y: 0.52 }, { x: 0.36, y: 0.56 }, { x: 0.32, y: 0.56 }], centroid: { x: 0.34, y: 0.54 }, roadId: 'road-1' },
    { id: 'b2', polygon: [{ x: 0.38, y: 0.52 }, { x: 0.42, y: 0.52 }, { x: 0.42, y: 0.56 }, { x: 0.38, y: 0.56 }], centroid: { x: 0.40, y: 0.54 }, roadId: 'road-1' },
    { id: 'b3', polygon: [{ x: 0.52, y: 0.32 }, { x: 0.56, y: 0.32 }, { x: 0.56, y: 0.36 }, { x: 0.52, y: 0.36 }], centroid: { x: 0.54, y: 0.34 }, roadId: 'road-2' },
    { id: 'b4', polygon: [{ x: 0.52, y: 0.38 }, { x: 0.56, y: 0.38 }, { x: 0.56, y: 0.42 }, { x: 0.52, y: 0.42 }], centroid: { x: 0.54, y: 0.40 }, roadId: 'road-2' },
  ];
  
  const analyzer = new RoadReadabilityAnalyzer();
  const readability = analyzer.analyzeRoadReadability(roads, buildings);
  
  return {
    roads,
    buildings,
    readability,
    config: {
      minFrontageCoherence: 0.6,
      minSetbackCoherence: 0.7,
      maxFrontageGapRatio: 0.3
    }
  };
}

/**
 * Analyzes road readability for a city (wrapper).
 */
export function analyzeRoadReadability(city: any): RoadReadability {
  const analyzer = new RoadReadabilityAnalyzer(city.config);
  
  const roads: Road[] = (city.roads || []).map((r: any) => ({
    id: r.id || 'road',
    points: r.points || [],
    class: r.class || 'local',
    length: r.length || 1,
    width: r.width || 0.01
  }));
  
  const buildings: Building[] = (city.buildings || []).map((b: any) => ({
    id: b.id || 'building',
    polygon: b.polygon || [],
    centroid: b.centroid || { x: 0, y: 0 },
    roadId: b.roadId,
    frontage: b.frontage,
    setback: b.setback
  }));
  
  return analyzer.analyzeRoadReadability(roads, buildings);
}
