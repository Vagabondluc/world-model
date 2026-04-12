import { GameSliceCreator, SessionSlice } from '../../storeTypes';
import { initialEraUiState } from '../../initialState';
import type { EraUIState } from '@/types';

export const createImportActions: GameSliceCreator<Partial<SessionSlice>> = (set, get) => ({
    importFromFile: (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target?.result as string);
                if (importedData.gameSettings && importedData.players && importedData.elements && typeof importedData.currentEraId === 'number' && 'exportedByPlayerNumber' in importedData) {
                    set({
                        gameSettings: importedData.gameSettings,
                        players: importedData.players.map((p: any) => ({ ...p, isOnline: false })),
                        elements: importedData.elements,
                        currentEraId: importedData.currentEraId,
                        viewedEraId: importedData.currentEraId,
                        isDebugMode: false,
                        currentPlayer: null,
                        gameRole: 'player',
                        view: 'eras',
                        gameState: 'player_selection',
                        playerUiStates: {}, // Assuming reset or derived
                        eraDrafts: {},
                    });
                    // Re-initialize UI states if missing in import
                    const currentPlayers = get().players;
                    const uiStates: Record<number, EraUIState> = {};
                    currentPlayers.forEach(p => uiStates[p.playerNumber] = { ...initialEraUiState });
                    set({ playerUiStates: uiStates });

                } else {
                    alert('Invalid import file format.');
                }
            } catch (e) {
                alert('Error parsing import file.');
                console.error(e);
            }
        };
        reader.readAsText(file);
    },

    importFromFeed: async (url) => {
        set({ gameState: 'loading_feed' });
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.manifest && data.players && data.elements) {
                set({
                    gameSettings: data.manifest.gameSettings,
                    players: data.players,
                    elements: data.elements,
                    gameRole: 'observer',
                    currentPlayer: null,
                    currentEraId: 1,
                    viewedEraId: 1,
                    view: 'eras',
                    gameState: 'playing'
                });
            } else {
                throw new Error("Invalid Chronicle Feed format.");
            }
        } catch (error) {
            console.error("Failed to load from Chronicle Feed:", error);
            alert(`Failed to load from Chronicle Feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            set({ gameState: 'setup' });
        }
    },
});
