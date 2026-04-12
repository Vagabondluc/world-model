import { create } from 'zustand';
import { EncounterdesignOlderV1Config, EncounterdesignOlderV1Result, EncounterdesignOlderV1ResultSchema } from '@/schemas/encounters';
import { generateEncounterResult } from '../../services/encounterStoreAi';

const defaultInput: EncounterdesignOlderV1Config = {
  title: '',
  level: 1
};

interface EncounterdesignOlderV1State {
  input: EncounterdesignOlderV1Config;
  output: EncounterdesignOlderV1Result | null;
  isGenerating: boolean;
  error: string | null;

  setInput: (input: Partial<EncounterdesignOlderV1Config>) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

export const useEncounterdesignOlderV1Store = create<EncounterdesignOlderV1State>((set, get) => ({
  input: defaultInput,
  output: null,
  isGenerating: false,
  error: null,

  setInput: (newInput) => set((state) => ({ input: { ...state.input, ...newInput } })),

  generate: async () => {
    set({ isGenerating: true, error: null });
    try {
       const result = await generateEncounterResult(get().input, EncounterdesignOlderV1ResultSchema, 'Encounter Design Older V1');
       set({ output: result, isGenerating: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      set({ error: message, isGenerating: false });
    }
  },

  reset: () => set({ output: null, error: null })
}));
