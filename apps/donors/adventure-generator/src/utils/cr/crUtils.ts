
import { DMG_CR_TABLE, CRStatRow } from '../../data/crRules';

export interface CRAnalysis {
    defensiveCR: number;
    offensiveCR: number;
    finalCR: number;
    hp: number;
    effectiveHP: number;
    ac: number;
    effectiveAC: number;
    dpr: number;
    attackBonus: number;
    saveDC: number;
    warnings: string[];
    breakdown: string[];
}

export function findRowByValue(value: number, keyMin: keyof CRStatRow, keyMax: keyof CRStatRow): CRStatRow {
    let bestRow = DMG_CR_TABLE[0];
    
    for (const row of DMG_CR_TABLE) {
        const min = row[keyMin] as number;
        const max = row[keyMax] as number;
        if (value >= min && value <= max) return row;
        if (value < min) return bestRow;
        bestRow = row;
    }
    return bestRow;
}

export function getCRFromRow(row: CRStatRow): number {
    return row.cr;
}
