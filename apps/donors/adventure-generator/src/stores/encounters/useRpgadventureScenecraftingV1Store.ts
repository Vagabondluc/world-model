import { create } from 'zustand';
import { RpgadventureScenecraftingV1Config, RpgadventureScenecraftingV1Result, RpgadventureScenecraftingV1ResultSchema } from '@/schemas/encounters';
import { generateEncounterResult } from '../../services/encounterStoreAi';

const defaultInput: RpgadventureScenecraftingV1Config = {
  title: '',
  level: 1
};

interface RpgadventureScenecraftingV1State {
  input: RpgadventureScenecraftingV1Config;
  output: RpgadventureScenecraftingV1Result | null;
  isGenerating: boolean;
  error: string | null;

  setInput: (input: Partial<RpgadventureScenecraftingV1Config>) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

export const useRpgadventureScenecraftingV1Store = create<RpgadventureScenecraftingV1State>((set, get) => ({
  input: defaultInput,
  output: null,
  isGenerating: false,
  error: null,

  setInput: (newInput) => set((state) => ({ input: { ...state.input, ...newInput } })),

  generate: async () => {
    set({ isGenerating: true, error: null });
    try {
       const result = await generateEncounterResult(get().input, RpgadventureScenecraftingV1ResultSchema, 'RPG Adventure Scene Crafting V1');
       set({ output: result, isGenerating: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      set({ error: message, isGenerating: false });
    }
  },

  reset: () => set({ output: null, error: null })
}));
