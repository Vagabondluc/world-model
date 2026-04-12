
import { AIPersona, Evaluator } from './UtilityScorer';
import { AIScanner } from './AIScanner';

// --- Personas ---

export const PERSONA_CONQUEROR: AIPersona = {
    id: 'WARLORD',
    name: 'The Conqueror',
    weights: {
        'threat': 1.5,       // Highly reactive to enemies
        'expansion': 0.8,    // Moderate expansion
        'resource': 0.5,     // Cares less about resources
        'aggression': 2.0    // Global aggression modifier
    }
};

export const PERSONA_GARDENER: AIPersona = {
    id: 'GARDENER',
    name: 'The Gardener',
    weights: {
        'threat': 0.5,
        'expansion': 1.5,    // Loves to grow
        'resource': 2.0,     // Prioritizes optimal land
        'aggression': 0.1
    }
};

// --- Evaluators ---

/**
 * Returns 1.0 if there are immediate threats, 0.0 otherwise.
 * Scales with number of threats.
 */
export const evalThreat: Evaluator = (ctx) => {
    // We need Scan result. Assume it's cached or we re-scan.
    // For performance, we should pass ScanResult in Context, but for now re-scan cheap mock.
    const scan = AIScanner.scan(ctx.gameState, ctx.playerId);
    const threatCount = scan.threats.length;

    // Sigmoid-ish: 1 threat = 0.5, 3 threats = 0.9
    return Math.min(1.0, threatCount * 0.3);
};

/**
 * Returns 1.0 if there is room to expand.
 */
export const evalExpansion: Evaluator = (ctx) => {
    const scan = AIScanner.scan(ctx.gameState, ctx.playerId);
    return scan.frontier.length > 0 ? 1.0 : 0.0;
};

/**
 * Returns score based on resource value of target cell.
 */
export const evalResource: Evaluator = (ctx) => {
    if (!ctx.targetCellId) return 0;
    // Mock resource logic for now. 
    // Ideally check biome value.
    return 0.5;
};
