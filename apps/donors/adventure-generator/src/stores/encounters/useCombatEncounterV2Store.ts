import { create } from 'zustand';
import { CombatEncounterV2Config, CombatEncounterV2Result, CombatEncounterV2ResultSchema } from '@/schemas/encounters';
import { generateEncounterResult } from '../../services/encounterStoreAi';

const defaultInput: CombatEncounterV2Config = {
  title: '',
  level: 1
};

interface CombatEncounterV2State {
  input: CombatEncounterV2Config;
  output: CombatEncounterV2Result | null;
  isGenerating: boolean;
  error: string | null;

  setInput: (input: Partial<CombatEncounterV2Config>) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

export const useCombatEncounterV2Store = create<CombatEncounterV2State>((set, get) => ({
  input: defaultInput,
  output: null,
  isGenerating: false,
  error: null,

  setInput: (newInput) => set((state) => ({ input: { ...state.input, ...newInput } })),

  generate: async () => {
    set({ isGenerating: true, error: null });
    try {
       const result = await generateEncounterResult(get().input, CombatEncounterV2ResultSchema, 'Combat Encounter V2');
       set({ output: result, isGenerating: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      set({ error: message, isGenerating: false });
    }
  },

  reset: () => set({ output: null, error: null })
}));
