import { z } from "zod";
import { httpFetch as fetch } from "../../utils/httpUtils";
import { extractJson, generatePlaceholderImage } from "../../utils/aiHelpers";
import { BaseAIProvider } from "./baseProvider";
import { readStreamLines } from "./streamUtils";

export class OllamaImpl extends BaseAIProvider {
    constructor(
        private baseUrl: string,
        private defaultModel: string,
        private pythonBackendUrl?: string,
        private apiKey?: string | null
    ) {
        super();
    }

    private getUrl(path: string): string {
        // Remove trailing slash if present
        const base = this.baseUrl.replace(/\/$/, "");
        return `${base}${path}`;
    }

    async generateStructured<T>(
        prompt: string,
        zodSchema: z.ZodType<T>,
        modelName: string,
        systemInstruction?: string,
        maxRetries: number = 3
    ): Promise<T> {
        if (this.pythonBackendUrl) {
            try {
                // Determine endpoint based on schema or prompt
                let endpoint = "/generate/npc"; // Default fallback
                if (prompt.toLowerCase().includes("encounter")) endpoint = "/generate/encounter";

                const headers: Record<string, string> = { "Content-Type": "application/json" };
                if (this.apiKey) headers["X-API-Key"] = this.apiKey;

                const response = await fetch(`${this.pythonBackendUrl}${endpoint}`, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({
                        prompt: prompt,
                        model: modelName || this.defaultModel
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    return zodSchema.parse(data);
                }
                console.warn("Python backend failed, falling back to direct Ollama", response.status);
            } catch (e) {
                console.warn("Python backend unreachable, falling back to direct Ollama", e);
            }
        }

        const model = modelName || this.defaultModel;

        const messages = [
            ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
            { role: "user", content: `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON matching the requested structure.` }
        ];

        return this.retryWithBackoff(async () => {
            const response = await fetch(this.getUrl("/api/chat"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    format: "json", // Enforce JSON mode
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.message?.content;

            if (!content) throw new Error("Empty response from Ollama");

            // Use robust extraction to handle potential markdown wrapping or preamble
            const parsed = extractJson(content);

            const validation = zodSchema.safeParse(parsed);

            if (!validation.success) {
                console.warn("Ollama JSON validation failed:", validation.error);
                throw new Error(`Structured response validation failed: ${validation.error.message}`);
            }

            return validation.data;
        }, { maxRetries, label: "Ollama" });
    }

    async generateText(
        prompt: string,
        modelName?: string,
        systemInstruction?: string,
        maxRetries: number = 2
    ): Promise<string> {
        const model = modelName || this.defaultModel;
        const messages = [
            ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
            { role: "user", content: prompt }
        ];

        return this.retryWithBackoff(async () => {
            const response = await fetch(this.getUrl("/api/chat"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    stream: false
                })
            });

            if (!response.ok) throw new Error(`Ollama API error: ${response.status}`);
            const data = await response.json();
            return data.message?.content || "";
        }, { maxRetries, label: "Ollama" });
    }

    async streamText(
        prompt: string,
        modelName?: string,
        systemInstruction?: string,
        onProgress?: (text: string) => void
    ): Promise<string> {
        if (this.pythonBackendUrl) {
            try {
                const headers: Record<string, string> = { "Content-Type": "application/json" };
                if (this.apiKey) headers["X-API-Key"] = this.apiKey;

                const response = await fetch(`${this.pythonBackendUrl}/llm/generate/stream`, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({
                        prompt: prompt,
                        model: modelName || this.defaultModel,
                        system: systemInstruction
                    })
                });

                if (!response.ok) throw new Error(`Backend Stream Error: ${response.status}`);
                if (!response.body) throw new Error("No response body");

                const reader = response.body.getReader();
                let fullText = "";

                await readStreamLines(reader, (line) => {
                    if (!line.startsWith("data: ")) return false;
                    const data = line.slice(6);
                    if (data === "[DONE]") return true;
                    try {
                        const json = JSON.parse(data);
                        // Protocol: { content: "chunk" }
                        if (json.content) {
                            fullText += json.content;
                            if (onProgress) onProgress(fullText);
                        }
                    } catch {
                        // Ignore parse errors for partial data
                    }
                    return false;
                });
                return fullText;

            } catch (e) {
                console.warn("Python backend stream failed, fallback to native Ollama", e);
            }
        }

        const model = modelName || this.defaultModel;
        const messages = [
            ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
            { role: "user", content: prompt }
        ];

        try {
            const response = await fetch(this.getUrl("/api/chat"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    stream: true
                })
            });

            if (!response.ok) throw new Error(`Ollama API error: ${response.status}`);
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            let fullText = "";

            await readStreamLines(reader, (line) => {
                try {
                    const json = JSON.parse(line);
                    const content = json.message?.content || "";
                    if (content) {
                        fullText += content;
                        if (onProgress) onProgress(fullText);
                    }
                    return Boolean(json.done);
                } catch {
                    // Ignore parse errors for partial chunks
                }
                return false;
            });
            return fullText;
        } catch (error) {
            console.error("Ollama streamText failed:", error);
            throw error;
        }
    }

    async generateImage(prompt: string): Promise<string | null> {
        // Ollama does not natively support image generation.
        // To prevent the UI from breaking or showing "No Image", we return a 
        // procedurally generated placeholder that visualizes the prompt.
        console.info("Ollama: Generating procedural placeholder for image request.");
        return generatePlaceholderImage(prompt, "Local AI Visual");
    }

    /**
     * Fetch available models from local Ollama instance.
     */
    async getAvailableModels(): Promise<string[]> {
        const url = this.getUrl("/api/tags");
        console.log(`[OllamaImpl] Fetching models from: ${url}`);
        try {
            const response = await fetch(url, {
                method: 'GET',
                connectTimeout: 5000
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const data: { models?: Array<{ name: string }> } = await response.json();
            const models = (data.models || []).map((m) => m.name);
            return models;
        } catch (error: unknown) {
            console.error("[OllamaImpl] Fetch error:", error);

            // Specifically detect Tauri scope errors or connection refused
            const msg = error instanceof Error ? error.message : String(error);
            if (msg.includes("not allowed on the configured scope")) {
                throw new Error("SECURITY: The app is blocked from accessing this URL by Tauri's security scope. Please ensure localhost:11434 is allowed in capabilities.");
            }
            if (msg.includes("failed to fetch") || msg.includes("Connect error")) {
                throw new Error("CONNECTION: Could not reach Ollama. Is it running? Is OLLAMA_ORIGINS='*' set?");
            }

            throw new Error(`Ollama Probe Failed: ${msg}`);
        }
    }

    async testConnection(): Promise<{ success: boolean; message: string }> {
        try {
            const models = await this.getAvailableModels();
            return {
                success: true,
                message: `Connection successful! Found ${models.length} models.`
            };
        } catch (e: unknown) {
            return {
                success: false,
                message: e instanceof Error ? e.message : String(e)
            };
        }
    }

    async pullModel(modelName: string, onProgress?: (p: number, status: string) => void): Promise<void> {
        const url = this.getUrl("/api/pull");
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: modelName, stream: true })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n").filter(line => line.trim() !== "");

                for (const line of lines) {
                    try {
                        const json = JSON.parse(line);
                        if (json.status) {
                            let percent = 0;
                            if (json.total && json.completed) {
                                percent = Math.round((json.completed / json.total) * 100);
                            }
                            if (onProgress) onProgress(percent, json.status);
                        }
                    } catch (e) {
                        // Ignore parse errors for partial chunks
                    }
                }
            }
        } catch (error: unknown) {
            console.error("[OllamaImpl] Pull model error:", error);
            throw error;
        }
    }
}
