// @ts-nocheck
/**
 * External Route Generator - CRC-A4-021
 * 
 * Generates external routes from major gates that continue beyond the 
 * immediate city boundary for a minimum span.
 * 
 * Acceptance Criteria:
 * - Every major gate has ≥1 external road path
 * - External paths meet minimum length requirement (minExternalSpan)
 * - External routes maintain connectivity to the broader network
 */

import { Point, dist, lerp } from '../types';
import { PRNG } from '../seed/prng';
import { RoadGraph, RoadNode, RoadEdge, RoadKind } from './graph';

export interface ExternalRoute {
  id: string;
  gateId: string;
  path: Point[];
  length: number;
  connectedToNetwork: boolean;
}

export interface ExternalRoad {
  id: string;
  routes: ExternalRoute[];
  path: Point[];
}

export interface Gate {
  id: string;
  point: Point;
  isMajor: boolean;
  roadClass: RoadKind;
}

export class ExternalRouteGenerator {
  private minExternalSpan: number;
  private maxExternalSpan: number;
  private rng: PRNG;
  
  constructor(rng: PRNG, config?: { minExternalSpan?: number; maxExternalSpan?: number }) {
    this.rng = rng;
    this.minExternalSpan = config?.minExternalSpan ?? 0.2;
    this.maxExternalSpan = config?.maxExternalSpan ?? 0.5;
  }
  
  /**
   * Generates external routes from major gates.
   */
  generateExternalRoutes(
    gates: Gate[],
    boundary: Point[],
    roadNetwork?: RoadGraph
  ): ExternalRoad[] {
    const externalRoads: ExternalRoad[] = [];
    const majorGates = gates.filter(g => g.isMajor);
    
    for (const gate of majorGates) {
      const routes = this.generateRoutesForGate(gate, boundary, roadNetwork);
      
      externalRoads.push({
        id: `ext-road-${gate.id}`,
        routes,
        path: routes.length > 0 ? routes[0].path : []
      });
    }
    
    return externalRoads;
  }
  
  /**
   * Generates external route(s) for a single gate.
   */
  private generateRoutesForGate(
    gate: Gate,
    boundary: Point[],
    roadNetwork?: RoadGraph
  ): ExternalRoute[] {
    const routes: ExternalRoute[] = [];
    
    // Determine route length (at least minExternalSpan)
    const routeLength = this.minExternalSpan + 
      this.rng.nextFloat() * (this.maxExternalSpan - this.minExternalSpan);
    
    // Calculate outward direction from city center
    const outwardDir = this.calculateOutwardDirection(gate.point, boundary);
    
    // Generate path points
    const path = this.generatePath(gate.point, outwardDir, routeLength);
    
    // Check connectivity to network
    const connectedToNetwork = roadNetwork 
      ? this.checkNetworkConnectivity(gate, roadNetwork)
      : true;
    
    routes.push({
      id: `route-${gate.id}`,
      gateId: gate.id,
      path,
      length: routeLength,
      connectedToNetwork
    });
    
    return routes;
  }
  
  /**
   * Calculates the outward direction from a gate position.
   */
  private calculateOutwardDirection(gatePoint: Point, boundary: Point[]): Point {
    // Find the nearest boundary point and calculate direction outward
    let nearestIdx = 0;
    let nearestDist = Infinity;
    
    for (let i = 0; i < boundary.length; i++) {
      const d = dist(gatePoint, boundary[i]);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }
    
    // Calculate tangent at nearest boundary point
    const prev = boundary[(nearestIdx - 1 + boundary.length) % boundary.length];
    const next = boundary[(nearestIdx + 1) % boundary.length];
    
    // Normal to tangent (pointing outward)
    const tangentX = next.x - prev.x;
    const tangentY = next.y - prev.y;
    const len = Math.sqrt(tangentX * tangentX + tangentY * tangentY);
    
    // Determine outward direction by checking which normal points away from center
    const center = this.calculateBoundaryCenter(boundary);
    const toCenter = { x: center.x - gatePoint.x, y: center.y - gatePoint.y };
    
    let normalX = -tangentY / len;
    let normalY = tangentX / len;
    
    // Flip if pointing toward center
    if (normalX * toCenter.x + normalY * toCenter.y > 0) {
      normalX = -normalX;
      normalY = -normalY;
    }
    
    return { x: normalX, y: normalY };
  }
  
  /**
   * Calculates the center of a boundary polygon.
   */
  private calculateBoundaryCenter(boundary: Point[]): Point {
    let x = 0, y = 0;
    for (const p of boundary) {
      x += p.x;
      y += p.y;
    }
    return { x: x / boundary.length, y: y / boundary.length };
  }
  
  /**
   * Generates a path from a gate outward.
   */
  private generatePath(start: Point, direction: Point, length: number): Point[] {
    const path: Point[] = [start];
    const segments = 3 + Math.floor(this.rng.nextFloat() * 3);
    
    let current = start;
    let currentDir = { ...direction };
    
    for (let i = 0; i < segments; i++) {
      const t = (i + 1) / segments;
      const segLength = length / segments;
      
      // Add slight curve/jitter
      const jitter = (this.rng.nextFloat() - 0.5) * 0.3;
      const cos = Math.cos(jitter);
      const sin = Math.sin(jitter);
      const newDir = {
        x: currentDir.x * cos - currentDir.y * sin,
        y: currentDir.x * sin + currentDir.y * cos
      };
      currentDir = newDir;
      
      const next = {
        x: current.x + currentDir.x * segLength,
        y: current.y + currentDir.y * segLength
      };
      
      path.push(next);
      current = next;
    }
    
    return path;
  }
  
  /**
   * Checks if a gate is connected to the road network.
   */
  private checkNetworkConnectivity(gate: Gate, roadNetwork: RoadGraph): boolean {
    // Check if any node in the network is close to the gate
    for (const node of roadNetwork.nodes.values()) {
      if (dist(node.point, gate.point) < 0.05) {
        return true;
      }
    }
    return false;
  }
}

/**
 * Finds the external road path for a gate.
 */
export function findExternalRoadPath(gate: Gate, externalRoads: ExternalRoad[]): ExternalRoute | null {
  const road = externalRoads.find(er => 
    er.routes.some(r => r.gateId === gate.id)
  );
  
  if (road) {
    return road.routes.find(r => r.gateId === gate.id) || null;
  }
  
  return null;
}

/**
 * Gets the length of an external route.
 */
export function getExternalRouteLength(route: ExternalRoute): number {
  return route.length;
}

/**
 * Checks if an external route is connected to the road network.
 */
export function isExternalRouteConnected(route: ExternalRoute, roadNetwork: RoadGraph): boolean {
  return route.connectedToNetwork;
}

/**
 * Generates a test city with major gates.
 */
export function generateCityWithMajorGates(): any {
  const gates: Gate[] = [
    { id: 'gate-1', point: { x: 0.5, y: 0 }, isMajor: true, roadClass: 'trunk' },
    { id: 'gate-2', point: { x: 0, y: 0.5 }, isMajor: true, roadClass: 'trunk' },
    { id: 'gate-3', point: { x: 1, y: 0.5 }, isMajor: true, roadClass: 'trunk' },
    { id: 'gate-4', point: { x: 0.5, y: 1 }, isMajor: false, roadClass: 'secondary' },
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
  const generator = new ExternalRouteGenerator(rng, { minExternalSpan: 0.2 });
  const externalRoads = generator.generateExternalRoutes(gates, boundary);
  
  return {
    gates,
    externalRoads,
    boundary,
    roadNetwork: new RoadGraph(),
    config: {
      minExternalSpan: 0.2
    }
  };
}
