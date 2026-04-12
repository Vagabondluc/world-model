
import { PowerAtom, DamagePayload } from '../types/monsterGrammar';

export const DICE_AVG: Record<string, number> = {
    'd4': 2.5, 'd6': 3.5, 'd8': 4.5, 'd10': 5.5, 'd12': 6.5, 'd20': 10.5
};
const DICE_ORDER = ['d4', 'd6', 'd8', 'd10', 'd12'];

export function parseDiceString(damage: string): DamagePayload | null {
    // Matches "2d6 + 3 fire", "1d8 piercing", "4d10+5"
    const match = damage.match(/(\d+)d(\d+)\s*([+-]?)\s*(\d*)\s*(.*)/);
    if (!match) return null;
    
    const count = parseInt(match[1], 10);
    const die = `d${match[2]}`;
    const sign = match[3] === '-' ? -1 : 1;
    const modVal = match[4] ? parseInt(match[4], 10) : 0;
    const modifier = sign * modVal;
    const type = match[5].trim();

    return { count, die, modifier, type };
}

export function formatDamagePayload(payload: DamagePayload): string {
    const sign = payload.modifier >= 0 ? '+' : '-';
    const modStr = payload.modifier !== 0 ? ` ${sign} ${Math.abs(payload.modifier)}` : '';
    return `${payload.count}${payload.die}${modStr} ${payload.type}`;
}

export function getAverageDamage(damage: string): number {
    const parsed = parseDiceString(damage);
    if (!parsed) return 0;
    return (DICE_AVG[parsed.die] || 0) * parsed.count + parsed.modifier;
}

export function nudgeDice(atoms: PowerAtom[], targetDpr: number): PowerAtom[] {
    const damagingAtoms = atoms.filter(a => a.damage && a.actionType !== 'Trait');
    
    if (damagingAtoms.length === 0) return atoms;
    
    const attacksPerRound = targetDpr >= 30 ? 2 : 1; // Very rough heuristic
    const targetDprPerAttack = targetDpr / attacksPerRound;

    const scaledAtoms = atoms.map(atom => {
        if (!atom.damage || atom.actionType !== 'Action') return atom;

        const parsed = parseDiceString(atom.damage);
        if (!parsed) return atom;

        let { count, die, modifier, type } = parsed;
        let currentAvg = (DICE_AVG[die] || 0) * count + modifier;

        // Nudge loop
        let iterations = 0;
        while (Math.abs(currentAvg - targetDprPerAttack) > 3 && iterations < 20) {
            if (currentAvg < targetDprPerAttack) {
                // Too weak, buff it
                if (count < 12) {
                    count++;
                } else if (DICE_ORDER.indexOf(die) < DICE_ORDER.length - 1) {
                    die = DICE_ORDER[DICE_ORDER.indexOf(die) + 1];
                    count = Math.max(1, Math.floor(count * 0.75)); // Reset count slightly when upgrading die
                } else {
                    modifier += 2; // Cap broken, add flat damage
                }
            } else {
                // Too strong, nerf it
                if (count > 1) {
                    count--;
                } else if (DICE_ORDER.indexOf(die) > 0) {
                    die = DICE_ORDER[DICE_ORDER.indexOf(die) - 1];
                    count = Math.ceil(count * 1.25);
                } else {
                    break; // Can't reduce further
                }
            }
            currentAvg = (DICE_AVG[die] || 0) * count + modifier;
            iterations++;
        }

        const newDamagePayload: DamagePayload = { count, die, modifier, type };
        const newDamageString = formatDamagePayload(newDamagePayload);
        
        return { ...atom, damage: newDamageString };
    });

    return scaledAtoms;
}
