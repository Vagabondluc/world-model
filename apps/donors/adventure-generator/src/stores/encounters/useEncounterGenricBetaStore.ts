import { create } from 'zustand';
import { EncounterGenricBetaConfig, EncounterGenricBetaResult, EncounterGenricBetaResultSchema } from '@/schemas/encounters';
import { generateEncounterResult } from '../../services/encounterStoreAi';

const defaultInput: EncounterGenricBetaConfig = {
  title: '',
  level: 1
};

interface EncounterGenricBetaState {
  input: EncounterGenricBetaConfig;
  output: EncounterGenricBetaResult | null;
  isGenerating: boolean;
  error: string | null;

  setInput: (input: Partial<EncounterGenricBetaConfig>) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

export const useEncounterGenricBetaStore = create<EncounterGenricBetaState>((set, get) => ({
  input: defaultInput,
  output: null,
  isGenerating: false,
  error: null,

  setInput: (newInput) => set((state) => ({ input: { ...state.input, ...newInput } })),

  generate: async () => {
    set({ isGenerating: true, error: null });
    try {
       const result = await generateEncounterResult(get().input, EncounterGenricBetaResultSchema, 'Encounter (Generic Beta)');
       set({ output: result, isGenerating: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      set({ error: message, isGenerating: false });
    }
  },

  reset: () => set({ output: null, error: null })
}));
