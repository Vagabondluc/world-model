import { z } from 'zod';
import { SavedMonsterSchema } from './npc';
import { BiomeDataSchema } from './location';

export const CampaignConfigurationSchema = z.object({
    language: z.string().optional(),
    genre: z.string().optional(),
    ruleset: z.string().optional(),
    crRange: z.string().optional(),
    tone: z.string().optional(),
    complexity: z.string().optional(),
    artStyle: z.string().optional(),
    narrativeTechniques: z.array(z.string()).optional(),
    narrativeIntegration: z.string().optional(),
    worldInformation: z.string().optional(),
    playerInformation: z.string().optional(),
    npcInformation: z.string().optional(),
    worldName: z.string().optional(),
    theme: z.enum(['parchment', 'dark', 'high-contrast']).optional(),

    apiProvider: z.enum([
        'gemini',
        'ollama',
        'claude',
        'openai',
        'lm-studio',
        'grok',
        'zai',
        'perplexity',
        'openrouter',
        'dummy'
    ]).optional(),
    aiModel: z.string().optional(),

    apiKey: z.string().optional(),
    baseUrl: z.string().optional(),
    apiVersion: z.string().optional(),
    organizationId: z.string().optional(),

    ollamaBaseUrl: z.string().optional(),
    ollamaModel: z.string().optional(),

    aiCostPer1kInput: z.number().optional(),
    aiCostPer1kOutput: z.number().optional(),

    enabledDatabases: z.array(z.string()).optional(),
    enabledContentSources: z.array(z.string()).optional(),
    crCalculationMethod: z.enum(['dmg', 'alternate']).optional(),
}).strict();

export const CampaignStateExportSchema = z.object({
    config: CampaignConfigurationSchema,
    activeView: z.string(),
    bestiary: z.array(SavedMonsterSchema).optional().default([]),
    biomeData: BiomeDataSchema.optional().default({}),
});
