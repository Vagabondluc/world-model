import type { GameSliceCreator, UiSlice } from '../storeTypes';

export const createUiSlice: GameSliceCreator<UiSlice> = (set) => ({
    isSettingsModalOpen: false,
    isDebuggerOpen: false,
    isTransitioning: false,
    isGameReady: false,
    selectedElementId: null,

    toggleSettingsModal: () => set(state => ({ isSettingsModalOpen: !state.isSettingsModalOpen })),
    toggleDebugger: () => set(state => ({ isDebuggerOpen: !state.isDebuggerOpen })),
    setGameReady: (ready) => set({ isGameReady: ready }),
    resetTransition: () => set({ isTransitioning: false }),
    setSelectedElementId: (id) => set({ selectedElementId: id }),
});