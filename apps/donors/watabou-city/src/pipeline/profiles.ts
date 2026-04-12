// @ts-nocheck
export type ReleaseProfile = 'baseline' | 'strict' | 'release';

export interface ProfileEvaluationInput {
  hardInvariantsPass: boolean;
  morphologyGatePassRate: number;
  fixtureLevelFullFailures: number;
  largeFixtureDistrictLabelPass?: boolean;
  largeFixtureRoadHierarchyPass?: boolean;
  governanceSuitesPass?: boolean;
  oracleSuitesPass?: boolean;
  leakageSuitesPass?: boolean;
  hydroGatePass?: boolean;
}

export interface ProfileEvaluationResult {
  profile: ReleaseProfile;
  passed: boolean;
  reasons: string[];
}

export function evaluateReleaseProfile(profile: ReleaseProfile, input: ProfileEvaluationInput): ProfileEvaluationResult {
  const reasons: string[] = [];

  if (!input.hardInvariantsPass) reasons.push('Hard invariants failed');

  if (profile === 'baseline') {
    if (input.morphologyGatePassRate < 0.85) reasons.push('Morphology pass rate below 85%');
    if (input.fixtureLevelFullFailures > 2) reasons.push('More than 2 fixture-level full failures');
  }

  if (profile === 'strict') {
    if (input.morphologyGatePassRate < 0.93) reasons.push('Morphology pass rate below 93%');
    if (input.fixtureLevelFullFailures > 1) reasons.push('More than 1 fixture-level full failure');
    if (!input.largeFixtureDistrictLabelPass) reasons.push('Large fixture district labeling gate failed');
    if (!input.largeFixtureRoadHierarchyPass) reasons.push('Large fixture road hierarchy gate failed');
    if (!input.hydroGatePass) reasons.push('Hydro A2 gate failed');
  }

  if (profile === 'release') {
    if (input.morphologyGatePassRate < 0.97) reasons.push('Morphology pass rate below 97%');
    if (input.fixtureLevelFullFailures > 0) reasons.push('Release requires zero fixture-level full failures');
    if (!input.governanceSuitesPass) reasons.push('Governance suites failed');
    if (!input.oracleSuitesPass) reasons.push('Oracle suites failed');
    if (!input.leakageSuitesPass) reasons.push('Leakage suites failed');
    if (!input.hydroGatePass) reasons.push('Hydro A2 gate failed');
  }

  return {
    profile,
    passed: reasons.length === 0,
    reasons,
  };
}
