import { PlayerId, PlayerRuntimeState } from '../types';

export const createDefaultPlayerRuntimeState = (): PlayerRuntimeState => ({
    currentPower: 0,
    lowPowerBonus: 0,
    lastTurnSpend: 0,
    hasRolledThisTurn: false
});

export const initializePlayerCache = (players: PlayerId[]): Record<PlayerId, PlayerRuntimeState> => {
    const cache: Record<PlayerId, PlayerRuntimeState> = {};
    players.forEach(p => cache[p] = createDefaultPlayerRuntimeState());
    return cache;
};
