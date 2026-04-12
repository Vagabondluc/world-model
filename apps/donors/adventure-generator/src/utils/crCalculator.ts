import { CreatureDetails } from '../types/npc';
import { DMG_CR_TABLE } from '../data/crRules';
import { CRAnalysis } from './cr/crUtils';
import { calculateDefensiveCR } from './cr/calculateDefensiveCR';
import { calculateOffensiveCR } from './cr/calculateOffensiveCR';

export { type CRAnalysis };

export function calculateCR(monster: CreatureDetails, method: 'dmg' | 'alternate' = 'dmg'): CRAnalysis {
    const analysis: CRAnalysis = {
        defensiveCR: 0,
        offensiveCR: 0,
        finalCR: 0,
        hp: 0,
        effectiveHP: 0,
        ac: 0,
        effectiveAC: 0,
        dpr: 0,
        attackBonus: 0,
        saveDC: 0,
        warnings: [],
        breakdown: []
    };

    calculateDefensiveCR(monster, analysis, method);
    calculateOffensiveCR(monster, analysis, method);

    // Final CR Calculation
    const rawAvg = (analysis.defensiveCR + analysis.offensiveCR) / 2;
    const finalRow = DMG_CR_TABLE.reduce((prev, curr) => {
        return (Math.abs(curr.cr - rawAvg) < Math.abs(prev.cr - rawAvg) ? curr : prev);
    });
    
    analysis.finalCR = finalRow.cr;

    // Generate Warnings
    const targetCRString = monster.table.challengeRating.split(' ')[0];
    let targetCR = 0;
    if (targetCRString.includes('/')) {
        const [n, d] = targetCRString.split('/');
        targetCR = parseInt(n) / parseInt(d);
    } else {
        targetCR = parseFloat(targetCRString);
    }

    if (Math.abs(analysis.finalCR - targetCR) > 1 && targetCR > 1) {
        if (analysis.finalCR > targetCR) {
            analysis.warnings.push("Calculated CR is significantly higher than Target. Consider reducing HP or Damage.");
        } else {
            analysis.warnings.push("Calculated CR is significantly lower than Target. Consider increasing HP, AC, or Damage.");
        }
    }

    if (Math.abs(analysis.defensiveCR - analysis.offensiveCR) > 5) {
        analysis.warnings.push("Large imbalance between Offensive and Defensive capabilities.");
    }
    
    if (analysis.dpr === 0) {
        analysis.warnings.push("Could not calculate DPR. Ensure actions follow standard 'Hit: X (YdZ + W)' or 'taking X (YdZ)' format.");
    }

    return analysis;
}