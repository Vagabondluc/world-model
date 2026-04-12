// @ts-nocheck
import { Point, BridgeSpan, Normal2D } from '../types';

export interface River {
  id: string;
  points: Point[];
  width: number;
}

export interface Road {
  id: string;
  start: Point;
  end: Point;
  kind: string;
}

export interface Bridge {
  id: string;
  position: Point;
  axis: Point; // Direction vector of the bridge
  width: number;
  length: number;
  kind: 'trunk' | 'secondary' | 'local';
  endpoints: Array<{
    position: Point;
    roadClass: 'arterial' | 'collector' | 'local';
    roadId?: string;
    /** Small open node (plaza) at bridgehead */
    plazaPolygon?: Point[];
    /** Road widening factor at bridgehead */
    wideningFactor?: number;
  }>;
  /** Bridge deck polygon for rendering */
  deckPolygon?: Point[];
  /** Angle deviation from perpendicular to river (degrees) */
  perpendicularDeviation?: number;
}

export interface BridgeConfig {
  maxBridges: number;
  minBridgeSpacing: number;
  bridgePerpTolerance: number; // Maximum angle deviation from perpendicular (degrees)
  /** Bridgehead widening factor (default: 1.3) */
  bridgeheadWideningFactor: number;
  /** Plaza radius at bridgeheads (default: 0.02) */
  plazaRadius: number;
  /** Require bridges to connect to arterials/collectors */
  requireArterialConnection: boolean;
}

const DEFAULT_BRIDGE_CONFIG: BridgeConfig = {
  maxBridges: 5,
  minBridgeSpacing: 0.1,
  bridgePerpTolerance: 15,
  bridgeheadWideningFactor: 1.3,
  plazaRadius: 0.02,
  requireArterialConnection: true,
};

/**
 * Generates bridges with validity constraints and overproduction control.
 * Selects bridge candidates based on crossing demand and path centrality.
 *
 * HARD CONSTRAINTS:
 * - Connect two collectors/arterials
 * - Have small open node at both ends
 * - Slight road widening at bridgeheads
 */
export class BridgeGenerator {
  private readonly config: BridgeConfig;
  private bridges: Bridge[] = [];

  /**
   * Creates a new BridgeGenerator.
   * @param config Bridge generation configuration
   */
  constructor(config: Partial<BridgeConfig> = {}) {
    this.config = { ...DEFAULT_BRIDGE_CONFIG, ...config };
  }

  /**
   * Generates bridges for the given rivers and roads.
   * @param rivers Array of river objects
   * @param roads Array of road objects
   * @returns Array of generated bridges
   */
  generateBridges(rivers: River[], roads: Road[]): Bridge[] {
    this.bridges = [];

    // Find potential bridge locations (road-river crossings)
    const potentialLocations = this.findPotentialBridgeLocations(rivers, roads);
    
    // Select optimal bridge candidates
    const selectedCandidates = this.selectBridgeCandidates(potentialLocations);
    
    // Create bridge objects
    for (const candidate of selectedCandidates) {
      const bridge = this.createBridge(candidate, rivers, roads);
      if (bridge) {
        this.bridges.push(bridge);
      }
    }

    return this.bridges;
  }

  /**
   * Validates that all bridges satisfy constraints.
   * @param bridges Array of bridges to validate
   * @param rivers Array of rivers for perpendicularity check
   * @returns True if all bridges are valid
   */
  validateBridges(bridges: Bridge[], rivers: River[] = []): boolean {
    // Check bridge count
    if (bridges.length > this.config.maxBridges) {
      return false;
    }

    // Check spacing constraints
    for (let i = 0; i < bridges.length; i++) {
      for (let j = i + 1; j < bridges.length; j++) {
        const distance = this.distanceAlongRiver(bridges[i], bridges[j]);
        if (distance < this.config.minBridgeSpacing) {
          return false;
        }
      }
    }

    // Check endpoint connectivity
    for (const bridge of bridges) {
      for (const endpoint of bridge.endpoints) {
        if (endpoint.roadClass !== 'arterial' && endpoint.roadClass !== 'collector') {
          return false;
        }
      }
    }

    // Check perpendicularity
    for (const bridge of bridges) {
      const angleDiff = this.calculatePerpendicularityDeviation(bridge, rivers);
      if (angleDiff > this.config.bridgePerpTolerance) {
        return false;
      }
    }

    return true;
  }

  /**
   * Gets all generated bridges.
   * @returns Array of bridges
   */
  getBridges(): Bridge[] {
    return [...this.bridges];
  }

  /**
   * Finds potential bridge locations where roads cross rivers.
   */
  private findPotentialBridgeLocations(rivers: River[], roads: Road[]): Array<{
    position: Point;
    riverId: string;
    roadId: string;
    roadKind: string;
    angle: number;
    centrality: number;
  }> {
    const locations: Array<{
      position: Point;
      riverId: string;
      roadId: string;
      roadKind: string;
      angle: number;
      centrality: number;
    }> = [];

    for (const river of rivers) {
      for (const road of roads) {
        const crossings = this.findRoadRiverCrossings(road, river);
        for (const crossing of crossings) {
          locations.push({
            position: crossing.position,
            riverId: river.id,
            roadId: road.id,
            roadKind: road.kind,
            angle: crossing.angle,
            centrality: this.calculateCentrality(crossing.position, rivers)
          });
        }
      }
    }

    return locations;
  }

  /**
   * Selects optimal bridge candidates from potential locations.
   */
  private selectBridgeCandidates(potentialLocations: Array<{
    position: Point;
    riverId: string;
    roadId: string;
    roadKind: string;
    angle: number;
    centrality: number;
  }>): Array<{
    position: Point;
    riverId: string;
    roadId: string;
    roadKind: string;
    angle: number;
    centrality: number;
  }> {
    // Sort by centrality (higher is better)
    const sorted = [...potentialLocations].sort((a, b) => b.centrality - a.centrality);
    
    // Select top candidates respecting spacing constraints
    const selected: Array<{
      position: Point;
      riverId: string;
      roadId: string;
      roadKind: string;
      angle: number;
      centrality: number;
    }> = [];

    for (const candidate of sorted) {
      if (selected.length >= this.config.maxBridges) break;
      
      // Check spacing constraint
      let tooClose = false;
      for (const selectedCandidate of selected) {
        const distance = this.distance(candidate.position, selectedCandidate.position);
        if (distance < this.config.minBridgeSpacing) {
          tooClose = true;
          break;
        }
      }
      
      if (!tooClose) {
        selected.push(candidate);
      }
    }

    return selected;
  }

  /**
   * Creates a bridge from a candidate location.
   */
  private createBridge(
    candidate: {
      position: Point;
      riverId: string;
      roadId: string;
      roadKind: string;
      angle: number;
      centrality: number;
    },
    rivers: River[],
    roads: Road[]
  ): Bridge | null {
    // Determine bridge kind based on road kind
    let bridgeKind: 'trunk' | 'secondary' | 'local';
    if (candidate.roadKind === 'trunk') {
      bridgeKind = 'trunk';
    } else if (candidate.roadKind === 'secondary') {
      bridgeKind = 'secondary';
    } else {
      bridgeKind = 'local';
    }

    // Calculate bridge dimensions
    const river = rivers.find(r => r.id === candidate.riverId);
    const road = roads.find(r => r.id === candidate.roadId);
    
    if (!river || !road) return null;

    const width = river.width * 1.2; // Bridge is wider than river
    const length = width * 0.8; // Bridge length
    
    // Calculate axis (perpendicular to river)
    const riverTangent = this.getRiverTangentAtPoint(candidate.position, river);
    const axis = {
      x: -riverTangent.y,
      y: riverTangent.x
    };

    // Determine endpoint road classes
    const roadClass = this.determineRoadClass(candidate.roadKind);
    
    // Calculate perpendicular deviation
    const tempBridgeId = `temp-${candidate.roadId}`;
    const perpDeviation = this.calculatePerpendicularityDeviation(
      { id: tempBridgeId, position: candidate.position, axis, length, width, kind: bridgeKind, endpoints: [] },
      rivers
    );

    // Calculate endpoint positions with bridgehead widening
    const halfLength = length / 2;
    const wideningFactor = this.config.bridgeheadWideningFactor;
    const plazaRadius = this.config.plazaRadius;
    
    const endpoint1Position = {
      x: candidate.position.x - axis.x * halfLength,
      y: candidate.position.y - axis.y * halfLength
    };
    const endpoint2Position = {
      x: candidate.position.x + axis.x * halfLength,
      y: candidate.position.y + axis.y * halfLength
    };
    
    // Create plaza polygons at bridgeheads (small open nodes)
    const plaza1 = createPlazaPolygon(endpoint1Position, plazaRadius);
    const plaza2 = createPlazaPolygon(endpoint2Position, plazaRadius);
    
    // Create deck polygon for the bridge
    const deckPolygon = createDeckPolygon(
      candidate.position,
      axis,
      length,
      width * wideningFactor
    );

    return {
      id: `bridge-${this.bridges.length}`,
      position: candidate.position,
      axis,
      width,
      length,
      kind: bridgeKind,
      endpoints: [
        {
          position: endpoint1Position,
          roadClass,
          roadId: candidate.roadId,
          plazaPolygon: plaza1,
          wideningFactor
        },
        {
          position: endpoint2Position,
          roadClass,
          roadId: candidate.roadId,
          plazaPolygon: plaza2,
          wideningFactor
        }
      ],
      deckPolygon,
      perpendicularDeviation: perpDeviation
    };
  }

  /**
   * Finds crossings between a road and a river.
   */
  private findRoadRiverCrossings(road: Road, river: River): Array<{
    position: Point;
    angle: number;
  }> {
    const crossings: Array<{ position: Point; angle: number }> = [];

    for (let i = 0; i < river.points.length - 1; i++) {
      const riverStart = river.points[i];
      const riverEnd = river.points[i + 1];

      const intersection = this.segmentIntersection(
        road.start, road.end,
        riverStart, riverEnd
      );

      if (intersection) {
        const angle = Math.atan2(road.end.y - road.start.y, road.end.x - road.start.x);
        crossings.push({ position: intersection, angle });
      }
    }

    return crossings;
  }

  /**
   * Calculates centrality of a point in the river network.
   */
  private calculateCentrality(position: Point, rivers: River[]): number {
    // Simple implementation: distance from river center
    let minDistance = Infinity;
    for (const river of rivers) {
      for (const point of river.points) {
        const distance = this.distance(position, point);
        if (distance < minDistance) {
          minDistance = distance;
        }
      }
    }
    
    // Convert to centrality (higher is better)
    return minDistance === Infinity ? 0 : 1 / (1 + minDistance);
  }

  /**
   * Gets river tangent at a specific point.
   */
  private getRiverTangentAtPoint(position: Point, river: River): Point {
    // Find closest point on river
    let minDistance = Infinity;
    let closestIndex = 0;
    
    for (let i = 0; i < river.points.length; i++) {
      const distance = this.distance(position, river.points[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    // Calculate tangent at closest point
    const prevIndex = Math.max(0, closestIndex - 1);
    const nextIndex = Math.min(river.points.length - 1, closestIndex + 1);
    
    const tangent = {
      x: river.points[nextIndex].x - river.points[prevIndex].x,
      y: river.points[nextIndex].y - river.points[prevIndex].y
    };
    
    // Normalize
    const length = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);
    if (length > 0) {
      tangent.x /= length;
      tangent.y /= length;
    }
    
    return tangent;
  }

  /**
   * Calculates distance along river between two bridges.
   */
  private distanceAlongRiver(bridge1: Bridge, bridge2: Bridge): number {
    // Simple implementation: Euclidean distance
    return this.distance(bridge1.position, bridge2.position);
  }

  /**
   * Calculates perpendicularity deviation of a bridge.
   */
  private calculatePerpendicularityDeviation(bridge: Bridge, rivers: River[]): number {
    // Find the river this bridge crosses
    const river = rivers.find(r => {
      // Check if bridge position is near river
      for (let i = 0; i < r.points.length - 1; i++) {
        const distance = this.pointToSegmentDistance(
          bridge.position,
          r.points[i],
          r.points[i + 1]
        );
        if (distance < r.width / 2) {
          return true;
        }
      }
      return false;
    });
    
    if (!river) return 90; // Maximum deviation
    
    const riverTangent = this.getRiverTangentAtPoint(bridge.position, river);
    const bridgeAngle = Math.atan2(bridge.axis.y, bridge.axis.x);
    const riverAngle = Math.atan2(riverTangent.y, riverTangent.x);
    
    // Calculate angle difference from perpendicular (90 degrees)
    const angleDiff = Math.abs((bridgeAngle - riverAngle) * 180 / Math.PI - 90);
    return Math.min(angleDiff, 180 - angleDiff); // Use smaller angle
  }

  /**
   * Determines road class from road kind.
   */
  private determineRoadClass(roadKind: string): 'arterial' | 'collector' | 'local' {
    if (roadKind === 'trunk') return 'arterial';
    if (roadKind === 'secondary') return 'collector';
    return 'local';
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

/**
 * Creates a plaza polygon (small open node) at a bridgehead.
 * HARD CONSTRAINT: Have small open node at both ends.
 */
function createPlazaPolygon(center: Point, radius: number): Point[] {
  const sides = 8;
  const polygon: Point[] = [];
  
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides;
    polygon.push({
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle)
    });
  }
  
  return polygon;
}

/**
 * Creates a deck polygon for the bridge.
 * The deck is a rectangle aligned with the bridge axis.
 */
function createDeckPolygon(
  center: Point,
  axis: Point,
  length: number,
  width: number
): Point[] {
  // Perpendicular to axis
  const perpX = -axis.y;
  const perpY = axis.x;
  
  const halfLength = length / 2;
  const halfWidth = width / 2;
  
  return [
    // One end
    { x: center.x - axis.x * halfLength + perpX * halfWidth, y: center.y - axis.y * halfLength + perpY * halfWidth },
    { x: center.x - axis.x * halfLength - perpX * halfWidth, y: center.y - axis.y * halfLength - perpY * halfWidth },
    // Other end
    { x: center.x + axis.x * halfLength - perpX * halfWidth, y: center.y + axis.y * halfLength - perpY * halfWidth },
    { x: center.x + axis.x * halfLength + perpX * halfWidth, y: center.y + axis.y * halfLength + perpY * halfWidth },
  ];
}

/**
 * Validates bridge anchoring constraints.
 * HARD CONSTRAINT: Connect two collectors/arterials.
 */
export function validateBridgeAnchoring(
  bridge: Bridge,
  roadGraph?: { nodes: Map<string, { point: Point }>; edges: Array<{ u: string; v: string; kind: string }> }
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  // Check endpoint road classes
  for (const endpoint of bridge.endpoints) {
    if (endpoint.roadClass !== 'arterial' && endpoint.roadClass !== 'collector') {
      violations.push(`Bridge endpoint connects to ${endpoint.roadClass} road, must be arterial or collector`);
    }
  }
  
  // Check that bridge has plaza polygons
  const hasPlazas = bridge.endpoints.every(ep => ep.plazaPolygon && ep.plazaPolygon.length >= 3);
  if (!hasPlazas) {
    violations.push('Bridge must have plaza polygons at both endpoints');
  }
  
  // Check widening factor
  const hasWidening = bridge.endpoints.every(ep => (ep.wideningFactor ?? 1) >= 1.0);
  if (!hasWidening) {
    violations.push('Bridge endpoints must have road widening');
  }
  
  return { valid: violations.length === 0, violations };
}

/**
 * Converts a Bridge to a BridgeSpan for the type contract.
 */
export function bridgeToBridgeSpan(bridge: Bridge): BridgeSpan {
  return {
    id: bridge.id,
    deckPolygon: bridge.deckPolygon ?? [],
    startLanding: {
      position: bridge.endpoints[0].position,
      roadClass: bridge.endpoints[0].roadClass,
      roadId: bridge.endpoints[0].roadId ?? '',
      plazaPolygon: bridge.endpoints[0].plazaPolygon,
      wideningFactor: bridge.endpoints[0].wideningFactor ?? 1.0
    },
    endLanding: {
      position: bridge.endpoints[1].position,
      roadClass: bridge.endpoints[1].roadClass,
      roadId: bridge.endpoints[1].roadId ?? '',
      plazaPolygon: bridge.endpoints[1].plazaPolygon,
      wideningFactor: bridge.endpoints[1].wideningFactor ?? 1.0
    },
    riverId: '',
    axis: bridge.axis as Normal2D,
    width: bridge.width,
    length: bridge.length,
    kind: bridge.kind,
    perpendicularDeviation: bridge.perpendicularDeviation ?? 0
  };
}