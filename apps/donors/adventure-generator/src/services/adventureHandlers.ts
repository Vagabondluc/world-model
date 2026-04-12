import { z } from 'zod';
import { ImprovedAdventureAPIService } from './aiService';
import { buildImprovedSystemPrompt, buildImprovedContextBlock } from './promptBuilder';
import { serializeAdventureBlueprint } from '../utils/workflowHelpers';
import { CONFIG } from '../data/appConfig';
import { CREATURE_ROLES } from '../data/monsterRules';
import {
    SceneDetails, SceneDetailsSchema,
    LocationDetails, DungeonDetailsSchema, BattlemapDetailsSchema, SettlementDetailsSchema, SpecialLocationDetailsSchema,
    NpcDetails, MinorNpcDetailsSchema, MajorNpcDetailsSchema, CreatureDetailsSchema,
    FactionDetails, FactionDetailsSchema,
    GeneratedAdventureSchema
} from '../schemas';
import { CampaignConfiguration } from '../types/campaign';
import { CompendiumEntry } from '../types/compendium';
import { getTableEntry } from '../data/legacyTables';
import { SimpleAdventureDetails } from '../types/generator';
import { parseAndValidateSimpleAdventures } from '../utils/validators';

export const generateHooks = async (
    apiService: ImprovedAdventureAPIService,
    config: CampaignConfiguration,
    context: string
) => {
    const systemInstruction = buildImprovedSystemPrompt(config);
    const contextBlock = buildImprovedContextBlock(config, context);
    const matrix = Array.from({ length: 5 }, () => Array.from({ length: 3 }, () => Math.floor(Math.random() * 100) + 1));
    const premises = matrix.map(row => `${getTableEntry(row[0]).action} ${getTableEntry(row[1]).mcGuffin} ${getTableEntry(row[2]).subject}`);
    
    const schema = z.array(
        z.object({ origin: z.string(), positioning: z.string(), stakes: z.string() })
    ) as z.ZodType<SimpleAdventureDetails[]>;
    const prompt = `${contextBlock}Generate 5 adventure details for the following premises:\n${premises.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
    
    const details = await apiService.generateStructuredContent<SimpleAdventureDetails[]>(prompt, schema, config.aiModel || CONFIG.AI_MODEL, systemInstruction);
    const validated = parseAndValidateSimpleAdventures(details, premises.length);
    
    return {
        adventures: premises.map((p, i) => ({ type: 'simple' as const, premise: p, ...validated[i] })),
        matrix
    };
};

export const developScene = async (
    apiService: ImprovedAdventureAPIService, 
    entry: CompendiumEntry,
    campaignConfig: CampaignConfiguration,
    context: string,
    currentSceneContext: string
): Promise<SceneDetails> => {
    const blueprint = serializeAdventureBlueprint({ type: 'scene', id: entry.id });
    const systemInstruction = buildImprovedSystemPrompt(campaignConfig);
    const prompt = `${buildImprovedContextBlock(campaignConfig, context)}${blueprint}Develop the scene: ${entry.title}. Context: ${currentSceneContext}`;
    return await apiService.generateStructuredContent<SceneDetails>(prompt, SceneDetailsSchema, campaignConfig.aiModel || CONFIG.AI_MODEL, systemInstruction);
};

export const developLocation = async (
    apiService: ImprovedAdventureAPIService, 
    entry: CompendiumEntry,
    campaignConfig: CampaignConfiguration,
    context: string,
    currentLocationContext: string
): Promise<LocationDetails> => {
    const locationType = entry.tags[0] || 'Special Location';
    const schema = locationType === 'Dungeon' ? DungeonDetailsSchema : 
                   locationType === 'Battlemap' ? BattlemapDetailsSchema : 
                   locationType === 'Settlement' ? SettlementDetailsSchema : SpecialLocationDetailsSchema;

    const blueprint = serializeAdventureBlueprint({ type: 'location', id: entry.id });
    const systemInstruction = buildImprovedSystemPrompt(campaignConfig);
    const prompt = `${buildImprovedContextBlock(campaignConfig, context)}${blueprint}Develop the ${locationType}: ${entry.title}. Context: ${currentLocationContext}`;
    return await apiService.generateStructuredContent<LocationDetails>(prompt, schema, campaignConfig.aiModel || CONFIG.AI_MODEL, systemInstruction);
};

export const developNpc = async (
    apiService: ImprovedAdventureAPIService, 
    entry: CompendiumEntry,
    campaignConfig: CampaignConfiguration,
    context: string,
    currentNpcContext: string, 
    options?: { creatureRole?: string }
): Promise<NpcDetails> => {
    const npcType = entry.tags[0] || 'Minor';
    const schema = npcType === 'Creature' ? CreatureDetailsSchema : 
                   npcType === 'Major' ? MajorNpcDetailsSchema : MinorNpcDetailsSchema;

    const blueprint = serializeAdventureBlueprint({ type: 'npc', id: entry.id });
    const systemInstruction = buildImprovedSystemPrompt(campaignConfig);
    const roleKey = options?.creatureRole || '';
    const prompt = `${buildImprovedContextBlock(campaignConfig, context)}${blueprint}Develop the ${npcType}: ${entry.title}. ${roleKey ? `Role: ${roleKey}` : ''} Context: ${currentNpcContext}`;
    return await apiService.generateStructuredContent<NpcDetails>(prompt, schema, campaignConfig.aiModel || CONFIG.AI_MODEL, systemInstruction);
};

export const developFaction = async (
    apiService: ImprovedAdventureAPIService, 
    entry: CompendiumEntry,
    campaignConfig: CampaignConfiguration,
    context: string,
    currentFactionContext: string
): Promise<FactionDetails> => {
    const blueprint = serializeAdventureBlueprint({ type: 'faction', id: entry.id });
    const systemInstruction = buildImprovedSystemPrompt(campaignConfig);
    const prompt = `${buildImprovedContextBlock(campaignConfig, context)}${blueprint}Develop the faction: ${entry.title}. Context: ${currentFactionContext}`;
    return await apiService.generateStructuredContent<FactionDetails>(prompt, FactionDetailsSchema, campaignConfig.aiModel || CONFIG.AI_MODEL, systemInstruction);
};
