import { LocationType, BiomeType } from '../../types/location';
import { GenerationTheme } from '../mapGenerationUtils';
import { MarkovGenerator, MARKOV_DATA } from '../markovGenerator';

// --- Markov Instances ---
const generators: Record<string, MarkovGenerator> = {
    surface: new MarkovGenerator(MARKOV_DATA.human),
    feywild: new MarkovGenerator(MARKOV_DATA.elven),
    shadowfell: new MarkovGenerator(MARKOV_DATA.human), // Maybe mix with necrotic later
    underdark: new MarkovGenerator(MARKOV_DATA.dwarven),
    elemental_fire: new MarkovGenerator(MARKOV_DATA.infernal),
    elemental_water: new MarkovGenerator(MARKOV_DATA.draconic),
};

const LOCATION_NOUNS: Record<LocationType, string[]> = {
    'Settlement': ['Bastion', 'Hamlet', 'Keep', 'Rest', 'Hold', 'Outpost', 'Refuge', 'Crossroads', 'Citadel', 'Sanctuary', 'Village', 'Town', 'Port', 'Burrow', 'Steading', 'Garrison'],
    'Dungeon': ['Crypt', 'Vault', 'Cave', 'Tomb', 'Lair', 'Pit', 'Ruins', 'Dungeon', 'Catacombs', 'Temple', 'Delve', 'Oubliette', 'Ossuary', 'Warren'],
    'Battlemap': ['Field', 'Pass', 'Ridge', 'Clearing', 'Bridge', 'Ambush Point', 'Gorge', 'Overlook', 'Crossing', 'Redoubt', 'Trench', 'Watchtower'],
    'Special Location': ['Shrine', 'Stone', 'Pool', 'Altar', 'Monolith', 'Grove', 'Circle', 'Portal', 'Rift', 'Statue', 'Obelisk', 'Fountain', 'Totem']
};

const WATER_MODIFIERS = {
    island: ['Isle', 'Atoll', 'Reef', 'Skerry', 'Sandbar', 'Key', 'Rock'],
    underwater: ['Abyss', 'Trench', 'Grotto', 'Shelf', 'Vents', 'Current', 'Depth'],
    coastal: ['Cove', 'Bay', 'Harbor', 'Shoal', 'Point', 'Sound']
};

export const THEME_ADJECTIVES: Record<GenerationTheme, string[]> = {
    surface: ['Old', 'New', 'Green', 'High', 'Low', 'Sunny', 'Windy', 'Golden', 'Stone', 'River', 'Iron', 'Silver', 'Black', 'White', 'Red', 'Oak', 'Pine'],
    feywild: ['Singing', 'Dreaming', 'Crystal', 'Eternal', 'Twisted', 'Bright', 'Moonlit', 'Sunless', 'Verdant', 'Shimmering', 'Faerie', 'Glow', 'Primal'],
    shadowfell: ['Bleak', 'Grey', 'Ashen', 'Sorrowful', 'Weeping', 'Silent', 'Hollow', 'Forgotten', 'Raven', 'Pale', 'Ghostly', 'Gloomy', 'Dread'],
    underdark: ['Deep', 'Echoing', 'Dark', 'Glowing', 'Stone', 'Iron', 'Spider', 'Gem', 'Obsidian', 'Pale', 'Fungal', 'Silent', 'Blind'],
    elemental_fire: ['Burning', 'Smoking', 'Ashen', 'Molten', 'Sear', 'Blazing', 'Charred', 'Red', 'Black', 'Infernal', 'Cinder', 'Obsidian', 'Scorched'],
    elemental_water: ['Drowned', 'Sunken', 'Coral', 'Abyssal', 'Pearl', 'Flowing', 'Tidal', 'Blue', 'Deep', 'Wet', 'Brine', 'Salt', 'Frothing'],
};

export function generateLocationName(type: LocationType, biome: BiomeType, theme: GenerationTheme): string {
    const generator = generators[theme] || generators.surface;
    const properName = generator.generate();

    const adjList = THEME_ADJECTIVES[theme] || THEME_ADJECTIVES.surface;
    const nounList = LOCATION_NOUNS[type];

    const adj = adjList[Math.floor(Math.random() * adjList.length)];
    const noun = nounList[Math.floor(Math.random() * nounList.length)];

    // Biome-aware water logic
    let waterSuffix = "";
    if (biome === 'ocean' || biome === 'lake' || biome === 'underwater' || biome === 'coastal') {
        const rand = Math.random();
        if (biome === 'underwater') {
            waterSuffix = " of the " + WATER_MODIFIERS.underwater[Math.floor(Math.random() * WATER_MODIFIERS.underwater.length)];
        } else if (biome === 'ocean' || biome === 'lake') {
            // Assume it's an island if it's placed in open water
            waterSuffix = " " + WATER_MODIFIERS.island[Math.floor(Math.random() * WATER_MODIFIERS.island.length)];
        } else if (biome === 'coastal') {
            waterSuffix = " " + WATER_MODIFIERS.coastal[Math.floor(Math.random() * WATER_MODIFIERS.coastal.length)];
        }
    }

    const structure = Math.random();
    if (structure < 0.3) {
        return `${properName}'s ${noun}${waterSuffix}`;
    } else if (structure < 0.6) {
        return `The ${adj} ${noun}${waterSuffix}`;
    } else if (structure < 0.9) {
        return `${properName} ${noun}${waterSuffix}`;
    } else {
        return `The ${noun} of ${properName}${waterSuffix}`;
    }
}