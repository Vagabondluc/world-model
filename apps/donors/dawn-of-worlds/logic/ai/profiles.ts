import { CulturalBias, StoreProfile, ForesightConfig, StoreCost } from './types';
// stores import removed
// Check catalogs/stores.ts exists (Step 378). 
// wait, import path relative to profiles.ts (in logic/ai).
// logic/ai/catalogs/stores.ts exists.
// So import { STORE_CATALOG } from './catalogs/stores';

import { STORE_CATALOG } from './catalogs/stores';

export interface AIPersonality {
    id: string;
    name: string;
    description: string;
    // Legacy weights (keep for backward compat if needed, or remove)
    weights: {
        EXPANSION: number;
        CONFLICT: number;
        BUILDING: number;
        HOARDING: number;
    };

    // V2: Pressure System Config
    culture: CulturalBias;
    stores: StoreProfile[];
    foresight: ForesightConfig;
}

// Helper to create bias
const createBias = (name: string, imp: number, para: number): CulturalBias => ({
    id: name,
    name,
    storePreferences: {}, // Fill based on personality
    lossTolerance: 0.5,
    symbolismPreference: 0.5,
    familyWeights: { GRUDGE: 1, FEAR: 1, AMBITION: 1, SHAME: 1, OPPORTUNITY: 1 }, // Added OPPORTUNITY here
    impulsiveness: imp,
    paranoia: para
});

export const DEFAULT_PERSONALITIES: Record<string, AIPersonality> = {
    EXPANSIONIST: {
        id: 'EXPANSIONIST',
        name: 'The Pioneer',
        description: 'Focuses on rapid expansion.',
        weights: { EXPANSION: 2.0, CONFLICT: 0.5, BUILDING: 0.8, HOARDING: 0.2 },
        culture: createBias('Pioneer Culture', 0.8, 0.2),
        stores: [STORE_CATALOG['MILITARY_RAID'], STORE_CATALOG['BUILD_MONUMENT']],
        foresight: { baseThreshold: 0.4, weights: { capability: 1, opportunity: 2, confidence: 0.5, timing: 1 } }
    },
    BUILDER: {
        id: 'BUILDER',
        name: 'The Architect',
        description: 'Focuses on developing cities.',
        weights: { EXPANSION: 0.6, CONFLICT: 0.3, BUILDING: 2.0, HOARDING: 0.5 },
        culture: createBias('Builder Culture', 0.3, 0.4),
        stores: [STORE_CATALOG['BUILD_MONUMENT'], STORE_CATALOG['FORTIFY_BORDER']],
        foresight: { baseThreshold: 0.6, weights: { capability: 1, opportunity: 1, confidence: 1, timing: 2 } }
    },
    AGGRESSOR: {
        id: 'AGGRESSOR',
        name: 'The Warlord',
        description: 'Seeks conflict.',
        weights: { EXPANSION: 1.0, CONFLICT: 2.5, BUILDING: 0.4, HOARDING: 0.1 },
        culture: createBias('Warrior Culture', 0.9, 0.1),
        stores: [STORE_CATALOG['MILITARY_RAID'], STORE_CATALOG['TRADE_EMBARGO']],
        foresight: { baseThreshold: 0.3, weights: { capability: 2, opportunity: 1, confidence: 0.2, timing: 0.5 } }
    },
    BALANCED: {
        id: 'BALANCED',
        name: 'The Steward',
        description: 'Balanced approach.',
        weights: { EXPANSION: 1.0, CONFLICT: 1.0, BUILDING: 1.0, HOARDING: 1.0 },
        culture: createBias('Steward Culture', 0.5, 0.5),
        stores: Object.values(STORE_CATALOG),
        foresight: { baseThreshold: 0.5, weights: { capability: 1, opportunity: 1, confidence: 1, timing: 1 } }
    }
};

export const getEffectiveness = (personality: AIPersonality, category: keyof AIPersonality['weights']): number => {
    return personality.weights[category];
};
