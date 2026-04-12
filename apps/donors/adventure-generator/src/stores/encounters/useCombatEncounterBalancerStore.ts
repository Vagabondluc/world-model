import { create } from 'zustand';
import { CombatEncounterBalancerConfig, CombatEncounterBalancerResult, CombatEncounterBalancerResultSchema } from '@/schemas/encounters';
import { generateEncounterResult } from '../../services/encounterStoreAi';

const defaultInput: CombatEncounterBalancerConfig = {
  title: '',
  level: 1
};

interface CombatEncounterBalancerState {
  input: CombatEncounterBalancerConfig;
  output: CombatEncounterBalancerResult | null;
  isGenerating: boolean;
  error: string | null;

  setInput: (input: Partial<CombatEncounterBalancerConfig>) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

export const useCombatEncounterBalancerStore = create<CombatEncounterBalancerState>((set, get) => ({
  input: defaultInput,
  output: null,
  isGenerating: false,
  error: null,

  setInput: (newInput) => set((state) => ({ input: { ...state.input, ...newInput } })),

  generate: async () => {
    set({ isGenerating: true, error: null });
    try {
       const result = await generateEncounterResult(get().input, CombatEncounterBalancerResultSchema, 'Combat Encounter Balancer');
       set({ output: result, isGenerating: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      set({ error: message, isGenerating: false });
    }
  },

  reset: () => set({ output: null, error: null })
}));
