import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ElementCard, GameSettings, Player } from "@mi/types";

// NOTE: We do NOT initialize the client globally to prevent app crash if API key is missing.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIRequestConfig {
    responseMimeType?: "text/plain" | "application/json";
    responseSchema?: any;
    eraId?: number;
    year?: number;
}

export interface AIRequestContext {
    gameSettings: GameSettings | null;
    currentPlayer: Player | null;
    elements: ElementCard[];
}

export const generateContent = async (
    basePrompt: string,
    userInput: string,
    context: AIRequestContext,
    config: AIRequestConfig = {}
): Promise<string> => {
    // Lazy initialization
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || (process.env as any).API_KEY; // Support both just in case

    if (!apiKey) {
        console.warn("Google API Key is missing. AI features will be disabled.");
        throw new Error("Missing API Key. Please configure VITE_GOOGLE_API_KEY.");
    }

    const ai = new GoogleGenAI({ apiKey });

    let fullPrompt = basePrompt;
    const { gameSettings, elements } = context;

    // 1. Process UUID References (Context Injection)
    // We do this here to ensure the prompt sent to Gemini is self-contained
    let processedUserInput = userInput;
    const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    const matches = userInput.match(UUID_REGEX);

    if (matches && elements.length > 0) {
        const uniqueMatches = [...new Set(matches.map(m => m.toLowerCase()))];
        uniqueMatches.forEach(uuid => {
            const element = elements.find(el => el.id.toLowerCase() === uuid);
            if (element) {
                // Construct a rich summary for the referenced element
                let details = '';
                if (element.type === 'Resource' && element.data) {
                    details = (element.data as any).properties || '';
                } else if (element.data && 'description' in element.data) {
                    details = (element.data as any).description || '';
                }

                const elementContent = `[Referenced Element: ${element.name} (${element.type}) - Details: ${details}]`;
                processedUserInput = processedUserInput.replace(new RegExp(uuid, 'gi'), elementContent);
            }
        });
    }

    // 2. Add Temporal Context for later eras
    if (config.eraId && config.eraId >= 4 && config.year && gameSettings) {
        const turnDuration = gameSettings.turnDuration || 10;
        const scale = turnDuration <= 10 ? 'intimate' : 'grand';
        const focus = scale === 'intimate'
            ? 'Focus on immediate, personal-scale consequences. Character actions should have direct, visible results within a few years.'
            : 'Focus on historical patterns and civilizational change. The event\'s impact should be described as it unfolds over the following decade or more.';
        const temporalContext = `\n\nTEMPORAL CONTEXT: The historical scale is ${scale}. This event occurs in the year ${config.year}, during a ${turnDuration}-year turn. ${focus}`;
        fullPrompt = temporalContext + '\n\n' + fullPrompt;
    }

    // 3. Append User Input
    if (processedUserInput && processedUserInput.trim()) {
        fullPrompt += `\n\nAdditionally, please incorporate the following ideas from the user: "${processedUserInput.trim()}"`;
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: config.responseMimeType,
                responseSchema: config.responseSchema,
            },
        });

        return response.text || '';
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
};
