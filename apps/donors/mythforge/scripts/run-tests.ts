// Script to run Vitest suites. Usage: npx tsx scripts/run-tests.ts [suite]
import { execSync } from 'child_process';

const suite = process.argv[2] || 'all';
const mapping: Record<string, string> = {
  'shadow-copy': 'src/lib/shadow-copy/__tests__',
  git: 'src/lib/git/__tests__',
  schema: 'src/lib/schema/__tests__',
  openui: 'src/lib/openui/__tests__',
  all: 'src/**/__tests__/**',
};

const pattern = mapping[suite] || mapping.all;
console.log(`Running vitest for suite: ${suite} -> ${pattern}`);

try {
  execSync(`npx vitest run ${pattern}`, { stdio: 'inherit' });
} catch (err) {
  process.exitCode = (err as any)?.status ?? 1;
}
