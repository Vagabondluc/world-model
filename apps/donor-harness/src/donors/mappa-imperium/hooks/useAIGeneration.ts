import { useState, useCallback } from 'react';
import { generateContent, AIRequestConfig } from '../services/aiService';
import { useGameStore } from '../stores/gameStore';

export const useAIGeneration = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [result, setResult] = useState<string>('');
    
    // Grab the current state directly from the store
    // This ensures we always have the latest elements/settings when generate is called
    const { elements, gameSettings, currentPlayer } = useGameStore();

    const clear = useCallback(() => {
        setResult('');
        setError('');
        setIsLoading(false);
    }, []);

    const generate = useCallback(async (basePrompt: string, userInput: string, config?: AIRequestConfig) => {
        setIsLoading(true);
        setError('');
        setResult('');

        try {
            // Assemble the context object synchronously right before the call
            const context = {
                elements,
                gameSettings,
                currentPlayer
            };

            const text = await generateContent(basePrompt, userInput, context, config);
            setResult(text);
        } catch (err) {
            console.error(err);
            setError('Failed to generate content. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [elements, gameSettings, currentPlayer]);

    return {
        isLoading,
        error,
        result,
        generate,
        clear,
        elements // Expose elements for context input suggestions in UI
    };
};
