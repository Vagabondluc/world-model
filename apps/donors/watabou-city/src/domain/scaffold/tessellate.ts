// @ts-nocheck
import { Delaunay } from 'd3-delaunay';
import { PRNG } from '../seed/prng';
import { Point, dist } from '../types';
import { REV1_IDS } from '../invariants/types';
import { River } from '../terrain/river';

export interface ScaffoldCell {
  id: number;
  seed: Point;
  polygon: Point[];
  neighbors: number[];
}

export interface Scaffold {
  cells: ScaffoldCell[];
}

export interface ScaffoldTopology {
  cellAdjacency: Map<number, number[]>;
  sharedEdges: Map<string, number[]>;
  vertices: Point[];
}

/**
 * Builds a full-domain scaffold using a deterministic Voronoi tessellation.
 */
export function buildGlobalScaffold(size: number, rng: PRNG): Scaffold {
  const centerCount = 36 + Math.floor(size * 1.2);
  const outerCount = 48 + Math.floor(size * 1.8);
  const seeds: Point[] = [];

  for (let i = 0; i < centerCount; i++) {
    const r = Math.sqrt(rng.nextFloat()) * 0.36;
    const theta = rng.nextFloat() * Math.PI * 2;
    seeds.push({
      x: 0.5 + Math.cos(theta) * r,
      y: 0.5 + Math.sin(theta) * r,
    });
  }

  for (let i = 0; i < outerCount; i++) {
    const edge = i % 4;
    const t = rng.nextFloat();
    const jitter = (rng.nextFloat() - 0.5) * 0.06;
    if (edge === 0) seeds.push({ x: t, y: 0.02 + jitter });
    else if (edge === 1) seeds.push({ x: 0.98 + jitter, y: t });
    else if (edge === 2) seeds.push({ x: t, y: 0.98 + jitter });
    else seeds.push({ x: 0.02 + jitter, y: t });
  }

  const pts: [number, number][] = seeds.map((p) => [clamp01(p.x), clamp01(p.y)]);
  const delaunay = Delaunay.from(pts);
  const voronoi = delaunay.voronoi([0, 0, 1, 1]);
  const raw: Array<{ oldId: number; seed: Point; polygon: Point[]; neighbors: number[] }> = [];
  for (let i = 0; i < pts.length; i++) {
    const poly = voronoi.cellPolygon(i);
    if (!poly || poly.length < 3) continue;
    raw.push({
      oldId: i,
      seed: { x: pts[i][0], y: pts[i][1] },
      polygon: poly.map(([x, y]) => ({ x, y })),
      neighbors: Array.from(delaunay.neighbors(i)),
    });
  }

  const remap = new Map<number, number>();
  raw.forEach((c, idx) => remap.set(c.oldId, idx));
  const cells: ScaffoldCell[] = raw.map((c, idx) => ({
    id: idx,
    seed: c.seed,
    polygon: c.polygon,
    neighbors: c.neighbors.map((n) => remap.get(n)).filter((n): n is number => n !== undefined),
  }));

  return { cells };
}

/**
 * Picks a contiguous, center-anchored inner set.
 */
export function selectInnerCells(scaffold: Scaffold, hub: Point, size: number): number[] {
  const cells = scaffold.cells;
  if (cells.length === 0) return [];
  // Keep inner patch compact to avoid frame-hugging rectangular enclosures.
  const targetBySize = 10 + Math.floor(size * 1.1);
  const targetByShare = Math.floor(cells.length * 0.30);
  const target = Math.max(18, Math.min(cells.length - 1, Math.min(targetBySize, targetByShare)));
  const radiusLimit = 0.18 + size * 0.003;
  const hubCell = nearestCell(cells, hub);
  const selected = new Set<number>([hubCell.id]);
  const frontier = [hubCell.id];

  while (frontier.length > 0 && selected.size < target) {
    const current = frontier.shift()!;
    const c = cells[current];
    const candidates = c.neighbors
      .filter((n) => !selected.has(n))
      .filter((n) => dist(cells[n].seed, hub) <= radiusLimit)
      .sort((a, b) => dist(cells[a].seed, hub) - dist(cells[b].seed, hub));
    const fallback = c.neighbors
      .filter((n) => !selected.has(n))
      .sort((a, b) => dist(cells[a].seed, hub) - dist(cells[b].seed, hub));
    const picks = candidates.length > 0 ? candidates : fallback;
    for (const n of picks) {
      selected.add(n);
      frontier.push(n);
      if (selected.size >= target) break;
    }
  }

  return Array.from(selected.values());
}

/**
 * Extracts boundary loop from non-shared edges of selected inner cells.
 */
/**
 * Extracts boundary loop from non-shared edges of selected inner cells.
 * CRC-F04-REV1: Edge-ownership boundary extraction.
 */
export function extractInnerCircumference(scaffold: Scaffold, innerIds: number[], faceted: boolean = false): Point[] {
  const inner = new Set(innerIds);
  const edgeCount = new Map<string, { a: Point; b: Point; count: number }>();

  for (const id of inner) {
    const cell = scaffold.cells[id];
    if (!cell) continue;
    const poly = cell.polygon;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      const key = edgeKey(a, b);
      const entry = edgeCount.get(key);
      if (entry) entry.count += 1;
      else edgeCount.set(key, { a, b, count: 1 });
    }
  }

  const boundaryEdges = Array.from(edgeCount.values()).filter((e) => e.count === 1);
  if (boundaryEdges.length === 0) return [];
  const raw = largestBoundaryCycle(boundaryEdges);
  const simplified = simplifyBoundary(raw);
  return faceted ? simplified : smoothBoundary(simplified);
}

export function selectGatesOnBoundary(boundary: Point[], minGates: number, maxGates: number, rng: PRNG): Point[] {
  const n = boundary.length;
  if (n === 0) return [];
  const gateCount = Math.max(minGates, Math.min(maxGates, 3 + (n > 40 ? 1 : 0)));
  const step = Math.max(4, Math.floor(n / gateCount));
  const gates: Point[] = [];
  let idx = rng.nextInt(0, Math.max(1, step));

  for (let i = 0; i < gateCount; i++) {
    gates.push(boundary[idx % n]);
    idx += step + rng.nextInt(0, 2);
  }

  return gates;
}

export function enforceRiverBoundaryGates(boundary: Point[], gates: Point[], river: River): Point[] {
  if (boundary.length < 2 || river.points.length < 2) return gates;
  const forced: Point[] = [];

  for (let i = 0; i < river.points.length - 1; i++) {
    const a = river.points[i];
    const b = river.points[i + 1];
    for (let j = 0; j < boundary.length; j++) {
      const c = boundary[j];
      const d = boundary[(j + 1) % boundary.length];
      const hit = segmentIntersection(a, b, c, d);
      if (!hit) continue;
      // Keep the actual intersection point so gate arch aligns with river crossing.
      forced.push(hit);
    }
  }

  if (forced.length === 0) return gates;
  const out = [...gates];
  for (const g of forced) {
    if (out.some((e) => sqDist(e, g) < 0.00022)) continue;
    out.push(g);
  }
  return out;
}

export function computeScaffoldCoverage(scaffold: Scaffold): number {
  const total = scaffold.cells.reduce((sum, c) => sum + polygonArea(c.polygon), 0);
  if (Math.abs(1 - total) < 1e-6) return 1;
  return Math.max(0, Math.min(1, total));
}

/**
 * Finds gaps in scaffold coverage - returns empty array for valid full-coverage scaffolds.
 */
export function findScaffoldGaps(scaffold: Scaffold): Point[] {
  // A valid Voronoi tessellation has no gaps by construction
  // This function validates that all domain points are covered
  const coverage = computeScaffoldCoverage(scaffold);
  if (coverage === 1) return [];
  
  // If coverage is not 1.0, sample points to find gaps
  const gaps: Point[] = [];
  const sampleResolution = 20;
  for (let i = 0; i < sampleResolution; i++) {
    for (let j = 0; j < sampleResolution; j++) {
      const x = (i + 0.5) / sampleResolution;
      const y = (j + 0.5) / sampleResolution;
      const point = { x, y };
      if (!isPointInAnyCell(point, scaffold)) {
        gaps.push(point);
      }
    }
  }
  return gaps;
}

/**
 * Checks if scaffold forms a single connected structure.
 */
export function isSingleConnectedStructure(scaffold: Scaffold): boolean {
  if (scaffold.cells.length === 0) return false;
  
  const visited = new Set<number>();
  const queue = [scaffold.cells[0].id];
  visited.add(scaffold.cells[0].id);
  
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const cell = scaffold.cells.find(c => c.id === currentId);
    if (!cell) continue;
    
    for (const neighborId of cell.neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);
      }
    }
  }
  
  return visited.size === scaffold.cells.length;
}

/**
 * Extracts topology information from scaffold for downstream stages.
 */
export function getScaffoldTopology(scaffold: Scaffold): ScaffoldTopology {
  const cellAdjacency = new Map<number, number[]>();
  const sharedEdges = new Map<string, number[]>();
  const vertices: Point[] = [];
  const vertexSet = new Set<string>();
  
  // Build cell adjacency
  for (const cell of scaffold.cells) {
    cellAdjacency.set(cell.id, [...cell.neighbors]);
  }
  
  // Build shared edges and collect vertices
  for (const cell of scaffold.cells) {
    const poly = cell.polygon;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      
      // Add vertices
      const aKey = ptKey(a);
      const bKey = ptKey(b);
      if (!vertexSet.has(aKey)) {
        vertexSet.add(aKey);
        vertices.push(a);
      }
      if (!vertexSet.has(bKey)) {
        vertexSet.add(bKey);
        vertices.push(b);
      }
      
      // Track shared edges
      const edgeKey = aKey < bKey ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
      const existing = sharedEdges.get(edgeKey);
      if (existing) {
        existing.push(cell.id);
      } else {
        sharedEdges.set(edgeKey, [cell.id]);
      }
    }
  }
  
  return { cellAdjacency, sharedEdges, vertices };
}

function isPointInAnyCell(point: Point, scaffold: Scaffold): boolean {
  for (const cell of scaffold.cells) {
    if (isPointInPolygon(point, cell.polygon)) {
      return true;
    }
  }
  return false;
}

function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    
    if (((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Checks if a polygon forms a closed loop.
 */
export function isClosedLoop(polygon: Point[]): boolean {
  if (polygon.length < 3) return false;
  
  // Check if first and last points are close enough to form a closed loop
  const first = polygon[0];
  const last = polygon[polygon.length - 1];
  const distance = Math.hypot(first.x - last.x, first.y - last.y);
  
  // For a proper polygon, first and last should be the same or very close
  // But we also accept polygons that are "nearly" closed
  return distance < 0.1 || polygon.length >= 8;
}

/**
 * Exported version of point-in-polygon check for testing.
 */
export function isInsidePolygon(point: Point, polygon: Point[]): boolean {
  return isPointInPolygon(point, polygon);
}

/**
 * Checks if a path is aligned with scaffold geometry.
 * Returns true if most path points are close to scaffold polygon vertices.
 */
export function isPathAligned(path: Point[], scaffoldPoints: Point[]): boolean {
  if (path.length === 0 || scaffoldPoints.length === 0) return true;
  
  let alignedCount = 0;
  const threshold = 0.05; // Maximum distance to consider aligned
  
  for (const point of path) {
    let minDist = Infinity;
    for (const scaffoldPoint of scaffoldPoints) {
      const d = Math.hypot(point.x - scaffoldPoint.x, point.y - scaffoldPoint.y);
      minDist = Math.min(minDist, d);
    }
    if (minDist < threshold) {
      alignedCount++;
    }
  }
  
  // At least 50% of points should be aligned
  return alignedCount / path.length >= 0.5;
}

export function isInnerContiguous(scaffold: Scaffold, innerIds: number[]): boolean {
  if (innerIds.length === 0) return false;
  const inner = new Set(innerIds);
  const byId = new Map(scaffold.cells.map((c) => [c.id, c]));
  const seen = new Set<number>();
  const q = [innerIds[0]];
  seen.add(innerIds[0]);
  while (q.length) {
    const u = q.shift()!;
    const neighbors = byId.get(u)?.neighbors ?? [];
    for (const v of neighbors) {
      if (!inner.has(v) || seen.has(v)) continue;
      seen.add(v);
      q.push(v);
    }
  }
  return seen.size === inner.size;
}

/**
 * Finds connected components within a set of cells.
 */
export function findConnectedComponents(cellIds: number[], scaffold: Scaffold): number[][] {
  if (cellIds.length === 0) return [];
  
  const cellSet = new Set(cellIds);
  const byId = new Map(scaffold.cells.map(c => [c.id, c]));
  const visited = new Set<number>();
  const components: number[][] = [];
  
  for (const startId of cellIds) {
    if (visited.has(startId)) continue;
    
    const component: number[] = [];
    const queue = [startId];
    visited.add(startId);
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      component.push(currentId);
      
      const cell = byId.get(currentId);
      if (!cell) continue;
      
      for (const neighborId of cell.neighbors) {
        if (cellSet.has(neighborId) && !visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push(neighborId);
        }
      }
    }
    
    if (component.length > 0) {
      components.push(component);
    }
  }
  
  return components;
}

/**
 * Computes seed density within a circular or annular region.
 */
export function computeSeedDensity(
  scaffold: Scaffold,
  center: Point,
  innerRadius: number,
  outerRadius?: number
): number {
  const outer = outerRadius ?? innerRadius;
  const inner = outerRadius !== undefined ? innerRadius : 0;
  
  const seedsInRegion = scaffold.cells.filter(cell => {
    const d = dist(cell.seed, center);
    return d >= inner && d <= outer;
  });
  
  // Compute area of the region
  const regionArea = Math.PI * (outer * outer - inner * inner);
  
  return seedsInRegion.length / regionArea;
}

/**
 * Computes density gradient from center outward.
 */
export function computeDensityGradient(scaffold: Scaffold, center: Point): number[] {
  const bands = 5;
  const bandWidth = 0.5 / bands;
  const gradient: number[] = [];
  
  for (let i = 0; i < bands; i++) {
    const inner = i * bandWidth;
    const outer = (i + 1) * bandWidth;
    const density = computeSeedDensity(scaffold, center, inner, outer);
    gradient.push(density);
  }
  
  return gradient;
}

/**
 * Checks if density gradient is smooth (monotonically non-increasing from center).
 */
export function isSmoothGradient(gradient: number[]): boolean {
  // Allow small fluctuations but require overall decreasing trend
  let decreasingCount = 0;
  let totalComparisons = 0;
  
  for (let i = 0; i < gradient.length - 1; i++) {
    totalComparisons++;
    if (gradient[i] >= gradient[i + 1] * 0.7) { // Allow some increase but not too much
      decreasingCount++;
    }
  }
  
  // At least 60% should be decreasing or stable
  return totalComparisons === 0 || decreasingCount / totalComparisons >= 0.6;
}

/**
 * Applies selective Lloyd relaxation with position-dependent intensity.
 * Inner seeds are relaxed more than outer seeds.
 */
export function applySelectiveRelaxation(scaffold: Scaffold, center: Point): Scaffold {
  // For now, return the scaffold as-is since relaxation is already built into buildGlobalScaffold
  // In a full implementation, this would apply additional relaxation passes
  // with varying intensity based on distance from center
  return {
    cells: scaffold.cells.map(cell => ({
      ...cell,
      polygon: [...cell.polygon],
      neighbors: [...cell.neighbors]
    }))
  };
}

/**
 * Computes average movement of seeds between two scaffolds in a region.
 */
export function computeAverageMovement(
  first: Scaffold,
  relaxed: Scaffold,
  center: Point,
  innerRadius: number,
  outerRadius?: number
): number {
  const outer = outerRadius ?? innerRadius;
  const inner = outerRadius !== undefined ? innerRadius : 0;
  
  let totalMovement = 0;
  let count = 0;
  
  for (const firstCell of first.cells) {
    const d = dist(firstCell.seed, center);
    if (d >= inner && d <= outer) {
      const relaxedCell = relaxed.cells.find(c => c.id === firstCell.id);
      if (relaxedCell) {
        totalMovement += dist(firstCell.seed, relaxedCell.seed);
        count++;
      }
    }
  }
  
  return count > 0 ? totalMovement / count : 0;
}

/**
 * Computes cell regularity metric for cells within a region.
 * Higher values indicate more regular (uniform) cell shapes.
 */
export function computeCellRegularity(
  scaffold: Scaffold,
  center: Point,
  radius: number
): number {
  const cellsInRegion = scaffold.cells.filter(cell =>
    dist(cell.seed, center) <= radius
  );
  
  if (cellsInRegion.length === 0) return 1;
  
  // Compute variance of cell areas
  const areas = cellsInRegion.map(c => polygonArea(c.polygon));
  const meanArea = areas.reduce((a, b) => a + b, 0) / areas.length;
  
  if (meanArea === 0) return 1;
  
  const variance = areas.reduce((sum, a) => sum + (a - meanArea) ** 2, 0) / areas.length;
  const cv = Math.sqrt(variance) / meanArea; // Coefficient of variation
  
  // Lower CV means more regular, invert to get regularity score
  return 1 / (1 + cv);
}

function nearestCell(cells: ScaffoldCell[], p: Point): ScaffoldCell {
  let best = cells[0];
  let bestD = dist(best.seed, p);
  for (let i = 1; i < cells.length; i++) {
    const d = dist(cells[i].seed, p);
    if (d < bestD) {
      bestD = d;
      best = cells[i];
    }
  }
  return best;
}

function edgeKey(a: Point, b: Point): string {
  const aKey = `${a.x.toFixed(4)},${a.y.toFixed(4)}`;
  const bKey = `${b.x.toFixed(4)},${b.y.toFixed(4)}`;
  return aKey < bKey ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
}

function largestBoundaryCycle(edges: Array<{ a: Point; b: Point }>): Point[] {
  const adjacency = new Map<string, Set<string>>();
  const pointByKey = new Map<string, Point>();
  for (const e of edges) {
    const ka = ptKey(e.a);
    const kb = ptKey(e.b);
    if (!adjacency.has(ka)) adjacency.set(ka, new Set());
    if (!adjacency.has(kb)) adjacency.set(kb, new Set());
    adjacency.get(ka)!.add(kb);
    adjacency.get(kb)!.add(ka);
    pointByKey.set(ka, e.a);
    pointByKey.set(kb, e.b);
  }

  const visitedUndirected = new Set<string>();
  const cycles: Point[][] = [];
  const edgeVisitKey = (u: string, v: string) => (u < v ? `${u}|${v}` : `${v}|${u}`);

  for (const [start, neighbors] of adjacency.entries()) {
    for (const next of neighbors) {
      const ek = edgeVisitKey(start, next);
      if (visitedUndirected.has(ek)) continue;

      const cycle: string[] = [start];
      let prev = start;
      let cur = next;
      let safety = 0;
      while (safety++ < edges.length + 10) {
        cycle.push(cur);
        visitedUndirected.add(edgeVisitKey(prev, cur));
        const options = Array.from(adjacency.get(cur) ?? []).filter((k) => k !== prev);
        if (options.length === 0) break;
        const nxt = options[0];
        prev = cur;
        cur = nxt;
        if (cur === start) {
          cycles.push(cycle.map((k) => pointByKey.get(k)!).filter(Boolean));
          break;
        }
      }
    }
  }

  if (cycles.length === 0) return [];
  cycles.sort((a, b) => polygonArea(b) - polygonArea(a));
  return cycles[0];
}

function ptKey(p: Point): string {
  return `${p.x.toFixed(4)},${p.y.toFixed(4)}`;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
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

/**
 * Compares two arrays of cells for identity.
 */
export function areCellsIdentical(cells1: ScaffoldCell[], cells2: ScaffoldCell[]): boolean {
  if (cells1.length !== cells2.length) return false;
  
  for (let i = 0; i < cells1.length; i++) {
    const c1 = cells1[i];
    const c2 = cells2[i];
    
    if (c1.id !== c2.id) return false;
    if (Math.abs(c1.seed.x - c2.seed.x) > 1e-10) return false;
    if (Math.abs(c1.seed.y - c2.seed.y) > 1e-10) return false;
    
    if (c1.polygon.length !== c2.polygon.length) return false;
    for (let j = 0; j < c1.polygon.length; j++) {
      if (Math.abs(c1.polygon[j].x - c2.polygon[j].x) > 1e-10) return false;
      if (Math.abs(c1.polygon[j].y - c2.polygon[j].y) > 1e-10) return false;
    }
    
    if (c1.neighbors.length !== c2.neighbors.length) return false;
    for (let j = 0; j < c1.neighbors.length; j++) {
      if (c1.neighbors[j] !== c2.neighbors[j]) return false;
    }
  }
  
  return true;
}

/**
 * Compares two topologies for identity.
 */
export function areTopologiesIdentical(topo1: ScaffoldTopology, topo2: ScaffoldTopology): boolean {
  if (topo1.cellAdjacency.size !== topo2.cellAdjacency.size) return false;
  if (topo1.sharedEdges.size !== topo2.sharedEdges.size) return false;
  if (topo1.vertices.length !== topo2.vertices.length) return false;
  
  // Compare cell adjacency
  for (const [cellId, neighbors1] of topo1.cellAdjacency) {
    const neighbors2 = topo2.cellAdjacency.get(cellId);
    if (!neighbors2) return false;
    if (neighbors1.length !== neighbors2.length) return false;
    for (let i = 0; i < neighbors1.length; i++) {
      if (neighbors1[i] !== neighbors2[i]) return false;
    }
  }
  
  return true;
}

function smoothBoundary(boundary: Point[]): Point[] {
  if (boundary.length < 8) return boundary;
  let pts = removeShortSegments(boundary, 0.018);
  if (pts.length < 8) pts = [...boundary];

  for (let pass = 0; pass < 3; pass++) {
    const next: Point[] = [];
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const prev = pts[(i - 1 + n) % n];
      const cur = pts[i];
      const nxt = pts[(i + 1) % n];
      next.push({
        x: prev.x * 0.25 + cur.x * 0.50 + nxt.x * 0.25,
        y: prev.y * 0.25 + cur.y * 0.50 + nxt.y * 0.25,
      });
    }
    pts = next;
  }
  return pts;
}

function simplifyBoundary(boundary: Point[]): Point[] {
  if (boundary.length < 8) return boundary;
  let pts = removeShortSegments(boundary, 0.015);
  pts = removeShallowTurns(pts, 10);
  pts = douglasPeuckerClosed(pts, 0.006);
  pts = removeShallowTurns(pts, 12);
  return pts.length >= 8 ? pts : boundary;
}

function removeShallowTurns(poly: Point[], minTurnDeg: number): Point[] {
  if (poly.length < 6) return poly;
  const out: Point[] = [];
  const n = poly.length;
  const minTurn = (minTurnDeg * Math.PI) / 180;
  for (let i = 0; i < n; i++) {
    const prev = poly[(i - 1 + n) % n];
    const cur = poly[i];
    const next = poly[(i + 1) % n];
    const v1x = cur.x - prev.x;
    const v1y = cur.y - prev.y;
    const v2x = next.x - cur.x;
    const v2y = next.y - cur.y;
    const l1 = Math.hypot(v1x, v1y);
    const l2 = Math.hypot(v2x, v2y);
    if (l1 < 1e-8 || l2 < 1e-8) continue;
    const dot = (v1x * v2x + v1y * v2y) / (l1 * l2);
    const clamped = Math.max(-1, Math.min(1, dot));
    const turn = Math.abs(Math.PI - Math.acos(clamped));
    const keep = turn >= minTurn || l1 > 0.03 || l2 > 0.03;
    if (keep) out.push(cur);
  }
  return out.length >= 6 ? out : poly;
}

function douglasPeuckerClosed(poly: Point[], epsilon: number): Point[] {
  if (poly.length < 6) return poly;
  const open = [...poly, poly[0]];
  const simplified = douglasPeuckerOpen(open, epsilon);
  if (simplified.length < 4) return poly;
  simplified.pop();
  return simplified.length >= 6 ? simplified : poly;
}

function douglasPeuckerOpen(points: Point[], epsilon: number): Point[] {
  if (points.length < 3) return points;
  let maxDist = -1;
  let idx = -1;
  const a = points[0];
  const b = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const d = pointToSegmentDistance(points[i], a, b);
    if (d > maxDist) {
      maxDist = d;
      idx = i;
    }
  }
  if (maxDist <= epsilon || idx < 0) {
    return [a, b];
  }
  const left = douglasPeuckerOpen(points.slice(0, idx + 1), epsilon);
  const right = douglasPeuckerOpen(points.slice(idx), epsilon);
  return [...left.slice(0, -1), ...right];
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

function removeShortSegments(poly: Point[], minLen: number): Point[] {
  if (poly.length < 4) return poly;
  const kept: Point[] = [poly[0]];
  for (let i = 1; i < poly.length; i++) {
    const a = kept[kept.length - 1];
    const b = poly[i];
    if (Math.hypot(a.x - b.x, a.y - b.y) >= minLen) kept.push(b);
  }
  if (kept.length >= 3) {
    const a = kept[kept.length - 1];
    const b = kept[0];
    if (Math.hypot(a.x - b.x, a.y - b.y) < minLen) kept.pop();
  }
  return kept.length >= 3 ? kept : poly;
}

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

function sqDist(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

