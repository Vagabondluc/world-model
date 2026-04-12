// @ts-nocheck
/**
 * Quality checking utilities for city validation
 */

import { CityModel } from '../pipeline/generateCity';
import { QualityCheck } from './types';
import { dist, Point } from '../domain/types';
import { getWallIndices } from '../svg-elements/wall';

export function evaluateQualityChecks(model: CityModel | null): QualityCheck[] {
  if (!model) {
    return [];
  }

  return [
    checkBuildingsIntersectWall(model),
    checkRiverContactAuthority(model),
    checkRoadsTouchWallWithoutGate(model),
    checkRiverIntersectsWallWithoutWatergate(model),
    checkBridgeCountExcedsMax(model),
    checkBridgeEndpointsConnected(model),
    checkTowerSpacingOutOfRange(model),
    checkBuildingsInsideWallClearZone(model),
    checkGateMinSpacing(model),
    checkWallClosed(model),
    checkOffscreenRoadCount(model),
    checkGrassInsideWallRatio(model),
    checkRenderWallLayerOrder(model),
  ];
}

function checkRiverContactAuthority(model: CityModel): QualityCheck {
  const offenders: { id: string; reason: string; location?: Point }[] = [];
  const bridges = model.bridges ?? [];
  const drains = model.hydraulicNodes ?? [];
  const bridgePoints = bridges.map((b) => b.point);
  const drainPoints = drains.map((d) => ({ x: d.x, y: d.y }));
  const contactSnap = 0.03;

  if (!model.river || model.river.points.length < 2) {
    return {
      id: 'river-contact-authority',
      label: 'River Contact Authority',
      status: 'pass',
      message: 'No river present',
      offenders: [],
    };
  }

  // Rule 1: Roads may touch river only at bridge spans.
  for (const edge of model.roads.edges) {
    const u = model.roads.nodes.get(edge.u)?.point;
    const v = model.roads.nodes.get(edge.v)?.point;
    if (!u || !v) continue;
    for (let i = 0; i < model.river.points.length - 1; i++) {
      const hit = segmentIntersection(u, v, model.river.points[i], model.river.points[i + 1]);
      if (!hit) continue;
      const nearBridge = nearestPointDistance(hit, bridgePoints) <= contactSnap;
      if (!nearBridge) {
        offenders.push({
          id: `road-${edge.id}`,
          reason: 'Road touches river outside bridge span',
          location: hit,
        });
      }
    }
  }

  // Rule 2: Wall may touch river only at drain/watergate or bridge interface.
  for (let i = 0; i < model.boundary.length; i++) {
    const a = model.boundary[i];
    const b = model.boundary[(i + 1) % model.boundary.length];
    for (let j = 0; j < model.river.points.length - 1; j++) {
      const hit = segmentIntersection(a, b, model.river.points[j], model.river.points[j + 1]);
      if (!hit) continue;
      const nearDrain = nearestPointDistance(hit, drainPoints) <= contactSnap;
      const nearBridge = nearestPointDistance(hit, bridgePoints) <= contactSnap;
      if (!nearDrain && !nearBridge) {
        offenders.push({
          id: `wall-${i}`,
          reason: 'Wall touches river outside drain/bridge authority',
          location: hit,
        });
      }
    }
  }

  return {
    id: 'river-contact-authority',
    label: 'River Contact Authority',
    status: offenders.length === 0 ? 'pass' : 'fail',
    message: offenders.length === 0
      ? 'Only bridges and wall drains touch river'
      : `${offenders.length} unauthorized river contact(s)`,
    offenders: offenders.length > 0 ? offenders : undefined,
  };
}

function checkBuildingsIntersectWall(model: CityModel): QualityCheck {
  const offenders: { id: string; reason: string; location?: Point }[] = [];
  
  if (!model.boundary || model.boundary.length < 3) {
    return {
      id: 'buildings-intersect-wall',
      label: 'Buildings Intersect Wall',
      status: 'pass',
      message: 'No wall boundary to check against',
      offenders: [],
    };
  }
  
  for (const building of model.buildings) {
    if (building.polygon && building.polygon.length >= 3) {
      // Intersection with wall means edge crossing, not simple containment inside boundary.
      if (polygonsEdgeIntersect(building.polygon, model.boundary)) {
        offenders.push({
          id: building.id,
          reason: 'Building polygon intersects wall boundary',
          location: polygonCentroid(building.polygon),
        });
      }
    }
  }
  
  return {
    id: 'buildings-intersect-wall',
    label: 'Buildings Intersect Wall',
    status: offenders.length === 0 ? 'pass' : 'fail',
    message: offenders.length === 0
      ? 'No buildings intersect the fortification wall'
      : `${offenders.length} building(s) intersect wall`,
    offenders: offenders.length > 0 ? offenders : undefined,
  };
}

function checkRoadsTouchWallWithoutGate(model: CityModel): QualityCheck {
  const offenders: { id: string; reason: string; location?: Point }[] = [];
  
  if (!model.boundary || model.boundary.length < 3 || !model.roads) {
    return {
      id: 'roads-touch-wall-no-gate',
      label: 'Roads Touch Wall Without Gate',
      status: 'pass',
      message: 'No wall or roads to check',
      offenders: [],
    };
  }
  
  const gateSnap = 0.02;
  const gates = model.gates || [];
  
  for (const edge of model.roads.edges) {
    const u = model.roads.nodes.get(edge.u)?.point;
    const v = model.roads.nodes.get(edge.v)?.point;
    if (!u || !v) continue;
    
    const contacts = roadBoundaryIntersections(u, v, model.boundary);
    for (const hit of contacts) {
      const nearestGateDist = nearestPointDistance(hit, gates);
      if (nearestGateDist > gateSnap) {
        offenders.push({
          id: edge.id,
          reason: `Road-wall intersection at (${hit.x.toFixed(3)}, ${hit.y.toFixed(3)}) has no gate (nearest: ${nearestGateDist.toFixed(3)})`,
          location: hit,
        });
      }
    }
  }
  
  return {
    id: 'roads-touch-wall-no-gate',
    label: 'Roads Touch Wall Without Gate',
    status: offenders.length === 0 ? 'pass' : 'warn',
    message: offenders.length === 0
      ? 'All road-wall intersections have gates'
      : `${offenders.length} road-wall intersection(s) missing gate`,
    offenders: offenders.length > 0 ? offenders : undefined,
  };
}

function checkRiverIntersectsWallWithoutWatergate(model: CityModel): QualityCheck {
  if (!model.river || model.river.points.length < 2) {
    return {
      id: 'river-wall-no-watergate',
      label: 'River Intersects Wall Without Watergate',
      status: 'pass',
      message: 'No river present',
    };
  }
  
  if (!model.boundary || model.boundary.length < 3) {
    return {
      id: 'river-wall-no-watergate',
      label: 'River Intersects Wall Without Watergate',
      status: 'pass',
      message: 'No wall boundary to check',
    };
  }
  
  // Check if river actually intersects wall
  let riverCrossesWall = false;
  const intersectionPoints: Point[] = [];
  
  for (let i = 0; i < model.river.points.length - 1; i++) {
    const a = model.river.points[i];
    const b = model.river.points[i + 1];
    for (let j = 0; j < model.boundary.length; j++) {
      const c = model.boundary[j];
      const d = model.boundary[(j + 1) % model.boundary.length];
      const hit = segmentIntersection(a, b, c, d);
      if (hit) {
        riverCrossesWall = true;
        intersectionPoints.push(hit);
      }
    }
  }
  
  if (!riverCrossesWall) {
    return {
      id: 'river-wall-no-watergate',
      label: 'River Intersects Wall Without Watergate',
      status: 'pass',
      message: 'River does not cross wall boundary',
    };
  }
  
  // Check for watergate: gates within 0.028 of river (same threshold as svgRenderer.ts)
  const watergateThreshold = 0.028;
  const gates = model.gates || [];
  let hasWatergate = false;
  
  for (const gate of gates) {
    const distToRiver = distanceToPolyline(gate, model.river.points);
    if (distToRiver <= watergateThreshold) {
      hasWatergate = true;
      break;
    }
  }
  
  // Also check if resolved by bridge
  const bridgeThreshold = 0.03;
  const bridges = model.bridges || [];
  let resolvedByBridge = false;
  
  for (const intersection of intersectionPoints) {
    for (const bridge of bridges) {
      const d = Math.hypot(bridge.point.x - intersection.x, bridge.point.y - intersection.y);
      if (d <= bridgeThreshold) {
        resolvedByBridge = true;
        break;
      }
    }
    if (resolvedByBridge) break;
  }
  
  const resolved = hasWatergate || resolvedByBridge;
  
  return {
    id: 'river-wall-no-watergate',
    label: 'River Intersects Wall Without Watergate',
    status: resolved ? 'pass' : 'warn',
    message: resolved
      ? 'River-wall intersection properly handled (watergate or bridge present)'
      : `River crosses wall at ${intersectionPoints.length} point(s) but no watergate or bridge configured`,
  };
}

function checkBridgeCountExcedsMax(model: CityModel): QualityCheck {
  const bridgeCount = model.bridges?.length ?? 0;
  const maxBridges = 2; // Would come from params
  
  return {
    id: 'bridge-count-exceeds-max',
    label: 'Bridge Count Exceeds Max',
    status: bridgeCount <= maxBridges ? 'pass' : 'fail',
    message: bridgeCount <= maxBridges
      ? `${bridgeCount} bridge(s), within limit of ${maxBridges}`
      : `${bridgeCount} bridge(s) exceed max of ${maxBridges}`,
    offenders: bridgeCount > maxBridges 
      ? model.bridges?.map(b => ({
          id: b.id,
          reason: 'Exceeds max bridge count',
          location: b.point,
        }))
      : undefined,
  };
}

function checkBridgeEndpointsConnected(model: CityModel): QualityCheck {
  // Bridge structures carry a resolved roadEdgeId; if missing, connectivity is invalid.
  const offenders: any[] = model.bridges
    ?.filter(b => !b.roadEdgeId || b.roadEdgeId.length === 0)
    .map(b => ({
      id: b.id,
      reason: 'No connected road edge',
      location: b.point,
    })) ?? [];
  
  return {
    id: 'bridge-endpoints-connected',
    label: 'Bridge Endpoints Connected',
    status: offenders.length === 0 ? 'pass' : 'fail',
    message: offenders.length === 0
      ? 'All bridges connect to valid roads'
      : `${offenders.length} bridge(s) missing road connections`,
    offenders: offenders.length > 0 ? offenders : undefined,
  };
}

function checkTowerSpacingOutOfRange(model: CityModel): QualityCheck {
  const minSpacing = 0.07;  // Euclidean minimum (from wall.ts)
  const maxSpacing = 0.18;  // Euclidean maximum
  const spacingTolerance = 0.002; // absorb tiny numerical jitter
  const offenders: { id: string; reason: string; location?: Point }[] = [];
  
  if (!model.boundary || model.boundary.length < 3) {
    return {
      id: 'tower-spacing-range',
      label: 'Tower Spacing Out of Range',
      status: 'pass',
      message: 'No wall boundary to check tower spacing',
      offenders: [],
    };
  }
  
  // Get tower indices using the same logic as wall.ts
  const towerInterval = 2;
  const { towerSet } = getWallIndices(model.boundary, model.gates || [], towerInterval, model.river);
  
  if (towerSet.size < 2) {
    return {
      id: 'tower-spacing-range',
      label: 'Tower Spacing Out of Range',
      status: 'pass',
      message: 'Insufficient towers to check spacing',
      offenders: [],
    };
  }
  
  // Sort tower indices for sequential spacing check
  const towerIndices = Array.from(towerSet).sort((a, b) => a - b);
  const n = model.boundary.length;
  
  // Check spacing between consecutive towers along the boundary
  for (let i = 0; i < towerIndices.length; i++) {
    const currIdx = towerIndices[i];
    const nextIdx = towerIndices[(i + 1) % towerIndices.length];
    
    const currPoint = model.boundary[currIdx];
    const nextPoint = model.boundary[nextIdx];
    
    // Tower rhythm is defined along wall arc distance, not direct Euclidean chord.
    const arcDist = boundaryArcDistance(model.boundary, currIdx, nextIdx);
    
    if (arcDist < (minSpacing - spacingTolerance)) {
      offenders.push({
        id: `tower-${currIdx}-${nextIdx}`,
        reason: `Tower spacing ${arcDist.toFixed(3)} below minimum ${minSpacing}`,
        location: currPoint,
      });
    } else if (arcDist > (maxSpacing + spacingTolerance)) {
      offenders.push({
        id: `tower-${currIdx}-${nextIdx}`,
        reason: `Tower spacing ${arcDist.toFixed(3)} above maximum ${maxSpacing}`,
        location: currPoint,
      });
    }
  }
  
  return {
    id: 'tower-spacing-range',
    label: 'Tower Spacing Out of Range',
    status: offenders.length === 0 ? 'pass' : 'warn',
    message: offenders.length === 0
      ? `All ${towerSet.size} towers within spacing range (${minSpacing}–${maxSpacing})`
      : `${offenders.length} tower spacing violation(s) among ${towerSet.size} towers`,
    offenders: offenders.length > 0 ? offenders : undefined,
  };
}

function checkBuildingsInsideWallClearZone(model: CityModel): QualityCheck {
  // Keep checker aligned with synthesis wall setback constraints.
  const clearZoneDistance = 0.015;
  const offenders: { id: string; reason: string; location?: Point }[] = [];
  
  if (!model.boundary || model.boundary.length < 3) {
    return {
      id: 'buildings-in-wall-clear-zone',
      label: 'Buildings Inside Wall Clear Zone',
      status: 'pass',
      message: 'No wall boundary to check clear zone',
      offenders: [],
    };
  }
  
  for (const building of model.buildings) {
    if (!building.polygon || building.polygon.length < 1) continue;
    
    // Check each vertex of the building polygon against the wall
    for (const vertex of building.polygon) {
      const distToWall = distanceToPolygon(vertex, model.boundary);
      
      // If inside the wall and too close to it
      if (distToWall < clearZoneDistance && pointInPolygon(vertex, model.boundary)) {
        offenders.push({
          id: building.id,
          reason: `Building vertex within ${clearZoneDistance} clear zone of wall (distance: ${distToWall.toFixed(4)})`,
          location: vertex,
        });
        break;  // Only report once per building
      }
    }
  }
  
  return {
    id: 'buildings-in-wall-clear-zone',
    label: 'Buildings Inside Wall Clear Zone',
    status: offenders.length === 0 ? 'pass' : 'fail',
    message: offenders.length === 0
      ? 'No buildings in wall clear zone'
      : `${offenders.length} building(s) in wall clear zone`,
    offenders: offenders.length > 0 ? offenders : undefined,
  };
}

function checkGateMinSpacing(model: CityModel): QualityCheck {
  // Check gate spacing
  const gateCount = model.gates?.length ?? 0;
  const minSpacing = 3.0;
  
  let offenders: any[] = [];
  if (model.gates && model.gates.length > 1) {
    for (let i = 0; i < model.gates.length; i++) {
      for (let j = i + 1; j < model.gates.length; j++) {
        const spacing = dist(model.gates[i], model.gates[j]);
        if (spacing < minSpacing) {
          offenders.push({
            id: `gate-${i}-${j}`,
            reason: `Gate spacing ${spacing.toFixed(2)} < ${minSpacing}`,
            location: model.gates[i],
          });
        }
      }
    }
  }
  
  return {
    id: 'gate-min-spacing',
    label: 'Gate Minimum Spacing',
    status: offenders.length === 0 ? 'pass' : 'warn',
    message: offenders.length === 0
      ? `${gateCount} gate(s), properly spaced`
      : `${offenders.length} gate spacing violation(s)`,
    offenders: offenders.length > 0 ? offenders : undefined,
  };
}

function checkWallClosed(model: CityModel): QualityCheck {
  const closed = (model.diagnostics.wall_closed_flag ?? 0) === 1;
  return {
    id: 'wall-closed',
    label: 'Wall Topology Closed',
    status: closed ? 'pass' : 'fail',
    message: closed ? 'Wall boundary is closed' : 'Wall boundary is open or invalid',
  };
}

function checkOffscreenRoadCount(model: CityModel): QualityCheck {
  const count = model.diagnostics.offscreen_road_count ?? 0;
  return {
    id: 'offscreen-road-count',
    label: 'Offscreen Road Continuation',
    status: count >= 2 ? 'pass' : 'fail',
    message: count >= 2 ? `${count} offscreen-connected routes` : `Only ${count} offscreen routes; requires at least 2`,
  };
}

function checkGrassInsideWallRatio(model: CityModel): QualityCheck {
  const ratio = model.diagnostics.grass_inside_wall_ratio ?? 0;
  return {
    id: 'grass-inside-wall-ratio',
    label: 'Grass Mostly Outside Walls',
    status: ratio <= 0.35 ? 'pass' : 'warn',
    message: ratio <= 0.35
      ? `Inside-wall grass ratio ${(ratio * 100).toFixed(1)}% within cap`
      : `Inside-wall grass ratio ${(ratio * 100).toFixed(1)}% exceeds 35.0% cap`,
  };
}

function checkRenderWallLayerOrder(model: CityModel): QualityCheck {
  const ok = (model.diagnostics.render_walls_above_buildings_flag ?? 0) === 1;
  return {
    id: 'wall-layer-order',
    label: 'Walls Rendered Above Buildings',
    status: ok ? 'pass' : 'fail',
    message: ok ? 'Wall layer precedence is correct' : 'Wall layer precedence drift detected',
  };
}

// ============================================================================
// Geometry Helper Functions
// ============================================================================

/**
 * Check if two polygons intersect (share any interior or edge points)
 */
function polygonsIntersect(a: Point[], b: Point[]): boolean {
  // Check if any edges intersect
  for (let i = 0; i < a.length; i++) {
    const a1 = a[i];
    const a2 = a[(i + 1) % a.length];
    for (let j = 0; j < b.length; j++) {
      const b1 = b[j];
      const b2 = b[(j + 1) % b.length];
      if (segmentsIntersect(a1, a2, b1, b2)) return true;
    }
  }
  // Check if one polygon contains the other
  if (pointInPolygon(a[0], b)) return true;
  if (pointInPolygon(b[0], a)) return true;
  return false;
}

/**
 * Check if polygon edges cross (ignores pure containment cases).
 */
function polygonsEdgeIntersect(a: Point[], b: Point[]): boolean {
  for (let i = 0; i < a.length; i++) {
    const a1 = a[i];
    const a2 = a[(i + 1) % a.length];
    for (let j = 0; j < b.length; j++) {
      const b1 = b[j];
      const b2 = b[(j + 1) % b.length];
      if (segmentsIntersect(a1, a2, b1, b2)) return true;
    }
  }
  return false;
}

/**
 * Check if two line segments intersect
 */
function segmentsIntersect(a: Point, b: Point, c: Point, d: Point): boolean {
  const o1 = orient(a, b, c);
  const o2 = orient(a, b, d);
  const o3 = orient(c, d, a);
  const o4 = orient(c, d, b);
  
  if (o1 === 0 && onSegment(a, c, b)) return true;
  if (o2 === 0 && onSegment(a, d, b)) return true;
  if (o3 === 0 && onSegment(c, a, d)) return true;
  if (o4 === 0 && onSegment(c, b, d)) return true;
  
  return o1 !== o2 && o3 !== o4;
}

/**
 * Orientation test for point c relative to line a-b
 */
function orient(a: Point, b: Point, c: Point): number {
  const v = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (Math.abs(v) < 1e-12) return 0;
  return v > 0 ? 1 : 2;
}

/**
 * Check if point b is on segment a-c
 */
function onSegment(a: Point, b: Point, c: Point): boolean {
  return (
    b.x <= Math.max(a.x, c.x) &&
    b.x >= Math.min(a.x, c.x) &&
    b.y <= Math.max(a.y, c.y) &&
    b.y >= Math.min(a.y, c.y)
  );
}

/**
 * Check if a point is inside a polygon (ray casting algorithm)
 */
function pointInPolygon(p: Point, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect = ((yi > p.y) !== (yj > p.y)) &&
      (p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Calculate the centroid of a polygon
 */
function polygonCentroid(poly: Point[]): Point {
  if (poly.length === 0) return { x: 0, y: 0 };
  let sumX = 0, sumY = 0;
  for (const p of poly) {
    sumX += p.x;
    sumY += p.y;
  }
  return { x: sumX / poly.length, y: sumY / poly.length };
}

/**
 * Find intersection points between a road segment and boundary
 */
function roadBoundaryIntersections(a: Point, b: Point, boundary: Point[]): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < boundary.length; i++) {
    const c = boundary[i];
    const d = boundary[(i + 1) % boundary.length];
    const hit = segmentIntersection(a, b, c, d);
    if (!hit) continue;
    // Dedupe nearby hits
    if (out.some((p) => (p.x - hit.x) ** 2 + (p.y - hit.y) ** 2 < 1e-8)) continue;
    out.push(hit);
  }
  return out;
}

/**
 * Find intersection point of two line segments, or null if they don't intersect
 */
function segmentIntersection(a: Point, b: Point, c: Point, d: Point): Point | null {
  const r = { x: b.x - a.x, y: b.y - a.y };
  const s = { x: d.x - c.x, y: d.y - c.y };
  const den = r.x * s.y - r.y * s.x;
  if (Math.abs(den) < 1e-10) return null;
  const ac = { x: c.x - a.x, y: c.y - a.y };
  const t = (ac.x * s.y - ac.y * s.x) / den;
  const u = (ac.x * r.y - ac.y * r.x) / den;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: a.x + t * r.x, y: a.y + t * r.y };
}

/**
 * Find distance from point to nearest point in array
 */
function nearestPointDistance(p: Point, points: Point[]): number {
  if (points.length === 0) return Infinity;
  let best = Infinity;
  for (const q of points) {
    best = Math.min(best, Math.hypot(p.x - q.x, p.y - q.y));
  }
  return best;
}

/**
 * Calculate distance from point to a polyline
 */
function distanceToPolyline(p: Point, line: Point[]): number {
  if (line.length === 0) return Infinity;
  let best = Infinity;
  for (let i = 0; i < line.length - 1; i++) {
    best = Math.min(best, pointToSegmentDistance(p, line[i], line[i + 1]));
  }
  return best;
}

/**
 * Calculate distance from point to line segment
 */
function pointToSegmentDistance(p: Point, a: Point, b: Point): number {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const ab2 = abx * abx + aby * aby || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / ab2));
  const x = a.x + abx * t;
  const y = a.y + aby * t;
  return Math.hypot(p.x - x, p.y - y);
}

/**
 * Calculate minimum distance from a point to a polygon boundary
 */
function distanceToPolygon(p: Point, poly: Point[]): number {
  if (poly.length < 2) return Infinity;
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    best = Math.min(best, pointToSegmentDistance(p, a, b));
  }
  return best;
}

/**
 * Arc length along closed boundary from start index to end index (forward direction).
 */
function boundaryArcDistance(boundary: Point[], startIdx: number, endIdx: number): number {
  if (boundary.length < 2) return 0;
  if (startIdx === endIdx) return 0;
  const n = boundary.length;
  let i = startIdx;
  let sum = 0;
  while (i !== endIdx) {
    const j = (i + 1) % n;
    sum += Math.hypot(boundary[j].x - boundary[i].x, boundary[j].y - boundary[i].y);
    i = j;
  }
  return sum;
}
