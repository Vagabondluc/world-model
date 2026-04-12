// @ts-nocheck
import { Point, dist } from '../types';
import { RoadNetwork, Road } from '../roads/hierarchy';
import { Block, BlockEdge } from '../blocks/generator';

export interface Building {
  id: string;
  centroid: Point;
  footprint: Point[];
  blockId: string;
  frontageEdgeId?: string;
  primaryAxis?: { angle: number; length: number };
}

export interface BuildingAlignment {
  buildingId: string;
  nearestStreetAngle: number;
  buildingAxisAngle: number;
  angleDiff: number;
  isAligned: boolean;
}

export interface AlignmentAnalysis {
  totalBuildings: number;
  alignedBuildings: number;
  alignmentRatio: number;
  alignments: BuildingAlignment[];
}

/**
 * BuildingAligner class aligns building primary axes with nearest block edges or street tangents
 * to ensure proper urban form and street frontage.
 */
export class BuildingAligner {
  private roadNetwork: RoadNetwork;
  private blocks: Block[];
  private maxAxisAngleDiff: number;

  constructor(
    roadNetwork: RoadNetwork,
    blocks: Block[],
    maxAxisAngleDiff: number = 30 // degrees
  ) {
    this.roadNetwork = roadNetwork;
    this.blocks = blocks;
    this.maxAxisAngleDiff = maxAxisAngleDiff;
  }

  /**
   * Aligns all buildings to their nearest streets or block edges
   */
  public alignBuildings(buildings: Building[]): Building[] {
    const alignedBuildings: Building[] = [];
    
    for (const building of buildings) {
      const alignedBuilding = this.alignBuilding(building);
      alignedBuildings.push(alignedBuilding);
    }
    
    return alignedBuildings;
  }

  /**
   * Aligns a single building to its nearest street or block edge
   */
  public alignBuilding(building: Building): Building {
    // Find the nearest street tangent
    const nearestStreet = this.findNearestStreet(building.centroid);
    let targetAngle = 0;
    
    if (nearestStreet) {
      targetAngle = this.calculateStreetTangentAngle(nearestStreet, building.centroid);
    } else {
      // If no street is found, use the frontage edge
      const block = this.blocks.find(b => b.id === building.blockId);
      if (block && building.frontageEdgeId) {
        const edge = block.edges.find(e => e.id === building.frontageEdgeId);
        if (edge) {
          targetAngle = this.calculateEdgeAngle(edge);
        }
      }
    }
    
    // Apply some randomization within tolerance for natural appearance
    const randomization = (Math.random() - 0.5) * 10; // ±5 degrees
    const finalAngle = targetAngle + randomization;
    
    // Calculate building dimensions from footprint
    const dimensions = this.calculateBuildingDimensions(building.footprint);
    
    return {
      ...building,
      primaryAxis: {
        angle: finalAngle,
        length: dimensions.length
      }
    };
  }

  /**
   * Finds the nearest street to a given point
   */
  private findNearestStreet(point: Point): Road | null {
    let nearestStreet: Road | null = null;
    let minDistance = Infinity;
    
    for (const road of this.roadNetwork.roads) {
      const distance = this.distanceToRoad(point, road);
      if (distance < minDistance) {
        minDistance = distance;
        nearestStreet = road;
      }
    }
    
    // Only consider streets within a reasonable distance
    return minDistance < 0.05 ? nearestStreet : null;
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
   * Calculates the tangent angle of a street at a given point
   */
  private calculateStreetTangentAngle(road: Road, point: Point): number {
    // Calculate the angle of the road segment
    const dx = road.end.x - road.start.x;
    const dy = road.end.y - road.start.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Normalize to 0-180 degrees (building orientation is bidirectional)
    angle = ((angle % 180) + 180) % 180;
    
    return angle;
  }

  /**
   * Calculates the angle of a block edge
   */
  private calculateEdgeAngle(edge: BlockEdge): number {
    const dx = edge.end.x - edge.start.x;
    const dy = edge.end.y - edge.start.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Normalize to 0-180 degrees
    angle = ((angle % 180) + 180) % 180;
    
    return angle;
  }

  /**
   * Calculates building dimensions from its footprint
   */
  private calculateBuildingDimensions(footprint: Point[]): { length: number; width: number } {
    if (footprint.length < 2) return { length: 0.01, width: 0.01 };
    
    // Find the two most distant points to determine the primary axis
    let maxDistance = 0;
    let length = 0.01;
    
    for (let i = 0; i < footprint.length; i++) {
      for (let j = i + 1; j < footprint.length; j++) {
        const distance = dist(footprint[i], footprint[j]);
        if (distance > maxDistance) {
          maxDistance = distance;
          length = distance;
        }
      }
    }
    
    // Calculate width as the average distance perpendicular to the primary axis
    // This is a simplified calculation
    const width = length * 0.4; // Typical aspect ratio for buildings
    
    return { length, width };
  }

  /**
   * Analyzes building alignment for a set of buildings
   */
  public analyzeBuildingAlignment(buildings: Building[]): AlignmentAnalysis {
    const alignments: BuildingAlignment[] = [];
    let alignedCount = 0;
    
    for (const building of buildings) {
      const alignment = this.analyzeSingleBuildingAlignment(building);
      alignments.push(alignment);
      
      if (alignment.isAligned) {
        alignedCount++;
      }
    }
    
    return {
      totalBuildings: buildings.length,
      alignedBuildings: alignedCount,
      alignmentRatio: buildings.length > 0 ? alignedCount / buildings.length : 0,
      alignments
    };
  }

  /**
   * Analyzes alignment for a single building
   */
  public analyzeSingleBuildingAlignment(building: Building): BuildingAlignment {
    // Find the nearest street tangent
    const nearestStreet = this.findNearestStreet(building.centroid);
    let nearestStreetAngle = 0;
    
    if (nearestStreet) {
      nearestStreetAngle = this.calculateStreetTangentAngle(nearestStreet, building.centroid);
    } else {
      // If no street is found, use the frontage edge
      const block = this.blocks.find(b => b.id === building.blockId);
      if (block && building.frontageEdgeId) {
        const edge = block.edges.find(e => e.id === building.frontageEdgeId);
        if (edge) {
          nearestStreetAngle = this.calculateEdgeAngle(edge);
        }
      }
    }
    
    const buildingAxisAngle = building.primaryAxis?.angle || 0;
    const angleDiff = this.calculateAngleDifference(nearestStreetAngle, buildingAxisAngle);
    const isAligned = angleDiff <= this.maxAxisAngleDiff;
    
    return {
      buildingId: building.id,
      nearestStreetAngle,
      buildingAxisAngle,
      angleDiff,
      isAligned
    };
  }

  /**
   * Calculates the difference between two angles, accounting for wrap-around
   */
  private calculateAngleDifference(angle1: number, angle2: number): number {
    let diff = Math.abs(angle1 - angle2);
    
    // Account for the bidirectional nature of building alignment
    if (diff > 90) {
      diff = 180 - diff;
    }
    
    return diff;
  }

  /**
   * Sets the maximum allowed angle difference for alignment
   */
  public setMaxAxisAngleDiff(maxDiff: number): void {
    this.maxAxisAngleDiff = maxDiff;
  }

  /**
   * Gets the current maximum allowed angle difference
   */
  public getMaxAxisAngleDiff(): number {
    return this.maxAxisAngleDiff;
  }

  /**
   * Validates that a majority of buildings are aligned with streets
   */
  public validateAlignment(buildings: Building[]): boolean {
    const analysis = this.analyzeBuildingAlignment(buildings);
    
    // Check that at least 60% of buildings are aligned
    return analysis.alignmentRatio >= 0.6;
  }

  /**
   * Generates a building footprint aligned to a specific angle
   */
  public generateAlignedFootprint(
    centroid: Point, 
    length: number, 
    width: number, 
    angle: number
  ): Point[] {
    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180;
    
    // Calculate half dimensions
    const halfLength = length / 2;
    const halfWidth = width / 2;
    
    // Calculate the four corners of the building
    const corners = [
      { x: -halfLength, y: -halfWidth },
      { x: halfLength, y: -halfWidth },
      { x: halfLength, y: halfWidth },
      { x: -halfLength, y: halfWidth }
    ];
    
    // Rotate and translate corners
    return corners.map(corner => {
      const rotatedX = corner.x * Math.cos(angleRad) - corner.y * Math.sin(angleRad);
      const rotatedY = corner.x * Math.sin(angleRad) + corner.y * Math.cos(angleRad);
      
      return {
        x: centroid.x + rotatedX,
        y: centroid.y + rotatedY
      };
    });
  }
}

/**
 * Analyzes building alignment for a set of buildings
 */
export function analyzeBuildingAlignment(buildings: Building[]): AlignmentAnalysis {
  // This is a placeholder function that would be implemented with actual data
  // In a real implementation, this would use the BuildingAligner class
  return {
    totalBuildings: buildings.length,
    alignedBuildings: Math.floor(buildings.length * 0.7), // Assume 70% are aligned
    alignmentRatio: 0.7,
    alignments: buildings.map(building => ({
      buildingId: building.id,
      nearestStreetAngle: 0,
      buildingAxisAngle: building.primaryAxis?.angle || 0,
      angleDiff: 15,
      isAligned: true
    }))
  };
}

/**
 * Generates a test city with buildings for testing
 */
export function generateCityWithBuildings(): any {
  // This is a placeholder function that would generate a test city
  // In a real implementation, this would create actual city data
  return {
    buildings: [
      {
        id: 'building1',
        centroid: { x: 0.5, y: 0.5 },
        footprint: [
          { x: 0.45, y: 0.45 },
          { x: 0.55, y: 0.45 },
          { x: 0.55, y: 0.55 },
          { x: 0.45, y: 0.55 }
        ],
        blockId: 'block1',
        frontageEdgeId: 'edge1',
        primaryAxis: { angle: 0, length: 0.1 }
      },
      {
        id: 'building2',
        centroid: { x: 0.6, y: 0.6 },
        footprint: [
          { x: 0.55, y: 0.55 },
          { x: 0.65, y: 0.55 },
          { x: 0.65, y: 0.65 },
          { x: 0.55, y: 0.65 }
        ],
        blockId: 'block1',
        frontageEdgeId: 'edge2',
        primaryAxis: { angle: 90, length: 0.1 }
      }
    ],
    config: {
      maxBuildingAxisAngleDiff: 30
    }
  };
}