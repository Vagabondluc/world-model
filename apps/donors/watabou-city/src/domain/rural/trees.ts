// @ts-nocheck
import { Parcel } from '../parcels/subdivide';
import { DistrictAssignment } from '../districts/assign';
import { Point, dist, isPointInPolygon } from '../types';
import { PRNG } from '../seed/prng';
import { RoadGraph } from '../roads/graph';
import { River, distanceToRiver } from '../terrain/river';

/**
 * Places trees in rural and park areas.
 */
export function placeTrees(
  parcels: Parcel[],
  assignments: DistrictAssignment[],
  roads: RoadGraph,
  hub: Point,
  rng: PRNG,
  river?: River,
  boundary?: Point[],
): Point[] {
  const trees: Point[] = [];
  const assignmentMap = new Map(assignments.map((a) => [a.parcelId, a.type]));
  const roadPoints = Array.from(roads.nodes.values()).map((n) => n.point);
  
  parcels.forEach(p => {
    const type = assignmentMap.get(p.id);
    if (!type) return;
    const center = centroid(p.polygon);
    const dHub = dist(center, hub);

    let clusterCount = 0;
    let perCluster = 0;
    if (type === 'rural' && dHub > 0.3) {
      clusterCount = 1 + rng.nextInt(0, 2);
      perCluster = 8 + rng.nextInt(0, 6);
    } else if (type === 'park' && dHub > 0.18) {
      clusterCount = 1 + rng.nextInt(0, 1);
      perCluster = 6 + rng.nextInt(0, 5);
    } else if (type === 'park' && dHub > 0.12) {
      clusterCount = 1;
      perCluster = 4 + rng.nextInt(0, 4);
    } else if (type === 'residential' && dHub > 0.34) {
      clusterCount = 1;
      perCluster = 3 + rng.nextInt(0, 3);
    } else {
      clusterCount = 0;
      perCluster = 0;
    }
    if (clusterCount === 0) return;

    const box = getBoundingBox(p.polygon);
    if (!box) return;
    const nearRoad = nearestRoadPoint(center, roadPoints) ?? center;
    const outward = normalize({ x: center.x - hub.x, y: center.y - hub.y });
    const clusterBase = type === 'rural'
      ? {
          x: center.x * 0.58 + nearRoad.x * 0.28 + outward.x * 0.14,
          y: center.y * 0.58 + nearRoad.y * 0.28 + outward.y * 0.14,
        }
      : center;

    for (let cIdx = 0; cIdx < clusterCount; cIdx++) {
      const centerJitter = {
        x: clusterBase.x + (rng.nextFloat() - 0.5) * (box.maxX - box.minX) * 0.22,
        y: clusterBase.y + (rng.nextFloat() - 0.5) * (box.maxY - box.minY) * 0.22,
      };
      const spread = (type === 'rural' ? 0.08 : 0.06) * Math.min(1, Math.max(0.35, (box.maxX - box.minX + box.maxY - box.minY)));
      for (let i = 0; i < perCluster; i++) {
        let placed = false;
        for (let tries = 0; tries < 22 && !placed; tries++) {
          const angle = rng.nextFloat() * Math.PI * 2;
          const radius = spread * Math.sqrt(rng.nextFloat());
          const candidate = {
            x: centerJitter.x + Math.cos(angle) * radius,
            y: centerJitter.y + Math.sin(angle) * radius,
          };
          if (type === 'rural' && dist(candidate, hub) < 0.28) continue;
          if (river && distanceToRiver(candidate, river) < 0.022) continue;
          if (boundary && pointToBoundaryDistance(candidate, boundary) < 0.016) continue;
          if (isPointInPolygon(candidate, p.polygon)) {
            trees.push(candidate);
            placed = true;
          }
        }
      }
    }
  });

  return trees;
}

function pointToBoundaryDistance(p: Point, boundary: Point[]): number {
  if (boundary.length < 2) return Infinity;
  let best = Infinity;
  for (let i = 0; i < boundary.length; i++) {
    const a = boundary[i];
    const b = boundary[(i + 1) % boundary.length];
    best = Math.min(best, pointToSegmentDistance(p, a, b));
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

function centroid(poly: Point[]): Point {
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p.x;
    y += p.y;
  }
  return { x: x / poly.length, y: y / poly.length };
}

function nearestRoadPoint(p: Point, roadPoints: Point[]): Point | null {
  let best: Point | null = null;
  let bestDist = Infinity;
  for (const rp of roadPoints) {
    const d = dist(p, rp);
    if (d < bestDist) {
      bestDist = d;
      best = rp;
    }
  }
  return best;
}

function normalize(v: Point): Point {
  const m = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / m, y: v.y / m };
}

function getBoundingBox(poly: Point[]): { minX: number; minY: number; maxX: number; maxY: number } | null {
  if (poly.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of poly) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { minX, minY, maxX, maxY };
}
