import { describe, it, expect, vi } from 'vitest';
import { BaseAIProvider } from '../../services/ai/baseProvider';

class TestProvider extends BaseAIProvider {
    async runWithRetry<T>(operation: () => Promise<T>, maxRetries: number) {
        return this.retryWithBackoff(operation, { maxRetries, baseDelayMs: 0, label: 'Test' });
    }
}

describe('BaseAIProvider retryWithBackoff', () => {
    it('retries until success', async () => {
        const provider = new TestProvider();
        const operation = vi.fn()
            .mockRejectedValueOnce(new Error('nope'))
            .mockRejectedValueOnce(new Error('still nope'))
            .mockResolvedValueOnce('ok');

        const result = await provider.runWithRetry(operation, 3);

        expect(result).toBe('ok');
        expect(operation).toHaveBeenCalledTimes(3);
    });

    it('throws after max retries', async () => {
        const provider = new TestProvider();
        const operation = vi.fn().mockRejectedValue(new Error('nope'));

        await expect(provider.runWithRetry(operation, 2)).rejects.toThrow('failed after 2 attempts');
        expect(operation).toHaveBeenCalledTimes(2);
    });
});
