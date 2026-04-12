// @ts-nocheck
import { Point } from '../types';

export interface Wall {
  id: string;
  polygon: Point[];
  innerEdge: Point[];
  width: number;
}

export interface Tower {
  id: string;
  position: Point;
  radius: number;
  wallId: string;
}

/**
 * Computes tower radius from wall width and ensures proportional scaling.
 * Manages tower proportions relative to walls.
 */
export class TowerScaler {
  private readonly towerRadiusRatio: number;
  private readonly maxTowerToWallRatio: number;

  /**
   * Creates a new TowerScaler.
   * @param towerRadiusRatio Ratio of tower radius to wall width
   * @param maxTowerToWallRatio Maximum ratio of tower radius to wall width
   */
  constructor(towerRadiusRatio: number = 0.6, maxTowerToWallRatio: number = 0.8) {
    this.towerRadiusRatio = towerRadiusRatio;
    this.maxTowerToWallRatio = maxTowerToWallRatio;
  }

  /**
   * Computes tower radius based on wall width.
   * @param wallWidth Width of the wall
   * @returns Tower radius
   */
  computeTowerRadius(wallWidth: number): number {
    const baseRadius = wallWidth * this.towerRadiusRatio;
    
    // Ensure tower is not dominant over wall
    return Math.min(baseRadius, wallWidth * this.maxTowerToWallRatio);
  }

  /**
   * Validates tower proportions against design constraints.
   * @param towerRadius Tower radius to validate
   * @param wallWidth Width of the associated wall
   * @returns True if proportions are valid
   */
  validateTowerProportions(towerRadius: number, wallWidth: number): boolean {
    // Tower should be proportional to wall
    const ratio = towerRadius / wallWidth;
    
    // Tower should not be dominant (less than max ratio)
    if (ratio > this.maxTowerToWallRatio) {
      return false;
    }
    
    // Tower should be reasonably sized relative to wall
    if (ratio < 0.3) { // Minimum ratio
      return false;
    }
    
    return true;
  }

  /**
   * Creates a tower with computed radius.
   * @param towerId ID for the tower
   * @param position Position of the tower
   * @param wall Wall the tower is associated with
   * @returns Tower object with computed radius
   */
  createTower(towerId: string, position: Point, wall: Wall): Tower {
    const radius = this.computeTowerRadius(wall.width);
    
    return {
      id: towerId,
      position,
      radius,
      wallId: wall.id
    };
  }

  /**
   * Updates an existing tower with new radius based on wall width.
   * @param tower Tower to update
   * @param wallWidth Width of the wall
   * @returns Updated tower
   */
  updateTowerRadius(tower: Tower, wallWidth: number): Tower {
    const newRadius = this.computeTowerRadius(wallWidth);
    
    return {
      ...tower,
      radius: newRadius
    };
  }

  /**
   * Gets the tower radius ratio.
   * @returns Tower radius ratio
   */
  getTowerRadiusRatio(): number {
    return this.towerRadiusRatio;
  }

  /**
   * Gets the maximum tower to wall ratio.
   * @returns Maximum tower to wall ratio
   */
  getMaxTowerToWallRatio(): number {
    return this.maxTowerToWallRatio;
  }

  /**
   * Creates multiple towers along a wall with consistent spacing.
   * @param wall Wall to place towers on
   * @param count Number of towers to create
   * @param startOffset Offset along wall to start placement (0-1)
   * @returns Array of towers
   */
  createTowersAlongWall(wall: Wall, count: number, startOffset: number = 0): Tower[] {
    const towers: Tower[] = [];
    const radius = this.computeTowerRadius(wall.width);
    
    // Calculate total perimeter length
    const perimeter = this.calculatePerimeter(wall.polygon);
    
    // Calculate spacing between towers
    const spacing = perimeter / count;
    
    for (let i = 0; i < count; i++) {
      // Calculate position along wall
      const distance = (startOffset * perimeter) + (i * spacing);
      const position = this.getPointAlongWall(wall.polygon, distance);
      
      towers.push({
        id: `tower-${wall.id}-${i}`,
        position,
        radius,
        wallId: wall.id
      });
    }
    
    return towers;
  }

  /**
   * Calculates the perimeter of a polygon.
   */
  private calculatePerimeter(polygon: Point[]): number {
    let perimeter = 0;
    
    for (let i = 0; i < polygon.length; i++) {
      const current = polygon[i];
      const next = polygon[(i + 1) % polygon.length];
      
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }
    
    return perimeter;
  }

  /**
   * Gets a point at a specific distance along a wall polygon.
   */
  private getPointAlongWall(polygon: Point[], distance: number): Point {
    let accumulatedDistance = 0;
    
    for (let i = 0; i < polygon.length; i++) {
      const current = polygon[i];
      const next = polygon[(i + 1) % polygon.length];
      
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);
      
      if (accumulatedDistance + segmentLength >= distance) {
        // Point is on this segment
        const remainingDistance = distance - accumulatedDistance;
        const t = remainingDistance / segmentLength;
        
        return {
          x: current.x + dx * t,
          y: current.y + dy * t
        };
      }
      
      accumulatedDistance += segmentLength;
    }
    
    // If we get here, distance is larger than perimeter, wrap around
    return polygon[0];
  }
}