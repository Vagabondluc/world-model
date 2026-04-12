import { create } from 'zustand';
import { CombatEncounterConfig, CombatEncounterResult, CombatEncounterResultSchema } from '@/schemas/encounters';
import { generateEncounterResult } from '../../services/encounterStoreAi';

const defaultInput: CombatEncounterConfig = {
  title: '',
  level: 1
};

interface CombatEncounterState {
  input: CombatEncounterConfig;
  output: CombatEncounterResult | null;
  isGenerating: boolean;
  error: string | null;

  setInput: (input: Partial<CombatEncounterConfig>) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

export const useCombatEncounterStore = create<CombatEncounterState>((set, get) => ({
  input: defaultInput,
  output: null,
  isGenerating: false,
  error: null,

  setInput: (newInput) => set((state) => ({ input: { ...state.input, ...newInput } })),

  generate: async () => {
    set({ isGenerating: true, error: null });
    try {
       const result = await generateEncounterResult(get().input, CombatEncounterResultSchema, 'Combat Encounter');
       set({ output: result, isGenerating: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      set({ error: message, isGenerating: false });
    }
  },

  reset: () => set({ output: null, error: null })
}));
