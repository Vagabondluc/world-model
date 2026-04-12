
import { SceneDetails } from '../types/scene';
import { DungeonDetails, BattlemapDetails, SettlementDetails, SpecialLocationDetails } from '../types/location';
import { MinorNpcDetails, MajorNpcDetails, CreatureDetails } from '../types/npc';
import { FactionDetails } from '../types/faction';
import { SimpleAdventureDetails } from '../types/generator';

export const DUMMY_HOOKS: SimpleAdventureDetails[] = [
    { origin: "Ancient tectonic shifts have revealed a sunken aberrant temple beneath the miners' guild.", positioning: "You are the only ones immune to the psychic scream echoing from the depths.", stakes: "If not silenced, the scream will drive the entire city mad by the next new moon." },
    { origin: "A disgraced noble is selling state secrets to a rival warring nation to fund their lavish lifestyle.", positioning: "You have a contact on the inside who only trusts outsiders.", stakes: "War will break out within the week if the plans are delivered." },
    { origin: "The local druid circle has been corrupted by a necrotic blight seeping from the Shadowfell.", positioning: "You were in the forest when the corruption began and are already 'infected'—you must cure it to save yourselves.", stakes: "The blight will consume the region's farmlands, causing mass famine." },
    { origin: "A magical artifact in the museum has started animating other exhibits at night.", positioning: "The curator hired you because you don't look like 'official' city guard types.", stakes: "Valuable history will be destroyed, and the animated T-Rex skeleton might escape into the streets." },
    { origin: "Goblin sappers have tapped into the city's sewer system to bypass the walls.", positioning: "You literally fell into their tunnels while walking down the street.", stakes: "A surprise invasion force could emerge in the noble district tonight." }
];

export const DUMMY_OUTLINE = {
    scenes: [
        { title: "The Whispering Tavern", type: "NPC Interaction", challenge: "Extract information from the terrified survivor without drawing attention.", locationName: "The Rusty Anchor" },
        { title: "Streets of Shadow", type: "Exploration", challenge: "Navigate the quarantined district while avoiding city guard patrols.", locationName: "Old Quarter" },
        { title: "Ambush at the Alley", type: "Combat", challenge: "Defeat the Syndicate enforcers before they raise the alarm.", locationName: "Old Quarter" },
        { title: "The Hidden Entrance", type: "Exploration", challenge: "Find and unlock the magically sealed grate leading below.", locationName: "Sewers beneath the City" },
        { title: "Descent into Madness", type: "Dungeon", challenge: "Survive the traps left by the cultists.", locationName: "Sunken Temple of Xar'kosh" },
        { title: "The Ritual Chamber", type: "Combat", challenge: "Disrupt the summoning ritual while fighting off aberrant horrors.", locationName: "Sunken Temple of Xar'kosh" }
    ],
    locations: [
        { name: "The Rusty Anchor", description: "A dockside tavern known for its tight-lipped patrons and strong ale.", type: "Settlement" },
        { name: "Old Quarter", description: "A crumbling section of the city, currently under quarantine due to 'mysterious illnesses'.", type: "Settlement" },
        { name: "Sewers beneath the City", description: "A labyrinthine network of ancient tunnels, far older than the city above.", type: "Dungeon" },
        { name: "Sunken Temple of Xar'kosh", description: "An aberrant structure of non-Euclidean geometry buried deep underground.", type: "Dungeon" }
    ],
    npcs: [
        { name: "Elara Vance", description: "A traumatized city guard who saw something she shouldn't have.", type: "Minor", faction: "City Watch" },
        { name: "Kaelen 'Silver-Tongue'", description: "A charismatic rogue running an underground smuggling ring in the quarantine zone.", type: "Major", faction: "The Gilded Syndicate" },
        { name: "High Priest Malakar", description: "A fanatic obsessed with bringing his dark master to this plane.", type: "Antagonist", faction: "Cult of the Deep One" }
    ],
    factions: [
        { name: "City Watch", goal: "Maintain order and keep the quarantine secure.", category: "Government & Authority" },
        { name: "The Gilded Syndicate", goal: "Profit from the chaos in the Old Quarter.", category: "Criminal Enterprises" },
        { name: "Cult of the Deep One", goal: "Summon Xar'kosh to consume the surface world.", category: "Religious Organizations" }
    ]
};

export const DUMMY_CREATURE: { name: string, concept: string, description: string, profile: CreatureDetails } = {
    name: "Crystal Vanguard",
    concept: "A hulking elemental guardian made of jagged, glowing crystals, often found protecting deep underground geodes or wizard towers.",
    description: "A towering figure of translucent crystal, refracting light into a blinding halo. Its form is roughly humanoid but sharp and angular, with a low hum emanating from its core.",
    profile: {
        table: {
            creatureType: "Elemental", size: "Large", alignment: "Neutral",
            armorClass: "17 (natural armor)", hitPoints: "85 (10d10 + 30)", speed: "30 ft., burrow 30 ft.",
            senses: "darkvision 60 ft., tremorsense 60 ft.", languages: "Terran", challengeRating: "5",
            keyAbilities: "Strength, Constitution", role: "Brute"
        },
        abilitiesAndTraits: "**Illumination.** The vanguard sheds dim light in a 10-foot radius.\n\n**Siege Monster.** The vanguard deals double damage to objects and structures.\n\n**Crystalline Form.** Any creature that touches the vanguard or hits it with a melee attack while within 5 feet of it takes 1d6 slashing damage.",
        actions: "**Multiattack.** The vanguard makes two slam attacks.\n\n**Slam.** *Melee Weapon Attack:* +8 to hit, reach 10 ft., one target. *Hit:* 14 (2d8 + 5) bludgeoning damage plus 4 (1d8) radiant damage.\n\n**Crystalline Burst (Recharge 5–6).** The vanguard releases a burst of blinding light. Each creature within 20 feet of it must make a DC 14 Constitution saving throw, taking 22 (4d10) radiant damage on a failed save, or half as much damage on a success without being blinded.",
        roleplayingAndTactics: "The Crystal Vanguard is a relentless guardian. It prioritizes targets that are actively damaging the object or area it is protecting. It uses its Crystalline Burst early to blind multiple foes, then focuses its slam attacks on blinded enemies to gain advantage. It has no sense of self-preservation and will fight until destroyed."
    }
};

export const DUMMY_DUNGEON: DungeonDetails = {
    rooms: [
        { title: "1. The Whispering Vestibule", description: "Stone statues of weeping maidens line the walls. Faint whispers can be heard when the wind blows through cracks in the ceiling. A hidden pressure plate near the center statue activates a poison dart trap." },
        { title: "2. The Hall of Mirrors", description: "A long corridor lined with tarnished silver mirrors. They reflect not the current viewer, but their potential future deaths. Staring too long requires a Wisdom save to avoid being frightened." },
        { title: "3. The Altar of Ash", description: "A circular room dominated by a massive obsidian altar covered in fine grey ash. Disturbing the ash causes it to coalesce into an Ash Mephit. A ruby rests within the ash pile." },
        { title: "4. The Flooded Crypt", description: "Knee-deep stagnant water covers the floor. Sarcophagi float precariously. Lurking beneath the water are several undead hands waiting to grapple unwary explorers." }
    ]
};

export const DUMMY_BATTLEMAP: BattlemapDetails = {
    battlefields: [
        { title: "Option 1: The Crumbling Bridge", description: "A narrow stone bridge spans a deep chasm. Sections of the railing are missing, and some flagstones are loose (difficult terrain). Falling means almost certain death. Good for tension and shove actions." },
        { title: "Option 2: The Overgrown Ruins", description: "Ancient pillars provide varying degrees of cover (half and three-quarters). Thick vines create areas of difficult terrain and can be climbed to reach higher vantage points on top of broken arches." },
        { title: "Option 3: Crystal Cave Choke-point", description: "A wide cavern narrows into a 10-foot wide tunnel. Glowing crystals provide dim light and can be shattered to create zones of piercing hazard. Perfect for defensive stands." }
    ]
};

export const DUMMY_SETTLEMENT: SettlementDetails = {
    overview: "Raven's Perch is a clifftop mining town that has seen better days. Once prosperous from silver mines, it now relies on meager trade and travelers wary of the pass ahead.",
    geography: "Built precariously on sheer granite cliffs. Streets are narrow, winding stairs carved directly into the rock. Cold winds constantly blow from the mountains.",
    society: "Insular and distrustful of strangers. The populace is hardy, grim, and deeply superstitious about the 'things in the mist' below the cliffs.",
    economy: "Primary exports: Iron (low quality), mountain herbs. Imports: Grain, luxury goods. The mines are mostly tapped out.",
    governance: "Ruled by Speaker Kaelen, an elder chosen by the heads of the three main mining families. He is fair but easily swayed by the wealthiest family, the Vanes.",
    culture: "They worship the 'Stone Mother' (a localized earth deity). Festivals involve quiet reflection rather than boisterous celebration. Iron jewelry is a sign of status.",
    individuals: "Speaker Kaelen (weary leader), Mara Vane (ambitious merchant matriarch), 'Odd' Thomas (crazy old prospector who claims to have found a new gold vein).",
    challenges: "Food shortages due to a harsh winter. Increasing disappearances of miners in the lower deeps. A rival bandit clan blocking the southern trade road.",
    adventureHooks: "Thomas needs an escort to prove his new claim. The Speaker wants outsiders to investigate the disappearances quietly. Mara Vane wants a rival merchant's caravan sabotaged."
};

export const DUMMY_SPECIAL_LOCATION: SpecialLocationDetails = {
    details: "The Singing Monolith is a massive shard of sky-blue crystal jutting from the center of a dead crater. At dawn and dusk, it emits a haunting, melodic hum that can be heard for miles. Magic cast within 100 feet of it is unpredictable (wild magic table). Sages believe it's a piece of a fallen flying city, while locals believe it's the frozen tear of a god. The area around it is lush with strangely mutated, vibrant flora despite the barren wasteland surrounding the crater."
};

export const DUMMY_SCENE: SceneDetails = {
    introduction: "The heavy oak doors of the council chamber swing open, revealing a room tense with hushed arguments. A large circular table dominates the center, covered in maps and scrolls. General Kael sits stone-faced at the head, while High Mage Valoria paces angrily behind him. The air smells of stale wine and burning wax.",
    interactionPoints: [
        "The War Map: Shows troop movements that don't match what the PCs were told earlier.",
        "General Kael: Stoic, refuses to make eye contact, clearly hiding a grievous error.",
        "High Mage Valoria: Furious, willing to breach protocol to get the truth out.",
        "The Sealed Scroll: Resting near Kael's hand, bearing the royal seal, currently unopened."
    ],
    npcs: [
         { name: "General Kael", description: "A battle-hardened veteran now drowning in politics.", motivation: "Protect his reputation and maintain morale at all costs." },
         { name: "High Mage Valoria", description: "Sharp-witted and impatient with incompetence.", motivation: "Uncover the tactical failure before innocent lives are lost." }
    ],
    dmNotes: "Kael knows the eastern front has already fallen but is terrified to admit it. The sealed scroll contains his orders to retreat, which he ignores. Valoria suspects this but lacks proof. A DC 15 Insight check reveals Kael is terrified, not just stubborn."
};

export const DUMMY_MAJOR_NPC: MajorNpcDetails = {
    table: {
         factionAffiliation: "The Obsidian Cabal", name: "Lord Vorthos", race: "High Elf", role: "Mastermind",
         appearance: "Tall, gaunt, impeccably dressed in black and silver robes. One eye is replaced by a glowing ruby gemstone.", 
         alignment: "Lawful Evil",
         motivations: "To recover the lost artifacts of his ancestors and restore elven supremacy.", 
         personality: "Cold, calculating, utterly polite even when threatening death.", 
         flaws: "Underestimates 'lesser' races (humans, dwarves, etc.). Arrogant about his magical superiority.", 
         catchphrase: "Success is merely a matter of proper planning.",
         mannerisms: "Smooths his robes constantly. Taps the ruby eye when deep in thought.", 
         speech: "Precise, articulate, no contractions. Quiet voice that forces others to lean in.",
         availableKnowledge: "Deep history of the region, arcane theory, location of several minor magical items.", 
         hiddenKnowledge: "The true location of the Soul Forge. He is secretly a lich whose phylactery is the ruby eye.",
         bonds: "His deceased daughter (whose soul he tries to retrieve).", 
         roleplayingCues: "Never raise your voice. Offer generous deals that always have a hidden cost. Treat the PCs like amusing pets until they become actual threats."
    },
    backstory: "Vorthos was once a respected archmage who lost his family in a human uprising centuries ago. Driven mad by grief, he turned to forbidden necromancy to find a way to bring them back. He founded the Obsidian Cabal to gather the resources needed for his grand ritual, viewing the current kingdoms as temporary inconveniences to be swept aside.",
    personalityDetails: {
        motivations: "Grief twisted into ambition; restoring the past at the cost of the present.", 
        morals: "The ends always justify the means. Individual lives are fleeting and meaningless compared to his eternal goals.", 
        personality: "Patient, manipulative, scholarly.", 
        flaws: "Obsessive, dismissive of emotional connections in others."
    }
};

export const DUMMY_MINOR_NPC: MinorNpcDetails = {
    race: "Dwarf (Hill)", name: "Barda Anvilheart", gender: "Female", sexualPreference: "Heterosexual",
    personality: "Gruff exterior but deeply maternal towards anyone younger than her.", 
    physicalDescriptor: "Wide frame, braided grey beard tucked into her belt, flour-dusted apron.",
    alignment: "Neutral Good", speechExample: "Eat up, you look like a stiff breeze would knock you over!",
    job: "Baker / Innkeeper of 'The Crusty Loaf'", jobReason: "Took over the family business after her husband passed.", 
    skills: "Baking, Intimidation (wooden spoon), Local Gossip",
    secret: "She's hiding a deserter from the local lord's army in her cellar.", 
    questHook: "Rats in her cellar are unusually large and aggressive (actually wererats scouting the town).",
    inventory: "Rolling pin (club), bag of stale buns (improvised thrown weapons), 15gp in smallclothes.", 
    comparison: "Molly Weasley meets Gimli."
};

export const DUMMY_FACTION: FactionDetails = {
    identity: "The Argent Eyes",
    ideology: "Knowledge should be free, but dangerous knowledge must be contained. We watch the shadows so others may live in the light.",
    areaOfOperation: "Continental. They have cells in most major cities, usually disguised as libraries or antique shops.",
    powerLevel: "High. They lack large armies but possess vast networks of informants, magical communication, and elite strike teams.",
    shortTermGoal: "Recover the stolen 'Codex of Infinite Planes' from a rival cult.",
    midTermGoal: "Infiltrate the royal court to monitor the advisor suspected of demonic pacts.",
    longTermGoal: "Establish a world-spanning magical ward to prevent extraplanar incursions entirely.",
    clocks: [
        {
            id: "argent-eyes-sealing",
            objective: "Ritual of Sealing (preventing a demon lord's arrival)",
            segments: 8,
            progress: 0,
            resolutionMethod: "simple",
            allies: [],
            enemies: [],
            pcImpact: false,
            events: []
        }
    ]
};
