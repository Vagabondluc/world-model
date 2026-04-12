// @ts-nocheck
import { Point } from '../types';

export interface Building {
  id: string;
  polygon: Point[];
}

export interface Wall {
  id: string;
  polygon: Point[];
  innerEdge: Point[];
  width: number;
}

export interface Bridge {
  id: string;
  position: Point;
  axis: Point;
  width: number;
  length: number;
}

export interface Water {
  id: string;
  polygon: Point[];
}

export interface GeometryValidationResult {
  invalidGeometry: boolean;
  hiddenByLayerOrder: boolean;
  bridgeAboveWater: boolean;
  wallNotUnderBuilding: boolean;
  violations: Array<{
    type: string;
    elementId: string;
    description: string;
  }>;
}

export interface LayerConfig {
  water: number;
  bridges: number;
  walls: number;
  buildings: number;
}

/**
 * Validates geometry integrity and layer consistency.
 * Detects geometric collisions and ensures proper layer ordering.
 */
export class GeometryValidator {
  private readonly layerConfig: LayerConfig;

  /**
   * Creates a new GeometryValidator.
   * @param layerConfig Layer ordering configuration
   */
  constructor(layerConfig?: Partial<LayerConfig>) {
    this.layerConfig = {
      water: 0,
      bridges: 1,
      walls: 2,
      buildings: 3,
      ...layerConfig
    };
  }

  /**
   * Validates city geometry for integrity issues.
   * @param buildings Array of building objects
   * @param walls Array of wall objects
   * @param bridges Array of bridge objects
   * @param water Array of water objects
   * @returns Geometry validation result
   */
  validateGeometry(
    buildings: Building[],
    walls: Wall[],
    bridges: Bridge[],
    water: Water[]
  ): GeometryValidationResult {
    const violations: Array<{
      type: string;
      elementId: string;
      description: string;
    }> = [];

    // Check for invalid geometry (self-intersecting polygons)
    const invalidGeometry = this.checkInvalidGeometry(buildings, walls, water);
    violations.push(...invalidGeometry);

    // Check for layer order issues
    const layerOrderIssues = this.checkLayerOrder(buildings, walls, bridges, water);
    violations.push(...layerOrderIssues);

    // Check for bridge-water relationships
    const bridgeWaterIssues = this.checkBridgeWaterRelationship(bridges, water);
    violations.push(...bridgeWaterIssues);

    // Check for wall-building relationships
    const wallBuildingIssues = this.checkWallBuildingRelationship(buildings, walls);
    violations.push(...wallBuildingIssues);

    return {
      invalidGeometry: invalidGeometry.length > 0,
      hiddenByLayerOrder: layerOrderIssues.length > 0,
      bridgeAboveWater: bridgeWaterIssues.length === 0,
      wallNotUnderBuilding: wallBuildingIssues.length === 0,
      violations
    };
  }

  /**
   * Gets the current layer configuration.
   * @returns Layer configuration
   */
  getLayerConfig(): LayerConfig {
    return { ...this.layerConfig };
  }

  /**
   * Updates the layer configuration.
   * @param newConfig New layer configuration
   */
  updateLayerConfig(newConfig: Partial<LayerConfig>): void {
    Object.assign(this.layerConfig, newConfig);
  }

  /**
   * Checks for invalid geometry (self-intersecting polygons).
   */
  private checkInvalidGeometry(
    buildings: Building[],
    walls: Wall[],
    water: Water[]
  ): Array<{ type: string; elementId: string; description: string }> {
    const violations: Array<{ type: string; elementId: string; description: string }> = [];

    // Check buildings
    for (const building of buildings) {
      if (this.isSelfIntersecting(building.polygon)) {
        violations.push({
          type: 'invalid-geometry',
          elementId: building.id,
          description: 'Building polygon is self-intersecting'
        });
      }
    }

    // Check walls
    for (const wall of walls) {
      if (this.isSelfIntersecting(wall.polygon)) {
        violations.push({
          type: 'invalid-geometry',
          elementId: wall.id,
          description: 'Wall polygon is self-intersecting'
        });
      }
    }

    // Check water
    for (const waterBody of water) {
      if (this.isSelfIntersecting(waterBody.polygon)) {
        violations.push({
          type: 'invalid-geometry',
          elementId: waterBody.id,
          description: 'Water polygon is self-intersecting'
        });
      }
    }

    return violations;
  }

  /**
   * Checks for layer order issues that might hide invalid geometry.
   */
  private checkLayerOrder(
    buildings: Building[],
    walls: Wall[],
    bridges: Bridge[],
    water: Water[]
  ): Array<{ type: string; elementId: string; description: string }> {
    const violations: Array<{ type: string; elementId: string; description: string }> = [];

    // Check if water is below bridges
    for (const bridge of bridges) {
      for (const waterBody of water) {
        if (this.polygonsIntersect(
          this.createBridgePolygon(bridge),
          waterBody.polygon
        )) {
          if (this.layerConfig.water >= this.layerConfig.bridges) {
            violations.push({
              type: 'layer-order',
              elementId: bridge.id,
              description: 'Bridge is not rendered above water'
            });
          }
        }
      }
    }

    // Check if walls are below buildings
    for (const building of buildings) {
      for (const wall of walls) {
        if (this.polygonsIntersect(building.polygon, wall.polygon)) {
          if (this.layerConfig.walls >= this.layerConfig.buildings) {
            violations.push({
              type: 'layer-order',
              elementId: building.id,
              description: 'Building is not rendered above wall'
            });
          }
        }
      }
    }

    return violations;
  }

  /**
   * Checks for proper bridge-water relationships.
   */
  private checkBridgeWaterRelationship(
    bridges: Bridge[],
    water: Water[]
  ): Array<{ type: string; elementId: string; description: string }> {
    const violations: Array<{ type: string; elementId: string; description: string }> = [];

    for (const bridge of bridges) {
      let foundWater = false;
      for (const waterBody of water) {
        if (this.polygonsIntersect(
          this.createBridgePolygon(bridge),
          waterBody.polygon
        )) {
          foundWater = true;
          break;
        }
      }

      if (!foundWater) {
        violations.push({
          type: 'bridge-water',
          elementId: bridge.id,
          description: 'Bridge is not over water'
        });
      }
    }

    return violations;
  }

  /**
   * Checks for proper wall-building relationships.
   */
  private checkWallBuildingRelationship(
    buildings: Building[],
    walls: Wall[]
  ): Array<{ type: string; elementId: string; description: string }> {
    const violations: Array<{ type: string; elementId: string; description: string }> = [];

    for (const building of buildings) {
      for (const wall of walls) {
        if (this.polygonsIntersect(building.polygon, wall.polygon)) {
          violations.push({
            type: 'wall-building',
            elementId: building.id,
            description: 'Building intersects with wall'
          });
        }
      }
    }

    return violations;
  }

  /**
   * Creates a polygon representation of a bridge.
   */
  private createBridgePolygon(bridge: Bridge): Point[] {
    const halfWidth = bridge.width / 2;
    const halfLength = bridge.length / 2;

    // Create perpendicular vector
    const perp = {
      x: -bridge.axis.y,
      y: bridge.axis.x
    };

    // Calculate four corners of the bridge
    return [
      {
        x: bridge.position.x - bridge.axis.x * halfLength - perp.x * halfWidth,
        y: bridge.position.y - bridge.axis.y * halfLength - perp.y * halfWidth
      },
      {
        x: bridge.position.x + bridge.axis.x * halfLength - perp.x * halfWidth,
        y: bridge.position.y + bridge.axis.y * halfLength - perp.y * halfWidth
      },
      {
        x: bridge.position.x + bridge.axis.x * halfLength + perp.x * halfWidth,
        y: bridge.position.y + bridge.axis.y * halfLength + perp.y * halfWidth
      },
      {
        x: bridge.position.x - bridge.axis.x * halfLength + perp.x * halfWidth,
        y: bridge.position.y - bridge.axis.y * halfLength + perp.y * halfWidth
      }
    ];
  }

  /**
   * Checks if a polygon is self-intersecting.
   */
  private isSelfIntersecting(polygon: Point[]): boolean {
    if (polygon.length < 4) return false;

    for (let i = 0; i < polygon.length; i++) {
      const a1 = polygon[i];
      const a2 = polygon[(i + 1) % polygon.length];

      // Check if this edge intersects with any non-adjacent edge
      for (let j = i + 2; j < polygon.length; j++) {
        // Skip adjacent edges
        if (j === i || (j + 1) % polygon.length === i) continue;

        const b1 = polygon[j];
        const b2 = polygon[(j + 1) % polygon.length];

        if (this.segmentsIntersect(a1, a2, b1, b2)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks if two polygons intersect.
   */
  private polygonsIntersect(poly1: Point[], poly2: Point[]): boolean {
    // Check if any vertex of poly1 is inside poly2
    for (const point of poly1) {
      if (this.isPointInPolygon(point, poly2)) {
        return true;
      }
    }

    // Check if any vertex of poly2 is inside poly1
    for (const point of poly2) {
      if (this.isPointInPolygon(point, poly1)) {
        return true;
      }
    }

    // Check if any edges intersect
    for (let i = 0; i < poly1.length; i++) {
      const a1 = poly1[i];
      const a2 = poly1[(i + 1) % poly1.length];

      for (let j = 0; j < poly2.length; j++) {
        const b1 = poly2[j];
        const b2 = poly2[(j + 1) % poly2.length];

        if (this.segmentsIntersect(a1, a2, b1, b2)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks if a point is inside a polygon.
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
   * Checks if two line segments intersect.
   */
  private segmentsIntersect(a1: Point, a2: Point, b1: Point, b2: Point): boolean {
    const o1 = this.orientation(a1, a2, b1);
    const o2 = this.orientation(a1, a2, b2);
    const o3 = this.orientation(b1, b2, a1);
    const o4 = this.orientation(b1, b2, a2);

    // General case
    if (o1 !== o2 && o3 !== o4) return true;

    // Special cases
    if (o1 === 0 && this.onSegment(a1, b1, a2)) return true;
    if (o2 === 0 && this.onSegment(a1, b2, a2)) return true;
    if (o3 === 0 && this.onSegment(b1, a1, b2)) return true;
    if (o4 === 0 && this.onSegment(b1, a2, b2)) return true;

    return false;
  }

  /**
   * Finds orientation of ordered triplet (p, q, r).
   * @returns 0 -> colinear, 1 -> clockwise, 2 -> counterclockwise
   */
  private orientation(p: Point, q: Point, r: Point): number {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (Math.abs(val) < 1e-12) return 0; // colinear
    return val > 0 ? 1 : 2; // clock or counterclock wise
  }

  /**
   * Checks if point q lies on segment pr.
   */
  private onSegment(p: Point, q: Point, r: Point): boolean {
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
           q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
  }
}