// @ts-nocheck
import { Parcel } from '../parcels/subdivide';
import { DistrictAssignment } from '../districts/assign';
import { Point, dist } from '../types';
import { PRNG } from '../seed/prng';
import { River, distanceToRiver } from '../terrain/river';
import { RoadGraph, RoadKind } from '../roads/graph';
import { BridgeStructure, LandmarkStructure, ParkFeature } from '../structures/features';
import { ForbiddenMaskCalculator, Wall, Tower } from '../boundary/forbiddenMaskCalculator';
import { CellPacker, PlacementConfig, DEFAULT_PLACEMENT_CONFIG, PackBuildingsOptions } from './cellPacker';
import { analyzeFrontage, ParcelFrontage, DEFAULT_FRONTAGE_CONFIG, RoadSegment } from './frontageAnalyzer';

export interface Building {
  id: string;
  polygon: Point[];
  parcelId: string;
}

export interface InnerClearZoneMask {
  boundary: Point[];
  clearDistance: number;
}

interface PolygonObstacle {
  polygon: Point[];
  bounds: Bounds;
}

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** Feature flags for building synthesis */
import { REV1_IDS } from '../invariants/types';
export interface SynthesisFeatureFlags {
  feature_recursive_subdivision: boolean;
  /** Enable deterministic cell-fill v1 algorithm */
  deterministic_cell_fill_v1?: boolean;
  /** Enable frontage-driven building placement policy (Phase 1) */
  frontage_policy_v1?: boolean;
  /** Enable frontage-driven building placement v1 (Phase 4) */
  frontage_driven_placement_v1?: boolean;
}

/**
 * Synthesizes building footprints within parcels.
 */
/**
 * Simple recursive subdivision for buildings.
 * CRC-F11-REV1: Recursive subdivision building synthesis.
 */
function recursiveSubdivide(poly: Point[], depth: number, rng: PRNG): Point[][] {
  if (depth > 3 || polygonArea(poly) < 0.00002) return [poly];
  let bestI = 0;
  let bestLen = 0;
  for (let i = 0; i < poly.length; i++) {
    const d = dist(poly[i], poly[(i+1)%poly.length]);
    if (d > bestLen) { bestLen = d; bestI = i; }
  }
  if (bestLen < 0.015) return [poly];
  const a = poly[bestI];
  const b = poly[(bestI + 1) % poly.length];
  const t = 0.4 + rng.nextFloat() * 0.2;
  const splitPt = { x: a.x + (b.x-a.x)*t, y: a.y + (b.y-a.y)*t };
  const oppI = (bestI + Math.floor(poly.length/2)) % poly.length;
  const oa = poly[oppI];
  const ob = poly[(oppI + 1) % poly.length];
  const ot = 0.4 + rng.nextFloat() * 0.2;
  const osplitPt = { x: oa.x + (ob.x-oa.x)*ot, y: oa.y + (ob.y-oa.y)*ot };
  return [...recursiveSubdivide([a, splitPt, osplitPt, oa], depth + 1, rng), ...recursiveSubdivide([splitPt, b, ob, osplitPt], depth + 1, rng)];
}
export function synthesizeBuildings(
  parcels: Parcel[],
  assignments: DistrictAssignment[],
  river: River,
  roads: RoadGraph,
  landmarks: LandmarkStructure[],
  parkFeatures: ParkFeature[],
  bridges: BridgeStructure[],
  reservedParcelIds: Set<string>,
  rng: PRNG,
  boundary?: Point[],
  gates?: Point[],
  walls?: Wall[],
  towers?: Tower[],
  buildingSetback?: number,
  featureFlags?: SynthesisFeatureFlags,
  innerClearZoneMask?: InnerClearZoneMask,
): Building[] {
  const buildings: Building[] = [];
  const acceptedBuildings: PolygonObstacle[] = [];
  const blockedPolygons: PolygonObstacle[] = [
    ...landmarks.map((l) => toObstacle(l.polygon)),
    ...parkFeatures.map((p) => toObstacle(p.polygon)),
  ];

  // Initialize forbidden mask calculator if walls or towers are provided
  const forbiddenMaskCalculator = (walls && towers)
    ? new ForbiddenMaskCalculator(buildingSetback || 0.01)
    : null;
  
  // Compute forbidden mask if walls and towers are available
  if (forbiddenMaskCalculator && walls && towers) {
    forbiddenMaskCalculator.computeMask(walls, towers);
  }

  const assignmentByParcel = new Map(assignments.map((a) => [a.parcelId, a.type]));

  parcels.forEach((p) => {
    if (reservedParcelIds.has(p.id)) return;
    const district = assignmentByParcel.get(p.id);
    if (!district || district === 'park' || district === 'rural') return;
    // residential-mid is treated like residential but with different parameters below

    const area = polygonArea(p.polygon);
    if (area < 0.00003) return;
    const center = polygonCentroid(p.polygon);
    const centerDist = Math.hypot(center.x - 0.5, center.y - 0.5);
    const inInnerRing = centerDist < 0.24;
    const inNW = center.x < 0.5 && center.y < 0.5;
    const inEast = center.x >= 0.5;

    const nearRiver = distanceToRiver(center, river) < (inInnerRing ? 0.011 : 0.018);
    if (nearRiver) return;
    const deterministicFillEnabled =
      featureFlags?.deterministic_cell_fill_v1 === true ||
      featureFlags?.feature_recursive_subdivision === true;
    if (!inInnerRing && !deterministicFillEnabled) {
      if (inEast && district !== 'industrial' && rng.bernoulli(0.22)) return;
      if (district === 'industrial' && rng.bernoulli(0.2)) return;
      if (district !== 'industrial' && rng.bernoulli(0.05)) return;
    }

    // Compute placement targets (used by both legacy and deterministic algorithms)
    const isLowDensity = district === 'residential-mid';
    const densityBias = deterministicFillEnabled
      ? (inNW ? 2.0 : inEast ? 0.9 : 1.1)
      : (inNW ? 2.05 : inEast ? 0.4 : 1.0);
    const baseTargetRaw = district === 'commercial' ? Math.max(3, Math.floor(area * 42000)) : Math.max(2, Math.floor(area * (isLowDensity ? 12000 : 36000)));
    const baseTarget = Math.max(2, Math.floor(baseTargetRaw * (isLowDensity ? 0.6 : densityBias)));
    const minTarget = inInnerRing && district !== 'industrial' && !isLowDensity ? Math.ceil(baseTarget * 1.34) : baseTarget;
    const maxTarget = Math.max(minTarget + 1, Math.floor(area * (isLowDensity ? 25000 : 98000)));
    let placedInParcel = 0;

    // Cell packer infill will be done AFTER legacy placement if feature flag is enabled
    // This provides additive density rather than replacement

    // Legacy Voronoi-conforming placement using formation layout inside each parcel.
    // Building shapes stay oriented rectangles.
    const dir = dominantAxis(p.polygon);
    const local = localBounds(p.polygon, center, dir.u, dir.v);
    const placed: Point[][] = [];

    if (district === 'industrial') {
      placeRowFormation(placed, p.polygon, center, dir.u, dir.v, local, rng, {
        laneSpacing: 0.02,
        lotDepth: 0.0152,
        lotWidth: 0.0215,
        occupancy: 0.82,
      });
    } else if (district === 'commercial') {
      placePerimeterFormation(placed, p.polygon, center, rng, {
        inset: 0.86,
        depth: 0.0105,
        step: 0.018,
        occupancy: 0.9,
      });
      placeRowFormation(placed, p.polygon, center, dir.u, dir.v, local, rng, {
        laneSpacing: 0.013,
        lotDepth: 0.0096,
        lotWidth: 0.0118,
        occupancy: 0.84,
      });
    } else {
      placeRowFormation(placed, p.polygon, center, dir.u, dir.v, local, rng, {
        laneSpacing: 0.012,
        lotDepth: 0.0086,
        lotWidth: 0.0102,
        occupancy: 0.96,
      });
    }

    // Infill pass: if parcel is still sparse, add a second tighter formation
    // on the perpendicular axis to reduce empty inner-city patches.
    if (placed.length < minTarget && district !== 'industrial') {
      placeRowFormation(placed, p.polygon, center, dir.v, { x: -dir.u.x, y: -dir.u.y }, local, rng, {
        laneSpacing: district === 'commercial' ? 0.0105 : 0.0098,
        lotDepth: district === 'commercial' ? 0.0081 : 0.0074,
        lotWidth: district === 'commercial' ? 0.0099 : 0.009,
        occupancy: 0.93,
      });
    }

    // CRC-F11-REV1 path is routed through deterministic placement/infill to avoid
    // emitting malformed raw split polygons as final building footprints.
    for (const poly of placed) {
      if (placedInParcel >= maxTarget) break;
      if (polygonArea(poly) < 0.000006) continue;
      if (!poly.every((pt) => isInside(pt, p.polygon))) continue;
      const polyBounds = getBounds(poly);
      if (collidesWithRoads(poly, roads)) continue;
      if (!hasRoadFrontage(poly, roads)) continue;
      if (polygonIntersectsRiverBuffer(poly, river, 0.014)) continue;
      if (intersectsInnerClearZone(poly, innerClearZoneMask)) continue;
      if (gates && gates.length > 0 && gateBufferHit(poly, gates, 0.016)) continue;
      if (collidesWithPolygons(poly, polyBounds, blockedPolygons)) continue;
      if (collidesWithBridges(poly, bridges)) continue;
      if (collidesWithPolygons(poly, polyBounds, acceptedBuildings)) continue;
      
      // Check against forbidden mask if available
      if (forbiddenMaskCalculator) {
        const tempBuilding: Building = {
          id: `temp-${buildings.length}`,
          polygon: poly,
          parcelId: p.id,
        };
        if (forbiddenMaskCalculator.checkBuildingIntersection(tempBuilding)) continue;
      }
      buildings.push({
        id: `h-${buildings.length}`,
        polygon: poly,
        parcelId: p.id,
      });
      acceptedBuildings.push({ polygon: poly, bounds: polyBounds });
      placedInParcel++;
    }
    
    // Deterministic cell-fill infill pass: add more buildings if legacy placement was sparse
    // This provides additive density on top of legacy placement
    if (deterministicFillEnabled && placedInParcel < maxTarget) {
      const forbiddenMask: Point[][] = blockedPolygons.map(b => b.polygon);
      
      const packerConfig: PlacementConfig = {
        ...DEFAULT_PLACEMENT_CONFIG,
        setback: buildingSetback || 0.006,
        targetCoverage: isLowDensity ? 0.15 : district === 'commercial' ? 0.72 : district === 'industrial' ? 0.55 : 0.62,
        gap: district === 'commercial' ? 0.0018 : 0.0025,
        bandWidth: 0.015,
        alternatingOffset: 0.004,
      };
      
      // Use small infill typologies for gaps between existing buildings
      const infillTypologies = [
        { width: 0.014, height: 0.009 },
        { width: 0.010, height: 0.007 },
        { width: 0.007, height: 0.005 },
      ];
      
      const packer = new CellPacker(rng, packerConfig, infillTypologies);
      
      // Check for frontage-driven placement feature flag
      const useFrontagePlacement = featureFlags?.frontage_driven_placement_v1 === true;
      
      // Analyze frontage if feature flag is enabled
      let packOptions: PackBuildingsOptions | undefined;
      if (useFrontagePlacement) {
        const roadSegments = extractRoadSegments(roads);
        const parcelFrontage = analyzeFrontage(
          p.id,
          p.polygon,
          roadSegments,
          DEFAULT_FRONTAGE_CONFIG
        );
        
        if (parcelFrontage.hasValidFrontage && parcelFrontage.frontageSegments.length > 0) {
          packOptions = {
            frontageOrientation: parcelFrontage.dominantTangent,
            frontageOrigin: parcelFrontage.frontageSegments[0].start,
            frontageDrivenPlacementEnabled: true,
          };
        }
      }
      
      const footprints = packer.packBuildings(p.polygon, forbiddenMask, packOptions);
      
      for (const fp of footprints) {
        if (placedInParcel >= maxTarget) break;
        
        const polyBounds = getBounds(fp.polygon);
        if (collidesWithRoads(fp.polygon, roads)) continue;
        // Infill should still respect network proximity, but can accept inner-block parcels.
        if (!hasRoadFrontage(fp.polygon, roads, 0.075)) continue;
        if (polygonIntersectsRiverBuffer(fp.polygon, river, 0.014)) continue;
        if (intersectsInnerClearZone(fp.polygon, innerClearZoneMask)) continue;
        if (gates && gates.length > 0 && gateBufferHit(fp.polygon, gates, 0.016)) continue;
        if (collidesWithPolygons(fp.polygon, polyBounds, blockedPolygons)) continue;
        if (collidesWithBridges(fp.polygon, bridges)) continue;
        if (collidesWithPolygons(fp.polygon, polyBounds, acceptedBuildings)) continue;
        
        if (forbiddenMaskCalculator) {
          const tempBuilding: Building = {
            id: `temp-${buildings.length}`,
            polygon: fp.polygon,
            parcelId: p.id,
          };
          if (forbiddenMaskCalculator.checkBuildingIntersection(tempBuilding)) continue;
        }
        
        buildings.push({
          id: `h-${buildings.length}`,
          polygon: fp.polygon,
          parcelId: p.id,
        });
        acceptedBuildings.push({ polygon: fp.polygon, bounds: polyBounds });
        placedInParcel++;
      }
    }
  });

  return buildings;
}

function collidesWithRoads(poly: Point[], roads: RoadGraph): boolean {
  if (roads.edges.length === 0) return false;
  const center = polygonCentroid(poly);
  for (const edge of roads.edges) {
    const u = roads.nodes.get(edge.u)?.point;
    const v = roads.nodes.get(edge.v)?.point;
    if (!u || !v) continue;
    const clearance = roadHalfWidth(edge.kind) + 0.0014;

    // Fast reject on centerline distance.
    if (pointToSegmentDistance(center, u, v) <= clearance) return true;

    // Vertex / edge checks.
    if (poly.some((p) => pointToSegmentDistance(p, u, v) <= clearance)) return true;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      if (segmentToSegmentDistance(a, b, u, v) <= clearance) return true;
    }
  }
  return false;
}

function hasRoadFrontage(poly: Point[], roads: RoadGraph, innerBlockMaxDistance = 0.06): boolean {
  if (roads.edges.length === 0) return true;
  const center = polygonCentroid(poly);
  let nearestCenterline = Infinity;
  for (const edge of roads.edges) {
    const u = roads.nodes.get(edge.u)?.point;
    const v = roads.nodes.get(edge.v)?.point;
    if (!u || !v) continue;
    const clearance = roadHalfWidth(edge.kind) + 0.0014;
    nearestCenterline = Math.min(nearestCenterline, pointToSegmentDistance(center, u, v));
    const frontageMax = clearance + 0.045;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      const d = segmentToSegmentDistance(a, b, u, v);
      if (d <= frontageMax) return true;
    }
  }
  // Allow compact inner-block infill if still close to the road network corridor.
  return nearestCenterline <= innerBlockMaxDistance;
}

function collidesWithBridges(poly: Point[], bridges: BridgeStructure[]): boolean {
  if (bridges.length === 0) return false;
  for (const b of bridges) {
    const r = b.kind === 'trunk' ? 0.014 : b.kind === 'secondary' ? 0.011 : 0.009;
    if (poly.some((p) => sqDist(p, b.point) <= r * r)) return true;
    const c = polygonCentroid(poly);
    if (sqDist(c, b.point) <= (r * 0.92) * (r * 0.92)) return true;
  }
  return false;
}

function collidesWithPolygons(poly: Point[], polyBounds: Bounds, obstacles: PolygonObstacle[]): boolean {
  for (const obs of obstacles) {
    if (obs.polygon.length < 3) continue;
    if (!boundsOverlap(polyBounds, obs.bounds)) continue;
    if (polygonsIntersect(poly, obs.polygon)) return true;
  }
  return false;
}

function polygonsIntersect(a: Point[], b: Point[]): boolean {
  for (let i = 0; i < a.length; i++) {
    const a1 = a[i];
    const a2 = a[(i + 1) % a.length];
    for (let j = 0; j < b.length; j++) {
      const b1 = b[j];
      const b2 = b[(j + 1) % b.length];
      if (segmentsIntersect(a1, a2, b1, b2)) return true;
    }
  }
  if (isInside(a[0], b)) return true;
  if (isInside(b[0], a)) return true;
  return false;
}

function sqDist(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function roadHalfWidth(kind: RoadKind): number {
  if (kind === 'trunk') return 6 / 800 / 2;
  if (kind === 'secondary') return 3.5 / 800 / 2;
  return 2 / 800 / 2;
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
  return Math.hypot(p.x - x, p.y - y);
}

function pointToBoundaryDistance(p: Point, boundary: Point[]): number {
  let best = Infinity;
  for (let i = 0; i < boundary.length; i++) {
    const a = boundary[i];
    const b = boundary[(i + 1) % boundary.length];
    best = Math.min(best, pointToSegmentDistance(p, a, b));
  }
  return best;
}

function intersectsInnerClearZone(poly: Point[], mask?: InnerClearZoneMask): boolean {
  if (!mask || mask.boundary.length < 3) return false;
  const c = polygonCentroid(poly);
  if (isInside(c, mask.boundary) && pointToBoundaryDistance(c, mask.boundary) < mask.clearDistance) return true;
  for (const pt of poly) {
    if (isInside(pt, mask.boundary) && pointToBoundaryDistance(pt, mask.boundary) < mask.clearDistance) return true;
  }
  return false;
}

function gateBufferHit(poly: Point[], gates: Point[], r: number): boolean {
  const rr = r * r;
  const c = polygonCentroid(poly);
  for (const g of gates) {
    if (sqDist(c, g) <= rr) return true;
    for (const p of poly) {
      if (sqDist(p, g) <= rr) return true;
    }
  }
  return false;
}

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

function segmentToSegmentDistance(a: Point, b: Point, c: Point, d: Point): number {
  if (segmentsIntersect(a, b, c, d)) return 0;
  const d1 = pointToSegmentDistance(a, c, d);
  const d2 = pointToSegmentDistance(b, c, d);
  const d3 = pointToSegmentDistance(c, a, b);
  const d4 = pointToSegmentDistance(d, a, b);
  return Math.min(d1, d2, d3, d4);
}

function polygonIntersectsRiverBuffer(poly: Point[], river: River, buffer: number): boolean {
  if (poly.length < 3 || river.points.length < 2) return false;
  const c = polygonCentroid(poly);
  if (distanceToRiver(c, river) < buffer) return true;
  for (const p of poly) {
    if (distanceToRiver(p, river) < buffer) return true;
  }
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    for (let j = 0; j < river.points.length - 1; j++) {
      const r0 = river.points[j];
      const r1 = river.points[j + 1];
      if (segmentToSegmentDistance(a, b, r0, r1) < buffer) return true;
    }
  }
  return false;
}

function orient(a: Point, b: Point, c: Point): number {
  const v = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (Math.abs(v) < 1e-12) return 0;
  return v > 0 ? 1 : 2;
}

function onSegment(a: Point, b: Point, c: Point): boolean {
  return (
    b.x <= Math.max(a.x, c.x) &&
    b.x >= Math.min(a.x, c.x) &&
    b.y <= Math.max(a.y, c.y) &&
    b.y >= Math.min(a.y, c.y)
  );
}

function polygonCentroid(poly: Point[]): Point {
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p.x;
    y += p.y;
  }
  return { x: x / poly.length, y: y / poly.length };
}

function polygonArea(poly: Point[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length;
    a += poly[i].x * poly[j].y - poly[j].x * poly[i].y;
  }
  return Math.abs(a) * 0.5;
}

function toObstacle(polygon: Point[]): PolygonObstacle {
  return { polygon, bounds: getBounds(polygon) };
}

function getBounds(poly: Point[]): Bounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of poly) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}

function boundsOverlap(a: Bounds, b: Bounds): boolean {
  return !(a.maxX < b.minX || a.minX > b.maxX || a.maxY < b.minY || a.minY > b.maxY);
}

function placeRowFormation(
  out: Point[][],
  parcel: Point[],
  center: Point,
  u: Point,
  v: Point,
  bounds: { minU: number; maxU: number; minV: number; maxV: number },
  rng: PRNG,
  cfg: { laneSpacing: number; lotDepth: number; lotWidth: number; occupancy: number },
): void {
  const laneStart = bounds.minV + cfg.laneSpacing * 0.7;
  const laneEnd = bounds.maxV - cfg.laneSpacing * 0.7;
  if (laneEnd <= laneStart) return;
  const widthStart = bounds.minU + cfg.lotWidth * 0.65;
  const widthEnd = bounds.maxU - cfg.lotWidth * 0.65;
  if (widthEnd <= widthStart) return;

  const maxLaneSteps = 36;
  const maxWidthSteps = 42;
  const laneSteps = Math.max(1, Math.ceil((laneEnd - laneStart) / cfg.laneSpacing));
  const widthSteps = Math.max(1, Math.ceil((widthEnd - widthStart) / (cfg.lotWidth * 1.02)));
  const laneStep = (laneEnd - laneStart) / Math.min(laneSteps, maxLaneSteps);
  const widthStep = (widthEnd - widthStart) / Math.min(widthSteps, maxWidthSteps);

  for (let lv = laneStart; lv <= laneEnd + 1e-9; lv += laneStep) {
    for (let lu = widthStart; lu <= widthEnd + 1e-9; lu += widthStep) {
      if (rng.nextFloat() > cfg.occupancy) continue;
      const c = fromLocal(center, u, v, lu + (rng.nextFloat() - 0.5) * cfg.lotWidth * 0.18, lv);
      const rect = orientedRect(c, u, v, cfg.lotWidth * (0.78 + rng.nextFloat() * 0.18), cfg.lotDepth * (0.8 + rng.nextFloat() * 0.16));
      if (rect.every((pt) => isInside(pt, parcel))) out.push(rect);
    }
  }
}

function placePerimeterFormation(
  out: Point[][],
  parcel: Point[],
  center: Point,
  rng: PRNG,
  cfg: { inset: number; depth: number; step: number; occupancy: number },
): void {
  const ring = parcel.map((p) => ({
    x: center.x + (p.x - center.x) * cfg.inset,
    y: center.y + (p.y - center.y) * cfg.inset,
  }));
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    const ex = b.x - a.x;
    const ey = b.y - a.y;
    const len = Math.hypot(ex, ey);
    if (len < cfg.step * 0.8) continue;
    const ux = ex / len;
    const uy = ey / len;
    const vx = -uy;
    const vy = ux;
    const slots = Math.min(48, Math.max(1, Math.floor(len / cfg.step)));
    for (let s = 0; s < slots; s++) {
      if (rng.nextFloat() > cfg.occupancy) continue;
      const t = (s + 0.5) / slots;
      const cx = a.x + ex * t + vx * cfg.depth * 0.45;
      const cy = a.y + ey * t + vy * cfg.depth * 0.45;
      const w = Math.min(cfg.step * 0.82, len / slots * 0.82) * (0.85 + rng.nextFloat() * 0.2);
      const h = cfg.depth * (0.85 + rng.nextFloat() * 0.2);
      const rect = [
        { x: cx - ux * w * 0.5 - vx * h * 0.5, y: cy - uy * w * 0.5 - vy * h * 0.5 },
        { x: cx + ux * w * 0.5 - vx * h * 0.5, y: cy + uy * w * 0.5 - vy * h * 0.5 },
        { x: cx + ux * w * 0.5 + vx * h * 0.5, y: cy + uy * w * 0.5 + vy * h * 0.5 },
        { x: cx - ux * w * 0.5 + vx * h * 0.5, y: cy - uy * w * 0.5 + vy * h * 0.5 },
      ];
      if (rect.every((pt) => isInside(pt, parcel))) out.push(rect);
    }
  }
}

function dominantAxis(poly: Point[]): { u: Point; v: Point } {
  let bestI = 0;
  let bestLen = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const len = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
    if (len > bestLen) {
      bestLen = len;
      bestI = i;
    }
  }
  const a = poly[bestI];
  const b = poly[(bestI + 1) % poly.length];
  const l = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const u = { x: (b.x - a.x) / l, y: (b.y - a.y) / l };
  const v = { x: -u.y, y: u.x };
  return { u, v };
}

function localBounds(poly: Point[], c: Point, u: Point, v: Point): { minU: number; maxU: number; minV: number; maxV: number } {
  let minU = Infinity;
  let maxU = -Infinity;
  let minV = Infinity;
  let maxV = -Infinity;
  for (const p of poly) {
    const du = (p.x - c.x) * u.x + (p.y - c.y) * u.y;
    const dv = (p.x - c.x) * v.x + (p.y - c.y) * v.y;
    if (du < minU) minU = du;
    if (du > maxU) maxU = du;
    if (dv < minV) minV = dv;
    if (dv > maxV) maxV = dv;
  }
  return { minU, maxU, minV, maxV };
}

function fromLocal(c: Point, u: Point, v: Point, lu: number, lv: number): Point {
  return {
    x: c.x + u.x * lu + v.x * lv,
    y: c.y + u.y * lu + v.y * lv,
  };
}

function orientedRect(center: Point, u: Point, v: Point, width: number, depth: number): Point[] {
  const hw = width * 0.5;
  const hd = depth * 0.5;
  return [
    { x: center.x - u.x * hw - v.x * hd, y: center.y - u.y * hw - v.y * hd },
    { x: center.x + u.x * hw - v.x * hd, y: center.y + u.y * hw - v.y * hd },
    { x: center.x + u.x * hw + v.x * hd, y: center.y + u.y * hw + v.y * hd },
    { x: center.x - u.x * hw + v.x * hd, y: center.y - u.y * hw + v.y * hd },
  ];
}

function isInside(p: Point, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const intersect = ((yi > p.y) !== (yj > p.y)) && (p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Extract road segments from RoadGraph for frontage analysis.
 * Converts the graph's edges into simple start/end point pairs.
 */
function extractRoadSegments(roads: RoadGraph): RoadSegment[] {
  const segments: RoadSegment[] = [];
  for (const edge of roads.edges) {
    const u = roads.nodes.get(edge.u)?.point;
    const v = roads.nodes.get(edge.v)?.point;
    if (u && v) {
      segments.push({ start: u, end: v });
    }
  }
  return segments;
}




