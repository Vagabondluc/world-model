// @ts-nocheck
import { Point, dist } from '../types';
import { RoadNetwork, Road, RoadTier } from '../roads/hierarchy';

export interface Bridge {
  id: string;
  position: Point;
  axis: { angle: number; length: number };
  endpoints: Array<{ position: Point; roadClass?: RoadTier }>;
}

export interface Bridgehead {
  id: string;
  polygon: Point[];
  bridgeId: string;
  position: Point;
  connectedRoads: string[];
}

export interface City {
  bridges: Bridge[];
  bridgeheads: Bridgehead[];
  roads: RoadNetwork;
  config: CityConfig;
}

export interface CityConfig {
  bridgeheadSize: number;
  bridgeheadShape: 'circular' | 'octagonal' | 'square';
}

/**
 * BridgeheadGenerator class generates bridgehead node polygons for each bridge endpoint
 * with arterial continuation to ensure proper connectivity.
 */
export class BridgeheadGenerator {
  private bridges: Bridge[];
  private roadNetwork: RoadNetwork;
  private config: CityConfig;
  private bridgeheads: Bridgehead[] = [];

  constructor(
    bridges: Bridge[], 
    roadNetwork: RoadNetwork, 
    config: CityConfig
  ) {
    this.bridges = bridges;
    this.roadNetwork = roadNetwork;
    this.config = config;
  }

  /**
   * Generates bridgeheads for all bridges
   */
  public generateBridgeheads(): Bridgehead[] {
    this.bridgeheads = [];
    
    for (const bridge of this.bridges) {
      const bridgeheadsForBridge = this.generateBridgeheadsForBridge(bridge);
      this.bridgeheads.push(...bridgeheadsForBridge);
    }
    
    // Ensure arterial continuation from bridgeheads
    this.ensureArterialContinuation();
    
    return this.bridgeheads;
  }

  /**
   * Generates bridgeheads for a single bridge
   */
  private generateBridgeheadsForBridge(bridge: Bridge): Bridgehead[] {
    const bridgeheads: Bridgehead[] = [];
    
    for (let i = 0; i < bridge.endpoints.length; i++) {
      const endpoint = bridge.endpoints[i];
      const bridgeheadId = `${bridge.id}-head-${i}`;
      
      // Create bridgehead polygon
      const polygon = this.createBridgeheadPolygon(endpoint.position, bridgeheadId);
      
      // Find connected roads
      const connectedRoads = this.findConnectedRoads(endpoint.position);
      
      const bridgehead: Bridgehead = {
        id: bridgeheadId,
        polygon,
        bridgeId: bridge.id,
        position: endpoint.position,
        connectedRoads
      };
      
      bridgeheads.push(bridgehead);
    }
    
    return bridgeheads;
  }

  /**
   * Creates a bridgehead polygon at a specific position
   */
  private createBridgeheadPolygon(position: Point, bridgeheadId: string): Point[] {
    const size = this.config.bridgeheadSize;
    const shape = this.config.bridgeheadShape;
    const polygon: Point[] = [];
    
    switch (shape) {
      case 'circular':
        return this.createCircularBridgehead(position, size);
      case 'octagonal':
        return this.createOctagonalBridgehead(position, size);
      case 'square':
        return this.createSquareBridgehead(position, size);
      default:
        return this.createCircularBridgehead(position, size);
    }
  }

  /**
   * Creates a circular bridgehead polygon
   */
  private createCircularBridgehead(center: Point, radius: number): Point[] {
    const polygon: Point[] = [];
    const segments = 16; // Number of segments to approximate a circle
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      polygon.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius
      });
    }
    
    return polygon;
  }

  /**
   * Creates an octagonal bridgehead polygon
   */
  private createOctagonalBridgehead(center: Point, size: number): Point[] {
    const polygon: Point[] = [];
    const radius = size / 2;
    const sides = 8;
    
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / sides; // Start from top
      polygon.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius
      });
    }
    
    return polygon;
  }

  /**
   * Creates a square bridgehead polygon
   */
  private createSquareBridgehead(center: Point, size: number): Point[] {
    const halfSize = size / 2;
    
    return [
      { x: center.x - halfSize, y: center.y - halfSize },
      { x: center.x + halfSize, y: center.y - halfSize },
      { x: center.x + halfSize, y: center.y + halfSize },
      { x: center.x - halfSize, y: center.y + halfSize }
    ];
  }

  /**
   * Finds roads connected to a bridgehead position
   */
  private findConnectedRoads(position: Point): string[] {
    const connectedRoads: string[] = [];
    const threshold = 0.05; // Maximum distance to consider a road connected
    
    for (const road of this.roadNetwork.roads) {
      const distance = this.distanceToRoad(position, road);
      if (distance < threshold) {
        connectedRoads.push(road.id);
      }
    }
    
    return connectedRoads;
  }

  /**
   * Calculates the distance from a point to a road
   */
  private distanceToRoad(point: Point, road: Road): number {
    return this.distanceToLineSegment(point, road.start, road.end);
  }

  /**
   * Calculates the distance from a point to a line segment
   */
  private distanceToLineSegment(point: Point, start: Point, end: Point): number {
    const lineLength = dist(start, end);
    
    if (lineLength === 0) return dist(point, start);
    
    const t = Math.max(0, Math.min(1, 
      ((point.x - start.x) * (end.x - start.x) + 
       (point.y - start.y) * (end.y - start.y)) / (lineLength * lineLength)
    ));
    
    const projection = {
      x: start.x + t * (end.x - start.x),
      y: start.y + t * (end.y - start.y)
    };
    
    return dist(point, projection);
  }

  /**
   * Ensures arterial continuation from bridgeheads
   */
  private ensureArterialContinuation(): void {
    for (const bridgehead of this.bridgeheads) {
      // Check if bridgehead has arterial connection
      const hasArterialConnection = this.hasArterialConnection(bridgehead);
      
      if (!hasArterialConnection) {
        // Create arterial continuation
        this.createArterialContinuation(bridgehead);
      }
    }
  }

  /**
   * Checks if a bridgehead has arterial connection
   */
  private hasArterialConnection(bridgehead: Bridgehead): boolean {
    for (const roadId of bridgehead.connectedRoads) {
      const road = this.roadNetwork.roads.find(r => r.id === roadId);
      if (road && road.tier === 'arterial') {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Creates arterial continuation from a bridgehead
   */
  private createArterialContinuation(bridgehead: Bridgehead): void {
    // Find the best direction for arterial continuation
    const direction = this.findBestContinuationDirection(bridgehead);
    
    // Create a new arterial road from the bridgehead
    const newRoad: Road = {
      id: `arterial-${bridgehead.id}`,
      start: bridgehead.position,
      end: {
        x: bridgehead.position.x + Math.cos(direction) * 0.2,
        y: bridgehead.position.y + Math.sin(direction) * 0.2
      },
      tier: 'arterial'
    };
    
    // Add the road to the road network
    this.roadNetwork.roads.push(newRoad);
    
    // Update bridgehead connections
    bridgehead.connectedRoads.push(newRoad.id);
  }

  /**
   * Finds the best direction for arterial continuation
   */
  private findBestContinuationDirection(bridgehead: Bridgehead): number {
    // Find the bridge this bridgehead belongs to
    const bridge = this.bridges.find(b => b.id === bridgehead.bridgeId);
    if (!bridge) return Math.random() * Math.PI * 2;
    
    // Find which endpoint this bridgehead corresponds to
    const endpointIndex = bridge.endpoints.findIndex(
      ep => this.pointsEqual(ep.position, bridgehead.position)
    );
    
    if (endpointIndex === -1) return Math.random() * Math.PI * 2;
    
    // Calculate perpendicular direction to bridge axis
    const bridgeAngle = bridge.axis.angle;
    const perpendicularAngle = bridgeAngle + Math.PI / 2;
    
    // Add some variation based on existing roads
    let bestDirection = perpendicularAngle;
    let bestScore = -Infinity;
    
    for (let angle = perpendicularAngle - Math.PI / 4; 
         angle <= perpendicularAngle + Math.PI / 4; 
         angle += Math.PI / 8) {
      
      const score = this.evaluateDirection(bridgehead.position, angle);
      if (score > bestScore) {
        bestScore = score;
        bestDirection = angle;
      }
    }
    
    return bestDirection;
  }

  /**
   * Evaluates a direction for arterial continuation
   */
  private evaluateDirection(position: Point, direction: number): number {
    let score = 0;
    
    // Check if direction leads toward city center
    const cityCenter = this.findCityCenter();
    const toCenter = Math.atan2(
      cityCenter.y - position.y,
      cityCenter.x - position.x
    );
    
    let angleDiff = Math.abs(direction - toCenter);
    if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
    
    // Prefer directions toward city center
    score += (Math.PI - angleDiff) * 2;
    
    // Check for conflicts with existing roads
    for (const road of this.roadNetwork.roads) {
      const roadAngle = Math.atan2(
        road.end.y - road.start.y,
        road.end.x - road.start.x
      );
      
      let roadAngleDiff = Math.abs(direction - roadAngle);
      if (roadAngleDiff > Math.PI) roadAngleDiff = 2 * Math.PI - roadAngleDiff;
      
      // Penalize directions that are too similar to existing roads
      if (roadAngleDiff < Math.PI / 8) {
        score -= 5;
      }
    }
    
    // Add some randomness for variety
    score += Math.random() * 2;
    
    return score;
  }

  /**
   * Finds the approximate center of the city
   */
  private findCityCenter(): Point {
    if (this.roadNetwork.roads.length === 0) {
      return { x: 0.5, y: 0.5 };
    }

    let sumX = 0;
    let sumY = 0;
    let count = 0;

    for (const road of this.roadNetwork.roads) {
      sumX += road.start.x + road.end.x;
      sumY += road.start.y + road.end.y;
      count += 2;
    }

    return {
      x: sumX / count,
      y: sumY / count
    };
  }

  /**
   * Checks if two points are equal within a tolerance
   */
  private pointsEqual(p1: Point, p2: Point): boolean {
    return Math.abs(p1.x - p2.x) < 0.001 && Math.abs(p1.y - p2.y) < 0.001;
  }

  /**
   * Gets all generated bridgeheads
   */
  public getBridgeheads(): Bridgehead[] {
    return this.bridgeheads;
  }

  /**
   * Finds bridgeheads for a specific bridge
   */
  public findBridgeheadsForBridge(bridge: Bridge): Bridgehead[] {
    return this.bridgeheads.filter(bh => bh.bridgeId === bridge.id);
  }

  /**
   * Validates that each bridge has at least one bridgehead
   */
  public validateBridgeheadCoverage(): boolean {
    for (const bridge of this.bridges) {
      const bridgeheadsForBridge = this.findBridgeheadsForBridge(bridge);
      if (bridgeheadsForBridge.length === 0) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Validates that each bridge endpoint has arterial continuation
   */
  public validateArterialContinuation(): boolean {
    for (const bridgehead of this.bridgeheads) {
      if (!this.hasArterialConnection(bridgehead)) {
        return false;
      }
    }
    
    return true;
  }
}

/**
 * Finds bridgeheads for a bridge
 */
export function findBridgeheadsForBridge(bridge: Bridge, bridgeheads: Bridgehead[]): Bridgehead[] {
  return bridgeheads.filter(bh => bh.bridgeId === bridge.id);
}

/**
 * Finds outgoing roads from a bridge endpoint
 */
export function findOutgoingRoads(endpoint: { position: Point }, roadNetwork: RoadNetwork): Road[] {
  const outgoingRoads: Road[] = [];
  const threshold = 0.05; // Maximum distance to consider a road connected
  
  for (const road of roadNetwork.roads) {
    const distance = distanceToRoad(endpoint.position, road);
    if (distance < threshold) {
      outgoingRoads.push(road);
    }
  }
  
  return outgoingRoads;
}

/**
 * Calculates distance from a point to a road
 */
function distanceToRoad(point: Point, road: Road): number {
  return distanceToLineSegment(point, road.start, road.end);
}

/**
 * Calculates distance from a point to a line segment
 */
function distanceToLineSegment(point: Point, start: Point, end: Point): number {
  const lineLength = dist(start, end);
  
  if (lineLength === 0) return dist(point, start);
  
  const t = Math.max(0, Math.min(1, 
    ((point.x - start.x) * (end.x - start.x) + 
     (point.y - start.y) * (end.y - start.y)) / (lineLength * lineLength)
  ));
  
  const projection = {
    x: start.x + t * (end.x - start.x),
    y: start.y + t * (end.y - start.y)
  };
  
  return dist(point, projection);
}

/**
 * Generates a test city with bridges for testing
 */
export function generateCityWithBridges(): City {
  return {
    bridges: [
      {
        id: 'bridge1',
        position: { x: 0.5, y: 0.5 },
        axis: { angle: 0, length: 0.2 },
        endpoints: [
          { position: { x: 0.4, y: 0.5 }, roadClass: 'collector' },
          { position: { x: 0.6, y: 0.5 }, roadClass: 'collector' }
        ]
      }
    ],
    bridgeheads: [],
    roads: {
      roads: [
        {
          id: 'road1',
          start: { x: 0.3, y: 0.5 },
          end: { x: 0.4, y: 0.5 },
          tier: 'collector'
        },
        {
          id: 'road2',
          start: { x: 0.6, y: 0.5 },
          end: { x: 0.7, y: 0.5 },
          tier: 'collector'
        }
      ],
      nodes: new Map(),
      edges: []
    },
    config: {
      bridgeheadSize: 0.05,
      bridgeheadShape: 'octagonal'
    }
  };
}