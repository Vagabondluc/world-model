
import { JobPost, JobContext, JobArchetype, ComplicationPack, RewardPack, JobSlots, JobUrgency, JobDifficulty } from '../types/jobGenerator';
import { JOB_ARCHETYPES, COMPLICATION_PACKS, REWARD_PACKS, ENEMY_TABLE } from '../data/jobData';
import { generateId } from './helpers';

// --- Helper Functions ---
function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getWeightedRandomItem<T extends { weight: number }>(items: T[]): T {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    for (const item of items) {
        random -= item.weight;
        if (random <= 0) return item;
    }
    return items[0];
}

function fillTemplate(template: string, slots: JobSlots): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => slots[key] || `[${key}]`);
}

function clampDifficulty(score: number): JobDifficulty {
    const clampedScore = Math.max(1, Math.min(5, Math.round(score)));
    const difficulties: JobDifficulty[] = ["trivial", "easy", "standard", "hard", "deadly"];
    return difficulties[clampedScore - 1];
}

function determineUrgency(archetype: JobArchetype): JobUrgency {
    if (!archetype.urgencyRange) return 'normal';
    const [min, max] = archetype.urgencyRange;
    const roll = Math.floor(Math.random() * (max - min + 1)) + min;
    const urgencies: JobUrgency[] = ["low", "normal", "high", "critical"];
    return urgencies[roll - 1] || 'normal';
}

function generateTimeLimit(urgency: JobUrgency): string {
    switch (urgency) {
        case 'critical': return "within 24 hours";
        case 'high': return "within 3 days";
        case 'normal': return "within a tenday";
        case 'low': return "whenever possible";
        default: return "soon";
    }
}

function generateConsequences(urgency: JobUrgency, slots: JobSlots): string[] {
    const consequences = [];
    if (urgency === 'critical' || urgency === 'high') {
        consequences.push(`The ${slots.enemyType} threat grows stronger.`);
        consequences.push(`${slots.clientName} suffers a great loss.`);
    } else {
        consequences.push(`The reward is rescinded.`);
    }
    if (slots.clientFactionName && slots.clientFactionName !== "local authorities") {
        consequences.push(`Reputation with ${slots.clientFactionName} decreases.`);
    }
    return consequences;
}

// --- Main Generator ---
export function generateJobPost(ctx: JobContext): JobPost {
    const archetype = pickArchetype(ctx);
    const urgency = determineUrgency(archetype);
    
    // Add dynamic slot logic
    const slots = resolveSlots(ctx, archetype, urgency);
    
    const title = fillTemplate(getRandomItem(archetype.titleTemplates), slots);
    const summary = fillTemplate(getRandomItem(archetype.summaryTemplates), slots);
    const details = fillTemplate(getRandomItem(archetype.detailsTemplates), slots);
    
    const complications = pickComplications(ctx, archetype, slots);
    const rewards = pickRewards(ctx, archetype, slots);

    const difficulty = estimateDifficulty(ctx, complications.length);
    const tags = [...new Set([...archetype.tags, ctx.biome || 'urban', difficulty])];
    
    // Advanced fields
    const timeLimit = generateTimeLimit(urgency);
    const factionImpact = slots.clientFactionName && slots.clientFactionName !== "local authorities" 
        ? [`Favor with ${slots.clientFactionName}`] 
        : [];
    const failureConsequences = generateConsequences(urgency, slots);

    return {
        id: generateId(),
        title,
        summary,
        details,
        complications,
        rewards,
        postedBy: slots.clientId,
        locationId: slots.locationId,
        tags,
        difficulty,
        urgency,
        postedAt: Date.now(),
        // New amplified fields
        timeLimit,
        factionImpact,
        failureConsequences,
        recommendedLevel: ctx.partyLevel || 1,
        origin: slots.origin,
        destination: slots.destination,
        worldContext: `${ctx.regionName || 'The Region'} - ${ctx.season || 'Unknown Season'}`
    };
}

// --- Sub-Logics ---

export function scoreArchetypeWeight(archetype: JobArchetype, ctx: JobContext): number {
    const baseWeight = archetype.weight ?? 1;
    if (!ctx.biome) return Math.max(0.1, baseWeight);

    const affinity = archetype.biomeAffinity || [];
    if (affinity.length === 0) return Math.max(0.1, baseWeight);

    const matchesBiome = affinity.includes(ctx.biome);
    const multiplier = matchesBiome ? 1.75 : 0.5;
    return Math.max(0.1, baseWeight * multiplier);
}

function pickArchetype(ctx: JobContext): JobArchetype {
    const validArchetypes = JOB_ARCHETYPES.filter(arch => {
        if (ctx.dangerRating) {
            if (arch.minDanger && ctx.dangerRating < arch.minDanger) return false;
            if (arch.maxDanger && ctx.dangerRating > arch.maxDanger) return false;
        }
        return true;
    });
    const pool = validArchetypes.length > 0 ? validArchetypes : JOB_ARCHETYPES;
    const weighted = pool.map((archetype) => ({
        ...archetype,
        weight: scoreArchetypeWeight(archetype, ctx)
    }));
    return getWeightedRandomItem(weighted);
}

function resolveSlots(ctx: JobContext, archetype: JobArchetype, urgency: JobUrgency): JobSlots {
    const npc = ctx.npcs && ctx.npcs.length > 0 ? getRandomItem(ctx.npcs) : null;
    const faction = ctx.factions && ctx.factions.length > 0 ? getRandomItem(ctx.factions) : null;
    
    let clientName = "a wealthy patron";
    let clientType = "merchant";
    let clientFactionName = "local authorities";
    let clientId = "";

    if (npc) {
        clientName = npc.name;
        clientType = npc.role || "citizen";
        clientId = npc.id;
        if (npc.factionId && ctx.factions) {
            const f = ctx.factions.find(f => f.id === npc.factionId);
            if (f) clientFactionName = f.name;
        }
    } else if (faction) {
        clientName = `A representative of ${faction.name}`;
        clientType = "official";
        clientFactionName = faction.name;
        clientId = faction.id;
    }

    const biome = ctx.biome || 'default';
    const enemyType = getRandomItem(ENEMY_TABLE[biome] || ENEMY_TABLE.default);
    
    const timeLimitString = generateTimeLimit(urgency);

    return {
        clientName,
        clientType,
        clientFactionName,
        clientId,
        locationId: "",
        origin: ctx.settlementType || "the town",
        destination: "the next settlement",
        enemyType,
        enemyTypePlural: enemyType.endsWith('s') ? enemyType : enemyType + "s",
        locationName: "the Ruins of Old",
        biomeSummary: ctx.biome || "wilderness",
        threatSummary: `sightings of ${enemyType}`,
        threatDetail: `${enemyType} have been spotted`,
        departureTime: urgency === 'critical' ? "immediately" : "at dawn",
        item: "a family heirloom",
        target: "a person of interest",
        weirdEvent: "strange lights in the sky",
        importantNPC: "the Guildmaster",
        clientBusinessName: "The Gilded Tankard",
        regionName: ctx.regionName || "the area",
        timeLimit: timeLimitString,
    };
}

function pickComplications(ctx: JobContext, archetype: JobArchetype, slots: JobSlots): string[] {
    const pool = COMPLICATION_PACKS.filter(p => archetype.complicationPools.includes(p.id));
    if (pool.length === 0) return [];
    
    const count = Math.random() > 0.7 ? 2 : 1;
    const selected: string[] = [];
    
    for (let i = 0; i < count; i++) {
        const pack = getRandomItem(pool);
        selected.push(fillTemplate(getRandomItem(pack.templates), slots));
    }
    return selected;
}

function pickRewards(ctx: JobContext, archetype: JobArchetype, slots: JobSlots): string[] {
    const count = Math.random() > 0.8 ? 2 : 1;
    const selected: string[] = [];
    
    for (let i = 0; i < count; i++) {
        const pack = getWeightedRandomItem(REWARD_PACKS);
        
        const baseGold = pack.baseGold || 10;
        const level = ctx.partyLevel || 1;
        const scaledGold = baseGold * level * (Math.random() * 0.4 + 0.8);
        const slotsWithGold: JobSlots = { ...slots, goldAmount: Math.floor(scaledGold).toString() };
        
        selected.push(fillTemplate(getRandomItem(pack.templates), slotsWithGold));
    }
    return selected;
}

function estimateDifficulty(ctx: JobContext, complicationCount: number): JobDifficulty {
  let score = (ctx.dangerRating ?? 3);
  if ((ctx.partySize ?? 4) <= 3) score += 1;
  if ((ctx.partyLevel ?? 1) >= 7) score -= 1;
  score += complicationCount >= 2 ? 1 : 0;
  return clampDifficulty(score);
}
