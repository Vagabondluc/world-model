import type { GameSliceCreator, GameplaySlice } from '../storeTypes';
import type { EraUIState, ElementCard } from '@mi/types';
import { initialEraUiState } from '../initialState';
import { exportElementToHtml, exportElementToMarkdown, exportChronicleFeed } from '@mi/services/exportService';
import {
  writeMapDataToCanonical,
  writeElementsToCanonical,
  getMIMapDataFromCanonical,
  getMIElementsFromCanonical,
} from '@mi/store/canonicalBridge';

export const createGameplaySlice: GameSliceCreator<GameplaySlice> = (set, get) => ({
    currentEraId: 0,
    viewedEraId: 0,
    view: 'eras',
    // Initialise world state from canonical store, falling back to empty defaults
    elements: (getMIElementsFromCanonical() as ElementCard[]),
    playerUiStates: {},
    eraDrafts: {},
    mapData: getMIMapDataFromCanonical() as GameplaySlice['mapData'],
    layerState: {
        surface: true,
        underdark: false,
        fogOfWar: false
    },

    toggleLayer: (layer) => {
        set(state => ({
            layerState: {
                ...state.layerState,
                [layer]: !state.layerState[layer]
            }
        }));
    },

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
        set(state => {
            const updated = [...state.elements, newElement];
            writeElementsToCanonical(updated);
            return { elements: updated };
        });
    },

    updateElement: (updatedElement) => {
        set(state => {
            const updated = state.elements.map(el => el.id === updatedElement.id ? updatedElement : el);
            writeElementsToCanonical(updated);
            return { elements: updated };
        });
    },

    updatePlayer: (updatedPlayer) => {
        set(state => ({
            players: state.players.map(p => p.playerNumber === updatedPlayer.playerNumber ? updatedPlayer : p),
            currentPlayer: state.currentPlayer?.playerNumber === updatedPlayer.playerNumber ? updatedPlayer : state.currentPlayer
        }));
    },

    deleteElement: (elementId) => {
        set(state => {
            const updated = state.elements.filter(el => el.id !== elementId);
            writeElementsToCanonical(updated);
            return { elements: updated };
        });
    },

    updateEraUiState: (newState) => {
        set(state => {
            const playerId = state.currentPlayer?.playerNumber;
            if (playerId === undefined || playerId === null) return {};

            const currentUiState = state.playerUiStates[playerId] || initialEraUiState;
            const mergedState = { ...currentUiState };

            (Object.keys(newState) as Array<keyof EraUIState>).forEach(key => {
                if (mergedState[key] && newState[key]) {
                    (mergedState[key] as any) = { ...mergedState[key], ...newState[key] };
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

    setMapData: (mapData: GameplaySlice['mapData']) => {
        writeMapDataToCanonical(mapData as Parameters<typeof writeMapDataToCanonical>[0]);
        set({ mapData });
    },
});