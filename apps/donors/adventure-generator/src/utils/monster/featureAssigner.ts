import { GRAMMAR_TAGS } from '../../data/grammarTags';
import { PowerAtom } from '../../types/monsterGrammar';

export interface FeaturePackage {
    saves: string[];
    skills: Record<string, number>;
    resistances: string[];
    immunities: string[];
    condImmunities: string[];
}

type AbilityMods = Record<'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', number>;

export function assignFeatures(role: string, monsterType: string, atoms: PowerAtom[], abilityMods: AbilityMods, prof: number): FeaturePackage {
    const saves: string[] = [];
    const skills: Record<string, number> = {};
    const resistances: string[] = [];
    const immunities: string[] = [];
    const condImmunities: string[] = [];

    if (['Brute', 'Soldier'].includes(role)) saves.push('str', 'con');
    if (['Skirmisher', 'Ambusher'].includes(role)) saves.push('dex', 'int');
    if (['Controller', 'Artillery'].includes(role)) saves.push('int', 'wis');
    if (['Leader', 'Support'].includes(role)) saves.push('wis', 'cha');
    if (role === 'Solo') saves.push('str', 'con', 'wis');

    skills['Perception'] = abilityMods.wis + prof;
    if (['Skirmisher', 'Ambusher'].includes(role)) skills['Stealth'] = abilityMods.dex + prof;
    if (['Brute', 'Soldier'].includes(role)) skills['Athletics'] = abilityMods.str + prof;
    
    const monsterTags = atoms.flatMap(a => GRAMMAR_TAGS.find(t => a.id.startsWith(t.id)) || []);
    for (const tag of monsterTags) {
        if(tag.damageTypes) resistances.push(...tag.damageTypes);
    }
    
    if (monsterType === 'Undead') { immunities.push('poison'); condImmunities.push('poisoned', 'exhaustion'); }
    if (monsterType === 'Construct') { immunities.push('poison', 'psychic'); condImmunities.push('charmed', 'exhaustion', 'frightened', 'paralyzed', 'petrified', 'poisoned'); }
    if (monsterType === 'Elemental' && (monsterTags.some(t => t.id === 'fire'))) { immunities.push('poison', 'fire'); }

    return { saves, skills, resistances, immunities, condImmunities };
}
