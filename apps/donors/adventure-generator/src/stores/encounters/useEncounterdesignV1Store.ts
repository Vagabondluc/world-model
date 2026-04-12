import { create } from 'zustand';
import { EncounterdesignV1Config, EncounterdesignV1Result, EncounterdesignV1ResultSchema } from '@/schemas/encounters';
import { generateEncounterResult } from '../../services/encounterStoreAi';

const defaultInput: EncounterdesignV1Config = {
  title: '',
  level: 1
};

interface EncounterdesignV1State {
  input: EncounterdesignV1Config;
  output: EncounterdesignV1Result | null;
  isGenerating: boolean;
  error: string | null;

  setInput: (input: Partial<EncounterdesignV1Config>) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

export const useEncounterdesignV1Store = create<EncounterdesignV1State>((set, get) => ({
  input: defaultInput,
  output: null,
  isGenerating: false,
  error: null,

  setInput: (newInput) => set((state) => ({ input: { ...state.input, ...newInput } })),

  generate: async () => {
    set({ isGenerating: true, error: null });
    try {
       const result = await generateEncounterResult(get().input, EncounterdesignV1ResultSchema, 'Encounter Design V1');
       set({ output: result, isGenerating: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      set({ error: message, isGenerating: false });
    }
  },

  reset: () => set({ output: null, error: null })
}));
