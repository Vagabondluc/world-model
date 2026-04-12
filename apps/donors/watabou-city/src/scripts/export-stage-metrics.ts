// @ts-nocheck
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

type RepairTraceEntry = {
  stage?: string;
  invariant_id?: string;
  attempt?: number;
};

function parseArgValue(name: string, fallback: string): string {
  const match = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (!match) return fallback;
  return match.slice(name.length + 1);
}

const corpusPath = resolve(parseArgValue('--seeds-file', 'tests/fixtures/seeds/anti-regression.json'));
const artifactsDir = resolve(parseArgValue('--artifacts-dir', 'artifacts/metrics'));
const runId = process.env.CI_RUN_ID ?? parseArgValue('--run-id', new Date().toISOString().replace(/[:.]/g, '-'));

const corpus = JSON.parse(readFileSync(corpusPath, 'utf-8')) as SeedCorpus;
const outDir = resolve(artifactsDir, runId);
mkdirSync(outDir, { recursive: true });

const summary: {
  generatedAt: string;
  runId: string;
  totalCases: number;
  cases: Array<{ seed: number; profile: string; output: string }>;
} = {
  generatedAt: new Date().toISOString(),
  runId,
  totalCases: 0,
  cases: [],
};

for (const seedDef of corpus.seeds) {
  for (const profile of corpus.flagProfiles) {
    const flags = createFeatureFlags(profile.flags);
    const model = generateCity(seedDef.seed, corpus.citySize, flags);
    const entries = (model.repairTrace?.entries ?? []) as RepairTraceEntry[];

    const stageRepairs: Record<string, number> = {};
    for (const e of entries) {
      const stage = e.stage ?? 'UNKNOWN';
      stageRepairs[stage] = (stageRepairs[stage] ?? 0) + 1;
    }

    const payload = {
      seed: seedDef.seed,
      tags: seedDef.tags,
      profile: profile.id,
      flags,
      diagnostics: model.diagnostics,
      invariantSummary: {
        pass: model.invariants.all_pass,
        failures: model.invariants.failed,
      },
      repairTrace: {
        count: entries.length,
        byStage: stageRepairs,
      },
    };

    const outFile = resolve(outDir, `seed-${seedDef.seed}-${profile.id}.json`);
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, JSON.stringify(payload, null, 2));
    summary.totalCases += 1;
    summary.cases.push({
      seed: seedDef.seed,
      profile: profile.id,
      output: outFile,
    });
  }
}

const summaryFile = resolve(outDir, 'summary.json');
writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
console.log(`Stage metrics exported: ${summary.totalCases} cases`);
console.log(`Summary: ${summaryFile}`);
