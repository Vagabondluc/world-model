import type { GameSliceCreator, GameplaySlice } from '../storeTypes';
import type { EraUIState, ElementCard } from '@/types';
import { initialEraUiState } from '../initialState';
import { exportElementToHtml, exportElementToMarkdown, exportChronicleFeed } from '@/services/exportService';

export const createGameplaySlice: GameSliceCreator<GameplaySlice> = (set, get) => ({
    currentEraId: 0,
    viewedEraId: 0,
    view: 'eras',
    elements: [],
    playerUiStates: {},
    eraDrafts: {},

    selectEra: (eraId) => {
        if (eraId <= get().currentEraId || get().isEraNavigationUnlocked) {
            set({ isTransitioning: true });
            setTimeout(() => set({ viewedEraId: eraId, isTransitioning: false }), 300);
        }
    },

    advanceEra: () => {
        set(state => {
            if (state.currentEraId === 6) {
                return { gameState: 'finished' };
            }
            const newEraId = Math.min(state.currentEraId + 1, 6);
            return {
                currentEraId: newEraId,
                viewedEraId: newEraId,
                isTransitioning: true
            };
        });
        setTimeout(() => set({ isTransitioning: false }), 300);
    },

    changeView: (view) => {
        set({ isTransitioning: true });
        setTimeout(() => set({ view, isTransitioning: false }), 300);
    },

    switchPlayer: (playerNumber) => {
        if (!get().isDebugMode) return;
        const { players } = get();
        const newPlayer = players.find(p => p.playerNumber === playerNumber);
        if (newPlayer) set({ currentPlayer: newPlayer });
    },

    createElement: (elementData, createdYear, creationStep) => {
        const newElement: ElementCard = {
            ...elementData,
            id: crypto.randomUUID(),
            ...(createdYear && { createdYear }),
            ...(creationStep && { creationStep }),
        };
        if (newElement.data) newElement.data.id = `data-${newElement.id}`;
        set(state => ({ elements: [...state.elements, newElement]}));
    },

    updateElement: (updatedElement) => {
        set(state => ({
            elements: state.elements.map(el => el.id === updatedElement.id ? updatedElement : el)
        }));
    },

    updatePlayer: (updatedPlayer) => {
        set(state => ({
            players: state.players.map(p => p.playerNumber === updatedPlayer.playerNumber ? updatedPlayer : p),
            currentPlayer: state.currentPlayer?.playerNumber === updatedPlayer.playerNumber ? updatedPlayer : state.currentPlayer
        }));
    },

    deleteElement: (elementId) => {
        set(state => ({
            elements: state.elements.filter(el => el.id !== elementId)
        }));
    },

    updateEraUiState: (newState) => {
        set(state => {
            const playerId = state.currentPlayer?.playerNumber;
            if (!playerId) return {};

            const currentUiState = state.playerUiStates[playerId] || initialEraUiState;
            const mergedState = { ...currentUiState };

            (Object.keys(newState) as Array<keyof EraUIState>).forEach(key => {
                if (mergedState[key] && newState[key]) {
                    mergedState[key] = { ...mergedState[key], ...newState[key] };
                }
            });

            return {
                playerUiStates: {
                    ...state.playerUiStates,
                    [playerId]: mergedState
                }
            };
        });
    },

    updateDraft: (eraId, draftData) => {
        set(state => {
            const playerId = state.currentPlayer?.playerNumber;
            if (!playerId) return {};

            const currentDrafts = state.eraDrafts || {};
            const playerDrafts = currentDrafts[playerId] || {};
            const eraDraft = playerDrafts[eraId] || {};

            return {
                eraDrafts: {
                    ...currentDrafts,
                    [playerId]: {
                        ...playerDrafts,
                        [eraId]: { ...eraDraft, ...draftData }
                    }
                }
            };
        });
    },

    clearDraft: (eraId) => {
        set(state => {
            const playerId = state.currentPlayer?.playerNumber;
            if (!playerId || !state.eraDrafts?.[playerId]) return {};

            const { [eraId]: _, ...remainingEraDrafts } = state.eraDrafts[playerId];
            
            return {
                eraDrafts: {
                    ...state.eraDrafts,
                    [playerId]: remainingEraDrafts
                }
            };
        });
    },
    
    getCompletedEras: () => {
        const { currentEraId } = get();
        return Array.from({ length: currentEraId > 0 ? currentEraId - 1 : 0 }, (_, i) => i + 1);
    },

    exportChronicleFeed: () => {
        const { elements, players, gameSettings, currentPlayer } = get();
        exportChronicleFeed(elements, players, gameSettings, currentPlayer);
    },
    
    exportElementHtml: (element) => {
        const { players } = get();
        exportElementToHtml(element, players);
    },
    
    exportElementMarkdown: (element) => {
        const { players, appSettings } = get();
        exportElementToMarkdown(element, players, appSettings.markdownFormat);
    },
});