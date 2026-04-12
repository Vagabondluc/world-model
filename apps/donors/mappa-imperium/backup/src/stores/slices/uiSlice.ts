import type { GameSliceCreator, UiSlice } from '../storeTypes';

export const createUiSlice: GameSliceCreator<UiSlice> = (set) => ({
    isSettingsModalOpen: false,
    isDebuggerOpen: false,
    isTransitioning: false,
    isGameReady: false,

    toggleSettingsModal: () => set(state => ({ isSettingsModalOpen: !state.isSettingsModalOpen })),
    toggleDebugger: () => set(state => ({ isDebuggerOpen: !state.isDebuggerOpen })),
    setGameReady: (ready) => set({ isGameReady: ready }),
    resetTransition: () => set({ isTransitioning: false }),
});