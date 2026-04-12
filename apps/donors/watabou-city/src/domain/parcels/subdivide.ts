// @ts-nocheck
import { Delaunay } from 'd3-delaunay';
import { Point, isPointInPolygon } from '../types';
import { Block } from '../blocks/partition';
import { PRNG } from '../seed/prng';
import { ClearZoneCalculator, Wall } from '../boundary/clearZoneCalculator';

export interface Parcel {
  id: string;
  polygon: Point[];
  blockId: string;
}

/**
 * Subdivides blocks into parcels.
 */
export function subdivideBlocks(blocks: Block[], rng: PRNG, walls?: Wall[], clearWidth?: number): Parcel[] {
  const parcels: Parcel[] = [];
  
  // Initialize clear zone calculator if walls are provided
  const clearZoneCalculator = walls ? new ClearZoneCalculator(clearWidth) : null;
  if (clearZoneCalculator && walls) {
    clearZoneCalculator.computeClearZones(walls, clearWidth);
  }

  for (const block of blocks) {
    if (block.polygon.length < 3) continue;

    const bbox = getBoundingBox(block.polygon);
    const area = polygonArea(block.polygon);
    if (area < 0.00012) continue;

    const targetLots = Math.max(3, Math.min(32, Math.floor(area * 1200)));
    const sites = sampleSitesInside(block.polygon, bbox, targetLots, rng, clearZoneCalculator || undefined);
    if (sites.length < 2) {
      parcels.push({
        id: `p-${parcels.length}`,
        polygon: block.polygon,
        blockId: block.id,
      });
      continue;
    }

    const delaunay = Delaunay.from(sites.map((s) => [s.x, s.y] as [number, number]));
    const voronoi = delaunay.voronoi([bbox.minX, bbox.minY, bbox.maxX, bbox.maxY]);

    let addedForBlock = 0;
    for (let i = 0; i < sites.length; i++) {
      const cell = voronoi.cellPolygon(i);
      if (!cell || cell.length < 3) continue;
      const clipped = clipPolygonToConvex(
        cell.map(([x, y]) => ({ x, y })),
        block.polygon,
      );
      if (clipped.length < 3 || polygonArea(clipped) < 0.000015) continue;
      
      // Check if parcel intersects with clear zone
      if (clearZoneCalculator && clearZoneCalculator.doesPolygonIntersectClearZone(clipped)) continue;
      parcels.push({
        id: `p-${parcels.length}`,
        polygon: clipped,
        blockId: block.id,
      });
      addedForBlock++;
    }

    if (addedForBlock === 0) {
      parcels.push({
        id: `p-${parcels.length}`,
        polygon: block.polygon,
        blockId: block.id,
      });
    }
  }

  return parcels;
}

function getBoundingBox(poly: Point[]): { minX: number; minY: number; maxX: number; maxY: number } {
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

function polygonArea(poly: Point[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length;
    a += poly[i].x * poly[j].y - poly[j].x * poly[i].y;
  }
  return Math.abs(a) * 0.5;
}

function sampleSitesInside(
  polygon: Point[],
  bbox: { minX: number; minY: number; maxX: number; maxY: number },
  target: number,
  rng: PRNG,
  clearZoneCalculator?: ClearZoneCalculator,
): Point[] {
  const sites: Point[] = [];
  const maxAttempts = target * 50;
  for (let i = 0; i < maxAttempts && sites.length < target; i++) {
    const p = {
      x: bbox.minX + rng.nextFloat() * (bbox.maxX - bbox.minX),
      y: bbox.minY + rng.nextFloat() * (bbox.maxY - bbox.minY),
    };
    if (!isPointInPolygon(p, polygon)) continue;
    if (sites.some((s) => sqDist(s, p) < 0.00003)) continue;
    
    // Check if point is in clear zone
    if (clearZoneCalculator && clearZoneCalculator.isPointInClearZone(p)) continue;
    
    sites.push(p);
  }
  return sites;
}

function clipPolygonToConvex(subject: Point[], clip: Point[]): Point[] {
  if (subject.length < 3 || clip.length < 3) return [];
  let output = subject.slice();
  const ccw = signedArea(clip) >= 0;

  for (let i = 0; i < clip.length; i++) {
    const a = clip[i];
    const b = clip[(i + 1) % clip.length];
    const input = output.slice();
    output = [];
    if (input.length === 0) break;

    let s = input[input.length - 1];
    for (const e of input) {
      const eInside = isInsideHalfPlane(e, a, b, ccw);
      const sInside = isInsideHalfPlane(s, a, b, ccw);
      if (eInside) {
        if (!sInside) output.push(intersectionPoint(s, e, a, b));
        output.push(e);
      } else if (sInside) {
        output.push(intersectionPoint(s, e, a, b));
      }
      s = e;
    }
  }
  return dedupeAdjacent(output);
}

function isInsideHalfPlane(p: Point, a: Point, b: Point, ccw: boolean): boolean {
  const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
  return ccw ? cross >= -1e-9 : cross <= 1e-9;
}

function intersectionPoint(s: Point, e: Point, a: Point, b: Point): Point {
  const x1 = s.x;
  const y1 = s.y;
  const x2 = e.x;
  const y2 = e.y;
  const x3 = a.x;
  const y3 = a.y;
  const x4 = b.x;
  const y4 = b.y;
  const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(den) < 1e-12) return e;
  const px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / den;
  const py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / den;
  return { x: px, y: py };
}

function signedArea(poly: Point[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length;
    a += poly[i].x * poly[j].y - poly[j].x * poly[i].y;
  }
  return a * 0.5;
}

function sqDist(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function dedupeAdjacent(poly: Point[]): Point[] {
  if (poly.length === 0) return poly;
  const out: Point[] = [];
  for (const p of poly) {
    const prev = out[out.length - 1];
    if (!prev || sqDist(prev, p) > 1e-10) out.push(p);
  }
  if (out.length > 1 && sqDist(out[0], out[out.length - 1]) < 1e-10) out.pop();
  return out;
}
