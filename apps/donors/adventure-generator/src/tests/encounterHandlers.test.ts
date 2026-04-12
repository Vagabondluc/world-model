// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateEncounterAIDraft } from '../services/encounterHandlers';
import { ImprovedAdventureAPIService } from '../services/aiService';
import { CampaignConfiguration } from '../types/campaign';
import { EncounterSceneNode, AINarrativeResponse, AINarrativeResponseSchema } from '../schemas/encounter';

describe('Encounter Handlers', () => {
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
        } as unknown as ImprovedAdventureAPIService;
    });

    it('should generate draft for Setup stage with standard instructions', async () => {
        const node: EncounterSceneNode = {
            id: 'node-1',
            stage: 'Setup',
            narrative: 'Party enters the cave.',
            thematicTags: ['Dark', 'Ominous'],
            emotionalShift: 'Curiosity to Dread',
            features: [],
            continuityRefs: []
        };
        const locationContext = "A dank cave system.";
        const factionContext = ["Goblins"];

        const mockResponse: AINarrativeResponse = {
            title: "Cave Entrance",
            thinking: "Standard setup...",
            narrative: "You see a cave."
        };
        (mockApiService.generateStructuredContent as any).mockResolvedValue(mockResponse);

        const result = await generateEncounterAIDraft(mockApiService, mockConfig, node, locationContext, factionContext);

        expect(mockApiService.generateStructuredContent).toHaveBeenCalledTimes(1);
        const callArgs = (mockApiService.generateStructuredContent as any).mock.calls[0];
        const prompt = callArgs[0];

        // Core assertions
        expect(prompt).toContain(node.stage);
        expect(prompt).toContain(locationContext);
        expect(prompt).toContain(node.narrative);
        expect(prompt).toContain('Narrative Instruction'); // Standard instruction header

        // Snapshot to verify prompt structure
        expect(prompt).toMatchSnapshot();
        expect(result).toEqual(mockResponse);
    });

    it('should inject Chain-of-Thought instructions for Twist stage', async () => {
        const node: EncounterSceneNode = {
            id: 'node-2',
            stage: 'Twist',
            narrative: 'The guide is a traitor.',
            thematicTags: ['Betrayal'],
            emotionalShift: 'Trust to Shock',
            features: [],
            continuityRefs: []
        };
        const locationContext = "Cliff edge.";
        const factionContext = ["Thieves Guild"];

        const mockResponse: AINarrativeResponse = {
            title: "The Betrayal",
            thinking: "Subversion logic...",
            narrative: "The guide pushes you."
        };
        (mockApiService.generateStructuredContent as any).mockResolvedValue(mockResponse);

        const result = await generateEncounterAIDraft(mockApiService, mockConfig, node, locationContext, factionContext);

        const callArgs = (mockApiService.generateStructuredContent as any).mock.calls[0];
        const prompt = callArgs[0];

        // Specific Twist assertions
        expect(prompt).toContain('Chain-of-Thought Instruction (Twist Stage)');
        expect(prompt).toContain('Subversion:');
        expect(prompt).toContain('Logic Check:');

        expect(prompt).toMatchSnapshot();
    });

    it('should include history summary in prompt', async () => {
        const history: EncounterSceneNode[] = [
            {
                id: 'node-1',
                stage: 'Setup',
                narrative: 'Entered cave.',
                thematicTags: [],
                emotionalShift: '',
                features: [],
                continuityRefs: []
            }
        ];
        const node: EncounterSceneNode = {
            id: 'node-2',
            stage: 'Challenge',
            narrative: 'Goblin ambush.',
            thematicTags: ['Combat'],
            emotionalShift: 'Tension',
            features: [],
            continuityRefs: []
        };

        (mockApiService.generateStructuredContent as any).mockResolvedValue({
            title: "Ambush", narrative: "Attack!"
        });

        await generateEncounterAIDraft(mockApiService, mockConfig, node, "Cave", [], history);

        const callArgs = (mockApiService.generateStructuredContent as any).mock.calls[0];
        const prompt = callArgs[0];

        expect(prompt).toContain('Encounter History So Far:');
        expect(prompt).toContain('Setup: Entered cave.');
    });
});
