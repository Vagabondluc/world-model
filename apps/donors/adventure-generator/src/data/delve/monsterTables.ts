
import { DelveTheme, MonsterTier } from '../../types/delve';

export interface EncounterSet {
    minions: string[];
    boss: string[];
}

export const MONSTER_TABLES: Record<DelveTheme, Record<MonsterTier, EncounterSet>> = {
    crypt: {
        tier1: { minions: ["Skeleton", "Zombie", "Shadow"], boss: ["Ghast", "Wight", "Specter"] },
        tier2: { minions: ["Ghoul", "Ogre Zombie", "Will-o'-Wisp"], boss: ["Wraith", "Mummy", "Vampire Spawn"] },
        tier3: { minions: ["Wight", "Wraith", "Ghost"], boss: ["Vampire", "Mummy Lord", "Bone Devil"] },
        tier4: { minions: ["Vampire Spawn", "Mummy Lord"], boss: ["Lich", "Dracolich", "Death Knight"] }
    },
    ruin: {
        tier1: { minions: ["Goblin", "Bandit", "Giant Rat"], boss: ["Bugbear", "Bandit Captain", "Ogre"] },
        tier2: { minions: ["Hobgoblin", "Orc", "Worg"], boss: ["Hobgoblin Captain", "Cyclops", "Chimera"] },
        tier3: { minions: ["Troll", "Hill Giant", "Wyvern"], boss: ["Warlord", "Young Red Dragon", "Stone Giant"] },
        tier4: { minions: ["Fire Giant", "Frost Giant"], boss: ["Ancient White Dragon", "Tarrasque", "Warlord"] }
    },
    cavern: {
        tier1: { minions: ["Kobold", "Giant Centipede", "Stirge"], boss: ["Giant Spider", "Grimlock", "Carrion Crawler"] },
        tier2: { minions: ["Troglodyte", "Hook Horror", "Grick"], boss: ["Roper", "Umber Hulk", "Troll"] },
        tier3: { minions: ["Hook Horror", "Drider", "Salamander"], boss: ["Behir", "Purple Worm", "Cloaker"] },
        tier4: { minions: ["Mind Flayer", "Earth Elemental"], boss: ["Ancient Black Dragon", "Balor", "Purple Worm"] }
    },
    tower: {
        tier1: { minions: ["Animated Armor", "Flying Sword", "Imp"], boss: ["Spectator", "Flesh Golem", "Cult Fanatic"] },
        tier2: { minions: ["Gargoyle", "Azer", "Mimic"], boss: ["Mage", "Shield Guardian", "Invisible Stalker"] },
        tier3: { minions: ["Helmed Horror", "Elementals"], boss: ["Archmage", "Iron Golem", "Rakshasa"] },
        tier4: { minions: ["Iron Golem", "Erinyes"], boss: ["Lich", "Planetar", "Solar"] }
    },
    sewer: {
        tier1: { minions: ["Giant Rat", "Mud Mephit", "Kobold"], boss: ["Weretiger", "Gelatinous Cube", "Giant Crocodile"] },
        tier2: { minions: ["Otyugh", "Rust Monster", "Wererat"], boss: ["Black Pudding", "Hydra", "Chuul"] },
        tier3: { minions: ["Troll", "Shambling Mound"], boss: ["Aboleth", "Froghemoth", "Spirit Naga"] },
        tier4: { minions: ["Mind Flayer", "Aboleth"], boss: ["Elder Brain", "Kraken", "Ancient Green Dragon"] }
    },
    haunted_mansion: {
        tier1: { minions: ["Animated Armor", "Shadow", "Flying Sword"], boss: ["Specter", "Will-o'-Wisp", "Ghost"] },
        tier2: { minions: ["Ghost", "Specter", "Wight"], boss: ["Wraith", "Suit of Animated Armor", "Poltergeist (Specter)"] },
        tier3: { minions: ["Wraith", "Wight", "Ghost"], boss: ["Vampire Spawn", "Banshee (Wraith)", "Guardian Armor"] },
        tier4: { minions: ["Vampire Spawn", "Wraith"], boss: ["Lich", "Vampire", "Dread Wraith"] }
    }
};
