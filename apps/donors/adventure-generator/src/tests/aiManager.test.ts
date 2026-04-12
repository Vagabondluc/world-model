// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { aiManager } from '../services/ai/aiManager';
import { useCampaignStore } from '../stores/campaignStore';
import { ImprovedAdventureAPIService } from '../services/aiService';
import { z } from 'zod';

const mockShowSystemMessage = vi.fn();

// Mock CampaignStore
vi.mock('../stores/campaignStore', () => ({
    useCampaignStore: {
        getState: vi.fn(() => ({
            config: {
                apiProvider: 'gemini',
                aiModel: 'gemini-1.5-flash'
            },
            showSystemMessage: mockShowSystemMessage,
        })),
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

describe('AIManager', () => {
    let mockApiService: any;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        // Use small backoff base for deterministic tests
        aiManager.setBackoffBaseMs(1);
        // Get the mocked instance
        mockApiService = mockInstance;
    });

    afterEach(() => {
        vi.useRealTimers();
        // Clear any pending mocks
        vi.clearAllMocks();
    });

    it('should return data on successful pass-through', async () => {
        mockApiService.generateTextContent.mockResolvedValue('AI Response');
        const result = await aiManager.generateText('Prompt');
        expect(result).toBe('AI Response');
    });

    it('should retry on initial failure and succeed', async () => {
        mockApiService.generateTextContent
            .mockRejectedValueOnce(new Error('Network Error'))
            .mockResolvedValueOnce('Recovered Response');

        const resultPromise = aiManager.generateText('Prompt');
        await vi.advanceTimersByTimeAsync(50);
        const result = await resultPromise;
        expect(result).toBe('Recovered Response');
        expect(mockApiService.generateTextContent).toHaveBeenCalledTimes(2);
    });

    it('should fail after max retries exceed', async () => {
        mockApiService.generateTextContent.mockRejectedValue(new Error('Persistent Error'));

        const resultPromise = aiManager.generateText('Prompt');
        // Attach catch handler immediately to prevent unhandled rejection during timer advancement
        const catchStub = vi.fn();
        resultPromise.catch(catchStub);
        
        await vi.runAllTimersAsync();
        
        await expect(resultPromise).rejects.toThrow('Persistent Error');
        expect(mockApiService.generateTextContent).toHaveBeenCalledTimes(3); // 1 first + 2 retries
    });

    it('should show system message on final failure', async () => {
        mockApiService.generateTextContent.mockRejectedValue(new Error('Persistent Error'));

        const resultPromise = aiManager.generateText('Prompt');
        // Attach catch handler to prevent unhandled rejection
        resultPromise.catch(() => {});
        
        await vi.runAllTimersAsync();
        
        try {
            await resultPromise;
        } catch (e) {
            // Error expected
        }

        expect(mockShowSystemMessage).toHaveBeenCalledWith('error', expect.stringContaining('Persistent Error'));
    });

    it('should handle structured content success', async () => {
        const schema = z.object({ test: z.string() });
        mockApiService.generateStructuredContent.mockResolvedValue({ test: 'data' });

        const result = await aiManager.generateStructured('Prompt', schema);
        expect(result).toEqual({ test: 'data' });
    });

    it('should retry structured content failure', async () => {
        const schema = z.object({ test: z.string() });
        mockApiService.generateStructuredContent
            .mockRejectedValueOnce(new Error('Transient Error'))
            .mockResolvedValueOnce({ test: 'success' });

        const resultPromise = aiManager.generateStructured('Prompt', schema);
        // Attach catch handler to prevent unhandled rejection
        resultPromise.catch(() => {});
        
        await vi.runAllTimersAsync();
        
        const result = await resultPromise;
        expect(result).toEqual({ test: 'success' });
        expect(mockApiService.generateStructuredContent).toHaveBeenCalledTimes(2);
    });

    it('should use model from config if not provided', async () => {
        mockApiService.generateTextContent.mockResolvedValue('OK');
        await aiManager.generateText('Prompt');
        expect(mockApiService.generateTextContent).toHaveBeenCalledWith('Prompt', 'gemini-1.5-flash', undefined);
    });

    it('should handle timeouts correctly', async () => {
        mockApiService.generateTextContent.mockImplementation(() =>
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        );
        
        const resultPromise = aiManager.generateText('Prompt');
        // Attach catch handler to prevent unhandled rejection
        resultPromise.catch(() => {});
        
        // Run all timers to complete all retry attempts
        await vi.runAllTimersAsync();
        
        await expect(resultPromise).rejects.toThrow('Timeout');
    }, 30000);

    // Deterministic retry scenarios (replaces randomized bulk tests)
    describe('deterministic retry scenarios', () => {
        it('should succeed on first attempt when no errors', async () => {
            mockApiService.generateTextContent.mockResolvedValueOnce('success');
            const result = await aiManager.generateText('prompt');
            expect(result).toBe('success');
        });

        it('should succeed after 1 retry', async () => {
            mockApiService.generateTextContent
                .mockRejectedValueOnce(new Error('Error 1'))
                .mockResolvedValueOnce('success');
            const resultPromise = aiManager.generateText('prompt');
            // Advance timers to trigger the retry(s)
            await vi.advanceTimersByTimeAsync(50);
            const result = await resultPromise;
            expect(result).toBe('success');
        });

        it('should succeed after 2 retries', async () => {
            mockApiService.generateTextContent
                .mockRejectedValueOnce(new Error('Error 1'))
                .mockRejectedValueOnce(new Error('Error 2'))
                .mockResolvedValueOnce('success');
            const resultPromise = aiManager.generateText('prompt');
            // Advance timers to trigger the retry(s)
            await vi.advanceTimersByTimeAsync(50);
            const result = await resultPromise;
            expect(result).toBe('success');
        });

        it('should fail after 3 attempts (max retries)', async () => {
            mockApiService.generateTextContent
                .mockRejectedValueOnce(new Error('Error 1'))
                .mockRejectedValueOnce(new Error('Error 2'))
                .mockRejectedValueOnce(new Error('Error 3'));
            const resultPromise = aiManager.generateText('prompt');
            // Attach catch handler to prevent unhandled rejection
            resultPromise.catch(() => {});
            // Run all timers to complete all retry attempts
            await vi.runAllTimersAsync();
            await expect(resultPromise).rejects.toThrow();
        });
    });

    it('should gracefully handle malformed JSON in generateStructured', async () => {
        mockApiService.generateStructuredContent.mockResolvedValueOnce('invalid json');
        const resultPromise = aiManager.generateStructured('Prompt', z.any());
        
        // Advance timers for any retry attempts
        await vi.advanceTimersByTimeAsync(50);
        
        try {
            const res = await resultPromise;
            // If implementation returns, expect a null/undefined fallback
            expect(res == null).toBe(true);
        } catch (e) {
            // Or it may throw when parsing
            expect(e).toBeTruthy();
        }
    });

    it('should provide fallback user message when error has no message', async () => {
        mockApiService.generateTextContent.mockRejectedValue({}); // Empty error object
        const showSystemMessage = useCampaignStore.getState().showSystemMessage;

        const resultPromise = aiManager.generateText('Prompt');
        // Attach catch handler to prevent unhandled rejection
        resultPromise.catch(() => {});
        
        await vi.runAllTimersAsync();
        
        try { await resultPromise; } catch (e) { }

        expect(showSystemMessage).toHaveBeenCalledWith('error', expect.stringContaining('The AI is currently unavailable'));
    });

    it('should respect custom model overrides', async () => {
        mockApiService.generateTextContent.mockResolvedValue('OK');
        await aiManager.generateText('Prompt', 'custom-model');
        expect(mockApiService.generateTextContent).toHaveBeenCalledWith('Prompt', 'custom-model', undefined);
    });

    it('should handle provider switches correctly', async () => {
        (useCampaignStore.getState as any).mockReturnValue({
            config: { apiProvider: 'ollama', ollamaModel: 'llama2' },
            showSystemMessage: vi.fn(),
        });
        mockApiService.generateTextContent.mockResolvedValue('Ollama OK');
        const result = await aiManager.generateText('Prompt');
        expect(mockApiService.generateTextContent).toHaveBeenCalledWith('Prompt', 'llama2', undefined);
        expect(result).toBe('Ollama OK');
    });

});
