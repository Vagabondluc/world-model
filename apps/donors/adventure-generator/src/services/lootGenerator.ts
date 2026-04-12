
import { ImprovedAdventureAPIService } from './aiService';
import { CampaignConfiguration } from '../types/campaign';
import { Loot, LootSchema, LootDials, RawLootResult } from '../schemas/loot';
import { CONFIG } from '../data/constants';
import { buildImprovedSystemPrompt } from './promptBuilder';
import { LootEngine } from './loot/lootEngine';

// Mapping helper to convert legacy params to new Dials
function mapParamsToDials(
    campaignConfig: CampaignConfiguration,
    totalXp: number,
    monsterCount: number,
    monsterTypes: string
): LootDials {
    // Heuristic: XP -> Loot Value
    let lootValue: LootDials['lootValue'] = 'standard';
    if (totalXp < 500) lootValue = 'poor';
    else if (totalXp > 5000) lootValue = 'rich';
    else if (totalXp > 15000) lootValue = 'hoard';

    const partyLevel = Math.max(1, Math.floor(Math.sqrt(totalXp / 100))); // Rough estimate if not in config

    return {
        partyLevel: partyLevel,
        lootValue: lootValue,
        magicDensity: 0.3, // Default magic density
        rarityBias: 'balanced',
        tone: 'heroic',
        origin: monsterTypes || 'dungeon',
        sentienceChance: 0.02,
        quirkChance: 0.2,
        cursedChance: 0.05,
        consumableRatio: 0.5,
        storyWeight: 0.3,
        seed: Date.now() // or pass a seed if available
    };
}

export async function generateLoot(
    apiService: ImprovedAdventureAPIService,
    campaignConfig: CampaignConfiguration,
    totalXp: number,
    monsterCount: number,
    monsterTypes: string
): Promise<Loot> {

    // 1. ENGINE PHASE (Deterministic Math)
    const dials = mapParamsToDials(campaignConfig, totalXp, monsterCount, monsterTypes);
    const rawResult: RawLootResult = LootEngine.generate(dials);

    // 2. AI FLAVORING PHASE (Narrative Wrapper)
    const systemInstruction = buildImprovedSystemPrompt(campaignConfig);

    // Construct a specific prompt that enforces the Engine's stats
    const prompt = `
    You are a loot flavor generator. I have generated a raw set of D&D 5e loot stats.
    Your job is to rename the generic items to be evocative and describe their appearance based on the origin: "${dials.origin}".
    
    STRICT RULES:
    - Do NOT change the item type, rarity, or magical status.
    - Do NOT change the coin counts.
    - If 'quirks' contains 'quirk_marker', invent a minor sensory quirk.
    - If 'quirks' contains 'cursed_marker', invent a subtle curse but keep the item usable.
    - If 'hooks' is true, generate a sentence linking one item to a wider mystery.

    RAW INPUT:
    ${JSON.stringify(rawResult, null, 2)}
    `;

    // We rely on the AI to return the structure matching the final LootSchema
    // The Schema ensures the types match, but the prompt ensures the VALUES match the engine.
    const loot = await apiService.generateStructuredContent<Loot>(
        prompt,
        LootSchema,
        campaignConfig.aiModel || CONFIG.AI_MODEL,
        systemInstruction
    );

    // Sanity check: Override coins with Engine truth to be 100% safe against AI hallucinations
    loot.gold = rawResult.gold;

    return loot;
}
