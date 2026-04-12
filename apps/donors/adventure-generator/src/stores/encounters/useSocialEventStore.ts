import { create } from 'zustand';
import { SocialEventConfig, SocialEventResult, SocialEventResultSchema } from '@/schemas/encounters';
import { generateEncounterResult } from '../../services/encounterStoreAi';

const defaultInput: SocialEventConfig = {
  title: '',
  level: 1
};

interface SocialEventState {
  input: SocialEventConfig;
  output: SocialEventResult | null;
  isGenerating: boolean;
  error: string | null;

  setInput: (input: Partial<SocialEventConfig>) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

export const useSocialEventStore = create<SocialEventState>((set, get) => ({
  input: defaultInput,
  output: null,
  isGenerating: false,
  error: null,

  setInput: (newInput) => set((state) => ({ input: { ...state.input, ...newInput } })),

  generate: async () => {
    set({ isGenerating: true, error: null });
    try {
       const result = await generateEncounterResult(get().input, SocialEventResultSchema, 'Social Event');
       set({ output: result, isGenerating: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      set({ error: message, isGenerating: false });
    }
  },

  reset: () => set({ output: null, error: null })
}));
