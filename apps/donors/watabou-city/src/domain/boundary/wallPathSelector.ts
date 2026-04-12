// @ts-nocheck
import { Point, dist } from '../types';
import { River } from '../terrain/river';

export interface Wall {
  id: string;
  polygon: Point[];
}

export interface Terrain {
  height: number;
  slope: number;
  difficulty: number;
}

export interface City {
  terrain: Terrain[][];
  rivers: River[];
  walls: Wall[];
  config: CityConfig;
}

export interface CityConfig {
  minWallPathScore: number;
  crossingPolicy: 'watergate' | 'quay' | 'fortified-bridge' | 'single-bank-core';
}

export interface RiverWallCrossing {
  position: Point;
  riverId: string;
  wallId: string;
  resolved: boolean;
  resolverType?: 'watergate' | 'quay' | 'fortified-bridge' | 'single-bank-core';
}

/**
 * WallPathSelector class scores terrain and river behavior for wall alignment,
 * ensuring proper crossing resolution and path selection.
 */
export class WallPathSelector {
  private terrain: Terrain[][];
  private rivers: River[];
  private config: CityConfig;

  constructor(terrain: Terrain[][], rivers: River[], config: CityConfig) {
    this.terrain = terrain;
    this.rivers = rivers;
    this.config = config;
  }

  /**
   * Selects the optimal wall path based on terrain and river behavior
   */
  public selectWallPath(): Wall {
    // Generate candidate wall paths
    const candidates = this.generateCandidatePaths();
    
    // Score each candidate
    const scoredCandidates = candidates.map(candidate => ({
      path: candidate,
      score: this.scoreWallPath(candidate)
    }));
    
    // Sort by score (highest first)
    scoredCandidates.sort((a, b) => b.score - a.score);
    
    // Select the best candidate that meets the minimum score threshold
    for (const candidate of scoredCandidates) {
      if (candidate.score >= this.config.minWallPathScore) {
        // Resolve river crossings
        const resolvedPath = this.resolveRiverCrossings(candidate.path);
        return {
          id: 'wall-selected',
          polygon: resolvedPath
        };
      }
    }
    
    // If no candidate meets the threshold, return the best one
    return {
      id: 'wall-default',
      polygon: scoredCandidates[0]?.path || []
    };
  }

  /**
   * Generates candidate wall paths
   */
  private generateCandidatePaths(): Point[][] {
    const candidates: Point[][] = [];
    
    // Generate basic rectangular path
    candidates.push(this.generateRectangularPath());
    
    // Generate paths that avoid rivers
    candidates.push(this.generateRiverAvoidingPath());
    
    // Generate paths that follow terrain contours
    candidates.push(this.generateTerrainFollowingPath());
    
    // Generate paths that incorporate rivers
    candidates.push(this.generateRiverIncorporatingPath());
    
    return candidates;
  }

  /**
   * Generates a basic rectangular wall path
   */
  private generateRectangularPath(): Point[] {
    return [
      { x: 0.2, y: 0.2 },
      { x: 0.8, y: 0.2 },
      { x: 0.8, y: 0.8 },
      { x: 0.2, y: 0.8 }
    ];
  }

  /**
   * Generates a wall path that avoids rivers
   */
  private generateRiverAvoidingPath(): Point[] {
    const path = this.generateRectangularPath();
    const modifiedPath: Point[] = [];
    
    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      const nextPoint = path[(i + 1) % path.length];
      
      // Check if this segment crosses a river
      const crossing = this.findRiverCrossing(point, nextPoint);
      
      if (crossing) {
        // Modify the path to avoid the river
        const avoidancePoints = this.generateRiverAvoidancePoints(point, nextPoint, crossing);
        modifiedPath.push(...avoidancePoints);
      } else {
        modifiedPath.push(point);
      }
    }
    
    return modifiedPath;
  }

  /**
   * Generates a wall path that follows terrain contours
   */
  private generateTerrainFollowingPath(): Point[] {
    const path = this.generateRectangularPath();
    const modifiedPath: Point[] = [];
    
    for (const point of path) {
      // Find the best terrain position near this point
      const terrainPoint = this.findOptimalTerrainPosition(point);
      modifiedPath.push(terrainPoint);
    }
    
    return modifiedPath;
  }

  /**
   * Generates a wall path that incorporates rivers
   */
  private generateRiverIncorporatingPath(): Point[] {
    const path = this.generateRectangularPath();
    const modifiedPath: Point[] = [];
    
    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      const nextPoint = path[(i + 1) % path.length];
      
      // Check if this segment crosses a river
      const crossing = this.findRiverCrossing(point, nextPoint);
      
      if (crossing) {
        // Add points that incorporate the river
        const riverPoints = this.generateRiverIncorporationPoints(point, nextPoint, crossing);
        modifiedPath.push(...riverPoints);
      } else {
        modifiedPath.push(point);
      }
    }
    
    return modifiedPath;
  }

  /**
   * Finds a river crossing between two points
   */
  private findRiverCrossing(start: Point, end: Point): { river: River; position: Point } | null {
    for (const river of this.rivers) {
      const crossing = this.findRiverSegmentCrossing(start, end, river);
      if (crossing) {
        return { river, position: crossing };
      }
    }
    
    return null;
  }

  /**
   * Finds a crossing with a specific river
   */
  private findRiverSegmentCrossing(start: Point, end: Point, river: River): Point | null {
    for (let i = 0; i < river.points.length - 1; i++) {
      const riverStart = river.points[i];
      const riverEnd = river.points[i + 1];
      
      const intersection = this.lineSegmentIntersection(start, end, riverStart, riverEnd);
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
   * Generates points to avoid a river crossing
   */
  private generateRiverAvoidancePoints(
    start: Point, 
    end: Point, 
    crossing: { river: River; position: Point }
  ): Point[] {
    const river = crossing.river;
    const crossingPoint = crossing.position;
    
    // Find the direction of the river at the crossing point
    const riverDirection = this.getRiverDirection(river, crossingPoint);
    
    // Calculate perpendicular direction for avoidance
    const avoidanceDirection = riverDirection + Math.PI / 2;
    
    // Generate avoidance points
    const avoidanceDistance = 0.05 + river.width / 2;
    
    const avoidancePoint1 = {
      x: crossingPoint.x + Math.cos(avoidanceDirection) * avoidanceDistance,
      y: crossingPoint.y + Math.sin(avoidanceDirection) * avoidanceDistance
    };
    
    const avoidancePoint2 = {
      x: crossingPoint.x - Math.cos(avoidanceDirection) * avoidanceDistance,
      y: crossingPoint.y - Math.sin(avoidanceDirection) * avoidanceDistance
    };
    
    // Choose the side with better terrain
    const score1 = this.scoreTerrainAtPoint(avoidancePoint1);
    const score2 = this.scoreTerrainAtPoint(avoidancePoint2);
    
    const chosenPoint = score1 > score2 ? avoidancePoint1 : avoidancePoint2;
    
    // Generate path from start to chosen point to end
    const midPoint1 = {
      x: (start.x + chosenPoint.x) / 2,
      y: (start.y + chosenPoint.y) / 2
    };
    
    const midPoint2 = {
      x: (chosenPoint.x + end.x) / 2,
      y: (chosenPoint.y + end.y) / 2
    };
    
    return [start, midPoint1, chosenPoint, midPoint2, end];
  }

  /**
   * Generates points that incorporate a river crossing
   */
  private generateRiverIncorporationPoints(
    start: Point, 
    end: Point, 
    crossing: { river: River; position: Point }
  ): Point[] {
    const river = crossing.river;
    const crossingPoint = crossing.position;
    
    // Find the direction of the river at the crossing point
    const riverDirection = this.getRiverDirection(river, crossingPoint);
    
    // Calculate points along the river for wall alignment
    const alignmentDistance = 0.03;
    
    const riverPoint1 = {
      x: crossingPoint.x + Math.cos(riverDirection) * alignmentDistance,
      y: crossingPoint.y + Math.sin(riverDirection) * alignmentDistance
    };
    
    const riverPoint2 = {
      x: crossingPoint.x - Math.cos(riverDirection) * alignmentDistance,
      y: crossingPoint.y - Math.sin(riverDirection) * alignmentDistance
    };
    
    // Generate path that follows the river
    return [start, riverPoint1, crossingPoint, riverPoint2, end];
  }

  /**
   * Gets the direction of a river at a specific point
   */
  private getRiverDirection(river: River, point: Point): number {
    // Find the nearest river segment
    let nearestSegment = 0;
    let minDistance = Infinity;
    
    for (let i = 0; i < river.points.length - 1; i++) {
      const start = river.points[i];
      const end = river.points[i + 1];
      
      const distance = this.distanceToLineSegment(point, start, end);
      if (distance < minDistance) {
        minDistance = distance;
        nearestSegment = i;
      }
    }
    
    // Calculate direction of the nearest segment
    const start = river.points[nearestSegment];
    const end = river.points[nearestSegment + 1];
    
    return Math.atan2(end.y - start.y, end.x - start.x);
  }

  /**
   * Finds the optimal terrain position near a target point
   */
  private findOptimalTerrainPosition(target: Point): Point {
    const searchRadius = 0.05;
    const step = 0.01;
    
    let bestPoint = target;
    let bestScore = this.scoreTerrainAtPoint(target);
    
    // Search in a grid around the target point
    for (let dx = -searchRadius; dx <= searchRadius; dx += step) {
      for (let dy = -searchRadius; dy <= searchRadius; dy += step) {
        const testPoint = {
          x: target.x + dx,
          y: target.y + dy
        };
        
        const score = this.scoreTerrainAtPoint(testPoint);
        if (score > bestScore) {
          bestScore = score;
          bestPoint = testPoint;
        }
      }
    }
    
    return bestPoint;
  }

  /**
   * Scores the terrain at a specific point
   */
  private scoreTerrainAtPoint(point: Point): number {
    // Find the terrain value at this point
    const gridX = Math.floor(point.x * this.terrain.length);
    const gridY = Math.floor(point.y * this.terrain[0].length);
    
    if (gridX < 0 || gridX >= this.terrain.length || 
        gridY < 0 || gridY >= this.terrain[0].length) {
      return 0; // Out of bounds
    }
    
    const terrain = this.terrain[gridX][gridY];
    
    // Score based on terrain properties
    let score = 10; // Base score
    
    // Prefer lower slopes
    score -= terrain.slope * 5;
    
    // Prefer lower difficulty
    score -= terrain.difficulty * 3;
    
    // Prefer moderate heights (not too high or too low)
    const heightDeviation = Math.abs(terrain.height - 0.5);
    score -= heightDeviation * 2;
    
    return Math.max(0, score);
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
   * Scores a wall path based on terrain and river behavior
   */
  public scoreWallPath(path: Point[]): number {
    let totalScore = 0;
    let segmentCount = 0;
    
    for (let i = 0; i < path.length; i++) {
      const start = path[i];
      const end = path[(i + 1) % path.length];
      
      // Score terrain
      const midPoint = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2
      };
      
      const terrainScore = this.scoreTerrainAtPoint(midPoint);
      totalScore += terrainScore;
      
      // Score river behavior
      const crossing = this.findRiverCrossing(start, end);
      if (crossing) {
        const riverScore = this.scoreRiverCrossing(crossing);
        totalScore += riverScore;
      }
      
      segmentCount++;
    }
    
    // Average score per segment
    return segmentCount > 0 ? totalScore / segmentCount : 0;
  }

  /**
   * Scores a river crossing based on the crossing policy
   */
  private scoreRiverCrossing(crossing: { river: River; position: Point }): number {
    switch (this.config.crossingPolicy) {
      case 'watergate':
        return 8; // Watergates are good
      case 'quay':
        return 7; // Quays are good
      case 'fortified-bridge':
        return 6; // Fortified bridges are okay
      case 'single-bank-core':
        return -10; // Avoid crossings
      default:
        return 0;
    }
  }

  /**
   * Resolves river crossings based on the crossing policy
   */
  public resolveRiverCrossings(path: Point[]): Point[] {
    const resolvedPath: Point[] = [];
    
    for (let i = 0; i < path.length; i++) {
      const start = path[i];
      const end = path[(i + 1) % path.length];
      
      const crossing = this.findRiverCrossing(start, end);
      
      if (crossing) {
        const resolution = this.resolveCrossing(start, end, crossing);
        resolvedPath.push(...resolution);
      } else {
        resolvedPath.push(start);
      }
    }
    
    return resolvedPath;
  }

  /**
   * Resolves a specific river crossing
   */
  private resolveCrossing(
    start: Point, 
    end: Point, 
    crossing: { river: River; position: Point }
  ): Point[] {
    switch (this.config.crossingPolicy) {
      case 'watergate':
        return this.resolveWithWatergate(start, end, crossing);
      case 'quay':
        return this.resolveWithQuay(start, end, crossing);
      case 'fortified-bridge':
        return this.resolveWithFortifiedBridge(start, end, crossing);
      case 'single-bank-core':
        return this.resolveWithSingleBankCore(start, end, crossing);
      default:
        return [start, end];
    }
  }

  /**
   * Resolves a crossing with a watergate
   */
  private resolveWithWatergate(
    start: Point, 
    end: Point, 
    crossing: { river: River; position: Point }
  ): Point[] {
    // Add a small structure at the crossing point
    const watergateSize = 0.02;
    
    return [
      start,
      {
        x: crossing.position.x - watergateSize / 2,
        y: crossing.position.y
      },
      {
        x: crossing.position.x + watergateSize / 2,
        y: crossing.position.y
      },
      end
    ];
  }

  /**
   * Resolves a crossing with a quay
   */
  private resolveWithQuay(
    start: Point, 
    end: Point, 
    crossing: { river: River; position: Point }
  ): Point[] {
    // Add a quay structure along the river
    const quayWidth = 0.03;
    const riverDirection = this.getRiverDirection(crossing.river, crossing.position);
    
    const quayStart = {
      x: crossing.position.x - Math.cos(riverDirection) * quayWidth / 2,
      y: crossing.position.y - Math.sin(riverDirection) * quayWidth / 2
    };
    
    const quayEnd = {
      x: crossing.position.x + Math.cos(riverDirection) * quayWidth / 2,
      y: crossing.position.y + Math.sin(riverDirection) * quayWidth / 2
    };
    
    return [start, quayStart, quayEnd, end];
  }

  /**
   * Resolves a crossing with a fortified bridge
   */
  private resolveWithFortifiedBridge(
    start: Point, 
    end: Point, 
    crossing: { river: River; position: Point }
  ): Point[] {
    // Add a fortified bridge structure
    const bridgeWidth = 0.04;
    const riverDirection = this.getRiverDirection(crossing.river, crossing.position);
    
    const bridgeStart = {
      x: crossing.position.x - Math.cos(riverDirection) * bridgeWidth / 2,
      y: crossing.position.y - Math.sin(riverDirection) * bridgeWidth / 2
    };
    
    const bridgeEnd = {
      x: crossing.position.x + Math.cos(riverDirection) * bridgeWidth / 2,
      y: crossing.position.y + Math.sin(riverDirection) * bridgeWidth / 2
    };
    
    return [start, bridgeStart, bridgeEnd, end];
  }

  /**
   * Resolves a crossing by avoiding it (single-bank-core policy)
   */
  private resolveWithSingleBankCore(
    start: Point, 
    end: Point, 
    crossing: { river: River; position: Point }
  ): Point[] {
    // Generate a path that avoids the river
    const avoidancePoints = this.generateRiverAvoidancePoints(start, end, crossing);
    return avoidancePoints;
  }

  /**
   * Finds all river-wall crossings
   */
  public findRiverWallCrossings(path: Point[]): RiverWallCrossing[] {
    const crossings: RiverWallCrossing[] = [];
    
    for (let i = 0; i < path.length; i++) {
      const start = path[i];
      const end = path[(i + 1) % path.length];
      
      const crossing = this.findRiverCrossing(start, end);
      
      if (crossing) {
        crossings.push({
          position: crossing.position,
          riverId: crossing.river.points.toString(), // Simplified ID
          wallId: 'wall',
          resolved: false
        });
      }
    }
    
    return crossings;
  }

  /**
   * Validates that a wall path satisfies terrain/hydro scoring threshold
   */
  public validateWallPath(path: Point[]): boolean {
    const score = this.scoreWallPath(path);
    return score >= this.config.minWallPathScore;
  }

  /**
   * Validates that all river crossings are resolved
   */
  public validateCrossingResolution(path: Point[]): boolean {
    const crossings = this.findRiverWallCrossings(path);
    
    for (const crossing of crossings) {
      if (!crossing.resolved) {
        return false;
      }
    }
    
    return true;
  }
}

/**
 * Selects a wall path for a city
 */
export function selectWallPath(city: City): Wall {
  const selector = new WallPathSelector(city.terrain, city.rivers, city.config);
  return selector.selectWallPath();
}

/**
 * Scores a wall path
 */
export function scoreWallPath(wallPath: Wall, terrain: Terrain[][], rivers: River[]): number {
  const selector = new WallPathSelector(terrain, rivers, { 
    minWallPathScore: 0, 
    crossingPolicy: 'watergate' 
  });
  return selector.scoreWallPath(wallPath.polygon);
}

/**
 * Finds river-wall crossings
 */
export function findRiverWallCrossings(wallPath: Wall, rivers: River[]): RiverWallCrossing[] {
  const selector = new WallPathSelector([], rivers, { 
    minWallPathScore: 0, 
    crossingPolicy: 'watergate' 
  });
  return selector.findRiverWallCrossings(wallPath.polygon);
}

/**
 * Generates a test city with terrain and rivers for testing
 */
export function generateCityWithTerrainAndRivers(): City {
  // Generate simple terrain
  const terrain: Terrain[][] = [];
  const gridSize = 10;
  
  for (let x = 0; x < gridSize; x++) {
    terrain[x] = [];
    for (let y = 0; y < gridSize; y++) {
      terrain[x][y] = {
        height: 0.3 + Math.random() * 0.4,
        slope: Math.random() * 0.5,
        difficulty: Math.random() * 0.3
      };
    }
  }
  
  // Generate simple river
  const river: River = {
    points: [
      { x: 0.2, y: 0.5 },
      { x: 0.8, y: 0.5 }
    ],
    width: 0.05
  };
  
  return {
    terrain,
    rivers: [river],
    walls: [],
    config: {
      minWallPathScore: 5,
      crossingPolicy: 'watergate'
    }
  };
}