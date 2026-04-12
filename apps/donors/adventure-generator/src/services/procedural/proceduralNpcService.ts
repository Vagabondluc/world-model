import { z } from 'zod';
import { NpcPersona } from '../../types/npc';

const RACES = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Orc', 'Tiefling', 'Gnome', 'Dragonborn', 'Half-Elf', 'Half-Orc'];
const ROLES = ['Merchant', 'Blacksmith', 'Guard', 'Scholar', 'Noble', 'Thief', 'Alchemist', 'Innkeeper', 'Farmer', 'Mercenary', 'Cultist', 'Mage'];
const ALIGNMENTS = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];

const APPEARANCES = [
    "Tall and gaunt with deep-set eyes.",
    "Short and stout with a rosy complexion.",
    "Muscular and scarred, moving with a limp.",
    "Ethereal and graceful, with hair like spun silver.",
    "Rough-hewn with calloused hands and a weather-beaten face.",
    "Adorned in fine silks, smelling of lavender and old books.",
    "Wearing patched leather armor, eyes darting nervously.",
    "Bald and tattooed with arcane symbols.",
    "Extremely old, leaning heavily on a gnarled staff."
];

const MOTIVATIONS = [
    "To reclaim a lost family heirloom.",
    "To exact revenge on a rival guild.",
    "To protect their village from a looming threat.",
    "To discover the secret of immortality.",
    "To amass enough wealth to buy a title.",
    "To atone for a past crime.",
    "To prove their worth to a distant parent.",
    "To find a cure for a magical malady."
];

const TRAITS = [
    "Optimistic and bubbly.",
    "Cynical and distrusting.",
    "Stoic and unwavering.",
    "Nervous and fidgety.",
    "Arrogant and condescending.",
    "Gentle and maternal/paternal.",
    "Mysterious and vague.",
    "Loud and boisterous."
];

const FLAWS = [
    "Greedy beyond measure.",
    "Cowardly in the face of danger.",
    "Addicted to gambling.",
    "Cannot keep a secret.",
    "Prejudiced against magic users.",
    "Easily distracted by shiny objects.",
    "Hot-headed and prone to violence.",
    "Naive and easily manipulated."
];

const CATCHPHRASES = [
    "By the gods!",
    "It is what it is.",
    "Trust me on this.",
    "I've seen worse.",
    "Don't look at me.",
    "Fate is a fickle mistress.",
    "Just as I calculated.",
    "What a utter waste of time."
];

const MANNERISMS = [
    "Constantly checks their pockets.",
    "Taps their foot impatiently.",
    "Avoids eye contact.",
    "Speaks with their hands.",
    "Crackles their knuckles.",
    "Strokes their beard/chin thoughtfully.",
    "Sniffs the air frequently.",
    "Winks conspiratorially."
];

const SPEECH_PATTERNS = [
    "Speaks in a whispered hush.",
    "Uses overly flowery language.",
    "Speaks in short, clipped sentences.",
    "Stutters when nervous.",
    "Has a thick, unintelligible accent.",
    "Refers to themselves in the third person.",
    "Speaks very slowly and deliberately.",
    "Laughs inappropriately appearing serious sentences."
];

const KNOWLEDGE_AVAILABLE = [
    "Local geography and landmarks.",
    "Recent town gossip and rumors.",
    "Prices of common goods.",
    "Location of the best tavern.",
    "History of the local ruin.",
    "Names of city council members.",
    "Basic herbal remedies.",
    "Trade routes to the capital."
];

const KNOWLEDGE_SECRET = [
    "The location of a hidden thieves' guild entrance.",
    "The mayor is being blackmailed.",
    "A cult operates in the sewers.",
    "The local priest is a warlock.",
    "There is a buried treasure under the old mill.",
    "A doppleganger has replaced the guard captain.",
    "The merchant guild is smuggling illicit potions.",
    "A dragon is sleeping in the nearby mountain."
];

const BONDS = [
    "Devoted to their sickly sibling.",
    "Secretly in love with the blacksmith's daughter.",
    "Owes a life debt to a paladin.",
    "Spying for a rival kingdom (unwillingly).",
    "Looking for their lost dog.",
    "Member of a secret society.",
    "Estranged from their wealthy family.",
    "Protector of the local orphanage."
];

const ROLEPLAY_CUES = [
    "Speaks slowly",
    "Often looks nervous",
    "Leans in close when speaking",
    "Constantly polishing an object",
    "Avoids direct questions",
    "Laughs at their own jokes",
    "Suspicious of strangers",
    "Overly friendly"
];

const TEMPLATES_BACKSTORY = [
    "Born in {LOC}, {NAME} grew up poor but ambitious. After a chance encounter with a {ROLE}, they decided to pursue a life of adventure. Now, they seek {MOTIVATION} while trying to hide their {FLAW}.",
    "{NAME} was once a respected {ROLE} until a scandal forced them into exile. They now wander the lands, driven by {MOTIVATION}, though their {FLAW} often gets in the way.",
    "Raised by wolves (metaphorically or literally), {NAME} has always felt like an outsider. They became a {ROLE} to fit in, but their true goal is {MOTIVATION}.",
    "A survivor of a great war, {NAME} tries to live a quiet life as a {ROLE}. However, their past haunts them, and they are secretly {MOTIVATION}."
];

const TEMPLATES_PERSONALITY = [
    "**Motivations:** Primarily driven by {MOTIVATION}. They will stop at nothing to achieve this.\n\n**Morals:** generally {ALIGNMENT}, but willing to bend the rules if necessary.\n\n**Personality:** {TRAIT} with a tendency to be {FLAW}.\n\n**Flaws:** Their biggest weakness is being {FLAW}.",
    "**Motivations:** Wants nothing more than {MOTIVATION}.\n\n**Morals:** Strictly {ALIGNMENT}.\n\n**Personality:** Known for being {TRAIT}.\n\n**Flaws:** Struggles deeply with being {FLAW}."
];

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export const proceduralNpcService = {
    generate(context: Partial<NpcPersona> = {}): NpcPersona {
        const name = context.name && context.name !== 'New NPC' ? context.name : "Unnamed NPC"; // Simple fallback, name gen is complex
        const race = context.race || pick(RACES);
        const role = context.role || pick(ROLES);
        const alignment = context.alignment || pick(ALIGNMENTS);
        const motivation = pick(MOTIVATIONS);
        const flaw = pick(FLAWS);
        const trait = pick(TRAITS);

        // Simple string interpolation for templates
        const fillTemplate = (template: string) => {
            return template
                .replace(/{NAME}/g, name)
                .replace(/{RACE}/g, race)
                .replace(/{ROLE}/g, role)
                .replace(/{ALIGNMENT}/g, alignment)
                .replace(/{MOTIVATION}/g, motivation.toLowerCase().replace('.', ''))
                .replace(/{FLAW}/g, flaw.toLowerCase().replace('.', ''))
                .replace(/{TRAIT}/g, trait.toLowerCase().replace('.', ''))
                .replace(/{LOC}/g, "a small village");
        };

        return {
            name: name,
            race: race,
            role: role,
            alignment: alignment,
            appearance: pick(APPEARANCES),
            motivations: motivation,
            personalityTraits: trait,
            flaws: flaw,
            catchphrase: pick(CATCHPHRASES),
            mannerisms: pick(MANNERISMS),
            speechPatterns: pick(SPEECH_PATTERNS),
            knowledgeAvailable: pick(KNOWLEDGE_AVAILABLE),
            knowledgeSecret: pick(KNOWLEDGE_SECRET),
            bonds: pick(BONDS),
            roleplayingCues: pickMultiple(ROLEPLAY_CUES, 2),
            backstory: fillTemplate(pick(TEMPLATES_BACKSTORY)),
            detailedPersonality: fillTemplate(pick(TEMPLATES_PERSONALITY))
        };
    }
};
