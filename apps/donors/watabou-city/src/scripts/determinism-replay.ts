// @ts-nocheck
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { generateCity } from '../pipeline/generateCity';
import { createFeatureFlags, FeatureFlags } from '../config/featureFlags';

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

function stableStringify(value: unknown): string {
  const seen = new WeakSet();
  const stringify = (v: unknown): unknown => {
    if (v === null || typeof v !== 'object') return v;
    if (seen.has(v as object)) return '[Circular]';
    seen.add(v as object);
    if (Array.isArray(v)) return v.map(stringify);
    const obj = v as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(obj).sort()) out[key] = stringify(obj[key]);
    return out;
  };
  return JSON.stringify(stringify(value));
}

function hashModel(model: ReturnType<typeof generateCity>): string {
  const payload = {
    boundary: model.boundary,
    gates: model.gates,
    roads: model.roads,
    parcels: model.parcels,
    assignments: model.assignments,
    buildings: model.buildings,
    farms: model.farms,
    diagnostics: model.diagnostics,
    evidence: model.evidence,
    decision: model.decision,
  };
  return createHash('sha256').update(stableStringify(payload)).digest('hex');
}

function parseArgValue(name: string, fallback: string): string {
  const match = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (!match) return fallback;
  return match.slice(name.length + 1);
}

const strict = process.argv.includes('--strict');
const artifactsDir = resolve(parseArgValue('--artifacts-dir', 'artifacts/determinism'));
const corpusPath = resolve(parseArgValue('--seeds-file', 'tests/fixtures/seeds/anti-regression.json'));
const replayCount = Number(parseArgValue('--replay-count', '3'));

const corpus = JSON.parse(readFileSync(corpusPath, 'utf-8')) as SeedCorpus;
mkdirSync(artifactsDir, { recursive: true });

const report: {
  generatedAt: string;
  strict: boolean;
  replayCount: number;
  failures: Array<{ seed: number; profile: string; hashes: string[] }>;
  results: Array<{ seed: number; profile: string; hash: string }>;
} = {
  generatedAt: new Date().toISOString(),
  strict,
  replayCount,
  failures: [],
  results: [],
};

for (const seedDef of corpus.seeds) {
  for (const profile of corpus.flagProfiles) {
    const hashes: string[] = [];
    for (let i = 0; i < replayCount; i++) {
      const flags = createFeatureFlags(profile.flags);
      const model = generateCity(seedDef.seed, corpus.citySize, flags);
      hashes.push(hashModel(model));
    }
    const unique = Array.from(new Set(hashes));
    if (unique.length !== 1) {
      report.failures.push({
        seed: seedDef.seed,
        profile: profile.id,
        hashes,
      });
    }
    report.results.push({
      seed: seedDef.seed,
      profile: profile.id,
      hash: unique[0],
    });
  }
}

const outPath = resolve(artifactsDir, 'determinism-report.json');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(report, null, 2));

if (report.failures.length > 0 && strict) {
  console.error(`Determinism replay failed: ${report.failures.length} unstable combinations`);
  process.exit(1);
}

console.log(`Determinism replay completed: ${report.results.length} combinations`);
console.log(`Report: ${outPath}`);
