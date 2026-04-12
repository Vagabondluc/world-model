// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AiNarrativeService } from '../services/aiNarrativeService';
import { ImprovedAdventureAPIService } from '../services/aiService';
import { z } from 'zod';

// Mock the API Service
const { mockGenerateStructuredContent } = vi.hoisted(() => {
    return { mockGenerateStructuredContent: vi.fn() }
})

vi.mock('../services/aiService', () => {
    return {
        ImprovedAdventureAPIService: vi.fn(function () {
            return {
                generateStructuredContent: mockGenerateStructuredContent
            };
        })
    };
});

// Mock the Stores
const mockCampaignState = {
    config: {
        crRange: "1-4",
        genre: "Grimdark",
        worldName: "Shadowfell"
    }
};

const mockAdventureState = {
    selectedHook: {
        type: 'simple',
        premise: "A haunted castle."
    }
};

vi.mock('../stores/campaignStore', () => ({
    useCampaignStore: {
        getState: () => mockCampaignState
    }
}));

vi.mock('../stores/adventureDataStore', () => ({
    useAdventureDataStore: {
        getState: () => mockAdventureState
    }
}));

describe('AiNarrativeService', () => {
    let service: AiNarrativeService;
    let mockApiService: any;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new AiNarrativeService();
        // Access the mocked instance
        mockApiService = (service as any).ai;
    });

    describe('fastFillGeneric', () => {
        it('should inject campaign and adventure context into the prompt', async () => {
            const prompt = "Generate a goblin.";
            const schema = z.object({ name: z.string() });
            const mockResult = { name: "Snarg" };

            mockApiService.generateStructuredContent.mockResolvedValue(mockResult);

            const result = await service.fastFillGeneric(prompt, schema);

            expect(mockApiService.generateStructuredContent).toHaveBeenCalledTimes(1);
            const callArgs = mockApiService.generateStructuredContent.mock.calls[0];
            const fullPrompt = callArgs[0];

            // Verify Context Injection
            expect(fullPrompt).toContain("--- CURRENT CAMPAIGN CONTEXT ---");
            expect(fullPrompt).toContain("Recommended CR Range: 1-4");
            expect(fullPrompt).toContain("Genre: Grimdark");
            expect(fullPrompt).toContain("World: Shadowfell");
            expect(fullPrompt).toContain("Active Adventure Hook: A haunted castle.");

            // Verify User Prompt
            expect(fullPrompt).toContain(prompt);

            expect(result).toEqual(mockResult);
        });
    });

    describe('generateNpcPersona', () => {
        it('should generate persona with specific traits', async () => {
            const traits = { race: "Elf", class: "Wizard" };
            const mockPersona = {
                archetype: "Scholar",
                quirk: "Mutters",
                flaw: "Arrogant",
                motivation: "Knowledge"
            };

            mockApiService.generateStructuredContent.mockResolvedValue(mockPersona);

            await service.generateNpcPersona(traits);

            const callArgs = mockApiService.generateStructuredContent.mock.calls[0];
            const fullPrompt = callArgs[0];

            expect(fullPrompt).toContain(JSON.stringify(traits));
            expect(fullPrompt).toContain("Generate a rapid NPC persona");
        });
    });

    describe('generateNpcMannerisms', () => {
        it('should generate mannerisms based on persona', async () => {
            const persona = {
                archetype: "Scholar",
                quirk: "Hums",
                flaw: "Impulsive",
                motivation: "Knowledge"
            };
            const mockMannerisms = {
                voice: "Raspy",
                phrases: ["Indeed"],
                mannerisms: "Adjusts glasses"
            };

            mockApiService.generateStructuredContent.mockResolvedValue(mockMannerisms);

            await service.generateNpcMannerisms(persona);

            const callArgs = mockApiService.generateStructuredContent.mock.calls[0];
            const fullPrompt = callArgs[0];

            expect(fullPrompt).toContain(JSON.stringify(persona));
            expect(fullPrompt).toContain("Generate voice and mannerisms");
        });
    });

    describe('generateTacticalBehavior', () => {
        it('should generate tactics for combatants', async () => {
            const combatants = [{ name: "Orc", count: 3 }];
            const environment = "Slippery Cave";
            const mockTactics = {
                tactics: [{
                    name: "Orc",
                    role: "Striker",
                    priority: "Closest",
                    behavior: "Charge"
                }]
            };

            mockApiService.generateStructuredContent.mockResolvedValue(mockTactics);

            await service.generateTacticalBehavior(combatants, environment);

            const callArgs = mockApiService.generateStructuredContent.mock.calls[0];
            const fullPrompt = callArgs[0];

            expect(fullPrompt).toContain(JSON.stringify(combatants));
            expect(fullPrompt).toContain(environment);
            expect(fullPrompt).toContain("As a tactical combat expert");
        });
    });
});
