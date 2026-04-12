
import { useGameStore } from '../store/gameStore';
import { useCallback } from 'react';
import { PlayerId } from '../types';

export const useDebugActions = () => {
    const dispatch = useGameStore((state) => state.dispatch);
    const activePlayerId = useGameStore((state) => state.activePlayerId);

    const addPower = useCallback((amount: number) => {
        dispatch({
            id: crypto.randomUUID(),
            type: 'POWER_ROLL',
            ts: Date.now(),
            playerId: activePlayerId,
            age: 1, // Placeholder, gathered from store if needed but roll event usually doesn't strictly depend on age for validity
            round: 1,
            turn: 1,
            payload: {
                playerId: activePlayerId,
                result: amount,
                base: amount,
                bonus: 0,
                source: 'DEBUG'
            }
        });
    }, [dispatch, activePlayerId]);

    const advanceEra = useCallback(() => {
        // Ideally get current age from store, but for "Next" we can just dispatch AGE_ADVANCE with a target
        // We need to know current age to advance to next.
        const currentAge = useGameStore.getState().age;
        const nextAge = currentAge + 1;

        if (nextAge > 3) return; // Simple cap based on derivedPlayerState logic seeing only up to 3 for now

        dispatch({
            id: crypto.randomUUID(),
            type: 'AGE_ADVANCE',
            ts: Date.now(),
            playerId: 'SYSTEM',
            age: currentAge,
            round: 1,
            turn: 1,
            payload: {
                to: nextAge
            }
        });
    }, [dispatch]);

    const unlockAllTech = useCallback(() => {
        // There is no "Tech" in the state yet, so this is a placeholder or no-op
        // If there was, we would dispatch an event to unlock them.
        console.warn('Unlock All Tech: Not implemented (No tech system found in store)');
    }, []);

    return {
        addPower,
        advanceEra,
        unlockAllTech
    };
};
