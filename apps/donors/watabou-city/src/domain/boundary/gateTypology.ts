// @ts-nocheck
import { Point, dist } from '../types';
import { RoadTier } from '../roads/hierarchy';

export interface Gate {
  id: string;
  position: Point;
  roadClass: RoadTier;
  type?: GateType;
  wallId: string;
  districtImportance?: number;
}

export type GateType = 'simple' | 'barbican' | 'river' | 'postern';

export interface City {
  gates: Gate[];
  roads: RoadNetwork;
  districts: District[];
}

export interface RoadNetwork {
  roads: Road[];
}

export interface Road {
  id: string;
  start: Point;
  end: Point;
  tier: RoadTier;
}

export interface District {
  id: string;
  polygon: Point[];
  importance: number;
  type: string;
}

/**
 * GateTypology class supports distinct gate types with deterministic selection
 * based on road class and district importance.
 */
export class GateTypology {
  private gates: Gate[];
  private roadNetwork: RoadNetwork;
  private districts: District[];

  constructor(
    gates: Gate[], 
    roadNetwork: RoadNetwork, 
    districts: District[] = []
  ) {
    this.gates = gates;
    this.roadNetwork = roadNetwork;
    this.districts = districts;
  }

  /**
   * Assigns types to all gates based on deterministic selection
   */
  public assignGateTypes(): Gate[] {
    for (const gate of this.gates) {
      // Determine district importance for this gate
      const districtImportance = this.getDistrictImportance(gate);
      gate.districtImportance = districtImportance;
      
      // Determine gate type based on road class and district importance
      gate.type = this.determineGateType(gate.roadClass, districtImportance);
    }
    
    return this.gates;
  }

  /**
   * Determines the district importance for a gate
   */
  private getDistrictImportance(gate: Gate): number {
    if (this.districts.length === 0) {
      return 0.5; // Default importance
    }
    
    // Find which district the gate belongs to
    for (const district of this.districts) {
      if (this.isPointInPolygon(gate.position, district.polygon)) {
        return district.importance;
      }
    }
    
    // If not in any district, use default importance
    return 0.5;
  }

  /**
   * Checks if a point is inside a polygon
   */
  private isPointInPolygon(point: Point, polygon: Point[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      const intersect = ((yi > point.y) !== (yj > point.y)) &&
          (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * Determines the gate type based on road class and district importance
   */
  public determineGateType(roadClass: RoadTier, districtImportance: number): GateType {
    // Create a deterministic seed based on road class and district importance
    const seed = this.createSeed(roadClass, districtImportance);
    
    // Use the seed to make deterministic decisions
    const random = this.seededRandom(seed);
    
    // Determine gate type based on rules
    if (roadClass === 'arterial' && districtImportance >= 0.8) {
      // High-importance arterial roads get barbicans
      return 'barbican';
    } else if (roadClass === 'arterial' && districtImportance >= 0.5) {
      // Medium-importance arterial roads get simple gates
      return 'simple';
    } else if (roadClass === 'arterial') {
      // Low-importance arterial roads might get posterns
      return random < 0.3 ? 'postern' : 'simple';
    } else if (roadClass === 'collector' && districtImportance >= 0.7) {
      // High-importance collector roads get simple gates
      return 'simple';
    } else if (roadClass === 'collector') {
      // Medium/low-importance collector roads get posterns
      return 'postern';
    } else {
      // Local roads get posterns
      return 'postern';
    }
  }

  /**
   * Creates a deterministic seed from road class and district importance
   */
  private createSeed(roadClass: RoadTier, districtImportance: number): number {
    let classValue = 0;
    switch (roadClass) {
      case 'arterial':
        classValue = 3;
        break;
      case 'collector':
        classValue = 2;
        break;
      case 'local':
        classValue = 1;
        break;
    }
    
    // Combine class and importance to create a seed
    return classValue * 1000 + Math.floor(districtImportance * 1000);
  }

  /**
   * Simple seeded random number generator
   */
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Generates geometry for a specific gate type
   */
  public generateGateGeometry(gate: Gate): Point[] {
    if (!gate.type) {
      gate.type = this.determineGateType(gate.roadClass, gate.districtImportance || 0.5);
    }
    
    switch (gate.type) {
      case 'simple':
        return this.generateSimpleGateGeometry(gate);
      case 'barbican':
        return this.generateBarbicanGeometry(gate);
      case 'river':
        return this.generateRiverGateGeometry(gate);
      case 'postern':
        return this.generatePosternGeometry(gate);
      default:
        return this.generateSimpleGateGeometry(gate);
    }
  }

  /**
   * Generates geometry for a simple gate
   */
  private generateSimpleGateGeometry(gate: Gate): Point[] {
    const width = 0.02;
    const depth = 0.01;
    
    // Calculate the direction of the wall at this point
    const direction = this.getWallDirection(gate);
    
    // Calculate perpendicular direction
    const perpDirection = direction + Math.PI / 2;
    
    // Create gate geometry
    return [
      {
        x: gate.position.x + Math.cos(perpDirection) * width / 2,
        y: gate.position.y + Math.sin(perpDirection) * width / 2
      },
      {
        x: gate.position.x + Math.cos(perpDirection) * width / 2 + Math.cos(direction) * depth,
        y: gate.position.y + Math.sin(perpDirection) * width / 2 + Math.sin(direction) * depth
      },
      {
        x: gate.position.x - Math.cos(perpDirection) * width / 2 + Math.cos(direction) * depth,
        y: gate.position.y - Math.sin(perpDirection) * width / 2 + Math.sin(direction) * depth
      },
      {
        x: gate.position.x - Math.cos(perpDirection) * width / 2,
        y: gate.position.y - Math.sin(perpDirection) * width / 2
      }
    ];
  }

  /**
   * Generates geometry for a barbican gate
   */
  private generateBarbicanGeometry(gate: Gate): Point[] {
    const width = 0.04;
    const depth = 0.03;
    const towerRadius = 0.015;
    
    // Calculate the direction of the wall at this point
    const direction = this.getWallDirection(gate);
    
    // Calculate perpendicular direction
    const perpDirection = direction + Math.PI / 2;
    
    // Create main gate structure
    const mainGate = [
      {
        x: gate.position.x + Math.cos(perpDirection) * width / 2,
        y: gate.position.y + Math.sin(perpDirection) * width / 2
      },
      {
        x: gate.position.x + Math.cos(perpDirection) * width / 2 + Math.cos(direction) * depth,
        y: gate.position.y + Math.sin(perpDirection) * width / 2 + Math.sin(direction) * depth
      },
      {
        x: gate.position.x - Math.cos(perpDirection) * width / 2 + Math.cos(direction) * depth,
        y: gate.position.y - Math.sin(perpDirection) * width / 2 + Math.sin(direction) * depth
      },
      {
        x: gate.position.x - Math.cos(perpDirection) * width / 2,
        y: gate.position.y - Math.sin(perpDirection) * width / 2
      }
    ];
    
    // Add tower positions (simplified - just return main gate)
    return mainGate;
  }

  /**
   * Generates geometry for a river gate
   */
  private generateRiverGateGeometry(gate: Gate): Point[] {
    const width = 0.03;
    const depth = 0.02;
    
    // Calculate the direction of the wall at this point
    const direction = this.getWallDirection(gate);
    
    // Calculate perpendicular direction
    const perpDirection = direction + Math.PI / 2;
    
    // Create gate with water control structure
    return [
      {
        x: gate.position.x + Math.cos(perpDirection) * width / 2,
        y: gate.position.y + Math.sin(perpDirection) * width / 2
      },
      {
        x: gate.position.x + Math.cos(perpDirection) * width / 2 + Math.cos(direction) * depth,
        y: gate.position.y + Math.sin(perpDirection) * width / 2 + Math.sin(direction) * depth
      },
      {
        x: gate.position.x - Math.cos(perpDirection) * width / 2 + Math.cos(direction) * depth,
        y: gate.position.y - Math.sin(perpDirection) * width / 2 + Math.sin(direction) * depth
      },
      {
        x: gate.position.x - Math.cos(perpDirection) * width / 2,
        y: gate.position.y - Math.sin(perpDirection) * width / 2
      }
    ];
  }

  /**
   * Generates geometry for a postern gate
   */
  private generatePosternGeometry(gate: Gate): Point[] {
    const width = 0.015;
    const depth = 0.008;
    
    // Calculate the direction of the wall at this point
    const direction = this.getWallDirection(gate);
    
    // Calculate perpendicular direction
    const perpDirection = direction + Math.PI / 2;
    
    // Create small gate geometry
    return [
      {
        x: gate.position.x + Math.cos(perpDirection) * width / 2,
        y: gate.position.y + Math.sin(perpDirection) * width / 2
      },
      {
        x: gate.position.x + Math.cos(perpDirection) * width / 2 + Math.cos(direction) * depth,
        y: gate.position.y + Math.sin(perpDirection) * width / 2 + Math.sin(direction) * depth
      },
      {
        x: gate.position.x - Math.cos(perpDirection) * width / 2 + Math.cos(direction) * depth,
        y: gate.position.y - Math.sin(perpDirection) * width / 2 + Math.sin(direction) * depth
      },
      {
        x: gate.position.x - Math.cos(perpDirection) * width / 2,
        y: gate.position.y - Math.sin(perpDirection) * width / 2
      }
    ];
  }

  /**
   * Gets the direction of the wall at a gate position
   */
  private getWallDirection(gate: Gate): number {
    // This is a simplified implementation
    // In reality, would analyze the wall geometry to find the tangent at this point
    
    // Find the nearest road to determine gate direction
    let nearestRoad: Road | null = null;
    let minDistance = Infinity;
    
    for (const road of this.roadNetwork.roads) {
      const distance = this.distanceToRoad(gate.position, road);
      if (distance < minDistance) {
        minDistance = distance;
        nearestRoad = road;
      }
    }
    
    if (nearestRoad) {
      // Use road direction as gate direction
      return Math.atan2(
        nearestRoad.end.y - nearestRoad.start.y,
        nearestRoad.end.x - nearestRoad.start.x
      );
    }
    
    // Default direction
    return 0;
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
   * Gets all gate types present in the city
   */
  public getGateTypes(): GateType[] {
    const types = new Set<GateType>();
    
    for (const gate of this.gates) {
      if (gate.type) {
        types.add(gate.type);
      }
    }
    
    return Array.from(types);
  }

  /**
   * Validates that all required gate types are present
   */
  public validateGateTypes(): boolean {
    const types = this.getGateTypes();
    
    // Check that all required types are present
    return types.includes('simple') && 
           types.includes('barbican') && 
           types.includes('river') && 
           types.includes('postern');
  }

  /**
   * Validates that gate types are chosen deterministically
   */
  public validateDeterministicSelection(): boolean {
    for (const gate of this.gates) {
      if (!gate.type || !gate.districtImportance) continue;
      
      const expectedType = this.determineGateType(gate.roadClass, gate.districtImportance);
      
      if (gate.type !== expectedType) {
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
  const typology = new GateTypology(city.gates, city.roads, city.districts);
  return typology.assignGateTypes();
}

/**
 * Determines the gate type based on road class and district importance
 */
export function determineGateType(roadClass: RoadTier, districtImportance: number): GateType {
  const typology = new GateTypology([], { roads: [] });
  return typology.determineGateType(roadClass, districtImportance);
}

/**
 * Generates a test city with roads and districts for testing
 */
export function generateCityWithRoadsAndDistricts(): City {
  return {
    gates: [
      {
        id: 'gate1',
        position: { x: 0.2, y: 0.5 },
        roadClass: 'arterial',
        wallId: 'wall1'
      },
      {
        id: 'gate2',
        position: { x: 0.8, y: 0.5 },
        roadClass: 'collector',
        wallId: 'wall1'
      },
      {
        id: 'gate3',
        position: { x: 0.5, y: 0.2 },
        roadClass: 'local',
        wallId: 'wall1'
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
          tier: 'collector'
        },
        {
          id: 'road3',
          start: { x: 0.5, y: 0.1 },
          end: { x: 0.5, y: 0.2 },
          tier: 'local'
        }
      ]
    },
    districts: [
      {
        id: 'district1',
        polygon: [
          { x: 0.1, y: 0.1 },
          { x: 0.4, y: 0.1 },
          { x: 0.4, y: 0.4 },
          { x: 0.1, y: 0.4 }
        ],
        importance: 0.9,
        type: 'administrative'
      },
      {
        id: 'district2',
        polygon: [
          { x: 0.6, y: 0.6 },
          { x: 0.9, y: 0.6 },
          { x: 0.9, y: 0.9 },
          { x: 0.6, y: 0.9 }
        ],
        importance: 0.3,
        type: 'residential'
      }
    ]
  };
}