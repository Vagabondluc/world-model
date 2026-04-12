import React, { createContext, useState, useContext, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { ElementCard, Resource } from '@mi/types';

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

interface AIState {
    result: string;
    isLoading: boolean;
    error: string;
}

interface GenerateConfig {
    responseMimeType?: "text/plain" | "application/json";
    responseSchema?: any;
    eraId?: number;
    year?: number;
    turnDuration?: number;
}

interface AIContextType extends AIState {
    generate: (basePrompt: string, userInput: string, config?: GenerateConfig) => Promise<void>;
    clear: () => void;
    elements: ElementCard[];
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
    children: React.ReactNode;
    elements: ElementCard[];
}

export const AIProvider = ({ children, elements }: AIProviderProps) => {
    const [state, setState] = useState<AIState>({
        result: '',
        isLoading: false,
        error: '',
    });

    const clear = () => {
        setState({ result: '', isLoading: false, error: '' });
    };

    const generate = useCallback(async (basePrompt: string, userInput: string, config: GenerateConfig = {}) => {
        setState({ result: '', isLoading: true, error: '' });

        try {
            let processedUserInput = userInput;
            const matches = userInput.match(UUID_REGEX);
            if (matches) {
                const uniqueMatches = [...new Set(matches.map(m => m.toLowerCase()))];
                uniqueMatches.forEach(uuid => {
                    const element = elements.find(el => el.id.toLowerCase() === uuid);
                    if (element) {
                        const elementContent = `[Referenced Element: ${element.name} (${element.type}) - Details: ${(element.data as Resource).properties}]`;
                        processedUserInput = processedUserInput.replace(new RegExp(uuid, 'gi'), elementContent);
                    }
                });
            }

            let fullPrompt = basePrompt;
            
            // Add Temporal Context for later eras
            if (config.eraId && config.eraId >= 4 && config.year && config.turnDuration) {
                const scale = config.turnDuration <= 10 ? 'intimate' : 'grand';
                const focus = scale === 'intimate' 
                    ? 'Focus on immediate, personal-scale consequences. Character actions should have direct, visible results within a few years.'
                    : 'Focus on historical patterns and civilizational change. The event\'s impact should be described as it unfolds over the following decade or more.';
                const temporalContext = `\n\nTEMPORAL CONTEXT: The historical scale is ${scale}. This event occurs in the year ${config.year}, during a ${config.turnDuration}-year turn. ${focus}`;
                fullPrompt = temporalContext + '\n\n' + fullPrompt;
            }

            if (processedUserInput.trim()) {
                fullPrompt += `\n\nAdditionally, please incorporate the following ideas from the user: "${processedUserInput.trim()}"`;
            }

            const apiKey: string = (process.env.API_KEY as string | undefined) ?? (import.meta.env.VITE_API_KEY as string | undefined) ?? '';
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    responseMimeType: config.responseMimeType,
                    responseSchema: config.responseSchema,
                },
            });

            setState({ result: response.text ?? '', isLoading: false, error: '' });

        } catch (e) {
            console.error(e);
            setState({ result: '', isLoading: false, error: 'Failed to get a response. Please check your connection or API key and try again.' });
        }
    }, [elements]);

    const contextValue = {
        ...state,
        generate,
        clear,
        elements,
    };

    return (
        <AIContext.Provider value={contextValue}>
            {children}
        </AIContext.Provider>
    );
};

export const useAI = () => {
    const context = useContext(AIContext);
    if (context === undefined) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
};