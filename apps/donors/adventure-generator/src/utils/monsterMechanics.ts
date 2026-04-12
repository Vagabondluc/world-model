
import { ROLE_AXIS_BUDGETS } from '../data/constants';
import { Axis } from '../types/monsterGrammar';

export function getAbilityScores(role: string): { str: number; dex: number; con: number; int: number; wis: number; cha: number; } {
    const scores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    switch (role) {
        case 'Brute': case 'Soldier': scores.str = 16; scores.con = 14; break;
        case 'Skirmisher': case 'Ambusher': scores.dex = 16; scores.str = 14; break;
        case 'Artillery': case 'Controller': scores.int = 16; scores.wis = 14; break;
        case 'Leader': case 'Support': scores.cha = 16; scores.wis = 14; break;
        case 'Solo': scores.str = 18; scores.con = 16; break;
        case 'Minion': break;
        default: scores.str = 14; scores.con = 14; break;
    }
    return scores;
}

export function getMod(score: number): number {
    return Math.floor((score - 10) / 2);
}

export function formatMod(mod: number): string {
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function buildBudget(role: string, adjustments: Partial<Record<Axis, number>>): Record<Axis, number> {
    const base = ROLE_AXIS_BUDGETS[role] ?? ROLE_AXIS_BUDGETS.Brute;
    const adjusted: Record<Axis, number> = { ...base };

    for (const axis in adjustments) {
        if (adjustments.hasOwnProperty(axis)) {
            adjusted[axis as Axis] += (adjustments[axis as Axis] || 0) / 100;
        }
    }
    
    let sum = 0;
    for (const axis in adjusted) {
        adjusted[axis as Axis] = Math.max(0, adjusted[axis as Axis]);
        sum += adjusted[axis as Axis];
    }

    if (sum > 0) {
        for (const axis in adjusted) {
            adjusted[axis as Axis] /= sum;
        }
    }
    return adjusted;
}
