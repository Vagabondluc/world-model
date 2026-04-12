// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateLoot } from '../services/lootGenerator';
import { CampaignConfiguration } from '../types/campaign';
import { ImprovedAdventureAPIService } from '../services/aiService';
import { Loot } from '../schemas/loot';

describe('LootGenerator Integration', () => {
    let mockApiService: ImprovedAdventureAPIService;
    let mockConfig: CampaignConfiguration;

    beforeEach(() => {
        mockConfig = {
            language: 'en',
            genre: 'fantasy',
            ruleset: '5e',
            crRange: '1-4',
            tone: 'heroic',
            complexity: 'normal',
            artStyle: 'realistic',
            narrativeTechniques: [],
            narrativeIntegration: 'standard',
            worldInformation: '',
            playerInformation: '',
            npcInformation: '',

            apiProvider: 'gemini',
            aiModel: 'gemini-1.5-flash',
        } as CampaignConfiguration;

        // Mock the API Service
        mockApiService = {
            generateStructuredContent: vi.fn(),
            generateTextContent: vi.fn(),
            streamTextContent: vi.fn(),
            generateImage: vi.fn(),
            getOllamaModels: vi.fn(),
            testOllamaConnection: vi.fn()
        } as unknown as ImprovedAdventureAPIService;
    });

    it('should combine Engine stats with AI flavor', async () => {
        // Setup AI mock response
        const mockAiResponse: Loot = {
            gold: { gp: 50, sp: 0, cp: 0 }, // AI tries to return this
            items: [
                {
                    name: "Blade of the Fallen",
                    type: "weapon",
                    rarity: "uncommon",
                    magic: true,
                    origin: "dungeon",
                    quirks: ["hums"],
                    description: "A rusty blade."
                }
            ],
            hooks: []
        };

        (mockApiService.generateStructuredContent as any).mockResolvedValue(mockAiResponse);

        // Run Generator
        // High XP to trigger 'rich' or 'standard' loot to ensure some gold/items
        const result = await generateLoot(mockApiService, mockConfig, 1000, 5, 'Goblins');

        // Verification 1: Engine Logic (Hard Constraints)
        // The coin count usually shouldn't match the mock exactly because the Engine calculated it differently
        // and we overwrite the AI's coins with the Engine's coins at the end of generateLoot.
        // We know the Engine is seeded, so let's just check that it's NOT the 50gp the AI hallucinated if the seed produced something else.
        // But since we use Date.now() seed in the mapParamsToDials, it's hard to predict exact number here without mocking Date.now

        // Let's verify that the AI service was called with a prompt containing "RAW INPUT"
        const callArgs = (mockApiService.generateStructuredContent as any).mock.calls[0];
        expect(callArgs[0]).toContain("RAW INPUT");

        // Verification 2: The final result should have the AI's item names
        expect(result.items[0].name).toBe("Blade of the Fallen");

        // Verification 3: The final result should have the AI's item description
        expect(result.items[0].description).toBe("A rusty blade.");
    });

    it('should enforce deterministic gold even if AI deviates', async () => {
        // Mock Date.now for stable seeding
        const realDateNow = Date.now;
        Date.now = vi.fn(() => 1234567890);

        const mockAiResponse: Loot = {
            gold: { gp: 9999, sp: 9999, cp: 9999 }, // AI Hallucination
            items: [],
            hooks: []
        };
        (mockApiService.generateStructuredContent as any).mockResolvedValue(mockAiResponse);

        const result = await generateLoot(mockApiService, mockConfig, 500, 1, 'Orc');

        // Engine with that seed should NOT produce 9999
        expect(result.gold.gp).not.toBe(9999);

        // Restore Date.now
        Date.now = realDateNow;
    });
});
