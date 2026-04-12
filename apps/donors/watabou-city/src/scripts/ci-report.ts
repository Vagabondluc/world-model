// @ts-nocheck
/**
 * CI Quality Reporting Script
 *
 * Outputs invariant pass matrix, repair counts, and release decisions for a set of seeds.
 * Uses the same release decision path as runtime (makeA6ReleaseDecision + evaluateBlockerConditions).
 *
 * Usage:
 *   npx tsx src/scripts/ci-report.ts [seeds...]     # Informational mode (always exits 0)
 *   npx tsx src/scripts/ci-report.ts --strict       # Strict mode (exits 1 if any blockers)
 *   npx tsx src/scripts/ci-report.ts --strict 42    # Strict mode with specific seeds
 *
 * Exit codes:
 *   Default mode: 0 (informational, reports issues but doesn't fail)
 *   --strict mode: 0 if all seeds pass, 1 if any seed has blockers
 */

import { generateCity } from '../pipeline/generateCity';
import {
  makeA6ReleaseDecision,
  evaluateBlockerConditions,
  evaluateMajorConditions,
  evaluateMinorConditions,
  BLOCKER_CONDITIONS,
  MAJOR_CONDITIONS,
  MINOR_CONDITIONS
} from '../pipeline/release';
import {
  CANONICAL_SEEDS,
  DEFAULT_CI_CITY_SIZE,
  CI_REPORT_VERSION,
  type CISeedReport,
  type CIReport,
  type CIReportSummary,
  type InvariantSeverity
} from '../config/ciQuality';
import type { CityDiagnostics } from '../domain/diagnostics/metrics';
import type { BuildingDensityBaseline } from '../config/ciQuality';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Extension diagnostic column specification.
 * These are first-class geometry collision diagnostics that deserve explicit reporting.
 */
interface ExtensionDiagnosticColumn {
  key: keyof CityDiagnostics;
  label: string;
  invariantId: string;
  description: string;
}

const EXTENSION_DIAGNOSTIC_COLUMNS: ExtensionDiagnosticColumn[] = [
  {
    key: 'tower_river_overlap_count',
    label: 'Tower/River',
    invariantId: 'CRC-A6-081-T',
    description: 'Towers overlapping river geometry'
  },
  {
    key: 'gate_gap_clipping_count',
    label: 'Gate Gap Clip',
    invariantId: 'CRC-A6-011-G',
    description: 'Gates where wall is not properly clipped'
  },
  {
    key: 'building_wall_intersection_count',
    label: 'Bldg/Wall',
    invariantId: 'CRC-A6-043-W',
    description: 'Buildings intersecting wall geometry'
  }
];

/**
 * Loads the building density baseline from the fixture file.
 */
function loadBuildingDensityBaseline(): Record<string, BuildingDensityBaseline> {
  try {
    // Try multiple paths to find the baseline file
    const cwd = process.cwd();
    const possiblePaths = [
      path.resolve(cwd, 'tests/fixtures/building-density-baseline.json'),
      path.resolve(cwd, '2nd/tests/fixtures/building-density-baseline.json')
    ];
    
    for (const baselinePath of possiblePaths) {
      if (fs.existsSync(baselinePath)) {
        const content = fs.readFileSync(baselinePath, 'utf-8');
        const data = JSON.parse(content);
        console.error(`Loaded baseline from: ${baselinePath}`);
        return data.baselineSeedResults as Record<string, BuildingDensityBaseline>;
      }
    }
    
    console.error('Baseline file not found in any of the expected locations');
    // Return empty baseline if file not found
    return {};
  } catch (error) {
    console.error('Error loading baseline:', error);
    // Return empty baseline on error
    return {};
  }
}

/**
 * Generates a CI report for a single seed using the canonical release gate functions.
 */
function generateReport(
  seed: number,
  size: number = DEFAULT_CI_CITY_SIZE,
  baseline?: BuildingDensityBaseline
): CISeedReport {
  const model = generateCity(seed, size);
  const diagnostics = model.diagnostics;

  // Use canonical release gate functions - same as runtime
  const blockerFailures = evaluateBlockerConditions(diagnostics);
  const majorFailures = evaluateMajorConditions(diagnostics);
  const minorFailures = evaluateMinorConditions(diagnostics);

  // Build invariant matrix from the canonical condition lists
  const invariantMatrix: Record<string, { passed: boolean; severity: InvariantSeverity }> = {};

  // Add blocker invariants
  for (const condition of BLOCKER_CONDITIONS) {
    invariantMatrix[condition.id] = {
      passed: !blockerFailures.includes(condition.id),
      severity: 'blocker'
    };
  }

  // Add major invariants
  for (const condition of MAJOR_CONDITIONS) {
    invariantMatrix[condition.id] = {
      passed: !majorFailures.includes(condition.id),
      severity: 'major'
    };
  }

  // Add minor invariants
  for (const condition of MINOR_CONDITIONS) {
    invariantMatrix[condition.id] = {
      passed: !minorFailures.includes(condition.id),
      severity: 'minor'
    };
  }

  // Count repairs
  const repairCount = model.repairTrace?.entries?.length ?? 0;

  // Make release decision using the canonical function (same as runtime)
  const consensus = { consensus: 'pass' as const, integrity_pass: true };
  const policy = { passed: true, status: 'pass' as const, policyResults: [] };
  const decision = makeA6ReleaseDecision(
    true,
    consensus,
    policy,
    diagnostics,
    'baseline',
    true,
    false,
    repairCount
  );

  // Extract building cell-fill diagnostics
  const buildingCellFillDiagnostics = {
    building_cell_target_coverage: diagnostics.building_cell_target_coverage ?? 0.3,
    building_cell_actual_coverage: diagnostics.building_cell_actual_coverage ?? 0,
    building_alignment_error_mean: diagnostics.building_alignment_error_mean ?? 0,
    building_pack_rejection_count: diagnostics.building_pack_rejection_count ?? 0
  };

  // Calculate deltas vs baseline if available
  let coverageDelta: number | undefined;
  let alignmentDelta: number | undefined;
  
  if (baseline) {
    coverageDelta = buildingCellFillDiagnostics.building_cell_actual_coverage - baseline.mean_cell_coverage;
    alignmentDelta = buildingCellFillDiagnostics.building_alignment_error_mean - baseline.mean_alignment_error_deg;
  }

  return {
    seed,
    size,
    invariantMatrix,
    repairCount,
    releaseDecision: {
      allowed: decision.approved,
      blockers: decision.a6_blockers, // Directly from evaluateBlockerConditions
      a6_invariants_pass: decision.a6_invariants_pass ?? true
    },
    // Include extension diagnostics in the report
    extensionDiagnostics: {
      tower_river_overlap_count: diagnostics.tower_river_overlap_count ?? 0,
      gate_gap_clipping_count: diagnostics.gate_gap_clipping_count ?? 0,
      building_wall_intersection_count: diagnostics.building_wall_intersection_count ?? 0
    },
    // Include building cell-fill diagnostics
    buildingCellFillDiagnostics,
    coverageDelta,
    alignmentDelta
  };
}

/**
 * Formats reports for console output with extension diagnostic columns.
 */
function formatReport(reports: CISeedReport[], strictMode: boolean): string {
  const lines: string[] = [];

  lines.push('# CI Quality Report');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Mode: ${strictMode ? 'STRICT (exit 1 on blockers)' : 'INFORMATIONAL (always exit 0)'}`);
  lines.push('');

  // Summary
  const totalSeeds = reports.length;
  const passedSeeds = reports.filter(r => r.releaseDecision.a6_invariants_pass).length;
  const totalRepairs = reports.reduce((sum, r) => sum + r.repairCount, 0);

  lines.push('## Summary');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Seeds Tested | ${totalSeeds} |`);
  lines.push(`| Seeds Passed | ${passedSeeds} |`);
  lines.push(`| Seeds Failed | ${totalSeeds - passedSeeds} |`);
  lines.push(`| Total Repairs | ${totalRepairs} |`);
  lines.push(`| Strict Mode | ${strictMode ? 'Yes' : 'No'} |`);
  lines.push('');

  // Extension Diagnostics Section
  lines.push('## Extension Diagnostics (First-Class Geometry Collisions)');
  lines.push('| Seed | Tower/River | Gate Gap Clip | Bldg/Wall |');
  lines.push('|------|-------------|---------------|-----------|');

  for (const report of reports) {
    const ext = report.extensionDiagnostics ?? { tower_river_overlap_count: 0, gate_gap_clipping_count: 0, building_wall_intersection_count: 0 };
    const tr = ext.tower_river_overlap_count > 0 ? `❌ ${ext.tower_river_overlap_count}` : '✅ 0';
    const gg = ext.gate_gap_clipping_count > 0 ? `❌ ${ext.gate_gap_clipping_count}` : '✅ 0';
    const bw = ext.building_wall_intersection_count > 0 ? `❌ ${ext.building_wall_intersection_count}` : '✅ 0';
    lines.push(`| ${report.seed} | ${tr} | ${gg} | ${bw} |`);
  }
  lines.push('');

  // Building Cell-Fill Diagnostics Section (Phase7)
  const hasCellFillDiagnostics = reports.some(r => r.buildingCellFillDiagnostics);
  if (hasCellFillDiagnostics) {
    lines.push('## Building Cell-Fill Diagnostics (Phase7)');
    lines.push('| Seed | Target Cov | Actual Cov | Cov Δ | Align Err | Align Δ | Rejections |');
    lines.push('|------|------------|------------|-------|-----------|--------|------------|');

    for (const report of reports) {
      const cellFill = report.buildingCellFillDiagnostics;
      if (cellFill) {
        const covDelta = report.coverageDelta !== undefined
          ? (report.coverageDelta >= 0 ? `+${report.coverageDelta.toFixed(4)}` : report.coverageDelta.toFixed(4))
          : '-';
        const alignDelta = report.alignmentDelta !== undefined
          ? (report.alignmentDelta >= 0 ? `+${report.alignmentDelta.toFixed(2)}°` : `${report.alignmentDelta.toFixed(2)}°`)
          : '-';
        const covImproved = report.coverageDelta !== undefined && report.coverageDelta > 0;
        const alignImproved = report.alignmentDelta !== undefined && report.alignmentDelta < 0;
        
        lines.push(`| ${report.seed} | ${cellFill.building_cell_target_coverage.toFixed(2)} | ` +
          `${cellFill.building_cell_actual_coverage.toFixed(4)} | ` +
          `${covImproved ? '✅' : (report.coverageDelta !== undefined ? '⚠️' : '')} ${covDelta} | ` +
          `${cellFill.building_alignment_error_mean.toFixed(2)}° | ` +
          `${alignImproved ? '✅' : (report.alignmentDelta !== undefined ? '⚠️' : '')} ${alignDelta} | ` +
          `${cellFill.building_pack_rejection_count} |`);
      }
    }
    lines.push('');
  }

  // Invariant Pass Matrix
  lines.push('## Invariant Pass Matrix');
  lines.push('| Invariant | Severity | ' + reports.map(r => `Seed ${r.seed}`).join(' | ') + ' |');
  lines.push('|-----------|----------|' + reports.map(() => '---').join('|') + '|');

  // Get all unique invariant IDs from the reports
  const allInvariantIds = new Set<string>();
  for (const report of reports) {
    for (const id of Object.keys(report.invariantMatrix)) {
      allInvariantIds.add(id);
    }
  }

  // Sort by severity (blocker first) then by ID
  const sortedIds = Array.from(allInvariantIds).sort((a, b) => {
    const severityOrder = { 'blocker': 0, 'major': 1, 'minor': 2 };
    const aSeverity = reports[0].invariantMatrix[a]?.severity ?? 'minor';
    const bSeverity = reports[0].invariantMatrix[b]?.severity ?? 'minor';
    if (severityOrder[aSeverity] !== severityOrder[bSeverity]) {
      return severityOrder[aSeverity] - severityOrder[bSeverity];
    }
    return a.localeCompare(b);
  });

  for (const id of sortedIds) {
    const severity = reports[0].invariantMatrix[id]?.severity ?? 'unknown';
    const results = reports.map(r => {
      const result = r.invariantMatrix[id];
      return result?.passed ? '✅' : '❌';
    });
    lines.push(`| ${id} | ${severity} | ${results.join(' | ')} |`);
  }
  lines.push('');

  // Release Decisions
  lines.push('## Release Decisions');
  lines.push('| Seed | Allowed | A6 Pass | Blockers | Repairs |');
  lines.push('|------|---------|---------|----------|---------|');

  for (const report of reports) {
    const allowed = report.releaseDecision.allowed ? '✅' : '❌';
    const a6Pass = report.releaseDecision.a6_invariants_pass ? '✅' : '❌';
    const blockers = report.releaseDecision.blockers.length > 0
      ? report.releaseDecision.blockers.slice(0, 3).join(', ') + (report.releaseDecision.blockers.length > 3 ? '...' : '')
      : '-';
    lines.push(`| ${report.seed} | ${allowed} | ${a6Pass} | ${blockers} | ${report.repairCount} |`);
  }
  lines.push('');

  // Failed Seeds Detail
  const failedReports = reports.filter(r => !r.releaseDecision.a6_invariants_pass);
  if (failedReports.length > 0) {
    lines.push('## Failed Seeds Detail');
    for (const report of failedReports) {
      lines.push(`### Seed ${report.seed}`);
      lines.push(`- **Blockers**: ${report.releaseDecision.blockers.join(', ')}`);
      lines.push(`- **Repairs Applied**: ${report.repairCount}`);

      const failedInvariants = Object.entries(report.invariantMatrix)
        .filter(([_, v]) => !v.passed)
        .map(([id, v]) => `${id} (${v.severity})`);
      lines.push(`- **Failed Invariants**: ${failedInvariants.join(', ')}`);

      // Extension diagnostics detail
      const ext = report.extensionDiagnostics ?? { tower_river_overlap_count: 0, gate_gap_clipping_count: 0, building_wall_intersection_count: 0 };
      const extDetails: string[] = [];
      if (ext.tower_river_overlap_count > 0) extDetails.push(`tower_river_overlap_count: ${ext.tower_river_overlap_count}`);
      if (ext.gate_gap_clipping_count > 0) extDetails.push(`gate_gap_clipping_count: ${ext.gate_gap_clipping_count}`);
      if (ext.building_wall_intersection_count > 0) extDetails.push(`building_wall_intersection_count: ${ext.building_wall_intersection_count}`);
      if (extDetails.length > 0) {
        lines.push(`- **Extension Diagnostics**: ${extDetails.join(', ')}`);
      }
      lines.push('');
    }
  }

  // Exit code explanation
  lines.push('## Exit Code');
  if (strictMode) {
    lines.push(`Exit code: ${failedReports.length > 0 ? '1 (blockers found)' : '0 (all passed)'}`);
  } else {
    lines.push('Exit code: 0 (informational mode - issues reported but not failing)');
  }

  return lines.join('\n');
}

/**
 * Generates a JSON report for machine consumption.
 */
function generateJsonReport(reports: CISeedReport[]): CIReport {
  const totalSeeds = reports.length;
  const passedSeeds = reports.filter(r => r.releaseDecision.a6_invariants_pass).length;
  const totalRepairs = reports.reduce((sum, r) => sum + r.repairCount, 0);

  return {
    version: CI_REPORT_VERSION,
    summary: {
      generated: new Date().toISOString(),
      seedsTested: totalSeeds,
      seedsPassed: passedSeeds,
      seedsFailed: totalSeeds - passedSeeds,
      totalRepairs,
      passRate: totalSeeds > 0 ? passedSeeds / totalSeeds : 1
    },
    seeds: reports
  };
}

// Parse command line arguments
const args = process.argv.slice(2);
const strictMode = args.includes('--strict');
const seedArgs = args.filter(arg => arg !== '--strict').map(Number).filter(n => !isNaN(n));
const seedsToTest = seedArgs.length > 0 ? seedArgs : [...CANONICAL_SEEDS];

// Load baseline for comparison
const baselines = loadBuildingDensityBaseline();

console.error(`CI Quality Report`);
console.error(`=================`);
console.error(`Mode: ${strictMode ? 'STRICT' : 'INFORMATIONAL'}`);
console.error(`Testing seeds: ${seedsToTest.join(', ')}`);
console.error(`Baseline loaded: ${Object.keys(baselines).length > 0 ? 'Yes' : 'No'}`);
console.error('');

const reports: CISeedReport[] = [];
let hasFailures = false;

for (const seed of seedsToTest) {
  try {
    const baseline = baselines[String(seed) as keyof typeof baselines];
    const report = generateReport(seed, DEFAULT_CI_CITY_SIZE, baseline);
    reports.push(report);
    if (!report.releaseDecision.a6_invariants_pass) {
      hasFailures = true;
    }
  } catch (error) {
    console.error(`Error processing seed ${seed}:`, error);
    hasFailures = true;
  }
}

// Output human-readable report
console.log(formatReport(reports, strictMode));

// Output JSON report to stderr for machine consumption
console.error('');
console.error('--- JSON Report ---');
console.error(JSON.stringify(generateJsonReport(reports), null, 2));

// Exit code policy:
// - Default (informational): always exit 0
// - Strict mode: exit 1 if any failures
const exitCode = strictMode && hasFailures ? 1 : 0;
process.exit(exitCode);
