import { CreatureDetails } from '../../types/npc';
import { DMG_CR_TABLE } from '../../data/crRules';
import { findRowByValue, getCRFromRow, CRAnalysis } from './crUtils';
import { FEATURE_EFFECTS } from '../../data/crFeatureEffects';

export function calculateOffensiveCR(monster: CreatureDetails, analysis: CRAnalysis, method: 'dmg' | 'alternate' = 'dmg'): void {
    const damageAmounts: number[] = [];
    
    // Improved regex to find all instances of average damage in parens or before parens
    // Handles: "10 (3d6)", "taking 22 (4d10)", "Hit: 7 (1d8+3)"
    const damageRegex = /(?:Hit:|takes?|taking)\s+(\d+)\s*\(/gi;
    let match;
    while ((match = damageRegex.exec(monster.actions || '')) !== null) {
        damageAmounts.push(parseInt(match[1]));
    }

    // Also look for additional damage phrases like "plus 4 (1d8) poison"
    const plusRegex = /plus\s+(\d+)\s*\(/gi;
    while ((match = plusRegex.exec(monster.actions || '')) !== null) {
        // If we found a "Hit" previously, this might be a secondary damage type
        // In simple DPR calc, we just add it to the pool for round max selection
        damageAmounts.push(parseInt(match[1]));
    }
    
    let multiattackCount = 1;
    if (monster.actions?.toLowerCase().includes('multiattack')) {
        const maMatch = monster.actions.match(/makes (\w+)/i);
        if (maMatch) {
            const word = maMatch[1].toLowerCase();
            if (word === 'two') multiattackCount = 2;
            else if (word === 'three') multiattackCount = 3;
            else if (word === 'four') multiattackCount = 4;
            else if (word === 'five') multiattackCount = 5;
        }
    }

    let avgDpr = 0;
    if (damageAmounts.length > 0) {
        // Heuristic: sum the top damaging action and apply multiattack
        // A better calc would simulate 3 rounds, but this is a solid estimate
        const maxActionDmg = Math.max(...damageAmounts);
        avgDpr = maxActionDmg * multiattackCount;
        analysis.dpr = avgDpr;
    }

    const atkRegex = /(?:Attack:|to hit).*?([+-]\d+)/i;
    const atkMatch = monster.actions?.match(atkRegex);
    analysis.attackBonus = atkMatch ? parseInt(atkMatch[1]) : 0;

    const dcRegex = /DC\s*(\d+)/i;
    let dcMatch = monster.actions?.match(dcRegex);
    if (!dcMatch) dcMatch = monster.abilitiesAndTraits?.match(dcRegex);
    analysis.saveDC = dcMatch ? parseInt(dcMatch[1]) : 0;

    // ALTERNATE METHOD: Apply specific feature adjustments
    if (method === 'alternate') {
        const monsterText = `${monster.abilitiesAndTraits || ''} ${monster.actions || ''}`.toLowerCase();
        for (const [feature, effect] of Object.entries(FEATURE_EFFECTS)) {
            if (monsterText.includes(`**${feature.toLowerCase()}.**`)) {
                if (effect.dpr) {
                    if (feature === 'Damage Transfer') {
                        const ehpThird = Math.floor(analysis.effectiveHP / 3);
                        analysis.dpr += ehpThird;
                        analysis.breakdown.push(`+${ehpThird} DPR (Damage Transfer)`);
                    } else {
                        analysis.dpr += effect.dpr;
                        analysis.breakdown.push(`+${effect.dpr} DPR (${feature})`);
                    }
                }
                if (effect.attackBonus) {
                    analysis.attackBonus += effect.attackBonus;
                    analysis.breakdown.push(`+${effect.attackBonus} Atk Bonus (${feature})`);
                }
            }
        }
    }

    const dprRow = findRowByValue(analysis.dpr, 'dmgMin', 'dmgMax');
    const baseDPR_CR = getCRFromRow(dprRow);

    const suggestedAtk = dprRow.atk;
    const suggestedDC = dprRow.dc;
    
    let ocrAdjustment = 0;
    // Heuristic: If high DC and low Atk, use DC for adjustment
    if (analysis.saveDC > 10 && (!analysis.attackBonus || analysis.attackBonus < suggestedAtk - 2)) {
         const dcDiff = analysis.saveDC - suggestedDC;
         ocrAdjustment = Math.floor(dcDiff / 2);
    } else {
        const atkDiff = analysis.attackBonus - suggestedAtk;
        ocrAdjustment = Math.floor(atkDiff / 2);
    }

    let ocrIndex = DMG_CR_TABLE.findIndex(r => r.cr === baseDPR_CR);
    if (ocrIndex === -1) ocrIndex = 0;

    ocrIndex = Math.max(0, Math.min(DMG_CR_TABLE.length - 1, ocrIndex + ocrAdjustment));
    analysis.offensiveCR = DMG_CR_TABLE[ocrIndex].cr;
    analysis.breakdown.push(`Offensive CR: ${analysis.offensiveCR} (Base DPR CR: ${baseDPR_CR}, Atk/DC Adj: ${ocrAdjustment > 0 ? '+' : ''}${ocrAdjustment})`);
}