import { z } from "zod";
import { httpFetch as fetch } from "../../utils/httpUtils";
import { extractJson, generatePlaceholderImage } from "../../utils/aiHelpers";
import { BaseAIProvider } from "./baseProvider";
import { readStreamLines } from "./streamUtils";

export class ClaudeImpl extends BaseAIProvider {
    constructor(
        private apiKey: string,
        private apiVersion: string = "2024-10-31"
    ) {
        super();
    }

    private getHeaders() {
        return {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "anthropic-version": this.apiVersion,
            "anthropic-dangerous-direct-browser-access": "true" // Required for client-side fetch to Anthropic
        };
    }

    async generateStructured<T>(
        prompt: string,
        zodSchema: z.ZodType<T>,
        modelName: string,
        systemInstruction?: string,
        maxRetries: number = 3
    ): Promise<T> {
        const model = modelName || "claude-3-5-sonnet-latest";
        return this.retryWithBackoff(async () => {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    model: model,
                    max_tokens: 4096,
                    system: systemInstruction,
                    messages: [
                        { role: "user", content: `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON matching the requested structure.` }
                    ]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Claude API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const content = data.content?.[0]?.text;

            if (!content) throw new Error("Empty response from Claude");

            const parsed = extractJson(content);
            const validation = zodSchema.safeParse(parsed);

            if (!validation.success) {
                throw new Error(`Structured response validation failed: ${validation.error.message}`);
            }

            return validation.data;
        }, { maxRetries, label: "Claude" });
    }

    async generateText(
        prompt: string,
        modelName: string,
        systemInstruction?: string
    ): Promise<string> {
        const model = modelName || "claude-3-5-sonnet-latest";

        return this.retryWithBackoff(async () => {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    model: model,
                    max_tokens: 4096,
                    system: systemInstruction,
                    messages: [{ role: "user", content: prompt }]
                })
            });

            if (!response.ok) throw new Error(`Claude API error: ${response.status}`);
            const data = await response.json();
            return data.content?.[0]?.text || "";
        }, { maxRetries: 2, label: "Claude" });
    }

    async streamText(
        prompt: string,
        modelName: string,
        systemInstruction?: string,
        onProgress?: (text: string) => void
    ): Promise<string> {
        const model = modelName || "claude-3-5-sonnet-latest";

        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    model: model,
                    max_tokens: 4096,
                    system: systemInstruction,
                    messages: [{ role: "user", content: prompt }],
                    stream: true
                })
            });

            if (!response.ok) throw new Error(`Claude API error: ${response.status}`);
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            let fullText = "";

            await readStreamLines(reader, (line) => {
                if (!line.startsWith("data: ")) return false;
                const data = line.slice(6);
                try {
                    const json = JSON.parse(data);
                    if (json.type === "content_block_delta" && json.delta?.text) {
                        fullText += json.delta.text;
                        if (onProgress) onProgress(fullText);
                    }
                } catch {
                    // Ignore parse errors for partial data
                }
                return false;
            });
            return fullText;
        } catch (error) {
            console.error("Claude streamText failed:", error);
            throw error;
        }
    }

    async generateImage(prompt: string): Promise<string | null> {
        return generatePlaceholderImage(prompt, "Claude Visual");
    }
}
