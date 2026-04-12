// A mapping of monster features to their CR calculation effects for the alternate method.
// Based on the user-provided guide.

export interface FeatureEffect {
    dpr?: number;
    attackBonus?: number;
    effectiveAC?: number;
    effectiveHP?: { multiplier?: number; add?: (crOrValue: number) => number; };
}

export const FEATURE_EFFECTS: Record<string, FeatureEffect> = {
    'Aggressive': { dpr: 2 },
    'Ambusher': { attackBonus: 1 },
    'Blood Frenzy': { attackBonus: 4 },
    'Magic Resistance': { effectiveAC: 2 },
    'Superior Invisibility': { effectiveAC: 2 },
    'Nimble Escape': { effectiveAC: 4, attackBonus: 4 },
    'Frightful Presence': { effectiveHP: { multiplier: 1.25 } },
    'Horrifying Visage': { effectiveHP: { multiplier: 1.25 } }, 
    'Regeneration': { effectiveHP: { add: (regenValue: number) => regenValue * 3 } },
    'Relentless': { effectiveHP: { add: (cr: number) => {
        if (cr <= 4) return 7;
        if (cr <= 10) return 14;
        if (cr <= 16) return 21;
        return 28;
    }}},
    'Undead Fortitude': { effectiveHP: { add: (cr: number) => {
        if (cr <= 4) return 7;
        if (cr <= 10) return 14;
        if (cr <= 16) return 21;
        return 28;
    }}},
    'Constrict': { effectiveAC: 1 },
    'Parry': { effectiveAC: 1 },
    'Avoidance': { effectiveAC: 1 },
    'Stench': { effectiveAC: 1 },
    'Possession': { effectiveHP: { multiplier: 2 } },
    'Damage Transfer': { effectiveHP: { multiplier: 2 }, dpr: 0.33 }, // DPR is 1/3 of EHP
    'Brute': { dpr: 0 }, // Handled by dice parsing
    'Charge': { dpr: 0 }, // Handled by DPR calculation
    'Surprise Attack': { dpr: 0 } // Handled by DPR calculation
};
