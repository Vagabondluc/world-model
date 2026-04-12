import { useGameStore } from './gameStore';
import { GameSettings } from '../types';

// Simple mockup of storage
Object.defineProperty(window, 'sessionStorage', {
    value: {
        getItem: () => null,
        setItem: () => { },
        removeItem: () => { },
    }
});

describe('gameStore', () => {
    // We can't easily reset the store state because it's global and persisted.
    // So we test independent actions or assume state.

    it('should have initial state', () => {
        // Just checking basic property existence to ensure store is set up
        const state = useGameStore.getState();
        expect(state).toHaveProperty('isGameReady');
        expect(state).toHaveProperty('players');
    });

    it('should update settings via startGame', () => {
        const settings: GameSettings = {
            length: 'Standard',
            turnDuration: 10,
            players: 1,
            aiPlayers: 0
        };
        useGameStore.getState().startGame(settings);
    });

    it('should toggle UI flags', () => {
        const initial = useGameStore.getState().isSettingsModalOpen;
        useGameStore.getState().toggleSettingsModal();
        expect(useGameStore.getState().isSettingsModalOpen).toBe(!initial);
        // Toggle back
        useGameStore.getState().toggleSettingsModal();
    });

    it('should set game ready', () => {
        useGameStore.getState().setGameReady(true);
        expect(useGameStore.getState().isGameReady).toBe(true);
    });
});
