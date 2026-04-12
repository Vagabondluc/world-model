import { SavedMonster, MonsterIndexEntry } from "../types/npc";
import { MONSTER_TYPES } from "../data/constants";

/**
 * Parses a Challenge Rating string (e.g., "1/4 (50 XP)", "10") into a comparable number.
 * Handles fractions commonly used in D&D CRs.
 */
export const getMonsterCR = (monster: SavedMonster | MonsterIndexEntry): number => {
    const isSavedMonster = (value: SavedMonster | MonsterIndexEntry): value is SavedMonster => 'profile' in value;
    const crString = (isSavedMonster(monster) ? monster.profile.table.challengeRating : monster.cr)?.split(' ')[0] || "0";
    
    if (crString.includes('/')) {
        const [num, den] = crString.split('/').map(Number);
        if (isNaN(num) || isNaN(den) || den === 0) return 0;
        return num / den;
    }
    
    return parseFloat(crString) || 0;
};

/**
 * Extracts the base creature type from a potentially complex type string.
 * e.g., "Small humanoid (goblinoid)" -> "Humanoid"
 */
export const getMonsterType = (monster: SavedMonster | MonsterIndexEntry): string => {
    if (!('profile' in monster)) {
        return (monster as MonsterIndexEntry).type;
    }

    const fullType = monster.profile.table.creatureType || '';
    // Handle informational entries that don't have a real type
    if (fullType.toLowerCase().includes('informational')) return 'Other';
    
    const lowerType = fullType.toLowerCase();

    for (const type of MONSTER_TYPES) {
        if (lowerType.includes(type.toLowerCase())) {
            return type;
        }
    }
    return 'Other';
};

/**
 * Calculates the proficiency bonus for a given Challenge Rating.
 * Based on the table in the D&D 5e Dungeon Master's Guide.
 */
export function getProficiencyBonus(cr: number): number {
    if (cr < 5) return 2;
    if (cr < 9) return 3;
    if (cr < 13) return 4;
    if (cr < 17) return 5;
    if (cr < 21) return 6;
    if (cr < 25) return 7;
    if (cr < 29) return 8;
    return 9;
}
