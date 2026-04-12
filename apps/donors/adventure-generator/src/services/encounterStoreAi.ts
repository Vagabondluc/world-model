import { z } from 'zod';
import { CONFIG } from '../data/constants';
import { ImprovedAdventureAPIService } from './aiService';
import { buildImprovedContextBlock, buildImprovedSystemPrompt } from './promptBuilder';
import { useCampaignStore } from '../stores/campaignStore';

type EncounterInput = {
    title?: string;
    level?: number;
};

export const generateEncounterResult = async <TResult>(
    input: EncounterInput,
    resultSchema: z.ZodType<TResult>,
    encounterLabel: string
): Promise<TResult> => {
    const apiService = new ImprovedAdventureAPIService();
    const campaignConfig = useCampaignStore.getState().config;
    const systemInstruction = buildImprovedSystemPrompt(campaignConfig);
    const contextBlock = buildImprovedContextBlock(campaignConfig, '');

    const prompt = `${contextBlock}You are a veteran Dungeon Master. Create a concise, table-ready encounter output.

Encounter Type: ${encounterLabel}
Title: ${input.title || 'Untitled Encounter'}
Party Level: ${input.level ?? 1}

Return a JSON object that matches the required schema. The description should be vivid, practical, and immediately usable at the table.`;

    return apiService.generateStructuredContent<TResult>(
        prompt,
        resultSchema,
        campaignConfig.aiModel || CONFIG.AI_MODEL,
        systemInstruction
    );
};
