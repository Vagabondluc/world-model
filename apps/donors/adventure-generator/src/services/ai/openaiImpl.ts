import { z } from "zod";
import { httpFetch as fetch } from "../../utils/httpUtils";
import { extractJson, generatePlaceholderImage } from "../../utils/aiHelpers";
import { BaseAIProvider } from "./baseProvider";
import { readStreamLines } from "./streamUtils";

export class OpenAIImpl extends BaseAIProvider {
    constructor(
        private baseUrl: string,
        private apiKey: string,
        private organizationId?: string
    ) {
        super();
    }

    private getUrl(path: string): string {
        const base = this.baseUrl.replace(/\/$/, "");
        return `${base}${path}`;
    }

    private getHeaders() {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.apiKey}`
        };
        if (this.organizationId) {
            headers["OpenAI-Organization"] = this.organizationId;
        }
        return headers;
    }

    async generateStructured<T>(
        prompt: string,
        zodSchema: z.ZodType<T>,
        modelName: string,
        systemInstruction?: string,
        maxRetries: number = 3
    ): Promise<T> {
        const messages = [
            ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
            { role: "user", content: `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON matching the requested structure.` }
        ];
        return this.retryWithBackoff(async () => {
            const response = await fetch(this.getUrl("/chat/completions"), {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    model: modelName,
                    messages: messages,
                    response_format: { type: "json_object" },
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;

            if (!content) throw new Error("Empty response from provider");

            const parsed = extractJson(content);
            const validation = zodSchema.safeParse(parsed);

            if (!validation.success) {
                throw new Error(`Structured response validation failed: ${validation.error.message}`);
            }

            return validation.data;
        }, { maxRetries, label: "OpenAI" });
    }

    async generateText(
        prompt: string,
        modelName: string,
        systemInstruction?: string,
        maxRetries: number = 2
    ): Promise<string> {
        const messages = [
            ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
            { role: "user", content: prompt }
        ];

        return this.retryWithBackoff(async () => {
            const response = await fetch(this.getUrl("/chat/completions"), {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    model: modelName,
                    messages: messages,
                    temperature: 0.7
                })
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            return data.choices?.[0]?.message?.content || "";
        }, { maxRetries, label: "OpenAI" });
    }

    async streamText(
        prompt: string,
        modelName: string,
        systemInstruction?: string,
        onProgress?: (text: string) => void
    ): Promise<string> {
        const messages = [
            ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
            { role: "user", content: prompt }
        ];

        try {
            const response = await fetch(this.getUrl("/chat/completions"), {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify({
                    model: modelName,
                    messages: messages,
                    stream: true
                })
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            let fullText = "";

            await readStreamLines(reader, (line) => {
                if (!line.startsWith("data: ")) return false;
                const data = line.slice(6);
                if (data === "[DONE]") return true;
                try {
                    const json = JSON.parse(data);
                    const content = json.choices?.[0]?.delta?.content || "";
                    if (content) {
                        fullText += content;
                        if (onProgress) onProgress(fullText);
                    }
                } catch {
                    // Ignore parse errors for partial data
                }
                return false;
            });
            return fullText;
        } catch (error) {
            console.error("OpenAI streamText failed:", error);
            throw error;
        }
    }

    async generateImage(prompt: string): Promise<string | null> {
        // Shared placeholder for providers that don't support image gen easily yet via this impl
        return generatePlaceholderImage(prompt, "AI Visual");
    }
}
