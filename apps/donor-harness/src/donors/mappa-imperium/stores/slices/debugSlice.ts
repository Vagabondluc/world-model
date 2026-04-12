import type { GameSliceCreator, DebugSlice } from '../storeTypes';
import { prepopulationData } from '@mi/data/prepopulationData';
import { initialEraUiState } from '../initialState';
import type { Player, EraUIState, ElementCard } from '@mi/types';

export const createDebugSlice: GameSliceCreator<DebugSlice> = (set, get) => ({
    isDebugMode: true,
    isEraNavigationUnlocked: false,

    debugSetup: () => {
        const debugSettings = { players: 4, aiPlayers: 0, length: 'Standard' as const, turnDuration: 10 };
        const debugPlayers: Player[] = [
            { playerNumber: 1, name: 'PeeHell', isOnline: true, password: '1', isAi: false },
            { playerNumber: 2, name: 'PrOfOuNd_IdIoT', isOnline: true, password: '1', isAi: false },
            { playerNumber: 3, name: 'MOFO', isOnline: true, password: '1', isAi: false },
            { playerNumber: 4, name: 'MyFaCeHuRt', isOnline: true, password: '1', isAi: false },
        ];

        const initialPlayerUiStates: Record<number, EraUIState> = {};
        debugPlayers.forEach(p => {
            initialPlayerUiStates[p.playerNumber] = { ...initialEraUiState };
        });

        set({
            gameSettings: debugSettings,
            players: debugPlayers,
            currentPlayer: debugPlayers[0],
            gameRole: 'player',
            currentEraId: 1,
            viewedEraId: 1,
            gameState: 'playing',
            isDebugMode: true,
            isEraNavigationUnlocked: true,
            elements: [],
            playerUiStates: initialPlayerUiStates,
            isTransitioning: false,
            isGameReady: true,
            eraDrafts: {},
        });
    },

    toggleEraNavigationLock: () => set(state => ({ isEraNavigationUnlocked: !state.isEraNavigationUnlocked })),

    prepopulateEra: (eraId, playerNumber) => {
        const { players, elements, currentEraId, currentPlayer } = get();

        // Generate map if not exists (Debug Feature)
        if (!get().mapData) {
            // Lazy load the generator to avoid circular deps if possible, or just import at top
            const { generateMap } = require('../../services/generators/mapGenerator');
            const debugMapSettings = {
                algorithm: 'wilderness',
                seed: 'debug-seed-123',
                params: { radius: 10, theme: 'surface' }
            };
            const generatedMap = generateMap(debugMapSettings);

            set({
                mapData: generatedMap,
                gameSettings: {
                    ...get().gameSettings!,
                    worldSettings: debugMapSettings as any
                }
            });
        }

        const targetPlayers = playerNumber === 0
            ? players
            : players.filter(p => p.playerNumber === playerNumber);

        if (targetPlayers.length === 0) return;

        let updatedElements = [...elements];
        const updatedPlayersMap = new Map(players.map(p => [p.playerNumber, { ...p }]));

        targetPlayers.forEach(player => {
            const pId = player.playerNumber;
            const pData = prepopulationData[pId];

            if (!pData) return;

            for (let e = 1; e <= eraId; e++) {
                const eraData = pData[e];
                if (!eraData) continue;

                if (eraData.elements) {
                    eraData.elements.forEach((elTmpl: any) => {
                        const exists = updatedElements.some(existing =>
                            existing.owner === pId &&
                            existing.type === elTmpl.type &&
                            existing.name === elTmpl.name
                        );

                        if (!exists) {
                            const newId = crypto.randomUUID();
                            const newData = { ...elTmpl.data, id: elTmpl.data.id || `data-${newId}` };
                            updatedElements.push({
                                ...elTmpl,
                                id: newId,
                                data: newData,
                                owner: pId,
                                era: e,
                                isDebug: true
                            } as ElementCard);
                        }
                    });
                }

                if (eraData.elementUpdates) {
                    eraData.elementUpdates.forEach((rule: any) => {
                        updatedElements = updatedElements.map(el => {
                            if (el.owner === pId && el.type === rule.find.type) {
                                if (rule.find.data) {
                                    const match = Object.entries(rule.find.data).every(([k, v]) => (el.data as any)[k] === v);
                                    if (!match) return el;
                                }
                                return { ...el, data: { ...el.data, ...rule.updates } };
                            }
                            return el;
                        });
                    });
                }

                if (eraData.playerUpdates) {
                    const currentP = updatedPlayersMap.get(pId);
                    if (currentP) {
                        updatedPlayersMap.set(pId, { ...currentP, ...eraData.playerUpdates });
                    }
                }
            }
        });

        set({
            elements: updatedElements,
            players: Array.from(updatedPlayersMap.values()),
            currentPlayer: currentPlayer ? updatedPlayersMap.get(currentPlayer.playerNumber) || null : null,
            currentEraId: Math.max(currentEraId, eraId),
            viewedEraId: eraId,
            isGameReady: true
        });
    },

    exportGameData: () => {
        const { players, elements, gameSettings } = get();
        const dataStr = JSON.stringify({ players, elements, gameSettings }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'mappa-imperium-debug-export.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    },

    importGameData: (file: File) => {
        console.log('Importing game data from file:', file.name);
    },

    loadScenario: (scenarioElements: ElementCard[]) => {
        console.log('Loading test scenario with', scenarioElements.length, 'elements.');
        set({ elements: scenarioElements });
    },

    clearAllData: () => {
        if (window.confirm('Are you sure you want to delete all game data?')) {
            set(state => ({
                elements: [],
                players: state.players.map(p => ({ ...p, deityCount: 0 })),
                currentEraId: 1,
                viewedEraId: 1,
                playerUiStates: {},
                eraDrafts: {},
            }));
        }
    },
});