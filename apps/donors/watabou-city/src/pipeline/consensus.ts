// @ts-nocheck
import { ConformanceVerdict } from './conformance';

export type OracleVerdict = 'pass' | 'fail' | 'abstain';

export interface ConsensusResult {
  oracleA?: OracleVerdict;
  oracleB?: OracleVerdict;
  oracleC?: OracleVerdict;
  consensus: OracleVerdict;
  integrity_pass?: boolean;
  /** Votes array for test compatibility */
  votes?: OracleVerdict[];
}

export function deriveConsensus(verdicts: OracleVerdict[]): ConsensusResult {
  const [vA, vB, vC] = verdicts;
  
  const counts = verdicts.reduce((acc, v) => {
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {} as Record<OracleVerdict, number>);
  
  let consensus: OracleVerdict = 'fail';
  if (counts['pass'] >= 2) consensus = 'pass';
  else if (counts['fail'] >= 2) consensus = 'fail';
  else if (counts['abstain'] >= 2) consensus = 'abstain';
  
  return {
    oracleA: vA,
    oracleB: vB,
    oracleC: vC,
    consensus,
    integrity_pass: (counts['pass'] || 0) + (counts['fail'] || 0) + (counts['abstain'] || 0) === 3,
    votes: verdicts
  };
}

/**
 * Simulates oracles based on the primary conformance verdict.
 * In a real system, these would be independent implementations.
 */
export function simulateOracles(primaryVerdict: ConformanceVerdict): OracleVerdict[] {
  const base = primaryVerdict.passed ? 'pass' : 'fail';
  
  // Oracle A: Always matches primary
  const vA = base;
  
  // Oracle B: Mostly matches, but might fail on edge cases
  const vB = primaryVerdict.failed_rules.length > 2 ? 'fail' : base;
  
  // Oracle C: Independent check
  const vC = base;
  
  return [vA as OracleVerdict, vB as OracleVerdict, vC as OracleVerdict];
}
