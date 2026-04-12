import type { ElementCard, Player } from '../types';

type PrepopulationEraData = {
    elements?: Omit<ElementCard, 'id'>[];
    playerUpdates?: Partial<Player>;
    elementUpdates?: {
        find: { owner: number; type: ElementCard['type']; data?: Record<string, any> };
        updates: Record<string, any>;
    }[];
};


type PrepopulationData = Record<number, Record<number, PrepopulationEraData>>;

export const prepopulationData: PrepopulationData = {
    // --- Player 1: PeeHell (Dwarves) ---
    1: {
        1: { // Era 1
            elements: [
                { type: 'Resource', name: 'Heartstone Veins', owner: 1, era: 1, data: { id: '', name: 'Heartstone Veins', type: 'mineral', properties: 'Deep veins of a ruby-like mineral that glows with a faint inner warmth. Used in masterful dwarven smithing to create weapons that never dull.', symbol: '❤️' } },
                { type: 'Resource', name: 'Gloomshroom Caverns', owner: 1, era: 1, data: { id: '', name: 'Gloomshroom Caverns', type: 'flora', properties: 'Vast underground caves filled with bioluminescent fungi. The caps are edible and restore vitality, while the spores can be used as a potent anesthetic.', symbol: '🍄' } }
            ]
        },
        2: { // Era 2
            playerUpdates: { deityCount: 2 },
            elements: [
                { type: 'Deity', name: 'Grund, the Stone Father', owner: 1, era: 2, createdYear: 5, data: { id: '', name: 'Grund, the Stone Father', domain: 'Mountains and Smithing', symbol: 'A hammer striking an anvil', emoji: '🔨', description: 'The chief deity of the dwarves, embodying the strength and permanence of the mountain. He is a god of craft, determination, and the hidden riches of the earth.' } },
                { type: 'Deity', name: 'Mara, the Hearth Keeper', owner: 1, era: 2, createdYear: 12, data: { id: '', name: 'Mara, the Hearth Keeper', domain: 'Family and Beer', symbol: 'A braided circle of wheat', emoji: '🍺', description: 'Goddess of community, family, and brewing. She represents the warmth of the dwarven halls and the bonds of kinship.' } },
                { type: 'Location', name: 'The Great Anvil', owner: 1, era: 2, createdYear: 6, data: { id: '', name: 'The Great Anvil', siteType: 'lone mountain', description: 'A mountain with a perfectly flat top, said to be the anvil where Grund forged the first dwarves. It is a holy site for all smiths.', symbol: '⛰️', deityId: '' } },
                { type: 'Location', name: 'Mara\'s Kettle', owner: 1, era: 2, createdYear: 15, data: { id: '', name: 'Mara\'s Kettle', siteType: 'hot spring', description: 'A geothermal spring that heats a small lake, said to be blessed by Mara for brewing the finest ales.', symbol: '💧', deityId: '' } }
            ]
        },
        3: { // Era 3
            elements: [
                { type: 'Faction', name: 'Iron-Hand Clan', owner: 1, era: 3, data: { id: '', name: 'Iron-Hand Clan', race: 'Dwarves', symbolName: 'Anvil', emoji: '🛡️', color: 'Charcoal', theme: 'Master artisans and miners.', description: 'The Iron-Hand Clan is known for its unyielding traditionalism and mastery over metal and stone. They are deeply honorable but can be mistrustful of outsiders.', leaderName: 'Borin Ironhand', capitalName: 'Khaz-Grund', isNeighbor: false } },
                { type: 'Faction', name: 'Gore-Tusk Tribe', owner: 1, era: 3, data: { id: '', name: 'Gore-Tusk Tribe', race: 'Greenskins', symbolName: 'Boar', emoji: '🐗', color: 'Dark Red', theme: 'Wandering Orcish raiders.', description: 'A nomadic tribe of orcs who value strength above all. They follow the strongest chieftain and constantly seek worthy opponents.', leaderName: 'Warchief Grumm', isNeighbor: true, neighborType: 'Tribe or Clan' } },
                { type: 'Settlement', name: 'Khaz-Grund', owner: 1, era: 3, data: { id: '', name: 'Khaz-Grund', purpose: 'Capital', description: 'The capital city carved into the heart of the mountain.', factionId: '' } },
                { type: 'Settlement', name: 'Glimmer-Mine', owner: 1, era: 3, data: { id: '', name: 'Glimmer-Mine', purpose: 'Mining', description: 'A settlement focused on extracting Heartstone.', factionId: '' } },
                { type: 'Settlement', name: 'Stone-Brew', owner: 1, era: 3, data: { id: '', name: 'Stone-Brew', purpose: 'Food', description: 'A farming and brewing community near Mara\'s Kettle.', factionId: '' } }
            ]
        },
        4: { // Era 4
            elements: [
                { type: 'Resource', name: 'Volcanic Adamantite', owner: 1, era: 4, createdYear: 33, creationStep: '4.1 Exploration', data: { id: '', name: 'Volcanic Adamantite', type: 'mineral', properties: 'An incredibly dense and heat-resistant metal found only near the magma chambers of active volcanoes. Requires immense heat to forge but creates unparalleled armor.', symbol: '🌋' } },
                { type: 'Faction', name: 'The Chasmfiend', owner: 1, era: 4, createdYear: 45, creationStep: '4.1 Exploration', data: { id: '', name: 'The Chasmfiend', race: 'Monster', symbolName: 'Claw', emoji: '🦀', color: 'Red', theme: 'Legendary Monster', description: 'A colossal, armor-plated creature awakened by deep mining. It slumbers in the darkest chasms and is drawn to the vibrations of industry.', leaderName: 'N/A', isNeighbor: true } },
                { type: 'Event', name: 'Gore-Tusk Expansion', owner: 1, era: 4, createdYear: 51, creationStep: '4.1 Exploration', data: { id: '', name: 'Gore-Tusk Expansion', description: 'The neighboring Gore-Tusk Tribe, emboldened by a new chieftain, established a forward war-camp dangerously close to Iron-Hand territory.' } },
                { type: 'Settlement', name: 'Deep-Watch', owner: 1, era: 4, createdYear: 62, creationStep: '4.1 Exploration', data: { id: '', name: 'Deep-Watch', purpose: 'Military', description: 'A fortified outpost built to watch over the new Gore-Tusk war-camp and guard the deep roads.' } },
                { type: 'Event', name: 'The Low Rumble', owner: 1, era: 4, createdYear: 85, creationStep: '4.1 Exploration', data: { id: '', name: 'The Low Rumble', description: 'A minor earthquake, attributed to the Chasmfiend\'s stirring, collapsed a section of an old mine, revealing a vast, unexplored cave system rich with glowing crystals.' } },
                { type: 'Settlement', name: 'Forge-Point', owner: 1, era: 4, createdYear: 88, creationStep: '4.1 Exploration', data: { id: '', name: 'Forge-Point', purpose: 'Industry', description: 'A new settlement built near a volcano to begin experimenting with forging the newly discovered Volcanic Adamantite.' } },
                // --- Heroes for Colonization Step ---
                { type: 'Character', name: 'Scoutmaster Thorgath', owner: 1, era: 4, createdYear: 70, creationStep: '4.2 Colonization & Heroes', data: { id: '', name: 'Scoutmaster Thorgath', description: '**Profession:** Explorer\n**Status:** Active\n**Achievement Type:** Discovery\n\nA veteran dwarven scout who first mapped the new crystal caves revealed by The Low Rumble. He is known for his incredible resilience and knowledge of the under-dark.\n\n**Honored Location:** Thorgath\'s Folly (formerly the treacherous western chasm)' } },
                { type: 'Character', name: 'Borin Stonefist', owner: 1, era: 4, createdYear: 75, creationStep: '4.2 Colonization & Heroes', data: { id: '', name: 'Borin Stonefist', description: '**Profession:** Military Leader\n**Status:** Active\n**Achievement Type:** Military Victory\n\nBorin Stonefist led the successful defense of Glimmer-Mine against a major raid from the Gore-Tusk Tribe, securing the clan\'s Heartstone supply. His tactical genius lies in using the terrain of the deep roads to his advantage.\n\n**Honored Location:** Stonefist Pass (formerly the upper mine entrance)' } },
                { type: 'Character', name: 'Helga Sparkgear', owner: 1, era: 4, createdYear: 80, creationStep: '4.2 Colonization & Heroes', data: { id: '', name: 'Helga Sparkgear', description: '**Profession:** Inventor\n**Status:** Active\n**Achievement Type:** Innovation\n\nHelga developed a new steam-powered drilling machine that doubled the output of the Heartstone veins. Her inventions, while often dangerously loud, have revolutionized the Iron-Hand Clan\'s mining operations.\n\n**Honored Location:** Sparkgear Depths (formerly the abandoned lower shafts)' } }
            ],
            elementUpdates: [
                {
                    find: { owner: 1, type: 'Faction', data: { isNeighbor: false } },
                    updates: {
                        industry: "Masterful Heartstone Smithing",
                        industryDescription: "**Production Methods**\nOur clan utilizes ancient, geothermal forges deep within the mountain, channeling the earth's heat to work the unique Heartstone. Each piece is quenched in Mara's Kettle, imbuing it with resilience.\n\n**Settlement Integration**\nGlimmer-Mine is the primary source of raw Heartstone, while Khaz-Grund houses the Master Forges. Stone-Brew provides the specialized, cooling ales used in the quenching process.\n\n**Cultural Integration**\nSmithing is a form of worship to Grund. The quality of a dwarf's craft is a reflection of their soul. Great works are celebrated with clan-wide feasts.\n\n**Trade & Relations**\nFinished Heartstone weapons and armor are our most valuable exports, traded for rare woods and exotic foods. We trade primarily with the Silverwood Sentinels, who value our craft.\n\n**Knowledge Management**\nApprenticeships last decades, with masters passing down secrets orally and through runic carvings on the forge walls. The Smithing Guild guards these secrets fiercely.\n\n**Master Practitioners**\nThe High Forge-Master Durin, and the Rune-Priestess Helga."
                    }
                }
            ]
        },
        5: { // Era 5
            elements: [
                { type: 'War', name: 'War on the Gore-Tusks', owner: 1, era: 5, createdYear: 95, creationStep: '5.1 Empire Event', data: { id: '', name: 'War on the Gore-Tusks', description: 'The Iron-Hand Clan launched a successful assault on the Gore-Tusk war-camp, driving the orcs from their borders and securing the region.', attackers: ['Iron-Hand Clan'], defenders: ['Gore-Tusk Tribe'] } },
                { type: 'Monument', name: 'The Great Forge of Khaz-Grund', owner: 1, era: 5, createdYear: 105, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Great Forge of Khaz-Grund', description: 'A monument to prosperity, this massive new forge in the capital was built to honor Grund and process the new influx of rare metals.' } },
                { type: 'Event', name: 'The Silver Road', owner: 1, era: 5, createdYear: 115, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Silver Road', description: 'A trade route was established between the Iron-Hand Clan and the Silverwood Sentinels, with a new trade post built at the halfway point.' } },
                { type: 'Settlement', name: 'Iron-Watch', owner: 1, era: 5, createdYear: 125, creationStep: '5.1 Empire Event', data: { id: '', name: 'Iron-Watch', purpose: 'Military', description: 'A new fortress built on the former site of the Gore-Tusk war-camp to permanently secure the border.' } },
                { type: 'Settlement', name: 'Deep-Core', owner: 1, era: 5, createdYear: 135, creationStep: '5.1 Empire Event', data: { id: '', name: 'Deep-Core', purpose: 'Mining', description: 'A new mining settlement established to exploit the crystal caves discovered after The Low Rumble.' } },
                { type: 'Event', name: 'The Glimmer-Mine Collapse', owner: 1, era: 5, createdYear: 145, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Glimmer-Mine Collapse', description: 'A tragic disaster struck as the oldest sections of the Glimmer-Mine collapsed, sealing off several key Heartstone veins. The settlement was heavily damaged but not destroyed.' } },
                { type: 'Event', name: 'Gore-Tusk Warpath', owner: 1, era: 5, createdYear: 150, creationStep: '5.2 Neighbor Development', data: { id: '', name: 'Gore-Tusk Warpath', description: 'After their defeat, the Gore-Tusks turned their rage on the Cinder-Claw Kobolds, beginning a bitter war over the volcano\'s resources.', factionId: '' } },
                { type: 'Event', name: 'The Chasmfiend Stirs', owner: 1, era: 5, createdYear: 152, creationStep: '5.2 Neighbor Development', data: { id: '', name: 'The Chasmfiend Stirs', description: 'The colossal Chasmfiend, disturbed by the extensive mining at Deep-Core, has become active, causing seismic tremors. It has begun to hoard precious metals in its lair.', factionId: '' } }
            ]
        },
        6: { // Era 6
             elements: [
                { type: 'Event', name: 'The Under-King Emerges', owner: 1, era: 6, createdYear: 155, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Under-King Emerges', description: 'A powerful, ancient being from deep within the earth is awakened by the Chasmfiend\'s activity, claiming dominion over all subterranean realms.' } },
                { type: 'Event', name: 'The Heartstone Fades', owner: 1, era: 6, createdYear: 165, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Heartstone Fades', description: 'The magical warmth of the Heartstone veins begins to dim, causing a crisis of faith and industry within the Iron-Hand Clan.' } },
                { type: 'War', name: 'The War of the Depths', owner: 1, era: 6, createdYear: 175, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The War of the Depths', description: 'The Iron-Hand Clan declares war on the Under-King to reclaim their ancestral mines, a conflict that will define their final years.' } },
                { type: 'Event', name: 'The Last Stand at Khaz-Grund', owner: 1, era: 6, createdYear: 185, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Last Stand at Khaz-Grund', description: 'The Under-King\'s forces lay siege to the dwarven capital. The siege is broken, but at a tremendous cost, leaving the city weakened.' } },
                { type: 'Event', name: 'The Shattering of the Great Anvil', owner: 1, era: 6, createdYear: 195, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Shattering of the Great Anvil', description: 'In a final, desperate act of war, a magical backlash shatters The Great Anvil, the most sacred site of Grund, signaling the end of the dwarven golden age.' } },
                { type: 'Location', name: 'The Tomb of Borin Ironhand', owner: 1, era: 6, createdYear: 200, creationStep: '6.2 Iconic Landmark', data: { id: '', name: 'The Tomb of Borin Ironhand', siteType: 'Iconic Landmark', symbol: '👑', description: 'The final resting place of the first leader of the Iron-Hand Clan, located in the now-silent heart of Khaz-Grund. It is a symbol of a lost golden age and a pilgrimage site for the few surviving dwarves.' } },
                { type: 'Event', name: 'The Long Silence', owner: 1, era: 6, createdYear: 205, creationStep: '6.3 World Omen', data: { id: '', name: 'The Long Silence', description: 'A profound silence falls over the world. The gods no longer answer prayers, prophecies cease, and magic itself feels muted and faint. It is an age of mortals, for mortals alone.' } }
            ]
        }
    },
    // --- Player 2: PrOfOuNd_IdIoT (Elves) ---
    2: {
        1: { // Era 1
            elements: [
                { type: 'Resource', name: 'Whisperwood Trees', owner: 2, era: 1, data: { id: '', name: 'Whisperwood Trees', type: 'flora', properties: 'Ancient trees with silver leaves that rustle with faint, melodic whispers. The wood is lightweight yet strong, ideal for crafting bows and enchanted items.', symbol: '🌳' } },
                { type: 'Resource', name: 'Starlight Pools', owner: 2, era: 1, data: { id: '', name: 'Starlight Pools', type: 'magical', properties: 'Pools of water that perfectly reflect the night sky, even during the day. The water has minor healing and scrying properties.', symbol: '✨' } }
            ]
        },
        2: { // Era 2
            playerUpdates: { deityCount: 2 },
            elements: [
                { type: 'Deity', name: 'Aethel, the Star-Weaver', owner: 2, era: 2, createdYear: 8, data: { id: '', name: 'Aethel, the Star-Weaver', domain: 'Magic and Stars', symbol: 'A silver crescent moon', emoji: '🌙', description: 'A deity of magic, prophecy, and the night sky. Worshipped by elven mages and seers.' } },
                { type: 'Deity', name: 'Cernan, the Horned Hunter', owner: 2, era: 2, createdYear: 20, data: { id: '', name: 'Cernan, the Horned Hunter', domain: 'The Hunt and Nature', symbol: 'A pair of antlers', emoji: '🦌', description: 'God of the wild, the hunt, and the cycle of nature. Revered by wood elves and rangers.' } },
                { type: 'Location', name: 'The Lunar Monolith', owner: 2, era: 2, createdYear: 10, data: { id: '', name: 'The Lunar Monolith', siteType: 'henge', description: 'A circle of standing stones that align with celestial bodies, used for Aethel\'s rituals.', symbol: '🗿', deityId: '' } },
                { type: 'Location', name: 'The Great Heartwood', owner: 2, era: 2, createdYear: 22, data: { id: '', name: 'The Great Heartwood', siteType: 'ancient tree', description: 'A colossal, ancient tree said to be the heart of the forest and a conduit for Cernan\'s power.', symbol: '🌳', deityId: '' } }
            ]
        },
        3: { // Era 3
            elements: [
                { type: 'Faction', name: 'Silverwood Sentinels', owner: 2, era: 3, data: { id: '', name: 'Silverwood Sentinels', race: 'Elves', symbolName: 'Leaf', emoji: '🍃', color: 'Silver', theme: 'Guardians of the ancient forests.', description: 'The Silverwood Sentinels are patient and graceful, viewing themselves as protectors of the natural order. They are slow to anger but relentless when roused.', leaderName: 'Elara Whisperwind', capitalName: 'Glyn`dar', isNeighbor: false } },
                { type: 'Faction', name: 'The Gloomfang Pack', owner: 2, era: 3, data: { id: '', name: 'The Gloomfang Pack', race: 'Animalfolk', symbolName: 'Wolf', emoji: '🐺', color: 'Grey', theme: 'A large, intelligent wolf pack that claims the forest as its own.', description: 'A highly territorial and spiritual pack of sentient wolves. They communicate through a complex system of howls and empathic projections.', leaderName: 'Alpha Fang', isNeighbor: true, neighborType: 'Tribe or Clan' } },
                { type: 'Settlement', name: 'Glyn`dar', owner: 2, era: 3, data: { id: '', name: 'Glyn`dar', purpose: 'Capital', description: 'The elven capital, built high in the branches of the Whisperwood trees.', factionId: '' } },
                { type: 'Settlement', name: 'Star-Gazer\'s Retreat', owner: 2, era: 3, data: { id: '', name: 'Star-Gazer\'s Retreat', purpose: 'Religion', description: 'A secluded monastery dedicated to studying the Starlight Pools.', factionId: '' } },
                { type: 'Settlement', name: 'Hunter\'s Vale', owner: 2, era: 3, data: { id: '', name: 'Hunter\'s Vale', purpose: 'Food', description: 'A settlement of hunters and trackers deep in the forest.', factionId: '' } }
            ]
        },
        4: { // Era 4
            elements: [
                { type: 'Resource', name: 'The Sunken Moonpetal Grove', owner: 2, era: 4, createdYear: 35, creationStep: '4.1 Exploration', data: { id: '', name: 'The Sunken Moonpetal Grove', type: 'magical', properties: 'A magical event flooded a valley, creating a lake where glowing Moonpetal Lilies now grow. Their petals can be used in potions that grant night vision.', symbol: '🌸' } },
                { type: 'Location', name: 'The Silent City of Aeridor', owner: 2, era: 4, createdYear: 42, creationStep: '4.1 Exploration', data: { id: '', name: 'The Silent City of Aeridor', siteType: 'ruin', description: 'The perfectly preserved but entirely empty ruins of a precursor civilization. Its crystalline architecture hums with a silent, unknown power.', symbol: '🏛️' } },
                { type: 'Faction', name: 'Blacksail Corsairs', owner: 2, era: 4, createdYear: 55, creationStep: '4.1 Exploration', data: { id: '', name: 'Blacksail Corsairs', race: 'Humans', symbolName: 'Skull', emoji: '🏴‍☠️', color: 'Black', theme: 'Ruthless pirates', description: 'A band of pirates who have established a hidden cove on the far side of the Silverwood, preying on the new trade routes.', leaderName: 'Captain Joric', isNeighbor: true } },
                { type: 'Settlement', name: 'Sylvanreach', owner: 2, era: 4, createdYear: 65, creationStep: '4.1 Exploration', data: { id: '', name: 'Sylvanreach', purpose: 'Trade', description: 'A new inland settlement established to trade with a newly discovered tribe of peaceful centaurs.' } },
                { type: 'Event', name: 'The Starfall', owner: 2, era: 4, createdYear: 88, creationStep: '4.1 Exploration', data: { id: '', name: 'The Starfall', description: 'A brilliant meteor shower over the Starlight Pools temporarily imbued them with powerful prophetic visions, attracting pilgrims and scholars.' } },
                { type: 'Settlement', name: 'Whisperwood Landing', owner: 2, era: 4, createdYear: 90, creationStep: '4.1 Exploration', data: { id: '', name: 'Whisperwood Landing', purpose: 'Trade', description: 'A coastal port to facilitate trade of Whisperwood lumber and crafted goods.' } },
                 // --- Heroes for Colonization Step ---
                { type: 'Character', name: 'Lyra Meadowlight', owner: 2, era: 4, createdYear: 72, creationStep: '4.2 Colonization & Heroes', data: { id: '', name: 'Lyra Meadowlight', description: '**Profession:** Diplomat\n**Status:** Active\n**Achievement Type:** Political Leadership\n\nAn elven diplomat and student of Elara Whisperwind who successfully negotiated the first trade pact with the centaurs of Sylvanreach, opening up new avenues of trade and friendship for the Silverwood Sentinels.\n\n**Honored Location:** Lyra\'s Glade (formerly the centaur meeting grounds)' } },
                { type: 'Character', name: 'Faelan Nightshade', owner: 2, era: 4, createdYear: 78, creationStep: '4.2 Colonization & Heroes', data: { id: '', name: 'Faelan Nightshade', description: '**Profession:** Mage\n**Status:** Legendary (disappeared)\n**Achievement Type:** Discovery\n\nFaelan was a powerful mage who delved into the mysteries of the Starlight Pools. He vanished after claiming to have found a way to weave pure starlight into solid matter. His research notes are highly sought after.\n\n**Honored Location:** Faelan\'s Reflection (formerly the central Starlight Pool)' } },
                { type: 'Character', name: 'Aerion Swiftbow', owner: 2, era: 4, createdYear: 85, creationStep: '4.2 Colonization & Heroes', data: { id: '', name: 'Aerion Swiftbow', description: '**Profession:** Author\n**Status:** Active\n**Achievement Type:** Artistic Creation\n\nAerion is a famed poet and historian whose epic \'The Whisperwood Saga\' chronicled the early history of the Silverwood Sentinels. His works have become the foundation of elven culture and identity.\n\n**Honored Location:** Poet\'s Rest (formerly the quiet northern grove)' } }
            ],
            elementUpdates: [
                {
                    find: { owner: 2, type: 'Faction', data: { isNeighbor: false } },
                    updates: {
                        industry: "Starlight Weaving",
                        industryDescription: "**Production Methods**\nArtisans weave threads of raw magic drawn from the Starlight Pools into Whisperwood fabric under the full moon, creating textiles that shimmer with captured light.\n\n**Settlement Integration**\nStar-Gazer's Retreat is where the raw magic is collected and blessed. Glyn`dar houses the great looms where master weavers create the final products.\n\n**Cultural Integration**\nWeaving is a meditative art that connects the weaver to Aethel. The patterns are visual representations of prophecies seen in the Starlight Pools.\n\n**Trade & Relations**\nStarlight cloth is a highly sought-after luxury good, traded for rare metals and knowledge. The Iron-Hand Clan are primary customers for enchanted smithing gloves.\n\n**Knowledge Management**\nWeaving patterns are passed down from master to apprentice. The most potent designs are kept in a secret library, accessible only to the guild leaders.\n\n**Master Practitioners**\nMaster Weaver Elara Whisperwind (the faction leader) and the Seer Guild of Star-Gazer's Retreat."
                    }
                }
            ]
        },
        5: { // Era 5
            elements: [
                { type: 'Character', name: 'Lyra Meadowlight, Elder Stateswoman', owner: 2, era: 5, createdYear: 100, creationStep: '5.1 Empire Event', data: { id: '', name: 'Lyra Meadowlight, Elder Stateswoman', description: 'The hero Lyra Meadowlight, now an elder, returns from a long diplomatic mission, bringing with her new alliances and knowledge.' } },
                { type: 'Settlement', name: 'Moon-Glow', owner: 2, era: 5, createdYear: 110, creationStep: '5.1 Empire Event', data: { id: '', name: 'Moon-Glow', purpose: 'Industry', description: 'A new settlement built around the Sunken Moonpetal Grove to harvest its magical lilies.' } },
                { type: 'Event', name: 'The Silver Road', owner: 2, era: 5, createdYear: 115, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Silver Road', description: 'Following Lyra\'s success, a formal trade route was established with the Iron-Hand Clan, bolstering both economies.' } },
                { type: 'Settlement', name: 'The Star-Weaver\'s Lyceum', owner: 2, era: 5, createdYear: 128, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Star-Weaver\'s Lyceum', purpose: 'Religion', description: 'A grand academy dedicated to Aethel, built in Glyn`dar to study the arcane arts and the prophecies of the stars.' } },
                { type: 'Event', name: 'Corsair Raids', owner: 2, era: 5, createdYear: 135, creationStep: '5.1 Empire Event', data: { id: '', name: 'Corsair Raids', description: 'The Blacksail Corsairs have grown bolder, launching a major raid on Whisperwood Landing, disrupting trade.' } },
                { type: 'Event', name: 'Gloomfang\'s New Alpha', owner: 2, era: 5, createdYear: 148, creationStep: '5.1 Empire Event', data: { id: '', name: 'Gloomfang\'s New Alpha', description: 'The Gloomfang Pack has a new, more aggressive Alpha, leading to increased tension along the forest borders.' } },
                { type: 'Event', name: 'Gloomfang Advancement', owner: 2, era: 5, createdYear: 150, creationStep: '5.2 Neighbor Development', data: { id: '', name: 'Gloomfang Advancement', description: 'Under the new Alpha, the Gloomfang Pack has become more organized, establishing permanent dens and a clear hierarchy. They are now considered a Minor Faction rather than a simple tribe.', factionId: '' } },
                { type: 'Event', name: 'Blacksail Fortification', owner: 2, era: 5, createdYear: 151, creationStep: '5.2 Neighbor Development', data: { id: '', name: 'Blacksail Fortification', description: 'The Blacksail Corsairs have heavily fortified their hidden cove, turning it into a formidable pirate stronghold capable of repairing ships and launching larger raids.', factionId: '' } }
            ]
        },
        6: { // Era 6
             elements: [
                { type: 'Event', name: 'The Withering', owner: 2, era: 6, createdYear: 158, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Withering', description: 'A magical blight begins to spread from the heart of the Whisperwood, causing the ancient trees to lose their silver leaves and their magical whispers to fall silent.' } },
                { type: 'Event', name: 'The Starfall Prophecy Fails', owner: 2, era: 6, createdYear: 168, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Starfall Prophecy Fails', description: 'The Starlight Pools grow dark and cloudy, no longer reflecting the stars. The prophecies of the Star-Weaver\'s Lyceum become vague and contradictory, causing a crisis of faith.' } },
                { type: 'War', name: 'The Pirate War', owner: 2, era: 6, createdYear: 178, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Pirate War', description: 'The Silverwood Sentinels launch a full-scale naval campaign to eradicate the Blacksail Corsairs. The war is costly and drains the kingdom\'s resources.' } },
                { type: 'Event', name: 'The Last Hunt', owner: 2, era: 6, createdYear: 188, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Last Hunt', description: 'With the forest failing, Cernan\'s followers declare a last great hunt to honor their god, an event which sees many of the forest\'s remaining great beasts slain.' } },
                { type: 'Event', name: 'Exodus of the Sentinels', owner: 2, era: 6, createdYear: 198, creationStep: '6.1 Final Era Event', data: { id: '', name: 'Exodus of the Sentinels', description: 'Seeing their home dying, a large portion of the elven population, led by Elara Whisperwind\'s granddaughter, abandon Glyn`dar and sail for unknown lands, seeking a new beginning.' } },
                { type: 'Location', name: 'The Silent City of Glyn`dar', owner: 2, era: 6, createdYear: 202, creationStep: '6.2 Iconic Landmark', data: { id: '', name: 'The Silent City of Glyn`dar', siteType: 'Iconic Landmark', symbol: '🍂', description: 'The once-vibrant elven capital, now largely abandoned among the dying Whisperwood trees. Its silent, elegant structures are a beautiful but sorrowful reminder of a lost age of magic and grace.' } }
            ]
        }
    },
    // --- Player 3: MOFO (Orcs) ---
    3: {
        1: { // Era 1
            elements: [
                { type: 'Resource', name: 'Rage-Iron Deposits', owner: 3, era: 1, data: { id: '', name: 'Rage-Iron Deposits', type: 'mineral', properties: 'A dark, volatile metal that strengthens when heated by anger or battle-fury. Difficult to work, but creates brutal, powerful weapons.', symbol: '⚔️' } },
                { type: 'Resource', name: 'Scraplands', owner: 3, era: 1, data: { id: '', name: 'Scraplands', type: 'other', properties: 'A vast, ancient battlefield littered with the remnants of old wars. A valuable source of salvageable metal and lost artifacts.', symbol: '⚙️' } }
            ]
        },
        2: { // Era 2
            playerUpdates: { deityCount: 1 },
            elements: [
                { type: 'Deity', name: 'Kargoth, The Unchained', owner: 3, era: 2, createdYear: 1, data: { id: '', name: 'Kargoth, The Unchained', domain: 'War and Strength', symbol: 'A broken chain', emoji: '⛓️', description: 'The orcish god of pure, untamed strength and the glory of battle. He demands victory and scorns the weak.' } },
                { type: 'Location', name: 'The Skull Pit', owner: 3, era: 2, createdYear: 3, data: { id: '', name: 'The Skull Pit', siteType: 'bottomless pit', description: 'A massive chasm where the greatest champions of Kargoth are tested. The skulls of vanquished foes are thrown into its depths.', symbol: '💀', deityId: '' } }
            ]
        },
        3: { // Era 3
             elements: [
                { type: 'Faction', name: 'The Broken Tusk Horde', owner: 3, era: 3, data: { id: '', name: 'The Broken Tusk Horde', race: 'Greenskins', symbolName: 'Skull', emoji: '💀', color: 'Burnt Orange', theme: 'A powerful horde united by strength.', description: 'The Horde values individual power and glory. Infighting is common, ensuring only the strongest lead. They are direct, brutal, and surprisingly pragmatic.', leaderName: 'Warlord Grak', capitalName: 'Grak\'s Stand', isNeighbor: false } },
                { type: 'Faction', name: 'Cinder-Claw Kobolds', owner: 3, era: 3, data: { id: '', name: 'Cinder-Claw Kobolds', race: 'Reptilian', symbolName: 'Claw', emoji: '🐉', color: 'Red', theme: 'Scheming kobolds living in a nearby volcano.', description: 'A clan of cunning kobolds who worship a dormant dragon. They are masters of trap-making and guerrilla warfare.', leaderName: 'Chief Yip-Yip', isNeighbor: true, neighborType: 'Tribe or Clan' } },
                { type: 'Settlement', name: 'Grak\'s Stand', owner: 3, era: 3, data: { id: '', name: 'Grak\'s Stand', purpose: 'Capital', description: 'A brutal fortress built from scrap metal and stone.', factionId: '' } },
                { type: 'Settlement', name: 'Rage-Forge', owner: 3, era: 3, data: { id: '', name: 'Rage-Forge', purpose: 'Industry', description: 'A smoke-belching settlement dedicated to forging Rage-Iron.', factionId: '' } },
                { type: 'Settlement', name: 'Scab-Town', owner: 3, era: 3, data: { id: '', name: 'Scab-Town', purpose: 'Trade', description: 'A rough-and-tumble trading post in the Scraplands.', factionId: '' } }
            ]
        },
        4: { // Era 4
            elements: [
                { type: 'Faction', name: 'The Rustfang Reavers', owner: 3, era: 4, createdYear: 38, creationStep: '4.1 Exploration', data: { id: '', name: 'The Rustfang Reavers', race: 'Greenskins', symbolName: 'Axe', emoji: '🏴‍☠️', color: 'Brown', theme: 'Pirates', description: 'A rival warband that has taken to the seas, raiding coastal settlements from their ramshackle fleet of stolen ships.', leaderName: 'Cap\'n Rot-gut', isNeighbor: true } },
                { type: 'Resource', name: 'Gorehide Behemoths', owner: 3, era: 4, createdYear: 48, creationStep: '4.1 Exploration', data: { id: '', name: 'Gorehide Behemoths', type: 'fauna', properties: 'Massive, aggressive beasts with incredibly thick hides. Hunting them is a rite of passage for orcish warriors, and their hides are prized for making heavy armor.', symbol: '🦏' } },
                { type: 'Location', name: 'Isle of Bones', owner: 3, era: 4, createdYear: 58, creationStep: '4.1 Exploration', data: { id: '', name: 'Isle of Bones', siteType: 'island', description: 'A newly discovered, barren island littered with the skeletons of giant sea creatures. The Rustfang Reavers claim it as their own.', symbol: '🦴' } },
                { type: 'Settlement', name: 'Skullport', owner: 3, era: 4, createdYear: 68, creationStep: '4.1 Exploration', data: { id: '', name: 'Skullport', purpose: 'Trade', description: 'A ramshackle pirate port built on the Isle of Bones, serving as a haven for the Rustfang Reavers.', factionId: '' } },
                { type: 'Event', name: 'Volcanic Blessing', owner: 3, era: 4, createdYear: 82, creationStep: '4.1 Exploration', data: { id: '', name: 'Volcanic Blessing', description: 'The Cinder-Claw Kobolds\' volcano rumbled, revealing a new vein of Rage-Iron. They see it as a blessing from their dormant dragon god.' } },
                { type: 'War', name: 'The Scrap War', owner: 3, era: 4, createdYear: 90, creationStep: '4.1 Exploration', data: { id: '', name: 'The Scrap War', description: 'Warlord Grak led a campaign to unite the disparate clans of the Scraplands under his banner, crushing all who resisted.', attackers: [], defenders: [] } },
                { type: 'Character', name: 'Mog\'Thar the Unbreakable', owner: 3, era: 4, createdYear: 75, creationStep: '4.2 Colonization & Heroes', data: { id: '', name: 'Mog\'Thar the Unbreakable', description: '**Profession:** Beast Tamer\n**Status:** Active\n**Achievement Type:** Military Victory\n\nMog\'Thar is Warlord Grak\'s champion, who earned his name by single-handedly slaying and taming a Gorehide Behemoth, which now serves as his mount.\n\n**Honored Location:** Mog\'Thar\'s Pen (formerly the old beast pens)' } },
                { type: 'Character', name: 'Grishna Scrap-Sorcerer', owner: 3, era: 4, createdYear: 80, creationStep: '4.2 Colonization & Heroes', data: { id: '', name: 'Grishna Scrap-Sorcerer', description: '**Profession:** Inventor\n**Status:** Active\n**Achievement Type:** Innovation\n\nGrishna discovered how to harness volatile magical energies from artifacts found in the Scraplands, creating crude but effective war machines for the Horde.\n\n**Honored Location:** The Scrap-Heap (formerly the central salvage pile)' } },
                { type: 'Character', name: 'Urka Blood-Axe', owner: 3, era: 4, createdYear: 85, creationStep: '4.2 Colonization & Heroes', data: { id: '', name: 'Urka Blood-Axe', description: '**Profession:** Military Leader\n**Status:** Active\n**Achievement Type:** Military Victory\n\nUrka led the successful raid on a dwarven caravan, securing a massive amount of Heartstone for the Horde\'s smiths. She is known for her ferocity and cunning tactics.\n\n**Honored Location:** Urka\'s Trail (formerly the eastern canyon pass)' } }
            ],
            elementUpdates: [
                {
                    find: { owner: 3, type: 'Faction', data: { isNeighbor: false } },
                    updates: {
                        industry: "Scrapland Tinkering",
                        industryDescription: "**Production Methods**\nHorde tinkers salvage metal and lost artifacts from the Scraplands, creating crude but effective war machines and weaponry through a process of brutal, percussive engineering.\n\n**Settlement Integration**\nScab-Town is the primary salvage yard and market. Rage-Forge provides the raw materials, and Grak's Stand is where the largest war machines are assembled.\n\n**Cultural Integration**\nInnovation through salvage is highly valued. A tinker's worth is measured by the loudness and destructiveness of their creations. Kargoth blesses the most chaotic inventions.\n\n**Trade & Relations**\nThe Horde trades scrap metal for food and other necessities. They have a tense but functional trade relationship with the Republic of Sol, who value their raw materials.\n\n**Knowledge Management**\nThere is no formal training. Knowledge is stolen, copied, or learned through explosive trial and error. Successful designs are quickly imitated.\n\n**Master Practitioners**\nGrishna Scrap-Sorcerer is the most renowned inventor, followed by the siege-engine master Wrenchgut."
                    }
                }
            ]
        },
        5: { // Era 5
            elements: [
                { type: 'War', name: 'The Scouring of Skullport', owner: 3, era: 5, createdYear: 92, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Scouring of Skullport', description: 'The Broken Tusk Horde, seeing the Rustfang Reavers as weak rivals, launched a naval invasion of the Isle of Bones and burned Skullport to the ground.', attackers: ['The Broken Tusk Horde'], defenders: ['The Rustfang Reavers'] } },
                { type: 'War', name: 'War for the Warrens', owner: 3, era: 5, createdYear: 103, creationStep: '5.1 Empire Event', data: { id: '', name: 'War for the Warrens', description: 'The Horde declared war on a local Ratfolk faction, conquering their warrens to secure more living space and resources.', attackers: ['The Broken Tusk Horde'], defenders: ['Ratfolk'] } },
                { type: 'Event', name: 'Loot Prosperity', owner: 3, era: 5, createdYear: 111, creationStep: '5.1 Empire Event', data: { id: '', name: 'Loot Prosperity', description: 'Flush with loot from their recent conquests, Grak\'s Stand has grown significantly. The Warlord commissions a massive, intimidating statue of Kargoth in the city center.' } },
                { type: 'Settlement', name: 'The Spike', owner: 3, era: 5, createdYear: 125, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Spike', purpose: 'Military', description: 'A new, brutalist fortress built on the conquered Ratfolk territory to solidify the Horde\'s control.' } },
                { type: 'Event', name: 'The Big Boom', owner: 3, era: 5, createdYear: 138, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Big Boom', description: 'A catastrophic explosion at the Rage-Forge, caused by Grishna Scrap-Sorcerer\'s latest invention, destroys the settlement and turns the surrounding area into a magically-charged wasteland.' } },
                { type: 'Event', name: 'The Blood-Axe Rebellion', owner: 3, era: 5, createdYear: 149, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Blood-Axe Rebellion', description: 'Urka Blood-Axe, blaming Warlord Grak\'s recklessness for the destruction of the Rage-Forge, leads her clan to split from the Horde, forming a new, rival faction.' } },
                { type: 'Event', name: 'The Great Wyrm Altar', owner: 3, era: 5, createdYear: 150, creationStep: '5.2 Neighbor Development', data: { id: '', name: 'The Great Wyrm Altar', description: 'The Cinder-Claw Kobolds have completed a grand and terrible altar at the peak of their volcano, claiming it will hasten the return of their dragon master.', factionId: '' } },
                { type: 'Event', name: 'Rustfang\'s Revenge', owner: 3, era: 5, createdYear: 153, creationStep: '5.2 Neighbor Development', data: { id: '', name: 'Rustfang\'s Revenge', description: 'The scattered remnants of the Rustfang Reavers have reformed as a land-based bandit clan, harassing Horde supply lines out of pure spite.', factionId: '' } }
            ]
        },
        6: { // Era 6
             elements: [
                { type: 'Event', name: 'The Rage Fades', owner: 3, era: 6, createdYear: 156, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Rage Fades', description: 'The Rage-Iron deposits begin to lose their volatile properties, becoming inert. The Horde\'s most powerful weapons are now just common iron.' } },
                { type: 'Event', name: 'The Scraplands Run Dry', owner: 3, era: 6, createdYear: 166, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Scraplands Run Dry', description: 'After generations of salvage, the Scraplands are picked clean. The source of the Horde\'s ingenuity and resources is exhausted.' } },
                { type: 'War', name: 'The Final WAAAGH!', owner: 3, era: 6, createdYear: 176, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Final WAAAGH!', description: 'Facing inevitable decline, the aging Warlord Grak declares a final, glorious war against the Republic of Sol, seeking a worthy death.' } },
                { type: 'Event', name: 'The Fall of Grak', owner: 3, era: 6, createdYear: 186, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Fall of Grak', description: 'Warlord Grak is slain in battle by a champion of the Republic of Sol. Without his leadership, the Horde shatters into warring clans.' } },
                { type: 'Event', name: 'The Dragon Wakes', owner: 3, era: 6, createdYear: 196, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Dragon Wakes', description: 'The Cinder-Claw Kobolds\' rituals succeed. A great magma dragon erupts from their volcano, incinerating the kobolds and claiming the mountain as its own.' } },
                { type: 'Location', name: 'The Scraplands', owner: 3, era: 6, createdYear: 201, creationStep: '6.2 Iconic Landmark', data: { id: '', name: 'The Scraplands', siteType: 'Iconic Landmark', symbol: '⚙️', description: 'A vast, barren plain littered with the rusting hulks of ancient war machines and forgotten armies. It was the cradle of the Broken Tusk Horde\'s ingenuity and the grave of their ambition.' } }
            ]
        }
    },
    // --- Player 4: MyFaCeHuRt (Humans) ---
    4: {
        1: { // Era 1
            elements: [
                { type: 'Resource', name: 'Sunken City of Aztlan', owner: 4, era: 1, data: { id: '', name: 'Sunken City of Aztlan', type: 'other', properties: 'The ruins of an ancient city just off the coast, filled with coral-encrusted treasures and lost knowledge. Dangerous to explore but highly rewarding.', symbol: '🏛️' } },
                { type: 'Resource', name: 'Leviathan Graveyard', owner: 4, era: 1, data: { id: '', name: 'Leviathan Graveyard', type: 'fauna', properties: 'A deep ocean trench where ancient sea monsters go to die. Their massive bones are a source of a durable, ivory-like material, and their hearts sometimes crystallize into valuable gems.', symbol: '🐋' } }
            ]
        },
        2: { // Era 2
            playerUpdates: { deityCount: 2 },
            elements: [
                { type: 'Deity', name: 'Solara, the Ever-Light', owner: 4, era: 2, createdYear: 2, data: { id: '', name: 'Solara, the Ever-Light', domain: 'Sun and Trade', symbol: 'A golden sun with seven rays', emoji: '☀️', description: 'Goddess of the sun, commerce, and civilization. She represents progress, wealth, and the light that pushes back the darkness.' } },
                { type: 'Deity', name: 'Lir, the Restless Sea', owner: 4, era: 2, createdYear: 3, data: { id: '', name: 'Lir, the Restless Sea', domain: 'Oceans and Storms', symbol: 'A spiraling wave', emoji: '🌊', description: 'The fickle god of the sea, representing both its bounty and its destructive fury. Worshipped by sailors and coastal communities.' } },
                { type: 'Location', name: 'The Sunstone Spire', owner: 4, era: 2, createdYear: 4, data: { id: '', name: 'The Sunstone Spire', siteType: 'rock tower', description: 'A tall sea stack that catches the first and last rays of the sun, sacred to Solara.', symbol: '🗼', deityId: '' } },
                { type: 'Location', name: 'Lir\'s Maw', owner: 4, era: 2, createdYear: 7, data: { id: '', name: 'Lir\'s Maw', siteType: 'cave', description: 'A vast sea cave that roars with the tide, where offerings are made to Lir to appease his wrath.', symbol: '🌀', deityId: '' } }
            ]
        },
        3: { // Era 3
             elements: [
                { type: 'Faction', name: 'The Republic of Sol', owner: 4, era: 3, data: { id: '', name: 'The Republic of Sol', race: 'Humans', symbolName: 'Sun', emoji: '☀️', color: 'Gold', theme: 'A thriving coastal republic built on trade.', description: 'An ambitious and adaptable human republic focused on maritime trade and exploration. They value innovation, wealth, and individual achievement.', leaderName: 'First Speaker Aurelius', capitalName: 'Port Solara', isNeighbor: false } },
                { type: 'Faction', name: 'The Tide-Scale Merfolk', owner: 4, era: 3, data: { id: '', name: 'The Tide-Scale Merfolk', race: 'Seafolk', symbolName: 'Fish', emoji: '🧜', color: 'Turquoise', theme: 'Territorial merfolk who claim the nearby reefs.', description: 'An ancient and proud merfolk kingdom that guards the secrets of the deep. They are wary of surface-dwellers but respect strength and tradition.', leaderName: 'Triton-King Threx', isNeighbor: true, neighborType: 'Minor Kingdom' } },
                { type: 'Settlement', name: 'Port Solara', owner: 4, era: 3, data: { id: '', name: 'Port Solara', purpose: 'Capital', description: 'A bustling port city and the heart of the Republic.', factionId: '' } },
                { type: 'Settlement', name: 'Aztlan\'s Watch', owner: 4, era: 3, data: { id: '', name: 'Aztlan\'s Watch', purpose: 'Military', description: 'A naval fort that guards the entrance to the sunken city.', factionId: '' } },
                { type: 'Settlement', name: 'Bone-Wharf', owner: 4, era: 3, data: { id: '', name: 'Bone-Wharf', purpose: 'Industry', description: 'A settlement dedicated to harvesting and carving Leviathan bone.', factionId: '' } }
            ]
        },
        4: { // Era 4
            elements: [
                { type: 'Location', name: 'Isle of the Siren\'s Echo', owner: 4, era: 4, createdYear: 32, creationStep: '4.1 Exploration', data: { id: '', name: 'Isle of the Siren\'s Echo', siteType: 'island', description: 'A newly discovered island with treacherous cliffs and a constant, enchanting mist that carries a faint, melodic sound. Named after the explorer Lyra Seawind.', symbol: '🏝️' } },
                { type: 'Settlement', name: 'Farshore', owner: 4, era: 4, createdYear: 41, creationStep: '4.1 Exploration', data: { id: '', name: 'Farshore', purpose: 'Trade', description: 'A new coastal colony established on the Isle of the Siren\'s Echo to serve as a trading post and resupply point for further exploration.', factionId: '' } },
                { type: 'Faction', name: 'The Red Masks', owner: 4, era: 4, createdYear: 53, creationStep: '4.1 Exploration', data: { id: '', name: 'The Red Masks', race: 'Humans', symbolName: 'Spade', emoji: '🎭', color: 'Red', theme: 'Sophisticated bandits', description: 'A mysterious group of bandits known for their theatrical heists and calling cards, targeting wealthy Republic merchants.', leaderName: 'Silas "The Director"', isNeighbor: true } },
                { type: 'Event', name: 'Aztlan\'s Glow', owner: 4, era: 4, createdYear: 66, creationStep: '4.1 Exploration', data: { id: '', name: 'Aztlan\'s Glow', description: 'A powerful magical pulse emanated from the sunken city of Aztlan, causing compasses to spin wildly and temporarily illuminating the ruins on the seafloor.' } },
                { type: 'Settlement', name: 'Aurelia\'s Vineyard', owner: 4, era: 4, createdYear: 84, creationStep: '4.1 Exploration', data: { id: '', name: 'Aurelia\'s Vineyard', purpose: 'Food', description: 'A new settlement founded in a surprisingly fertile inland valley, known for producing exquisite wines that have become a major luxury export for the Republic.' } },
                { type: 'Monument', name: 'The First Speaker\'s Lighthouse', owner: 4, era: 4, createdYear: 90, creationStep: '4.1 Exploration', data: { id: '', name: 'The First Speaker\'s Lighthouse', description: 'A colossal lighthouse commissioned by First Speaker Aurelius, serving as a beacon of hope and a symbol of the Republic\'s maritime dominance.' } },
                { type: 'Character', name: 'Captain Eva "Storm-Eye"', owner: 4, era: 4, createdYear: 77, creationStep: '4.2 Colonization & Heroes', data: { id: '', name: 'Captain Eva "Storm-Eye"', description: '**Profession:** Explorer\n**Status:** Active\n**Achievement Type:** Discovery\n\nA famed explorer from Port Solara who charted the treacherous waters around the Leviathan Graveyard and established the safe passage to Farshore.\n\n**Honored Location:** Eva\'s Passage (formerly the stormy southern channel)' } },
                { type: 'Character', name: 'Master Tiberius', owner: 4, era: 4, createdYear: 80, creationStep: '4.2 Colonization & Heroes', data: { id: '', name: 'Master Tiberius', description: '**Profession:** Inventor\n**Status:** Active\n**Achievement Type:** Innovation\n\nAn ingenious inventor who developed the advanced diving bell used to safely explore the upper levels of the Sunken City of Aztlan, recovering priceless artifacts.\n\n**Honored Location:** Tiberius Deep (formerly the Aztlan Trench)' } },
                { type: 'Character', name: 'Senator Cassia', owner: 4, era: 4, createdYear: 85, creationStep: '4.2 Colonization & Heroes', data: { id: '', name: 'Senator Cassia', description: '**Profession:** Humanitarian\n**Status:** Active\n**Achievement Type:** Political Leadership\n\nSenator Cassia championed the establishment of public granaries and fair trade laws, ensuring the prosperity of the Republic was shared among its citizens, preventing widespread famine during the Long Winter.\n\n**Honored Location:** Cassia\'s Market (formerly the Port Solara central plaza)' } }
            ],
            elementUpdates: [
                {
                    find: { owner: 4, type: 'Faction', data: { isNeighbor: false } },
                    updates: {
                        industry: "Leviathan Bone Cartography",
                        industryDescription: "**Production Methods**\nDivers from Bone-Wharf harvest the massive bones from the Leviathan Graveyard. Master artisans then carve these bones into incredibly detailed and durable nautical charts, using squid ink for the markings.\n\n**Settlement Integration**\nBone-Wharf is the sole source of raw leviathan bone. Aztlan's Watch protects the harvesting operations. Port Solara is home to the Cartographer's Guild, where the charts are finished and sold.\n\n**Cultural Integration**\nCartography is seen as a sacred art, a way of taming Lir's restless seas. The most skilled cartographers are revered, and their work is displayed as art in the halls of the Senate.\n\n**Trade & Relations**\nLeviathan Bone charts are invaluable to sailors and are the Republic's most prized export, granting them significant influence over maritime trade. They are traded for military support and rare goods.\n\n**Knowledge Management**\nThe Cartographer's Guild in Port Solara trains apprentices. The secret techniques for carving the bone without it shattering are passed down from master to student.\n\n**Master Practitioners**\nGuildmaster Corvus, and the legendary explorer Captain Eva 'Storm-Eye', who provides the raw survey data."
                    }
                }
            ]
        },
        5: { // Era 5
            elements: [
                { type: 'Character', name: 'Admiral Eva "Storm-Eye"', owner: 4, era: 5, createdYear: 98, creationStep: '5.1 Empire Event', data: { id: '', name: 'Admiral Eva "Storm-Eye"', description: 'The hero Captain Eva, now promoted to Admiral, arrives in Port Solara with a newly commissioned flagship, "The Horizon".' } },
                { type: 'Settlement', name: 'New Aztlan', owner: 4, era: 5, createdYear: 108, creationStep: '5.1 Empire Event', data: { id: '', name: 'New Aztlan', purpose: 'Industry', description: 'An ambitious underwater settlement being constructed near the Sunken City, using Master Tiberius\'s designs.' } },
                { type: 'Event', name: 'The Golden Pact', owner: 4, era: 5, createdYear: 118, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Golden Pact', description: 'A major trade agreement is signed between the Republic of Sol and the Broken Tusk Horde, trading finished goods for raw scrap metal.' } },
                { type: 'Settlement', name: 'The Speaker\'s Forum', owner: 4, era: 5, createdYear: 128, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Speaker\'s Forum', purpose: 'Religion', description: 'A grand academy and temple complex dedicated to Solara is built in the capital, serving as the center of political and religious life.' } },
                { type: 'Event', name: 'The Red Mask Heist', owner: 4, era: 5, createdYear: 138, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Red Mask Heist', description: 'The Red Masks carry out their most daring heist, stealing the entire payroll for the Aztlan\'s Watch garrison from the Speaker\'s Forum itself.' } },
                { type: 'Event', name: 'The Governor\'s Folly', owner: 4, era: 5, createdYear: 148, creationStep: '5.1 Empire Event', data: { id: '', name: 'The Governor\'s Folly', description: 'The governor of the distant Farshore colony is overthrown by the populace after his tyrannical rule and hoarding of resources is exposed.' } },
                { type: 'Event', name: 'Tide-Scale Militarization', owner: 4, era: 5, createdYear: 150, creationStep: '5.2 Neighbor Development', data: { id: '', name: 'Tide-Scale Militarization', description: 'The Tide-Scale Merfolk, wary of the Republic\'s growing naval power, have constructed a formidable underwater fortress near the Leviathan Graveyard, claiming the entire trench as their sovereign territory.', factionId: '' } },
                { type: 'Event', name: 'The Red Mask\'s Grand Performance', owner: 4, era: 5, createdYear: 154, creationStep: '5.2 Neighbor Development', data: { id: '', name: 'The Red Mask\'s Grand Performance', description: 'The Red Masks have become a folk hero to the common people, expanding their operations to include "liberating" grain shipments and distributing them in the poorer districts.', factionId: '' } }
            ]
        },
        6: { // Era 6
             elements: [
                { type: 'Event', name: 'The Leviathans Return', owner: 4, era: 6, createdYear: 157, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Leviathans Return', description: 'The great sea creatures have returned to the Leviathan Graveyard, not to die, but to live. Their presence makes harvesting their bones impossible and disrupts all naval trade.' } },
                { type: 'Event', name: 'The Sunken City Rises', owner: 4, era: 6, createdYear: 167, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Sunken City Rises', description: 'The magical pulse from Aztlan intensifies, and the ancient city slowly begins to rise from the depths, causing massive tidal waves that devastate the Republic\'s coastal settlements.' } },
                { type: 'War', name: 'The Salt War', owner: 4, era: 6, createdYear: 177, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Salt War', description: 'With their naval superiority gone, the Republic of Sol is invaded by the Tide-Scale Merfolk, who seek to reclaim the coasts.' } },
                { type: 'Event', name: 'The Last Speaker', owner: 4, era: 6, createdYear: 187, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Last Speaker', description: 'The Speaker\'s Forum is sacked during the Salt War. The last Speaker of the Republic dies defending it, and with them, the Republic effectively dissolves into independent city-states.' } },
                { type: 'Event', name: 'The Vineyards Burn', owner: 4, era: 6, createdYear: 197, creationStep: '6.1 Final Era Event', data: { id: '', name: 'The Vineyards Burn', description: 'In the chaos, the fertile inland valleys are scorched by a mysterious fire, destroying the Republic\'s last major economic asset.' } },
                { type: 'Location', name: 'The Sunken City of Aztlan', owner: 4, era: 6, createdYear: 203, creationStep: '6.2 Iconic Landmark', data: { id: '', name: 'The Sunken City of Aztlan', siteType: 'Iconic Landmark', symbol: '🏛️', description: 'A city of impossible architecture that rose from the sea, its appearance heralded the end of the Republic of Sol. It stands now as a silent, alien monument on the coastline, a testament to the hubris of a fallen empire that delved too deep.' } }
            ]
        }
    }
};