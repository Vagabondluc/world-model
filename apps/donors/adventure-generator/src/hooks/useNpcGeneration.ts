import { useState, useCallback } from 'react';
import { z } from 'zod';
import { aiManager } from '../services/ai/aiManager';

export interface NpcData {
    name: string;
    archetype: string;
    quirk: string;
    flaw: string;
    motivation: string;
    voice: string;
    mannerisms: string;
    phrases?: string[];
}

export const useNpcGeneration = (initialData?: Partial<NpcData>) => {
    const [npcData, setNpcData] = useState<NpcData>({
        name: 'New NPC',
        archetype: '',
        quirk: '',
        flaw: '',
        motivation: '',
        voice: '',
        mannerisms: '',
        ...initialData
    });

    const [loading, setLoading] = useState(false);

    const generatePersona = useCallback(async () => {
        setLoading(true);
        try {
            const prompt = `Generate a unique D&D NPC persona. Current data: ${JSON.stringify(npcData)}`;
            const schema = z.object({
                archetype: z.string(),
                motivation: z.string(),
                quirk: z.string(),
                flaw: z.string()
            });
            const result = await aiManager.generateStructured(prompt, schema);
            setNpcData(prev => ({ ...prev, ...result }));
            return result;
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [npcData]);

    const generateVoice = useCallback(async () => {
        setLoading(true);
        try {
            const prompt = `Generate a unique voice and mannerisms for this D&D NPC: ${JSON.stringify(npcData)}`;
            const schema = z.object({
                voice: z.string(),
                mannerisms: z.string(),
                phrases: z.array(z.string())
            });
            const result = await aiManager.generateStructured(prompt, schema);
            setNpcData(prev => ({ ...prev, ...result }));
            return result;
        } catch (e) {
            console.error(e);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [npcData]);

    const updateNpcData = useCallback((updates: Partial<NpcData>) => {
        setNpcData(prev => ({ ...prev, ...updates }));
    }, []);

    return {
        npcData,
        loading,
        generatePersona,
        generateVoice,
        updateNpcData
    };
};
