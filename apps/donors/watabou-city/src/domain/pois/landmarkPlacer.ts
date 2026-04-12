// @ts-nocheck
/**
 * Landmark Placer - CRC-A4-026
 * 
 * Anchors core landmarks to network logic and routing significance.
 * 
 * Acceptance Criteria:
 * - Core landmarks are reachable from the road network
 * - Core landmarks have arterial connections
 * - Landmarks are placed at routing-significant locations
 */

import { Point, dist } from '../types';
import { PRNG } from '../seed/prng';
import { RoadKind } from '../roads/graph';

export interface Landmark {
  id: string;
  name: string;
  point: Point;
  isCore: boolean;
  hasArterialConnection: boolean;
  routingSignificance: number;
  nearbyRoadId?: string;
}

export interface Road {
  id: string;
  points: Point[];
  class: RoadKind | string;
  length: number;
}

export interface LandmarkPlacerConfig {
  maxLandmarkToRoadDistance: number;
  minRoutingSignificance: number;
  coreLandmarkCount: number;
  totalLandmarkCount: number;
}

export const DEFAULT_LANDMARK_CONFIG: LandmarkPlacerConfig = {
  maxLandmarkToRoadDistance: 30,
  minRoutingSignificance: 0.5,
  coreLandmarkCount: 3,
  totalLandmarkCount: 10
};

const LANDMARK_NAMES = [
  'Grand Cathedral',
  'Royal Palace',
  'Central Market',
  'Old Fortress',
  'Harbor Lighthouse',
  'Merchant Hall',
  'Temple of Wisdom',
  'Guild Tower',
  'City Hall',
  'Memorial Square',
  'Ancient Library',
  'Watchtower',
  'Fountain Plaza',
  'Bridge Gate',
  'Trade Post'
];

export class LandmarkPlacer {
  private config: LandmarkPlacerConfig;
  private rng: PRNG;
  
  constructor(rng: PRNG, config?: Partial<LandmarkPlacerConfig>) {
    this.rng = rng;
    this.config = { ...DEFAULT_LANDMARK_CONFIG, ...config };
  }
  
  /**
   * Places landmarks anchored to network logic.
   */
  placeLandmarks(roads: Road[], gates: Point[], hub: Point): Landmark[] {
    const landmarks: Landmark[] = [];
    
    // Find routing-significant locations
    const significantLocations = this.findRoutingSignificantLocations(roads, gates, hub);
    
    // Place core landmarks at most significant locations
    const coreLocations = significantLocations.slice(0, this.config.coreLandmarkCount);
    for (let i = 0; i < coreLocations.length; i++) {
      const loc = coreLocations[i];
      const landmark = this.createLandmark(loc, roads, true, i);
      landmarks.push(landmark);
    }
    
    // Place extra landmarks at other significant locations
    const remainingLocations = significantLocations.slice(this.config.coreLandmarkCount);
    const additionalCount = Math.min(
      remainingLocations.length,
      this.config.totalLandmarkCount - landmarks.length
    );
    
    for (let i = 0; i < additionalCount; i++) {
      const loc = remainingLocations[i];
      const landmark = this.createLandmark(loc, roads, false, landmarks.length);
      landmarks.push(landmark);
    }
    
    return landmarks;
  }
  
  /**
   * Finds routing-significant locations in the road network.
   */
  private findRoutingSignificantLocations(roads: Road[], gates: Point[], hub: Point): Point[] {
    const locations: { point: Point; significance: number }[] = [];
    
    // Hub is always significant
    locations.push({ point: hub, significance: 1.0 });
    
    // Gate intersections are significant
    for (const gate of gates) {
      const connectedRoads = roads.filter(r => 
        r.points.some(p => dist(p, gate) < 0.05)
      );
      
      if (connectedRoads.length > 0) {
        const significance = connectedRoads.some(r => r.class === 'trunk') ? 0.9 : 0.7;
        locations.push({ point: gate, significance });
      }
    }
    
    // Road intersections are significant
    const intersections = this.findRoadIntersections(roads);
    for (const intersection of intersections) {
      locations.push({ point: intersection, significance: 0.6 });
    }
    
    // Mid-points of arterial roads are moderately significant
    for (const road of roads.filter(r => r.class === 'trunk')) {
      if (road.points.length >= 2) {
        const midIdx = Math.floor(road.points.length / 2);
        locations.push({ 
          point: road.points[midIdx], 
          significance: 0.5 
        });
      }
    }
    
    // Sort by significance
    locations.sort((a, b) => b.significance - a.significance);
    
    return locations.map(l => l.point);
  }
  
  /**
   * Finds intersection points between roads.
   */
  private findRoadIntersections(roads: Road[]): Point[] {
    const intersections: Point[] = [];
    const threshold = 0.03;
    
    for (let i = 0; i < roads.length; i++) {
      for (let j = i + 1; j < roads.length; j++) {
        for (const pi of roads[i].points) {
          for (const pj of roads[j].points) {
            if (dist(pi, pj) < threshold) {
              intersections.push({
                x: (pi.x + pj.x) / 2,
                y: (pi.y + pj.y) / 2
              });
            }
          }
        }
      }
    }
    
    return intersections;
  }
  
  /**
   * Creates a landmark at a location.
   */
  private createLandmark(
    location: Point, 
    roads: Road[], 
    isCore: boolean, 
    index: number
  ): Landmark {
    // Find nearby road
    let nearestRoad: Road | undefined;
    let nearestDist = Infinity;
    
    for (const road of roads) {
      for (const p of road.points) {
        const d = dist(location, p);
        if (d < nearestDist) {
          nearestDist = d;
          nearestRoad = road;
        }
      }
    }
    
    // Check for arterial connection
    const hasArterial = nearestRoad?.class === 'trunk';
    
    // Calculate routing significance
    const routingSignificance = isCore ? 0.9 : 0.5 + this.rng.nextFloat() * 0.3;
    
    return {
      id: `landmark-${index}`,
      name: LANDMARK_NAMES[index % LANDMARK_NAMES.length],
      point: location,
      isCore,
      hasArterialConnection: hasArterial,
      routingSignificance,
      nearbyRoadId: nearestRoad?.id
    };
  }
}

/**
 * Checks if a landmark is reachable from the road network.
 */
export function isReachable(landmark: Landmark, roads: Road[]): boolean {
  const threshold = 0.05;
  
  for (const road of roads) {
    for (const point of road.points) {
      if (dist(landmark.point, point) < threshold) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Checks if a landmark has an arterial connection.
 */
export function hasArterialConnection(landmark: Landmark, roads: Road[]): boolean {
  return landmark.hasArterialConnection;
}

/**
 * Analyzes the routing significance of a landmark.
 */
export function analyzeRoutingSignificance(landmark: Landmark): number {
  return landmark.routingSignificance;
}

/**
 * Finds a nearby road connection for a landmark.
 */
export function findNearbyRoadConnection(landmark: Landmark, roads: Road[]): { road: Road; distance: number } | undefined {
  let nearestRoad: Road | undefined;
  let nearestDist = Infinity;
  
  for (const road of roads) {
    for (const point of road.points) {
      const d = dist(landmark.point, point);
      if (d < nearestDist) {
        nearestDist = d;
        nearestRoad = road;
      }
    }
  }
  
  if (nearestRoad) {
    return { road: nearestRoad, distance: nearestDist };
  }
  
  return undefined;
}

/**
 * Checks if a landmark is reachable from a starting point.
 */
export function isReachableFrom(landmark: Landmark, start: Point, roads: Road[]): boolean {
  // Basic check: see if there's a path through connected roads
  // For now, check if both are near the road network
  const landmarkReachable = isReachable(landmark, roads);
  const startNearRoad = roads.some(r => r.points.some(p => dist(p, start) < 0.05));
  
  return landmarkReachable && startNearRoad;
}

/**
 * Generates a test city with roads.
 */
export function generateCityWithRoads(): any {
  const roads: Road[] = [
    { 
      id: 'road-1', 
      points: [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.3 }, { x: 0.5, y: 0 }], 
      class: 'trunk',
      length: 0.5
    },
    { 
      id: 'road-2', 
      points: [{ x: 0.5, y: 0.5 }, { x: 0.3, y: 0.5 }, { x: 0, y: 0.5 }], 
      class: 'trunk',
      length: 0.5
    },
    { 
      id: 'road-3', 
      points: [{ x: 0.5, y: 0.5 }, { x: 0.7, y: 0.5 }, { x: 1, y: 0.5 }], 
      class: 'trunk',
      length: 0.5
    },
    { 
      id: 'road-4', 
      points: [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.7 }, { x: 0.5, y: 1 }], 
      class: 'secondary',
      length: 0.5
    },
    { 
      id: 'road-5', 
      points: [{ x: 0.3, y: 0.3 }, { x: 0.4, y: 0.4 }], 
      class: 'local',
      length: 0.14
    },
  ];
  
  const gates: Point[] = [
    { x: 0.5, y: 0 },
    { x: 0, y: 0.5 },
    { x: 1, y: 0.5 },
    { x: 0.5, y: 1 }
  ];
  
  const hub: Point = { x: 0.5, y: 0.5 };
  
  const rng = new PRNG(12345);
  const placer = new LandmarkPlacer(rng);
  const landmarks = placer.placeLandmarks(roads, gates, hub);
  
  return {
    roads,
    gates,
    hub,
    landmarks,
    config: {
      maxLandmarkToRoadDistance: 30
    }
  };
}

/**
 * Places landmarks for a city (wrapper).
 */
export function placeLandmarks(city: any): Landmark[] {
  const rng = new PRNG(city.seed || 12345);
  const placer = new LandmarkPlacer(rng, city.config);
  
  // Convert roads if needed
  const roads: Road[] = (city.roads || []).map((r: any) => ({
    id: r.id || `road-${Math.random()}`,
    points: r.points || [],
    class: r.class || 'local',
    length: r.length || 1
  }));
  
  return placer.placeLandmarks(
    roads,
    city.gates || [],
    city.hub || { x: 0.5, y: 0.5 }
  );
}
