// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiManager } from '../services/ai/aiManager';
import { useNavigationStore } from '../stores/navigationStore';

// Mock CampaignStore
vi.mock('../stores/campaignStore', () => ({
    useCampaignStore: {
        getState: () => ({
            config: { apiProvider: 'gemini', aiModel: 'gemini-1.5' },
            showSystemMessage: vi.fn(),
            setActiveView: vi.fn(),
        }),
    },
}));

const mockInstance = vi.hoisted(() => ({
    generateStructuredContent: vi.fn(),
    generateTextContent: vi.fn(),
    streamTextContent: vi.fn()
}));

// Mock apiService
vi.mock('../services/aiService', () => {
    return {
        ImprovedAdventureAPIService: function () {
            return mockInstance;
        }
    };
});

describe('Fuzzing & Property-Based Tests', () => {
    let mockApiService: any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockApiService = mockInstance;
    });

    describe('AIManager Input Fuzzing', () => {
        // Define a generator function instead of pre-allocating large arrays
        const getFuzzyInput = (index: number): string => {
            const inputs: Record<number, () => string> = {
                0: () => '',
                1: () => ' '.repeat(1000), // Reduced from 10000
                2: () => '{"invalid": "json",}',
                3: () => '<!DOCTYPE html><html>',
                4: () => '\u0000\u0001\u0002',
                5: () => '{}',
                6: () => '[]',
                7: () => 'null',
                8: () => 'undefined',
                9: () => 'NaN',
                10: () => 'Infinity',
                11: () => '-1',
                12: () => '0.000000001',
                13: () => 'True',
                14: () => 'False',
                15: () => 'None',
                16: () => 'SELECT * FROM users',
                17: () => '<script>alert("xss")</script>',
                18: () => '😊😲🙊',
                19: () => 'A'.repeat(1000), // Reduced from 100000
                20: () => '{"a":'.repeat(10), // Reduced from 100
                21: () => '\n'.repeat(100), // Reduced from 1000
                22: () => '\t'.repeat(100), // Reduced from 1000
                23: () => '\r\n'.repeat(100), // Reduced from 1000
                24: () => '\\"'.repeat(50) // Reduced from 1000
            };
            return (inputs[index] || (() => ''))();
        };

        const totalFuzzyTests = 25;

        for (let i = 0; i < totalFuzzyTests; i++) {
            it(`should handle weird input gracefully (Fuzz ${i + 1})`, async () => {
                mockApiService.generateTextContent.mockResolvedValue('Handled');

                const input = getFuzzyInput(i); // Generate on-demand
                const result = await aiManager.generateText(input);
                expect(result).toBe('Handled');
            });
        }
    });

    describe('Navigation randomized sequences', () => {
        const views: any[] = ['adventure', 'monsters', 'npcs', 'maps', 'traps', 'tavern'];

        for (let i = 0; i < 25; i++) {
            it(`should remain stable after random navigation sequence ${i + 1}`, () => {
                const store = useNavigationStore.getState();
                store.resetNavigation();

                // Perform 10 random navigation actions
                for (let j = 0; j < 10; j++) {
                    const action = Math.random() > 0.3 ? 'push' : 'pop';
                    if (action === 'push') {
                        const view = views[Math.floor(Math.random() * views.length)];
                        store.pushView(view);
                    } else {
                        store.popView();
                    }
                }

                const stack = useNavigationStore.getState().viewStack;
                expect(stack.length).toBeGreaterThanOrEqual(1);
                expect(views).toContain(stack[stack.length - 1]);
            });
        }
    });
});
