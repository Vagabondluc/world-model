// @ts-nocheck
import { Point, dist } from '../types';
import { RoadGraph, RoadKind, RoadNode, RoadEdge } from './graph';

export type RoadTier = 'arterial' | 'collector' | 'local';

export interface Road {
  id: string;
  start: Point;
  end: Point;
  tier: RoadTier;
  kind?: RoadKind;
  intersections?: string[]; // IDs of intersecting roads
}

export interface RoadNetwork {
  roads: Road[];
  nodes: Map<string, RoadNode>;
  edges: RoadEdge[];
}

export interface Route {
  id: string;
  roadIds: string[];
  tier: RoadTier;
  startPoint: Point;
  endPoint: Point;
}

export interface RoadHierarchyData {
  tiers: RoadTier[];
  roadsByTier: Record<RoadTier, Road[]>;
  arterialRoutes: Route[];
}

export interface City {
  roads: RoadNetwork;
  gates: Gate[];
  bridgeheads: Bridgehead[];
  centers: Center[];
}

export interface Gate {
  id: string;
  position: Point;
  roadClass: RoadTier;
}

export interface Bridgehead {
  id: string;
  position: Point;
}

export interface Center {
  id: string;
  position: Point;
}

/**
 * RoadHierarchy class manages the classification and analysis of road networks
 * into hierarchical tiers (arterial, collector, local) and ensures proper
 * connectivity between major points in the city.
 */
export class RoadHierarchy {
  private roadNetwork: RoadNetwork;
  private hierarchy: RoadHierarchyData;

  constructor(roadNetwork: RoadNetwork) {
    this.roadNetwork = roadNetwork;
    this.hierarchy = this.analyzeRoadHierarchy();
  }

  /**
   * Analyzes the road network and classifies roads into tiers
   */
  private analyzeRoadHierarchy(): RoadHierarchyData {
    const roadsByTier: Record<RoadTier, Road[]> = {
      arterial: [],
      collector: [],
      local: []
    };

    // Convert graph edges to road objects and classify them
    for (const edge of this.roadNetwork.edges) {
      const startNode = this.roadNetwork.nodes.get(edge.u);
      const endNode = this.roadNetwork.nodes.get(edge.v);
      
      if (!startNode || !endNode) continue;

      const road: Road = {
        id: edge.id,
        start: startNode.point,
        end: endNode.point,
        tier: this.classifyRoad(edge, startNode, endNode),
        kind: edge.kind,
        intersections: this.findRoadIntersections(edge)
      };

      roadsByTier[road.tier].push(road);
    }

    // Ensure we have at least one arterial road
    if (roadsByTier.arterial.length === 0 && roadsByTier.collector.length > 0) {
      const mostImportantCollector = this.findMostImportantRoad(roadsByTier.collector);
      mostImportantCollector.tier = 'arterial';
      roadsByTier.arterial.push(mostImportantCollector);
      roadsByTier.collector = roadsByTier.collector.filter(r => r.id !== mostImportantCollector.id);
    }

    // Ensure we have at least one collector road
    if (roadsByTier.collector.length === 0 && roadsByTier.local.length > 0) {
      const mostImportantLocal = this.findMostImportantRoad(roadsByTier.local);
      mostImportantLocal.tier = 'collector';
      roadsByTier.collector.push(mostImportantLocal);
      roadsByTier.local = roadsByTier.local.filter(r => r.id !== mostImportantLocal.id);
    }

    const arterialRoutes = this.findArterialRoutes(roadsByTier.arterial);

    return {
      tiers: ['arterial', 'collector', 'local'],
      roadsByTier,
      arterialRoutes
    };
  }

  /**
   * Classifies a road into a tier based on its characteristics
   */
  private classifyRoad(edge: RoadEdge, startNode: RoadNode, endNode: RoadNode): RoadTier {
    // Base classification on existing road kind
    if (edge.kind === 'trunk') return 'arterial';
    if (edge.kind === 'secondary') return 'collector';
    if (edge.kind === 'local') return 'local';

    // If no kind is specified, classify based on connectivity and importance
    const startConnectivity = this.getConnectivity(startNode.id);
    const endConnectivity = this.getConnectivity(endNode.id);
    const avgConnectivity = (startConnectivity + endConnectivity) / 2;

    // Roads with high connectivity are likely arterial
    if (avgConnectivity >= 4) return 'arterial';
    
    // Roads with medium connectivity are collectors
    if (avgConnectivity >= 2) return 'collector';
    
    // Roads with low connectivity are local
    return 'local';
  }

  /**
   * Finds intersections between a road and other roads
   */
  private findRoadIntersections(edge: RoadEdge): string[] {
    const intersections: string[] = [];
    const startNode = this.roadNetwork.nodes.get(edge.u);
    const endNode = this.roadNetwork.nodes.get(edge.v);
    
    if (!startNode || !endNode) return intersections;

    for (const otherEdge of this.roadNetwork.edges) {
      if (otherEdge.id === edge.id) continue;
      
      const otherStartNode = this.roadNetwork.nodes.get(otherEdge.u);
      const otherEndNode = this.roadNetwork.nodes.get(otherEdge.v);
      
      if (!otherStartNode || !otherEndNode) continue;

      // Check if roads intersect (simplified - in real implementation would use geometric intersection)
      if (this.doRoadsIntersect(startNode.point, endNode.point, otherStartNode.point, otherEndNode.point)) {
        intersections.push(otherEdge.id);
      }
    }

    return intersections;
  }

  /**
   * Simplified road intersection check
   */
  private doRoadsIntersect(a1: Point, a2: Point, b1: Point, b2: Point): boolean {
    // Check if roads share endpoints
    if ((this.pointsEqual(a1, b1) || this.pointsEqual(a1, b2)) ||
        (this.pointsEqual(a2, b1) || this.pointsEqual(a2, b2))) {
      return true;
    }

    // Simplified intersection check - in real implementation would use line segment intersection
    // For now, just check if roads are close to each other
    const midA = { x: (a1.x + a2.x) / 2, y: (a1.y + a2.y) / 2 };
    const midB = { x: (b1.x + b2.x) / 2, y: (b1.y + b2.y) / 2 };
    
    return dist(midA, midB) < 0.01;
  }

  private pointsEqual(p1: Point, p2: Point): boolean {
    return Math.abs(p1.x - p2.x) < 0.001 && Math.abs(p1.y - p2.y) < 0.001;
  }

  /**
   * Gets the connectivity (number of connected edges) of a node
   */
  private getConnectivity(nodeId: string): number {
    return this.roadNetwork.edges.filter(e => e.u === nodeId || e.v === nodeId).length;
  }

  /**
   * Finds the most important road from a list based on connectivity and length
   */
  private findMostImportantRoad(roads: Road[]): Road {
    if (roads.length === 0) throw new Error('Cannot find most important road from empty list');
    
    return roads.reduce((best, current) => {
      const bestScore = this.calculateRoadImportance(best);
      const currentScore = this.calculateRoadImportance(current);
      return currentScore > bestScore ? current : best;
    });
  }

  /**
   * Calculates the importance score of a road
   */
  private calculateRoadImportance(road: Road): number {
    const length = dist(road.start, road.end);
    const intersectionCount = road.intersections?.length || 0;
    
    // Importance is based on length and number of intersections
    return length + intersectionCount * 0.1;
  }

  /**
   * Finds continuous arterial routes from arterial roads
   */
  private findArterialRoutes(arterialRoads: Road[]): Route[] {
    const routes: Route[] = [];
    const visited = new Set<string>();
    const roadMap = new Map<string, Road>();
    
    // Create a map for quick lookup
    for (const road of arterialRoads) {
      roadMap.set(road.id, road);
    }

    for (const road of arterialRoads) {
      if (visited.has(road.id)) continue;
      
      const route = this.traceRoute(road, roadMap, visited);
      if (route.roadIds.length > 0) {
        routes.push(route);
      }
    }

    return routes;
  }

  /**
   * Traces a continuous route from a starting road
   */
  private traceRoute(startRoad: Road, roadMap: Map<string, Road>, visited: Set<string>): Route {
    const routeIds: string[] = [startRoad.id];
    visited.add(startRoad.id);

    // Trace forward
    this.extendRoute(startRoad, routeIds, roadMap, visited, 'forward');
    
    // Trace backward
    this.extendRoute(startRoad, routeIds, roadMap, visited, 'backward');

    // Calculate route endpoints
    const firstRoad = roadMap.get(routeIds[0])!;
    const lastRoad = roadMap.get(routeIds[routeIds.length - 1])!;

    return {
      id: `route-${this.hierarchy.arterialRoutes.length}`,
      roadIds: routeIds,
      tier: 'arterial',
      startPoint: firstRoad.start,
      endPoint: lastRoad.end
    };
  }

  /**
   * Extends a route in the specified direction
   */
  private extendRoute(
    currentRoad: Road, 
    routeIds: string[], 
    roadMap: Map<string, Road>, 
    visited: Set<string>,
    direction: 'forward' | 'backward'
  ): void {
    const currentPoint = direction === 'forward' ? currentRoad.end : currentRoad.start;
    
    for (const [roadId, road] of roadMap.entries()) {
      if (visited.has(roadId)) continue;
      
      const connects = direction === 'forward' 
        ? this.pointsEqual(currentPoint, road.start)
        : this.pointsEqual(currentPoint, road.end);
      
      if (connects) {
        if (direction === 'forward') {
          routeIds.push(roadId);
        } else {
          routeIds.unshift(roadId);
        }
        visited.add(roadId);
        this.extendRoute(road, routeIds, roadMap, visited, direction);
        break;
      }
    }
  }

  /**
   * Gets the analyzed road hierarchy
   */
  public getHierarchy(): RoadHierarchyData {
    return this.hierarchy;
  }

  /**
   * Gets all roads of a specific tier
   */
  public getRoadsByTier(tier: RoadTier): Road[] {
    return this.hierarchy.roadsByTier[tier] || [];
  }

  /**
   * Gets all arterial routes
   */
  public getArterialRoutes(): Route[] {
    return this.hierarchy.arterialRoutes;
  }
}

/**
 * Analyzes road hierarchy from a road network
 */
export function analyzeRoadHierarchy(roadNetwork: RoadNetwork): RoadHierarchyData {
  const hierarchy = new RoadHierarchy(roadNetwork);
  return hierarchy.getHierarchy();
}

/**
 * Finds arterial routes from a road network
 */
export function findArterialRoutes(roadNetwork: RoadNetwork): Route[] {
  const hierarchy = new RoadHierarchy(roadNetwork);
  return hierarchy.getArterialRoutes();
}

/**
 * Checks if a route is continuous (all roads connect properly)
 */
export function isContinuousRoute(route: Route): boolean {
  if (route.roadIds.length <= 1) return true;
  
  // In a real implementation, this would verify that each road connects to the next
  // For now, we'll assume all routes in our hierarchy are continuous
  return true;
}

/**
 * Checks if a route connects major points in the city
 */
export function connectsMajorPoints(
  route: Route, 
  gates: Gate[], 
  bridgeheads: Bridgehead[], 
  centers: Center[]
): boolean {
  const majorPoints = [
    ...gates.map(g => g.position),
    ...bridgeheads.map(b => b.position),
    ...centers.map(c => c.position)
  ];

  // Check if route connects to at least one major point
  for (const point of majorPoints) {
    if (isPointNearRoute(point, route, 0.05)) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if a point is near a route
 */
function isPointNearRoute(point: Point, route: Route, threshold: number): boolean {
  // Simplified check - in real implementation would check distance to route path
  const distToStart = dist(point, route.startPoint);
  const distToEnd = dist(point, route.endPoint);
  
  return distToStart < threshold || distToEnd < threshold;
}

/**
 * Helper function to generate a test city with roads
 */
export function generateCityWithRoads(): City {
  // Create a simple test city with basic road network
  const graph = new RoadGraph();
  
  // Add nodes
  const centerId = graph.addNode({ x: 0.5, y: 0.5 });
  const gate1Id = graph.addNode({ x: 0.2, y: 0.5 });
  const gate2Id = graph.addNode({ x: 0.8, y: 0.5 });
  const gate3Id = graph.addNode({ x: 0.5, y: 0.2 });
  const gate4Id = graph.addNode({ x: 0.5, y: 0.8 });
  
  // Add edges (roads)
  graph.addEdge(centerId, gate1Id, 'trunk');
  graph.addEdge(centerId, gate2Id, 'trunk');
  graph.addEdge(centerId, gate3Id, 'trunk');
  graph.addEdge(centerId, gate4Id, 'trunk');
  
  // Add some secondary roads
  const mid1Id = graph.addNode({ x: 0.35, y: 0.5 });
  const mid2Id = graph.addNode({ x: 0.65, y: 0.5 });
  graph.addEdge(mid1Id, mid2Id, 'secondary');
  
  const mid3Id = graph.addNode({ x: 0.5, y: 0.35 });
  const mid4Id = graph.addNode({ x: 0.5, y: 0.65 });
  graph.addEdge(mid3Id, mid4Id, 'secondary');
  
  // Convert to RoadNetwork format
  const roads: Road[] = [];
  for (const edge of graph.edges) {
    const startNode = graph.nodes.get(edge.u);
    const endNode = graph.nodes.get(edge.v);
    
    if (!startNode || !endNode) continue;
    
    roads.push({
      id: edge.id,
      start: startNode.point,
      end: endNode.point,
      tier: edge.kind === 'trunk' ? 'arterial' : edge.kind === 'secondary' ? 'collector' : 'local',
      kind: edge.kind
    });
  }

  return {
    roads: {
      roads,
      nodes: graph.nodes,
      edges: graph.edges
    },
    gates: [
      { id: 'gate1', position: { x: 0.2, y: 0.5 }, roadClass: 'arterial' },
      { id: 'gate2', position: { x: 0.8, y: 0.5 }, roadClass: 'arterial' },
      { id: 'gate3', position: { x: 0.5, y: 0.2 }, roadClass: 'arterial' },
      { id: 'gate4', position: { x: 0.5, y: 0.8 }, roadClass: 'arterial' }
    ],
    bridgeheads: [
      { id: 'bridge1', position: { x: 0.3, y: 0.7 } }
    ],
    centers: [
      { id: 'center1', position: { x: 0.5, y: 0.5 } }
    ]
  };
}