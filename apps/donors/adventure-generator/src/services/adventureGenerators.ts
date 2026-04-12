
import { z } from "zod";
import { ImprovedAdventureAPIService } from '../services/aiService';
import { CampaignConfiguration } from '../types/campaign';
import { SimpleAdventureDetails } from '../types/generator';
import { GeneratedAdventure } from '../schemas/adventure';
import { AdventureOutline, AdventureOutlineSchema } from '../schemas/adventure';
import { buildImprovedSystemPrompt, buildImprovedContextBlock } from '../services/promptBuilder';
import { getTableEntry } from '../data/legacyTables';
import { parseAndValidateSimpleAdventures } from '../utils/validators';
import { buildSimpleOutlinePrompt, buildFullOutlinePrompt, type FullOutlinePromptParams } from '../utils/outlineHelpers';
import { CONFIG } from '../data/constants';

export const generateHooksStrategy = async (
    apiService: ImprovedAdventureAPIService,
    campaignConfig: CampaignConfiguration,
    context: string
): Promise<{ adventures: GeneratedAdventure[], matrix: number[][] }> => {
    const systemInstruction = buildImprovedSystemPrompt(campaignConfig);
    const contextBlock = buildImprovedContextBlock(campaignConfig, context);
    const newMatrix = Array.from({ length: 5 }, () => Array.from({ length: 3 }, () => Math.floor(Math.random() * 100) + 1));
    const premises = newMatrix.map(row => `${getTableEntry(row[0]).action} ${getTableEntry(row[1]).mcGuffin} ${getTableEntry(row[2]).subject}`);
    
    const schema = z.array(
        z.object({ origin: z.string(), positioning: z.string(), stakes: z.string() })
    ) as z.ZodType<SimpleAdventureDetails[]>;
    const prompt = `${contextBlock}You are a creative Dungeon Master...For each premise below, provide a compelling "Origin of the Problem", explain the "Unique Positioning" (why this specific adventuring party is suited for the task), and detail the "Stakes" (what is at risk if they fail).\n\nPremises:\n${premises.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
    
    const detailsArray = await apiService.generateStructuredContent<SimpleAdventureDetails[]>(prompt, schema, campaignConfig.aiModel || CONFIG.AI_MODEL, systemInstruction);

    const validatedArray = parseAndValidateSimpleAdventures(detailsArray, premises.length);
    const fullAdventures: GeneratedAdventure[] = premises.map((premise, index) => ({ type: 'simple', premise, ...validatedArray[index] }));
    
    return { adventures: fullAdventures, matrix: newMatrix };
};

export const refineHooksStrategy = async (
    apiService: ImprovedAdventureAPIService,
    campaignConfig: CampaignConfiguration,
    context: string,
    matrix: number[][]
): Promise<GeneratedAdventure[]> => {
    const premises = matrix.map(row => `${getTableEntry(row[0]).action} ${getTableEntry(row[1]).mcGuffin} ${getTableEntry(row[2]).subject}`);
    const systemInstruction = buildImprovedSystemPrompt(campaignConfig);
    const contextBlock = buildImprovedContextBlock(campaignConfig, context);
    const schema = z.array(
        z.object({ origin: z.string(), positioning: z.string(), stakes: z.string() })
    ) as z.ZodType<SimpleAdventureDetails[]>;
    const prompt = `${contextBlock}You are a creative Dungeon Master...For each premise below, provide a compelling "Origin of the Problem", explain the "Unique Positioning" (why this specific adventuring party is suited for the task), and detail the "Stakes" (what is at risk if they fail).\n\nPremises:\n${premises.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;

    const detailsArray = await apiService.generateStructuredContent<SimpleAdventureDetails[]>(prompt, schema, campaignConfig.aiModel || CONFIG.AI_MODEL, systemInstruction);
    const validatedArray = parseAndValidateSimpleAdventures(detailsArray, premises.length);
    return premises.map((premise, index) => ({ type: 'simple', premise, ...validatedArray[index] }));
};

export const generateOutlineStrategy = async (
    apiService: ImprovedAdventureAPIService,
    campaignConfig: CampaignConfiguration,
    context: string,
    hook: GeneratedAdventure
): Promise<AdventureOutline> => {
    const systemInstruction = buildImprovedSystemPrompt(campaignConfig);
    const contextBlock = buildImprovedContextBlock(campaignConfig, context);
    const prompt = `${contextBlock}${buildSimpleOutlinePrompt(hook)}`;
    return await apiService.generateStructuredContent<AdventureOutline>(prompt, AdventureOutlineSchema, campaignConfig.aiModel || CONFIG.AI_MODEL, systemInstruction);
};

export const generateFullOutlineStrategy = async (
    apiService: ImprovedAdventureAPIService,
    campaignConfig: CampaignConfiguration,
    context: string,
    generatorConfig: FullOutlinePromptParams // Passed from store
): Promise<AdventureOutline> => {
    const systemInstruction = buildImprovedSystemPrompt(campaignConfig);
    const contextBlock = buildImprovedContextBlock(campaignConfig, context);
    const prompt = `${contextBlock}${buildFullOutlinePrompt(generatorConfig)}`;
    return await apiService.generateStructuredContent<AdventureOutline>(prompt, AdventureOutlineSchema, campaignConfig.aiModel || CONFIG.AI_MODEL, systemInstruction);
};
