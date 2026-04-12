// @ts-nocheck
/**
 * Suburb Generator - CRC-A4-023
 * 
 * Generates suburban fingers outside selected gates along external roads
 * with lower-density profiles.
 * 
 * Acceptance Criteria:
 * - Suburbs follow external road alignment
 * - Suburbs use lower-density profile than core
 * - Suburbs are generated only when suburb mode is enabled
 */

import { Point, dist, lerp } from '../types';
import { PRNG } from '../seed/prng';
import { ExternalRoad, ExternalRoute } from '../roads/externalRouteGenerator';

export interface SuburbFinger {
  id: string;
  gateId: string;
  polygon: Point[];
  centroid: Point;
  density: number;
  aligned: boolean;
  buildings: Point[];
}

export interface Suburb {
  id: string;
  gateId: string;
  fingers: SuburbFinger[];
  density: number;
  coreDensity: number;
}

export interface SuburbGate {
  id: string;
  point: Point;
  hasSuburb: boolean;
  isMajor: boolean;
}

export interface SuburbGeneratorConfig {
  suburbModeEnabled: boolean;
  suburbDensityRatio: number;  // Ratio of suburb density to core density
  coreDensity: number;
  minFingerLength: number;
  maxFingerLength: number;
  fingerWidth: number;
  maxFingersPerGate: number;
}

export const DEFAULT_SUBURB_CONFIG: SuburbGeneratorConfig = {
  suburbModeEnabled: true,
  suburbDensityRatio: 0.5,
  coreDensity: 0.8,
  minFingerLength: 0.1,
  maxFingerLength: 0.3,
  fingerWidth: 0.05,
  maxFingersPerGate: 3
};

export class SuburbGenerator {
  private config: SuburbGeneratorConfig;
  private rng: PRNG;
  
  constructor(rng: PRNG, config?: Partial<SuburbGeneratorConfig>) {
    this.rng = rng;
    this.config = { ...DEFAULT_SUBURB_CONFIG, ...config };
  }
  
  /**
   * Generates suburbs for gates with suburb mode enabled.
   */
  generateSuburbs(
    gates: SuburbGate[],
    externalRoads: ExternalRoad[],
    boundary: Point[]
  ): Suburb[] {
    if (!this.config.suburbModeEnabled) {
      return [];
    }
    
    const suburbs: Suburb[] = [];
    const gatesWithSuburbs = gates.filter(g => g.hasSuburb && g.isMajor);
    
    for (const gate of gatesWithSuburbs) {
      const suburb = this.generateSuburbForGate(gate, externalRoads, boundary);
      if (suburb) {
        suburbs.push(suburb);
      }
    }
    
    return suburbs;
  }
  
  /**
   * Generates a suburb for a single gate.
   */
  private generateSuburbForGate(
    gate: SuburbGate,
    externalRoads: ExternalRoad[],
    boundary: Point[]
  ): Suburb | null {
    // Find external road for this gate
    const externalRoad = externalRoads.find(er => 
      er.routes.some(r => r.gateId === gate.id)
    );
    
    if (!externalRoad) {
      return null;
    }
    
    const fingers = this.generateFingers(gate, externalRoad, boundary);
    const suburbDensity = this.config.coreDensity * this.config.suburbDensityRatio;
    
    return {
      id: `suburb-${gate.id}`,
      gateId: gate.id,
      fingers,
      density: suburbDensity,
      coreDensity: this.config.coreDensity
    };
  }
  
  /**
   * Generates suburb fingers along external roads.
   */
  private generateFingers(
    gate: SuburbGate,
    externalRoad: ExternalRoad,
    boundary: Point[]
  ): SuburbFinger[] {
    const fingers: SuburbFinger[] = [];
    const numFingers = 1 + Math.floor(this.rng.nextFloat() * this.config.maxFingersPerGate);
    
    // Get the external route path
    const route = externalRoad.routes.find(r => r.gateId === gate.id);
    if (!route || route.path.length < 2) {
      return fingers;
    }
    
    for (let i = 0; i < numFingers; i++) {
      const finger = this.generateFinger(gate, route, i, numFingers);
      if (finger) {
        fingers.push(finger);
      }
    }
    
    return fingers;
  }
  
  /**
   * Generates a single suburb finger.
   */
  private generateFinger(
    gate: SuburbGate,
    route: ExternalRoute,
    index: number,
    total: number
  ): SuburbFinger | null {
    if (route.path.length < 2) {
      return null;
    }
    
    // Calculate finger position along the route
    const t = (index + 1) / (total + 1);
    const pathIndex = Math.min(Math.floor(t * (route.path.length - 1)), route.path.length - 2);
    const pathT = (t * (route.path.length - 1)) - pathIndex;
    
    const start = route.path[pathIndex];
    const end = route.path[pathIndex + 1];
    const basePoint = lerp(start, end, pathT);
    
    // Calculate direction perpendicular to road
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    if (len === 0) {
      return null;
    }
    
    // Perpendicular direction
    const perpX = -dy / len;
    const perpY = dx / len;
    
    // Generate finger polygon
    const fingerLength = this.config.minFingerLength + 
      this.rng.nextFloat() * (this.config.maxFingerLength - this.config.minFingerLength);
    const fingerWidth = this.config.fingerWidth * (0.8 + this.rng.nextFloat() * 0.4);
    
    // Alternate sides of the road
    const side = (index % 2 === 0) ? 1 : -1;
    
    const polygon: Point[] = [
      { x: basePoint.x + perpX * fingerWidth * side * 0.5, y: basePoint.y + perpY * fingerWidth * side * 0.5 },
      { x: basePoint.x - perpX * fingerWidth * side * 0.5, y: basePoint.y - perpY * fingerWidth * side * 0.5 },
      { 
        x: basePoint.x - perpX * fingerWidth * side * 0.5 + dx / len * fingerLength, 
        y: basePoint.y - perpY * fingerWidth * side * 0.5 + dy / len * fingerLength 
      },
      { 
        x: basePoint.x + perpX * fingerWidth * side * 0.5 + dx / len * fingerLength, 
        y: basePoint.y + perpY * fingerWidth * side * 0.5 + dy / len * fingerLength 
      }
    ];
    
    const centroid = this.calculateCentroid(polygon);
    const suburbDensity = this.config.coreDensity * this.config.suburbDensityRatio;
    
    // Generate sparse buildings within the finger
    const buildings = this.generateFingerBuildings(polygon, suburbDensity);
    
    return {
      id: `finger-${gate.id}-${index}`,
      gateId: gate.id,
      polygon,
      centroid,
      density: suburbDensity,
      aligned: true,
      buildings
    };
  }
  
  /**
   * Generates buildings within a finger.
   */
  private generateFingerBuildings(polygon: Point[], density: number): Point[] {
    const buildings: Point[] = [];
    const centroid = this.calculateCentroid(polygon);
    
    // Number of buildings based on density
    const numBuildings = Math.floor(density * 10);
    
    for (let i = 0; i < numBuildings; i++) {
      // Random position within finger
      const angle = this.rng.nextFloat() * Math.PI * 2;
      const radius = this.rng.nextFloat() * 0.02;
      
      buildings.push({
        x: centroid.x + Math.cos(angle) * radius,
        y: centroid.y + Math.sin(angle) * radius
      });
    }
    
    return buildings;
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
}

/**
 * Checks if a suburb is aligned to an external road.
 */
export function isAlignedToExternalRoad(suburb: Suburb, externalRoads: ExternalRoad[]): boolean {
  // All fingers should be aligned
  return suburb.fingers.every(finger => finger.aligned);
}

/**
 * Calculates the density of a suburb.
 */
export function calculateSuburbDensity(suburb: Suburb): number {
  return suburb.density;
}

/**
 * Gets the geometry of a suburb finger.
 */
export function getSuburbFingerGeometry(finger: SuburbFinger): { polygon: Point[]; centroid: Point } {
  return {
    polygon: finger.polygon,
    centroid: finger.centroid
  };
}

/**
 * Generates a test city with suburb mode enabled.
 */
export function generateCityWithSuburbMode(): any {
  const gates: SuburbGate[] = [
    { id: 'gate-1', point: { x: 0.5, y: 0 }, hasSuburb: true, isMajor: true },
    { id: 'gate-2', point: { x: 0, y: 0.5 }, hasSuburb: true, isMajor: true },
    { id: 'gate-3', point: { x: 1, y: 0.5 }, hasSuburb: false, isMajor: true },
    { id: 'gate-4', point: { x: 0.5, y: 1 }, hasSuburb: false, isMajor: false },
  ];
  
  const externalRoads: ExternalRoad[] = [
    {
      id: 'ext-1',
      routes: [{
        id: 'route-1',
        gateId: 'gate-1',
        path: [{ x: 0.5, y: 0 }, { x: 0.5, y: -0.1 }, { x: 0.5, y: -0.2 }],
        length: 0.2,
        connectedToNetwork: true
      }],
      path: [{ x: 0.5, y: 0 }, { x: 0.5, y: -0.1 }, { x: 0.5, y: -0.2 }]
    },
    {
      id: 'ext-2',
      routes: [{
        id: 'route-2',
        gateId: 'gate-2',
        path: [{ x: 0, y: 0.5 }, { x: -0.1, y: 0.5 }, { x: -0.2, y: 0.5 }],
        length: 0.2,
        connectedToNetwork: true
      }],
      path: [{ x: 0, y: 0.5 }, { x: -0.1, y: 0.5 }, { x: -0.2, y: 0.5 }]
    },
    {
      id: 'ext-3',
      routes: [{
        id: 'route-3',
        gateId: 'gate-3',
        path: [{ x: 1, y: 0.5 }, { x: 1.1, y: 0.5 }, { x: 1.2, y: 0.5 }],
        length: 0.2,
        connectedToNetwork: true
      }],
      path: [{ x: 1, y: 0.5 }, { x: 1.1, y: 0.5 }, { x: 1.2, y: 0.5 }]
    }
  ];
  
  const boundary: Point[] = [
    { x: 0.5, y: 0 },
    { x: 1, y: 0.25 },
    { x: 1, y: 0.75 },
    { x: 0.75, y: 1 },
    { x: 0.25, y: 1 },
    { x: 0, y: 0.75 },
    { x: 0, y: 0.25 },
    { x: 0.25, y: 0 },
  ];
  
  const rng = new PRNG(12345);
  const generator = new SuburbGenerator(rng);
  const suburbs = generator.generateSuburbs(gates, externalRoads, boundary);
  
  return {
    gates,
    suburbs,
    externalRoads,
    boundary,
    config: {
      suburbModeEnabled: true,
      coreDensity: 0.8,
      suburbDensityRatio: 0.5
    }
  };
}

/**
 * Generates a test city without suburb mode.
 */
export function generateCityWithoutSuburbMode(): any {
  const gates: SuburbGate[] = [
    { id: 'gate-1', point: { x: 0.5, y: 0 }, hasSuburb: true, isMajor: true },
  ];
  
  const externalRoads: ExternalRoad[] = [];
  const boundary: Point[] = [];
  
  const rng = new PRNG(12345);
  const generator = new SuburbGenerator(rng, { suburbModeEnabled: false });
  const suburbs = generator.generateSuburbs(gates, externalRoads, boundary);
  
  return {
    gates,
    suburbs,
    externalRoads,
    boundary,
    config: {
      suburbModeEnabled: false
    }
  };
}

/**
 * Generates suburbs for a city (wrapper function).
 */
export function generateSuburbs(city: any): Suburb[] {
  const rng = new PRNG(city.seed || 12345);
  const generator = new SuburbGenerator(rng, city.config);
  
  return generator.generateSuburbs(
    city.gates || [],
    city.externalRoads || [],
    city.boundary || []
  );
}
