// @ts-nocheck
import { generateCity } from '../pipeline/generateCity';
import { createFeatureFlags } from '../config/featureFlags';
import type { CityModel } from '../pipeline/generateCity';

type FlagOverrides = Parameters<typeof createFeatureFlags>[0];

interface CaseDef {
  name: string;
  flags: FlagOverrides;
}

interface Metrics {
  invariantsPass: boolean;
  unresolvedTotal: number;
  buildingWallIntersections: number;
  towerRiverOverlaps: number;
  degenerateBuildings: number;
  buildingAreaCv: number;
}

const SEEDS = [1, 42, 12345];
const SIZE = 20;

const CASES: CaseDef[] = [
  { name: 'feature_cell_first_blocks', flags: { feature_cell_first_blocks: true } },
  { name: 'feature_edge_ownership_boundary', flags: { feature_edge_ownership_boundary: true } },
  { name: 'feature_vertex_anchored_towers', flags: { feature_vertex_anchored_towers: true } },
  { name: 'feature_recursive_subdivision', flags: { feature_recursive_subdivision: true } },
  { name: 'feature_normative_taxonomy', flags: { feature_normative_taxonomy: true } },
  {
    name: 'all_canonical_flags',
    flags: {
      feature_cell_first_blocks: true,
      feature_edge_ownership_boundary: true,
      feature_vertex_anchored_towers: true,
      feature_recursive_subdivision: true,
      feature_normative_taxonomy: true,
    },
  },
];

function polygonAreaAbs(poly: { x: number; y: number }[]): number {
  if (poly.length < 3) return 0;
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length;
    a += poly[i].x * poly[j].y - poly[j].x * poly[i].y;
  }
  return Math.abs(a) * 0.5;
}

function coefficientOfVariation(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  if (mean <= 0) return 0;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance) / mean;
}

function collectMetrics(model: CityModel): Metrics {
  const d = model.diagnostics ?? ({} as Record<string, number>);
  const areas = model.buildings.map((b) => polygonAreaAbs(b.polygon));
  const degenerateBuildings = areas.filter((a) => a < 0.000003).length;

  const unresolvedRoadRiver = Number((d as any).unresolved_road_river_intersections ?? 0);
  const unresolvedRoadWall = Number((d as any).unresolved_road_wall_intersections ?? 0);
  const unresolvedRiverWall = Number((d as any).unresolved_river_wall_intersections ?? 0);
  const unresolvedBuildingWall = Number((d as any).unresolved_building_wall_intersections ?? 0);

  return {
    invariantsPass: Boolean(model.invariants?.all_pass),
    unresolvedTotal: unresolvedRoadRiver + unresolvedRoadWall + unresolvedRiverWall + unresolvedBuildingWall,
    buildingWallIntersections: unresolvedBuildingWall,
    towerRiverOverlaps: Number((d as any).tower_river_overlap_count ?? 0),
    degenerateBuildings,
    buildingAreaCv: coefficientOfVariation(areas),
  };
}

function runCase(seed: number, flags?: FlagOverrides): Metrics {
  const model = generateCity(seed, SIZE, createFeatureFlags(flags));
  return collectMetrics(model);
}

function fmt(m: Metrics): string {
  return `inv=${m.invariantsPass ? 'PASS' : 'FAIL'}, unresolved=${m.unresolvedTotal}, bw=${m.buildingWallIntersections}, tr=${m.towerRiverOverlaps}, deg=${m.degenerateBuildings}, cv=${m.buildingAreaCv.toFixed(3)}`;
}

let failed = false;

console.log('=== Feature Flag Regression Comparison ===');
console.log(`Seeds: ${SEEDS.join(', ')} | size=${SIZE}`);

for (const c of CASES) {
  console.log(`\n[CASE] ${c.name}`);
  for (const seed of SEEDS) {
    const base = runCase(seed);
    const cand = runCase(seed, c.flags);
    const regressions: string[] = [];

    if (base.invariantsPass && !cand.invariantsPass) regressions.push('invariants regressed');
    if (cand.unresolvedTotal > base.unresolvedTotal) regressions.push('unresolved intersections increased');
    if (cand.buildingWallIntersections > base.buildingWallIntersections) regressions.push('building-wall intersections increased');
    if (cand.towerRiverOverlaps > base.towerRiverOverlaps) regressions.push('tower-river overlaps increased');
    if (cand.degenerateBuildings > base.degenerateBuildings) regressions.push('degenerate buildings increased');
    if (cand.buildingAreaCv > base.buildingAreaCv * 1.25 + 0.01) regressions.push('building area variance worsened');

    if (regressions.length > 0) {
      failed = true;
      console.log(`  seed=${seed} FAIL`);
      console.log(`    baseline: ${fmt(base)}`);
      console.log(`    current : ${fmt(cand)}`);
      console.log(`    reason  : ${regressions.join('; ')}`);
    } else {
      console.log(`  seed=${seed} PASS`);
      console.log(`    baseline: ${fmt(base)}`);
      console.log(`    current : ${fmt(cand)}`);
    }
  }
}

if (failed) {
  console.log('\nOVERALL: FAIL (regressions detected)');
  process.exit(1);
}

console.log('\nOVERALL: PASS (no regressions detected)');
process.exit(0);
