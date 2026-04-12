import { GameEvent, GameState } from '../types';

export const filterNonRevoked = (events: GameEvent[], revokedIds: Set<string>): GameEvent[] => {
    return events.filter(e => !revokedIds.has(e.id));
};

export const filterByTurn = (events: GameEvent[], state: GameState): GameEvent[] => {
    return events.filter(e =>
        e.playerId === state.activePlayerId &&
        e.age === state.age &&
        e.round === state.round &&
        e.turn === state.turn
    );
};

export const filterWorldEvents = (events: GameEvent[]): GameEvent[] => {
    return events.filter(e => e.type.startsWith('WORLD_'));
};

export const filterSystemEvents = (events: GameEvent[]): GameEvent[] => {
    return events.filter(e => !e.type.startsWith('WORLD_'));
};

export const getReverseChronologicalEvents = (events: GameEvent[]): GameEvent[] => {
    return [...events].reverse();
};
