// @ts-nocheck
import { DistrictAssignment } from '../districts/assign';
import { Parcel } from '../parcels/subdivide';
import { Poi } from '../pois/place';
import { RoadGraph, RoadKind } from '../roads/graph';
import { PRNG } from '../seed/prng';
import { River } from '../terrain/river';
import { Point } from '../types';

export interface LandmarkStructure {
  id: string;
  poiId: number;
  parcelId: string;
  kind: 'fortress' | 'landmark';
  polygon: Point[];
}

export interface BridgeStructure {
  id: string;
  point: Point;
  angle: number;
  kind: RoadKind;
  roadEdgeId: string;
  riverSegmentIndex: number;
}

export interface ParkFeature {
  id: string;
  parcelId: string;
  featureType: 'green' | 'plaza' | 'path' | 'node' | 'quay';
  polygon: Point[];
}

export interface PrimaryPlazaFeature {
  feature: ParkFeature;
  center: Point;
  radius: number;
}

export interface GateOpening {
  id: string;
  center: Point;
  width: number;
  openingPolygon: Point[];
  flankingTowerIndices: [number, number];
}

export function generateLandmarks(pois: Poi[], parcels: Parcel[]): LandmarkStructure[] {
  const landmarks: LandmarkStructure[] = [];
  const fortressPoi = pois.find((p) => p.id === 1);
  if (!fortressPoi) return landmarks;
  const parcel = parcelContainingPoint(parcels, fortressPoi.point) ?? nearestParcel(parcels, fortressPoi.point);
  if (!parcel) return landmarks;
  const bailey = insetPolygon(parcel.polygon, 0.7);
  const keep = insetPolygon(parcel.polygon, 0.5);
  if (bailey.length >= 3 && area(bailey) > 0.00003) {
    landmarks.push({
      id: 'lm-fortress-bailey',
      poiId: 1,
      parcelId: parcel.id,
      kind: 'fortress',
      polygon: bailey,
    });
  }
  if (keep.length >= 3 && area(keep) > 0.00002) {
    landmarks.push({
      id: 'lm-fortress-keep',
      poiId: 1,
      parcelId: parcel.id,
      kind: 'fortress',
      polygon: keep,
    });
  }
  for (const t of cornerTowers(keep, centroid(keep), 0.18)) {
    if (t.length < 3 || area(t) < 0.000004) continue;
    landmarks.push({
      id: `lm-fortress-tower-${landmarks.length}`,
      poiId: 1,
      parcelId: parcel.id,
      kind: 'fortress',
      polygon: t,
    });
  }
  return landmarks;
}

export function generateParkFeatures(
  parcels: Parcel[],
  assignments: DistrictAssignment[],
  rng: PRNG,
): ParkFeature[] {
  const byParcel = new Map(assignments.map((a) => [a.parcelId, a.type]));
  const features: ParkFeature[] = [];
  for (const parcel of parcels) {
    if (byParcel.get(parcel.id) !== 'park') continue;
    const c = centroid(parcel.polygon);
    const green = insetPolygon(parcel.polygon, 0.78 + rng.nextFloat() * 0.1);
    if (green.length >= 3 && area(green) > 0.00001) {
      features.push({
        id: `pf-green-${parcel.id}`,
        parcelId: parcel.id,
        featureType: 'green',
        polygon: green,
      });
    }
    const plaza = regularPolygon(c, 6 + rng.nextInt(0, 3), 0.012 + rng.nextFloat() * 0.006);
    if (plaza.every((p) => isInside(p, parcel.polygon))) {
      features.push({
        id: `pf-plaza-${parcel.id}`,
        parcelId: parcel.id,
        featureType: 'plaza',
        polygon: plaza,
      });
    }
    const path = pathBand(c, 0.028 + rng.nextFloat() * 0.015, 0.0045 + rng.nextFloat() * 0.0025, rng.nextFloat() * Math.PI);
    if (path.every((p) => isInside(p, parcel.polygon))) {
      features.push({
        id: `pf-path-${parcel.id}`,
        parcelId: parcel.id,
        featureType: 'path',
        polygon: path,
      });
    }
  }
  return features;
}

export function generatePrimaryPlazaFeature(
  boundary: Point[],
  hub: Point,
  roads: RoadGraph,
): PrimaryPlazaFeature | null {
  if (boundary.length < 3) return null;
  const center = nearestMajorRoadPoint(roads, hub) ?? hub;
  if (!isInside(center, boundary)) return null;

  const majorRoadDensity = majorRoadCountNearPoint(roads, center, 0.12);
  const radius = majorRoadDensity >= 3 ? 0.025 : 0.02;
  const polygon = regularPolygon(center, 10, radius);
  if (!polygon.every((p) => isInside(p, boundary))) return null;

  return {
    feature: {
      id: 'pf-primary-plaza',
      parcelId: 'city-center',
      featureType: 'plaza',
      polygon: clampPolygonToDomain(polygon),
    },
    center,
    radius,
  };
}

export function generateGateOpenings(boundary: Point[], gates: Point[], width = 0.018): GateOpening[] {
  if (boundary.length < 3 || gates.length === 0) return [];
  const out: GateOpening[] = [];
  for (let i = 0; i < gates.length; i++) {
    const center = gates[i];
    const idx = nearestBoundaryIndex(boundary, center);
    const prev = boundary[(idx - 1 + boundary.length) % boundary.length];
    const next = boundary[(idx + 1) % boundary.length];
    const tx = next.x - prev.x;
    const ty = next.y - prev.y;
    const tl = Math.hypot(tx, ty) || 1;
    const ux = tx / tl;
    const uy = ty / tl;
    const nx = -uy;
    const ny = ux;
    const halfW = width * 0.5;
    const halfD = Math.max(0.004, width * 0.35);
    const openingPolygon: Point[] = [
      { x: center.x - ux * halfW - nx * halfD, y: center.y - uy * halfW - ny * halfD },
      { x: center.x + ux * halfW - nx * halfD, y: center.y + uy * halfW - ny * halfD },
      { x: center.x + ux * halfW + nx * halfD, y: center.y + uy * halfW + ny * halfD },
      { x: center.x - ux * halfW + nx * halfD, y: center.y - uy * halfW + ny * halfD },
    ];
    out.push({
      id: `gate-opening-${i}`,
      center,
      width,
      openingPolygon: clampPolygonToDomain(openingPolygon),
      flankingTowerIndices: [(idx - 1 + boundary.length) % boundary.length, (idx + 1) % boundary.length],
    });
  }
  return out;
}

export function generateGatewayAndBridgeheadFeatures(
  boundary: Point[],
  gates: Point[],
  bridges: BridgeStructure[],
  roads: RoadGraph,
): ParkFeature[] {
  const features: ParkFeature[] = [];
  const nodeRadiusGate = 0.013;
  const nodeRadiusBridge = 0.0105;

  for (let i = 0; i < gates.length; i++) {
    const g = gates[i];
    if (!hasNearbyRoadOfKind(roads, g, 0.05, ['trunk', 'secondary'])) continue;
    const poly = regularPolygon(g, 8, nodeRadiusGate);
    features.push({
      id: `pf-gate-node-${i}`,
      parcelId: `node-gate-${i}`,
      featureType: 'node',
      polygon: clampPolygonToDomain(poly),
    });
  }

  for (let i = 0; i < bridges.length; i++) {
    const b = bridges[i];
    const edge = roads.edges.find((e) => e.id === b.roadEdgeId);
    if (!edge) continue;
    const nx = Math.cos(b.angle);
    const ny = Math.sin(b.angle);
    const offset = 0.02;
    const p1 = { x: b.point.x + nx * offset, y: b.point.y + ny * offset };
    const p2 = { x: b.point.x - nx * offset, y: b.point.y - ny * offset };
    const polyA = regularPolygon(p1, 8, nodeRadiusBridge);
    const polyB = regularPolygon(p2, 8, nodeRadiusBridge);
    if (isInside(p1, boundary)) {
      features.push({
        id: `pf-bridgehead-${i}-a`,
        parcelId: `node-bridge-${i}-a`,
        featureType: 'node',
        polygon: clampPolygonToDomain(polyA),
      });
    }
    if (isInside(p2, boundary)) {
      features.push({
        id: `pf-bridgehead-${i}-b`,
        parcelId: `node-bridge-${i}-b`,
        featureType: 'node',
        polygon: clampPolygonToDomain(polyB),
      });
    }
  }

  return features;
}

export function generateQuayFeatures(boundary: Point[], river: River, roads: RoadGraph): ParkFeature[] {
  const features: ParkFeature[] = [];
  if (river.points.length < 2) return features;
  let added = 0;
  const maxQuays = 10;

  for (let i = 0; i < river.points.length - 1; i++) {
    if (added >= maxQuays) break;
    const a = river.points[i];
    const b = river.points[i + 1];
    const segLen = Math.hypot(b.x - a.x, b.y - a.y);
    if (segLen < 0.04) continue;
    const m = { x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 };
    if (!isInside(m, boundary)) continue;
    if (!hasNearbyRoadOfKind(roads, m, 0.07, ['trunk', 'secondary'])) continue;

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const halfLen = Math.min(0.03, segLen * 0.45);
    const halfW = 0.0065;
    const ux = dx / len;
    const uy = dy / len;
    const center = { x: m.x + nx * 0.01, y: m.y + ny * 0.01 };
    const poly = [
      { x: center.x - ux * halfLen - nx * halfW, y: center.y - uy * halfLen - ny * halfW },
      { x: center.x + ux * halfLen - nx * halfW, y: center.y + uy * halfLen - ny * halfW },
      { x: center.x + ux * halfLen + nx * halfW, y: center.y + uy * halfLen + ny * halfW },
      { x: center.x - ux * halfLen + nx * halfW, y: center.y - uy * halfLen + ny * halfW },
    ];
    features.push({
      id: `pf-quay-${i}`,
      parcelId: `quay-${i}`,
      featureType: 'quay',
      polygon: clampPolygonToDomain(poly),
    });
    added++;
  }

  return features;
}

export function generateBridgeStructures(roads: RoadGraph, river: River): BridgeStructure[] {
  if (river.points.length < 2) return [];
  const degree = new Map<string, number>();
  for (const edge of roads.edges) {
    degree.set(edge.u, (degree.get(edge.u) ?? 0) + 1);
    degree.set(edge.v, (degree.get(edge.v) ?? 0) + 1);
  }

  const riverArc = cumulativeArc(river.points);
  const candidates: Array<BridgeStructure & { score: number; riverDistance: number }> = [];
  for (const edge of roads.edges) {
    // Bridge endpoints must tie into collector+ streets.
    if (edge.kind === 'local') continue;
    const a = roads.nodes.get(edge.u)?.point;
    const b = roads.nodes.get(edge.v)?.point;
    if (!a || !b) continue;
    const endpointDegree = Math.max(degree.get(edge.u) ?? 0, degree.get(edge.v) ?? 0);
    if (endpointDegree < 2) continue;
    for (let i = 0; i < river.points.length - 1; i++) {
      const c = river.points[i];
      const d = river.points[i + 1];
      const hit = segmentIntersection(a, b, c, d);
      if (!hit) continue;
      const segLen = Math.hypot(d.x - c.x, d.y - c.y) || 1;
      const t = Math.max(0, Math.min(1, Math.hypot(hit.x - c.x, hit.y - c.y) / segLen));
      const riverDistance = riverArc[i] + segLen * t;
      const kindScore = edge.kind === 'trunk' ? 3 : 2;
      const score = kindScore * 10 + endpointDegree;
      candidates.push({
        id: `cand-${candidates.length}`,
        point: hit,
        angle: perpendicularBridgeAngle(c, d),
        kind: edge.kind,
        roadEdgeId: edge.id,
        riverSegmentIndex: i,
        score,
        riverDistance,
      });
      break;
    }
  }

  candidates.sort((lhs, rhs) => rhs.score - lhs.score);
  const out: BridgeStructure[] = [];
  const selectedRiverArc: number[] = [];
  const maxBridges = Math.min(2, Math.max(1, Math.floor(candidates.length * 0.5)));
  const minBridgeSpacingAlongRiver = 0.14;
  for (const candidate of candidates) {
    if (out.length >= maxBridges) break;
    if (out.some((b) => sqDist(b.point, candidate.point) < 0.00008)) continue;
    const tooCloseAlongRiver = selectedRiverArc.some((d) => Math.abs(d - candidate.riverDistance) < minBridgeSpacingAlongRiver);
    if (tooCloseAlongRiver) continue;
    out.push({
      id: `br-${out.length}`,
      point: candidate.point,
      angle: candidate.angle,
      kind: candidate.kind,
      roadEdgeId: candidate.roadEdgeId,
      riverSegmentIndex: candidate.riverSegmentIndex,
    });
    selectedRiverArc.push(candidate.riverDistance);
  }
  return out;
}

export function countRoadRiverIntersections(roads: RoadGraph, river: River): number {
  if (river.points.length < 2) return 0;
  let total = 0;
  for (const edge of roads.edges) {
    const a = roads.nodes.get(edge.u)?.point;
    const b = roads.nodes.get(edge.v)?.point;
    if (!a || !b) continue;
    for (let i = 0; i < river.points.length - 1; i++) {
      const c = river.points[i];
      const d = river.points[i + 1];
      const hit = segmentIntersection(a, b, c, d);
      if (!hit) continue;
      total++;
      break;
    }
  }
  return total;
}

export function isRiverTopologyValid(river: River): boolean {
  if (river.points.length < 2) return false;
  if (!Number.isFinite(river.width) || river.width <= 0) return false;
  for (const p of river.points) {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return false;
  }
  return true;
}

function parcelContainingPoint(parcels: Parcel[], p: Point): Parcel | null {
  for (const parcel of parcels) {
    if (isInside(p, parcel.polygon)) return parcel;
  }
  return null;
}

function nearestParcel(parcels: Parcel[], p: Point): Parcel | null {
  if (parcels.length === 0) return null;
  let best = parcels[0];
  let bestD = sqDist(centroid(best.polygon), p);
  for (let i = 1; i < parcels.length; i++) {
    const d = sqDist(centroid(parcels[i].polygon), p);
    if (d < bestD) {
      best = parcels[i];
      bestD = d;
    }
  }
  return best;
}

function nearestBoundaryIndex(boundary: Point[], p: Point): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < boundary.length; i++) {
    const d = sqDist(boundary[i], p);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

function segmentIntersection(a: Point, b: Point, c: Point, d: Point): Point | null {
  const r = { x: b.x - a.x, y: b.y - a.y };
  const s = { x: d.x - c.x, y: d.y - c.y };
  const den = cross(r, s);
  if (Math.abs(den) < 1e-12) return null;
  const qp = { x: c.x - a.x, y: c.y - a.y };
  const t = cross(qp, s) / den;
  const u = cross(qp, r) / den;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: a.x + r.x * t, y: a.y + r.y * t };
}

function cross(u: Point, v: Point): number {
  return u.x * v.y - u.y * v.x;
}

function regularPolygon(c: Point, sides: number, r: number): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < sides; i++) {
    const t = (i / sides) * Math.PI * 2;
    out.push({ x: c.x + Math.cos(t) * r, y: c.y + Math.sin(t) * r });
  }
  return out;
}

function pathBand(center: Point, len: number, width: number, angle: number): Point[] {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const vx = -uy;
  const vy = ux;
  const hl = len * 0.5;
  const hw = width * 0.5;
  return [
    { x: center.x - ux * hl - vx * hw, y: center.y - uy * hl - vy * hw },
    { x: center.x + ux * hl - vx * hw, y: center.y + uy * hl - vy * hw },
    { x: center.x + ux * hl + vx * hw, y: center.y + uy * hl + vy * hw },
    { x: center.x - ux * hl + vx * hw, y: center.y - uy * hl + vy * hw },
  ];
}

function insetPolygon(poly: Point[], scale: number): Point[] {
  const c = centroid(poly);
  return poly.map((p) => ({
    x: c.x + (p.x - c.x) * scale,
    y: c.y + (p.y - c.y) * scale,
  }));
}

function centroid(poly: Point[]): Point {
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p.x;
    y += p.y;
  }
  return { x: x / poly.length, y: y / poly.length };
}

function cornerTowers(poly: Point[], c: Point, scale: number): Point[][] {
  const out: Point[][] = [];
  for (const p of poly) {
    const q = {
      x: c.x + (p.x - c.x) * (1 + scale),
      y: c.y + (p.y - c.y) * (1 + scale),
    };
    out.push(regularPolygon(q, 4, 0.007));
  }
  return out;
}

function area(poly: Point[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length;
    a += poly[i].x * poly[j].y - poly[j].x * poly[i].y;
  }
  return Math.abs(a) * 0.5;
}

function sqDist(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function hasNearbyRoadOfKind(
  roads: RoadGraph,
  p: Point,
  maxD: number,
  kinds: RoadKind[],
): boolean {
  const allow = new Set(kinds);
  for (const e of roads.edges) {
    if (!allow.has(e.kind)) continue;
    const u = roads.nodes.get(e.u)?.point;
    const v = roads.nodes.get(e.v)?.point;
    if (!u || !v) continue;
    if (pointToSegmentDistance(p, u, v) <= maxD) return true;
  }
  return false;
}

function majorRoadCountNearPoint(roads: RoadGraph, p: Point, maxD: number): number {
  let count = 0;
  for (const e of roads.edges) {
    if (e.kind !== 'trunk' && e.kind !== 'secondary') continue;
    const u = roads.nodes.get(e.u)?.point;
    const v = roads.nodes.get(e.v)?.point;
    if (!u || !v) continue;
    if (pointToSegmentDistance(p, u, v) <= maxD) count++;
  }
  return count;
}

function nearestMajorRoadPoint(roads: RoadGraph, p: Point): Point | null {
  let best: Point | null = null;
  let bestD = Infinity;
  for (const e of roads.edges) {
    if (e.kind !== 'trunk' && e.kind !== 'secondary') continue;
    const u = roads.nodes.get(e.u)?.point;
    const v = roads.nodes.get(e.v)?.point;
    if (!u || !v) continue;
    const q = projectPointToSegment(p, u, v);
    const d2 = sqDist(q, p);
    if (d2 < bestD) {
      bestD = d2;
      best = q;
    }
  }
  return best;
}

function pointToSegmentDistance(p: Point, a: Point, b: Point): number {
  const q = projectPointToSegment(p, a, b);
  return Math.hypot(p.x - q.x, p.y - q.y);
}

function projectPointToSegment(p: Point, a: Point, b: Point): Point {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const ab2 = abx * abx + aby * aby || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / ab2));
  return { x: a.x + abx * t, y: a.y + aby * t };
}

function clampPolygonToDomain(poly: Point[]): Point[] {
  return poly.map((p) => ({
    x: Math.max(0, Math.min(1, p.x)),
    y: Math.max(0, Math.min(1, p.y)),
  }));
}

function cumulativeArc(points: Point[]): number[] {
  const out: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    out.push(out[i - 1] + Math.hypot(a.x - b.x, a.y - b.y));
  }
  return out;
}

function perpendicularBridgeAngle(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const tx = dx / len;
  const ty = dy / len;
  return Math.atan2(ty, tx) + Math.PI * 0.5;
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
