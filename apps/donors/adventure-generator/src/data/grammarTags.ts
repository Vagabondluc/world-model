
import { GrammarTag } from '../types/monsterGrammar';

export const GRAMMAR_TAGS: GrammarTag[] = [
    // Elemental
    { id: 'fire', name: 'Fire', category: 'Elemental', description: 'Flame, heat, and burning.', damageTypes: ['fire'] },
    { id: 'cold', name: 'Cold', category: 'Elemental', description: 'Ice, snow, and freezing temperatures.', damageTypes: ['cold'] },
    { id: 'lightning', name: 'Lightning', category: 'Elemental', description: 'Electricity and storms.', damageTypes: ['lightning'] },
    { id: 'acid', name: 'Acid', category: 'Elemental', description: 'Corrosive slime and caustic substances.', damageTypes: ['acid'] },
    { id: 'thunder', name: 'Thunder', category: 'Elemental', description: 'Sonic booms and concussive force.', damageTypes: ['thunder'] },
    { id: 'earth', name: 'Earth', category: 'Elemental', description: 'Stone, stability, and durability.', damageTypes: ['bludgeoning'] },
    { id: 'air', name: 'Air', category: 'Elemental', description: 'Wind, flight, and movement.' },
    { id: 'water', name: 'Water', category: 'Elemental', description: 'Water, oceans, and fluidity.', damageTypes: ['cold', 'bludgeoning'] },
    
    // Magic
    { id: 'arcane', name: 'Arcane', category: 'Magic', description: 'Raw magical power and spells.', damageTypes: ['force'] },
    { id: 'necrotic', name: 'Necrotic', category: 'Magic', description: 'Death, decay, and unlife.', damageTypes: ['necrotic'] },
    { id: 'radiant', name: 'Radiant', category: 'Magic', description: 'Holy light and divine power.', damageTypes: ['radiant'] },
    { id: 'psychic', name: 'Psychic', category: 'Magic', description: 'Mind powers and telepathy.', damageTypes: ['psychic'] },
    { id: 'psionic', name: 'Psionic', category: 'Magic', description: 'Advanced mind-powers like telekinesis and domination.'},
    { id: 'poison', name: 'Poison', category: 'Magic', description: 'Toxins, venom, and debilitating effects.', damageTypes: ['poison'] },
    { id: 'illusion', name: 'Illusion', category: 'Magic', description: 'Deception, invisibility, and phantasms.', damageTypes: ['psychic'] },
    { id: 'shadow', name: 'Shadow', category: 'Magic', description: 'Darkness, stealth, and life drain.', damageTypes: ['necrotic'] },
    { id: 'abjuration', name: 'Abjuration', category: 'Magic', description: 'Protective magic, wards, and banishment.' },
    { id: 'conjuration', name: 'Conjuration', category: 'Magic', description: 'Summoning creatures and teleportation.' },
    { id: 'divination', name: 'Divination', category: 'Magic', description: 'Revealing information and foreseeing the future.' },
    { id: 'enchantment', name: 'Enchantment', category: 'Magic', description: 'Influencing minds and emotions.' },
    { id: 'evocation', name: 'Evocation', category: 'Magic', description: 'Manipulating energy to create blasts and beams.' },
    { id: 'transmutation', name: 'Transmutation', category: 'Magic', description: 'Altering physical forms and properties.' },
    
    // Combat
    { id: 'weaponry', name: 'Weaponry', category: 'Combat', description: 'Skill with weapons.' },
    { id: 'brute', name: 'Brute Strength', category: 'Combat', description: 'Raw physical power.' },
    { id: 'stealth', name: 'Stealth', category: 'Combat', description: 'Sneaking and ambushing.' },
    { id: 'swarm', name: 'Swarm', category: 'Combat', description: 'Overwhelming numbers and pack tactics.' },
    { id: 'giant', name: 'Giant', category: 'Combat', description: 'Huge size, immense strength, rock throwing.' },
    
    // Supernatural
    { id: 'undead', name: 'Undead', category: 'Supernatural', description: 'Animated corpses or spirits.', damageTypes: ['necrotic'] },
    { id: 'fey', name: 'Fey', category: 'Supernatural', description: 'Nature magic and trickery.', damageTypes: ['psychic'] },
    { id: 'fiend', name: 'Fiend', category: 'Supernatural', description: 'General term for evil extraplanar beings.' },
    { id: 'celestial', name: 'Celestial', category: 'Supernatural', description: 'General term for good extraplanar beings.', damageTypes: ['radiant'] },
    { id: 'plant', name: 'Plant', category: 'Supernatural', description: 'Foliage, thorns, and natural life.', damageTypes: ['poison', 'piercing'] },
    { id: 'aberrant', name: 'Aberrant', category: 'Supernatural', description: 'Tentacles, madness, and psionic abilities.', damageTypes: ['psychic'] },
    { id: 'shapechanger', name: 'Shapechanger', category: 'Supernatural', description: 'Polymorphing, deception, and infiltration.' },
    { id: 'lycanthrope', name: 'Lycanthrope', category: 'Supernatural', description: 'Cursed shapechangers with regeneration and specific weaknesses.' },
    { id: 'dragon', name: 'Dragon', category: 'Supernatural', description: 'Breath weapons, scales, flight, and frightful presence.' },
    
    // Planar & Allegiance
    { id: 'demon', name: 'Demon', category: 'Planar & Allegiance', description: 'Chaotic evil fiends from the Abyss.', damageTypes: ['poison'] },
    { id: 'devil', name: 'Devil', category: 'Planar & Allegiance', description: 'Lawful evil fiends from the Nine Hells.', damageTypes: ['fire', 'poison'] },
    { id: 'angel', name: 'Angel', category: 'Planar & Allegiance', description: 'Lawful good celestials, messengers of the gods.', damageTypes: ['radiant'] },
    { id: 'genie', name: 'Genie', category: 'Planar & Allegiance', description: 'Powerful elementals from the inner planes.' },
    { id: 'slaad', name: 'Slaad', category: 'Planar & Allegiance', description: 'Frog-like avatars of pure chaos from Limbo.' },
    
    // Other
    { id: 'construct', name: 'Construct', category: 'Other', description: 'Artificial life, immunities, and relentless logic.' },
    { id: 'golem', name: 'Golem', category: 'Other', description: 'Powerful constructs with magical immunities.' },
    { id: 'ooze', name: 'Ooze', category: 'Other', description: 'Amorphous, acidic, and splitting creatures.', damageTypes: ['acid'] },

    // Behavioral & Social
    { id: 'pack-hunter', name: 'Pack Hunter', category: 'Behavioral', description: 'Fights with others, gaining an advantage from numbers.' },
    { id: 'solitary', name: 'Solitary', category: 'Behavioral', description: 'Hunts and lives alone.' },
    { id: 'territorial', name: 'Territorial', category: 'Behavioral', description: 'Fiercely defends its lair and surrounding area.' },
    { id: 'ambusher', name: 'Ambusher', category: 'Behavioral', description: 'Prefers to strike from hiding with surprise.' },
    { id: 'guardian', name: 'Guardian', category: 'Behavioral', description: 'Stands watch over a person, place, or object.' },
    { id: 'berserker', name: 'Berserker', category: 'Behavioral', description: 'Fights with reckless abandon and rage.' },
    { id: 'hive-mind', name: 'Hive-Mind', category: 'Behavioral', description: 'Shares a consciousness with others of its kind.' },
    { id: 'cunning', name: 'Cunning', category: 'Behavioral', description: 'Uses intellect and tactics over brute force.' },
    { id: 'trickster', name: 'Trickster', category: 'Behavioral', description: 'Deceptive, elusive, and prone to pranks.' },
    { id: 'fanatic', name: 'Fanatic', category: 'Behavioral', description: 'Unshakable devotion to a cause or entity.' },

    // Physiology & Movement
    { id: 'amphibious', name: 'Amphibious', category: 'Physiology & Movement', description: 'Breathes both air and water.' },
    { id: 'aquatic', name: 'Aquatic', category: 'Physiology & Movement', description: 'Breathes only water, adapted for swimming.' },
    { id: 'arachnid', name: 'Arachnid', category: 'Physiology & Movement', description: 'Spider-like features, multiple eyes, and often venomous.' },
    { id: 'avian', name: 'Avian', category: 'Physiology & Movement', description: 'Bird-like features such as feathers and wings.' },
    { id: 'burrow', name: 'Burrower', category: 'Physiology & Movement', description: 'Can tunnel through earth.' },
    { id: 'climb', name: 'Climber', category: 'Physiology & Movement', description: 'Adapted for climbing surfaces.' },
    { id: 'insectoid', name: 'Insectoid', category: 'Physiology & Movement', description: 'Exoskeleton, multiple limbs, and other insect-like traits.' },
    { id: 'multi-headed', name: 'Multi-Headed', category: 'Physiology & Movement', description: 'Possesses more than one head, granting sensory advantages.' },
    { id: 'quadruped', name: 'Quadruped', category: 'Physiology & Movement', description: 'Walks on four legs.' },
    { id: 'regeneration', name: 'Regeneration', category: 'Physiology & Movement', description: 'Rapidly heals from wounds.' },
    { id: 'serpentine', name: 'Serpentine', category: 'Physiology & Movement', description: 'Snake-like body, often with a venomous bite.' },
    { id: 'swim', name: 'Swimmer', category: 'Physiology & Movement', description: 'Adapted for aquatic movement.' },
    { id: 'winged', name: 'Winged', category: 'Physiology & Movement', description: 'Possesses wings, capable of flight.' },

    // Condition & Control
    { id: 'grapple', name: 'Grapple', category: 'Condition & Control', description: 'Abilities that grab and hold enemies.' },
    { id: 'restrain', name: 'Restrain', category: 'Condition & Control', description: 'Abilities that bind enemies, preventing movement.' },
    { id: 'stun', name: 'Stun', category: 'Condition & Control', description: 'Abilities that incapacitate foes with a stun effect.' },
    { id: 'fear', name: 'Fear', category: 'Condition & Control', description: 'Abilities that cause the frightened condition.' },
    { id: 'charm', name: 'Charm', category: 'Condition & Control', description: 'Abilities that magically charm or beguile.' },

    // Environmental
    { id: 'forest', name: 'Forest', category: 'Environmental', description: 'Adapted to woodland environments.' },
    { id: 'swamp', name: 'Swamp', category: 'Environmental', description: 'Adapted to marshes and wetlands.' },
    { id: 'desert', name: 'Desert', category: 'Environmental', description: 'Adapted to arid, sandy environments.' },
    { id: 'mountain', name: 'Mountain', category: 'Environmental', description: 'Adapted to high altitudes and rocky terrain.' },
    { id: 'tundra', name: 'Tundra', category: 'Environmental', description: 'Adapted to frozen wastes.' },
    { id: 'underdark', name: 'Underdark', category: 'Environmental', description: 'Adapted to the lightless depths.' },

    // Class Archetypes
    { id: 'fighter', name: 'Fighter', category: 'Class Archetype', description: 'Martial prowess, multiple attacks, and combat maneuvers.' },
    { id: 'barbarian', name: 'Barbarian', category: 'Class Archetype', description: 'Primal rage, reckless attacks, and durability.' },
    { id: 'rogue', name: 'Rogue', category: 'Class Archetype', description: 'Stealth, cunning action, and sneak attacks.' },
    { id: 'wizard', name: 'Wizard', category: 'Class Archetype', description: 'Arcane spellcasting, utility, and powerful AoE effects.' },
    { id: 'cleric', name: 'Cleric', category: 'Class Archetype', description: 'Divine magic, healing, and support.' },
    { id: 'paladin', name: 'Paladin', category: 'Class Archetype', description: 'Divine smites, oaths, and heavy armor.' },
    { id: 'ranger', name: 'Ranger', category: 'Class Archetype', description: 'Archery, tracking, and favored enemies.' },
    { id: 'druid', name: 'Druid', category: 'Class Archetype', description: 'Nature magic, wild shape, and animal companions.' },
    { id: 'monk', name: 'Monk', category: 'Class Archetype', description: 'Unarmed strikes, stunning blows, and ki-powered abilities.' },
    { id: 'bard', name: 'Bard', category: 'Class Archetype', description: 'Inspiration, charming magic, and versatile support.' },
    { id: 'sorcerer', name: 'Sorcerer', category: 'Class Archetype', description: 'Innate magic, metamagic, and raw power.' },
    { id: 'warlock', name: 'Warlock', category: 'Class Archetype', description: 'Pact magic, eldritch invocations, and otherworldly patrons.' },
];
