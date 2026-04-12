import { PowerAtom, AlignTendency } from '../types/monsterGrammar';
import { SavedMonster, CreatureDetails } from '../types/npc';
import { generateId } from './helpers';
import { CR_TABLE, ROLE_SCALING } from '../data/constants';
import { nudgeDice, parseDiceString, getAverageDamage, DICE_AVG } from './diceHelpers';
import { getAbilityScores, getMod, formatMod } from './monsterMechanics';
import { getStatBaselines } from './monster/statBaselines';
import { assignFeatures } from './monster/featureAssigner';

export function assembleMonsterFromPowers(
    name: string, description: string, cr: number, role: string,
    alignment: AlignTendency, monsterType: string, size: string, initialAtoms: PowerAtom[]
): SavedMonster {
    const stats = getStatBaselines(cr, role);
    const abilityScores = getAbilityScores(role);
    const abilityMods: Record<'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', number> = {
        str: getMod(abilityScores.str), dex: getMod(abilityScores.dex), con: getMod(abilityScores.con),
        int: getMod(abilityScores.int), wis: getMod(abilityScores.wis), cha: getMod(abilityScores.cha)
    };

    let atoms = [...initialAtoms];
    const isPhysicallyOriented = ['Brute', 'Soldier', 'Skirmisher', 'Ambusher'].includes(role);
    if (!atoms.some(a => a.tags.includes('melee'))) {
        const atkName = isPhysicallyOriented ? "Slam" : "Dagger";
        const dmgType = isPhysicallyOriented ? "bludgeoning" : "piercing";
        atoms.push({
            id: 'default:primary', label: 'Primary Melee', axis: isPhysicallyOriented ? 'Offense' : 'Utility', cost: 0,
            tags: ['melee', 'physical', 'primary'], actionType: 'Action', damage: `${isPhysicallyOriented ? "1d8" : "1d4"} ${dmgType}`,
            text: `**${atkName}.** *Melee Weapon Attack:* +{atk} to hit, reach 5 ft., one target. *Hit:* {damage} ${dmgType} damage.`
        });
    }

    if (isPhysicallyOriented) {
        atoms.push({
            id: 'default:secondary', label: 'Secondary Melee', axis: 'Offense', cost: 0,
            tags: ['melee', 'physical', 'secondary'], actionType: 'Action', damage: `1d6 bludgeoning`,
            text: `**Bash.** *Melee Weapon Attack:* +{atk} to hit, reach 5 ft., one target. *Hit:* {damage} bludgeoning damage. If the target is a creature, it must succeed on a DC {dc} Strength saving throw or be knocked prone.`
        });
    }
    
    const scaledAtoms = nudgeDice(atoms, stats.dpr);
    const features = assignFeatures(role, monsterType, atoms, abilityMods, stats.prof);
    const savingThrows: Record<string, number> = {};
    features.saves.forEach(s => {
        const key = s as keyof typeof abilityMods;
        savingThrows[s] = (abilityMods[key] || 0) + stats.prof;
    });

    const formatText = (text: string, damage?: string) => {
        let damageString = damage || '0';
        if (damage) {
            const parsed = parseDiceString(damage);
            if (parsed) {
                const avg = Math.floor(getAverageDamage(damage));
                damageString = `${avg} (${parsed.count}${parsed.die}${parsed.modifier >= 0 ? '+' : '-'}${Math.abs(parsed.modifier)})`;
            }
        }
        return text.split('{atk}').join(String(stats.atk)).split('{dc}').join(String(stats.dc)).split('{damage}').join(damageString);
    };

    const uniqueAtoms = scaledAtoms.filter((atom, index, self) => index === self.findIndex(t => t.id === atom.id));
    let finalTraits = uniqueAtoms.filter(a => a.actionType === 'Trait' || a.actionType === 'Reaction').map(a => formatText(a.text, a.damage)).join('\n\n');
    let finalActions = "";
    if (cr >= 5 && isPhysicallyOriented) {
        const primary = uniqueAtoms.find(a => a.tags.includes('primary'));
        const secondary = uniqueAtoms.find(a => a.tags.includes('secondary'));
        const getName = (text: string) => (text.match(/\*\?(.*?)\.\*\*/) || [])[1]?.toLowerCase() || "attack";
        if (primary && secondary) finalActions += `**Multiattack.** The creature makes two attacks: one with its ${getName(primary.text)} and one with its ${getName(secondary.text)}.\n\n`;
        else if (primary) finalActions += `**Multiattack.** The creature makes two ${getName(primary.text)} attacks.\n\n`;
    }
    finalActions += uniqueAtoms.filter(a => a.actionType === 'Action').map(a => formatText(a.text, a.damage)).join('\n\n');
    const finalLegendary = uniqueAtoms.filter(a => a.actionType === 'Legendary').map(a => formatText(a.text, a.damage)).join('\n\n');

    const sizeDie = { 'Tiny': 'd4', 'Small': 'd6', 'Medium': 'd8', 'Large': 'd10', 'Huge': 'd12', 'Gargantuan': 'd20' }[size || 'Medium'] || 'd8';
    const hdAvg = DICE_AVG[sizeDie] || 4.5;
    const numHd = Math.max(1, Math.round(stats.hp / (hdAvg + abilityMods.con)));
    const hpString = `${Math.floor(numHd * (hdAvg + abilityMods.con))} (${numHd}${sizeDie} ${formatMod(numHd * abilityMods.con)})`;

    const profile: CreatureDetails = {
        table: {
            creatureType: monsterType, size: size, alignment: alignment, armorClass: String(stats.ac), hitPoints: hpString, 
            speed: '30 ft.', senses: 'darkvision 60 ft., passive Perception ' + (10 + (features.skills.Perception || 0)),
            languages: 'understands one language but can\'t speak', challengeRating: `${cr} (${(CR_TABLE[cr] || CR_TABLE[0]).xp} XP)`,
            keyAbilities: 'TBD', role: role
        },
        abilityScores: abilityScores, savingThrows: savingThrows, skills: features.skills,
        damageImmunities: [...new Set(features.immunities)], damageResistances: [...new Set(features.resistances)],
        conditionImmunities: [...new Set(features.condImmunities)],
        abilitiesAndTraits: finalTraits, actions: finalActions, legendaryActions: finalLegendary || undefined,
        roleplayingAndTactics: 'To be determined.'
    };

    return { id: generateId(), name, description, profile };
}
