// @ts-nocheck
import { Point, TowerNode, WallArticulationConfig, DEFAULT_WALL_ARTICULATION } from '../types';

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

export interface Gate {
  id: string;
  position: Point;
  width: number;
  wallId: string;
}

export interface TowerPlacementConfig {
  minTowerSpacing: number;
  maxTowerSpacing: number;
  spacingVarianceMax: number;
  /** Configuration for wall articulation constraints */
  articulation?: WallArticulationConfig;
}

/**
 * Places towers along walls with bounded arc-length spacing.
 * Enforces tower rhythm and spacing constraints.
 *
 * HARD CONSTRAINTS for wall articulation:
 * - Towers at angle changes (corners)
 * - Long straight runs between towers
 * - Avoid shallow zig-zag unless bastioned
 */
export class TowerPlacer {
  private readonly config: TowerPlacementConfig;
  private readonly articulation: WallArticulationConfig;
  private towers: Tower[] = [];

  /**
   * Creates a new TowerPlacer.
   * @param config Tower placement configuration
   */
  constructor(config: Partial<TowerPlacementConfig> = {}) {
    this.config = {
      minTowerSpacing: 0.05,
      maxTowerSpacing: 0.15,
      spacingVarianceMax: 0.3,
      ...config
    };
    this.articulation = { ...DEFAULT_WALL_ARTICULATION, ...config.articulation };
  }

  /**
   * Places towers along walls following spacing constraints.
   * @param walls Array of wall objects
   * @param gates Array of gate objects
   * @param towerRadius Radius of towers to place
   * @returns Array of placed towers
   */
  placeTowersAlongWalls(walls: Wall[], gates: Gate[], towerRadius: number): Tower[] {
    this.towers = [];

    for (const wall of walls) {
      const wallTowers = this.placeTowersOnWall(wall, gates, towerRadius);
      this.towers.push(...wallTowers);
    }

    return this.towers;
  }

  /**
   * Validates tower spacing against constraints.
   * @param towers Array of towers to validate
   * @returns True if spacing is valid
   */
  validateTowerSpacing(towers: Tower[]): boolean {
    const spacings = this.computeTowerSpacings(towers);
    
    // Check minimum and maximum spacing
    for (const spacing of spacings) {
      if (spacing < this.config.minTowerSpacing || spacing > this.config.maxTowerSpacing) {
        return false;
      }
    }
    
    // Check spacing variance
    const meanSpacing = spacings.reduce((sum, s) => sum + s, 0) / spacings.length;
    const variance = Math.sqrt(
      spacings.reduce((sum, s) => sum + Math.pow(s - meanSpacing, 2), 0) / spacings.length
    );
    const varianceRatio = variance / meanSpacing;
    
    return varianceRatio <= this.config.spacingVarianceMax;
  }

  /**
   * Computes tower spacings along walls.
   * @param towers Array of towers
   * @returns Array of spacings between consecutive towers
   */
  computeTowerSpacings(towers: Tower[]): number[] {
    const spacings: number[] = [];
    
    // Group towers by wall
    const towersByWall = new Map<string, Tower[]>();
    for (const tower of towers) {
      const wallTowers = towersByWall.get(tower.wallId) || [];
      wallTowers.push(tower);
      towersByWall.set(tower.wallId, wallTowers);
    }
    
    // Compute spacings for each wall
    for (const [wallId, wallTowers] of towersByWall) {
      if (wallTowers.length < 2) continue;
      
      // Sort towers by position along wall
      const sortedTowers = this.sortTowersAlongWall(wallTowers);
      
      // Compute spacings between consecutive towers
      for (let i = 0; i < sortedTowers.length; i++) {
        const current = sortedTowers[i];
        const next = sortedTowers[(i + 1) % sortedTowers.length];
        
        const spacing = this.distance(current.position, next.position);
        spacings.push(spacing);
      }
    }
    
    return spacings;
  }

  /**
   * Gets the current tower placement configuration.
   * @returns Tower placement configuration
   */
  getConfig(): TowerPlacementConfig {
    return { ...this.config };
  }

  /**
   * Updates the tower placement configuration.
   * @param newConfig New tower placement configuration
   */
  updateConfig(newConfig: Partial<TowerPlacementConfig>): void {
    Object.assign(this.config, newConfig);
  }

  /**
   * Gets all placed towers.
   * @returns Array of towers
   */
  getTowers(): Tower[] {
    return [...this.towers];
  }

  /**
   * Places towers on a single wall.
   */
  private placeTowersOnWall(wall: Wall, gates: Gate[], towerRadius: number): Tower[] {
    const wallTowers: Tower[] = [];
    const perimeter = this.calculatePerimeter(wall.polygon);
    
    // Find required tower positions
    const requiredPositions = this.findRequiredTowerPositions(wall, gates, towerRadius);
    
    // Add towers at required positions
    for (const position of requiredPositions) {
      wallTowers.push({
        id: `tower-${wall.id}-${wallTowers.length}`,
        position,
        radius: towerRadius,
        wallId: wall.id
      });
    }
    
    // Fill in additional towers to meet spacing constraints
    const additionalTowers = this.placeAdditionalTowers(wall, wallTowers, towerRadius);
    wallTowers.push(...additionalTowers);
    
    return wallTowers;
  }

  /**
   * Finds required tower positions (corners, gate flanks).
   * HARD CONSTRAINT: Towers at angle changes, avoid shallow zig-zag.
   */
  private findRequiredTowerPositions(wall: Wall, gates: Gate[], towerRadius: number): Point[] {
    const positions: Point[] = [];
    
    // Add towers at angle changes (corners)
    // HARD CONSTRAINT: minAngleChangeForTower determines when a tower is required
    for (let i = 0; i < wall.polygon.length; i++) {
      const current = wall.polygon[i];
      const prev = wall.polygon[(i - 1 + wall.polygon.length) % wall.polygon.length];
      const next = wall.polygon[(i + 1) % wall.polygon.length];
      
      // Calculate angle between edges
      const angle1 = Math.atan2(current.y - prev.y, current.x - prev.x);
      const angle2 = Math.atan2(next.y - current.y, next.x - current.x);
      let angleDiff = Math.abs(angle2 - angle1);
      
      // Normalize to [0, PI]
      if (angleDiff > Math.PI) {
        angleDiff = 2 * Math.PI - angleDiff;
      }
      
      // Add tower at corners that exceed minimum angle change
      // HARD CONSTRAINT: Uses articulation.minAngleChangeForTower
      if (angleDiff >= this.articulation.minAngleChangeForTower) {
        positions.push(current);
      }
    }
    
    // Add towers at gate flanks
    for (const gate of gates) {
      if (gate.wallId !== wall.id) continue;
      
      // Find gate position on wall
      const gatePosition = this.findGatePositionOnWall(gate, wall);
      if (gatePosition) {
        // Place towers on both sides of gate
        const offset = gate.width / 2 + towerRadius * 1.5;
        const flank1 = this.offsetPointAlongWall(wall, gatePosition, offset);
        const flank2 = this.offsetPointAlongWall(wall, gatePosition, -offset);
        
        if (flank1) positions.push(flank1);
        if (flank2) positions.push(flank2);
      }
    }
    
    return positions;
  }

  /**
   * Analyzes wall articulation and returns angle changes.
   * Useful for debugging and validation.
   */
  analyzeWallArticulation(wall: Wall): Array<{ index: number; angleChange: number; needsTower: boolean }> {
    const analysis: Array<{ index: number; angleChange: number; needsTower: boolean }> = [];
    
    for (let i = 0; i < wall.polygon.length; i++) {
      const current = wall.polygon[i];
      const prev = wall.polygon[(i - 1 + wall.polygon.length) % wall.polygon.length];
      const next = wall.polygon[(i + 1) % wall.polygon.length];
      
      const angle1 = Math.atan2(current.y - prev.y, current.x - prev.x);
      const angle2 = Math.atan2(next.y - current.y, next.x - current.x);
      let angleDiff = Math.abs(angle2 - angle1);
      
      if (angleDiff > Math.PI) {
        angleDiff = 2 * Math.PI - angleDiff;
      }
      
      analysis.push({
        index: i,
        angleChange: angleDiff,
        needsTower: angleDiff >= this.articulation.minAngleChangeForTower
      });
    }
    
    return analysis;
  }

  /**
   * Validates wall articulation against constraints.
   * HARD CONSTRAINT: Long straight runs need towers, avoid shallow zig-zag.
   */
  validateWallArticulation(wall: Wall, towers: Tower[]): { valid: boolean; violations: string[] } {
    const violations: string[] = [];
    
    // Check for long straight runs without towers
    const sortedTowers = this.sortTowersAlongWall(
      towers.filter(t => t.wallId === wall.id)
    );
    
    if (sortedTowers.length < 2) {
      // Need at least 2 towers for a wall
      violations.push('Wall has fewer than 2 towers');
      return { valid: false, violations };
    }
    
    for (let i = 0; i < sortedTowers.length; i++) {
      const current = sortedTowers[i];
      const next = sortedTowers[(i + 1) % sortedTowers.length];
      const runLength = this.distance(current.position, next.position);
      
      // HARD CONSTRAINT: maxStraightRunWithoutTower
      if (runLength > this.articulation.maxStraightRunWithoutTower) {
        violations.push(`Straight run of ${runLength.toFixed(3)} exceeds maximum ${this.articulation.maxStraightRunWithoutTower}`);
      }
      
      // HARD CONSTRAINT: minStraightRunBetweenTowers
      if (runLength < this.articulation.minStraightRunBetweenTowers) {
        violations.push(`Tower spacing of ${runLength.toFixed(3)} below minimum ${this.articulation.minStraightRunBetweenTowers}`);
      }
    }
    
    // Check for shallow zig-zag patterns
    if (this.articulation.avoidShallowZigzag) {
      for (let i = 0; i < wall.polygon.length; i++) {
        const current = wall.polygon[i];
        const prev = wall.polygon[(i - 1 + wall.polygon.length) % wall.polygon.length];
        const next = wall.polygon[(i + 1) % wall.polygon.length];
        
        const angle1 = Math.atan2(current.y - prev.y, current.x - prev.x);
        const angle2 = Math.atan2(next.y - current.y, next.x - current.x);
        let angleDiff = Math.abs(angle2 - angle1);
        
        if (angleDiff > Math.PI) {
          angleDiff = 2 * Math.PI - angleDiff;
        }
        
        // Shallow zig-zag: small angle change that doesn't need a tower
        // but creates visual noise
        if (angleDiff > 0 && angleDiff < this.articulation.maxZigzagWithoutBastion) {
          // Check if there's a tower at this vertex
          const hasTower = towers.some(t =>
            t.wallId === wall.id &&
            this.distance(t.position, current) < 0.001
          );
          
          if (!hasTower) {
            violations.push(`Shallow zig-zag at vertex ${i} (${(angleDiff * 180 / Math.PI).toFixed(1)}°) without bastion`);
          }
        }
      }
    }
    
    return { valid: violations.length === 0, violations };
  }

  /**
   * Places additional towers to meet spacing constraints.
   */
  private placeAdditionalTowers(wall: Wall, existingTowers: Tower[], towerRadius: number): Tower[] {
    const additionalTowers: Tower[] = [];
    const perimeter = this.calculatePerimeter(wall.polygon);
    
    // Calculate how many additional towers are needed
    const targetCount = Math.floor(perimeter / this.config.maxTowerSpacing);
    const additionalCount = Math.max(0, targetCount - existingTowers.length);
    
    if (additionalCount <= 0) return additionalTowers;
    
    // Sort existing towers by position along wall
    const sortedTowers = this.sortTowersAlongWall(existingTowers);
    
    // Find gaps that are too large
    const gaps: Array<{start: Point, end: Point, length: number}> = [];
    for (let i = 0; i < sortedTowers.length; i++) {
      const current = sortedTowers[i];
      const next = sortedTowers[(i + 1) % sortedTowers.length];
      
      const gapLength = this.distance(current.position, next.position);
      if (gapLength > this.config.maxTowerSpacing) {
        gaps.push({
          start: current.position,
          end: next.position,
          length: gapLength
        });
      }
    }
    
    // Fill gaps with additional towers
    for (const gap of gaps) {
      const towersNeeded = Math.floor(gap.length / this.config.maxTowerSpacing);
      for (let i = 1; i <= towersNeeded; i++) {
        const t = i / (towersNeeded + 1);
        const position = {
          x: gap.start.x + (gap.end.x - gap.start.x) * t,
          y: gap.start.y + (gap.end.y - gap.start.y) * t
        };
        
        // Add some variance to spacing
        const variance = (Math.random() - 0.5) * this.config.spacingVarianceMax * this.config.maxTowerSpacing;
        const offsetPosition = this.offsetPointAlongWall(wall, position, variance);
        
        if (offsetPosition) {
          additionalTowers.push({
            id: `tower-${wall.id}-additional-${additionalTowers.length}`,
            position: offsetPosition,
            radius: towerRadius,
            wallId: wall.id
          });
        }
      }
    }
    
    return additionalTowers;
  }

  /**
   * Finds gate position on wall.
   */
  private findGatePositionOnWall(gate: Gate, wall: Wall): Point | null {
    let minDistance = Infinity;
    let closestPoint: Point | null = null;
    
    for (let i = 0; i < wall.polygon.length; i++) {
      const start = wall.polygon[i];
      const end = wall.polygon[(i + 1) % wall.polygon.length];
      
      const distance = this.pointToSegmentDistance(gate.position, start, end);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = this.getClosestPointOnSegment(gate.position, start, end);
      }
    }
    
    return closestPoint;
  }

  /**
   * Offsets a point along the wall by a specified distance.
   */
  private offsetPointAlongWall(wall: Wall, point: Point, offset: number): Point | null {
    let accumulatedDistance = 0;
    
    for (let i = 0; i < wall.polygon.length; i++) {
      const current = wall.polygon[i];
      const next = wall.polygon[(i + 1) % wall.polygon.length];
      
      const segmentLength = this.distance(current, next);
      
      // Check if point is on this segment
      const pointOnSegment = this.getClosestPointOnSegment(point, current, next);
      const distanceToSegment = this.distance(point, pointOnSegment);
      
      if (distanceToSegment < 0.001) { // Point is on this segment
        // Calculate offset position
        const targetDistance = accumulatedDistance + offset;
        return this.getPointAtDistanceAlongWall(wall.polygon, targetDistance);
      }
      
      accumulatedDistance += segmentLength;
    }
    
    return null;
  }

  /**
   * Gets a point at a specific distance along a wall polygon.
   */
  private getPointAtDistanceAlongWall(polygon: Point[], distance: number): Point {
    let accumulatedDistance = 0;
    
    for (let i = 0; i < polygon.length; i++) {
      const current = polygon[i];
      const next = polygon[(i + 1) % polygon.length];
      
      const segmentLength = this.distance(current, next);
      
      if (accumulatedDistance + segmentLength >= distance) {
        // Point is on this segment
        const remainingDistance = distance - accumulatedDistance;
        const t = remainingDistance / segmentLength;
        
        return {
          x: current.x + (next.x - current.x) * t,
          y: current.y + (next.y - current.y) * t
        };
      }
      
      accumulatedDistance += segmentLength;
    }
    
    // If we get here, distance is larger than perimeter, wrap around
    return polygon[0];
  }

  /**
   * Sorts towers by position along wall.
   */
  private sortTowersAlongWall(towers: Tower[]): Tower[] {
    // For now, sort by angle from center
    // In a more complex implementation, we would sort by arc length
    return [...towers].sort((a, b) => {
      const angleA = Math.atan2(a.position.y, a.position.x);
      const angleB = Math.atan2(b.position.y, b.position.x);
      return angleA - angleB;
    });
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
   * Calculates distance between two points.
   */
  private distance(a: Point, b: Point): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  /**
   * Calculates distance from point to line segment.
   */
  private pointToSegmentDistance(point: Point, segStart: Point, segEnd: Point): number {
    const A = point.x - segStart.x;
    const B = point.y - segStart.y;
    const C = segEnd.x - segStart.x;
    const D = segEnd.y - segStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = segStart.x;
      yy = segStart.y;
    } else if (param > 1) {
      xx = segEnd.x;
      yy = segEnd.y;
    } else {
      xx = segStart.x + param * C;
      yy = segStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Gets the closest point on a line segment to a given point.
   */
  private getClosestPointOnSegment(point: Point, segStart: Point, segEnd: Point): Point {
    const A = point.x - segStart.x;
    const B = point.y - segStart.y;
    const C = segEnd.x - segStart.x;
    const D = segEnd.y - segStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = segStart.x;
      yy = segStart.y;
    } else if (param > 1) {
      xx = segEnd.x;
      yy = segEnd.y;
    } else {
      xx = segStart.x + param * C;
      yy = segStart.y + param * D;
    }

    return { x: xx, y: yy };
  }
}