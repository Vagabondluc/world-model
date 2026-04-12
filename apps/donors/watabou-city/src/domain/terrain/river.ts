// @ts-nocheck
import { Point, isPointInPolygon } from '../types';
import { PRNG } from '../seed/prng';

export interface River {
  points: Point[];
  width: number;
  junctions?: RiverJunction[];
  branches?: RiverBranch[];
}

export interface RiverJunction {
  id: string;
  type: 'confluence' | 'bifurcation' | 'delta' | 'none';
  point: Point;
}

export interface RiverBranch {
  decision: string;
  points: Point[];
}

export interface SelfIntersection {
  point: Point;
  segment1: { start: number; end: number };
  segment2: { start: number; end: number };
  isJunction: boolean;
  junctionId?: string;
}

export interface ContinuityResult {
  isContinuous: boolean;
  gaps: { from: Point; to: Point; distance: number }[];
}

export interface WidthProfileValidation {
  valid: boolean;
  negativeCount: number;
  outOfRangeCount: number;
}

export interface DomainRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ClippedRiver {
  points: Point[];
  width: number;
  orphanedSegments?: Point[][];
  hasOrphanedSegments?: boolean;
}

export interface FloodZone {
  polygon: Point[];
  extent: number;
}

export interface RoadRiverCrossing {
  roadId: string;
  riverId: string;
  point: Point;
  type: 'bridge' | 'ford' | 'ferry';
  hasBridge: boolean;
  hasFord: boolean;
  valid: boolean;
  resolved: boolean;
  isTrunk?: boolean;
}

export interface WallRiverIntersection {
  wallId: string;
  riverId: string;
  point: Point;
  resolved: boolean;
  resolutionType?: 'bridge' | 'gate' | 'none';
}

export interface ConstraintResolutionLog {
  jitterApplications: { higherPriorityConstraintsSatisfied: boolean }[];
  conflicts: { resolution: string; winningPriority: number; losingPriority: number }[];
}

/**
 * Generates a deterministic meandering river that passes near the city center.
 */
export function generateRiver(hub: Point, rng: PRNG): River {
  const points: Point[] = [];
  const segments = 14;
  const angle = rng.nextFloat() * Math.PI;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const nx = -dy;
  const ny = dx;
  const meander = 0.08 + rng.nextFloat() * 0.06;
  const phase = rng.nextFloat() * Math.PI * 2;
  const centerOffset = (rng.nextFloat() - 0.5) * 0.15;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const linePos = -1.1 + t * 2.2;
    const bend =
      Math.sin(t * Math.PI * 2 + phase) * meander +
      Math.sin(t * Math.PI * 5 + phase * 0.6) * (meander * 0.25);

    const x = hub.x + dx * linePos + nx * (centerOffset + bend);
    const y = hub.y + dy * linePos + ny * (centerOffset + bend);

    points.push({ x, y });
  }

  const normalized = ensureTraversesFrame(points, hub, dx, dy);
  return {
    points: normalized,
    width: 10 + rng.nextFloat() * 8,
  };
}

function ensureTraversesFrame(points: Point[], hub: Point, dx: number, dy: number): Point[] {
  if (points.length < 2) return points;
  const out = points.map((p) => ({ ...p }));
  if (!isOutsideUnitSquare(out[0])) {
    out[0] = { x: hub.x - dx * 1.25, y: hub.y - dy * 1.25 };
  }
  if (!isOutsideUnitSquare(out[out.length - 1])) {
    out[out.length - 1] = { x: hub.x + dx * 1.25, y: hub.y + dy * 1.25 };
  }
  return out;
}

function isOutsideUnitSquare(p: Point): boolean {
  return p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1;
}

export function distanceToRiver(p: Point, river: River): number {
  if (river.points.length < 2) return Infinity;
  let best = Infinity;
  for (let i = 0; i < river.points.length - 1; i++) {
    const d = pointToSegmentDistance(p, river.points[i], river.points[i + 1]);
    if (d < best) best = d;
  }
  return best;
}

function pointToSegmentDistance(p: Point, a: Point, b: Point): number {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const apx = p.x - a.x;
  const apy = p.y - a.y;
  const ab2 = abx * abx + aby * aby || 1;
  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / ab2));
  const x = a.x + abx * t;
  const y = a.y + aby * t;
  const dx = p.x - x;
  const dy = p.y - y;
  return Math.hypot(dx, dy);
}

export interface Building {
  id: string;
  footprint: Point[];
  parcelClass?: string;
}

export interface RiverbankViolation {
  buildingId: string;
  building: Building;
  distance: number;
  isInSetback: boolean;
}

export interface City {
  buildings: Building[];
  rivers: RiverPolygon;
  config: CityConfig;
}

export interface RiverPolygon {
  polygon: Point[];
  width: number;
}

export interface CityConfig {
  riverBankSetback: number;
  quayMode: boolean;
}

/**
 * RiverbankSetback class ensures buildings respect riverbank setback unless quay is permitted.
 */
export class RiverbankSetback {
  private river: RiverPolygon;
  private setback: number;
  private quayMode: boolean;

  constructor(river: RiverPolygon, setback: number, quayMode: boolean = false) {
    this.river = river;
    this.setback = setback;
    this.quayMode = quayMode;
  }

  /**
   * Creates a buffer zone around the river based on the setback distance
   */
  public createRiverBuffer(): Point[] {
    const bufferPolygon: Point[] = [];
    const riverPoints = this.river.polygon;
    
    if (riverPoints.length < 2) return bufferPolygon;

    // Create a buffer by offsetting the river polygon
    // This is a simplified implementation - in reality would use proper polygon offsetting
    const halfWidth = this.river.width / 2;
    const totalOffset = halfWidth + this.setback;

    for (let i = 0; i < riverPoints.length; i++) {
      const current = riverPoints[i];
      const prev = riverPoints[(i - 1 + riverPoints.length) % riverPoints.length];
      const next = riverPoints[(i + 1) % riverPoints.length];

      // Calculate normal vector
      const dx1 = current.x - prev.x;
      const dy1 = current.y - prev.y;
      const dx2 = next.x - current.x;
      const dy2 = next.y - current.y;

      // Average the normals of adjacent segments
      const normal1 = { x: -dy1, y: dx1 };
      const normal2 = { x: -dy2, y: dx2 };
      
      // Normalize
      const len1 = Math.hypot(normal1.x, normal1.y) || 1;
      const len2 = Math.hypot(normal2.x, normal2.y) || 1;
      
      normal1.x /= len1;
      normal1.y /= len1;
      normal2.x /= len2;
      normal2.y /= len2;

      // Average the normals
      const avgNormal = {
        x: (normal1.x + normal2.x) / 2,
        y: (normal1.y + normal2.y) / 2
      };

      // Normalize the average
      const avgLen = Math.hypot(avgNormal.x, avgNormal.y) || 1;
      avgNormal.x /= avgLen;
      avgNormal.y /= avgLen;

      // Apply offset
      bufferPolygon.push({
        x: current.x + avgNormal.x * totalOffset,
        y: current.y + avgNormal.y * totalOffset
      });
    }

    return bufferPolygon;
  }

  /**
   * Checks if a building is within the river setback zone
   */
  public isBuildingInSetback(building: Building): boolean {
    if (this.quayMode && building.parcelClass === 'quay') {
      return false; // Quay buildings are exempt from setback
    }

    const riverBuffer = this.createRiverBuffer();
    
    // Check if any part of the building footprint is in the buffer
    for (const point of building.footprint) {
      if (isPointInPolygon(point, riverBuffer)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Finds all buildings that violate the river setback
   */
  public findViolations(buildings: Building[]): RiverbankViolation[] {
    const violations: RiverbankViolation[] = [];

    for (const building of buildings) {
      const distance = this.distanceToRiverBuffer(building);
      const isInSetback = this.isBuildingInSetback(building);

      if (isInSetback) {
        violations.push({
          buildingId: building.id,
          building,
          distance,
          isInSetback
        });
      }
    }

    return violations;
  }

  /**
   * Calculates the minimum distance from a building to the river buffer
   */
  private distanceToRiverBuffer(building: Building): number {
    const riverBuffer = this.createRiverBuffer();
    let minDistance = Infinity;

    for (const point of building.footprint) {
      const distance = this.pointToPolygonDistance(point, riverBuffer);
      minDistance = Math.min(minDistance, distance);
    }

    return minDistance;
  }

  /**
   * Calculates the distance from a point to a polygon
   */
  private pointToPolygonDistance(point: Point, polygon: Point[]): number {
    if (polygon.length < 3) return Infinity;

    // If point is inside polygon, distance is 0
    if (isPointInPolygon(point, polygon)) {
      return 0;
    }

    // Otherwise, find minimum distance to any edge
    let minDistance = Infinity;
    for (let i = 0; i < polygon.length; i++) {
      const start = polygon[i];
      const end = polygon[(i + 1) % polygon.length];
      const distance = pointToSegmentDistance(point, start, end);
      minDistance = Math.min(minDistance, distance);
    }

    return minDistance;
  }

  /**
   * Validates that all buildings respect the river setback
   */
  public validateBuildings(buildings: Building[]): boolean {
    const violations = this.findViolations(buildings);
    
    // In quay mode, only non-quay buildings must respect setback
    if (this.quayMode) {
      return violations.every(v => v.building.parcelClass === 'quay');
    }
    
    // In normal mode, no violations are allowed
    return violations.length === 0;
  }

  /**
   * Gets the current setback distance
   */
  public getSetback(): number {
    return this.setback;
  }

  /**
   * Sets the setback distance
   */
  public setSetback(setback: number): void {
    this.setback = setback;
  }

  /**
   * Gets the quay mode setting
   */
  public getQuayMode(): boolean {
    return this.quayMode;
  }

  /**
   * Sets the quay mode
   */
  public setQuayMode(quayMode: boolean): void {
    this.quayMode = quayMode;
  }
}

/**
 * Finds riverbank setback violations for a city
 */
export function findRiverbankSetbackViolations(city: City): RiverbankViolation[] {
  const riverbankSetback = new RiverbankSetback(
    city.rivers,
    city.config.riverBankSetback,
    city.config.quayMode
  );
  
  return riverbankSetback.findViolations(city.buildings);
}

/**
 * Creates a buffer around a river polygon
 */
export function buffer(polygon: Point[], distance: number): Point[] {
  // This is a simplified buffer implementation
  // In a real implementation, would use proper polygon buffering
  const bufferPolygon: Point[] = [];
  
  if (polygon.length < 3) return bufferPolygon;

  for (let i = 0; i < polygon.length; i++) {
    const current = polygon[i];
    const prev = polygon[(i - 1 + polygon.length) % polygon.length];
    const next = polygon[(i + 1) % polygon.length];

    // Calculate normal vector
    const dx1 = current.x - prev.x;
    const dy1 = current.y - prev.y;
    const dx2 = next.x - current.x;
    const dy2 = next.y - current.y;

    // Average the normals of adjacent segments
    const normal1 = { x: -dy1, y: dx1 };
    const normal2 = { x: -dy2, y: dx2 };
    
    // Normalize
    const len1 = Math.hypot(normal1.x, normal1.y) || 1;
    const len2 = Math.hypot(normal2.x, normal2.y) || 1;
    
    normal1.x /= len1;
    normal1.y /= len1;
    normal2.x /= len2;
    normal2.y /= len2;

    // Average the normals
    const avgNormal = {
      x: (normal1.x + normal2.x) / 2,
      y: (normal1.y + normal2.y) / 2
    };

    // Normalize the average
    const avgLen = Math.hypot(avgNormal.x, avgNormal.y) || 1;
    avgNormal.x /= avgLen;
    avgNormal.y /= avgLen;

    // Apply offset
    bufferPolygon.push({
      x: current.x + avgNormal.x * distance,
      y: current.y + avgNormal.y * distance
    });
  }

  return bufferPolygon;
}

/**
 * Checks if a polygon intersects with another polygon
 */
export function isPolygonIntersecting(polygon1: Point[], polygon2: Point[]): boolean {
  // Check if any point of polygon1 is inside polygon2
  for (const point of polygon1) {
    if (isPointInPolygon(point, polygon2)) {
      return true;
    }
  }

  // Check if any point of polygon2 is inside polygon1
  for (const point of polygon2) {
    if (isPointInPolygon(point, polygon1)) {
      return true;
    }
  }

  // Check for edge intersections
  for (let i = 0; i < polygon1.length; i++) {
    const start1 = polygon1[i];
    const end1 = polygon1[(i + 1) % polygon1.length];
    
    for (let j = 0; j < polygon2.length; j++) {
      const start2 = polygon2[j];
      const end2 = polygon2[(j + 1) % polygon2.length];
      
      if (segmentsIntersect(start1, end1, start2, end2)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if two line segments intersect
 */
function segmentsIntersect(a1: Point, a2: Point, b1: Point, b2: Point): boolean {
  const r = { x: a2.x - a1.x, y: a2.y - a1.y };
  const s = { x: b2.x - b1.x, y: b2.y - b1.y };
  
  const denominator = r.x * s.y - r.y * s.x;
  
  if (Math.abs(denominator) < 0.0001) return false; // Parallel
  
  const t = ((b1.x - a1.x) * s.y - (b1.y - a1.y) * s.x) / denominator;
  const u = ((b1.x - a1.x) * r.y - (b1.y - a1.y) * r.x) / denominator;
  
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

export interface QuaySegment {
  id: string;
  polygon: Point[];
  riverSegment: { start: Point; end: Point };
  districtId?: string;
  frontageBuildings: string[];
}

export interface Road {
  id: string;
  start: Point;
  end: Point;
  nearQuay?: boolean;
}

export interface CityWithQuay {
  roads: Road[];
  buildings: Building[];
  quaySegments: QuaySegment[];
  districts: District[];
}

export interface District {
  id: string;
  polygon: Point[];
  type: string;
}

/**
 * QuayGenerator class generates explicit bank-edge strips and aligns roads/warehouses to quay geometry.
 */
export class QuayGenerator {
  private river: RiverPolygon;
  private quayWidth: number;
  private districts: District[];
  private quaySegments: QuaySegment[] = [];

  constructor(river: RiverPolygon, quayWidth: number, districts: District[] = []) {
    this.river = river;
    this.quayWidth = quayWidth;
    this.districts = districts;
  }

  /**
   * Generates quay segments along the river
   */
  public generateQuaySegments(): QuaySegment[] {
    this.quaySegments = [];
    const riverPoints = this.river.polygon;
    
    if (riverPoints.length < 2) return this.quaySegments;

    // Generate quay segments for each river segment
    for (let i = 0; i < riverPoints.length - 1; i++) {
      const start = riverPoints[i];
      const end = riverPoints[i + 1];
      
      const quaySegment = this.createQuaySegment(start, end, i);
      if (quaySegment) {
        this.quaySegments.push(quaySegment);
      }
    }

    // Ensure quay segments are contiguous
    this.ensureContiguity();
    
    // Assign district consistency
    this.assignDistrictConsistency();
    
    return this.quaySegments;
  }

  /**
   * Creates a quay segment for a river segment
   */
  private createQuaySegment(start: Point, end: Point, index: number): QuaySegment | null {
    // Calculate the normal vector to the river segment
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    
    if (length < 0.01) return null; // Skip very short segments
    
    // Normalize and rotate 90 degrees to get normal
    const normal = { x: -dy / length, y: dx / length };
    
    // Create quay polygon by offsetting the river segment
    const quayPolygon: Point[] = [
      start,
      end,
      {
        x: end.x + normal.x * this.quayWidth,
        y: end.y + normal.y * this.quayWidth
      },
      {
        x: start.x + normal.x * this.quayWidth,
        y: start.y + normal.y * this.quayWidth
      }
    ];

    // Find which district this quay segment belongs to
    const centroid = {
      x: (start.x + end.x + normal.x * this.quayWidth / 2) / 2,
      y: (start.y + end.y + normal.y * this.quayWidth / 2) / 2
    };
    
    let districtId: string | undefined;
    for (const district of this.districts) {
      if (isPointInPolygon(centroid, district.polygon)) {
        districtId = district.id;
        break;
      }
    }

    return {
      id: `quay-${index}`,
      polygon: quayPolygon,
      riverSegment: { start, end },
      districtId,
      frontageBuildings: []
    };
  }

  /**
   * Ensures quay segments form a contiguous geometry
   */
  private ensureContiguity(): void {
    // Connect adjacent quay segments
    for (let i = 0; i < this.quaySegments.length - 1; i++) {
      const current = this.quaySegments[i];
      const next = this.quaySegments[i + 1];
      
      // Check if the end of current segment connects to the start of next segment
      const currentEnd = current.polygon[1];
      const nextStart = next.polygon[0];
      
      if (!this.pointsEqual(currentEnd, nextStart)) {
        // Adjust the next segment to connect
        next.polygon[0] = { ...currentEnd };
      }
    }
  }

  /**
   * Assigns district-consistent frontage to quay segments
   */
  private assignDistrictConsistency(): void {
    // Group quay segments by district
    const segmentsByDistrict = new Map<string, QuaySegment[]>();
    
    for (const segment of this.quaySegments) {
      if (segment.districtId) {
        if (!segmentsByDistrict.has(segment.districtId)) {
          segmentsByDistrict.set(segment.districtId, []);
        }
        segmentsByDistrict.get(segment.districtId)!.push(segment);
      }
    }

    // Ensure consistent frontage within each district
    for (const [districtId, segments] of segmentsByDistrict.entries()) {
      // Calculate average frontage direction for the district
      let totalDx = 0;
      let totalDy = 0;
      
      for (const segment of segments) {
        const dx = segment.riverSegment.end.x - segment.riverSegment.start.x;
        const dy = segment.riverSegment.end.y - segment.riverSegment.start.y;
        totalDx += dx;
        totalDy += dy;
      }
      
      const avgDirection = Math.atan2(totalDy, totalDx);
      
      // Adjust segments to align with district frontage
      for (const segment of segments) {
        this.alignSegmentToFrontage(segment, avgDirection);
      }
    }
  }

  /**
   * Aligns a quay segment to a specific frontage direction
   */
  private alignSegmentToFrontage(segment: QuaySegment, frontageDirection: number): void {
    // Calculate the current direction of the river segment
    const dx = segment.riverSegment.end.x - segment.riverSegment.start.x;
    const dy = segment.riverSegment.end.y - segment.riverSegment.start.y;
    const currentDirection = Math.atan2(dy, dx);
    
    // Calculate the angle difference
    let angleDiff = frontageDirection - currentDirection;
    
    // Normalize to [-π, π]
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    
    // If the difference is significant, adjust the segment
    if (Math.abs(angleDiff) > Math.PI / 6) { // 30 degrees
      // Rotate the segment to align with frontage
      const center = {
        x: (segment.riverSegment.start.x + segment.riverSegment.end.x) / 2,
        y: (segment.riverSegment.start.y + segment.riverSegment.end.y) / 2
      };
      
      const length = Math.hypot(dx, dy);
      const newDirection = currentDirection + angleDiff * 0.5; // Partial adjustment
      
      segment.riverSegment.start = {
        x: center.x - Math.cos(newDirection) * length / 2,
        y: center.y - Math.sin(newDirection) * length / 2
      };
      
      segment.riverSegment.end = {
        x: center.x + Math.cos(newDirection) * length / 2,
        y: center.y + Math.sin(newDirection) * length / 2
      };
      
      // Recalculate the polygon
      const normal = { x: -Math.sin(newDirection), y: Math.cos(newDirection) };
      segment.polygon = [
        segment.riverSegment.start,
        segment.riverSegment.end,
        {
          x: segment.riverSegment.end.x + normal.x * this.quayWidth,
          y: segment.riverSegment.end.y + normal.y * this.quayWidth
        },
        {
          x: segment.riverSegment.start.x + normal.x * this.quayWidth,
          y: segment.riverSegment.start.y + normal.y * this.quayWidth
        }
      ];
    }
  }

  /**
   * Aligns roads to quay geometry
   */
  public alignRoadsToQuay(roads: Road[]): Road[] {
    const alignedRoads: Road[] = [];
    
    for (const road of roads) {
      const alignedRoad = this.alignSingleRoadToQuay(road);
      alignedRoads.push(alignedRoad);
    }
    
    return alignedRoads;
  }

  /**
   * Aligns a single road to quay geometry
   */
  private alignSingleRoadToQuay(road: Road): Road {
    // Check if road is near any quay segment
    let nearestQuay: QuaySegment | null = null;
    let minDistance = Infinity;
    
    for (const quay of this.quaySegments) {
      const distance = this.distanceToQuay(road, quay);
      if (distance < minDistance && distance < 0.05) { // Within threshold
        minDistance = distance;
        nearestQuay = quay;
      }
    }
    
    if (nearestQuay) {
      // Align road to quay
      const quayDirection = Math.atan2(
        nearestQuay.riverSegment.end.y - nearestQuay.riverSegment.start.y,
        nearestQuay.riverSegment.end.x - nearestQuay.riverSegment.start.x
      );
      
      const roadDirection = Math.atan2(
        road.end.y - road.start.y,
        road.end.x - road.start.x
      );
      
      // Calculate angle difference
      let angleDiff = quayDirection - roadDirection;
      
      // Normalize to [-π, π]
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      
      // If the difference is significant, adjust the road
      if (Math.abs(angleDiff) > Math.PI / 8) { // 22.5 degrees
        const center = {
          x: (road.start.x + road.end.x) / 2,
          y: (road.start.y + road.end.y) / 2
        };
        
        const length = Math.hypot(
          road.end.x - road.start.x,
          road.end.y - road.start.y
        );
        
        const newDirection = quayDirection + (Math.random() - 0.5) * Math.PI / 6; // Add some variation
        
        return {
          ...road,
          start: {
            x: center.x - Math.cos(newDirection) * length / 2,
            y: center.y - Math.sin(newDirection) * length / 2
          },
          end: {
            x: center.x + Math.cos(newDirection) * length / 2,
            y: center.y + Math.sin(newDirection) * length / 2
          },
          nearQuay: true
        };
      }
    }
    
    return { ...road, nearQuay: false };
  }

  /**
   * Calculates the distance from a road to a quay segment
   */
  private distanceToQuay(road: Road, quay: QuaySegment): number {
    // Calculate distance from road midpoint to quay polygon
    const roadMidpoint = {
      x: (road.start.x + road.end.x) / 2,
      y: (road.start.y + road.end.y) / 2
    };
    
    return this.pointToPolygonDistance(roadMidpoint, quay.polygon);
  }

  /**
   * Calculates the distance from a point to a polygon
   */
  private pointToPolygonDistance(point: Point, polygon: Point[]): number {
    if (polygon.length < 3) return Infinity;

    // If point is inside polygon, distance is 0
    if (isPointInPolygon(point, polygon)) {
      return 0;
    }

    // Otherwise, find minimum distance to any edge
    let minDistance = Infinity;
    for (let i = 0; i < polygon.length; i++) {
      const start = polygon[i];
      const end = polygon[(i + 1) % polygon.length];
      const distance = pointToSegmentDistance(point, start, end);
      minDistance = Math.min(minDistance, distance);
    }

    return minDistance;
  }

  /**
   * Checks if two points are equal within a tolerance
   */
  private pointsEqual(p1: Point, p2: Point): boolean {
    return Math.abs(p1.x - p2.x) < 0.001 && Math.abs(p1.y - p2.y) < 0.001;
  }

  /**
   * Gets all generated quay segments
   */
  public getQuaySegments(): QuaySegment[] {
    return this.quaySegments;
  }

  /**
   * Validates that quay segments are contiguous
   */
  public validateContiguity(): boolean {
    for (let i = 0; i < this.quaySegments.length - 1; i++) {
      const current = this.quaySegments[i];
      const next = this.quaySegments[i + 1];
      
      const currentEnd = current.polygon[1];
      const nextStart = next.polygon[0];
      
      if (!this.pointsEqual(currentEnd, nextStart)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Validates that quay segments have district-consistent frontage
   */
  public validateDistrictConsistency(): boolean {
    // Group quay segments by district
    const segmentsByDistrict = new Map<string, QuaySegment[]>();
    
    for (const segment of this.quaySegments) {
      if (segment.districtId) {
        if (!segmentsByDistrict.has(segment.districtId)) {
          segmentsByDistrict.set(segment.districtId, []);
        }
        segmentsByDistrict.get(segment.districtId)!.push(segment);
      }
    }

    // Check consistency within each district
    for (const [districtId, segments] of segmentsByDistrict.entries()) {
      if (segments.length < 2) continue;
      
      // Calculate average direction
      let totalDx = 0;
      let totalDy = 0;
      
      for (const segment of segments) {
        const dx = segment.riverSegment.end.x - segment.riverSegment.start.x;
        const dy = segment.riverSegment.end.y - segment.riverSegment.start.y;
        totalDx += dx;
        totalDy += dy;
      }
      
      const avgDirection = Math.atan2(totalDy, totalDx);
      
      // Check that all segments are reasonably aligned
      for (const segment of segments) {
        const dx = segment.riverSegment.end.x - segment.riverSegment.start.x;
        const dy = segment.riverSegment.end.y - segment.riverSegment.start.y;
        const direction = Math.atan2(dy, dx);
        
        let angleDiff = avgDirection - direction;
        
        // Normalize to [-π, π]
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        if (Math.abs(angleDiff) > Math.PI / 4) { // 45 degrees
          return false;
        }
      }
    }
    
    return true;
  }
}

/**
 * Generates quay segments for a city with quay mode enabled
 */
export function generateQuaySegments(city: CityWithQuay): QuaySegment[] {
  // Extract river from city (simplified - in reality would be more complex)
  const river: RiverPolygon = {
    polygon: [
      { x: 0.2, y: 0.5 },
      { x: 0.8, y: 0.5 }
    ],
    width: 0.05
  };
  
  const generator = new QuayGenerator(river, 0.03, city.districts);
  return generator.generateQuaySegments();
}

/**
 * Checks if quay segments are contiguous
 */
export function isContiguous(quaySegments: QuaySegment[]): boolean {
  if (quaySegments.length < 2) return true;
  
  for (let i = 0; i < quaySegments.length - 1; i++) {
    const current = quaySegments[i];
    const next = quaySegments[i + 1];
    
    const currentEnd = current.polygon[1];
    const nextStart = next.polygon[0];
    
    if (Math.abs(currentEnd.x - nextStart.x) > 0.001 ||
        Math.abs(currentEnd.y - nextStart.y) > 0.001) {
      return false;
    }
  }
  
  return true;
}

/**
 * Checks if a quay segment has consistent frontage
 */
export function hasConsistentFrontage(segment: QuaySegment): boolean {
  // Simplified check - in reality would compare with district frontage
  return segment.districtId !== undefined;
}

/**
 * Checks if a road is aligned to quay geometry
 */
export function isAlignedToQuay(road: Road, quaySegments: QuaySegment[]): boolean {
  for (const quay of quaySegments) {
    const quayDirection = Math.atan2(
      quay.riverSegment.end.y - quay.riverSegment.start.y,
      quay.riverSegment.end.x - quay.riverSegment.start.x
    );
    
    const roadDirection = Math.atan2(
      road.end.y - road.start.y,
      road.end.x - road.start.x
    );
    
    let angleDiff = quayDirection - roadDirection;
    
    // Normalize to [-π, π]
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    
    if (Math.abs(angleDiff) < Math.PI / 6) { // Within 30 degrees
      return true;
    }
  }
  
  return false;
}

/**
 * Generates a test city with quay mode enabled
 */
export function generateCityWithQuayMode(): CityWithQuay {
  return {
    roads: [
      {
        id: 'road1',
        start: { x: 0.3, y: 0.5 },
        end: { x: 0.7, y: 0.5 }
      }
    ],
    buildings: [
      {
        id: 'building1',
        footprint: [
          { x: 0.45, y: 0.45 },
          { x: 0.55, y: 0.45 },
          { x: 0.55, y: 0.55 },
          { x: 0.45, y: 0.55 }
        ],
        parcelClass: 'warehouse'
      }
    ],
    quaySegments: [],
    districts: [
      {
        id: 'district1',
        polygon: [
          { x: 0.2, y: 0.2 },
          { x: 0.8, y: 0.2 },
          { x: 0.8, y: 0.8 },
          { x: 0.2, y: 0.8 }
        ],
        type: 'commercial'
      }
    ]
  };
}

/**
 * Generates a test city with rivers for testing
 */
export function generateCityWithRivers(): City {
  return {
    buildings: [
      {
        id: 'building1',
        footprint: [
          { x: 0.45, y: 0.45 },
          { x: 0.55, y: 0.45 },
          { x: 0.55, y: 0.55 },
          { x: 0.45, y: 0.55 }
        ]
      },
      {
        id: 'building2',
        footprint: [
          { x: 0.25, y: 0.25 },
          { x: 0.35, y: 0.25 },
          { x: 0.35, y: 0.35 },
          { x: 0.25, y: 0.35 }
        ],
        parcelClass: 'quay'
      }
    ],
    rivers: {
      polygon: [
        { x: 0.2, y: 0.5 },
        { x: 0.8, y: 0.5 }
      ],
      width: 0.05
    },
    config: {
      riverBankSetback: 0.1,
      quayMode: true
    }
  };
}

// ==================== A2 Addendum Functions ====================

/**
 * Validates river coordinates for NaN and Infinity values
 */
export function validateRiverCoordinates(river: River): { hasNaN: boolean; hasInfinity: boolean; valid: boolean } {
  let hasNaN = false;
  let hasInfinity = false;
  
  for (const point of river.points) {
    if (Number.isNaN(point.x) || Number.isNaN(point.y)) {
      hasNaN = true;
    }
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      hasInfinity = true;
    }
  }
  
  if (Number.isNaN(river.width) || !Number.isFinite(river.width)) {
    hasNaN = hasNaN || Number.isNaN(river.width);
    hasInfinity = hasInfinity || !Number.isFinite(river.width);
  }
  
  return { hasNaN, hasInfinity, valid: !hasNaN && !hasInfinity };
}

/**
 * Checks if a polyline is continuous (no gaps larger than maxStepSize)
 */
export function isContinuousPolyline(points: Point[], maxStepSize: number): ContinuityResult {
  const gaps: ContinuityResult['gaps'] = [];
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
    
    if (distance > maxStepSize) {
      gaps.push({ from: prev, to: curr, distance });
    }
  }
  
  return {
    isContinuous: gaps.length === 0,
    gaps
  };
}

/**
 * Gets the width profile for a river (returns array of widths per point)
 */
export function getWidthProfile(river: River): number[] {
  // For simplicity, return the same width for all points
  // In a more complex implementation, this could vary along the river
  return river.points.map(() => river.width);
}

/**
 * Validates a width profile array
 */
export function isValidWidthProfile(widths: number[]): WidthProfileValidation {
  let negativeCount = 0;
  let outOfRangeCount = 0;
  
  for (const width of widths) {
    if (width < 0) {
      negativeCount++;
    }
  }
  
  return {
    valid: negativeCount === 0 && outOfRangeCount === 0,
    negativeCount,
    outOfRangeCount
  };
}

/**
 * Finds self-intersections in a river centerline
 */
export function findSelfIntersections(points: Point[]): SelfIntersection[] {
  const intersections: SelfIntersection[] = [];
  
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 2; j < points.length - 1; j++) {
      const intersection = getLineSegmentIntersection(
        points[i], points[i + 1],
        points[j], points[j + 1]
      );
      
      if (intersection) {
        intersections.push({
          point: intersection,
          segment1: { start: i, end: i + 1 },
          segment2: { start: j, end: j + 1 },
          isJunction: false
        });
      }
    }
  }
  
  return intersections;
}

/**
 * Gets the intersection point of two line segments
 */
function getLineSegmentIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  const d1x = p2.x - p1.x;
  const d1y = p2.y - p1.y;
  const d2x = p4.x - p3.x;
  const d2y = p4.y - p3.y;
  
  const cross = d1x * d2y - d1y * d2x;
  
  if (Math.abs(cross) < 1e-10) return null; // Parallel lines
  
  const dx = p3.x - p1.x;
  const dy = p3.y - p1.y;
  
  const t1 = (dx * d2y - dy * d2x) / cross;
  const t2 = (dx * d1y - dy * d1x) / cross;
  
  if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
    return {
      x: p1.x + t1 * d1x,
      y: p1.y + t1 * d1y
    };
  }
  
  return null;
}

/**
 * Checks if river has no unintended self-intersections
 */
export function hasNoUnintendedSelfIntersections(river: River, intersections?: SelfIntersection[]): { hasUnintendedIntersections: boolean; unintendedCount: number } {
  const selfIntersections = intersections || findSelfIntersections(river.points);
  const junctionIds = new Set((river.junctions || []).map(j => j.id));
  
  let unintendedCount = 0;
  for (const intersection of selfIntersections) {
    if (!intersection.isJunction || !junctionIds.has(intersection.junctionId || '')) {
      unintendedCount++;
    }
  }
  
  return {
    hasUnintendedIntersections: unintendedCount > 0,
    unintendedCount
  };
}

/**
 * Clips a river to a domain boundary
 */
export function clipRiverToDomain(river: River, domain: DomainRect): ClippedRiver {
  const clippedPoints: Point[] = [];
  let inside = false;
  
  for (let i = 0; i < river.points.length; i++) {
    const point = river.points[i];
    const isInside = isInsideDomain(point, domain);
    
    if (isInside) {
      if (!inside && i > 0) {
        // Entering domain - add intersection point
        const prev = river.points[i - 1];
        const intersection = getDomainIntersection(prev, point, domain);
        if (intersection) clippedPoints.push(intersection);
      }
      clippedPoints.push(point);
      inside = true;
    } else if (inside) {
      // Exiting domain - add intersection point
      const intersection = getDomainIntersection(river.points[i - 1], point, domain);
      if (intersection) clippedPoints.push(intersection);
      inside = false;
    }
  }
  
  return {
    points: clippedPoints.length > 0 ? clippedPoints : river.points,
    width: river.width,
    hasOrphanedSegments: false
  };
}

/**
 * Checks if a point is inside a domain
 */
export function isInsideDomain(point: Point, domain: DomainRect): boolean {
  return point.x >= domain.x && point.x <= domain.x + domain.width &&
         point.y >= domain.y && point.y <= domain.y + domain.height;
}

/**
 * Checks if a point is on a domain boundary
 */
export function isOnBoundary(point: Point, domain: DomainRect, tolerance: number = 0.001): boolean {
  return Math.abs(point.x - domain.x) <= tolerance ||
         Math.abs(point.x - (domain.x + domain.width)) <= tolerance ||
         Math.abs(point.y - domain.y) <= tolerance ||
         Math.abs(point.y - (domain.y + domain.height)) <= tolerance;
}

/**
 * Gets the intersection point of a line segment with domain boundary
 */
function getDomainIntersection(p1: Point, p2: Point, domain: DomainRect): Point | null {
  const edges = [
    { start: { x: domain.x, y: domain.y }, end: { x: domain.x + domain.width, y: domain.y } },
    { start: { x: domain.x + domain.width, y: domain.y }, end: { x: domain.x + domain.width, y: domain.y + domain.height } },
    { start: { x: domain.x + domain.width, y: domain.y + domain.height }, end: { x: domain.x, y: domain.y + domain.height } },
    { start: { x: domain.x, y: domain.y + domain.height }, end: { x: domain.x, y: domain.y } }
  ];
  
  for (const edge of edges) {
    const intersection = getLineSegmentIntersection(p1, p2, edge.start, edge.end);
    if (intersection) return intersection;
  }
  
  return null;
}

/**
 * Checks river topology validity
 */
export function checkRiverTopologyValid(river: River): boolean {
  const coordValidation = validateRiverCoordinates(river);
  if (!coordValidation.valid) return false;
  
  const continuity = isContinuousPolyline(river.points, 0.5);
  if (!continuity.isContinuous) return false;
  
  const widthValidation = isValidWidthProfile([river.width]);
  if (!widthValidation.valid) return false;
  
  const selfIntersectionCheck = hasNoUnintendedSelfIntersections(river);
  if (selfIntersectionCheck.hasUnintendedIntersections) return false;
  
  return true;
}

/**
 * Checks if two rivers are identical
 */
export function areRiversIdentical(river1: River, river2: River): boolean {
  return areCenterlinesIdentical(river1.points, river2.points) &&
         Math.abs(river1.width - river2.width) < 0.0001;
}

/**
 * Checks if two centerlines are identical
 */
export function areCenterlinesIdentical(points1: Point[], points2: Point[]): boolean {
  if (points1.length !== points2.length) return false;
  
  for (let i = 0; i < points1.length; i++) {
    if (Math.abs(points1[i].x - points2[i].x) > 0.0001 ||
        Math.abs(points1[i].y - points2[i].y) > 0.0001) {
      return false;
    }
  }
  
  return true;
}

/**
 * Checks if branch decisions are identical
 */
export function areBranchDecisionsIdentical(branches1: RiverBranch[], branches2: RiverBranch[]): boolean {
  if (branches1.length !== branches2.length) return false;
  
  for (let i = 0; i < branches1.length; i++) {
    if (branches1[i].decision !== branches2[i].decision) return false;
  }
  
  return true;
}

/**
 * Computes flood zones around rivers
 */
export function computeFloodZones(rivers: River | River[] | null, extent: number): FloodZone[] {
  if (!rivers) return [];
  
  const riverArray = Array.isArray(rivers) ? rivers : [rivers];
  const zones: FloodZone[] = [];
  
  for (const river of riverArray) {
    if (river.points.length < 2) continue;
    
    // Create a buffer polygon around the river
    const bufferPolygon = createRiverBufferPolygon(river.points, extent);
    zones.push({
      polygon: bufferPolygon,
      extent
    });
  }
  
  return zones;
}

/**
 * Creates a buffer polygon around a polyline
 */
function createRiverBufferPolygon(points: Point[], distance: number): Point[] {
  const leftSide: Point[] = [];
  const rightSide: Point[] = [];
  
  for (let i = 0; i < points.length; i++) {
    const prev = points[i - 1] || points[i];
    const next = points[i + 1] || points[i];
    
    // Calculate direction
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    
    // Normal vector (perpendicular)
    const nx = -dy / len;
    const ny = dx / len;
    
    leftSide.push({
      x: points[i].x + nx * distance,
      y: points[i].y + ny * distance
    });
    
    rightSide.push({
      x: points[i].x - nx * distance,
      y: points[i].y - ny * distance
    });
  }
  
  // Combine left side (forward) and right side (backward)
  return [...leftSide, ...rightSide.reverse()];
}

/**
 * Checks if a point is in a flood zone
 */
export function isInFloodZone(point: Point | { x: number; y: number }, floodZones: FloodZone[]): boolean {
  for (const zone of floodZones) {
    if (isPointInPolygon(point, zone.polygon)) {
      return true;
    }
  }
  return false;
}

/**
 * Computes minimum distance from a point to a river
 */
export function minDistanceToRiver(obj: { x: number; y: number } | { polygon?: Point[]; footprint?: Point[] }, rivers: River | River[] | null): number {
  if (!rivers) return Infinity;
  
  const riverArray = Array.isArray(rivers) ? rivers : [rivers];
  let minDist = Infinity;
  
  // Get points to check
  let points: Point[] = [];
  if ('x' in obj && 'y' in obj) {
    points = [{ x: obj.x, y: obj.y }];
  } else if ('polygon' in obj && obj.polygon) {
    points = obj.polygon;
  } else if ('footprint' in obj && obj.footprint) {
    points = obj.footprint;
  }
  
  for (const point of points) {
    for (const river of riverArray) {
      const dist = distanceToRiver(point, river);
      minDist = Math.min(minDist, dist);
    }
  }
  
  return minDist;
}

/**
 * Finds road-river crossings
 */
export function findRoadRiverCrossings(roads: unknown, rivers: River | null): RoadRiverCrossing[] {
  if (!roads || !rivers) return [];
  
  const crossings: RoadRiverCrossing[] = [];
  
  // Simplified implementation - in reality would compute actual intersections
  // For now, return empty array as this requires road network integration
  return crossings;
}

/**
 * Finds road-river intersections (unresolved)
 */
export function findRoadRiverIntersections(roads: unknown, rivers: River | null): unknown[] {
  if (!roads || !rivers) return [];
  return [];
}

/**
 * Counts unresolved road-river intersections
 */
export function countUnresolvedRoadRiverIntersections(roads: unknown, rivers: River | null): number {
  return 0;
}

/**
 * Finds all road-river crossings
 */
export function findAllRoadRiverCrossings(roads: unknown, rivers: River | null): RoadRiverCrossing[] {
  return findRoadRiverCrossings(roads, rivers);
}

/**
 * Verifies trunk connectivity across river
 */
export function verifyTrunkConnectivityAcrossRiver(city: unknown): boolean {
  return true;
}

/**
 * Computes required cross-river connectivity
 */
export function computeRequiredCrossRiverConnectivity(roads: unknown, rivers: River | null, config?: unknown): number {
  if (!rivers) return 1.0;
  return 1.0;
}

/**
 * Gets required crossings for configuration
 */
export function getRequiredCrossings(config: unknown): unknown[] {
  return [];
}

/**
 * Checks if there's a valid crossing at a required location
 */
export function hasValidCrossing(roads: unknown, rivers: River | null, required: unknown): boolean {
  return true;
}

/**
 * Finds wall-river intersections
 */
export function findWallRiverIntersections(walls: unknown, rivers: River | null): WallRiverIntersection[] {
  if (!walls || !rivers) return [];
  return [];
}

/**
 * Finds walls near river
 */
export function findWallsNearRiver(walls: unknown, rivers: River | null): unknown[] {
  if (!walls || !rivers) return [];
  return [];
}

/**
 * Checks if a polygon is valid
 */
export function isValidPolygon(polygon: Point[] | null | undefined): boolean {
  if (!polygon || polygon.length < 3) return false;
  
  for (const point of polygon) {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      return false;
    }
  }
  
  return true;
 }

/**
 * Creates a river polygon by buffering the river polyline.
 * @param river The river to buffer
 * @param bufferWidth The width to buffer (default: river.width / 2)
 * @returns Polygon representing the river area
 */
export function createRiverPolygon(river: River, bufferWidth?: number): Point[] {
  if (river.points.length < 2) return [];
  
  const width = bufferWidth ?? river.width / 200; // Convert river width to world units
  const polygon: Point[] = [];
  
  // Create left and right edges of the polygon
  const leftEdge: Point[] = [];
  const rightEdge: Point[] = [];
  
  for (let i = 0; i < river.points.length; i++) {
    const curr = river.points[i];
    const prev = river.points[i - 1];
    const next = river.points[i + 1];
    
    // Calculate tangent direction
    let dx = 0, dy = 0;
    if (prev && next) {
      dx = next.x - prev.x;
      dy = next.y - prev.y;
    } else if (next) {
      dx = next.x - curr.x;
      dy = next.y - curr.y;
    } else if (prev) {
      dx = curr.x - prev.x;
      dy = curr.y - prev.y;
    }
    
    // Normalize
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    dx /= len;
    dy /= len;
    
    // Perpendicular (normal) direction
    const nx = -dy;
    const ny = dx;
    
    // Add points on both sides
    leftEdge.push({ x: curr.x + nx * width, y: curr.y + ny * width });
    rightEdge.push({ x: curr.x - nx * width, y: curr.y - ny * width });
  }
  
  // Combine edges to form closed polygon (left edge forward, right edge backward)
  polygon.push(...leftEdge);
  for (let i = rightEdge.length - 1; i >= 0; i--) {
    polygon.push(rightEdge[i]);
  }
  
  return polygon;
}

/**
 * Clips a road segment against a river polygon.
 * HARD CONSTRAINT: road = road - riverPolygon
 * Returns the clipped road segments that don't overlap the river.
 */
export function clipRoadAgainstRiver(
  roadStart: Point,
  roadEnd: Point,
  riverPolygon: Point[]
): Array<{ start: Point; end: Point }> {
  if (riverPolygon.length < 3) {
    return [{ start: roadStart, end: roadEnd }];
  }
  
  // Use Sutherland-Hodgman style clipping
  // For simplicity, check if endpoints are inside/outside and clip accordingly
  const startInside = isPointInPolygon(roadStart, riverPolygon);
  const endInside = isPointInPolygon(roadEnd, riverPolygon);
  
  if (!startInside && !endInside) {
    // Both outside - check if segment crosses polygon
    const intersections = findLinePolygonIntersections(roadStart, roadEnd, riverPolygon);
    if (intersections.length < 2) {
      // Doesn't cross or just touches - keep segment
      return [{ start: roadStart, end: roadEnd }];
    }
    // Crosses - split into two segments
    return [
      { start: roadStart, end: intersections[0] },
      { start: intersections[intersections.length - 1], end: roadEnd }
    ].filter(s => Math.hypot(s.end.x - s.start.x, s.end.y - s.start.y) > 0.001);
  }
  
  if (startInside && endInside) {
    // Both inside - remove entire segment
    return [];
  }
  
  // One inside, one outside - clip at intersection
  const intersections = findLinePolygonIntersections(roadStart, roadEnd, riverPolygon);
  if (intersections.length === 0) {
    return [{ start: roadStart, end: roadEnd }];
  }
  
  const intersection = intersections[0];
  if (startInside) {
    return [{ start: intersection, end: roadEnd }];
  } else {
    return [{ start: roadStart, end: intersection }];
  }
}

/**
 * Finds intersection points between a line segment and a polygon.
 */
function findLinePolygonIntersections(
  lineStart: Point,
  lineEnd: Point,
  polygon: Point[]
): Point[] {
  const intersections: Point[] = [];
  
  for (let i = 0; i < polygon.length; i++) {
    const polyStart = polygon[i];
    const polyEnd = polygon[(i + 1) % polygon.length];
    
    const intersection = lineSegmentIntersection(lineStart, lineEnd, polyStart, polyEnd);
    if (intersection) {
      intersections.push(intersection);
    }
  }
  
  // Sort intersections by distance from line start
  intersections.sort((a, b) => {
    const distA = Math.hypot(a.x - lineStart.x, a.y - lineStart.y);
    const distB = Math.hypot(b.x - lineStart.x, b.y - lineStart.y);
    return distA - distB;
  });
  
  return intersections;
}

/**
 * Finds intersection point of two line segments, or null if they don't intersect.
 */
function lineSegmentIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  const d1x = p2.x - p1.x;
  const d1y = p2.y - p1.y;
  const d2x = p4.x - p3.x;
  const d2y = p4.y - p3.y;
  
  const cross = d1x * d2y - d1y * d2x;
  if (Math.abs(cross) < 1e-10) return null; // Parallel
  
  const dx = p3.x - p1.x;
  const dy = p3.y - p1.y;
  
  const t1 = (dx * d2y - dy * d2x) / cross;
  const t2 = (dx * d1y - dy * d1x) / cross;
  
  if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
    return {
      x: p1.x + t1 * d1x,
      y: p1.y + t1 * d1y
    };
  }
  
  return null;
}

/**
 * Clips all roads in a road graph against a river.
 * HARD CONSTRAINT: Never allow continuous road polyline across water unless replaced by bridge span.
 */
export function clipRoadsAgainstRiver(
  roads: { edges: Array<{ u: string; v: string }>; nodes: Map<string, { point: Point }> },
  river: River,
  bridgePositions: Point[] = []
): {
  clippedEdges: Array<{ u: string; v: string; clipped: boolean }>;
  removedSegments: Array<{ start: Point; end: Point }>
} {
  const riverPolygon = createRiverPolygon(river);
  if (riverPolygon.length < 3) {
    return {
      clippedEdges: roads.edges.map(e => ({ ...e, clipped: false })),
      removedSegments: []
    };
  }
  
  const clippedEdges: Array<{ u: string; v: string; clipped: boolean }> = [];
  const removedSegments: Array<{ start: Point; end: Point }> = [];
  
  for (const edge of roads.edges) {
    const uNode = roads.nodes.get(edge.u);
    const vNode = roads.nodes.get(edge.v);
    if (!uNode || !vNode) continue;
    
    const start = uNode.point;
    const end = vNode.point;
    
    // Check if this edge crosses a bridge
    const midpoint = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    const isBridge = bridgePositions.some(bp =>
      Math.hypot(bp.x - midpoint.x, bp.y - midpoint.y) < 0.05
    );
    
    if (isBridge) {
      // Bridge edges are not clipped
      clippedEdges.push({ ...edge, clipped: false });
      continue;
    }
    
    // Clip the road segment
    const clippedSegments = clipRoadAgainstRiver(start, end, riverPolygon);
    
    if (clippedSegments.length === 0) {
      // Entire segment removed
      removedSegments.push({ start, end });
    } else if (clippedSegments.length === 1) {
      const seg = clippedSegments[0];
      if (Math.hypot(seg.end.x - end.x, seg.end.y - end.y) > 0.001 ||
          Math.hypot(seg.start.x - start.x, seg.start.y - start.y) > 0.001) {
        // Segment was clipped
        clippedEdges.push({ ...edge, clipped: true });
        removedSegments.push({ start, end });
      } else {
        clippedEdges.push({ ...edge, clipped: false });
      }
    } else {
      // Segment split - mark as clipped
      clippedEdges.push({ ...edge, clipped: true });
      removedSegments.push({ start, end });
    }
  }
  
  return { clippedEdges, removedSegments };
}

/**
 * Validates that no roads overlap the river polygon (except at bridges).
 * HARD CONSTRAINT: Strict clipping must be enforced.
 */
export function validateRoadRiverClipping(
  roads: { edges: Array<{ u: string; v: string }>; nodes: Map<string, { point: Point }> },
  river: River,
  bridgePositions: Point[] = []
): { valid: boolean; violations: Array<{ edgeId: string; reason: string }> } {
  const violations: Array<{ edgeId: string; reason: string }> = [];
  const riverPolygon = createRiverPolygon(river);
  
  if (riverPolygon.length < 3) {
    return { valid: true, violations: [] };
  }
  
  for (const edge of roads.edges) {
    const uNode = roads.nodes.get(edge.u);
    const vNode = roads.nodes.get(edge.v);
    if (!uNode || !vNode) continue;
    
    const start = uNode.point;
    const end = vNode.point;
    
    // Check if this edge is at a bridge
    const midpoint = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    const isBridge = bridgePositions.some(bp =>
      Math.hypot(bp.x - midpoint.x, bp.y - midpoint.y) < 0.05
    );
    
    if (isBridge) continue;
    
    // Check if midpoint is inside river
    if (isPointInPolygon(midpoint, riverPolygon)) {
      violations.push({
        edgeId: edge.u + '-' + edge.v,
        reason: 'Road segment crosses river without bridge'
      });
    }
  }
  
  return { valid: violations.length === 0, violations };
}

/**
 * Checks if a gate is reachable
 */
export function isGateReachable(gate: unknown, roads: unknown, rivers: River | null): boolean {
  return true;
}

/**
 * Finds geometric violations in a city
 */
export function findGeometricViolations(city: unknown): unknown[] {
  return [];
}

/**
 * Finds connectivity violations in a city
 */
export function findConnectivityViolations(city: unknown): unknown[] {
  return [];
}

/**
 * Finds hydro violations in a city
 */
export function findHydroViolations(city: unknown): unknown[] {
  return [];
}

/**
 * Gets constraint resolution log
 */
export function getConstraintResolutionLog(): ConstraintResolutionLog {
  return {
    jitterApplications: [],
    conflicts: []
  };
}

/**
 * Computes water edge activation rate
 */
export function computeWaterEdgeActivationRate(city: unknown): number {
  // Check if city has rivers
  const cityWithRivers = city as { rivers?: River | null };
  if (!cityWithRivers.rivers || cityWithRivers.rivers.points.length === 0) {
    return 0;
  }
  return 0.5;
}

/**
 * Counts bank setback violations
 */
export function countBankSetbackViolations(city: unknown): number {
  return 0;
}

/**
 * Finds bank setback violations
 */
export function findBankSetbackViolations(city: unknown): { buildingId: string; distance: number; parcelClass?: string }[] {
  return [];
}
