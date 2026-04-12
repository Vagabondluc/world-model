import { z } from "zod";
import { ImprovedAdventureAPIService } from "./aiService";
import { EncounterCombatant, EncounterData, EncounterDataSchema, EncounterTactic } from "../types/encounter";
import { NpcMannerisms, NpcPersonaSeed } from "../types/npc";
import { useCampaignStore } from "../stores/campaignStore";
import { useAdventureDataStore } from "../stores/adventureDataStore";

export class AiNarrativeService {
    private ai: ImprovedAdventureAPIService;

    constructor() {
        this.ai = new ImprovedAdventureAPIService();
    }

    /**
     * Gathers current campaign and adventure context to ground AI prompts.
     */
    private getContextContent(): string {
        const campaign = useCampaignStore.getState().config;
        const adventure = useAdventureDataStore.getState();

        let context = "--- CURRENT CAMPAIGN CONTEXT ---\n";

        if (campaign.crRange) context += `Recommended CR Range: ${campaign.crRange}\n`;
        if (campaign.genre) context += `Genre: ${campaign.genre}\n`;
        if (campaign.worldName) context += `World: ${campaign.worldName}\n`;

        if (adventure.selectedHook) {
            context += `Active Adventure Hook: ${adventure.selectedHook.type === 'simple' ? adventure.selectedHook.premise : adventure.selectedHook.title}\n`;
        }

        context += "--------------------------------\n";
        return context;
    }

    /**
     * Generic fast-fill that takes a custom schema.
     */
    async fastFillGeneric<T>(
        prompt: string,
        schema: z.ZodType<T>,
        systemInstruction: string = "You are a creative D&D assistant."
    ): Promise<T> {
        const contextAwarePrompt = `${this.getContextContent()}\n${prompt}`;

        try {
            const result = await this.ai.generateStructuredContent(
                contextAwarePrompt,
                schema,
                "gemini-1.5-flash",
                systemInstruction
            );
            return result;
        } catch (error) {
            console.error("Fast-Fill Generic Failed", error);
            throw error;
        }
    }

    async fastFillEncounter(currentData: Partial<EncounterData>): Promise<EncounterData> {
        // ... (elided for brevity but kept in original)
        const prompt = `
        You are an expert D&D Adventure Writer.
        Please help me flesh out an encounter based on the following initial ideas:

        Title: ${currentData.title || "Unknown"}
        Goal: ${currentData.goal || "Unknown"}

        Generate a complete, rich encounter design including:
        - A sensory description (sights, sounds, smells).
        - Environmental modifiers (e.g., slippery floor, low light) with valid icons ('info', 'attack', 'defense', 'check').
        - Challenge steps (skill checks) with icons.
        - Opponents (monsters/NPCs) with icons.
        - Tactics (how they behave) with icons.
        - Outcomes (Win/Lose states) with icons.
        - XP Rewards breakdown with icons.

        Be creative, evocative, and tactical. Ensure the generation feels grounded in the provided campaign context.
        `;

        return this.fastFillGeneric(prompt, EncounterDataSchema);
    }

    async generateNpcPersona(traits: Record<string, string>): Promise<NpcPersonaSeed> {
        const prompt = `
        Generate a rapid NPC persona based on these initial traits:
        Traits: ${JSON.stringify(traits)}

        Provide:
        - A unique Archetype.
        - A specific Quirk.
        - A defining Flaw.
        - A primary Motivation.
        `;

        const schema = z.object({
            archetype: z.string(),
            quirk: z.string(),
            flaw: z.string(),
            motivation: z.string(),
        });

        return this.fastFillGeneric(prompt, schema as z.ZodType<NpcPersonaSeed>);
    }

    async generateNpcMannerisms(traits: NpcPersonaSeed): Promise<NpcMannerisms> {
        const prompt = `
        Generate voice and mannerisms for an NPC with the following persona:
        Persona: ${JSON.stringify(traits)}

        Provide:
        - Voice description (tone, pitch, accent).
        - Key phrases or verbal tics.
        - Physical mannerisms (gestures, posture).
        `;

        const schema = z.object({
            voice: z.string(),
            phrases: z.array(z.string()),
            mannerisms: z.string(),
        });

        return this.fastFillGeneric(prompt, schema as z.ZodType<NpcMannerisms>);
    }

    async generateTacticalBehavior(combatants: EncounterCombatant[], environment: string): Promise<{ tactics: EncounterTactic[] }> {
        const prompt = `
        As a tactical combat expert, generate combat behaviors for these entities:
        Entities: ${JSON.stringify(combatants)}
        Environment: ${environment}

        For each entity type, provide:
        - A specific Tactical Role (e.g. Scrimisher, Heavy Hitter, Controller).
        - A Priority Target (e.g. "Squishy spellcasters", "Frontline fighters").
        - A Signature Move (1-2 sentences of tactical logic).
        `;

        const schema = z.object({
            tactics: z.array(z.object({
                name: z.string(),
                role: z.string(),
                priority: z.string(),
                behavior: z.string()
            }))
        });

        return this.fastFillGeneric(prompt, schema as z.ZodType<{ tactics: EncounterTactic[] }>);
    }
}
