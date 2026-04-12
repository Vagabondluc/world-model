// @ts-nocheck
import { Parcel } from '../parcels/subdivide';
import { DistrictAssignment } from '../districts/assign';
import { Point } from '../types';
import { PRNG } from '../seed/prng';
import { River, distanceToRiver } from '../terrain/river';
import { RoadGraph } from '../roads/graph';

export interface FarmField {
  polygon: Point[];
  hatchAngle: number;
  hatchSpacing: number;
}

/**
 * Generates farm polygons from rural parcels.
 */
export function generateFarms(
  parcels: Parcel[],
  assignments: DistrictAssignment[],
  hub: Point,
  river: River,
  rng: PRNG,
  boundary?: Point[],
  gates?: Point[],
  roads?: RoadGraph,
  options?: {
    enforceFarmBelt?: boolean;
  },
): FarmField[] {
  const enforceFarmBelt = options?.enforceFarmBelt ?? true;
  const farmAccessRadius = 0.24;
  const roadBuffer = 0.012;
  const rural = parcels.filter((p) => assignments.find((a) => a.parcelId === p.id)?.type === 'rural');
  const ruralByEgress = rural
    .map((p) => {
      const c = centroid(p.polygon);
      const dg = gates && gates.length ? Math.min(...gates.map((g) => Math.hypot(c.x - g.x, c.y - g.y))) : Infinity;
      const dr = roads ? nearestRoadDistance(c, roads) : Infinity;
      return { p, score: Math.min(dg, dr) };
    })
    .sort((a, b) => a.score - b.score);
  const forcedNear = new Set(
    ruralByEgress.slice(0, Math.max(1, Math.floor(ruralByEgress.length * 0.65))).map((x) => x.p.id),
  );
  const fields: FarmField[] = [];
  const acceptedPolygons: Point[][] = [];
  for (let index = 0; index < rural.length; index++) {
    const p = rural[index];
    const c = centroid(p.polygon);
    // Skip parcels inside the city wall (CRC-A6-121: Farms inside wall)
    if (boundary && boundary.length >= 3 && pointInPolygon(c, boundary)) {
      continue;
    }
    const dg = gates && gates.length ? Math.min(...gates.map((g) => Math.hypot(c.x - g.x, c.y - g.y))) : Infinity;
    const drRoad = roads ? nearestRoadDistance(c, roads) : Infinity;
    const nearEgress = dg < farmAccessRadius || drRoad < 0.06 || forcedNear.has(p.id);
    if (!nearEgress && rng.bernoulli(0.92)) continue;
    if (p.polygon.length < 3) continue;
    const parcelArea = polygonArea(p.polygon);
    if (parcelArea < 0.00012) continue;

    const dx = c.x - hub.x;
    const dy = c.y - hub.y;
    const radial = Math.atan2(dy, dx);
    // Voronoi parcel-shaped farmlands: inset parcel polygons, not thin strips.
    let hatchAngle = radial * (180 / Math.PI) + 90 + (rng.nextFloat() - 0.5) * 14;
    if (boundary && boundary.length >= 2) {
      const fit = nearestBoundaryFrame(c, boundary, hub);
      hatchAngle = Math.atan2(fit.tangent.y, fit.tangent.x) * (180 / Math.PI) + (rng.nextFloat() - 0.5) * 10;
    }
    const dr = distanceToRiver(c, river);
    const inset = dr < 0.03 ? 0.82 + rng.nextFloat() * 0.06 : 0.86 + rng.nextFloat() * 0.08;
    const polygon = insetPolygon(p.polygon, c, inset);
    if (polygonArea(polygon) < 0.00008) continue;
    const adjustedPolygon = nearEgress && gates && gates.length > 0
      ? shiftTowardNearestGate(polygon, gates)
      : polygon;
    // CRC-A6-121: Final check - ensure farm centroid is outside wall after all transformations
    // (inset and shiftTowardNearestGate can move a farm inside the wall)
    if (boundary && boundary.length >= 3) {
      const adjustedCentroid = centroid(adjustedPolygon);
      if (pointInPolygon(adjustedCentroid, boundary)) {
        continue;
      }
    }
    const adjustedCentroid = centroid(adjustedPolygon);
    if (
      enforceFarmBelt &&
      (
        (roads && polygonNearRoadBuffer(adjustedPolygon, roads, roadBuffer)) ||
        (gates && gates.length > 0 && nearestGateDistance(adjustedCentroid, gates) > farmAccessRadius)
      )
    ) {
      continue;
    }
    if (!overlapsAny(adjustedPolygon, acceptedPolygons)) {
      fields.push({
        polygon: adjustedPolygon,
        hatchAngle,
        hatchSpacing: 5 + (index % 3),
      });
      acceptedPolygons.push(adjustedPolygon);
    }

    // Occasional nested sub-field to break monotony while keeping parcel silhouette.
    if (rng.bernoulli(0.28)) {
      const inset2 = inset * (0.84 + rng.nextFloat() * 0.08);
      const poly2 = insetPolygon(polygon, centroid(polygon), inset2);
      if (polygonArea(poly2) < 0.00005) continue;
      const poly2Adj = nearEgress && gates && gates.length > 0
        ? shiftTowardNearestGate(poly2, gates)
        : poly2;
      // CRC-A6-121: Final check for nested sub-field - verify outside wall after transformations
      if (boundary && boundary.length >= 3) {
        const poly2Centroid = centroid(poly2Adj);
        if (pointInPolygon(poly2Centroid, boundary)) {
          continue;
        }
      }
      const poly2Centroid = centroid(poly2Adj);
      if (
        enforceFarmBelt &&
        (
          (roads && polygonNearRoadBuffer(poly2Adj, roads, roadBuffer)) ||
          (gates && gates.length > 0 && nearestGateDistance(poly2Centroid, gates) > farmAccessRadius)
        )
      ) {
        continue;
      }
      if (!overlapsAny(poly2Adj, acceptedPolygons)) {
        fields.push({
          polygon: poly2Adj,
          hatchAngle: hatchAngle + 8 + (rng.nextFloat() - 0.5) * 6,
          hatchSpacing: 5 + ((index + 1) % 3),
        });
        acceptedPolygons.push(poly2Adj);
      }
    }
  }
  return fields;
}

function nearestGateDistance(p: Point, gates: Point[]): number {
  let best = Infinity;
  for (const g of gates) {
    best = Math.min(best, Math.hypot(p.x - g.x, p.y - g.y));
  }
  return best;
}

function polygonNearRoadBuffer(poly: Point[], roads: RoadGraph, buffer: number): boolean {
  for (const p of poly) {
    if (nearestRoadDistance(p, roads) <= buffer) return true;
  }
  return false;
}

function overlapsAny(poly: Point[], accepted: Point[][]): boolean {
  for (const a of accepted) {
    if (polygonsIntersect(poly, a)) return true;
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
  if (pointInPolygon(a[0], b)) return true;
  if (pointInPolygon(b[0], a)) return true;
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

function nearestBoundaryFrame(point: Point, boundary: Point[], hub: Point): {
  tangent: Point;
  outward: Point;
} {
  let bestDist = Infinity;
  let bestA = boundary[0];
  let bestB = boundary[1];
  let bestQ = boundary[0];

  for (let i = 0; i < boundary.length; i++) {
    const a = boundary[i];
    const b = boundary[(i + 1) % boundary.length];
    const q = nearestPointOnSegment(point, a, b);
    const d2 = sqDist(point, q);
    if (d2 < bestDist) {
      bestDist = d2;
      bestA = a;
      bestB = b;
      bestQ = q;
    }
  }

  const ex = bestB.x - bestA.x;
  const ey = bestB.y - bestA.y;
  const len = Math.hypot(ex, ey) || 1;
  const tangent = { x: ex / len, y: ey / len };
  let normal = { x: -tangent.y, y: tangent.x };
  const toOutside = { x: bestQ.x - hub.x, y: bestQ.y - hub.y };
  if (normal.x * toOutside.x + normal.y * toOutside.y < 0) {
    normal = { x: -normal.x, y: -normal.y };
  }
  return { tangent, outward: normal };
}

function nearestPointOnSegment(p: Point, a: Point, b: Point): Point {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const ab2 = abx * abx + aby * aby || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / ab2));
  return { x: a.x + abx * t, y: a.y + aby * t };
}

function sqDist(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
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

function insetPolygon(poly: Point[], c: Point, t: number): Point[] {
  return poly.map((p) => ({
    x: c.x + (p.x - c.x) * t,
    y: c.y + (p.y - c.y) * t,
  }));
}

function polygonArea(poly: Point[]): number {
  if (poly.length < 3) return 0;
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length;
    a += poly[i].x * poly[j].y - poly[j].x * poly[i].y;
  }
  return Math.abs(a) * 0.5;
}

function nearestRoadDistance(p: Point, roads: RoadGraph): number {
  let best = Infinity;
  for (const e of roads.edges) {
    const u = roads.nodes.get(e.u)?.point;
    const v = roads.nodes.get(e.v)?.point;
    if (!u || !v) continue;
    best = Math.min(best, pointToSegmentDistance(p, u, v));
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

function shiftTowardNearestGate(poly: Point[], gates: Point[]): Point[] {
  const c = centroid(poly);
  let best = gates[0];
  let bestD = (best.x - c.x) ** 2 + (best.y - c.y) ** 2;
  for (let i = 1; i < gates.length; i++) {
    const d = (gates[i].x - c.x) ** 2 + (gates[i].y - c.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = gates[i];
    }
  }
  const dx = best.x - c.x;
  const dy = best.y - c.y;
  const shift = Math.min(0.18, Math.hypot(dx, dy) * 0.5);
  const m = Math.hypot(dx, dy) || 1;
  const ux = dx / m;
  const uy = dy / m;
  return poly.map((p) => ({
    x: clamp01(p.x + ux * shift),
    y: clamp01(p.y + uy * shift),
  }));
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}
