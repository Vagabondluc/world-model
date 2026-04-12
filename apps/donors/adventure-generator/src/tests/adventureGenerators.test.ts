// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateHooksStrategy, refineHooksStrategy, generateOutlineStrategy, generateFullOutlineStrategy } from '../services/adventureGenerators';
import { ImprovedAdventureAPIService } from '../services/aiService';
import { CampaignConfiguration } from '../types/campaign';
import { CONFIG } from '../data/constants';

describe('Adventure Generators', () => {
    let mockApiService: ImprovedAdventureAPIService;
    let mockConfig: CampaignConfiguration;

    beforeEach(() => {
        vi.clearAllMocks();

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

        mockApiService = {
            generateStructuredContent: vi.fn(),
            generateTextContent: vi.fn(),
        } as unknown as ImprovedAdventureAPIService;
    });

    describe('generateHooksStrategy', () => {
        it('should construct correct prompt and call API', async () => {
            // deterministic random sequence for premises matrix
            const randomValues = [0.123, 0.456, 0.789, 0.234, 0.567];
            let rvIndex = 0;
            vi.spyOn(Math, 'random').mockImplementation(() => {
                const v = randomValues[rvIndex % randomValues.length];
                rvIndex++;
                return v;
            });

            const context = "Dark forest setting.";
            // Mock return value to avoid validation errors if validators are running
            (mockApiService.generateStructuredContent as any).mockResolvedValue([
                { origin: "Origin 1", positioning: "Pos 1", stakes: "Stakes 1" },
                { origin: "Origin 2", positioning: "Pos 2", stakes: "Stakes 2" },
                { origin: "Origin 3", positioning: "Pos 3", stakes: "Stakes 3" },
                { origin: "Origin 4", positioning: "Pos 4", stakes: "Stakes 4" },
                { origin: "Origin 5", positioning: "Pos 5", stakes: "Stakes 5" }
            ]);

            const result = await generateHooksStrategy(mockApiService, mockConfig, context);

            expect(mockApiService.generateStructuredContent).toHaveBeenCalledTimes(1);
            const callArgs = (mockApiService.generateStructuredContent as any).mock.calls[0];

            // Verify System Instruction (implicitly via builder)
            expect(callArgs[3]).toContain('System Instructions');

            // Verify Prompt Content
            const prompt = callArgs[0];
            expect(prompt).toContain(context);
            // system prompt no longer contains the old "creative Dungeon Master" phrase
            // assert that premises section is present
            expect(prompt).toContain('Premises:');

            // Snapshot the prompt to catch regressions
            expect(prompt).toMatchSnapshot();

            // Verify Result Structure
            expect(result.adventures).toHaveLength(5);
            expect(result.matrix).toHaveLength(5);
            if (result.adventures[0].type === 'simple') {
                expect(result.adventures[0].origin).toBe("Origin 1");
            }
        });
    });

    describe('refineHooksStrategy', () => {
        it('should refine existing matrix', async () => {
            const context = "Cave setting.";
            const matrix = [[1, 2, 3]]; // Single row matrix for simplicity

            (mockApiService.generateStructuredContent as any).mockResolvedValue([
                { origin: "Refined Origin", positioning: "Refined Pos", stakes: "Refined Stakes" }
            ]);

            const result = await refineHooksStrategy(mockApiService, mockConfig, context, matrix);

            expect(mockApiService.generateStructuredContent).toHaveBeenCalledTimes(1);
            expect(result).toHaveLength(1);
            if (result[0].type === 'simple') {
                expect(result[0].origin).toBe("Refined Origin");
            }
        });
    });

    describe('generateOutlineStrategy', () => {
        it('should generate outline from hook', async () => {
            const context = "City setting.";
            const hook = {
                type: 'simple' as const,
                premise: "A lost ring.",
                origin: "Thieves Guild",
                positioning: "Owes a favor.",
                stakes: "War."
            };

            const mockOutline = { title: "The Lost Ring", summary: "Start here.", scenes: [] };
            (mockApiService.generateStructuredContent as any).mockResolvedValue(mockOutline);

            const result = await generateOutlineStrategy(mockApiService, mockConfig, context, hook);

            const callArgs = (mockApiService.generateStructuredContent as any).mock.calls[0];
            const prompt = callArgs[0];

            expect(prompt).toContain(hook.premise);
            expect(prompt).toContain(hook.origin);
            expect(prompt).toContain(context);
            expect(prompt).toMatchSnapshot();

            expect(result).toEqual(mockOutline);
        });
    });

    describe('generateFullOutlineStrategy', () => {
        it('should generate outline from config', async () => {
            const context = "Space setting.";
            const generatorConfig = {
                primaryPlot: "Artifact Quest",
                primaryTwist: "__NO_TWIST__",
                combinationMethod: "",
                secondaryPlot: "",
                secondaryTwist: "",
                sceneCount: 5,
                sceneTypes: {
                    'Exploration': true,
                    'Combat': true,
                    'NPC Interaction': false,
                    'Dungeon': false
                }
            };

            const mockOutline = { title: "Space Horror", summary: "Run.", scenes: [] };
            (mockApiService.generateStructuredContent as any).mockResolvedValue(mockOutline);

            const result = await generateFullOutlineStrategy(mockApiService, mockConfig, context, generatorConfig);

            const callArgs = (mockApiService.generateStructuredContent as any).mock.calls[0];
            const prompt = callArgs[0];

            expect(prompt).toContain('Create exactly 5 scenes');
            // verify the chosen plot is communicated as a user selection
            expect(prompt).toContain('The user has selected the "Artifact Quest" plot');
            // expect(prompt).toMatchSnapshot();

            expect(result).toEqual(mockOutline);
        });

        it('should not crash if sceneTypes is missing', async () => {
            const context = "Void setting.";
            const generatorConfig = {
                primaryPlot: "Artifact Quest",
                primaryTwist: "__NO_TWIST__",
                combinationMethod: "",
                secondaryPlot: "",
                secondaryTwist: "",
                sceneCount: 3,
                // sceneTypes intentionally omitted
            } as any;

            const mockOutline2 = { title: "Minimal", summary: "Test.", scenes: [] };
            (mockApiService.generateStructuredContent as any).mockResolvedValue(mockOutline2);

            const result2 = await generateFullOutlineStrategy(mockApiService, mockConfig, context, generatorConfig);
            const prompt2 = (mockApiService.generateStructuredContent as any).mock.calls[0][0];

            expect(prompt2).toContain('Create exactly 3 scenes');
            expect(result2).toEqual(mockOutline2);
        });
    });
});
