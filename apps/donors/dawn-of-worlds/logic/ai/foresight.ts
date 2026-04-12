import {
    AIOption,
    ForesightConfig,
    ReadinessBreakdown,
    PreparationScheme,
    CulturalBias,
    IntelligenceReport,
    SchemeID
} from './types';
// schema import removed 
// Wait, local types.ts imports from root. 
// I should import GameState from './types' if it is re-exported? 
// It is NOT re-exported in logic/ai/types.ts? I checked content step 435.
// Step 435: "import { GameEvent, GameState } from '../../types';" -> It imports them.
// But does it EXPORT them?
// No "export type GameState".
// So I must import from '../../types'.
import { GameState } from '../../types';
import { IntelSystem } from './analysis/intel';
import { SCHEME_CATALOG } from './catalogs/schemes';

export class ForesightEngine {

    constructor(private config: ForesightConfig) { }

    /**
     * The Main Gate.
     * Calculates Readiness and determines phase (PREPARE vs EXECUTE).
     */
    public evaluateOption(
        option: AIOption,
        bias: CulturalBias,
        state: GameState,
        agentId: string
    ): AIOption {
        const intel = IntelSystem.generateReport(agentId, option.targetId, state);
        const selfIntel = IntelSystem.generateReport(agentId, agentId, state); // Self-assess

        const breakdown = this.calculateReadiness(option, bias, intel, selfIntel);
        const threshold = this.getThreshold(bias);

        // Update Option State
        option.readiness = breakdown;

        if (breakdown.total >= threshold) {
            option.phase = "EXECUTE";
            option.activeScheme = null;
        } else {
            option.phase = "PREPARE";
            option.missingFactors = this.identifyMissingFactors(breakdown);
            option.activeScheme = this.selectScheme(option.missingFactors);
            option.turnsInPrep++;
        }

        return option;
    }

    /**
     * The Readiness Algebra.
     */
    private calculateReadiness(
        option: AIOption,
        bias: CulturalBias,
        targetIntel: IntelligenceReport,
        selfIntel: IntelligenceReport
    ): ReadinessBreakdown {
        // 1. Calculate Capability: Relative Strength
        // Ratio 1:1 = 0.5. Ratio 2:1 = 0.66. Ratio 0.5:1 = 0.33.
        // Formula: My / (My + Target)
        const totalPower = selfIntel.estimatedStrength + targetIntel.estimatedStrength;
        const capability = totalPower > 0
            ? selfIntel.estimatedStrength / totalPower
            : 0.5;

        // 2. Opportunity
        // TODO: Distance check. For now, use placeholder 0.5 or bias
        const opportunity = 0.5; // Placeholder

        // 3. Timing
        // TODO: Check season/resource availability
        const timing = 0.5;

        // 4. Confidence
        // Based on visibility
        let confidence = (targetIntel.visibleUnits > 0 ? 0.8 : 0.4);
        // Adjust for Paranoia (Paranoid AI needs more intel)
        confidence = Math.max(0, confidence - (bias.paranoia * 0.2));

        // 2. Apply Weights
        const w = this.config.weights;
        const total = (
            (capability * w.capability) +
            (opportunity * w.opportunity) +
            (confidence * w.confidence) +
            (timing * w.timing)
        );

        return { total, capability, opportunity, confidence, timing };
    }

    private getThreshold(bias: CulturalBias): number {
        // Base Threshold modified by Impulsiveness
        // Impulsive (1.0) -> Reduces threshold significantly
        let t = this.config.baseThreshold;
        t -= (bias.impulsiveness * 0.2);
        return Math.max(0.1, Math.min(0.95, t));
    }

    private identifyMissingFactors(breakdown: ReadinessBreakdown): string[] {
        const missing: string[] = [];
        // Simple heuristic: anything below 0.6 is "missing"
        if (breakdown.capability < 0.6) missing.push("capability");
        if (breakdown.opportunity < 0.6) missing.push("opportunity");
        if (breakdown.confidence < 0.6) missing.push("confidence");
        if (breakdown.timing < 0.6) missing.push("timing");
        return missing;
    }

    private selectScheme(missingFactors: string[]): string | null {
        if (missingFactors.length === 0) return "BIDING"; // Default wait

        // Prioritize factors based on internal logic
        // For now, simple mapping
        const factor = missingFactors[0];

        // Find a scheme that boosts this factor
        const scheme = Object.values(SCHEME_CATALOG).find(s => s.boostsFactor === factor);
        return scheme ? scheme.id : "BIDING" as SchemeID;
    }
}
