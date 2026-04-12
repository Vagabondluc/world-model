// @ts-nocheck
import { Point } from '../types';

export interface Wall {
  id: string;
  polygon: Point[];
  innerEdge: Point[];
  width: number;
}

export interface River {
  id: string;
  points: Point[];
  width: number;
}

export interface RiverWallCrossing {
  id: string;
  position: Point;
  wallId: string;
  riverId: string;
  angle: number;
  resolved: boolean;
  resolver?: RiverWallResolverType;
}

export type RiverWallResolverType = 'watergate' | 'quay' | 'fortifiedBridge' | 'single-bank-core';

export interface RiverWallStructure {
  id: string;
  type: RiverWallResolverType;
  position: Point;
  angle: number;
  width: number;
  wallId: string;
  riverId: string;
}

/**
 * Resolves river-wall intersections with appropriate structures.
 * Detects crossings and applies resolution strategies based on configuration.
 */
export class RiverWallResolver {
  private readonly defaultResolutionStrategy: RiverWallResolverType;
  private crossings: RiverWallCrossing[] = [];
  private structures: RiverWallStructure[] = [];

  /**
   * Creates a new RiverWallResolver.
   * @param defaultResolutionStrategy Default strategy for resolving crossings
   */
  constructor(defaultResolutionStrategy: RiverWallResolverType = 'watergate') {
    this.defaultResolutionStrategy = defaultResolutionStrategy;
  }

  /**
   * Finds river-wall crossings.
   * @param rivers Array of river objects
   * @param walls Array of wall objects
   * @returns Array of river-wall crossings
   */
  findRiverWallCrossings(rivers: River[], walls: Wall[]): RiverWallCrossing[] {
    this.crossings = [];

    for (const river of rivers) {
      for (const wall of walls) {
        const riverCrossings = this.findRiverWallIntersections(river, wall);
        this.crossings.push(...riverCrossings);
      }
    }

    return this.crossings;
  }

  /**
   * Resolves river-wall crossings with appropriate structures.
   * @param crossings Array of river-wall crossings
   * @param rivers Array of river objects
   * @param walls Array of wall objects
   * @returns Array of created structures
   */
  resolveRiverWallCrossings(
    crossings: RiverWallCrossing[],
    rivers: River[],
    walls: Wall[]
  ): RiverWallStructure[] {
    this.structures = [];

    for (const crossing of crossings) {
      if (crossing.resolved) continue;

      // Determine resolution strategy
      const resolverType = this.determineResolverType(crossing, rivers, walls);
      
      // Create structure
      const structure = this.createStructure(crossing, resolverType);
      if (structure) {
        this.structures.push(structure);
        crossing.resolved = true;
        crossing.resolver = resolverType;
      }
    }

    return this.structures;
  }

  /**
   * Finds raw river-wall intersections (unresolved crossings).
   * @param rivers Array of river objects
   * @param walls Array of wall objects
   * @returns Array of raw intersections
   */
  findRawRiverWallIntersections(rivers: River[], walls: Wall[]): RiverWallCrossing[] {
    const rawIntersections: RiverWallCrossing[] = [];

    for (const river of rivers) {
      for (const wall of walls) {
        const riverCrossings = this.findRiverWallIntersections(river, wall);
        rawIntersections.push(...riverCrossings.filter(c => !c.resolved));
      }
    }

    return rawIntersections;
  }

  /**
   * Gets all created structures.
   * @returns Array of structures
   */
  getStructures(): RiverWallStructure[] {
    return [...this.structures];
  }

  /**
   * Gets all crossings.
   * @returns Array of crossings
   */
  getCrossings(): RiverWallCrossing[] {
    return [...this.crossings];
  }

  /**
   * Finds intersections between a river and a wall.
   */
  private findRiverWallIntersections(river: River, wall: Wall): RiverWallCrossing[] {
    const intersections: RiverWallCrossing[] = [];

    for (let i = 0; i < river.points.length - 1; i++) {
      const riverStart = river.points[i];
      const riverEnd = river.points[i + 1];

      for (let j = 0; j < wall.polygon.length; j++) {
        const wallStart = wall.polygon[j];
        const wallEnd = wall.polygon[(j + 1) % wall.polygon.length];

        const intersection = this.segmentIntersection(
          riverStart, riverEnd,
          wallStart, wallEnd
        );

        if (intersection) {
          const angle = Math.atan2(riverEnd.y - riverStart.y, riverEnd.x - riverStart.x);
          intersections.push({
            id: `${river.id}-${wall.id}-${i}-${j}`,
            position: intersection,
            wallId: wall.id,
            riverId: river.id,
            angle,
            resolved: false
          });
        }
      }
    }

    return intersections;
  }

  /**
   * Determines the appropriate resolver type for a crossing.
   */
  private determineResolverType(
    crossing: RiverWallCrossing,
    rivers: River[],
    walls: Wall[]
  ): RiverWallResolverType {
    // For now, use the default strategy
    // In a more complex implementation, this could consider:
    // - River width
    // - Wall importance
    // - City configuration
    // - Terrain constraints
    return this.defaultResolutionStrategy;
  }

  /**
   * Creates a structure for resolving a crossing.
   */
  private createStructure(
    crossing: RiverWallCrossing,
    resolverType: RiverWallResolverType
  ): RiverWallStructure | null {
    const width = this.calculateStructureWidth(resolverType);

    return {
      id: `structure-${this.structures.length}`,
      type: resolverType,
      position: crossing.position,
      angle: crossing.angle,
      width,
      wallId: crossing.wallId,
      riverId: crossing.riverId
    };
  }

  /**
   * Calculates the width of a structure based on its type.
   */
  private calculateStructureWidth(resolverType: RiverWallResolverType): number {
    switch (resolverType) {
      case 'watergate':
        return 0.04;
      case 'quay':
        return 0.06;
      case 'fortifiedBridge':
        return 0.08;
      case 'single-bank-core':
        return 0.02;
      default:
        return 0.04;
    }
  }

  /**
   * Finds intersection between two line segments.
   */
  private segmentIntersection(
    p1: Point, p2: Point,
    p3: Point, p4: Point
  ): Point | null {
    const x1 = p1.x, y1 = p1.y;
    const x2 = p2.x, y2 = p2.y;
    const x3 = p3.x, y3 = p3.y;
    const x4 = p4.x, y4 = p4.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(den) < 1e-12) return null;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1)
      };
    }

    return null;
  }
}