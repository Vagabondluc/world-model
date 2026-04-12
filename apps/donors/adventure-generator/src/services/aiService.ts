import { z } from "zod";
import { GeminiImpl } from './ai/geminiImpl';
import { OllamaImpl } from './ai/ollamaImpl';
import { OpenAIImpl } from './ai/openaiImpl';
import { ClaudeImpl } from './ai/claudeImpl';
import { DummyImpl } from './ai/dummyImpl';
import { ContextManager } from './ai/contextManager';
import { useCampaignStore } from '../stores/campaignStore';
import { useAiLedgerStore } from '../stores/aiLedgerStore';
import { useBackendStore } from '../stores/backendStore';
import { useAiProviderStore } from '../stores/aiProviderStore';

export class ImprovedAdventureAPIService {
    private gemini: GeminiImpl;
    private dummy: DummyImpl;

    constructor() {
        this.gemini = new GeminiImpl();
        this.dummy = new DummyImpl();
    }

    private getProvider() {
        const config = useAiProviderStore.getState().getProviderConfig();
        const provider = config.apiProvider || 'gemini';

        if (provider === 'dummy') return this.dummy;

        if (provider === 'ollama') {
            const baseUrl = config.baseUrl || config.ollamaBaseUrl || 'http://localhost:11434';
            const model = config.aiModel || config.ollamaModel || 'llama3';
            const pythonUrl = config.pythonBackendUrl;
            const apiKey = config.pythonApiKey;

            return new OllamaImpl(baseUrl, model, pythonUrl, apiKey);
        }

        if (provider === 'claude') {
            return new ClaudeImpl(config.apiKey || '', config.apiVersion);
        }

        if (['openai', 'grok', 'zai', 'perplexity', 'openrouter', 'lm-studio'].includes(provider)) {
            const baseUrl = config.baseUrl || 'https://api.openai.com/v1';
            return new OpenAIImpl(baseUrl, config.apiKey || '', config.organizationId);
        }

        return this.gemini;
    }

    async generateWithEnsembleContext(userPrompt: string): Promise<string> {
        const fullPrompt = ContextManager.buildRAGPrompt(userPrompt);

        // Use internal generateTextContent to ensure logging happens
        const config = useAiProviderStore.getState().getProviderConfig();
        const model = config.apiProvider === 'ollama'
            ? (config.ollamaModel || 'llama3')
            : (config.aiModel || 'gemini-1.5-flash');

        return this.generateTextContent(fullPrompt, model);
    }

    private async logRequest(
        input: string,
        output: string,
        model: string,
        startTime: number,
        details: Record<string, unknown> = {}
    ) {
        const state = useCampaignStore.getState();
        const config = state.config;
        const providerName = config.apiProvider || 'gemini';
        const provider = (['gemini', 'ollama', 'dummy'] as const).includes(providerName as 'gemini' | 'ollama' | 'dummy')
            ? (providerName as 'gemini' | 'ollama' | 'dummy')
            : 'unknown';

        const ledgerStore = useAiLedgerStore.getState();
        const cost = ledgerStore.calculateCost(input.length, output.length);

        ledgerStore.addEntry({
            id: crypto.randomUUID(),
            timestamp: new Date(startTime),
            input,
            output,
            model,
            provider,
            estimatedInputTokens: Math.ceil(input.length / 4),
            estimatedOutputTokens: Math.ceil(output.length / 4),
            cost,
            details: {
                duration: Date.now() - startTime,
                ...details
            }
        });
    }

    async generateStructuredContent<T>(
        prompt: string,
        zodSchema: z.ZodType<T>,
        modelName: string,
        systemInstruction?: string,
        maxRetries: number = 3
    ): Promise<T> {
        const startTime = Date.now();
        const provider = this.getProvider();

        try {
            const result = await provider.generateStructured(prompt, zodSchema, modelName, systemInstruction, maxRetries);

            // For structured content, we log the JSON string representation of the result
            const outputString = JSON.stringify(result, null, 2);
            await this.logRequest(prompt, outputString, modelName, startTime, { type: 'structured', systemInstruction });

            return result;
        } catch (error) {
            console.error("AI Request Failed", error);
            // Optionally log failed requests?
            throw error;
        }
    }

    async generateTextContent(
        prompt: string,
        modelName: string,
        systemInstruction?: string,
        maxRetries: number = 3
    ): Promise<string> {
        const startTime = Date.now();
        const provider = this.getProvider();

        try {
            const result = await provider.generateText(prompt, modelName, systemInstruction, maxRetries);
            await this.logRequest(prompt, result, modelName, startTime, { type: 'text', systemInstruction });
            return result;
        } catch (error) {
            console.error("AI Request Failed", error);
            throw error;
        }
    }

    async streamTextContent(
        prompt: string,
        modelName: string,
        systemInstruction?: string,
        onProgress?: (currentText: string) => void
    ): Promise<string> {
        const startTime = Date.now();
        const provider = this.getProvider();

        // We wrap onProgress to maybe handle intermediate logging if needed, but for now just log final
        try {
            const result = await provider.streamText(prompt, modelName, systemInstruction, onProgress);
            await this.logRequest(prompt, result, modelName, startTime, { type: 'stream', systemInstruction });
            return result;
        } catch (error) {
            console.error("AI Stream Failed", error);
            throw error;
        }
    }

    async generateImage(
        prompt: string,
        modelName: string = 'gemini-2.0-flash'
    ): Promise<string | null> {
        const startTime = Date.now();
        const providerType = useAiProviderStore.getState().getProviderConfig().apiProvider;

        if (providerType === 'dummy') return this.dummy.generateImage(prompt);
        if (providerType === 'ollama') return null;

        const result = await this.gemini.generateImage(prompt, modelName);
        if (result) {
            // Log image generation - cost is usually per image, but we track length as proxy for now or 0
            // Note: Image models often have fixed price per image.
            await this.logRequest(prompt, "[Image Binary Data]", modelName, startTime, { type: 'image' });
        }
        return result;
    }

    async getOllamaModels(baseUrl: string): Promise<string[]> {
        const backendState = useBackendStore.getState();
        const tempOllama = new OllamaImpl(baseUrl, 'unknown', backendState.baseUrl, backendState.apiKey);
        return tempOllama.getAvailableModels();
    }

    async testOllamaConnection(baseUrl: string): Promise<{ success: boolean; message: string }> {
        const backendState = useBackendStore.getState();
        const tempOllama = new OllamaImpl(baseUrl, 'unknown', backendState.baseUrl, backendState.apiKey);
        return tempOllama.testConnection();
    }
}
