
import { SavedMonster } from '../types/npc';
import { CompendiumEntry } from '../types/compendium'; // Updated import

// Helper types for organization
export type OrganizationStrategy = 'flat' | 'nested-by-level' | 'nested-by-cr' | 'nested-by-type';

interface SpellLike {
    name: string;
    level: number;
}

interface ItemLike {
    name: string;
    rarity?: string;
    type?: string;
}

export class RuleCurator {

    /**
     * Determines the file path for a monster based on its data and the campaign root.
     * Uses nested structure: monsters/type/cr/name.yaml
     */
    static getMonsterPath(rootPath: string, monster: SavedMonster): string {
        const type = monster.profile.table.creatureType.toLowerCase().split(' ')[0] || 'unknown';
        // Normalize CR (e.g., "1/4" -> "0.25" for sorting? Or keeps string "1-4")
        // Folder friendly names: "1/4" -> "0-25", "1" -> "1"
        const crSafe = (monster.profile.table.challengeRating || "0").replace('/', '-');

        const slug = this.slugify(monster.name);

        // Structure: monsters/beast/cr-0/rat.yaml
        return `${rootPath}/rules/monsters/${type}/cr-${crSafe}/${slug}.yaml`;
    }

    /**
     * Determines the file path for a spell based on its data.
     * Structure: rules/spells/level-N/name.md
     */
    static getSpellPath(rootPath: string, spell: SpellLike): string {
        const level = spell.level === 0 ? 'cantrip' : `level-${spell.level}`;
        const slug = this.slugify(spell.name);
        return `${rootPath}/rules/spells/${level}/${slug}.md`;
    }

    /**
     * Determines the file path for an item.
     * Structure: rules/items/rarity/type/name.md
     */
    static getItemPath(rootPath: string, item: ItemLike): string {
        const rarity = (item.rarity || 'common').toLowerCase().replace(' ', '-');
        const type = (item.type || 'wondrous').toLowerCase().replace(' ', '-');
        const slug = this.slugify(item.name);
        return `${rootPath}/rules/items/${rarity}/${type}/${slug}.md`;
    }

    private static slugify(text: string): string {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
}
