import { create } from 'zustand';
import { EncounterdesignV1DeprecatedConfig, EncounterdesignV1DeprecatedResult, EncounterdesignV1DeprecatedResultSchema } from '@/schemas/encounters';
import { generateEncounterResult } from '../../services/encounterStoreAi';

const defaultInput: EncounterdesignV1DeprecatedConfig = {
  title: '',
  level: 1
};

interface EncounterdesignV1DeprecatedState {
  input: EncounterdesignV1DeprecatedConfig;
  output: EncounterdesignV1DeprecatedResult | null;
  isGenerating: boolean;
  error: string | null;

  setInput: (input: Partial<EncounterdesignV1DeprecatedConfig>) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

export const useEncounterdesignV1DeprecatedStore = create<EncounterdesignV1DeprecatedState>((set, get) => ({
  input: defaultInput,
  output: null,
  isGenerating: false,
  error: null,

  setInput: (newInput) => set((state) => ({ input: { ...state.input, ...newInput } })),

  generate: async () => {
    set({ isGenerating: true, error: null });
    try {
       const result = await generateEncounterResult(get().input, EncounterdesignV1DeprecatedResultSchema, 'Encounter Design V1 (Deprecated)');
       set({ output: result, isGenerating: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      set({ error: message, isGenerating: false });
    }
  },

  reset: () => set({ output: null, error: null })
}));
