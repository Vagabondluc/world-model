// Data from Era III: Age of Foundation rulebook

export const ancestryTable: Record<number, string> = {
    2: "Demonkind",
    3: "Seafolk",
    4: "Smallfolk",
    5: "Reptilian",
    6: "Dwarves",
    7: "Humans",
    8: "Elves",
    9: "Greenskins",
    10: "Animalfolk",
    11: "Giantkind",
    12: "Player's Choice"
};

export const symbolRow1: Record<number, string> = { 1: "Flame", 2: "Horse", 3: "Boar", 4: "Lion", 5: "Dragon", 6: "Hydra" };
export const symbolRow2: Record<number, string> = { 1: "Lightning Bolt", 2: "Bird", 3: "Mountain", 4: "Sun", 5: "Moon", 6: "Leaf" };
export const symbolRow3: Record<number, string> = { 1: "Tree", 2: "Claw", 3: "Spider", 4: "Grain", 5: "Bow", 6: "Horseshoe" };
export const symbolRow4: Record<number, string> = { 1: "Harp", 2: "Fish", 3: "Anvil", 4: "Wolf", 5: "Wings", 6: "Skull" };
export const symbolRow5: Record<number, string> = { 1: "Axe", 2: "Diamond", 3: "Flower", 4: "Apple", 5: "Cup", 6: "Spade" };
export const symbolRow6: Record<number, string> = { 1: "Sword", 2: "Beholder", 3: "Scorpion", 4: "Crab", 5: "Unicorn", 6: "Star" };

export const symbolTables: Record<number, Record<number, string>> = {
    1: symbolRow1,
    2: symbolRow2,
    3: symbolRow3,
    4: symbolRow4,
    5: symbolRow5,
    6: symbolRow6
};


export const colorTable: Record<number, string> = {
    1: "Crimson", 2: "Red", 3: "Pink", 4: "Dark Blue", 5: "Lt Blue", 6: "Blue",
    7: "Dark Brown", 8: "Brown", 9: "Tan", 10: "Lime Green", 11: "Green", 12: "Dark Green",
    13: "Peach", 14: "Burgundy", 15: "Turquoise", 16: "Burnt Orange", 17: "Cream", 18: "Dark Purple",
    19: "Auburn", 20: "Lt Grey", 21: "Cyan", 22: "Magenta", 23: "Rose", 24: "Slate",
    25: "Grey", 26: "Charcoal", 27: "Light Grey", 28: "Amber", 29: "Purple", 30: "Dark Red",
    31: "Yellow", 32: "Orange", 33: "Gold", 34: "Silver", 35: "Black", 36: "White"
};

// Simplified for 1d6 roll. We can combine rolls in the component.
export const simpleColorTable: Record<number, string[]> = {
    1: ["Crimson", "Red", "Pink", "Dark Blue", "Lt Blue", "Blue"],
    2: ["Dark Brown", "Brown", "Tan", "Lime Green", "Green", "Dark Green"],
    3: ["Peach", "Burgundy", "Turquoise", "Burnt Orange", "Cream", "Dark Purple"],
    4: ["Auburn", "Lt Grey", "Cyan", "Magenta", "Rose", "Slate"],
    5: ["Grey", "Charcoal", "Light Grey", "Amber", "Purple", "Dark Red"],
    6: ["Yellow", "Orange", "Gold", "Silver", "Black", "White"]
};

export const namingTable: Record<number, string[]> = {
    1: ["Kingdom", "Empire", "Unity", "Order", "Federation", "Talon"],
    2: ["Union", "Strike", "Consortium", "Tempest", "Collective", "Fate"],
    3: ["Sentinel", "Alliance", "Dominion", "Confederacy", "Nation", "Domain"],
    4: ["Alliance", "Tome", "Dynasty", "Horde", "People", "Flame"],
    5: ["Crusade", "Republic", "Council", "Hierarchy", "Covenant", "Legion"],
    6: ["Hegemony", "Imperium", "Khanate", "State", "League", "Sword"]
};

export const neighborTable: Record<number, string> = {
    1: 'Hive or Swarm',
    2: 'Tribe or Clan',
    3: 'Minor Kingdom',
    4: 'Magic User',
    5: 'Cult/Order/Lair',
    6: 'Legendary Monster',
};
