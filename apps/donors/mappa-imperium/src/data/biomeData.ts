import { BiomeType } from '@/types';

export interface BiomeInfo {
    name: string;
    color: string;
    description: string;
    commonFeatures: string[];
    movementCost: number;
}

export const BIOME_CONFIG: Record<BiomeType, BiomeInfo> = {
    arctic: {
        name: 'Arctic',
        color: '#E8F4FD',
        description: 'Frozen tundra and ice fields',
        commonFeatures: ['Glaciers', 'Frozen lakes', 'Ice caves', 'Blizzards'],
        movementCost: 2
    },
    coastal: {
        name: 'Coastal',
        color: '#87CEEB',
        description: 'Shores, beaches, and seaside cliffs',
        commonFeatures: ['Harbors', 'Lighthouses', 'Sea caves', 'Tidal pools'],
        movementCost: 1
    },
    desert: {
        name: 'Desert',
        color: '#F4A460',
        description: 'Arid wastelands and sand dunes',
        commonFeatures: ['Oases', 'Sand dunes', 'Ruins', 'Mirages'],
        movementCost: 1.5
    },
    forest: {
        name: 'Forest',
        color: '#228B22',
        description: 'Dense woodlands and groves',
        commonFeatures: ['Ancient trees', 'Clearings', 'Ranger paths', 'Druid circles'],
        movementCost: 1.5
    },
    grassland: {
        name: 'Grassland',
        color: '#9ACD32',
        description: 'Rolling plains and meadows',
        commonFeatures: ['Trade roads', 'Farmsteads', 'River crossings', 'Wildflower fields'],
        movementCost: 1
    },
    hill: {
        name: 'Hills',
        color: '#DEB887',
        description: 'Rolling hills and highlands',
        commonFeatures: ['Mine entrances', 'Hill forts', 'Shepherd paths', 'Stone circles'],
        movementCost: 1.5
    },
    jungle: {
        name: 'Jungle',
        color: '#006400',
        description: 'Dense tropical rainforest',
        commonFeatures: ['Vine bridges', 'Hidden temples', 'Tribal villages', 'Dangerous wildlife'],
        movementCost: 2
    },
    mountain: {
        name: 'Mountain',
        color: '#696969',
        description: 'Rocky peaks and alpine regions',
        commonFeatures: ['Mountain passes', 'Dwarven halls', 'Dragon lairs', 'Sacred peaks'],
        movementCost: 3
    },
    swamp: {
        name: 'Swamp',
        color: '#556B2F',
        description: 'Wetlands and marshes',
        commonFeatures: ['Witch huts', 'Lizardfolk settlements', 'Will-o-wisps', 'Ancient burial mounds'],
        movementCost: 2
    },
    underdark: {
        name: 'Underdark',
        color: '#2F4F4F',
        description: 'Subterranean caverns and tunnels',
        commonFeatures: ['Mushroom forests', 'Underground lakes', 'Drow outposts', 'Crystal formations'],
        movementCost: 1.5
    },
    underwater: {
        name: 'Underwater',
        color: '#4682B4',
        description: 'Beneath the waves',
        commonFeatures: ['Coral reefs', 'Sunken ships', 'Merfolk cities', 'Underwater caves'],
        movementCost: 1
    },
    urban: {
        name: 'Urban',
        color: '#A0A0A0',
        description: 'Cities, towns, and settlements',
        commonFeatures: ['Market squares', 'Guard towers', 'Sewers', 'Noble districts'],
        movementCost: 1
    },
    planar: {
        name: 'Planar',
        color: '#9370DB',
        description: 'Other planes of existence',
        commonFeatures: ['Reality tears', 'Elemental storms', 'Planar gates', 'Impossible geometry'],
        movementCost: 1
    },
    wasteland: {
        name: 'Wasteland',
        color: '#8B4513',
        description: 'Blighted and corrupted lands',
        commonFeatures: ['Cursed ruins', 'Twisted creatures', 'Dead magic zones', 'Battlefields'],
        movementCost: 1.5
    },
    volcanic: {
        name: 'Volcanic',
        color: '#DC143C',
        description: 'Active volcanic regions',
        commonFeatures: ['Lava flows', 'Geysers', 'Elemental rifts', 'Obsidian formations'],
        movementCost: 2
    },
    ocean: {
        name: 'Ocean',
        color: '#1a4d8c',
        description: 'Vast open seas and deep waters',
        commonFeatures: ['Islands', 'Storms', 'Sea monsters', 'Floating debris'],
        movementCost: 1
    },
    lake: {
        name: 'Lake',
        color: '#3399cc',
        description: 'Freshwater body enclosed by land',
        commonFeatures: ['Fisherman boats', 'Reeds', 'Small islands', 'Calm waters'],
        movementCost: 1
    }
};
