import { GameSliceCreator, SessionSlice } from '../../storeTypes';
import { initialEraUiState } from '../../initialState';
import type { EraUIState } from '@/types';

export const createGameActions: GameSliceCreator<Partial<SessionSlice>> = (set, get) => ({
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
            gameState: 'world_setup',
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
});
