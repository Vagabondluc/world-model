// @ts-nocheck
import { Point, WallProportionsConfig, DEFAULT_WALL_PROPORTIONS } from '../types';

export interface Wall {
  id: string;
  polygon: Point[];
  innerEdge: Point[];
  width: number;
}

export interface ViewportTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Computes wall width from world scale and manages viewport transformations.
 * Ensures consistent scaling across different viewports.
 *
 * HARD CONSTRAINT: Wall proportions must follow visual coherence rules:
 * - wallWidth ≈ roadWidth * 1.5
 * - towerRadius ≈ 1.5-2 × wallWidth
 */
export class WallScaler {
  private readonly config: WallProportionsConfig;
  private readonly typicalStreetWidth: number;

  /**
   * Creates a new WallScaler.
   * @param config Wall proportions configuration (or uses defaults)
   * @param typicalStreetWidth Typical street width for reference
   */
  constructor(config: Partial<WallProportionsConfig> = {}, typicalStreetWidth: number = 0.015) {
    this.config = { ...DEFAULT_WALL_PROPORTIONS, ...config };
    this.typicalStreetWidth = typicalStreetWidth;
  }

  /**
   * Gets the wall thickness ratio.
   * @returns Wall thickness ratio
   */
  getWallThicknessRatio(): number {
    return this.config.wallThicknessRatio;
  }

  /**
   * Computes wall width based on world scale.
   * @param cityRadius Radius of the city
   * @param viewportTransform Optional viewport transform
   * @returns Wall width in world units
   */
  computeWallWidth(cityRadius: number, viewportTransform?: ViewportTransform): number {
    // Base width proportional to city radius
    const baseWidth = cityRadius * this.config.wallThicknessRatio;
    
    // Apply viewport transformation if provided
    if (viewportTransform) {
      return this.applyViewportTransform(baseWidth, viewportTransform);
    }
    
    return baseWidth;
  }

  /**
   * Computes rendered wall width for a specific viewport.
   * @param worldWidth Wall width in world units
   * @param viewportTransform Viewport transformation
   * @returns Rendered wall width in pixels
   */
  computeRenderedWidth(worldWidth: number, viewportTransform: ViewportTransform): number {
    return this.applyViewportTransform(worldWidth, viewportTransform);
  }

  /**
   * Validates wall width against design constraints.
   * HARD CONSTRAINT: Wall width should be proportional to road width.
   * @param wallWidth Wall width to validate
   * @returns True if width is within acceptable range
   */
  validateWallWidth(wallWidth: number): boolean {
    // Wall width should be between 1x and 2x typical street width
    // Target ratio: wallWidth ≈ roadWidth * 1.5
    const minRatio = this.config.wallToRoadRatio * 0.67; // Allow some variance
    const maxRatio = this.config.wallToRoadRatio * 1.33;
    return wallWidth >= this.typicalStreetWidth * minRatio &&
           wallWidth <= this.typicalStreetWidth * maxRatio;
  }

  /**
   * Computes tower radius based on wall width.
   * HARD CONSTRAINT: towerRadius ≈ 1.5-2 × wallWidth
   * @param wallWidth Width of the wall
   * @returns Tower radius in world units
   */
  computeTowerRadius(wallWidth: number): number {
    return wallWidth * this.config.towerToWallRatio;
  }

  /**
   * Validates tower radius against wall width.
   * @param towerRadius Tower radius to validate
   * @param wallWidth Wall width for reference
   * @returns True if ratio is within acceptable range
   */
  validateTowerRadius(towerRadius: number, wallWidth: number): boolean {
    const ratio = towerRadius / wallWidth;
    return ratio >= this.config.minTowerToWallRatio &&
           ratio <= this.config.maxTowerToWallRatio;
  }

  /**
   * Gets the typical street width.
   * @returns Typical street width
   */
  getTypicalStreetWidth(): number {
    return this.typicalStreetWidth;
  }

  /**
   * Gets the wall proportions configuration.
   * @returns Wall proportions configuration
   */
  getConfig(): WallProportionsConfig {
    return { ...this.config };
  }

  /**
   * Applies viewport transformation to a world unit width.
   */
  private applyViewportTransform(worldWidth: number, transform: ViewportTransform): number {
    // Apply scale and offset
    return worldWidth * transform.scale;
  }

  /**
   * Creates a wall with computed width.
   * @param wallId ID for the wall
   * @param center Center point of the wall
   * @param radius Radius of the wall
   * @param cityRadius Radius of the city
   * @param viewportTransform Optional viewport transform
   * @returns Wall object with computed width
   */
  createWall(
    wallId: string,
    center: Point,
    radius: number,
    cityRadius: number,
    viewportTransform?: ViewportTransform
  ): Wall {
    const width = this.computeWallWidth(cityRadius, viewportTransform);
    
    // Create a simple octagonal wall
    const sides = 8;
    const polygon: Point[] = [];
    
    for (let i = 0; i < sides; i++) {
      const angle = (2 * Math.PI * i) / sides;
      polygon.push({
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle)
      });
    }
    
    // Calculate inner edge by offsetting inward
    const innerEdge = this.createInnerEdge(polygon, width);
    
    return {
      id: wallId,
      polygon,
      innerEdge,
      width
    };
  }

  /**
   * Updates an existing wall with new width.
   * @param wall Wall to update
   * @param cityRadius Radius of the city
   * @param viewportTransform Optional viewport transform
   * @returns Updated wall
   */
  updateWallWidth(
    wall: Wall,
    cityRadius: number,
    viewportTransform?: ViewportTransform
  ): Wall {
    const newWidth = this.computeWallWidth(cityRadius, viewportTransform);
    
    // Recalculate inner edge with new width
    const newInnerEdge = this.createInnerEdge(wall.polygon, newWidth);
    
    return {
      ...wall,
      innerEdge: newInnerEdge,
      width: newWidth
    };
  }

  /**
   * Creates the inner edge of a wall by offsetting inward.
   */
  private createInnerEdge(polygon: Point[], width: number): Point[] {
    if (polygon.length < 3) return polygon;
    
    const innerEdge: Point[] = [];
    
    for (let i = 0; i < polygon.length; i++) {
      const prev = polygon[(i - 1 + polygon.length) % polygon.length];
      const curr = polygon[i];
      const next = polygon[(i + 1) % polygon.length];
      
      // Calculate edge vectors
      const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
      const v2 = { x: next.x - curr.x, y: next.y - curr.y };
      
      // Calculate normal vectors (perpendicular to edges, pointing inward)
      const n1 = { x: v1.y, y: -v1.x };
      const n2 = { x: v2.y, y: -v2.x };
      
      // Normalize normal vectors
      const len1 = Math.sqrt(n1.x * n1.x + n1.y * n1.y);
      const len2 = Math.sqrt(n2.x * n2.x + n2.y * n2.y);
      
      if (len1 > 0) {
        n1.x /= len1;
        n1.y /= len1;
      }
      
      if (len2 > 0) {
        n2.x /= len2;
        n2.y /= len2;
      }
      
      // Average the normal vectors
      const normal = {
        x: (n1.x + n2.x) / 2,
        y: (n1.y + n2.y) / 2
      };
      
      // Normalize the average
      const normalLen = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
      if (normalLen > 0) {
        normal.x /= normalLen;
        normal.y /= normalLen;
      }
      
      // Offset the vertex by the width along the normal
      innerEdge.push({
        x: curr.x + normal.x * width,
        y: curr.y + normal.y * width
      });
    }
    
    return innerEdge;
  }
}