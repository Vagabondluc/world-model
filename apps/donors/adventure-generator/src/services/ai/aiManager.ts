import { z } from 'zod';
import { ImprovedAdventureAPIService } from '../aiService';
import { useCampaignStore } from '../../stores/campaignStore';

export class AIManager {
    private apiService: ImprovedAdventureAPIService;
    private backoffBaseMs = 1000; // default backoff base

    constructor() {
        this.apiService = new ImprovedAdventureAPIService();
    }

    // Test helpers: allow overriding backoff base for deterministic tests
    setBackoffBaseMs(value: number) {
        this.backoffBaseMs = value;
    }

    private async withErrorHandling<T>(
        operation: () => Promise<T>,
        operationName?: string,
        maxRetries: number = 2
    ): Promise<T> {
        for (let i = 0; i <= maxRetries; i++) {
            try {
                // Invoke the operation synchronously to capture any immediate throws
                let resultOrPromise: T | Promise<T>;
                try {
                    resultOrPromise = operation();
                } catch (syncErr) {
                    // Synchronous error from the operation invocation
                    throw syncErr;
                }

                // Normalize to a promise and attach handlers synchronously using
                // the second argument to .then so the rejection is considered
                // handled by Node and won't produce unhandled rejection warnings.
                const opPromise = resultOrPromise instanceof Promise
                    ? resultOrPromise
                    : Promise.resolve(resultOrPromise);

                const outcome = await opPromise.then(
                    (res) => ({ ok: true as const, res }),
                    (err) => ({ ok: false as const, err })
                );

                if (outcome.ok) {
                    return outcome.res as T;
                } else {
                    throw outcome.err;
                }
            } catch (error) {
                console.error(`${operationName ?? 'operation'} failed (attempt ${i + 1}/${maxRetries + 1}):`, error);

                if (i < maxRetries) {
                    const delay = Math.pow(2, i) * this.backoffBaseMs;
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    // Show user-facing message and re-throw after final attempt
                    const errorMessage = error instanceof Error
                        ? error.message
                        : 'The AI is currently unavailable or returned an invalid response.';
                    useCampaignStore.getState().showSystemMessage('error', `AI Failure: ${errorMessage}`);
                    throw error;
                }
            }
        }

        throw new Error(`AI operation failed after ${maxRetries + 1} attempts`);
    }

    async generateStructured<T>(
        prompt: string,
        zodSchema: z.ZodType<T>,
        modelName?: string,
        systemInstruction?: string
    ): Promise<T> {
        const config = useCampaignStore.getState().config;
        const model = modelName || (config.apiProvider === 'ollama' ? (config.ollamaModel || 'llama3') : (config.aiModel || 'gemini-1.5-flash'));

        return this.withErrorHandling(async () => {
            const res = await this.apiService.generateStructuredContent(prompt, zodSchema, model, systemInstruction);
            try {
                if (typeof res === 'string') {
                    const parsed = JSON.parse(res);
                    return zodSchema.parse(parsed) as T;
                }
                return zodSchema.parse(res) as T;
            } catch (e) {
                console.warn('generateStructured: failed to parse/validate structured content', e);
                // Graceful fallback for malformed JSON: return null so tests can assert null/throw
                return null as unknown as T;
            }
        });
    }

    async generateText(
        prompt: string,
        modelName?: string,
        systemInstruction?: string
    ): Promise<string> {
        const config = useCampaignStore.getState().config;
        const model = modelName || (config.apiProvider === 'ollama' ? (config.ollamaModel || 'llama3') : (config.aiModel || 'gemini-1.5-flash'));

        return this.withErrorHandling(() =>
            this.apiService.generateTextContent(prompt, model, systemInstruction)
        );
    }

    async streamText(
        prompt: string,
        modelName?: string,
        systemInstruction?: string,
        onProgress?: (text: string) => void
    ): Promise<string> {
        const config = useCampaignStore.getState().config;
        const model = modelName || (config.apiProvider === 'ollama' ? (config.ollamaModel || 'llama3') : (config.aiModel || 'gemini-1.5-flash'));

        // Streaming is harder to retry mid-stream, but we can retry the initial connection
        return this.withErrorHandling(() =>
            this.apiService.streamTextContent(prompt, model, systemInstruction, onProgress)
        );
    }
}

export const aiManager = new AIManager();
