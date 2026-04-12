import { LocationType, BiomeType } from '@/types';

// --- Inline Naming Engine ---
export const THEME_ADJECTIVES: Record<string, string[]> = {
    surface: ['Green', 'Verdant', 'Sunny', 'Bright', 'Mist', 'Golden', 'Emerald', 'Flowering'],
    underdark: ['Dark', 'Deep', 'Echoing', 'Silent', 'Crystal', 'Gloom', 'Shadow', 'Obsidian'],
    feywild: ['Wild', 'Arcane', 'Shimmering', 'Twilight', 'Eternal', 'Dreaming', 'Prismatic'],
    shadowfell: ['Grey', 'Bleak', 'Hollow', 'Raven', 'Dusky', 'Mournful', 'Cold', 'Withered'],
    elemental_fire: ['Burning', 'Searing', 'Ashen', 'Crimson', 'Blazing', 'Molten', 'Smoldering'],
    elemental_water: ['Deep', 'Tidal', 'Azure', 'Foaming', 'Sunken', 'Abyssal', 'Coral']
};

export function generateLocationName(type: LocationType, biome: BiomeType, theme: string): string {
    const biomePrefixes = {
        forest: ['Green', 'Oak', 'Moss', 'Whisper', 'Shadow'],
        mountain: ['High', 'Stone', 'Cloud', 'Iron', 'Peak'],
        desert: ['Sand', 'Sun', 'Dune', 'Gold', 'Dust'],
        swamp: ['Murk', 'Rot', 'Black', 'Mud', 'Silt'],
        ice: ['Frost', 'Ice', 'Snow', 'White', 'Cold'],
        grassland: ['Green', 'Field', 'Sun', 'Wind', 'Fair']
    };

    const suffixes = {
        Settlement: ['ton', 'ville', 'keep', 'hold', 'watch', 'glen', 'haven'],
        Dungeon: ['tomb', 'crypt', 'lair', 'cavern', 'ruin', 'temple'],
        Battlemap: ['clearing', 'pass', 'camp', 'outpost', 'ambush'],
        'Special Location': ['shrine', 'monument', 'tower', 'circle', 'gate']
    };

    const prefixes = (biomePrefixes as any)[biome] || ['Grand', 'New', 'Old', 'Lost', 'Hidden'];
    const suffixList = (suffixes as any)[type] || ['place', 'site'];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixList[Math.floor(Math.random() * suffixList.length)];

    return `${prefix}${suffix}`;
}
