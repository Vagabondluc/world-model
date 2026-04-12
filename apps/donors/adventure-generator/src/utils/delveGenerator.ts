import { Delve, DelveSceneNode, DelveTheme, DelveRoomType, MechanicsPackage, DelveConcept, MonsterTier } from '../types/delve';
import { MONSTER_TABLES } from '../data/delve/monsterTables';
import { ROOM_TEMPLATES } from '../data/delve/roomTemplates';
import { ATMOSPHERE_DETAILS } from '../data/delve/atmosphere';
import { generateId } from './helpers';
import { SeededRNG } from './seededRng';
import { getTrapDetails } from './delve/trapGenerator';

export function getDifficultyTier(level: number): MonsterTier {
    if (level <= 4) return 'tier1';
    if (level <= 10) return 'tier2';
    if (level <= 16) return 'tier3';
    return 'tier4';
}

export function generateDelveSceneNode(type: DelveRoomType, theme: DelveTheme, level: number, tier: MonsterTier, rng: SeededRNG, extraTags: string[] = []): DelveSceneNode {
    const themeTemplates = ROOM_TEMPLATES[theme][type];
    const template = themeTemplates[Math.floor(rng.nextFloat() * themeTemplates.length)];
    const encounterSet = MONSTER_TABLES[theme][tier];
    const atmos = ATMOSPHERE_DETAILS[theme];
    const sensoryDetail = atmos[Math.floor(rng.nextFloat() * atmos.length)];

    const mechanics: MechanicsPackage = {};
    if (type === 'guardian') {
        const minions = encounterSet.minions;
        const monster = minions[Math.floor(rng.nextFloat() * minions.length)];
        mechanics.encounter = { monsters: [`${Math.max(1, Math.floor(rng.nextFloat() * 3) + 1)}x ${monster}`], difficulty: 'Medium', xp: level * 100 };
    } else if (type === 'climax') {
        const boss = encounterSet.boss[Math.floor(rng.nextFloat() * encounterSet.boss.length)];
        const minion = encounterSet.minions[Math.floor(rng.nextFloat() * encounterSet.minions.length)];
        mechanics.encounter = { monsters: [`1x ${boss}`, `${Math.max(2, Math.floor(rng.nextFloat() * 4) + 2)}x ${minion}`], difficulty: 'Hard/Deadly', xp: level * 500 };
    }

    if (type === 'trick' || (type === 'guardian' && rng.nextFloat() > 0.6)) {
        mechanics.trap = getTrapDetails(theme, level, rng);
    }

    if (type === 'reward') {
        const gold = Math.floor(level * 100 * (rng.nextFloat() + 0.5));
        const items = ["Art objects worth 50gp"];
        if (level >= 5) items.push("Uncommon Magic Item");
        if (level >= 11) items.push("Rare Magic Item");
        mechanics.treasure = [`${gold} gp`, ...items];
    }

    return {
        id: generateId(), stage: type, title: template.title, narrative: template.description,
        sensory: { sound: sensoryDetail, smell: "The air is thick with the scent of damp earth and decay.", feel: "A chill draft seems to follow you." },
        mechanics, features: template.features, emotionalBeat: "Anticipation", thematicTags: [theme, type, ...extraTags], continuityRefs: [],
        nodeType: 'standard'
    };
}

export function generateDelveTitle(theme: DelveTheme, lastRoomTitleRaw: string): string {
    const lastRoomTitle = lastRoomTitleRaw.includes(': ') ? lastRoomTitleRaw.substring(lastRoomTitleRaw.indexOf(':') + 2) : lastRoomTitleRaw;
    const themeTitle = theme.charAt(0).toUpperCase() + theme.slice(1);
    let match = lastRoomTitle.match(/^The (.*?)'s .*$/i);
    if (match && match[1]) return `The ${themeTitle} of the ${match[1]}`;
    match = lastRoomTitle.match(/^The .* of (the .*)$/i);
    if (match && match[1]) return `The ${themeTitle} of ${match[1]}`;
    let subject = lastRoomTitle;
    if (subject.startsWith("The ")) subject = subject.substring(4);
    return `The ${themeTitle} of ${subject}`;
}

export function generateDelve(conceptInput: DelveConcept | DelveTheme, level: number, seed?: string): Delve {
    const finalSeed = seed || crypto.randomUUID();
    const rng = new SeededRNG(finalSeed);
    let theme: DelveTheme;
    let concept: DelveConcept | undefined;
    let extraTags: string[] = [];
    let titleOverride: string | undefined;

    if (typeof conceptInput === 'string') { theme = conceptInput; }
    else { theme = conceptInput.theme; concept = conceptInput; extraTags = conceptInput.tags; titleOverride = conceptInput.title; }

    const roomTypes: DelveRoomType[] = ['guardian', 'puzzle', 'trick', 'climax', 'reward'];
    const tier = getDifficultyTier(level);
    const rooms = roomTypes.map((type, index) => {
        const node = generateDelveSceneNode(type, theme, level, tier, rng, extraTags);
        node.title = `Room ${index + 1}: ${node.title}`;
        return node;
    });

    return {
        id: generateId(), title: titleOverride || generateDelveTitle(theme, rooms[rooms.length - 1].title),
        theme, level, rooms, createdAt: new Date(), seed: finalSeed, concept
    };
}