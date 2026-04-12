import { SavedMonster } from '../types/npc';
import { calculateCR } from './crCalculator';
import { parseDiceString, formatDamagePayload, getAverageDamage, DICE_AVG } from './diceHelpers';
import { DamagePayload } from '../types/monsterGrammar';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Result of the CR solver optimization
 */
export interface CRSolverResult {
  success: boolean;
  finalCR: number;
  targetCR: number;
  iterations: number;
  adjustments: CRAdjustment[];
  warnings: string[];
  originalCR: number;
  modifiedMonster: SavedMonster;
  convergenceDetails: {
    defensiveCR: number;
    offensiveCR: number;
    crDiff: number;
    reachedThreshold: boolean;
  };
}

/**
 * Record of a single adjustment made during CR optimization
 */
export interface CRAdjustment {
  property: string;
  oldValue: number | string;
  newValue: number | string;
  reason: string;
  iteration: number;
  axis: 'defense' | 'offense' | 'balance';
}

/**
 * Configuration options for the CR solver
 */
export interface CRSolverOptions {
  maxIterations?: number;
  convergenceThreshold?: number;
  preserveFeatures?: boolean;
  method?: 'dmg' | 'alternate';
  stepSizeMultiplier?: number;
  minStepSize?: number;
  balanceThreshold?: number;
}

/**
 * Parsed complex damage expression (e.g., "2d6+3d4+5")
 */
interface ComplexDamageExpression {
  parts: Array<{
    count: number;
    die: string;
    modifier: number;
  }>;
  totalModifier: number;
  type: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_OPTIONS: Required<CRSolverOptions> = {
  maxIterations: 20,
  convergenceThreshold: 0.1,
  preserveFeatures: true,
  method: 'dmg',
  stepSizeMultiplier: 1.0,
  minStepSize: 0.5,
  balanceThreshold: 2.0,
};

// Fractional CR values for proper handling
const FRACTIONAL_CR: Record<string, number> = {
  '0': 0,
  '1/8': 0.125,
  '1/4': 0.25,
  '1/2': 0.5,
};

// Convergence thresholds based on CR range
const CR_RANGE_THRESHOLDS = [
  { maxCR: 1, threshold: 0.05 },
  { maxCR: 5, threshold: 0.1 },
  { maxCR: 10, threshold: 0.15 },
  { maxCR: 20, threshold: 0.2 },
  { maxCR: Infinity, threshold: 0.25 },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert CR string to numeric value, handling fractional CRs
 */
function parseCR(crString: string): number {
  const trimmed = crString.trim().split(' ')[0];
  if (FRACTIONAL_CR[trimmed] !== undefined) {
    return FRACTIONAL_CR[trimmed];
  }
  if (trimmed.includes('/')) {
    const [n, d] = trimmed.split('/');
    return parseInt(n, 10) / parseInt(d, 10);
  }
  return parseFloat(trimmed) || 0;
}

/**
 * Get appropriate convergence threshold for target CR
 */
function getConvergenceThreshold(targetCR: number): number {
  for (const range of CR_RANGE_THRESHOLDS) {
    if (targetCR <= range.maxCR) {
      return range.threshold;
    }
  }
  return CR_RANGE_THRESHOLDS[CR_RANGE_THRESHOLDS.length - 1].threshold;
}

/**
 * Calculate dynamic step size based on distance from target
 */
function calculateStepSize(
  currentCR: number,
  targetCR: number,
  iteration: number,
  options: Required<CRSolverOptions>
): number {
  const distance = Math.abs(targetCR - currentCR);
  const baseStep = Math.max(distance * 0.3, options.minStepSize);
  
  // Reduce step size as we get closer (exponential decay)
  const decayFactor = Math.pow(0.9, iteration);
  
  return Math.max(baseStep * decayFactor * options.stepSizeMultiplier, options.minStepSize);
}

/**
 * Parse complex damage expressions (e.g., "2d6+3d4+5 fire")
 */
function parseComplexDamageExpression(damage: string): ComplexDamageExpression | null {
  // Match pattern: XdY + ZdW + ... + N [type]
  // This regex captures multiple dice components and a final modifier
  const dicePattern = /(\d+)d(\d+)/g;
  const parts: Array<{ count: number; die: string; modifier: number }> = [];
  let match;
  
  while ((match = dicePattern.exec(damage)) !== null) {
    parts.push({
      count: parseInt(match[1], 10),
      die: `d${match[2]}`,
      modifier: 0,
    });
  }
  
  if (parts.length === 0) {
    // Fall back to simple parsing
    return null;
  }
  
  // Extract damage type
  const typeMatch = damage.match(/([a-zA-Z]+)$/);
  const type = typeMatch ? typeMatch[1] : '';
  
  // Extract total modifier (everything after dice that's not the type)
  const withoutDice = damage.replace(dicePattern, '').replace(type, '').trim();
  const modifierMatch = withoutDice.match(/([+-]\s*\d+)/);
  const totalModifier = modifierMatch ? parseInt(modifierMatch[1].replace(/\s/g, ''), 10) : 0;
  
  return { parts, totalModifier, type };
}

/**
 * Calculate average damage from complex expression
 */
function getComplexDamageAverage(expression: ComplexDamageExpression): number {
  let total = expression.totalModifier;
  for (const part of expression.parts) {
    total += (DICE_AVG[part.die] || 4.5) * part.count;
  }
  return total;
}

/**
 * Format complex damage expression back to string
 */
function formatComplexDamageExpression(expression: ComplexDamageExpression): string {
  const diceParts = expression.parts
    .map(p => `${p.count}${p.die}`)
    .join(' + ');
  
  const sign = expression.totalModifier >= 0 ? '+' : '-';
  const modStr = expression.totalModifier !== 0 ? ` ${sign} ${Math.abs(expression.totalModifier)}` : '';
  
  return `${diceParts}${modStr} ${expression.type}`.trim();
}

/**
 * Scale complex damage expression by a factor
 */
function scaleComplexDamageExpression(
  expression: ComplexDamageExpression,
  scaleFactor: number
): ComplexDamageExpression {
  // Scale the primary dice component
  if (expression.parts.length > 0) {
    const primaryPart = expression.parts[0];
    const oldCount = primaryPart.count;
    const newCount = Math.max(1, Math.round(primaryPart.count * scaleFactor));
    primaryPart.count = newCount;
    
    // If scaling down significantly, consider reducing die size
    if (scaleFactor < 0.7 && newCount < 3) {
      const dieOrder = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
      const currentIndex = dieOrder.indexOf(primaryPart.die);
      if (currentIndex > 0) {
        primaryPart.die = dieOrder[currentIndex - 1];
      }
    }
    // If scaling up significantly, consider increasing die size
    else if (scaleFactor > 1.3 && newCount > 8) {
      const dieOrder = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
      const currentIndex = dieOrder.indexOf(primaryPart.die);
      if (currentIndex < dieOrder.length - 1) {
        primaryPart.die = dieOrder[currentIndex + 1];
        primaryPart.count = Math.max(1, Math.floor(primaryPart.count * 0.75));
      }
    }
  }
  
  return expression;
}

/**
 * Detect legendary actions in monster profile
 */
function hasLegendaryActions(monster: SavedMonster): boolean {
  return !!(
    monster.profile.legendaryActions ||
    monster.profile.abilitiesAndTraits?.toLowerCase().includes('legendary') ||
    monster.profile.actions?.toLowerCase().includes('legendary')
  );
}

/**
 * Detect special traits that should be preserved
 */
function detectSpecialTraits(monster: SavedMonster): string[] {
  const traits: string[] = [];
  const text = `${monster.profile.abilitiesAndTraits || ''} ${monster.profile.actions || ''}`.toLowerCase();
  
  const specialKeywords = [
    'regeneration', 'magic resistance', 'spellcasting', 'innate spellcasting',
    'legendary resistance', 'recharge', 'lair actions', 'regional effects',
    'shapechanger', 'amphibious', 'siege monster', 'pack tactics'
  ];
  
  for (const keyword of specialKeywords) {
    if (text.includes(keyword)) {
      traits.push(keyword);
    }
  }
  
  return traits;
}

/**
 * Check if monster has immunities or resistances
 */
function hasDamageMitigation(monster: SavedMonster): { immunities: number; resistances: number } {
  return {
    immunities: monster.profile.damageImmunities?.length || 0,
    resistances: monster.profile.damageResistances?.length || 0,
  };
}

// ============================================================================
// Core CR Solver Implementation
// ============================================================================

/**
 * Enhanced CR solver that precisely adjusts monster statistics to achieve target CR
 */
export function solveCR(
  monster: SavedMonster,
  targetCR: number,
  options: CRSolverOptions = {}
): CRSolverResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const convergenceThreshold = getConvergenceThreshold(targetCR);
  
  // Deep clone monster to avoid modifying original
  const workingMonster = JSON.parse(JSON.stringify(monster)) as SavedMonster;
  
  // Track adjustments
  const adjustments: CRAdjustment[] = [];
  const warnings: string[] = [];
  
  // Detect special features
  const isLegendary = hasLegendaryActions(workingMonster);
  const specialTraits = detectSpecialTraits(workingMonster);
  const damageMitigation = hasDamageMitigation(workingMonster);
  
  // Initial analysis
  let analysis = calculateCR(workingMonster.profile, opts.method);
  const originalCR = analysis.finalCR;
  
  // Warn about potential issues
  if (isLegendary) {
    warnings.push('Monster has legendary actions - scaling may affect balance');
  }
  if (specialTraits.length > 0) {
    warnings.push(`Preserving special traits: ${specialTraits.join(', ')}`);
  }
  if (damageMitigation.immunities > 0) {
    warnings.push('Monster has immunities - defensive scaling may be less effective');
  }
  
  let iterations = 0;
  let converged = false;
  let lastCR = originalCR;
  let stagnantCount = 0;
  
  while (iterations < opts.maxIterations && !converged) {
    iterations++;
    
    const currentCR = analysis.finalCR;
    const crDiff = targetCR - currentCR;
    const absDiff = Math.abs(crDiff);
    
    // Check convergence
    if (absDiff <= convergenceThreshold) {
      converged = true;
      break;
    }
    
    // Early exit if we've reached the target exactly
    if (currentCR === targetCR) {
      converged = true;
      break;
    }
    
    // Check for stagnation (CR not changing)
    if (Math.abs(currentCR - lastCR) < 0.01) {
      stagnantCount++;
      if (stagnantCount >= 3) {
        warnings.push(`Convergence stalled at iteration ${iterations}`);
        break;
      }
    } else {
      stagnantCount = 0;
    }
    lastCR = currentCR;
    
    // Calculate step size
    const stepSize = calculateStepSize(currentCR, targetCR, iterations, opts);
    
    // Determine which axis needs adjustment
    const ocrDiff = analysis.offensiveCR - targetCR;
    const dcrDiff = analysis.defensiveCR - targetCR;
    const axisImbalance = Math.abs(analysis.offensiveCR - analysis.defensiveCR);
    
    // Priority-based adjustment strategy
    const isTooWeak = currentCR < targetCR;
    const isTooStrong = currentCR > targetCR;
    
    // Balance check: don't over-optimize one axis
    let adjustDefense = false;
    let adjustOffense = false;
    
    if (axisImbalance > opts.balanceThreshold) {
      // Correct imbalance first
      if (analysis.defensiveCR > analysis.offensiveCR + opts.balanceThreshold) {
        // Too defensive - boost offense or reduce defense
        if (isTooWeak) {
          adjustOffense = true;
        } else {
          adjustDefense = true;
        }
      } else if (analysis.offensiveCR > analysis.defensiveCR + opts.balanceThreshold) {
        // Too offensive - boost defense or reduce offense
        if (isTooWeak) {
          adjustDefense = true;
        } else {
          adjustOffense = true;
        }
      }
    } else {
      // Balanced - adjust based on which is further from target
      if (Math.abs(dcrDiff) > Math.abs(ocrDiff)) {
        adjustDefense = true;
      } else {
        adjustOffense = true;
      }
    }
    
    // Apply adjustments
    if (adjustDefense) {
      applyDefenseAdjustment(
        workingMonster,
        isTooWeak,
        dcrDiff,
        stepSize,
        adjustments,
        iterations
      );
    }
    
    if (adjustOffense) {
      applyOffenseAdjustment(
        workingMonster,
        isTooWeak,
        ocrDiff,
        stepSize,
        adjustments,
        iterations
      );
    }
    
    // Recalculate CR
    analysis = calculateCR(workingMonster.profile, opts.method);
  }
  
  // Final result
  const finalCR = analysis.finalCR;
  const success = Math.abs(finalCR - targetCR) <= convergenceThreshold;
  
  if (!success) {
    warnings.push(
      `Failed to converge to target CR ${targetCR}. Final CR: ${finalCR} (diff: ${Math.abs(finalCR - targetCR).toFixed(2)})`
    );
  }
  
  return {
    success,
    finalCR,
    targetCR,
    iterations,
    adjustments,
    warnings,
    originalCR,
    modifiedMonster: workingMonster,
    convergenceDetails: {
      defensiveCR: analysis.defensiveCR,
      offensiveCR: analysis.offensiveCR,
      crDiff: finalCR - targetCR,
      reachedThreshold: Math.abs(finalCR - targetCR) <= convergenceThreshold,
    },
  };
}

/**
 * Apply defense (HP) adjustment
 */
function applyDefenseAdjustment(
  monster: SavedMonster,
  isTooWeak: boolean,
  dcrDiff: number,
  stepSize: number,
  adjustments: CRAdjustment[],
  iteration: number
): void {
  const hpMatch = monster.profile.table.hitPoints.match(/(\d+)\s*\((\d+)(d\d+)\s*([+-]\s*\d+)?\)/);
  
  if (!hpMatch) {
    return;
  }
  
  const oldHP = parseInt(hpMatch[1]);
  let count = parseInt(hpMatch[2]);
  const die = hpMatch[3];
  const modString = hpMatch[4] ? hpMatch[4].replace(/\s/g, '') : '0';
  let flatMod = parseInt(modString);
  const conMod = Math.round(flatMod / count) || 0;
  
  // Calculate adjustment based on step size and CR difference
  const adjustmentMagnitude = Math.max(1, Math.round(Math.abs(dcrDiff) * stepSize));
  
  if (isTooWeak) {
    // Increase HP
    count = Math.max(count + 1, Math.floor(count * (1 + stepSize * 0.15)));
  } else {
    // Decrease HP
    count = Math.max(1, Math.floor(count * (1 - stepSize * 0.1)));
  }
  
  const newTotalMod = count * conMod;
  const newAvg = Math.floor((DICE_AVG[die] || 4.5) * count + newTotalMod);
  const sign = newTotalMod >= 0 ? '+' : '-';
  const modStr = newTotalMod !== 0 ? ` ${sign} ${Math.abs(newTotalMod)}` : '';
  
  const oldHPString = monster.profile.table.hitPoints;
  monster.profile.table.hitPoints = `${newAvg} (${count}${die}${modStr})`;
  
  adjustments.push({
    property: 'hitPoints',
    oldValue: oldHP,
    newValue: newAvg,
    reason: isTooWeak ? 'Increase HP to raise defensive CR' : 'Decrease HP to lower defensive CR',
    iteration,
    axis: 'defense',
  });
}

/**
 * Apply offense (damage) adjustment
 */
function applyOffenseAdjustment(
  monster: SavedMonster,
  isTooWeak: boolean,
  ocrDiff: number,
  stepSize: number,
  adjustments: CRAdjustment[],
  iteration: number
): void {
  const damageStringRegex = /(\d+)\s*\(([^)]+)\)\s*([a-zA-Z]+)/g;
  
  const scaleActionText = (text: string): string => {
    if (!text) return '';
    
    return text.replace(damageStringRegex, (match, avg, dicePart, type) => {
      const fullDamageString = `${dicePart} ${type}`;
      
      // Try complex parsing first
      const complex = parseComplexDamageExpression(fullDamageString);
      let newDamageString: string;
      
      if (complex) {
        // Scale complex expression
        const scaleFactor = isTooWeak ? 1 + stepSize * 0.2 : 1 - stepSize * 0.15;
        const scaled = scaleComplexDamageExpression(complex, scaleFactor);
        newDamageString = formatComplexDamageExpression(scaled);
      } else {
        // Fall back to simple parsing
        const parsed = parseDiceString(fullDamageString);
        if (!parsed) return match;
        
        let { count, die, modifier, type: dmgType } = parsed;
        const oldAvg = getAverageDamage(fullDamageString);
        
        if (isTooWeak) {
          count = Math.max(count + 1, Math.floor(count * (1 + stepSize * 0.2)));
        } else {
          count = Math.max(1, Math.floor(count * (1 - stepSize * 0.15)));
        }
        
        const newPayload: DamagePayload = { count, die, modifier, type: dmgType };
        newDamageString = formatDamagePayload(newPayload);
      }
      
      // Calculate new average
      const newAvg = Math.floor(getAverageDamage(newDamageString));
      const sign = newDamageString.includes('-') && !newDamageString.includes(' - ') ? '' : ' ';
      
      adjustments.push({
        property: 'damage',
        oldValue: avg,
        newValue: newAvg,
        reason: isTooWeak ? 'Increase damage to raise offensive CR' : 'Decrease damage to lower offensive CR',
        iteration,
        axis: 'offense',
      });
      
      return `${newAvg} (${newDamageString.split(' ')[0]}) ${type}`;
    });
  };
  
  monster.profile.actions = scaleActionText(monster.profile.actions);
  
  if (monster.profile.legendaryActions) {
    monster.profile.legendaryActions = scaleActionText(monster.profile.legendaryActions);
  }
}

// ============================================================================
// Legacy Function (Backward Compatibility)
// ============================================================================

/**
 * Legacy function for backward compatibility
 * @deprecated Use solveCR instead for better results
 */
export function scaleMonsterToCR(
  monster: SavedMonster,
  targetCR: number,
  method: 'dmg' | 'alternate' = 'dmg'
): SavedMonster {
  const result = solveCR(monster, targetCR, { method });
  return JSON.parse(JSON.stringify(monster)) as SavedMonster;
}

// ============================================================================
// Utility Functions for External Use
// ============================================================================

/**
 * Get the optimal CR for a monster based on its current stats
 */
export function getOptimalCR(monster: SavedMonster, method: 'dmg' | 'alternate' = 'dmg'): number {
  const analysis = calculateCR(monster.profile, method);
  return analysis.finalCR;
}

/**
 * Check if a monster is balanced (defensive and offensive CR are close)
 */
export function isMonsterBalanced(
  monster: SavedMonster,
  threshold: number = 2.0,
  method: 'dmg' | 'alternate' = 'dmg'
): boolean {
  const analysis = calculateCR(monster.profile, method);
  return Math.abs(analysis.defensiveCR - analysis.offensiveCR) <= threshold;
}

/**
 * Get suggestions for balancing a monster
 */
export function getBalanceSuggestions(
  monster: SavedMonster,
  method: 'dmg' | 'alternate' = 'dmg'
): string[] {
  const analysis = calculateCR(monster.profile, method);
  const suggestions: string[] = [];
  
  const dcrDiff = analysis.defensiveCR - analysis.offensiveCR;
  
  if (dcrDiff > 2) {
    suggestions.push('Monster is too defensive. Consider increasing damage or reducing HP.');
  } else if (dcrDiff < -2) {
    suggestions.push('Monster is too offensive. Consider increasing HP or reducing damage.');
  }
  
  if (analysis.dpr === 0) {
    suggestions.push('Could not calculate DPR. Check action formatting.');
  }
  
  return suggestions;
}
