import { CR_TABLE, ROLE_SCALING } from '../../data/constants';
import { getProficiencyBonus } from '../monsterHelpers';

export interface StatBaseline {
    ac: number;
    hp: number;
    dpr: number;
    atk: number;
    dc: number;
    prof: number;
}

/**
 * Calculates base mechanical stats for a monster based on CR and Role.
 */
export function getStatBaselines(cr: number, role: string): StatBaseline {
    const baseStats = CR_TABLE[cr] || CR_TABLE[0];
    const roleModifiers = ROLE_SCALING[role] || ROLE_SCALING.Brute;
    const prof = getProficiencyBonus(cr);

    return {
        ac: baseStats.ac + roleModifiers.acMod,
        hp: Math.round(((baseStats.hp[0] + baseStats.hp[1]) / 2) * roleModifiers.hpMult),
        dpr: ((baseStats.dpr[0] + baseStats.dpr[1]) / 2) + roleModifiers.dprMod,
        atk: baseStats.atk,
        dc: baseStats.dc,
        prof
    };
}