// @ts-nocheck
import { create } from 'zustand';
import { generateCity, CityModel } from '../pipeline/generateCity';
import { evaluateConformance } from '../pipeline/conformance';
import { simulateOracles, deriveConsensus } from '../pipeline/consensus';
import { evaluatePolicy } from '../pipeline/policy';
import { makeA6ReleaseDecision } from '../pipeline/release';
import { generateEvidence } from '../pipeline/evidence';
import { evaluateReleaseProfile } from '../pipeline/profiles';
import { GenerationParams, DebugMode, DEFAULT_GENERATION_PARAMS, DEFAULT_DEBUG_MODES, QualityCheck } from './types';
import { evaluateQualityChecks } from './qualityChecker';
import { FeatureFlags, DEFAULT_FEATURE_FLAGS } from '../config/featureFlags';

interface CityState {
  // Basic settings
  seed: number;
  size: number;
  model: CityModel | null;
  isGenerating: boolean;

  // Parameters
  params: GenerationParams;

  // Feature flags
  featureFlags: FeatureFlags;

  // Debug & visualization
  showDebug: boolean;
  showVoronoi: boolean;
  debugModes: DebugMode[];
  highlightedOffenders: Set<string>;

  // Quality checks
  qualityChecks: QualityCheck[];

  // Actions
  setSeed: (seed: number) => void;
  setSize: (size: number) => void;
  setShowDebug: (showDebug: boolean) => void;
  setShowVoronoi: (showVoronoi: boolean) => void;
  setParams: (params: Partial<GenerationParams>) => void;
  setFeatureFlags: (flags: Partial<FeatureFlags>) => void;
  toggleDebugMode: (modeId: string) => void;
  highlightOffenders: (offenderIds: string[]) => void;
  clearHighlights: () => void;
  generate: () => Promise<void>;
}

export const useCityStore = create<CityState>((set, get) => ({
  seed: 12345,
  size: 20,
  showDebug: false,
  showVoronoi: false,
  model: null,
  isGenerating: false,
  params: DEFAULT_GENERATION_PARAMS,
  featureFlags: DEFAULT_FEATURE_FLAGS,
  debugModes: DEFAULT_DEBUG_MODES,
  highlightedOffenders: new Set(),
  qualityChecks: [],

  setSeed: (seed) => set({ seed }),
  setSize: (size) => set({ size }),
  setShowDebug: (showDebug) => set({ showDebug }),
  setShowVoronoi: (showVoronoi) => set({ showVoronoi }),
  setParams: (params) => set((state) => ({
    params: { ...state.params, ...params }
  })),
  setFeatureFlags: (flags) => set((state) => ({
    featureFlags: { ...state.featureFlags, ...flags }
  })),
  toggleDebugMode: (modeId) => set((state) => ({
    debugModes: state.debugModes.map(mode =>
      mode.id === modeId ? { ...mode, enabled: !mode.enabled } : mode
    ),
  })),
  highlightOffenders: (offenderIds) => set({
    highlightedOffenders: new Set(offenderIds),
  }),
  clearHighlights: () => set({
    highlightedOffenders: new Set(),
  }),
  generate: async () => {
    set({ isGenerating: true });
    try {
      const { seed, size, featureFlags } = get();
      const model = generateCity(seed, size, featureFlags);
      
      // Conformance
      const conformance = evaluateConformance(model.diagnostics, size, `fx-${seed}`);
      
      // Consensus
      const oracleVerdicts = simulateOracles(conformance);
      const consensus = deriveConsensus(oracleVerdicts);
      
      // Policy
      const policy = evaluatePolicy();

      // Profile gate
      const profile: 'baseline' | 'strict' | 'release' = 'baseline';
      const hydroGatePass =
        (model.diagnostics.river_topology_valid ?? 0) >= 1 &&
        (model.diagnostics.river_deterministic_replay ?? 0) >= 1 &&
        (model.diagnostics.unresolved_road_river_intersections ?? 1) <= 0 &&
        (model.diagnostics.required_cross_river_connectivity ?? 0) >= 1 &&
        (model.diagnostics.hydro_aware_placement_order ?? 0) >= 1;
      const profileEval = evaluateReleaseProfile(profile, {
        hardInvariantsPass: model.invariants.all_pass,
        morphologyGatePassRate: conformance.passed ? 1 : 0,
        fixtureLevelFullFailures: conformance.passed ? 0 : 1,
        hydroGatePass,
      });
      
      // Decision
      const preliminaryDecision = makeA6ReleaseDecision(
        conformance.passed,
        consensus,
        policy,
        model.diagnostics,
        profile,
        profileEval.passed,
        false,
        model.repairTrace?.entries?.length ?? 0
      );
      
      // Evidence
      const evidence = await generateEvidence(model, conformance, consensus, policy, preliminaryDecision);
      const decision = makeA6ReleaseDecision(
        conformance.passed,
        consensus,
        policy,
        model.diagnostics,
        profile,
        profileEval.passed,
        evidence.evidence_contract_report.required_artifacts_present,
        model.repairTrace?.entries?.length ?? 0
      );

      const fullModel: CityModel = {
        ...model,
        evidence,
        decision
      };

      // Evaluate quality checks
      const qualityChecks = evaluateQualityChecks(fullModel);
      
      set({ 
        model: fullModel,
        qualityChecks,
      });
    } finally {
      set({ isGenerating: false });
    }
  },
}));
