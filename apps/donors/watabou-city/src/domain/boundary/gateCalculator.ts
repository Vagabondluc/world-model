// @ts-nocheck
import { Point, dist } from '../types';
import { RoadNetwork, Road, RoadTier } from '../roads/hierarchy';

export interface Wall {
  id: string;
  polygon: Point[];
  perimeter: number;
}

export interface Gate {
  id: string;
  position: Point;
  roadClass: RoadTier;
  wallId: string;
}

export interface HighDemandContact {
  position: Point;
  wallId: string;
  demand: number;
}

export interface City {
  walls: Wall[];
  roads: RoadNetwork;
  gates: Gate[];
  config: CityConfig;
}

export interface CityConfig {
  targetGateSpacing: number;
  minGates: number;
  maxGates: number;
}

/**
 * GateCalculator class derives gate count from perimeter and access demand,
 * ensuring appropriate gate placement and connectivity.
 */
export class GateCalculator {
  private walls: Wall[];
  private roadNetwork: RoadNetwork;
  private config: CityConfig;
  private gates: Gate[] = [];

  constructor(walls: Wall[], roadNetwork: RoadNetwork, config: CityConfig) {
    this.walls = walls;
    this.roadNetwork = roadNetwork;
    this.config = config;
  }

  /**
   * Generates gates for the city walls
   */
  public generateGates(): Gate[] {
    this.gates = [];
    
    // Calculate expected gate count based on perimeter
    const expectedGateCount = this.calculateExpectedGateCount();
    
    // Find high-demand wall contact points
    const highDemandContacts = this.findHighDemandWallContacts();
    
    // Place gates at high-demand contacts first
    this.placeGatesAtHighDemandContacts(highDemandContacts);
    
    // Fill remaining gates with regular spacing
    this.placeRegularlySpacedGates(expectedGateCount);
    
    // Ensure all gates are connected to roads
    this.ensureGateConnectivity();
    
    return this.gates;
  }

  /**
   * Calculates the expected gate count based on perimeter and configuration
   */
  private calculateExpectedGateCount(): number {
    if (this.walls.length === 0) return this.config.minGates;
    
    // Calculate total perimeter of all walls
    const totalPerimeter = this.walls.reduce((sum, wall) => sum + wall.perimeter, 0);
    
    // Calculate gate count based on target spacing
    let gateCount = Math.ceil(totalPerimeter / this.config.targetGateSpacing);
    
    // Apply min/max constraints
    gateCount = Math.max(this.config.minGates, gateCount);
    gateCount = Math.min(this.config.maxGates, gateCount);
    
    return gateCount;
  }

  /**
   * Finds high-demand wall contact points
   */
  private findHighDemandWallContacts(): HighDemandContact[] {
    const contacts: HighDemandContact[] = [];
    
    // Find road-wall intersections
    for (const road of this.roadNetwork.roads) {
      const intersections = this.findRoadWallIntersections(road);
      
      for (const intersection of intersections) {
        // Calculate demand based on road importance
        const demand = this.calculateRoadDemand(road);
        
        contacts.push({
          position: intersection.position,
          wallId: intersection.wallId,
          demand
        });
      }
    }
    
    // Sort by demand (highest first)
    contacts.sort((a, b) => b.demand - a.demand);
    
    return contacts;
  }

  /**
   * Finds intersections between a road and walls
   */
  private findRoadWallIntersections(road: Road): Array<{ position: Point; wallId: string }> {
    const intersections: Array<{ position: Point; wallId: string }> = [];
    
    for (const wall of this.walls) {
      const intersection = this.findRoadWallIntersection(road, wall);
      if (intersection) {
        intersections.push({
          position: intersection,
          wallId: wall.id
        });
      }
    }
    
    return intersections;
  }

  /**
   * Finds the intersection between a road and a wall
   */
  private findRoadWallIntersection(road: Road, wall: Wall): Point | null {
    for (let i = 0; i < wall.polygon.length; i++) {
      const wallStart = wall.polygon[i];
      const wallEnd = wall.polygon[(i + 1) % wall.polygon.length];
      
      const intersection = this.lineSegmentIntersection(
        road.start, road.end,
        wallStart, wallEnd
      );
      
      if (intersection) {
        return intersection;
      }
    }
    
    return null;
  }

  /**
   * Finds the intersection between two line segments
   */
  private lineSegmentIntersection(
    a1: Point, a2: Point,
    b1: Point, b2: Point
  ): Point | null {
    const r = { x: a2.x - a1.x, y: a2.y - a1.y };
    const s = { x: b2.x - b1.x, y: b2.y - b1.y };
    
    const denominator = r.x * s.y - r.y * s.x;
    
    if (Math.abs(denominator) < 0.0001) return null; // Parallel
    
    const t = ((b1.x - a1.x) * s.y - (b1.y - a1.y) * s.x) / denominator;
    const u = ((b1.x - a1.x) * r.y - (b1.y - a1.y) * r.x) / denominator;
    
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: a1.x + r.x * t,
        y: a1.y + r.y * t
      };
    }
    
    return null;
  }

  /**
   * Calculates the demand of a road
   */
  private calculateRoadDemand(road: Road): number {
    let demand = 1;
    
    // Higher tier roads have higher demand
    switch (road.tier) {
      case 'arterial':
        demand = 10;
        break;
      case 'collector':
        demand = 5;
        break;
      case 'local':
        demand = 1;
        break;
    }
    
    // Longer roads have slightly higher demand
    const length = dist(road.start, road.end);
    demand *= (1 + length * 2);
    
    return demand;
  }

  /**
   * Places gates at high-demand wall contact points
   */
  private placeGatesAtHighDemandContacts(contacts: HighDemandContact[]): void {
    const maxGatesFromDemand = Math.floor(this.config.maxGates * 0.6); // Max 60% from demand
    
    for (let i = 0; i < Math.min(contacts.length, maxGatesFromDemand); i++) {
      const contact = contacts[i];
      
      // Check if gate already exists near this position
      const existingGate = this.findGateNearPosition(contact.position, 0.05);
      if (existingGate) continue;
      
      // Determine road class based on demand
      let roadClass: RoadTier;
      if (contact.demand >= 8) {
        roadClass = 'arterial';
      } else if (contact.demand >= 4) {
        roadClass = 'collector';
      } else {
        roadClass = 'local';
      }
      
      // Create gate
      const gate: Gate = {
        id: `gate-demand-${this.gates.length}`,
        position: contact.position,
        roadClass,
        wallId: contact.wallId
      };
      
      this.gates.push(gate);
    }
  }

  /**
   * Places regularly spaced gates along walls
   */
  private placeRegularlySpacedGates(targetCount: number): void {
    const remainingGates = targetCount - this.gates.length;
    if (remainingGates <= 0) return;
    
    for (const wall of this.walls) {
      const wallLength = wall.perimeter;
      const gatesForThisWall = Math.ceil(remainingGates * (wallLength / this.getTotalPerimeter()));
      
      // Place gates at regular intervals along the wall
      const spacing = wallLength / gatesForThisWall;
      
      for (let i = 0; i < gatesForThisWall; i++) {
        const distance = spacing * (i + 0.5); // Center in each segment
        const position = this.findPointAlongWall(wall, distance);
        
        if (position) {
          // Check if gate already exists near this position
          const existingGate = this.findGateNearPosition(position, 0.05);
          if (existingGate) continue;
          
          // Create gate with default road class
          const gate: Gate = {
            id: `gate-regular-${this.gates.length}`,
            position,
            roadClass: 'collector', // Default to collector for regular gates
            wallId: wall.id
          };
          
          this.gates.push(gate);
        }
      }
    }
  }

  /**
   * Finds a point at a specific distance along a wall
   */
  private findPointAlongWall(wall: Wall, distance: number): Point | null {
    if (wall.polygon.length < 2) return null;
    
    let accumulatedDistance = 0;
    
    for (let i = 0; i < wall.polygon.length; i++) {
      const start = wall.polygon[i];
      const end = wall.polygon[(i + 1) % wall.polygon.length];
      const segmentLength = dist(start, end);
      
      if (accumulatedDistance + segmentLength >= distance) {
        // Point is on this segment
        const t = (distance - accumulatedDistance) / segmentLength;
        return {
          x: start.x + (end.x - start.x) * t,
          y: start.y + (end.y - start.y) * t
        };
      }
      
      accumulatedDistance += segmentLength;
    }
    
    return null;
  }

  /**
   * Gets the total perimeter of all walls
   */
  private getTotalPerimeter(): number {
    return this.walls.reduce((sum, wall) => sum + wall.perimeter, 0);
  }

  /**
   * Finds a gate near a specific position
   */
  private findGateNearPosition(position: Point, threshold: number): Gate | null {
    for (const gate of this.gates) {
      if (dist(gate.position, position) < threshold) {
        return gate;
      }
    }
    
    return null;
  }

  /**
   * Ensures all gates are connected to roads
   */
  private ensureGateConnectivity(): void {
    for (const gate of this.gates) {
      const connectedRoad = this.findConnectedRoad(gate.position);
      
      if (!connectedRoad) {
        // Create a connecting road
        this.createConnectingRoad(gate);
      }
    }
  }

  /**
   * Finds a road connected to a specific position
   */
  private findConnectedRoad(position: Point): Road | null {
    const threshold = 0.05;
    
    for (const road of this.roadNetwork.roads) {
      const distance = this.distanceToRoad(position, road);
      if (distance < threshold) {
        return road;
      }
    }
    
    return null;
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
   * Creates a connecting road from a gate
   */
  private createConnectingRoad(gate: Gate): void {
    // Find a suitable direction for the connecting road
    const direction = this.findConnectingRoadDirection(gate);
    
    // Create a short connecting road
    const road: Road = {
      id: `road-${gate.id}`,
      start: gate.position,
      end: {
        x: gate.position.x + Math.cos(direction) * 0.1,
        y: gate.position.y + Math.sin(direction) * 0.1
      },
      tier: gate.roadClass
    };
    
    // Add the road to the road network
    this.roadNetwork.roads.push(road);
  }

  /**
   * Finds a suitable direction for a connecting road
   */
  private findConnectingRoadDirection(gate: Gate): number {
    // Find the wall this gate belongs to
    const wall = this.walls.find(w => w.id === gate.wallId);
    if (!wall) return Math.random() * Math.PI * 2;
    
    // Find the wall segment nearest to the gate
    let nearestSegment = 0;
    let minDistance = Infinity;
    
    for (let i = 0; i < wall.polygon.length; i++) {
      const start = wall.polygon[i];
      const end = wall.polygon[(i + 1) % wall.polygon.length];
      
      const distance = this.distanceToLineSegment(gate.position, start, end);
      if (distance < minDistance) {
        minDistance = distance;
        nearestSegment = i;
      }
    }
    
    // Calculate the normal to the wall segment
    const start = wall.polygon[nearestSegment];
    const end = wall.polygon[(nearestSegment + 1) % wall.polygon.length];
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    // Normal points inward (perpendicular to wall)
    const normal = { x: -dy, y: dx };
    const length = Math.hypot(normal.x, normal.y);
    
    if (length > 0) {
      normal.x /= length;
      normal.y /= length;
    }
    
    // Return the angle of the normal
    return Math.atan2(normal.y, normal.x);
  }

  /**
   * Gets all generated gates
   */
  public getGates(): Gate[] {
    return this.gates;
  }

  /**
   * Validates that gate count is within bounds
   */
  public validateGateCount(): boolean {
    return this.gates.length >= this.config.minGates && 
           this.gates.length <= this.config.maxGates;
  }

  /**
   * Validates that gate count is based on perimeter and demand
   */
  public validateGateCalculation(): boolean {
    const expectedCount = this.calculateExpectedGateCount();
    const actualCount = this.gates.length;
    
    // Allow some tolerance
    return Math.abs(actualCount - expectedCount) <= 1;
  }

  /**
   * Validates that no orphan gates exist
   */
  public validateGateConnectivity(): boolean {
    for (const gate of this.gates) {
      const connectedRoad = this.findConnectedRoad(gate.position);
      if (!connectedRoad) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Validates that no unresolved high-demand wall contacts exist
   */
  public validateHighDemandResolution(): boolean {
    const highDemandContacts = this.findHighDemandWallContacts();
    
    for (const contact of highDemandContacts) {
      const nearbyGate = this.findGateNearPosition(contact.position, 0.05);
      if (!nearbyGate) {
        return false;
      }
    }
    
    return true;
  }
}

/**
 * Generates gates for a city
 */
export function generateGates(city: City): Gate[] {
  const calculator = new GateCalculator(city.walls, city.roads, city.config);
  return calculator.generateGates();
}

/**
 * Checks if a gate is connected to the road network
 */
export function isGateConnected(gate: Gate, roadNetwork: RoadNetwork): boolean {
  const threshold = 0.05;
  
  for (const road of roadNetwork.roads) {
    const distance = distanceToRoad(gate.position, road);
    if (distance < threshold) {
      return true;
    }
  }
  
  return false;
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
 * Finds high-demand wall contacts that are not resolved by gates
 */
export function findHighDemandWallContacts(city: City): HighDemandContact[] {
  const calculator = new GateCalculator(city.walls, city.roads, city.config);
  const highDemandContacts = calculator['findHighDemandWallContacts']();
  
  // Filter out contacts that already have gates
  const unresolvedContacts = highDemandContacts.filter(contact => {
    for (const gate of city.gates) {
      if (dist(gate.position, contact.position) < 0.05) {
        return false;
      }
    }
    return true;
  });
  
  return unresolvedContacts;
}

/**
 * Generates a test city with walls for testing
 */
export function generateCityWithWalls(): City {
  const wallPolygon: Point[] = [
    { x: 0.2, y: 0.2 },
    { x: 0.8, y: 0.2 },
    { x: 0.8, y: 0.8 },
    { x: 0.2, y: 0.8 }
  ];
  
  // Calculate perimeter
  let perimeter = 0;
  for (let i = 0; i < wallPolygon.length; i++) {
    const start = wallPolygon[i];
    const end = wallPolygon[(i + 1) % wallPolygon.length];
    perimeter += dist(start, end);
  }
  
  return {
    walls: [
      {
        id: 'wall1',
        polygon: wallPolygon,
        perimeter
      }
    ],
    roads: {
      roads: [
        {
          id: 'road1',
          start: { x: 0.1, y: 0.5 },
          end: { x: 0.2, y: 0.5 },
          tier: 'arterial'
        },
        {
          id: 'road2',
          start: { x: 0.8, y: 0.5 },
          end: { x: 0.9, y: 0.5 },
          tier: 'arterial'
        }
      ],
      nodes: new Map(),
      edges: []
    },
    gates: [],
    config: {
      targetGateSpacing: 0.3,
      minGates: 2,
      maxGates: 6
    }
  };
}