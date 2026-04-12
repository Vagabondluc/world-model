// @ts-nocheck
import { Point } from '../types';

export interface Wall {
  id: string;
  polygon: Point[];
  innerEdge: Point[];
  width: number;
}

export interface ClearZone {
  id: string;
  polygon: Point[];
  wallId: string;
  clearWidth: number;
}

/**
 * Computes and manages interior wall clear zones (pomerium).
 * The clear zone is a strip inside walls where buildings are not allowed.
 */
export class ClearZoneCalculator {
  private readonly defaultClearWidth: number;
  private clearZones: ClearZone[] = [];

  /**
   * Creates a new ClearZoneCalculator.
   * @param defaultClearWidth Default clear width inside walls
   */
  constructor(defaultClearWidth: number = 0.05) {
    this.defaultClearWidth = defaultClearWidth;
  }

  /**
   * Computes clear zones for all walls.
   * @param walls Array of wall objects
   * @param clearWidth Optional custom clear width
   * @returns Array of clear zone polygons
   */
  computeClearZones(walls: Wall[], clearWidth?: number): ClearZone[] {
    this.clearZones = [];
    const width = clearWidth || this.defaultClearWidth;

    for (const wall of walls) {
      // Use the inner edge of the wall as the base for the clear zone
      const clearZonePolygon = this.expandPolygon(wall.innerEdge, width);
      
      this.clearZones.push({
        id: `clear-zone-${wall.id}`,
        polygon: clearZonePolygon,
        wallId: wall.id,
        clearWidth: width
      });
    }

    return this.clearZones;
  }

  /**
   * Checks if a point is within any clear zone.
   * @param point Point to check
   * @returns True if point is in a clear zone
   */
  isPointInClearZone(point: Point): boolean {
    for (const clearZone of this.clearZones) {
      if (this.isPointInPolygon(point, clearZone.polygon)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if a polygon intersects with any clear zone.
   * @param polygon Polygon to check
   * @returns True if polygon intersects a clear zone
   */
  doesPolygonIntersectClearZone(polygon: Point[]): boolean {
    for (const clearZone of this.clearZones) {
      if (this.polygonsIntersect(polygon, clearZone.polygon)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Finds buildings that violate clear zone constraints.
   * @param buildings Array of building polygons
   * @returns Array of building indices that violate clear zones
   */
  findClearZoneViolations(buildings: Point[][]): number[] {
    const violations: number[] = [];
    
    for (let i = 0; i < buildings.length; i++) {
      if (this.doesPolygonIntersectClearZone(buildings[i])) {
        violations.push(i);
      }
    }
    
    return violations;
  }

  /**
   * Computes minimum distance from buildings to wall inner edge.
   * @param buildings Array of building polygons
   * @param walls Array of wall objects
   * @returns Minimum distance
   */
  computeMinDistanceToWallInnerEdge(buildings: Point[][], walls: Wall[]): number {
    let minDistance = Infinity;
    
    for (const building of buildings) {
      const buildingCenter = this.polygonCentroid(building);
      
      for (const wall of walls) {
        for (const point of wall.innerEdge) {
          const distance = this.distance(buildingCenter, point);
          if (distance < minDistance) {
            minDistance = distance;
          }
        }
      }
    }
    
    return minDistance === Infinity ? 0 : minDistance;
  }

  /**
   * Gets the current clear zones.
   * @returns Array of clear zone polygons
   */
  getClearZones(): ClearZone[] {
    return [...this.clearZones];
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
      
      // Calculate normal vectors (perpendicular to edges, pointing inward for clear zone)
      const n1 = { x: v1.y, y: -v1.x }; // Inward normal
      const n2 = { x: v2.y, y: -v2.x }; // Inward normal
      
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

  /**
   * Calculates distance between two points.
   */
  private distance(a: Point, b: Point): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  /**
   * Calculates the centroid of a polygon.
   */
  private polygonCentroid(polygon: Point[]): Point {
    let x = 0;
    let y = 0;
    for (const p of polygon) {
      x += p.x;
      y += p.y;
    }
    return { x: x / polygon.length, y: y / polygon.length };
  }
}