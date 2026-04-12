
import { GameState } from '../../types';

// --- Types ---

export type AIActionType = 'ATTACK' | 'EXPAND' | 'FORTIFY' | 'WAIT' | 'YIELD';

export interface EvaluatorContext {
    gameState: GameState;
    playerId: string;
    targetCellId?: number; // Optional context (e.g. for directed actions)
}

// Ensure Evaluator returns 0-1 normalized score
export type Evaluator = (context: EvaluatorContext) => number;

export interface WeightedEvaluator {
    evaluator: Evaluator;
    weight: number;
    name: string; // For debugging
    curve?: (x: number) => number; // Optional response curve (e.g. exponential)
}

export interface AIPersona {
    id: string;
    name: string;
    weights: Record<string, number>; // "aggression": 1.2
}

export interface Decision {
    action: AIActionType;
    score: number;
    reason: string; // "High Threat (0.8) * Aggression (1.2)"
}

// --- Utility Scorer ---

export class UtilityScorer {

    /**
     * Calculates the score for a specific action/intent based on Persona and Context.
     */
    static scoreAction(
        _actionName: string, // e.g. "Expand to Cell 5"
        evaluators: WeightedEvaluator[],
        persona: AIPersona,
        context: EvaluatorContext
    ): number {
        let totalScore = 0;
        let totalWeight = 0;

        for (const item of evaluators) {
            // 1. Run raw evaluation (0-1)
            let rawScore = item.evaluator(context);

            // 2. Apply Curve (if any)
            if (item.curve) {
                rawScore = item.curve(rawScore);
            }

            // 3. Apply Persona Weight
            // Check if persona modifies this specific evaluator category/name
            const personaMod = persona.weights[item.name] || 1.0;

            // 4. Weighted Sum
            const finalWeight = item.weight * personaMod;
            totalScore += rawScore * finalWeight;
            totalWeight += finalWeight;
        }

        // Normalize? Or return raw sum? 
        // Utility often uses sum, but normalization helps compare different actions.
        if (totalWeight === 0) return 0;

        return totalScore / totalWeight;
    }
}
