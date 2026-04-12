// @ts-nocheck
import { Point, DrainNode, Normal2D } from '../types';
import { River } from '../terrain/river';
import { BridgeStructure } from './features';

export interface HydraulicNode {
  x: number;
  y: number;
  type: 'culvert' | 'watergate';
  openingShape: 'arch' | 'box';
  flowDir: { x: number; y: number };
  gateId?: string;
  /** Wall segment this drain interrupts (for subtractive geometry) */
  wallSegmentId?: string;
  /** Width of the drain opening (proportional to wall thickness) */
  openingWidth?: number;
  /** Apron zone polygon where drain ∩ riverBuffer is allowed */
  apronZone?: Point[];
}

const RIVER_GATE_DISTANCE = 0.028;
const BRIDGE_NEAR_GATE = 0.035;
/** Default wall thickness for calculating drain opening width */
const DEFAULT_WALL_THICKNESS = 0.02;
/** Multiplier for drain opening width relative to wall thickness */
const DRAIN_OPENING_RATIO = 0.6;

/**
 * Classifies hydraulic nodes (drains) at wall-river interfaces.
 * HARD CONSTRAINT: drainOpening ⊂ wallSegment, drainOpening ∩ riverBuffer allowed only in apron zone
 */
export function classifyHydraulicNodes(
  gates: Point[],
  river: River,
  bridges: BridgeStructure[],
  wallThickness: number = DEFAULT_WALL_THICKNESS
): HydraulicNode[] {
  if (gates.length === 0 || river.points.length < 2) return [];
  const nodes: HydraulicNode[] = [];
  
  for (let i = 0; i < gates.length; i++) {
    const gate = gates[i];
    const d = distanceToPolyline(gate, river.points);
    if (d > RIVER_GATE_DISTANCE) continue;
    
    const nearBridge = bridges.some((b) => Math.hypot(b.point.x - gate.x, b.point.y - gate.y) <= BRIDGE_NEAR_GATE);
    const flowDir = directionToNearestSegment(gate, river.points);
    
    // Calculate opening width proportional to wall thickness
    // HARD CONSTRAINT: Opening width proportional to wall thickness
    const openingWidth = wallThickness * DRAIN_OPENING_RATIO;
    
    // Create apron zone polygon (where drain ∩ riverBuffer is allowed)
    const apronZone = createApronZone(gate, flowDir, openingWidth, wallThickness);
    
    nodes.push({
      x: gate.x,
      y: gate.y,
      type: nearBridge ? 'watergate' : 'culvert',
      openingShape: nearBridge ? 'box' : 'arch',
      flowDir,
      gateId: `g-${i}`,
      openingWidth,
      apronZone,
    });
  }
  return nodes;
}

/**
 * Creates a DrainNode with full geometric data for subtractive wall geometry.
 * HARD CONSTRAINT: Drain must be subtractive from wall geometry.
 */
export function createDrainNode(
  id: string,
  position: Point,
  wallSegmentId: string,
  river: River,
  wallThickness: number
): DrainNode | null {
  if (river.points.length < 2) return null;
  
  // Find nearest river point and calculate flow direction
  const flowDir = directionToNearestSegment(position, river.points);
  const riverConnectionPoint = findNearestRiverPoint(position, river.points);
  
  // Calculate opening width proportional to wall thickness
  const openingWidth = wallThickness * DRAIN_OPENING_RATIO;
  
  // Create apron zone
  const apronZone = createApronZone(position, flowDir, openingWidth, wallThickness);
  
  // Determine side (north or south) based on flow direction
  const side = flowDir.y < 0 ? 'north' : 'south';
  
  return {
    id,
    position,
    openingWidth,
    normal: flowDir,
    wallSegmentId,
    riverId: 'main', // Could be extended for multiple rivers
    riverConnectionPoint,
    apronZone,
    side,
  };
}

/**
 * Creates the apron zone polygon where drain ∩ riverBuffer is allowed.
 * The apron zone is a trapezoidal region extending from the wall to the river.
 */
function createApronZone(
  position: Point,
  flowDir: Normal2D,
  openingWidth: number,
  wallThickness: number
): Point[] {
  // Perpendicular to flow direction
  const perpX = -flowDir.y;
  const perpY = flowDir.x;
  
  // Apron extends from wall edge toward river
  const apronLength = wallThickness * 2;
  const wallEdgeWidth = openingWidth;
  const riverEdgeWidth = openingWidth * 1.5; // Wider at river edge
  
  // Four corners of the apron zone
  const halfWallWidth = wallEdgeWidth / 2;
  const halfRiverWidth = riverEdgeWidth / 2;
  
  return [
    // Wall edge (inner)
    { x: position.x + perpX * halfWallWidth, y: position.y + perpY * halfWallWidth },
    { x: position.x - perpX * halfWallWidth, y: position.y - perpY * halfWallWidth },
    // River edge (outer, wider)
    {
      x: position.x - perpX * halfRiverWidth + flowDir.x * apronLength,
      y: position.y - perpY * halfRiverWidth + flowDir.y * apronLength
    },
    {
      x: position.x + perpX * halfRiverWidth + flowDir.x * apronLength,
      y: position.y + perpY * halfRiverWidth + flowDir.y * apronLength
    },
  ];
}

/**
 * Finds the nearest point on the river polyline to a given position.
 */
function findNearestRiverPoint(position: Point, riverPoints: Point[]): Point {
  let bestDist = Infinity;
  let bestPoint: Point = riverPoints[0];
  
  for (let i = 0; i < riverPoints.length - 1; i++) {
    const a = riverPoints[i];
    const b = riverPoints[i + 1];
    const closest = closestPointOnSegment(position, a, b);
    const dist = Math.hypot(position.x - closest.x, position.y - closest.y);
    
    if (dist < bestDist) {
      bestDist = dist;
      bestPoint = closest;
    }
  }
  
  return bestPoint;
}

/**
 * Returns the closest point on a line segment to a given point.
 */
function closestPointOnSegment(p: Point, a: Point, b: Point): Point {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const ab2 = abx * abx + aby * aby || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / ab2));
  return { x: a.x + abx * t, y: a.y + aby * t };
}

/**
 * Computes wall segments with subtracted drain openings.
 * HARD CONSTRAINT: Wall segment should be visibly interrupted at drain locations.
 */
export function subtractDrainsFromWallSegments(
  wallPolygon: Point[],
  drainNodes: DrainNode[],
  wallThickness: number
): Array<{ start: Point; end: Point; hasOpening: boolean; openingIds: string[] }> {
  const segments: Array<{ start: Point; end: Point; hasOpening: boolean; openingIds: string[] }> = [];
  
  for (let i = 0; i < wallPolygon.length; i++) {
    const start = wallPolygon[i];
    const end = wallPolygon[(i + 1) % wallPolygon.length];
    const segmentId = `segment-${i}`;
    
    // Check if any drain is on this segment
    const drainsOnSegment = drainNodes.filter(d => d.wallSegmentId === segmentId);
    
    if (drainsOnSegment.length === 0) {
      // No drain, keep segment intact
      segments.push({ start, end, hasOpening: false, openingIds: [] });
    } else {
      // Drain(s) on segment - create interrupted segments
      // For now, create a gap at each drain location
      let currentStart = start;
      
      for (const drain of drainsOnSegment) {
        // Calculate drain position along segment (0-1)
        const segLen = Math.hypot(end.x - start.x, end.y - start.y);
        const drainT = ((drain.position.x - start.x) * (end.x - start.x) +
                       (drain.position.y - start.y) * (end.y - start.y)) / (segLen * segLen);
        
        // Gap width is the opening width
        const gapHalfWidth = drain.openingWidth / 2 / segLen;
        
        // Point before gap
        const beforeGapT = Math.max(0, drainT - gapHalfWidth);
        const beforeGap: Point = {
          x: start.x + (end.x - start.x) * beforeGapT,
          y: start.y + (end.y - start.y) * beforeGapT,
        };
        
        // Add segment before gap
        if (Math.hypot(beforeGap.x - currentStart.x, beforeGap.y - currentStart.y) > 0.001) {
          segments.push({
            start: currentStart,
            end: beforeGap,
            hasOpening: false,
            openingIds: []
          });
        }
        
        // Add gap segment (marked as opening)
        const afterGapT = Math.min(1, drainT + gapHalfWidth);
        const afterGap: Point = {
          x: start.x + (end.x - start.x) * afterGapT,
          y: start.y + (end.y - start.y) * afterGapT,
        };
        
        segments.push({
          start: beforeGap,
          end: afterGap,
          hasOpening: true,
          openingIds: [drain.id]
        });
        
        currentStart = afterGap;
      }
      
      // Add remaining segment after last drain
      if (Math.hypot(end.x - currentStart.x, end.y - currentStart.y) > 0.001) {
        segments.push({ start: currentStart, end, hasOpening: false, openingIds: [] });
      }
    }
  }
  
  return segments;
}

function distanceToPolyline(p: Point, line: Point[]): number {
  let best = Infinity;
  for (let i = 0; i < line.length - 1; i++) {
    best = Math.min(best, pointToSegmentDistance(p, line[i], line[i + 1]));
  }
  return best;
}

function pointToSegmentDistance(p: Point, a: Point, b: Point): number {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const ab2 = abx * abx + aby * aby || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / ab2));
  const x = a.x + abx * t;
  const y = a.y + aby * t;
  return Math.hypot(p.x - x, p.y - y);
}

function directionToNearestSegment(p: Point, line: Point[]): { x: number; y: number } {
  let best = Infinity;
  let bestA: Point | null = null;
  let bestB: Point | null = null;
  for (let i = 0; i < line.length - 1; i++) {
    const a = line[i];
    const b = line[i + 1];
    const d = pointToSegmentDistance(p, a, b);
    if (d < best) {
      best = d;
      bestA = a;
      bestB = b;
    }
  }
  if (!bestA || !bestB) return { x: 0, y: 1 };
  // Use bank-normal approximation from tangent.
  const tx = bestB.x - bestA.x;
  const ty = bestB.y - bestA.y;
  const len = Math.hypot(tx, ty) || 1;
  return { x: -ty / len, y: tx / len };
}

