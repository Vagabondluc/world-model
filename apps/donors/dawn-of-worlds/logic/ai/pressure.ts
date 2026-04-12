import { SemanticTag, StoreProfile, CulturalBias, TagFamily, ObsolescenceRecord, GameState } from './types';

export class PressureEngine {
    private memories: ObsolescenceRecord[] = [];
    private readonly BASE_OBSOLESCENCE_FACTOR = 100; // Multiplier for tolerance

    /**
     * Applies decay to a tag based on its urgency.
     * Low urgency tags decay faster.
     */
    public processTagDecay(tag: SemanticTag): SemanticTag {
        // Decay formula: 
        // New = Old * (0.9 + (0.1 * Urgency))
        // If Urgency 1.0 -> Factor 1.0 (No decay)
        // If Urgency 0.0 -> Factor 0.9 (10% decay per turn)
        const decayFactor = 0.9 + (0.1 * tag.urgency);

        return {
            ...tag,
            intensity: Math.max(0, tag.intensity * decayFactor)
        };
    }

    /**
     * Checks if a tag has met its satisfaction conditions.
     */
    public isTagSatisfied(tag: SemanticTag): boolean {
        if (tag.satisfaction.type === 'THRESHOLD') {
            return tag.accumulatedValue >= tag.satisfaction.requirement;
        }
        // Symbolic logic would go here (checking event history)
        return false;
    }

    /**
     * Checks if a tag should be abandoned due to excessive cost.
     */
    public isObsolete(tag: SemanticTag, bias: CulturalBias): boolean {
        // Threshold = Intensity * Tolerance * Constant
        // e.g. 1.0 (High Pressure) * 0.5 (Warlord Tolerance) * 100 = 50 cost allowed
        // If accumulatedLoss > 50, give up.
        const threshold = tag.intensity * bias.lossTolerance * this.BASE_OBSOLESCENCE_FACTOR;
        return tag.accumulatedLoss > threshold;
    }

    /**
     * Ranks tags by importance.
     * P = Intensity * Urgency * CulturalBias
     */
    public prioritizeTags(tags: SemanticTag[], bias: CulturalBias): SemanticTag[] {
        return [...tags].sort((a, b) => {
            const scoreA = this.getPriorityScore(a, bias);
            const scoreB = this.getPriorityScore(b, bias);
            return scoreB - scoreA;
        });
    }

    private getPriorityScore(tag: SemanticTag, bias: CulturalBias): number {
        // Bias for this family
        const familyWeight = bias.familyWeights[tag.family] || 1.0;
        return tag.intensity * tag.urgency * familyWeight;
    }

    /**
     * Filters stores relevant to a tag.
     */
    public getValidStores(tag: SemanticTag, allStores: StoreProfile[]): StoreProfile[] {
        return allStores.filter(store => store.reducesFamilies.includes(tag.family));
    }

    /**
     * Scores a store for applicability.
     * Handles Risk Tolerance logic.
     */
    public scoreStore(store: StoreProfile, tag: SemanticTag, bias: CulturalBias, _state: GameState): number {
        // 1. Risk Check (The "Desperation Curve")
        // If Urgency is Low (<0.3) and Store Risk is High (>0.5), REJECT.
        if (tag.urgency < 0.3 && store.risk > 0.5) {
            return 0;
        }

        // 2. Base Score: Preference * (1 - Risk/2)
        const pref = bias.storePreferences[store.id] || 1.0;

        // 3. Memory Check (Simple Aversion)
        // If we have memories of this family failing, reduce score
        // (In V2 we would match specific Stores to Memories)

        return pref * (1 - (store.risk * 0.5));
    }

    public registerMemory(tag: SemanticTag, reason: ObsolescenceRecord['reason']): void {
        this.memories.push({
            originalTagId: tag.id,
            reason,
            turnObsolete: 0, // Should come from context
            accumulatedLoss: tag.accumulatedLoss
        });
    }

    public getMemories(): ObsolescenceRecord[] {
        return this.memories;
    }
}
