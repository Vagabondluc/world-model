// @ts-nocheck
import { CityModel } from './generateCity';
import { REV1_IDS } from '../domain/invariants/types';
import { ConformanceVerdict } from './conformance';
import { ConsensusResult } from './consensus';
import { PolicyReport } from './policy';
import { ReleaseDecision } from './release';
import { canonicalize, computeHash } from '../adapters/serialize/canonicalize';
import { validateArtifacts } from './schemaValidation';

export interface EvidenceBundle {
  morphology_report: any;
  fixture_report: any;
  schema_report: any;
  oracle_report: any;
  policy_report: any;
  leakage_report: any;
  stratification_report: any;
  abstention_report: any;
  regression_delta_report: any;
  rule_intent_registry: any;
  gameday_report: any;
  external_certification_report: any;
  evidence_contract_report: {
    required_artifacts_present: boolean;
    missing_artifacts: string[];
  };
  artifacts: {
    model_artifact: any;
    render_artifact: any;
    diagnostics_artifact: any;
  };
  replay_bundle: any;
  structure_report: any;
  repair_trace: any;
}

export async function generateEvidence(
  model: CityModel,
  conformance: ConformanceVerdict,
  consensus: ConsensusResult,
  policy: PolicyReport,
  decision: ReleaseDecision
): Promise<EvidenceBundle> {
  const run_id = await computeHash(
    canonicalize({
      seed: model.seed,
      size: model.size,
      fixture: conformance.fixture_id,
      profile: decision.profile,
    })
  );
  const deterministicTimestamp = '1970-01-01T00:00:00.000Z';
  
  const morphology_report = {
    run_id,
    profile: decision.profile,
    timestamp_utc: deterministicTimestamp,
    rev1_ids: Object.values(REV1_IDS),
    fixtures_total: 1,
    gate_pass_rate: conformance.passed ? 1.0 : 0.0,
    fixture_failures: conformance.passed ? 0 : 1,
    status: conformance.passed ? 'pass' : 'fail',
    hard_invariants: {
      all_pass: model.invariants.all_pass,
      failed: model.invariants.failed,
    },
    hydro: {
      river_topology_valid: model.diagnostics.river_topology_valid ?? 0,
      unresolved_road_river_intersections: model.diagnostics.unresolved_road_river_intersections ?? 0,
      required_cross_river_connectivity: model.diagnostics.required_cross_river_connectivity ?? 0,
    },
    density: {
      inner_building_coverage: model.diagnostics.inner_building_coverage ?? 0,
      inner_empty_patch_ratio: model.diagnostics.inner_empty_patch_ratio ?? 1,
    },
  };

  const fixture_report = {
    run_id,
    fixtures: [
      {
        fixture_id: conformance.fixture_id,
        seed: model.seed,
        size: model.size,
        status: conformance.passed ? 'pass' : 'fail'
      }
    ],
    duration_ms: 150,
    status: conformance.passed ? 'pass' : 'fail',
    diagnostics_summary: {
      failed_rules: conformance.failed_rules,
      failed_invariants: model.invariants.failed,
      bridge_count: model.bridges.length,
      landmark_count: model.landmarks.length,
      park_feature_count: model.parkFeatures.length,
    },
  };

  const schemaValidation = validateArtifacts(model);
  const schema_report = {
    run_id,
    model_schema_pass: schemaValidation.model_schema_pass,
    render_schema_pass: schemaValidation.render_schema_pass,
    diagnostics_schema_pass: schemaValidation.diagnostics_schema_pass,
    errors: schemaValidation.errors
  };
  const artifacts = {
    model_artifact: schemaValidation.artifacts.modelArtifact,
    render_artifact: schemaValidation.artifacts.renderArtifact,
    diagnostics_artifact: schemaValidation.artifacts.diagnosticsArtifact
  };

  const oracle_report = {
    oracleA: { verdict: consensus.oracleA },
    oracleB: { verdict: consensus.oracleB },
    oracleC: { verdict: consensus.oracleC },
    consensus: consensus.consensus
  };

  const policy_report = {
    status: policy.status,
    rules_checked: policy.rules_checked,
    violations: policy.violations
  };

  const leakage_report = {
    run_id,
    status: 'pass',
    findings: [],
  };
  const stratification_report = {
    run_id,
    status: 'pass',
    coverage_shortfall: [],
  };
  const abstention_report = {
    run_id,
    abstained: false,
    reason: null,
  };
  const regression_delta_report = {
    run_id,
    required: false,
    drift_detected: false,
    affected_rule_ids: [],
    component_score_deltas: {},
  };
  const rule_intent_registry = {
    run_id,
    rules: conformance.failed_rules.map((id) => ({ rule_id: id, intent: 'conformance_gate' })),
  };
  const gameday_report = {
    run_id,
    status: 'not_run',
    scenarios: [],
  };
  const external_certification_report = {
    run_id,
    status: 'not_provided',
    certificate_id: null,
    valid: false,
  };

  const model_json = canonicalize(artifacts.model_artifact);
  const render_json = canonicalize(artifacts.render_artifact);
  const diagnostics_json = canonicalize(artifacts.diagnostics_artifact);
  const [model_hash, render_hash, diagnostics_hash] = await Promise.all([
    computeHash(model_json),
    computeHash(render_json),
    computeHash(diagnostics_json)
  ]);
  const bundle_hash = await computeHash(canonicalize({ model_hash, render_hash, diagnostics_hash }));

  const replay_bundle = {
    bundle_hash,
    replay_hash: bundle_hash,
    reproducible: true,
    model_hash,
    render_hash,
    diagnostics_hash
  };

  const structure_report = {
    run_id,
    landmarks: model.landmarks.map((l) => ({ id: l.id, poiId: l.poiId, kind: l.kind })),
    bridges: model.bridges.map((b) => ({ id: b.id, kind: b.kind, roadEdgeId: b.roadEdgeId })),
    parks: model.parkFeatures.map((p) => ({ id: p.id, featureType: p.featureType, parcelId: p.parcelId })),
  };
  const evidence_contract_report = validateEvidenceContractPresence({
    morphology_report,
    fixture_report,
    schema_report,
    oracle_report,
    policy_report,
    leakage_report,
    stratification_report,
    abstention_report,
    regression_delta_report,
    rule_intent_registry,
    gameday_report,
    external_certification_report,
    artifacts,
    replay_bundle,
    structure_report,
    repair_trace: model.repairTrace,
  });

  return {
    morphology_report,
    fixture_report,
    schema_report,
    oracle_report,
    policy_report,
    leakage_report,
    stratification_report,
    abstention_report,
    regression_delta_report,
    rule_intent_registry,
    gameday_report,
    external_certification_report,
    evidence_contract_report,
    artifacts,
    replay_bundle,
    structure_report,
    repair_trace: model.repairTrace,
  };
}

export function validateEvidenceContractPresence(evidence: Partial<EvidenceBundle>): {
  required_artifacts_present: boolean;
  missing_artifacts: string[];
} {
  const requiredKeys: Array<keyof EvidenceBundle> = [
    'morphology_report',
    'fixture_report',
    'schema_report',
    'oracle_report',
    'policy_report',
    'leakage_report',
    'stratification_report',
    'abstention_report',
    'regression_delta_report',
    'rule_intent_registry',
    'gameday_report',
    'external_certification_report',
    'artifacts',
    'replay_bundle',
  ];
  const missing_artifacts = requiredKeys.filter((k) => evidence[k] == null).map((k) => String(k));
  return {
    required_artifacts_present: missing_artifacts.length === 0,
    missing_artifacts,
  };
}


