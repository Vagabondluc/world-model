// @ts-nocheck
import { Point } from '../domain/types';
import { PRNG } from '../domain/seed/prng';
import { MAP_STYLE } from '../adapters/render/style';
import { River, distanceToRiver } from '../domain/terrain/river';
import { HydraulicNode } from '../domain/structures/hydraulic';

export interface WallOptions {
  scale: number;
  offsetX?: number;
  offsetY?: number;
  wallWidth?: number;
  towerRadius?: number;
  towerInterval?: number;
  towerShape?: 'round' | 'square';
  facetedWalls?: boolean;
}

// River buffer distance for tower placement (CRC-A6-081: tower-river overlap)
const RIVER_BUFFER = 0.03;
// Gates near river are rendered as hydraulic outlets (culvert/watergate), not round gate towers.
const HYDRAULIC_GATE_DISTANCE = 0.028;

// Internal: compute tower and gate indices for a given boundary/gates pair
export function getWallIndices(
  boundary: Point[],
  gates: Point[],
  towerInterval: number,
  river: River | null = null,
): { gateSet: Set<number>; towerSet: Set<number> } {
  const n = boundary.length;

  const gateSet = new Set<number>();
  for (const g of gates) {
    if (n === 0) continue;
    gateSet.add(nearestBoundaryIndex(boundary, g));
  }

  const perimeter = polygonPerimeter(boundary);
  const targetSpacing = Math.max(0.11, Math.min(0.18, perimeter / Math.max(8, Math.floor(n / Math.max(2, towerInterval)))));
  const minArcGap = targetSpacing * 0.72;
  const towerSet = new Set<number>();
  const cumul = cumulativeArc(boundary);
  const turn = computeTurnMagnitudes(boundary);

  // Curvature extrema first: towers at meaningful articulation points.
  const curvatureCandidates: Array<{ idx: number; score: number }> = [];
  const minCornerTurn = (20 * Math.PI) / 180;
  for (let i = 0; i < n; i++) {
    if (gateSet.has(i)) continue;
    if (river && distanceToRiver(boundary[i], river) < RIVER_BUFFER) continue;
    const prev = turn[(i - 1 + n) % n];
    const next = turn[(i + 1) % n];
    const isExtremum = turn[i] >= prev && turn[i] >= next;
    if (isExtremum && turn[i] >= minCornerTurn) {
      curvatureCandidates.push({ idx: i, score: turn[i] });
    }
  }
  curvatureCandidates.sort((a, b) => b.score - a.score);
  for (const c of curvatureCandidates) {
    if (isFarEnough(c.idx, towerSet, cumul, perimeter, minArcGap * 0.85)) {
      towerSet.add(c.idx);
    }
  }

  // Arc-length spacing on long runs after corner anchors are placed.
  const sampleCount = Math.max(8, Math.floor(perimeter / targetSpacing));
  for (let i = 0; i < sampleCount; i++) {
    const targetArc = (i / sampleCount) * perimeter;
    let bestIdx = 0;
    let bestDelta = Infinity;
    for (let j = 0; j < n; j++) {
      if (gateSet.has(j)) continue;
      if (river && distanceToRiver(boundary[j], river) < RIVER_BUFFER) continue;
      const delta = Math.abs(cumul[j] - targetArc);
      if (delta < bestDelta) {
        bestDelta = delta;
        bestIdx = j;
      }
    }
    if (!gateSet.has(bestIdx) && isFarEnough(bestIdx, towerSet, cumul, perimeter, minArcGap)) {
      towerSet.add(bestIdx);
    }
  }

  // Force at least one readable flank tower per gate.
  const forcedFlanks = new Set<number>();
  for (const gi of gateSet) {
    const before = (gi - 1 + n) % n;
    const after = (gi + 1) % n;
    const beforeNearRiver = river ? distanceToRiver(boundary[before], river) < RIVER_BUFFER : false;
    const afterNearRiver = river ? distanceToRiver(boundary[after], river) < RIVER_BUFFER : false;
    const candidates: Array<{ idx: number; score: number }> = [];
    if (!gateSet.has(before) && !beforeNearRiver) candidates.push({ idx: before, score: turn[before] });
    if (!gateSet.has(after) && !afterNearRiver) candidates.push({ idx: after, score: turn[after] });
    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      towerSet.add(candidates[0].idx);
      forcedFlanks.add(candidates[0].idx);
    }
  }
  // Remove non-forced towers immediately adjacent to forced flank towers.
  for (const idx of Array.from(towerSet.values())) {
    if (forcedFlanks.has(idx)) continue;
    const tooCloseForced = Array.from(forcedFlanks.values()).some((f) => {
      const delta = Math.abs(f - idx);
      return delta === 1 || delta === n - 1;
    });
    if (tooCloseForced) towerSet.delete(idx);
  }

  // Final Euclidean spacing cleanup to avoid visual stacking in compressed vertex clusters.
  const euclidMin = 0.07;
  const accepted: number[] = [];
  for (const idx of Array.from(towerSet.values()).sort((a, b) => a - b)) {
    let ok = true;
    for (const ex of accepted) {
      const d = Math.hypot(boundary[idx].x - boundary[ex].x, boundary[idx].y - boundary[ex].y);
      if (d < euclidMin && !(forcedFlanks.has(idx) && !forcedFlanks.has(ex))) {
        ok = false;
        break;
      }
      if (d < euclidMin && forcedFlanks.has(idx) && !forcedFlanks.has(ex)) {
        const k = accepted.indexOf(ex);
        if (k >= 0) accepted.splice(k, 1);
      }
    }
    if (ok) accepted.push(idx);
  }
  towerSet.clear();
  for (const i of accepted) towerSet.add(i);

  // Gate grammar guarantee: each non-hydraulic gate has at least one immediate flank tower.
  for (const gi of gateSet) {
    const before = (gi - 1 + n) % n;
    const after = (gi + 1) % n;
    const gateNearRiver = river ? distanceToRiver(boundary[gi], river) < HYDRAULIC_GATE_DISTANCE : false;
    const beforeHardMasked = river ? distanceToRiver(boundary[before], river) < 0.014 : false;
    const afterHardMasked = river ? distanceToRiver(boundary[after], river) < 0.014 : false;
    const hasFlank = towerSet.has(before) || towerSet.has(after);
    if (!gateNearRiver && !hasFlank) {
      if (!beforeHardMasked && !gateSet.has(before)) towerSet.add(before);
      else if (!afterHardMasked && !gateSet.has(after)) towerSet.add(after);
    }
  }

  return { gateSet, towerSet };
}

function computeTurnMagnitudes(boundary: Point[]): number[] {
  const n = boundary.length;
  const turn = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    const prev = boundary[(i - 1 + n) % n];
    const cur = boundary[i];
    const next = boundary[(i + 1) % n];
    const v1x = cur.x - prev.x;
    const v1y = cur.y - prev.y;
    const v2x = next.x - cur.x;
    const v2y = next.y - cur.y;
    const l1 = Math.hypot(v1x, v1y);
    const l2 = Math.hypot(v2x, v2y);
    if (l1 < 1e-8 || l2 < 1e-8) {
      turn[i] = 0;
      continue;
    }
    const dot = (v1x * v2x + v1y * v2y) / (l1 * l2);
    const clamped = Math.max(-1, Math.min(1, dot));
    turn[i] = Math.abs(Math.PI - Math.acos(clamped));
  }
  return turn;
}

function nearestBoundaryIndex(boundary: Point[], p: Point): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < boundary.length; i++) {
    const d = (boundary[i].x - p.x) ** 2 + (boundary[i].y - p.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

function polygonPerimeter(poly: Point[]): number {
  let p = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    p += Math.hypot(a.x - b.x, a.y - b.y);
  }
  return p;
}

function cumulativeArc(poly: Point[]): number[] {
  const cumul: number[] = [0];
  for (let i = 1; i < poly.length; i++) {
    const a = poly[i - 1];
    const b = poly[i];
    cumul.push(cumul[i - 1] + Math.hypot(a.x - b.x, a.y - b.y));
  }
  return cumul;
}

function arcDistance(aIdx: number, bIdx: number, cumul: number[], perimeter: number): number {
  const da = Math.abs(cumul[aIdx] - cumul[bIdx]);
  return Math.min(da, Math.max(0, perimeter - da));
}

function isFarEnough(
  idx: number,
  accepted: Set<number>,
  cumul: number[],
  perimeter: number,
  minArcGap: number,
): boolean {
  for (const ex of accepted) {
    if (arcDistance(idx, ex, cumul, perimeter) < minArcGap) return false;
  }
  return true;
}

/**
 * Renders only the wall SECTIONS (polyline strokes between towers).
 * Call this BEFORE buildings in the SVG layer stack.
 */
export function renderWallSections(
  boundary: Point[],
  gates: Point[],
  opts: WallOptions,
  river: River | null = null,
): string {
  const { scale, offsetX = 0, offsetY = 0, wallWidth = 5, towerInterval = 2, facetedWalls = false } = opts;
  const { gateSet, towerSet } = getWallIndices(boundary, gates, towerInterval, river);
  const n = boundary.length;

  // Build wall sections: runs from one tower to the next, skipping gates
  const sections: Point[][] = [];
  let current: Point[] = [];

  for (let i = 0; i < n; i++) {
    if (gateSet.has(i)) {
      if (current.length >= 2) sections.push([...current]);
      current = [];
    } else if (towerSet.has(i)) {
      current.push(boundary[i]);
      if (current.length >= 2) sections.push([...current]);
      current = [boundary[i]]; // start next section from this tower vertex
    } else {
      current.push(boundary[i]);
    }
  }
  if (current.length >= 2) sections.push([...current]);

  let svg = `<g class="wall-sections">`;
  for (const seg of sections) {
    if (seg.length < 2) continue;
    const pathD = facetedWalls
      ? polylinePath(seg, scale, offsetX, offsetY)
      : smoothPath(seg, scale, offsetX, offsetY);
    // Stone base (dark outer casing)
    svg += `<path d="${pathD}" fill="none" stroke="${MAP_STYLE.wallStroke}" stroke-width="${wallWidth + 2.0}" stroke-linecap="round" stroke-linejoin="round" />`;
    // Stone surface (lighter inner fill)
    svg += `<path d="${pathD}" fill="none" stroke="${MAP_STYLE.wallFill}" stroke-width="${wallWidth}" stroke-linecap="round" stroke-linejoin="round" />`;
  }
  svg += `</g>`;
  return svg;
}

function polylinePath(points: Point[], scale: number, offsetX: number, offsetY: number): string {
  if (points.length === 0) return '';
  const firstX = (offsetX + points[0].x * scale).toFixed(1);
  const firstY = (offsetY + points[0].y * scale).toFixed(1);
  let d = `M ${firstX} ${firstY}`;
  for (let i = 1; i < points.length; i++) {
    const x = (offsetX + points[i].x * scale).toFixed(1);
    const y = (offsetY + points[i].y * scale).toFixed(1);
    d += ` L ${x} ${y}`;
  }
  return d;
}

function smoothPath(points: Point[], scale: number, offsetX: number, offsetY: number): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const x = (offsetX + points[0].x * scale).toFixed(1);
    const y = (offsetY + points[0].y * scale).toFixed(1);
    return `M ${x} ${y}`;
  }

  const toCanvas = (p: Point) => ({
    x: offsetX + p.x * scale,
    y: offsetY + p.y * scale,
  });
  const c = points.map(toCanvas);
  let d = `M ${c[0].x.toFixed(1)} ${c[0].y.toFixed(1)}`;
  for (let i = 1; i < c.length - 1; i++) {
    const midX = (c[i].x + c[i + 1].x) * 0.5;
    const midY = (c[i].y + c[i + 1].y) * 0.5;
    d += ` Q ${c[i].x.toFixed(1)} ${c[i].y.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  const last = c[c.length - 1];
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return d;
}

/**
 * Renders only the wall TOWERS and GATE arches.
 * Call this AFTER buildings so towers appear on top.
 */
export function renderWallTowers(
  boundary: Point[],
  gates: Point[],
  opts: WallOptions,
  river: River | null = null,
  hydraulicNodes: HydraulicNode[] = [],
  embeddedDrainStyle = true,
): string {
  const { scale, offsetX = 0, offsetY = 0, wallWidth: _w = 5, towerRadius = 8, towerInterval = 2, towerShape = 'round' } = opts;
  const { gateSet, towerSet } = getWallIndices(boundary, gates, towerInterval, river);
  const W = scale;
  const hydMap = new Map<string, 'culvert' | 'watergate'>(
    hydraulicNodes.map((h) => [`${h.x.toFixed(4)},${h.y.toFixed(4)}`, h.type]),
  );

  const drawTower = (p: Point, r: number, fill: string): string => {
    const cx = (offsetX + p.x * W).toFixed(1);
    const cy = (offsetY + p.y * W).toFixed(1);
    if (towerShape === 'square') {
      const x = ((offsetX + p.x * W) - r).toFixed(1);
      const y = ((offsetY + p.y * W) - r).toFixed(1);
      const size = (r * 2).toFixed(1);
      return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}" stroke="${MAP_STYLE.wallStroke}" stroke-width="1.2" />`;
    }
    // Round tower
    let t = `<circle cx="${cx}" cy="${cy}" r="${(r + 1.5).toFixed(1)}" fill="${MAP_STYLE.wallStroke}" />`; // ink ring
    t += `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="${fill}" stroke="${MAP_STYLE.wallStroke}" stroke-width="0.8" />`;
    t += `<circle cx="${cx}" cy="${cy}" r="${(r * 0.32).toFixed(1)}" fill="${MAP_STYLE.wallStroke}" opacity="0.35" />`; // dark center
    return t;
  };

  let svg = `<g class="wall-towers">`;

  // Regular towers
  for (const i of towerSet) {
    svg += drawTower(boundary[i], towerRadius, MAP_STYLE.towerFill);
  }

  // Gate arches (gatehouse = larger tower with open passage hole), drawn at gate points.
  // River-adjacent gates are rendered as hydraulic outlets instead of round tower-like gatehouses.
  const seenGatePoint = new Set<string>();
  for (const p of gates) {
    const k = `${p.x.toFixed(4)},${p.y.toFixed(4)}`;
    if (seenGatePoint.has(k)) continue;
    seenGatePoint.add(k);
    const cx = (offsetX + p.x * W).toFixed(1);
    const cy = (offsetY + p.y * W).toFixed(1);
    const isHydraulicGate = river ? distanceToRiver(p, river) <= HYDRAULIC_GATE_DISTANCE : false;
    if (isHydraulicGate) {
      const hydType = hydMap.get(k) ?? 'culvert';
      svg += renderHydraulicOutlet(Number(cx), Number(cy), towerRadius, hydType, embeddedDrainStyle);
      // Door marker: hydraulic gates still need explicit opening semantics.
      svg += renderGateDoorMarker(Number(cx), Number(cy), grayedDoorColor(hydType), grayedDoorWidth(towerRadius));
    } else {
      const gr = towerRadius + 3;
      svg += `<circle cx="${cx}" cy="${cy}" r="${(gr + 1.5).toFixed(1)}" fill="${MAP_STYLE.wallStroke}" />`; // ink ring
      svg += `<circle cx="${cx}" cy="${cy}" r="${gr.toFixed(1)}" fill="${MAP_STYLE.wallFill}" stroke="${MAP_STYLE.wallStroke}" stroke-width="1.2" />`; // gatehouse body
      svg += `<circle cx="${cx}" cy="${cy}" r="${(gr * 0.42).toFixed(1)}" fill="${MAP_STYLE.cityFill}" stroke="${MAP_STYLE.wallStroke}" stroke-width="0.7" />`; // passage arch
      svg += renderGateDoorMarker(Number(cx), Number(cy), MAP_STYLE.wallStroke, 2.2);
    }
  }

  svg += `</g>`;
  return svg;
}

/**
 * Convenience: renders both sections and towers together.
 * Use renderWallSections + renderWallTowers separately for layering control.
 */
export function renderWall(
  boundary: Point[],
  gates: Point[],
  _rng: PRNG,
  opts: WallOptions,
  river: River | null = null,
  hydraulicNodes: HydraulicNode[] = [],
): string {
  return renderWallSections(boundary, gates, opts, river) + renderWallTowers(boundary, gates, opts, river, hydraulicNodes, true);
}

function renderHydraulicOutlet(
  cx: number,
  cy: number,
  towerRadius: number,
  type: 'culvert' | 'watergate',
  embeddedDrainStyle: boolean,
): string {
  // Drain nodes should read as wall-embedded openings, not circular markers.
  const drainStroke = '#6f6f6f';
  const drainFill = '#9d9d9d';
  const r = type === 'watergate' ? towerRadius + 2.5 : towerRadius + 2.0;
  let svg = `<g class="hydraulic-outlet">`;
  if (embeddedDrainStyle) {
    const halfW = Math.max(3.2, r * 0.72);
    const halfH = Math.max(1.8, r * 0.32);
    svg += `<rect class="hydraulic-outlet-slot" x="${(cx - halfW).toFixed(1)}" y="${(cy - halfH).toFixed(1)}" width="${(halfW * 2).toFixed(1)}" height="${(halfH * 2).toFixed(1)}" rx="${Math.max(1.1, halfH * 0.55).toFixed(1)}" fill="${drainFill}" stroke="${drainStroke}" stroke-width="1.0" />`;
    svg += `<line class="hydraulic-outlet-slot-core" x1="${(cx - halfW * 0.68).toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(cx + halfW * 0.68).toFixed(1)}" y2="${cy.toFixed(1)}" stroke="#7a7a7a" stroke-width="0.9" stroke-linecap="round" />`;
  } else {
    svg += `<circle class="hydraulic-outlet-circle" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r + 1.4).toFixed(1)}" fill="${drainStroke}" />`;
    svg += `<circle class="hydraulic-outlet-circle" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${drainFill}" stroke="${drainStroke}" stroke-width="0.9" />`;
  }
  svg += `</g>`;
  return svg;
}

function renderGateDoorMarker(cx: number, cy: number, stroke: string, halfSpan: number): string {
  return `<line class="gate-door-marker" x1="${(cx - halfSpan).toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(cx + halfSpan).toFixed(1)}" y2="${cy.toFixed(1)}" stroke="${stroke}" stroke-width="1.1" stroke-linecap="round" />`;
}

function grayedDoorColor(type: 'culvert' | 'watergate'): string {
  return type === 'watergate' ? '#555555' : '#666666';
}

function grayedDoorWidth(towerRadius: number): number {
  return Math.max(1.7, towerRadius * 0.22);
}
