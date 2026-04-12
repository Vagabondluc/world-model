import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameStore } from './storeTypes';
import { createSessionSlice } from './slices/sessionSlice';
import { createGameplaySlice } from './slices/gameplaySlice';
import { createUiSlice } from './slices/uiSlice';
import { createDebugSlice } from './slices/debugSlice';
import { initialEraUiState } from './initialState';

export const useGameStore = create<GameStore>()(
  persist(
    (...a) => ({
      ...createSessionSlice(...a),
      ...createGameplaySlice(...a),
      ...createUiSlice(...a),
      ...createDebugSlice(...a),
    }),
    {
      name: 'mappa-imperium-storage',
      storage: createJSONStorage(() => sessionStorage),
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 3) {
            // Hard reset for schema change regarding eraDrafts
            // Using types to cast but returning empty/default values as needed
            return {} as any;
        }
        return persistedState as any;
      },
      partialize: (state) => {
        // Exclude transient UI states from persistence
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { isTransitioning, isSettingsModalOpen, isDebuggerOpen, isGameReady, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.isTransitioning) {
              state.resetTransition();
          }
          if (state.gameSettings && state.players && state.players.length > 0) {
            state.setGameReady(true);
          }
        }
      },
    }
  )
);

export { initialEraUiState };
