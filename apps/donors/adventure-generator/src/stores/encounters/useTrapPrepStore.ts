import { create } from 'zustand';
import { TrapPrepConfig, TrapPrepResult, TrapPrepResultSchema } from '@/schemas/encounters';
import { generateEncounterResult } from '../../services/encounterStoreAi';

const defaultInput: TrapPrepConfig = {
  title: '',
  level: 1
};

interface TrapPrepState {
  input: TrapPrepConfig;
  output: TrapPrepResult | null;
  isGenerating: boolean;
  error: string | null;

  setInput: (input: Partial<TrapPrepConfig>) => void;
  generate: () => Promise<void>;
  reset: () => void;
}

export const useTrapPrepStore = create<TrapPrepState>((set, get) => ({
  input: defaultInput,
  output: null,
  isGenerating: false,
  error: null,

  setInput: (newInput) => set((state) => ({ input: { ...state.input, ...newInput } })),

  generate: async () => {
    set({ isGenerating: true, error: null });
    try {
       const result = await generateEncounterResult(get().input, TrapPrepResultSchema, 'Trap Prep');
       set({ output: result, isGenerating: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      set({ error: message, isGenerating: false });
    }
  },

  reset: () => set({ output: null, error: null })
}));
