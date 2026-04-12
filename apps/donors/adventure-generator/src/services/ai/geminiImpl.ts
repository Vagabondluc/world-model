
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { CONFIG } from '../../data/constants';
import { zodToGeminiSchema } from '../../utils/zodHelpers';
import { extractJson } from '../../utils/aiHelpers';
import { BaseAIProvider } from "./baseProvider";

export class GeminiImpl extends BaseAIProvider {
    private ai: GoogleGenAI;

    constructor() {
        // Assumes process.env.API_KEY is valid and available from the environment.
        super();
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    async generateStructured<T>(
        prompt: string,
        zodSchema: z.ZodType<T>,
        modelName: string,
        systemInstruction?: string,
        maxRetries: number = 3
    ): Promise<T> {
        const responseSchema = zodToGeminiSchema(zodSchema);
        return this.retryWithBackoff(async () => {
            const response = await this.ai.models.generateContent({
                model: modelName || CONFIG.AI_MODEL,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    ...(systemInstruction && { systemInstruction }),
                }
            });

            if (!response.text) throw new Error('Empty response from AI service');

            // Use shared robust extraction logic
            const parsedRaw = extractJson(response.text);
            
            const validationResult = zodSchema.safeParse(parsedRaw);

            if (!validationResult.success) {
                console.warn("AI response failed Zod validation:", validationResult.error);
                throw new Error(`Structured response validation failed: ${validationResult.error.message}`);
            }

            return validationResult.data;
        }, { maxRetries, label: "Gemini" });
    }

    async generateText(
        prompt: string,
        modelName: string,
        systemInstruction?: string,
        maxRetries: number = 3
    ): Promise<string> {
        return this.retryWithBackoff(async () => {
            const response = await this.ai.models.generateContent({
                model: modelName || CONFIG.AI_MODEL,
                contents: prompt,
                ...(systemInstruction && { config: { systemInstruction } }),
            });

            if (!response.text) throw new Error('Empty response from AI service');
            return response.text;
        }, { maxRetries, label: "Gemini" });
    }

    async streamText(
        prompt: string,
        modelName: string,
        systemInstruction?: string,
        onProgress?: (currentText: string) => void
    ): Promise<string> {
        try {
            const response = await this.ai.models.generateContentStream({
                model: modelName || CONFIG.AI_MODEL,
                contents: prompt,
                config: { ...(systemInstruction && { systemInstruction }) }
            });

            let fullText = '';
            // @ts-ignore - Runtime check for async iterator presence handles different SDK versions
            const streamIterable = response.stream || response;

            if (!streamIterable || typeof streamIterable[Symbol.asyncIterator] !== 'function') {
                console.warn("API did not return a valid async iterable stream. Attempting fallback.");
                // @ts-ignore
                const fallbackText = typeof response.text === 'function' ? response.text() : response.text;
                if (typeof fallbackText === 'string') {
                    if (onProgress) onProgress(fallbackText);
                    return fallbackText;
                }
                throw new Error("API response is not a valid stream and could not be read as text.");
            }

            const extractChunkText = (chunk: unknown): string => {
                if (!chunk || typeof chunk !== 'object') return '';
                const c = chunk as {
                    text?: unknown;
                    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
                };
                if (typeof c.text === 'function') {
                    const value = c.text();
                    return typeof value === 'string' ? value : '';
                }
                if (typeof c.text === 'string') return c.text;
                const candidateText = c.candidates?.[0]?.content?.parts?.[0]?.text;
                return typeof candidateText === 'string' ? candidateText : '';
            };

            for await (const chunk of streamIterable) {
                const chunkText = extractChunkText(chunk);

                if (chunkText) {
                    fullText += chunkText;
                    if (onProgress) onProgress(fullText);
                }
            }
            return fullText;
        } catch (error) {
            console.error("Streaming error:", error);
            throw error;
        }
    }

    async generateImage(prompt: string, modelName: string): Promise<string | null> {
        try {
             // Nano banana models (gemini-2.5-flash-image) return inlineData within content parts
             const response = await this.ai.models.generateContent({
                model: modelName,
                contents: { parts: [{ text: prompt }] }
            });
            
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        // Standard base64 response
                        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    }
                }
            }
            return null;
        } catch (e) {
            console.error("Image Gen Error:", e);
            return null;
        }
    }
}
