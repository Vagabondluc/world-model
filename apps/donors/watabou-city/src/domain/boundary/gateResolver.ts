// @ts-nocheck
import { Point } from '../types';

export interface Wall {
  id: string;
  polygon: Point[];
  innerEdge: Point[];
  width: number;
}

export interface Road {
  id: string;
  start: Point;
  end: Point;
  kind: string;
}

export interface Gate {
  id: string;
  position: Point;
  width: number;
  type: 'simple' | 'barbican' | 'river' | 'postern';
  wallId: string;
  roadIds: string[];
  angle: number;
}

export interface RoadWallIntersection {
  id: string;
  position: Point;
  wallId: string;
  roadId: string;
  angle: number;
  resolved: boolean;
  gateId?: string;
}

/**
 * Resolves road-wall intersections through gate placement.
 * Detects intersections, clusters candidate openings, and places gate objects.
 */
export class GateResolver {
  private readonly minGateSpacing: number;
  private readonly maxGateSpacing: number;
  private readonly defaultGateWidth: number;
  private gates: Gate[] = [];
  private intersections: RoadWallIntersection[] = [];

  /**
   * Creates a new GateResolver.
   * @param minGateSpacing Minimum spacing between gates
   * @param maxGateSpacing Maximum spacing between gates
   * @param defaultGateWidth Default width for gates
   */
  constructor(
    minGateSpacing: number = 0.08,
    maxGateSpacing: number = 0.25,
    defaultGateWidth: number = 0.03
  ) {
    this.minGateSpacing = minGateSpacing;
    this.maxGateSpacing = maxGateSpacing;
    this.defaultGateWidth = defaultGateWidth;
  }

  /**
   * Detects road-wall intersections.
   * @param roads Array of road objects
   * @param walls Array of wall objects
   * @returns Array of road-wall intersections
   */
  detectRoadWallIntersections(roads: Road[], walls: Wall[]): RoadWallIntersection[] {
    this.intersections = [];

    for (const road of roads) {
      for (const wall of walls) {
        const roadIntersections = this.findRoadWallIntersections(road, wall);
        this.intersections.push(...roadIntersections);
      }
    }

    return this.intersections;
  }

  /**
   * Resolves all road-wall intersections by placing gates.
   * @param intersections Array of road-wall intersections
   * @param roads Array of road objects
   * @param walls Array of wall objects
   * @returns Array of created gates
   */
  resolveRoadWallIntersections(
    intersections: RoadWallIntersection[],
    roads: Road[],
    walls: Wall[]
  ): Gate[] {
    // Cluster intersections by position and angle
    const clusters = this.clusterIntersections(intersections);
    
    // Place gates at cluster centers
    for (const cluster of clusters) {
      const gate = this.createGateFromCluster(cluster, walls);
      if (gate) {
        this.gates.push(gate);
        
        // Mark all intersections in the cluster as resolved
        for (const intersectionId of cluster.intersectionIds) {
          const intersection = this.intersections.find(i => i.id === intersectionId);
          if (intersection) {
            intersection.resolved = true;
            intersection.gateId = gate.id;
          }
        }
      }
    }

    return this.gates;
  }

  /**
   * Finds road ends at walls that need gates.
   * @param roads Array of road objects
   * @param walls Array of wall objects
   * @returns Array of road ends at walls
   */
  findRoadEndsAtWall(roads: Road[], walls: Wall[]): Array<{position: Point, roadId: string, wallId: string}> {
    const roadEnds: Array<{position: Point, roadId: string, wallId: string}> = [];

    for (const road of roads) {
      // Check if road start is at a wall
      const startAtWall = this.isPointOnWall(road.start, walls);
      if (startAtWall) {
        roadEnds.push({
          position: road.start,
          roadId: road.id,
          wallId: startAtWall
        });
      }

      // Check if road end is at a wall
      const endAtWall = this.isPointOnWall(road.end, walls);
      if (endAtWall) {
        roadEnds.push({
          position: road.end,
          roadId: road.id,
          wallId: endAtWall
        });
      }
    }

    return roadEnds;
  }

  /**
   * Finds a gate near a given position.
   * @param position Position to search from
   * @param maxDistance Maximum distance to search
   * @returns Nearest gate or null if none found
   */
  findNearbyGate(position: Point, maxDistance: number = 0.05): Gate | null {
    let nearestGate: Gate | null = null;
    let nearestDistance = maxDistance;

    for (const gate of this.gates) {
      const distance = this.distance(position, gate.position);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestGate = gate;
      }
    }

    return nearestGate;
  }

  /**
   * Checks if a road is connected through a gate.
   * @param roadEnd Road end position
   * @param gate Gate object
   * @returns True if road is connected through gate
   */
  isRoadConnectedThroughGate(roadEnd: {position: Point, roadId: string}, gate: Gate): boolean {
    // Check if the gate is associated with the road
    return gate.roadIds.includes(roadEnd.roadId);
  }

  /**
   * Gets all created gates.
   * @returns Array of gates
   */
  getGates(): Gate[] {
    return [...this.gates];
  }

  /**
   * Gets all intersections.
   * @returns Array of intersections
   */
  getIntersections(): RoadWallIntersection[] {
    return [...this.intersections];
  }

  /**
   * Finds intersections between a road and a wall.
   */
  private findRoadWallIntersections(road: Road, wall: Wall): RoadWallIntersection[] {
    const intersections: RoadWallIntersection[] = [];

    for (let i = 0; i < wall.polygon.length; i++) {
      const wallStart = wall.polygon[i];
      const wallEnd = wall.polygon[(i + 1) % wall.polygon.length];

      const intersection = this.segmentIntersection(
        road.start, road.end,
        wallStart, wallEnd
      );

      if (intersection) {
        const angle = Math.atan2(road.end.y - road.start.y, road.end.x - road.start.x);
        intersections.push({
          id: `${road.id}-${wall.id}-${i}`,
          position: intersection,
          wallId: wall.id,
          roadId: road.id,
          angle,
          resolved: false
        });
      }
    }

    return intersections;
  }

  /**
   * Clusters intersections by position and angle.
   */
  private clusterIntersections(intersections: RoadWallIntersection[]): Array<{
    center: Point,
    angle: number,
    intersectionIds: string[],
    wallId: string,
    roadIds: string[]
  }> {
    const clusters: Array<{
      center: Point,
      angle: number,
      intersectionIds: string[],
      wallId: string,
      roadIds: string[]
    }> = [];

    const maxClusterDistance = 0.02; // Maximum distance to cluster intersections
    const maxAngleDifference = Math.PI / 6; // 30 degrees

    for (const intersection of intersections) {
      if (intersection.resolved) continue;

      // Try to add to existing cluster
      let addedToCluster = false;
      for (const cluster of clusters) {
        const distance = this.distance(intersection.position, cluster.center);
        const angleDiff = Math.abs(intersection.angle - cluster.angle);
        
        if (distance < maxClusterDistance && angleDiff < maxAngleDifference) {
          // Add to existing cluster
          cluster.intersectionIds.push(intersection.id);
          cluster.roadIds.push(intersection.roadId);
          
          // Update center and angle
          cluster.center = this.averagePoint([...cluster.intersectionIds.map(id =>
            this.intersections.find(i => i.id === id)?.position
          ).filter(p => p !== undefined) as Point[]], intersection.position);
          
          cluster.angle = this.averageAngle([...cluster.intersectionIds.map(id =>
            this.intersections.find(i => i.id === id)?.angle
          ).filter(a => a !== undefined) as number[]], intersection.angle);
          
          addedToCluster = true;
          break;
        }
      }

      // Create new cluster if not added to existing
      if (!addedToCluster) {
        clusters.push({
          center: intersection.position,
          angle: intersection.angle,
          intersectionIds: [intersection.id],
          wallId: intersection.wallId,
          roadIds: [intersection.roadId]
        });
      }
    }

    return clusters;
  }

  /**
   * Creates a gate from an intersection cluster.
   */
  private createGateFromCluster(
    cluster: {
      center: Point,
      angle: number,
      intersectionIds: string[],
      wallId: string,
      roadIds: string[]
    },
    walls: Wall[]
  ): Gate | null {
    // Check if gate is too close to existing gates
    for (const gate of this.gates) {
      if (this.distance(cluster.center, gate.position) < this.minGateSpacing) {
        return null; // Too close to existing gate
      }
    }

    // Determine gate type based on road importance
    const gateType = this.determineGateType(cluster.roadIds);

    return {
      id: `gate-${this.gates.length}`,
      position: cluster.center,
      width: this.defaultGateWidth,
      type: gateType,
      wallId: cluster.wallId,
      roadIds: cluster.roadIds,
      angle: cluster.angle
    };
  }

  /**
   * Determines gate type based on road importance.
   */
  private determineGateType(roadIds: string[]): Gate['type'] {
    // Simple implementation - could be enhanced based on road hierarchy
    if (roadIds.length > 1) return 'barbican';
    return 'simple';
  }

  /**
   * Checks if a point is on any wall.
   */
  private isPointOnWall(point: Point, walls: Wall[]): string | null {
    const tolerance = 0.001; // Tolerance for point-on-wall detection

    for (const wall of walls) {
      for (let i = 0; i < wall.polygon.length; i++) {
        const wallStart = wall.polygon[i];
        const wallEnd = wall.polygon[(i + 1) % wall.polygon.length];

        if (this.pointToSegmentDistance(point, wallStart, wallEnd) < tolerance) {
          return wall.id;
        }
      }
    }

    return null;
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
   * Calculates average of multiple points.
   */
  private averagePoint(points: Point[], newPoint?: Point): Point {
    if (points.length === 0) return newPoint || { x: 0, y: 0 };
    
    let sumX = 0, sumY = 0;
    for (const p of points) {
      sumX += p.x;
      sumY += p.y;
    }
    
    if (newPoint) {
      sumX += newPoint.x;
      sumY += newPoint.y;
      return { x: sumX / (points.length + 1), y: sumY / (points.length + 1) };
    }
    
    return { x: sumX / points.length, y: sumY / points.length };
  }

  /**
   * Calculates average of multiple angles.
   */
  private averageAngle(angles: number[], newAngle?: number): number {
    if (angles.length === 0) return newAngle || 0;
    
    let sumX = 0, sumY = 0;
    for (const angle of angles) {
      sumX += Math.cos(angle);
      sumY += Math.sin(angle);
    }
    
    if (newAngle !== undefined) {
      sumX += Math.cos(newAngle);
      sumY += Math.sin(newAngle);
      return Math.atan2(sumY, sumX);
    }
    
    return Math.atan2(sumY, sumX);
  }
}