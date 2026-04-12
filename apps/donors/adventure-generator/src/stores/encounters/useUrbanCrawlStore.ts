import { create } from 'zustand';
import { UrbanCrawlConfig, UrbanCrawlResult, UrbanCrawlResultSchema } from '@/schemas/encounters';
import { generateEncounterResult } from '../../services/encounterStoreAi';

const defaultInput: UrbanCrawlConfig = {
  title: '',
  level: 1
};

interface UrbanCrawlState {
  input: UrbanCrawlConfig;
  output: UrbanCrawlResult | null;
  isGenerating: boolean;
  error: string | null;

  setInput: (input: Partial<UrbanCrawlConfig>) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

export const useUrbanCrawlStore = create<UrbanCrawlState>((set, get) => ({
  input: defaultInput,
  output: null,
  isGenerating: false,
  error: null,

  setInput: (newInput) => set((state) => ({ input: { ...state.input, ...newInput } })),

  generate: async () => {
    set({ isGenerating: true, error: null });
    try {
       const result = await generateEncounterResult(get().input, UrbanCrawlResultSchema, 'Urban Crawl');
       set({ output: result, isGenerating: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      set({ error: message, isGenerating: false });
    }
  },

  reset: () => set({ output: null, error: null })
}));
