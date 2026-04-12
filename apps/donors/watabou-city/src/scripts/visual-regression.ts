// @ts-nocheck
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { generateCity } from '../pipeline/generateCity';
import { createFeatureFlags, FeatureFlags } from '../config/featureFlags';
import { renderToSVG } from '../adapters/render/svgRenderer';

type FlagProfile = {
  id: string;
  flags: Partial<FeatureFlags>;
};

type SeedCorpus = {
  version: string;
  citySize: number;
  seeds: Array<{ seed: number; tags: string[] }>;
  flagProfiles: FlagProfile[];
};

type Baseline = Record<string, { svgHash: string }>;

function parseArgValue(name: string, fallback: string): string {
  const match = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (!match) return fallback;
  return match.slice(name.length + 1);
}

function svgHash(svg: string): string {
  return createHash('sha256').update(svg).digest('hex');
}

function baselineKey(seed: number, profile: string): string {
  return `${seed}:${profile}`;
}

const strict = process.argv.includes('--strict');
const updateBaseline = process.argv.includes('--update-baseline');
const requirePng = process.argv.includes('--require-png');
const artifactsDir = resolve(parseArgValue('--artifacts-dir', 'artifacts/visual'));
const corpusPath = resolve(parseArgValue('--seeds-file', 'tests/fixtures/seeds/anti-regression.json'));
const baselinePath = resolve(parseArgValue('--baseline-file', 'tests/fixtures/visual/v1/baseline-hashes.json'));

const corpus = JSON.parse(readFileSync(corpusPath, 'utf-8')) as SeedCorpus;
let baseline: Baseline = {};
if (existsSync(baselinePath)) {
  baseline = JSON.parse(readFileSync(baselinePath, 'utf-8')) as Baseline;
}

const runId = new Date().toISOString().replace(/[:.]/g, '-');
const runDir = resolve(artifactsDir, runId);
mkdirSync(runDir, { recursive: true });

const rsvgAvailable = spawnSync('rsvg-convert', ['--version'], { stdio: 'ignore' }).status === 0;
if (requirePng && !rsvgAvailable) {
  console.error('rsvg-convert is required for PNG export but was not found in PATH.');
  process.exit(1);
}

const report: {
  generatedAt: string;
  strict: boolean;
  updateBaseline: boolean;
  requirePng: boolean;
  rsvgAvailable: boolean;
  mismatches: Array<{ key: string; expected: string; actual: string }>;
  generated: Array<{ key: string; svg: string; png?: string; svgHash: string }>;
} = {
  generatedAt: new Date().toISOString(),
  strict,
  updateBaseline,
  requirePng,
  rsvgAvailable,
  mismatches: [],
  generated: [],
};

for (const seedDef of corpus.seeds) {
  for (const profile of corpus.flagProfiles) {
    const flags = createFeatureFlags(profile.flags);
    const model = generateCity(seedDef.seed, corpus.citySize, flags);
    const svg = renderToSVG(
      model.boundary,
      model.gates,
      model.river,
      model.roads,
      model.parcels,
      model.assignments,
      model.buildings,
      model.farms,
      model.trees,
      model.labels,
      model.pois,
      model.landmarks,
      model.bridges,
      model.parkFeatures,
      model.seed,
      {
        scaffoldPolygons: model.scaffoldPolygons,
        hydraulicNodes: model.hydraulicNodes,
        facetedWalls: flags.feature_edge_ownership_boundary,
      }
    );

    const key = baselineKey(seedDef.seed, profile.id);
    const seedDir = resolve(runDir, `seed-${seedDef.seed}`);
    mkdirSync(seedDir, { recursive: true });
    const svgFile = resolve(seedDir, `${profile.id}.svg`);
    writeFileSync(svgFile, svg, 'utf-8');

    const hash = svgHash(svg);
    if (!updateBaseline && baseline[key] && baseline[key].svgHash !== hash) {
      report.mismatches.push({
        key,
        expected: baseline[key].svgHash,
        actual: hash,
      });
    }

    let pngFile: string | undefined;
    if (rsvgAvailable) {
      pngFile = resolve(seedDir, `${profile.id}.png`);
      const r = spawnSync('rsvg-convert', ['-w', '1024', '-h', '768', '-o', pngFile, svgFile], { stdio: 'inherit' });
      if (r.status !== 0) {
        console.error(`Failed to convert SVG to PNG for ${key}`);
        process.exit(1);
      }
    }

    report.generated.push({
      key,
      svg: svgFile,
      png: pngFile,
      svgHash: hash,
    });
    baseline[key] = { svgHash: hash };
  }
}

if (updateBaseline) {
  mkdirSync(dirname(baselinePath), { recursive: true });
  writeFileSync(baselinePath, JSON.stringify(baseline, null, 2));
}

const reportPath = resolve(runDir, 'visual-regression-report.json');
writeFileSync(reportPath, JSON.stringify(report, null, 2));

if ((strict && report.mismatches.length > 0) || (strict && !existsSync(baselinePath))) {
  console.error(`Visual regression failed: ${report.mismatches.length} mismatches`);
  console.error(`Report: ${reportPath}`);
  process.exit(1);
}

console.log(`Visual regression completed: ${report.generated.length} artifacts`);
console.log(`Report: ${reportPath}`);
