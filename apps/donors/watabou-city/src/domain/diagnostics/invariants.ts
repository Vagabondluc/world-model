// @ts-nocheck
import { DistrictAssignment } from '../districts/assign';
import { Parcel } from '../parcels/subdivide';
import { RoadGraph } from '../roads/graph';
import { Point } from '../types';
import { Building } from '../buildings/synthesize';

export interface InvariantReport {
  all_pass: boolean;
  failed: string[];
}

export function evaluateHardInvariants(input: {
  boundary: Point[];
  gates: Point[];
  roads: RoadGraph;
  parcels: Parcel[];
  assignments: DistrictAssignment[];
  buildings: Building[];
}): InvariantReport {
  const failed: string[] = [];

  if (!allDistrictPolygonsValid(input.parcels, input.assignments)) {
    failed.push('district_polygons_valid');
  }
  if (!allParcelsWithinBoundary(input.parcels, input.boundary)) {
    failed.push('parcels_within_boundary');
  }
  if (!allBuildingsWithinOneParcel(input.buildings, input.parcels)) {
    failed.push('buildings_within_single_parcel');
  }
  if (!allRoadEndpointsFinite(input.roads)) {
    failed.push('road_endpoints_finite');
  }
  if (!gatePathReachesEachDistrictCentroid(input.gates, input.roads, input.parcels, input.assignments)) {
    failed.push('gate_path_reaches_each_district_centroid');
  }

  return {
    all_pass: failed.length === 0,
    failed,
  };
}

function allDistrictPolygonsValid(parcels: Parcel[], assignments: DistrictAssignment[]): boolean {
  const assigned = new Set(assignments.map((a) => a.parcelId));
  for (const p of parcels) {
    if (!assigned.has(p.id)) continue;
    if (!isSimplePolygon(p.polygon)) return false;
  }
  return true;
}

function allParcelsWithinBoundary(parcels: Parcel[], boundary: Point[]): boolean {
  if (boundary.length < 3) return false;
  return parcels.every((p) => p.polygon.every((pt) => pointInPolygon(pt, boundary)));
}

function allBuildingsWithinOneParcel(buildings: Building[], parcels: Parcel[]): boolean {
  if (parcels.length === 0) return buildings.length === 0;
  for (const b of buildings) {
    let containing = 0;
    for (const p of parcels) {
      if (!b.polygon.every((pt) => pointInPolygon(pt, p.polygon))) continue;
      containing++;
      if (containing > 1) return false;
    }
    if (containing !== 1) return false;
  }
  return true;
}

function allRoadEndpointsFinite(roads: RoadGraph): boolean {
  for (const edge of roads.edges) {
    const u = roads.nodes.get(edge.u)?.point;
    const v = roads.nodes.get(edge.v)?.point;
    if (!u || !v) return false;
    if (!isFinitePoint(u) || !isFinitePoint(v)) return false;
  }
  return true;
}

function gatePathReachesEachDistrictCentroid(
  gates: Point[],
  roads: RoadGraph,
  parcels: Parcel[],
  assignments: DistrictAssignment[],
): boolean {
  const districtCentroids = districtTypeCentroids(parcels, assignments);
  if (districtCentroids.length === 0) return true;
  if (roads.nodes.size === 0 || gates.length === 0) return false;

  const gateNodeIds = gates
    .map((gate) => nearestNodeId(roads, gate))
    .filter((id): id is string => Boolean(id));
  if (gateNodeIds.length === 0) return false;

  const reachable = bfsFromMany(roads, gateNodeIds);
  for (const centroid of districtCentroids) {
    const districtNode = nearestNodeId(roads, centroid);
    if (!districtNode || !reachable.has(districtNode)) return false;
  }
  return true;
}

function districtTypeCentroids(parcels: Parcel[], assignments: DistrictAssignment[]): Point[] {
  const byType = new Map<string, Point[]>();
  const parcelById = new Map(parcels.map((p) => [p.id, p]));
  for (const a of assignments) {
    const parcel = parcelById.get(a.parcelId);
    if (!parcel || parcel.polygon.length < 3) continue;
    const c = polygonCentroid(parcel.polygon);
    const list = byType.get(a.type) ?? [];
    list.push(c);
    byType.set(a.type, list);
  }
  const centroids: Point[] = [];
  for (const pts of byType.values()) {
    let x = 0;
    let y = 0;
    for (const p of pts) {
      x += p.x;
      y += p.y;
    }
    centroids.push({ x: x / pts.length, y: y / pts.length });
  }
  return centroids;
}

function bfsFromMany(roads: RoadGraph, starts: string[]): Set<string> {
  const seen = new Set<string>();
  const q: string[] = [];
  for (const s of starts) {
    if (seen.has(s)) continue;
    seen.add(s);
    q.push(s);
  }
  while (q.length) {
    const u = q.shift()!;
    for (const v of roads.getNeighbors(u)) {
      if (seen.has(v)) continue;
      seen.add(v);
      q.push(v);
    }
  }
  return seen;
}

function nearestNodeId(roads: RoadGraph, target: Point): string | null {
  let bestId: string | null = null;
  let bestD = Infinity;
  for (const node of roads.nodes.values()) {
    const d = sqDist(node.point, target);
    if (d < bestD) {
      bestD = d;
      bestId = node.id;
    }
  }
  return bestId;
}

function sqDist(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function isFinitePoint(p: Point): boolean {
  return Number.isFinite(p.x) && Number.isFinite(p.y);
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

function isSimplePolygon(poly: Point[]): boolean {
  if (poly.length < 3) return false;
  for (let i = 0; i < poly.length; i++) {
    if (!isFinitePoint(poly[i])) return false;
    const a1 = poly[i];
    const a2 = poly[(i + 1) % poly.length];
    for (let j = i + 1; j < poly.length; j++) {
      if (Math.abs(i - j) <= 1) continue;
      if (i === 0 && j === poly.length - 1) continue;
      const b1 = poly[j];
      const b2 = poly[(j + 1) % poly.length];
      if (segmentsIntersect(a1, a2, b1, b2)) return false;
    }
  }
  return true;
}

function pointInPolygon(p: Point, poly: Point[]): boolean {
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
