
export const neighborDevelopTables: Record<string, Record<string, string>> = {
    "Minor Faction": { '1': 'Expand: Add a settlement', '2': 'Colonize: Build a new coastal settlement', '3': 'Militarize: Draw in a new fort or military settlement', '4': 'Union: Select a nearby tribe and merge them into the minor faction, becoming one nation.', '5': 'Epic Construction: A new academy, altar, tower? Draw in a new construction', '6': 'Expand: Connect a road to a neighbor and build a trade post.' },
    "Tribe": { '1': 'Monster!: A new Legendary Monster has been discovered.', '2': 'Warpath: War! Select a neighbor and roll on the War! Table', '3': 'Advancement: Upgrade to a Minor Faction.', '4': 'Expand: Add a settlement', '5': 'Floating Village: Create a floating village in a nearby sea or lake', '6': 'Invasion: Take one nearby settlement and switch control to the tribe.' },
    "Hive": { '1': 'Swarm: Place a new Hive somewhere else on the map.', '2': 'Expand: Add a new hive settlement/den/nest nearby', '3': 'Raid: Attack a nearby settlement (1d6: Odd=destroyed, Even=defended)', '4': 'Infest: Attack and replace a nearby settlement with a new nest.', '5': 'Spawn: The hive has bred a new Legendary Monster', '6': 'Expand: Add a new hive settlement/den/nest nearby' },
    "Magic User": { '1': 'Minions: A group of followers has joined. Build a settlement camp nearby.', '2': 'Raid: Attack a nearby settlement (1d6: Odd=destroyed, Even=defended)', '3': 'Expand: Build a new resource camp settlement nearby.', '4': 'Construction: A monolith, shrine, or portal? Draw in a new construction.', '5': 'Alter Land: Alter the lands nearby.', '6': 'Corruption: Taint the land nearby.' },
    "Cult": { '1': 'Expand: Add a settlement', '2': 'Worship: Draw a new Temple nearby and select a deity', '3': 'Epic Construction: A new dungeon, tower, altar? Draw in a new construction nearby', '4': 'Infiltrate: The Cult has taken control of a nearby settlement.', '5': 'Ransack: A nearby settlement has something valuable.', '6': 'Expand: Add a settlement' },
    "Monster": { '1': 'Raid: Attack a nearby settlement (1d6: Odd=destroyed, Even=defended)', '2': 'Treasure: The monster has accumulated vast amounts of wealth.', '3': 'Raid: Attack a nearby settlement (1d6: Odd=destroyed, Even=defended)', '4': 'Ascension: Add it to the list of gods.', '5': 'Lair Building: Create a proper lair or den.', '6': 'Fury: Unleash rage onto a nearby settlement, destroy and replace it with a ruin' }
};

// Maps the neighborType from Era 3 to the correct table key
export const getDevelopmentTableKey = (neighborType: string | undefined): string | null => {
    if (!neighborType) return 'Minor Faction'; // Fallback
    const typeLower = neighborType.toLowerCase();
    if (typeLower.includes('tribe') || typeLower.includes('bandits') || typeLower.includes('pirates')) return 'Tribe';
    if (typeLower.includes('hive')) return 'Hive';
    if (typeLower.includes('magic user')) return 'Magic User';
    if (typeLower.includes('cult') || typeLower.includes('lair') || typeLower.includes('order')) return 'Cult';
    if (typeLower.includes('monster')) return 'Monster';
    if (typeLower.includes('minor kingdom')) return 'Minor Faction';
    return 'Minor Faction'; // Default for any other minor factions
};
