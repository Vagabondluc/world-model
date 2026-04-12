// @ts-nocheck
import { Point } from '../types';
import { Building } from '../buildings/synthesize';

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
}

export interface ForbiddenMaskPolygon {
  id: string;
  polygon: Point[];
  type: 'wall' | 'tower';
  sourceId: string;
}

/**
 * Computes and manages forbidden mask areas for building placement.
 * The forbidden mask consists of wall polygons and tower footprints,
 * expanded by a building setback to ensure no building-wall collisions.
 */
export class ForbiddenMaskCalculator {
  private readonly buildingSetback: number;
  private mask: ForbiddenMaskPolygon[] = [];

  /**
   * Creates a new ForbiddenMaskCalculator.
   * @param buildingSetback The minimum distance buildings must maintain from walls and towers
   */
  constructor(buildingSetback: number = 0.01) {
    this.buildingSetback = buildingSetback;
  }

  /**
   * Computes the forbidden mask from walls and towers.
   * @param walls Array of wall objects
   * @param towers Array of tower objects
   * @returns Array of forbidden mask polygons
   */
  computeMask(walls: Wall[], towers: Tower[]): ForbiddenMaskPolygon[] {
    this.mask = [];

    // Add wall polygons to mask without setback for now
    for (const wall of walls) {
      this.mask.push({
        id: `wall-${wall.id}`,
        polygon: wall.polygon,
        type: 'wall',
        sourceId: wall.id
      });
    }

    // Add tower footprints to mask without setback for now
    for (const tower of towers) {
      const towerPolygon = this.createTowerPolygon(tower.position, tower.radius);
      this.mask.push({
        id: `tower-${tower.id}`,
        polygon: towerPolygon,
        type: 'tower',
        sourceId: tower.id
      });
    }

    return this.mask;
  }

  /**
   * Checks if a building intersects with the forbidden mask.
   * @param building The building to check
   * @returns True if the building intersects the mask
   */
  checkBuildingIntersection(building: Building): boolean {
    for (const maskPolygon of this.mask) {
      if (this.polygonsIntersect(building.polygon, maskPolygon.polygon)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Finds all intersections between a building and the forbidden mask.
   * @param building The building to check
   * @returns Array of intersection details
   */
  findBuildingIntersections(building: Building): Array<{maskId: string, type: 'wall' | 'tower', sourceId: string}> {
    const intersections: Array<{maskId: string, type: 'wall' | 'tower', sourceId: string}> = [];
    
    for (const maskPolygon of this.mask) {
      if (this.polygonsIntersect(building.polygon, maskPolygon.polygon)) {
        intersections.push({
          maskId: maskPolygon.id,
          type: maskPolygon.type,
          sourceId: maskPolygon.sourceId
        });
      }
    }
    
    return intersections;
  }

  /**
   * Counts total intersections between buildings and the forbidden mask.
   * @param buildings Array of buildings to check
   * @returns Total number of intersections
   */
  countIntersections(buildings: Building[]): number {
    let count = 0;
    for (const building of buildings) {
      count += this.findBuildingIntersections(building).length;
    }
    return count;
  }

  /**
   * Gets the current forbidden mask.
   * @returns Array of forbidden mask polygons
   */
  getMask(): ForbiddenMaskPolygon[] {
    return [...this.mask];
  }

  /**
   * Creates a polygon representation of a tower.
   * @param position Center position of the tower
   * @param radius Radius of the tower
   * @returns Polygon representing the tower
   */
  private createTowerPolygon(position: Point, radius: number): Point[] {
    const segments = 16;
    const polygon: Point[] = [];
    
    for (let i = 0; i < segments; i++) {
      const angle = (2 * Math.PI * i) / segments;
      polygon.push({
        x: position.x + radius * Math.cos(angle),
        y: position.y + radius * Math.sin(angle)
      });
    }
    
    return polygon;
  }

  /**
   * Expands a polygon outward by the specified distance.
   * @param polygon The original polygon
   * @param distance The expansion distance
   * @returns Expanded polygon
   */
  private expandPolygon(polygon: Point[], distance: number): Point[] {
    if (polygon.length < 3) return polygon;
    
    const expanded: Point[] = [];
    
    for (let i = 0; i < polygon.length; i++) {
      const prev = polygon[(i - 1 + polygon.length) % polygon.length];
      const curr = polygon[i];
      const next = polygon[(i + 1) % polygon.length];
      
      // Calculate edge vectors
      const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
      const v2 = { x: next.x - curr.x, y: next.y - curr.y };
      
      // Calculate normal vectors (perpendicular to edges, pointing outward)
      const n1 = { x: -v1.y, y: v1.x };
      const n2 = { x: -v2.y, y: v2.x };
      
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
      
      // Offset the vertex by the distance along the normal
      expanded.push({
        x: curr.x + normal.x * distance,
        y: curr.y + normal.y * distance
      });
    }
    
    return expanded;
  }

  /**
   * Checks if two polygons intersect.
   * @param poly1 First polygon
   * @param poly2 Second polygon
   * @returns True if polygons intersect
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
   * @param point Point to check
   * @param polygon Polygon to check against
   * @returns True if point is inside polygon
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
   * @param a1 First point of first segment
   * @param a2 Second point of first segment
   * @param b1 First point of second segment
   * @param b2 Second point of second segment
   * @returns True if segments intersect
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