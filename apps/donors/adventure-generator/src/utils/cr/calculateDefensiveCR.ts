import { CreatureDetails } from '../../types/npc';
import { DMG_CR_TABLE } from '../../data/crRules';
import { findRowByValue, getCRFromRow, CRAnalysis } from './crUtils';
import { FEATURE_EFFECTS } from '../../data/crFeatureEffects';
import { getMonsterCR } from '../monsterHelpers';

export function calculateDefensiveCR(monster: CreatureDetails, analysis: CRAnalysis, method: 'dmg' | 'alternate' = 'dmg'): void {
    // 1. Parse Defensive Stats
    const hpMatch = monster.table.hitPoints.match(/^(\d+)/);
    analysis.hp = hpMatch ? parseInt(hpMatch[1]) : 0;

    const acMatch = monster.table.armorClass.match(/^(\d+)/);
    analysis.ac = acMatch ? parseInt(acMatch[1]) : 10;
    analysis.effectiveAC = analysis.ac;

    // Calculate Effective HP based on Immunities/Resistances
    const numImmunities = (monster.damageImmunities?.length || 0);
    const numResistances = (monster.damageResistances?.length || 0);
    let hpMultiplier = 1;
    
    let estimatedTier = 1;
    if (analysis.hp > 200) estimatedTier = 4;
    else if (analysis.hp > 100) estimatedTier = 3;
    else if (analysis.hp > 50) estimatedTier = 2;

    if (numImmunities > 0) {
        if (estimatedTier === 1) hpMultiplier = 2;
        else if (estimatedTier === 2) hpMultiplier = 2;
        else if (estimatedTier === 3) hpMultiplier = 1.5;
        else hpMultiplier = 1.25;
        analysis.breakdown.push(`Effective HP x${hpMultiplier.toFixed(2)} (Immunities)`);
    } else if (numResistances >= 3) {
         if (estimatedTier === 1) hpMultiplier = 2;
        else if (estimatedTier === 2) hpMultiplier = 1.5;
        else if (estimatedTier === 3) hpMultiplier = 1.25;
        else hpMultiplier = 1;
        analysis.breakdown.push(`Effective HP x${hpMultiplier.toFixed(2)} (Resistances)`);
    }

    analysis.effectiveHP = Math.floor(analysis.hp * hpMultiplier);

    // ALTERNATE METHOD: Apply specific feature adjustments
    if (method === 'alternate') {
        const monsterText = `${monster.abilitiesAndTraits || ''} ${monster.actions || ''}`.toLowerCase();
        const monsterCR = getMonsterCR({ id: 'temp', name: 'temp', profile: monster });

        for (const [feature, effect] of Object.entries(FEATURE_EFFECTS)) {
            if (monsterText.includes(`**${feature.toLowerCase()}.**`)) {
                if (effect.effectiveAC) {
                    analysis.effectiveAC += effect.effectiveAC;
                    analysis.breakdown.push(`+${effect.effectiveAC} Effective AC (${feature})`);
                }
                if (effect.effectiveHP) {
                    if (effect.effectiveHP.multiplier) {
                        analysis.effectiveHP = Math.floor(analysis.effectiveHP * effect.effectiveHP.multiplier);
                         analysis.breakdown.push(`EHP x${effect.effectiveHP.multiplier.toFixed(2)} (${feature})`);
                    }
                    if (effect.effectiveHP.add) {
                        let valToAdd = 0;
                        if(feature === 'Regeneration') {
                            const regenMatch = monster.abilitiesAndTraits.match(/regains (\d+) hit points/i);
                            valToAdd = effect.effectiveHP.add(regenMatch ? parseInt(regenMatch[1]) : 0);
                        } else {
                            valToAdd = effect.effectiveHP.add(monsterCR);
                        }
                        analysis.effectiveHP += valToAdd;
                        analysis.breakdown.push(`+${valToAdd} EHP (${feature})`);
                    }
                }
            }
        }
    }

    // 2. Calculate Defensive CR
    const hpRow = findRowByValue(analysis.effectiveHP, 'hpMin', 'hpMax');
    const baseHP_CR = getCRFromRow(hpRow);
    
    const suggestedAC = hpRow.ac;
    const acDiff = analysis.effectiveAC - suggestedAC;
    const dcrAdjustment = Math.floor(acDiff / 2);
    
    let dcrIndex = DMG_CR_TABLE.findIndex(r => r.cr === baseHP_CR);
    if (dcrIndex === -1) dcrIndex = 0;

    dcrIndex = Math.max(0, Math.min(DMG_CR_TABLE.length - 1, dcrIndex + dcrAdjustment));
    analysis.defensiveCR = DMG_CR_TABLE[dcrIndex].cr;
    analysis.breakdown.push(`Defensive CR: ${analysis.defensiveCR} (Base HP CR: ${baseHP_CR}, AC Adj: ${dcrAdjustment > 0 ? '+' : ''}${dcrAdjustment})`);
}
