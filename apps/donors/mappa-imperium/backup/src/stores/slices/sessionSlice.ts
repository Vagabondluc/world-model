import type { GameSliceCreator, SessionSlice } from '../storeTypes';
import { initialEraUiState } from '../initialState';
import type { EraUIState } from '@/types';

export const createSessionSlice: GameSliceCreator<SessionSlice> = (set, get) => ({
    gameState: 'setup',
    gameSettings: null,
    players: [],
    currentPlayer: null,
    gameRole: 'player',
    appSettings: { markdownFormat: 'regular' },

    startGame: (settings) => {
        const humanPlayers = Array.from({ length: settings.players }, (_, i) => ({
            playerNumber: i + 1, name: `Player ${i + 1}`, isOnline: false, isAi: false,
        }));
        
        const initialPlayerUiStates: Record<number, EraUIState> = {};
        humanPlayers.forEach(p => {
            initialPlayerUiStates[p.playerNumber] = { ...initialEraUiState };
        });

        set({
            gameSettings: settings,
            players: humanPlayers,
            elements: [],
            playerUiStates: initialPlayerUiStates,
            currentEraId: 0,
            viewedEraId: 0,
            gameState: settings.aiPlayers > 0 ? 'ai_configuration' : 'player_selection',
            isGameReady: true,
            eraDrafts: {},
        });
    },

    configureAiPlayers: (aiPlayers) => {
        set(state => {
           const allPlayers = [...state.players, ...aiPlayers];
           const newPlayerUiStates = { ...state.playerUiStates };
           aiPlayers.forEach(p => {
               newPlayerUiStates[p.playerNumber] = { ...initialEraUiState };
           });
           
           return {
               players: allPlayers,
               playerUiStates: newPlayerUiStates,
               gameState: 'player_selection'
           };
       });
     },

    selectPlayer: (playerNumber, playerName, password) => {
        const { players } = get();
        const targetPlayer = players.find(p => p.playerNumber === playerNumber);
        if (!targetPlayer) return;

        if (targetPlayer.password && targetPlayer.password !== password) {
            alert('Incorrect password.');
            return;
        }

        const updatedPlayers = players.map(p => 
           p.playerNumber === playerNumber 
               ? { ...p, name: targetPlayer.password ? p.name : playerName, password: p.password || password, isOnline: true } 
               : p
        );
        
        set({
            players: updatedPlayers,
            currentPlayer: updatedPlayers.find(p => p.playerNumber === playerNumber) || null,
            gameRole: 'player',
            gameState: 'playing',
            currentEraId: 1,
            viewedEraId: 1
        });
    },

    joinAsObserver: () => {
        set({
            gameRole: 'observer',
            currentPlayer: null,
            gameState: 'playing',
            currentEraId: 1,
            viewedEraId: 1,
        });
    },

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
    
    browseLobby: () => set({ gameState: 'lobby' }),
    backToSetup: () => set({ gameState: 'setup' }),
    
    logOff: () => set({ 
        gameState: 'setup',
        gameSettings: null,
        players: [],
        currentPlayer: null,
        currentEraId: 0,
        viewedEraId: 0,
        view: 'eras',
        gameRole: 'player',
        isDebugMode: false,
        isEraNavigationUnlocked: false,
        elements: [],
        playerUiStates: {},
        isTransitioning: false,
        isGameReady: true,
        eraDrafts: {},
     }),

    saveSettings: (settings) => set({ appSettings: settings, isSettingsModalOpen: false }),
});