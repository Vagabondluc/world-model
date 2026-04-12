
import { create } from 'zustand';
import { z } from 'zod';
import { SceneTypeEnum } from '../schemas';
import { CONFIG } from '../data/constants';
import { ConfigStateExport } from '../types/generator';

export interface GeneratorConfigState {
    context: string;
    generationMethod: 'arcane' | 'pattern' | 'delve';
    combinationMethod: string;
    primaryPlot: string;
    primaryTwist: string;
    secondaryPlot: string;
    secondaryTwist: string;
    sceneCount: number;
    sceneTypes: Record<z.infer<typeof SceneTypeEnum>, boolean>;
}

export interface GeneratorConfigActions {
    setContext: (context: string) => void;
    updateConfig: (config: Partial<Omit<GeneratorConfigState, 'generationMethod'> & { generationMethod?: 'arcane' | 'pattern' | 'delve' }>) => void;
    reset: (keepContext: boolean) => void;
    exportState: () => ConfigStateExport;
    importState: (state: Partial<ConfigStateExport>) => void;
}

const initialState: GeneratorConfigState = {
    context: '',
    generationMethod: 'arcane',
    combinationMethod: '',
    primaryPlot: '',
    primaryTwist: '__NO_TWIST__',
    secondaryPlot: '',
    secondaryTwist: '__NO_TWIST__',
    sceneCount: CONFIG.DEFAULT_SCENE_COUNT,
    sceneTypes: { 'Exploration': true, 'Combat': true, 'NPC Interaction': true, 'Dungeon': true },
};

export const useGeneratorConfigStore = create<GeneratorConfigState & GeneratorConfigActions>((set, get) => ({
    ...initialState,
    setContext: (context) => set({ context }),
    updateConfig: (config) => set((state) => {
        const newState = { ...state, ...config };
        if (config.primaryPlot !== undefined) newState.primaryTwist = '__NO_TWIST__';
        if (config.secondaryPlot !== undefined) newState.secondaryTwist = '__NO_TWIST__';
        return newState;
    }),
    reset: (keepContext) => set(state => ({
        ...initialState,
        context: keepContext ? state.context : '',
    })),
    exportState: (): ConfigStateExport => {
        const {
            context, generationMethod, combinationMethod, primaryPlot, primaryTwist,
            secondaryPlot, secondaryTwist, sceneCount, sceneTypes
        } = get();
        return {
            context, generationMethod, combinationMethod, primaryPlot, primaryTwist,
            secondaryPlot, secondaryTwist, sceneCount, sceneTypes
        };
    },
    importState: (state) => {
        if (!state) return;
        set(prev => ({
            ...prev,
            ...state
        }));
    }
}));
