import { ImprovedAdventureAPIService } from './aiService';
import { CampaignConfiguration } from '../types/campaign';
import { EncounterSceneNode, AINarrativeResponseSchema, AINarrativeResponse } from '../schemas';
import { buildImprovedSystemPrompt } from './promptBuilder';
import { CONFIG } from '../data/constants';

/**
 * T-705: Chain-of-Thought for Encounters
 * Generates an AI-enhanced narrative draft for any encounter stage.
 * Includes specific 'thinking' requirements for the Twist stage to ensure narrative impact.
 */
export const generateEncounterAIDraft = async (
    apiService: ImprovedAdventureAPIService,
    campaignConfig: CampaignConfiguration,
    node: EncounterSceneNode,
    locationContext: string,
    factionContext: string[],
    history?: EncounterSceneNode[]
): Promise<AINarrativeResponse> => {
    const systemInstruction = buildImprovedSystemPrompt(campaignConfig);
    
    let stageInstructions = "";
    if (node.stage === 'Twist') {
        stageInstructions = `
### Chain-of-Thought Instruction (Twist Stage)
Before writing the narrative, use the 'thinking' field to reason through the following:
1. Subversion: How does this twist specifically subvert the party's current momentum or expectations?
2. Emotional Impact: What core emotion should this reveal evoke? (Dread, betrayl, sudden hope, etc.)
3. Logic Check: How does this event connect logically to the encounter's setting and factions?
4. Stakes: How do the immediate stakes change following this reveal?
`;
    } else {
        stageInstructions = `
### Narrative Instruction
Use the 'thinking' field to briefly outline the mood and focus of the scene before writing.
`;
    }

    const historySummary = history && history.length > 0 
        ? history.map(h => `${h.stage}: ${h.narrative}`).join('\n\n') 
        : 'This is the start of the encounter.';

    const prompt = `You are a master storyteller for a Dungeons & Dragons game. Write an immersive, real-time "read-aloud" scene for the '${node.stage}' stage of an encounter.

**World & Setting Context:**
${locationContext}

**Factions Involved:**
${factionContext.join(', ') || 'None specified'}

**Encounter History So Far:**
${historySummary}

**Procedural Elements for This Stage:**
*   **Core Event:** ${node.narrative}
${node.sensory ? `*   **Atmosphere:** sound: ${node.sensory.sound}, smell: ${node.sensory.smell}, feel: ${node.sensory.feel}` : ''}
*   **Thematic Tags:** ${node.thematicTags.join(', ')}

${stageInstructions}

**Your Task:**
Produce a compelling narrative scene. Write in the second person ("You"), focusing on atmospheric details. Do not use game terms (like "initiative" or "DC") in the 'narrative' field.
`;

    const result = await apiService.generateStructuredContent<AINarrativeResponse>(
        prompt,
        AINarrativeResponseSchema,
        campaignConfig.aiModel || CONFIG.AI_MODEL,
        systemInstruction
    );

    return result;
};

// Legacy compatibility export
export const generateSetupAIDraft = generateEncounterAIDraft;