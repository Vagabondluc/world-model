import { v4 as uuidv4 } from 'uuid';
import { Open5eMonster, Open5eAction } from './open5eService';
import { SavedMonster } from '../schemas/npc';

export class SrdNormalizationService {

    /**
     * Converts an Open5e Monster response into our internal SavedMonster format.
     */
    static normalizeMonster(data: Open5eMonster): SavedMonster {
        return {
            id: uuidv4(),
            name: data.name,
            description: `A ${data.size} ${data.type} (${data.subtype || 'standard'}), ${data.alignment}.`,
            source: data.document__slug,
            profile: {
                table: {
                    creatureType: data.type,
                    size: data.size,
                    alignment: data.alignment,
                    armorClass: this.formatArmor(data.armor_class, data.armor_desc),
                    hitPoints: `${data.hit_points} (${data.hit_dice})`,
                    speed: this.formatSpeed(data.speed),
                    senses: data.senses || '-',
                    languages: data.languages || '-',
                    challengeRating: data.challenge_rating,
                    keyAbilities: this.formatKeyAbilities(data),
                    role: 'Combatant'
                },
                abilityScores: {
                    str: data.strength,
                    dex: data.dexterity,
                    con: data.constitution,
                    int: data.intelligence,
                    wis: data.wisdom,
                    cha: data.charisma
                },
                savingThrows: this.formatSavingThrows(data),
                skills: data.skills,
                damageVulnerabilities: this.splitCommaList(data.damage_vulnerabilities),
                damageResistances: this.splitCommaList(data.damage_resistances),
                damageImmunities: this.splitCommaList(data.damage_immunities),
                conditionImmunities: this.splitCommaList(data.condition_immunities),
                abilitiesAndTraits: this.actionsToMarkdown(data.special_abilities || []),
                actions: this.actionsToMarkdown(data.actions),
                legendaryActions: data.legendary_actions ? this.actionsToMarkdown(data.legendary_actions) : undefined,
                roleplayingAndTactics: `**Tactics:** Use best attacks. **Roleplaying:** ${data.alignment || 'Neutral'} behavior.`,
            },
            origin: {
                type: 'import',
                sourceId: 'open5e',
                generatorStep: 'import',
                historyStateId: undefined
            }
        };
    }

    private static getModifier(score: number): string {
        const mod = Math.floor((score - 10) / 2);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    }

    private static formatKeyAbilities(data: Open5eMonster): string {
        const abils = [
            ['STR', data.strength],
            ['DEX', data.dexterity],
            ['CON', data.constitution],
            ['INT', data.intelligence],
            ['WIS', data.wisdom],
            ['CHA', data.charisma]
        ];
        return abils.map(([label, score]) => `${label} ${score} (${this.getModifier(score as number)})`).join(', ');
    }

    private static formatSavingThrows(data: Open5eMonster): Record<string, number> {
        const saves: Record<string, number> = {};
        if (data.strength_save !== null) saves.STR = data.strength_save;
        if (data.dexterity_save !== null) saves.DEX = data.dexterity_save;
        if (data.constitution_save !== null) saves.CON = data.constitution_save;
        if (data.intelligence_save !== null) saves.INT = data.intelligence_save;
        if (data.wisdom_save !== null) saves.WIS = data.wisdom_save;
        if (data.charisma_save !== null) saves.CHA = data.charisma_save;
        return saves;
    }

    private static formatArmor(ac: number, desc: string | null): string {
        return desc ? `${ac} (${desc})` : `${ac}`;
    }

    private static formatSpeed(speed: Record<string, number | undefined>): string {
        return Object.entries(speed)
            .filter(([_, val]) => val !== undefined)
            .map(([type, val]) => type === 'walk' ? `${val} ft.` : `${type} ${val} ft.`)
            .join(', ');
    }

    private static splitCommaList(text: string | null): string[] {
        if (!text) return [];
        return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }

    private static actionsToMarkdown(actions: Open5eAction[]): string {
        if (!actions || actions.length === 0) return '';

        return actions.map(action => {
            // Standard D&D statblock formatting: Bold-Italic for the name
            return `***${action.name}.*** ${action.desc}`;
        }).join('\n\n');
    }
}
