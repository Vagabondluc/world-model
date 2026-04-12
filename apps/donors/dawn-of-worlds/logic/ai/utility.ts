import { GameState } from '../schema';
import { AIAction, AgentID, Consideration, PersonalityProfile, ScoredAction } from './types';

/**
 * The Brain of the AI.
 * Evaluates a list of actions and assigns a utility score (0-1) to each.
 */
export class UtilityScorer {

    /**
     * Score a single action based on a set of considerations.
     */
    public scoreAction(
        action: AIAction,
        state: GameState,
        agentId: AgentID,
        profile: PersonalityProfile,
        considerations: Consideration[]
    ): ScoredAction {
        let totalScore = 0;
        let totalWeight = 0;
        const breakdown = [];

        // 1. Evaluate Base Considerations
        for (const cons of considerations) {
            // Raw score 0-1
            let rawFit = cons.evaluator(state, agentId, action.payload);

            // Apply Curve (Response Curve) if exists
            if (cons.curve) {
                rawFit = cons.curve(rawFit);
            }

            // Apply Personality Weights if the consideration maps to a personality trait
            // For simplicty v1, we assume the consideration.weight *includes* the personality bias 
            // OR we blend it here. Let's keep it simple: strict mathematical average for now.

            const weightedScore = rawFit * cons.weight;

            totalScore += weightedScore;
            totalWeight += cons.weight;

            breakdown.push({
                consideration: cons.name,
                score: rawFit,
                weightedScore: weightedScore
            });
        }

        // 2. Normalize
        const finalScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;

        // 3. Apply Fuzz (Randomness from Personality)
        // A fuzz of 0.1 means the score can vary by +/- 5%
        const fuzz = (Math.random() * profile.fuzzFactor) - (profile.fuzzFactor / 2);

        return {
            ...action,
            score: Math.max(0, Math.min(1, finalScore + fuzz)),
            breakdown
        };
    }

    /**
     * Pick the best action from a list.
     */
    public selectBestAction(scoredActions: ScoredAction[]): ScoredAction | null {
        if (scoredActions.length === 0) return null;

        // Sort descending
        scoredActions.sort((a, b) => b.score - a.score);

        return scoredActions[0];
    }
}

export const utilityScorer = new UtilityScorer();
