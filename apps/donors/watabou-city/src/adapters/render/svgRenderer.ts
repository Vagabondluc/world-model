// @ts-nocheck
import { RoadGraph } from '../../domain/roads/graph';
import { Building } from '../../domain/buildings/synthesize';
import { Parcel } from '../../domain/parcels/subdivide';
import { DistrictAssignment } from '../../domain/districts/assign';
import { FarmField } from '../../domain/rural/farms';
import { Label } from '../../domain/labels/place';
import { Poi } from '../../domain/pois/place';
import { Point } from '../../domain/types';
import { PRNG } from '../../domain/seed/prng';
import { River } from '../../domain/terrain/river';
import { MAP_STYLE } from './style';
import { BridgeStructure, LandmarkStructure, ParkFeature } from '../../domain/structures/features';
import { classifyHydraulicNodes, HydraulicNode } from '../../domain/structures/hydraulic';

import { renderWallSections, renderWallTowers } from '../../svg-elements/wall';
import { renderHouse, HouseType } from '../../svg-elements/house';
import { renderTree } from '../../svg-elements/tree';
import { renderFarm } from '../../svg-elements/farm';
import { renderRiver } from '../../svg-elements/river';

const WIDTH = 1024;
const HEIGHT = 768;
const MAP_SCALE = Math.min(WIDTH, HEIGHT) * 0.9;
const MAP_OFFSET_X = (WIDTH - MAP_SCALE) * 0.5;
const MAP_OFFSET_Y = (HEIGHT - MAP_SCALE) * 0.5 - 24;

const districtToHouseType: Record<string, HouseType> = {
  commercial: 'manor',
  industrial: 'urban',
  residential: 'urban',
  'residential-mid': 'suburb',
  suburb: 'suburb',
  park: 'suburb',
  rural: 'suburb',
};

/**
 * Renders the city model to an SVG string.
 *
 * Layer order (back → front):
 *   0  Background parchment
 *   1  Full-domain Voronoi scaffold (faint)
 *   2  Farm fields (outside walls)
 *   3  City ground fill (inside boundary)
 *   3  Parks / green areas
 *   4  River
 *   5  Roads  ← ground-level paths
 *   6  Buildings + landmarks
 *   7  Wall sections  ← defensive line above built form
 *   8  Wall towers + watergates
 *   9  Bridges  ← explicit road-river structures
 *  10  Trees  ← foreground vegetation
 *  11  POI pins + compass  ← always topmost UI
 */
export function renderToSVG(
  boundary: Point[],
  gates: Point[],
  river: River,
  roads: RoadGraph,
  parcels: Parcel[],
  assignments: DistrictAssignment[],
  buildings: Building[],
  farms: FarmField[],
  trees: Point[],
  labels: Label[],
  pois: Poi[],
  landmarks: LandmarkStructure[],
  bridges: BridgeStructure[],
  parkFeatures: ParkFeature[],
  seed: number,
  options?: {
    showDebug?: boolean;
    showVoronoi?: boolean;
    allowDebugGeometry?: boolean;
    enforceWhitelist?: boolean;
    embeddedDrainStyle?: boolean;
    scaffoldPolygons?: Point[][];
    hydraulicNodes?: HydraulicNode[];
    facetedWalls?: boolean;
  },
): string {
  const showDebug = options?.showDebug ?? false;
  const showVoronoi = options?.showVoronoi ?? false;
  const allowDebugGeometry = options?.allowDebugGeometry ?? true;
  const enforceWhitelist = options?.enforceWhitelist ?? false;
  const embeddedDrainStyle = options?.embeddedDrainStyle ?? true;
  const scaffoldPolygons = options?.scaffoldPolygons ?? [];
  const facetedWalls = options?.facetedWalls ?? false;
  const rng = new PRNG(seed + 9999);

  const toCanvas = (p: Point) => ({
    x: MAP_OFFSET_X + p.x * MAP_SCALE,
    y: MAP_OFFSET_Y + p.y * MAP_SCALE,
  });
  const toSVG = (p: Point) => {
    const c = toCanvas(p);
    return `${c.x.toFixed(2)},${c.y.toFixed(2)}`;
  };
  const polyToSVG = (poly: Point[]) => poly.map(toSVG).join(' ');

  const districtMap = new Map<string, string>();
  for (const a of assignments) districtMap.set(a.parcelId, a.type);
  const parcelMap = new Map(parcels.map((p) => [p.id, p]));

  let svg = `<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" style="background: ${MAP_STYLE.background}">`;

  // ── 0. Background parchment ────────────────────────────────────
  svg += `<rect width="${WIDTH}" height="${HEIGHT}" fill="${MAP_STYLE.background}" />`;

  // ── 1. Full-domain Voronoi scaffold (faint) ────────────────────
  if (showDebug && allowDebugGeometry && showVoronoi && scaffoldPolygons.length > 0) {
    svg += `<g class="scaffold" opacity="0.55">`;
    for (const poly of scaffoldPolygons) {
      if (poly.length < 3) continue;
      svg += `<polygon points="${polyToSVG(poly)}" fill="none" stroke="#a7a18f" stroke-width="0.55" opacity="0.38" />`;
    }
    svg += `</g>`;
  }

  // ── 2. Farm fields ─────────────────────────────────────────────
  const MIN_FARM_AREA = 0.0008;
  const meaningfulFarms = farms.filter(f => {
    let a = 0;
    for (let i = 0; i < f.polygon.length; i++) {
      const j = (i + 1) % f.polygon.length;
      a += f.polygon[i].x * f.polygon[j].y - f.polygon[j].x * f.polygon[i].y;
    }
    return Math.abs(a) * 0.5 >= MIN_FARM_AREA;
  });
  for (let i = 0; i < meaningfulFarms.length; i++) {
    const field = meaningfulFarms[i];
    svg += renderFarm(field.polygon, rng.fork(`farm-${i}`), {
      scale: MAP_SCALE,
      offsetX: MAP_OFFSET_X,
      offsetY: MAP_OFFSET_Y,
      hatchAngle: field.hatchAngle,
      hatchSpacing: field.hatchSpacing,
    });
  }

  // ── 3. City ground fill (inside boundary) ─────────────────────
  svg += `<polygon points="${polyToSVG(boundary)}" fill="${MAP_STYLE.cityFill}" stroke="none" />`;

  // ── 3. Parks / green areas ─────────────────────────────────────
  if (parkFeatures.length > 0) {
    for (const park of parkFeatures) {
      svg += renderParkFeature(park, toCanvas);
    }
  } else {
    for (const assignment of assignments) {
      if (assignment.type !== 'park') continue;
      const parcel = parcelMap.get(assignment.parcelId);
      if (!parcel) continue;
      svg += renderParkPatch(parcel.polygon, rng.fork(`park-${assignment.parcelId}`), toCanvas);
    }
  }

  // ── 4. River ───────────────────────────────────────────────────
  svg += renderRiver(river.points, { scale: MAP_SCALE, offsetX: MAP_OFFSET_X, offsetY: MAP_OFFSET_Y, width: river.width * 1.3 });

  // ── 5. Roads (ground paths, before buildings) ─────────────────
  // Build set of road edge IDs that have bridges for quick lookup
  const bridgeEdgeIds = new Set(bridges.map(b => b.roadEdgeId));
  const bridgeInfluenceEdges = new Set<string>();
  for (const b of bridges) {
    const crossing = roads.edges.find((e) => e.id === b.roadEdgeId);
    if (!crossing) continue;
    bridgeInfluenceEdges.add(crossing.id);
    for (const e of roads.edges) {
      if (e.u === crossing.u || e.v === crossing.u || e.u === crossing.v || e.v === crossing.v) {
        bridgeInfluenceEdges.add(e.id);
      }
    }
  }
  
  roads.edges.forEach((e, index) => {
    const u = roads.nodes.get(e.u)!.point;
    const v = roads.nodes.get(e.v)!.point;
    
    // Check if this segment crosses the river
    if (river && river.points.length >= 2 && segmentCrossesRiver(u, v, river.points)) {
      // Skip rendering if there's no bridge at this crossing
      if (!bridgeEdgeIds.has(e.id)) {
        return; // Don't render this segment - it crosses river without a bridge
      }
    }
    
    const isT = e.kind === 'trunk';
    const isS = e.kind === 'secondary';
    const bridgeInfluenced = bridgeInfluenceEdges.has(e.id);
    let strokeW = isT ? 6 : isS ? 3.5 : 2;
    if (bridgeInfluenced) strokeW *= 1.18;
    const roadColor = bridgeInfluenced && e.kind === 'local'
      ? MAP_STYLE.roadFillSecond
      : isT ? MAP_STYLE.roadFillTrunk : isS ? MAP_STYLE.roadFillSecond : MAP_STYLE.roadFillLocal;
    const nearRiver = river && river.points.length >= 2
      ? segmentToPolylineDistance(u, v, river.points) < 0.02
      : false;
    const baseBend = isT ? 0.012 : isS ? 0.02 : 0.026;
    const bend = nearRiver && !bridgeEdgeIds.has(e.id) ? 0 : baseBend;
    const d = curvedRoadPath(u, v, rng.fork(`road-${index}`), MAP_SCALE, MAP_OFFSET_X, MAP_OFFSET_Y, bend);
    svg += `<path d="${d}" fill="none" stroke="${roadColor}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" />`;
  });

  // Bridgeheads: small widened nodes at both landings to emphasize hierarchy.
  for (const b of bridges) {
    svg += renderBridgeheadsAt(b, toCanvas);
  }

  // ── 7. Wall sections (stone over roads and buildings) ──────────
  const wallOpts = {
    scale: MAP_SCALE,
    offsetX: MAP_OFFSET_X,
    offsetY: MAP_OFFSET_Y,
    wallWidth: 3.6,
    towerInterval: 3,
    towerRadius: 4.8,
    towerShape: 'round' as const,
    facetedWalls,
  };
  // ── 6. Buildings + landmark footprints (above roads) ───────────
  if (showDebug) {
    for (const p of parcels) {
      svg += `<polygon points="${polyToSVG(p.polygon)}" fill="none" stroke="${MAP_STYLE.debugParcel}" stroke-width="0.5" opacity="0.5" />`;
    }
  }
  for (const b of buildings) {
    const districtType = districtMap.get(b.parcelId) ?? 'residential';
    const houseType: HouseType = districtToHouseType[districtType] ?? 'urban';
    svg += renderHouse(b.polygon, { scale: MAP_SCALE, offsetX: MAP_OFFSET_X, offsetY: MAP_OFFSET_Y, type: houseType });
  }
  for (const landmark of landmarks) {
    svg += renderLandmark(landmark, toCanvas);
  }

  svg += renderWallSections(boundary, gates, wallOpts, river);

  // ── 8. Wall towers + hydraulic outlets/watergates ─────────────
  const hydraulicNodes = options?.hydraulicNodes ?? classifyHydraulicNodes(gates, river, bridges);
  svg += renderWallTowers(boundary, gates, wallOpts, river, hydraulicNodes, embeddedDrainStyle);

  // ── 9. Bridges (above walls for readability) ───────────────────
  svg += `<g class="bridges">`;
  for (const b of bridges) {
    const cp = toCanvas(b.point);
    svg += renderBridgeAt(cp.x, cp.y, b.angle, b.kind);
  }
  svg += `</g>`;

  // ── 10. Trees (foreground vegetation) ──────────────────────────
  const MAX_TREES = 220;
  const sampledTrees = trees.length > MAX_TREES
    ? trees.filter((_, i) => i % Math.ceil(trees.length / MAX_TREES) === 0)
    : trees;
  for (let i = 0; i < sampledTrees.length; i++) {
    svg += renderTree(sampledTrees[i], rng.fork(`tree-${i}`), { scale: MAP_SCALE, offsetX: MAP_OFFSET_X, offsetY: MAP_OFFSET_Y, radius: 2.8 });
  }

  // ── 11. Labels (debug only) ────────────────────────────────────
  if (showDebug) {
    for (const l of labels) {
      const lp = toCanvas(l.point);
      svg += `<text x="${lp.x.toFixed(2)}" y="${lp.y.toFixed(2)}" font-family="serif" font-size="11" fill="${MAP_STYLE.debugLabel}" text-anchor="middle" font-weight="bold">${l.text}</text>`;
    }
  }

  // ── 12. POI pins (always topmost) ─────────────────────────────
  for (const poi of pois) {
    const cp = toCanvas(poi.point);
    const x = cp.x;
    const y = cp.y;
    const hasPoiLandmark = landmarks.some((lm) => lm.poiId === poi.id);
    if (!hasPoiLandmark && poi.id === 1) {
      svg += renderFortressAt(x, y);
    }
    svg += `<g class="poi">`;
    svg += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="8" fill="#e8dcc1" stroke="#5a4e3a" stroke-width="1.2" />`;
    svg += `<text x="${x.toFixed(2)}" y="${(y + 3).toFixed(2)}" font-family="serif" font-size="10" text-anchor="middle" fill="#2f2a20" font-weight="bold">${poi.id}</text>`;
    svg += `</g>`;
  }

  // ── 13. Compass rose ───────────────────────────────────────────
  const compassX = WIDTH - 56;
  const compassY = HEIGHT - 28;
  svg += `<g class="compass" transform="translate(${compassX},${compassY})">`;
  svg += `<circle cx="0" cy="0" r="19" fill="#d8cfb5" stroke="#5f533d" stroke-width="1" />`;
  svg += `<polygon points="0,-16 3,-2 0,-5 -3,-2" fill="#5a4e3a" />`;
  svg += `<polygon points="0,16 3,2 0,5 -3,2" fill="#8a7a60" />`;
  svg += `<text x="0" y="-24" text-anchor="middle" font-size="9" font-family="serif" fill="#3a3224">N</text>`;
  svg += `</g>`;

  svg += `</svg>`;
  if (enforceWhitelist && !showDebug) {
    enforceRenderWhitelist(svg);
  }
  return svg;
}

function curvedRoadPath(a: Point, b: Point, rng: PRNG, scale: number, offsetX: number, offsetY: number, bend: number): string {
  const ax = offsetX + a.x * scale;
  const ay = offsetY + a.y * scale;
  const bx = offsetX + b.x * scale;
  const by = offsetY + b.y * scale;
  const mx = (ax + bx) * 0.5;
  const my = (ay + by) * 0.5;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const offset = (rng.nextFloat() - 0.5) * bend * scale;
  const cx = mx + nx * offset;
  const cy = my + ny * offset;
  return `M ${ax.toFixed(2)} ${ay.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${bx.toFixed(2)} ${by.toFixed(2)}`;
}

function renderFortressAt(x: number, y: number): string {
  const w = 42;
  const h = 28;
  let svg = `<g class="fortress">`;
  svg += `<rect x="${(x - w * 0.5).toFixed(2)}" y="${(y - h * 0.5).toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" fill="#bca57f" stroke="#4b3f2d" stroke-width="1.5" />`;
  svg += `<rect x="${(x - 8).toFixed(2)}" y="${(y - 6).toFixed(2)}" width="16" height="12" fill="#cbb28a" stroke="#4b3f2d" stroke-width="1.2" />`;
  svg += `<rect x="${(x - w * 0.5 - 3).toFixed(2)}" y="${(y - h * 0.5 - 3).toFixed(2)}" width="8" height="8" fill="#9a8564" stroke="#4b3f2d" stroke-width="1" />`;
  svg += `<rect x="${(x + w * 0.5 - 5).toFixed(2)}" y="${(y - h * 0.5 - 3).toFixed(2)}" width="8" height="8" fill="#9a8564" stroke="#4b3f2d" stroke-width="1" />`;
  svg += `<rect x="${(x - w * 0.5 - 3).toFixed(2)}" y="${(y + h * 0.5 - 5).toFixed(2)}" width="8" height="8" fill="#9a8564" stroke="#4b3f2d" stroke-width="1" />`;
  svg += `<rect x="${(x + w * 0.5 - 5).toFixed(2)}" y="${(y + h * 0.5 - 5).toFixed(2)}" width="8" height="8" fill="#9a8564" stroke="#4b3f2d" stroke-width="1" />`;
  svg += `</g>`;
  return svg;
}

function renderParkPatch(
  poly: Point[],
  rng: PRNG,
  toCanvas: (p: Point) => { x: number; y: number },
): string {
  if (poly.length < 3) return '';
  const c = centroid(poly);
  const inset = 0.78 + rng.nextFloat() * 0.12;
  const inner = poly.map((p) => ({
    x: c.x + (p.x - c.x) * inset,
    y: c.y + (p.y - c.y) * inset,
  }));
  const outerPts = poly.map((p) => {
    const cp = toCanvas(p);
    return `${cp.x.toFixed(2)},${cp.y.toFixed(2)}`;
  }).join(' ');
  const innerPts = inner.map((p) => {
    const cp = toCanvas(p);
    return `${cp.x.toFixed(2)},${cp.y.toFixed(2)}`;
  }).join(' ');

  let svg = `<g class="park">`;
  svg += `<polygon points="${outerPts}" fill="${MAP_STYLE.parkFill}" opacity="0.46" stroke="none" />`;
  svg += `<polygon points="${innerPts}" fill="${MAP_STYLE.parkFill}" opacity="0.65" stroke="#6f8d51" stroke-width="0.45" />`;
  svg += `</g>`;
  return svg;
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

function renderBridgeAt(x: number, y: number, angle: number, kind: 'trunk' | 'secondary' | 'local'): string {
  const length = kind === 'trunk' ? 42 : kind === 'secondary' ? 32 : 24;
  const deckW = kind === 'trunk' ? 12 : kind === 'secondary' ? 9 : 7;
  const rail = kind === 'trunk' ? 1.6 : kind === 'secondary' ? 1.3 : 1.0;
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const vx = -uy;
  const vy = ux;
  const hl = length * 0.5;
  const hw = deckW * 0.5;

  const p1 = { x: x - ux * hl - vx * hw, y: y - uy * hl - vy * hw };
  const p2 = { x: x + ux * hl - vx * hw, y: y + uy * hl - vy * hw };
  const p3 = { x: x + ux * hl + vx * hw, y: y + uy * hl + vy * hw };
  const p4 = { x: x - ux * hl + vx * hw, y: y - uy * hl + vy * hw };

  const left1 = { x: x - ux * hl - vx * (hw + rail), y: y - uy * hl - vy * (hw + rail) };
  const left2 = { x: x + ux * hl - vx * (hw + rail), y: y + uy * hl - vy * (hw + rail) };
  const right1 = { x: x - ux * hl + vx * (hw + rail), y: y - uy * hl + vy * (hw + rail) };
  const right2 = { x: x + ux * hl + vx * (hw + rail), y: y + uy * hl + vy * (hw + rail) };

  const poly = `${p1.x.toFixed(2)},${p1.y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)} ${p3.x.toFixed(2)},${p3.y.toFixed(2)} ${p4.x.toFixed(2)},${p4.y.toFixed(2)}`;
  const fill = kind === 'trunk' ? '#ae9a78' : kind === 'secondary' ? '#b7a486' : '#c1b191';
  const strokeW = kind === 'trunk' ? 1.4 : kind === 'secondary' ? 1.1 : 0.9;
  let svg = `<g class="bridge bridge-${kind}">`;
  svg += `<polygon points="${poly}" fill="${fill}" stroke="#4f4230" stroke-width="${strokeW}" />`;
  svg += `<line x1="${left1.x.toFixed(2)}" y1="${left1.y.toFixed(2)}" x2="${left2.x.toFixed(2)}" y2="${left2.y.toFixed(2)}" stroke="#594a36" stroke-width="${strokeW}" />`;
  svg += `<line x1="${right1.x.toFixed(2)}" y1="${right1.y.toFixed(2)}" x2="${right2.x.toFixed(2)}" y2="${right2.y.toFixed(2)}" stroke="#594a36" stroke-width="${strokeW}" />`;
  svg += `</g>`;
  return svg;
}

function renderBridgeheadsAt(
  bridge: BridgeStructure,
  toCanvas: (p: Point) => { x: number; y: number },
): string {
  const landingOffset = 0.022;
  const ux = Math.cos(bridge.angle);
  const uy = Math.sin(bridge.angle);
  const p1 = { x: bridge.point.x + ux * landingOffset, y: bridge.point.y + uy * landingOffset };
  const p2 = { x: bridge.point.x - ux * landingOffset, y: bridge.point.y - uy * landingOffset };
  const c1 = toCanvas(p1);
  const c2 = toCanvas(p2);
  const r = bridge.kind === 'trunk' ? 7 : bridge.kind === 'secondary' ? 6 : 5;
  let svg = `<g class="bridgeheads">`;
  svg += `<circle cx="${c1.x.toFixed(2)}" cy="${c1.y.toFixed(2)}" r="${r}" fill="#d7ccb2" opacity="0.9" stroke="#6e624a" stroke-width="0.8" />`;
  svg += `<circle cx="${c2.x.toFixed(2)}" cy="${c2.y.toFixed(2)}" r="${r}" fill="#d7ccb2" opacity="0.9" stroke="#6e624a" stroke-width="0.8" />`;
  svg += `</g>`;
  return svg;
}

function renderParkFeature(park: ParkFeature, toCanvas: (p: Point) => { x: number; y: number }): string {
  const pts = park.polygon.map((p) => {
    const c = toCanvas(p);
    return `${c.x.toFixed(2)},${c.y.toFixed(2)}`;
  }).join(' ');
  if (park.featureType === 'node') {
    return `<polygon points="${pts}" fill="#d7ccb2" opacity="0.92" stroke="#6e624a" stroke-width="0.6" />`;
  }
  if (park.featureType === 'quay') {
    return `<polygon points="${pts}" fill="#cfc3a8" opacity="0.9" stroke="#8f7f63" stroke-width="0.55" />`;
  }
  if (park.featureType === 'plaza') {
    return `<polygon points="${pts}" fill="#d8ceb4" opacity="0.72" stroke="#93856d" stroke-width="0.45" />`;
  }
  if (park.featureType === 'path') {
    return `<polygon points="${pts}" fill="#d9cdaf" opacity="0.86" stroke="#a89775" stroke-width="0.35" />`;
  }
  return `<polygon points="${pts}" fill="${MAP_STYLE.parkFill}" opacity="0.66" stroke="#6f8d51" stroke-width="0.45" />`;
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

function segmentToPolylineDistance(a: Point, b: Point, polyline: Point[]): number {
  if (polyline.length < 2) return Infinity;
  let best = Infinity;
  for (let i = 0; i < polyline.length - 1; i++) {
    const c = polyline[i];
    const d = polyline[i + 1];
    const da = pointToSegmentDistance(a, c, d);
    const db = pointToSegmentDistance(b, c, d);
    const dc = pointToSegmentDistance(c, a, b);
    const dd = pointToSegmentDistance(d, a, b);
    best = Math.min(best, da, db, dc, dd);
    if (best < 1e-6) return 0;
  }
  return best;
}

function enforceRenderWhitelist(svg: string): void {
  const forbiddenTokens = [
    'class="scaffold"',
    'VoronoiCell',
    'SubdivisionCell',
    'HexGrid',
    'DebugPolygon',
    'ScaffoldCell',
    'RawBlockPolygon',
  ];
  for (const token of forbiddenTokens) {
    if (svg.includes(token)) {
      throw new Error(`Render whitelist violation: forbidden token '${token}' present in production render`);
    }
  }
}

function renderLandmark(landmark: LandmarkStructure, toCanvas: (p: Point) => { x: number; y: number }): string {
  const pts = landmark.polygon.map((p) => {
    const c = toCanvas(p);
    return `${c.x.toFixed(2)},${c.y.toFixed(2)}`;
  }).join(' ');
  if (landmark.kind === 'fortress') {
    const partClass = landmark.id.includes('keep')
      ? 'fortress-keep'
      : landmark.id.includes('tower')
        ? 'fortress-tower'
        : 'fortress-bailey';
    const fill = partClass === 'fortress-keep' ? '#cdb995' : partClass === 'fortress-tower' ? '#9f8b69' : '#bca57f';
    const strokeW = partClass === 'fortress-keep' ? 1.8 : 1.2;
    let svg = `<polygon class="${partClass}" points="${pts}" fill="${fill}" stroke="#4b3f2d" stroke-width="${strokeW}" />`;
    if (partClass === 'fortress-bailey') {
      // Inner-fortress mini wall pattern around the bailey footprint.
      svg += `<polygon points="${pts}" fill="none" stroke="#5e513c" stroke-width="2.3" />`;
      svg += `<polygon points="${pts}" fill="none" stroke="#9d8b6a" stroke-width="1.2" />`;
      for (const p of landmark.polygon) {
        const c = toCanvas(p);
        svg += `<circle cx="${c.x.toFixed(2)}" cy="${c.y.toFixed(2)}" r="2.3" fill="#8f7c5d" stroke="#4b3f2d" stroke-width="0.7" />`;
      }
    }
    return svg;
  }
  return `<polygon points="${pts}" fill="#c5ad84" stroke="#4b3f2d" stroke-width="1.1" />`;
}

/**
 * Checks if a line segment crosses any segment of the river polyline.
 */
function segmentCrossesRiver(a: Point, b: Point, riverPoints: Point[]): boolean {
  if (riverPoints.length < 2) return false;
  for (let i = 0; i < riverPoints.length - 1; i++) {
    if (segmentIntersection(a, b, riverPoints[i], riverPoints[i + 1])) {
      return true;
    }
  }
  return false;
}

/**
 * Computes the intersection point of two line segments, or null if they don't intersect.
 */
function segmentIntersection(a: Point, b: Point, c: Point, d: Point): Point | null {
  const r = { x: b.x - a.x, y: b.y - a.y };
  const s = { x: d.x - c.x, y: d.y - c.y };
  const den = r.x * s.y - r.y * s.x;
  if (Math.abs(den) < 1e-12) return null;
  const qp = { x: c.x - a.x, y: c.y - a.y };
  const t = (qp.x * s.y - qp.y * s.x) / den;
  const u = (qp.x * r.y - qp.y * r.x) / den;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: a.x + r.x * t, y: a.y + r.y * t };
}

