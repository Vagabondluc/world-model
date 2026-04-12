import { GameState } from '../types';

export const reviveState = (data: any): GameState => {
    const revived = { ...data };

    // Revive Set
    if (Array.isArray(data.revokedEventIds)) {
        revived.revokedEventIds = new Set(data.revokedEventIds);
    } else if (!(data.revokedEventIds instanceof Set)) {
        revived.revokedEventIds = new Set();
    }

    // Revive Map
    if (Array.isArray(data.worldCache)) {
        revived.worldCache = new Map(data.worldCache);
    } else if (data.worldCache && typeof data.worldCache === 'object' && !(data.worldCache instanceof Map)) {
        revived.worldCache = new Map(Object.entries(data.worldCache));
    } else if (!data.worldCache) {
        revived.worldCache = new Map();
    }

    return revived as GameState;
};

export const serializeState = (state: GameState): any => {
    return {
        ...state,
        revokedEventIds: Array.from(state.revokedEventIds),
        worldCache: Array.from(state.worldCache.entries())
    };
};
