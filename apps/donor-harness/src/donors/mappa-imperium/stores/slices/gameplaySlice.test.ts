
import { createGameplaySlice } from './gameplaySlice';
import { create } from 'zustand';

describe('gameplaySlice', () => {
    let useTestStore: any;

    beforeEach(() => {
        useTestStore = create((set: any, get: any) => ({
            ...createGameplaySlice(set, get)
        }));
    });

    it('should initialize with Era 0', () => {
        const state = useTestStore.getState();
        expect(state.currentEraId).toBe(0);
    });

    it('should advance from Era 0 to Era 1', () => {
        useTestStore.getState().advanceEra();
        const state = useTestStore.getState();
        expect(state.currentEraId).toBe(1);
    });

    it('should advance fully from Era 4 to Era 5', () => {
        useTestStore.setState({ currentEraId: 4 });
        useTestStore.getState().advanceEra();
        const state = useTestStore.getState();
        expect(state.currentEraId).toBe(5);
    });

    it('should advance fully from Era 5 to Era 6', () => {
        useTestStore.setState({ currentEraId: 5 });
        useTestStore.getState().advanceEra();
        const state = useTestStore.getState();
        expect(state.currentEraId).toBe(6);
    });

    it('should transition to "finished" state when advancing from Era 6', () => {
        useTestStore.setState({ currentEraId: 6, gameState: 'playing' });
        useTestStore.getState().advanceEra();
        const state = useTestStore.getState();
        expect(state.gameState).toBe('finished');
        // Era should remain 6 or arguably reset, but logic says if currentEraId === 6 return { gameState: 'finished' }
        expect(state.currentEraId).toBe(6);
    });
});
